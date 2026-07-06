import { task, logger } from "@trigger.dev/sdk/v3";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { makeUnsubscribeToken } from "@/server/utils/unsubscribeToken";
import {
  sanitizeCampaignHtml,
  interpolate,
  buildCampaignEmailHtml,
} from "@/lib/campaigns/utils";

const BATCH_SIZE = 100;

export const sendEmailCampaign = task({
  id: "send-email-campaign",
  maxDuration: 600,

  run: async (payload: { campaign_id: string; triggered_by: string }) => {
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

    // 1. Lock campaign — atomically transition from "draft"/"scheduled" to "sending"
    const { data: campaign, error: lockError } = await supabase
      .from("email_campaigns")
      .update({ status: "sending" })
      .in("status", ["draft", "scheduled"])
      .eq("id", payload.campaign_id)
      .select()
      .single();

    if (lockError || !campaign) {
      throw new Error(
        `Campaign ${payload.campaign_id} not in sendable state or already locked`
      );
    }

    logger.info("Campaign locked for sending", {
      campaign_id: campaign.id,
      subject: campaign.subject,
    });

    // 2. Fetch active confirmed subscribers
    const { data: subscribers, error: subError } = await supabase
      .from("newsletter_subscriptions")
      .select("id, email")
      .eq("status", "active")
      .not("confirmed_at", "is", null);

    if (subError) {
      throw new Error(`Failed to fetch subscribers: ${subError.message}`);
    }

    const total = subscribers?.length ?? 0;

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
    const emailList = subscribers!.map((s) => s.email);
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
      const batch = subscribers!.slice(offset, offset + BATCH_SIZE);

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
          emailsToSend.map((e) => ({
            from: "EaziWage <newsletter@eaziwage.com>",
            to: e.to,
            subject: campaign.subject,
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

    logger.info("Campaign send complete", {
      campaign_id: payload.campaign_id,
      sent: sentCount,
      failed: failedCount,
      total,
      status: finalStatus,
    });

    return { sent: sentCount, failed: failedCount, total };
  },
});
