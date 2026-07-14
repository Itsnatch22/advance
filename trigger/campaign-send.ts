import { task, logger } from "@trigger.dev/sdk/v3";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { makeUnsubscribeToken } from "@/server/utils/unsubscribeToken";
import {
  sanitizeCampaignHtml,
  interpolate,
  buildCampaignEmailHtml,
} from "@/lib/campaigns/utils";
import { EMAIL_CONFIG } from "@/constants/config";

const BATCH_SIZE = 100;

export const sendEmailCampaign = task({
  id: "send-email-campaign",
  maxDuration: 600,

  run: async (payload: { campaign_id: string; triggered_by: string; recipients?: Array<{ id: string | null; email: string }> }) => {
    const startedAt = Date.now();
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const resend = new Resend(process.env.RESEND_API_KEY!);
    const APP_URL =
      process.env.NEXT_PUBLIC_APP_URL ?? "https://eaziwage.com";

    logger.info("Starting campaign send", {
      campaign_id: payload.campaign_id,
      triggered_by: payload.triggered_by,
    });

    // 1. Lock campaign. The API route may already have transitioned it to
    // "sending" before enqueueing this job, so accept that as the lock state.
    let { data: campaign, error: lockError } = await supabase
      .from("email_campaigns")
      .update({ status: "sending" })
      .in("status", ["draft", "scheduled"])
      .eq("id", payload.campaign_id)
      .select()
      .single();

    if (lockError || !campaign) {
      const { data: lockedCampaign, error: fetchLockedError } = await supabase
        .from("email_campaigns")
        .select()
        .eq("id", payload.campaign_id)
        .eq("status", "sending")
        .single();

      if (fetchLockedError || !lockedCampaign) {
        throw new Error(
          `Campaign ${payload.campaign_id} not in sendable state or already locked`
        );
      }
      campaign = lockedCampaign;
    }

    logger.info("Campaign locked for sending", {
      campaign_id: campaign.id,
      subject: campaign.subject,
    });

    // 2. Resolve recipients: either from payload override or from campaign audience_filter
    let subscribers: Array<{ id: string | null; email: string }> = [];

    if (Array.isArray(payload.recipients) && payload.recipients.length > 0) {
      subscribers = payload.recipients;
    } else {
      const audience = (campaign.audience_filter ?? { segment: "all" }) as {
        segment?: string;
        emails?: string[];
      };

      let subscriberQuery = supabase
        .from("newsletter_subscriptions")
        .select("id, email")
        .eq("status", "active")
        .not("confirmed_at", "is", null);

      if (audience.segment === "manual" && audience.emails?.length) {
        subscriberQuery = subscriberQuery.in(
          "email",
          audience.emails.map((email) => email.toLowerCase())
        );
      }
      if (audience.segment === "recent") {
        const since = new Date();
        since.setDate(since.getDate() - 30);
        subscriberQuery = subscriberQuery.gte("created_at", since.toISOString());
      }

      const { data: subsData, error: subError } = await subscriberQuery;

      if (subError) {
        throw new Error(`Failed to fetch subscribers: ${subError.message}`);
      }

      subscribers = (subsData ?? []).map((s: any) => ({ id: s.id ?? null, email: s.email }));
    }

    const total = subscribers.length;

    // 3. Update total_recipients on the campaign row
    await supabase
      .from("email_campaigns")
      .update({ total_recipients: total })
      .eq("id", payload.campaign_id);

    logger.info("Subscriber count resolved", { total });

    // 4. Handle empty subscriber list
    if (total === 0) {
      await supabase
        .from("email_campaigns")
        .update({
          status: "completed",
          sent_count: 0,
          failed_count: 0,
          sent_at: new Date().toISOString(),
        })
        .eq("id", payload.campaign_id);

      logger.info("No subscribers — campaign marked completed with 0 sends");
      return { sent: 0, failed: 0, total: 0 };
    }

    // 5. Fetch profiles for personalization
    const emailList = subscribers.map((s) => s.email);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("email, full_name")
      .in("email", emailList);

    const profileMap = new Map(
      (profiles ?? []).map((p) => [p.email, p.full_name as string | null])
    );

    // 6. Process in batches of BATCH_SIZE
    let sentCount = 0;
    let failedCount = 0;

    // Defense-in-depth: sanitize the stored HTML before building each email
    const sanitizedBase = sanitizeCampaignHtml(campaign.html_content);

    for (let offset = 0; offset < total; offset += BATCH_SIZE) {
      const batch = subscribers.slice(offset, offset + BATCH_SIZE);

      logger.info("Processing batch", {
        batchStart: offset,
        batchSize: batch.length,
      });

      // a. Pre-insert log entries with status "queued"
      await supabase.from("email_campaign_logs").insert(
        batch.map((sub) => ({
          campaign_id: payload.campaign_id,
          recipient_email: sub.email,
          subscriber_id: sub.id,
          delivery_status: "queued",
        }))
      );

      // b. Build personalized emails for each subscriber
      const emailsToSend = batch.map((sub) => {
        const fullName = profileMap.get(sub.email) ?? null;
        const personalizedHtml = interpolate(sanitizedBase, fullName);
        const token = makeUnsubscribeToken(sub.email, "newsletter");
        const unsubscribeUrl = `${APP_URL}/api/unsubscribe?email=${encodeURIComponent(
          sub.email
        )}&product=newsletter&token=${token}`;
        const html = buildCampaignEmailHtml(
          personalizedHtml,
          campaign.subject,
          unsubscribeUrl,
          APP_URL
        );
        return { to: sub.email, html };
      });

      // c. Send batch via Resend and update logs
      try {
        const batchResult = await resend.batch.send(
          emailsToSend.map((e, index) => ({
            from: `EaziWage <${EMAIL_CONFIG.NEWSLETTER_SENDER}>`,
            to: e.to,
            subject:
              campaign.ab_test_subject_b &&
              campaign.ab_test_percent > 0 &&
              (offset + index) % 100 < campaign.ab_test_percent
                ? campaign.ab_test_subject_b
                : campaign.subject,
            html: e.html,
          }))
        );

        // d. Update log entries to "sent" with provider message IDs
        const sentAt = new Date().toISOString();
        const resultData = batchResult.data?.data ?? [];

        await Promise.all(
          batch.map((sub, idx) => {
            const providerMessageId = resultData[idx]?.id ?? null;
            return supabase
              .from("email_campaign_logs")
              .update({
                delivery_status: "sent",
                provider_message_id: providerMessageId,
                sent_at: sentAt,
              })
              .eq("campaign_id", payload.campaign_id)
              .eq("recipient_email", sub.email);
          })
        );

        sentCount += batch.length;
        logger.info("Batch sent successfully", {
          batchStart: offset,
          batchSize: batch.length,
        });
      } catch (batchErr) {
        const errorMessage =
          batchErr instanceof Error ? batchErr.message : String(batchErr);

        logger.error("Batch failed", { batchStart: offset, errorMessage });

        // Update all in batch to "failed"
        await supabase
          .from("email_campaign_logs")
          .update({
            delivery_status: "failed",
            error_message: errorMessage,
          })
          .eq("campaign_id", payload.campaign_id)
          .in(
            "recipient_email",
            batch.map((s) => s.email)
          );

        failedCount += batch.length;
      }

      // e. Update running counts on the campaign row after each batch
      await supabase
        .from("email_campaigns")
        .update({ sent_count: sentCount, failed_count: failedCount })
        .eq("id", payload.campaign_id);
    }

    // 7. Finalize campaign
    const finalStatus = sentCount > 0 ? "completed" : "failed";
    await supabase
      .from("email_campaigns")
      .update({
        status: finalStatus,
        sent_count: sentCount,
        failed_count: failedCount,
        sent_at: new Date().toISOString(),
      })
      .eq("id", payload.campaign_id);

    const durationMs = Date.now() - startedAt;
    logger.info("Campaign send complete", {
      campaign_id: payload.campaign_id,
      sent: sentCount,
      failed: failedCount,
      total,
      status: finalStatus,
      durationMs,
    });

    // Write an admin audit log for this send action (if triggered_by/admin id provided)
    try {
      const { logAdminAction } = await import("@/lib/admin/audit");
      await logAdminAction(payload.triggered_by ?? null, "campaign.send", {
        objectType: "campaign",
        objectId: payload.campaign_id,
        meta: { sent: sentCount, failed: failedCount, total, status: finalStatus, durationMs },
      });
    } catch (e) {
      logger.warn("Failed to write admin audit log", { error: String(e) });
    }

    return { sent: sentCount, failed: failedCount, total, durationMs };
  },
});
