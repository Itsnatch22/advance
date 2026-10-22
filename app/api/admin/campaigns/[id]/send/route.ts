import { NextRequest } from "next/server";
import { z } from "zod";
import { apiLimiter, checkRateLimit } from "@/lib/security/rate-limit";
import { sendSuccess, sendError } from "@/lib/utils/response";
import { tasks } from "@trigger.dev/sdk/v3";
import type { CampaignStatus } from "@/types/campaigns";
import { logCampaignAudit, requireAdminWrite } from "@/lib/admin/campaigns";

const sendRequestSchema = z.object({
  list_id: z.string().uuid().optional(),
});

type CampaignAudience = {
  segment?: "all" | "active" | "recent" | "manual";
  emails?: string[];
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rateLimit = await checkRateLimit(apiLimiter, ip);
  if (!rateLimit.success) {
    return sendError(
      "Rate limit exceeded",
      429,
      undefined,
      rateLimit.headers as Record<string, string>
    );
  }

  const auth = await requireAdminWrite(request);
  if ("error" in auth) return sendError(auth.error, auth.status);

  const { user, admin } = auth;
  const { id } = await params;

  try {
    const rawBody = await request.text();
    let body: unknown = {};
    if (rawBody.trim()) {
      try {
        body = JSON.parse(rawBody);
      } catch {
        return sendError("Invalid request body", 400);
      }
    }

    const parsedBody = sendRequestSchema.safeParse(body);
    if (!parsedBody.success) {
      return sendError("Invalid recipient list", 400);
    }

    const { data: campaign, error: campaignError } = await admin
      .from("email_campaigns")
      .select("id, status, audience_filter")
      .eq("id", id)
      .single();

    if (campaignError || !campaign) return sendError("Campaign not found", 404);

    const sendableStatuses: CampaignStatus[] = ["draft", "scheduled"];
    if (!sendableStatuses.includes(campaign.status as CampaignStatus)) {
      return sendError(`Campaign is already ${campaign.status}`, 409);
    }

    let recipients: Array<{ id: string | null; email: string }> | undefined;
    let estimatedRecipients: number;

    if (parsedBody.data.list_id) {
      const { data: members, error: memberError } = await admin
        .from("recipient_list_members")
        .select("email, subscriber_id")
        .eq("list_id", parsedBody.data.list_id);

      if (memberError) throw memberError;
      recipients = (members ?? []).map((member) => ({
        id: member.subscriber_id ?? null,
        email: member.email,
      }));
      estimatedRecipients = recipients.length;
    } else {
      const audience = (campaign.audience_filter ?? {}) as CampaignAudience;
      let countQuery = admin
        .from("newsletter_subscriptions")
        .select("id", { count: "exact", head: true })
        .eq("status", "active")
        .not("confirmed_at", "is", null);

      if (audience.segment === "manual" && audience.emails?.length) {
        countQuery = countQuery.in(
          "email",
          audience.emails.map((email) => email.toLowerCase())
        );
      }
      if (audience.segment === "recent") {
        const since = new Date();
        since.setDate(since.getDate() - 30);
        countQuery = countQuery.gte("created_at", since.toISOString());
      }

      const { count, error: countError } = await countQuery;
      if (countError) throw countError;
      estimatedRecipients = count ?? 0;
    }

    // Task idempotency prevents duplicate enqueues from concurrent API calls
    // and from the scheduler processing the same due schedule at the same time.
    await logCampaignAudit(admin, {
      campaignId: id,
      actorId: user.id,
      action: "campaign_send_requested",
      metadata: {
        estimated_recipients: estimatedRecipients,
        list_override: !!parsedBody.data.list_id,
      },
    });

    await tasks.trigger(
      "send-email-campaign",
      {
        campaign_id: id,
        triggered_by: user.id,
        recipients,
      },
      {
        idempotencyKey: `campaign-send:${id}`,
        idempotencyKeyTTL: "365d",
      }
    );

    return sendSuccess({
      campaign_id: id,
      estimated_recipients: estimatedRecipients,
    });
  } catch (error) {
    console.error("[campaigns/[id]/send][POST] error:", error);
    return sendError("Unable to start campaign send", 500);
  }
}
