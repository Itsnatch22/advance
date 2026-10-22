import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { apiLimiter, checkRateLimit } from "@/lib/security/rate-limit";
import { sendSuccess, sendError } from '@/lib/utils/response';
import { tasks } from "@trigger.dev/sdk/v3";
import type { CampaignStatus } from "@/types/campaigns";
import { logCampaignAudit, requireAdminWrite } from "@/lib/admin/campaigns";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rl = await checkRateLimit(apiLimiter, ip);
  if (!rl.success)
    return sendError("Rate limit exceeded", 429, undefined, rl.headers as Record<string,string>);

  const auth = await requireAdminWrite(request);
  if ("error" in auth)
    return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { user, admin } = auth;
  const { id } = await params;

  try {
    // Fetch campaign
    const { data: campaign, error: fetchError } = await admin
      .from("email_campaigns")
      .select("id, status")
      .eq("id", id)
      .single();

    if (fetchError || !campaign) {
      return sendError("Campaign not found", 404);
    }

    const sendableStatuses: CampaignStatus[] = ["draft", "scheduled"];
    if (!sendableStatuses.includes(campaign.status as CampaignStatus)) {
      return sendError(`Campaign is already ${campaign.status}`, 409);
    }

    // Atomically transition to "sending" — guards against double-send race condition
    const { data: transitioned, error: updateError } = await admin
      .from("email_campaigns")
      .update({ status: "sending", updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("status", campaign.status) // only update if status hasn't changed
      .select("id")
      .single();

    if (updateError || !transitioned) {
      return sendError("Campaign send already triggered", 409);
    }

    // Read optional body for recipient list override
    const body = await request.json().catch(() => ({}));
    const { list_id } = body || {};

    let recipientsPayload: Array<{ id: string | null; email: string }> | undefined = undefined;

    if (list_id) {
      // Resolve members for the list
      const { data: members, error: membersErr } = await admin
        .from('recipient_list_members')
        .select('email, subscriber_id')
        .eq('list_id', list_id);
      if (membersErr) {
        return sendError('Failed to resolve recipient list', 500);
      }
      recipientsPayload = (members ?? []).map((m: any) => ({ id: m.subscriber_id ?? null, email: m.email }));
    }

    // Count active confirmed subscribers for the response estimate (only when not using list override)
    let count: number | null = null;
    if (!recipientsPayload) {
      const c = await admin
        .from("newsletter_subscriptions")
        .select("id", { count: "exact", head: true })
        .eq("status", "active")
        .not("confirmed_at", "is", null);
      count = c.count ?? 0;
    } else {
      count = recipientsPayload.length;
    }

    await logCampaignAudit(admin, {
      campaignId: id,
      actorId: user.id,
      action: "campaign_send_requested",
      metadata: { estimated_recipients: count ?? 0, list_override: !!list_id },
    });

    // Do not enqueue any delivery until its audit record has been written.
    await tasks.trigger("send-email-campaign", {
      campaign_id: id,
      triggered_by: user.id,
      recipients: recipientsPayload,
    });

    return sendSuccess({ campaign_id: id, estimated_recipients: count ?? 0 });
  } catch (err) {
    console.error("[campaigns/[id]/send][POST] error:", err);
    // Attempt to roll back the status transition so the campaign isn't stuck in "sending"
    try {
      const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      const { error: rollbackError } = await admin
        .from("email_campaigns")
        .update({ status: "draft", updated_at: new Date().toISOString() })
        .eq("id", id)
        .eq("status", "sending");
      if (rollbackError) {
        console.error("[campaigns/[id]/send][POST] rollback failed:", rollbackError);
      }
    } catch (rollbackErr) {
      console.error("[campaigns/[id]/send][POST] rollback failed:", rollbackErr);
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
