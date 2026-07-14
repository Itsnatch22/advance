import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { apiLimiter, checkRateLimit } from "@/lib/security/rate-limit";
import { sanitizeCampaignHtml } from "@/lib/campaigns/utils";
import type { CampaignStatus } from "@/types/campaigns";
import { getAuthenticatedAdmin, requireAdminWrite, logCampaignAudit } from "@/lib/admin/campaigns";
import { sendSuccess, sendError } from '@/lib/utils/response';

const updateSchema = z.object({
  subject: z.string().min(3).max(300).optional(),
  title: z.string().min(3).max(300).optional(),
  html_content: z.string().min(10).max(500_000).optional(),
  plain_text_content: z.string().max(500_000).nullable().optional(),
  scheduled_at: z.string().datetime().nullable().optional(),
  template_key: z.string().max(80).nullable().optional(),
  audience_filter: z
    .object({
      segment: z.enum(["all", "active", "recent", "manual"]).default("all"),
      emails: z.array(z.string().email()).max(500).optional(),
    })
    .nullable()
    .optional(),
  ab_test_subject_b: z.string().min(3).max(300).nullable().optional(),
  ab_test_percent: z.number().int().min(0).max(50).optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rl = await checkRateLimit(apiLimiter, ip);
  if (!rl.success)
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      { status: 429, headers: rl.headers }
    );

  const auth = await getAuthenticatedAdmin(request);
  if ("error" in auth)
    return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { user, admin } = auth;
  const { id } = await params;

  try {
    const { data: campaign, error } = await admin
      .from("email_campaigns")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    return NextResponse.json({ campaign });
  } catch (err) {
    console.error("[campaigns/[id]][GET] error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rl = await checkRateLimit(apiLimiter, ip);
  if (!rl.success)
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      { status: 429, headers: rl.headers }
    );

  const auth = await requireAdminWrite(request);
  if ("error" in auth)
    return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { admin, user } = auth;
  const { id } = await params;

  try {
    // Fetch current campaign to check status
    const { data: campaign, error: fetchError } = await admin
      .from("email_campaigns")
      .select("id, status")
      .eq("id", id)
      .single();

    if (fetchError || !campaign) {
      return sendError("Campaign not found", 404);
    }

    const lockedStatuses: CampaignStatus[] = ["sending", "completed", "failed"];
    if (lockedStatuses.includes(campaign.status as CampaignStatus)) {
      return sendError(`Cannot edit a campaign with status "${campaign.status}"`, 409);
    }

    const body = await request.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return sendError("Validation failed", 400, { issues: parsed.error.issues });
    }

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (parsed.data.subject !== undefined) updates.subject = parsed.data.subject;
    if (parsed.data.title !== undefined) updates.title = parsed.data.title;
    if (parsed.data.html_content !== undefined)
      updates.html_content = sanitizeCampaignHtml(parsed.data.html_content);
    if ("plain_text_content" in parsed.data)
      updates.plain_text_content = parsed.data.plain_text_content ?? null;
    if ("scheduled_at" in parsed.data)
      updates.scheduled_at = parsed.data.scheduled_at ?? null;
    if ("template_key" in parsed.data)
      updates.template_key = parsed.data.template_key ?? null;
    if ("audience_filter" in parsed.data)
      updates.audience_filter = parsed.data.audience_filter ?? { segment: "all" };
    if ("ab_test_subject_b" in parsed.data)
      updates.ab_test_subject_b = parsed.data.ab_test_subject_b ?? null;
    if (parsed.data.ab_test_percent !== undefined)
      updates.ab_test_percent = parsed.data.ab_test_percent;
    if ("scheduled_at" in parsed.data) {
      updates.status = parsed.data.scheduled_at ? "scheduled" : "draft";
    }

    const { data: updated, error: updateError } = await admin
      .from("email_campaigns")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (updateError) throw updateError;

    // If scheduled_at was changed, upsert/delete schedule row accordingly
    try {
      if ("scheduled_at" in parsed.data) {
        const newScheduled = parsed.data.scheduled_at ?? null;
        if (newScheduled) {
          // insert or update schedule row
          const upsertRes = await admin
            .from('email_campaign_schedules')
            .upsert({ campaign_id: id, scheduled_at: newScheduled, created_by: user.id }, { onConflict: 'campaign_id' })
            .select()
            .single();
          if (!upsertRes.error && upsertRes.data?.id) {
            await admin
              .from('email_campaigns')
              .update({ scheduled_job_id: upsertRes.data.id })
              .eq('id', id);
          }
        } else {
          // removed schedule -> delete schedule row and clear scheduled_job_id
          await admin.from('email_campaign_schedules').delete().eq('campaign_id', id);
          await admin.from('email_campaigns').update({ scheduled_job_id: null }).eq('id', id);
        }
      }
    } catch (e) {
      console.error('[campaigns][PATCH] schedule upsert/delete failed', e);
    }

    await logCampaignAudit(admin, {
      campaignId: id,
      actorId: user.id,
      action: "campaign_updated",
      metadata: { fields: Object.keys(updates).filter((key) => key !== "updated_at") },
    });

    return sendSuccess({ campaign: updated });
  } catch (err) {
    console.error("[campaigns/[id]][PATCH] error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rl = await checkRateLimit(apiLimiter, ip);
  if (!rl.success)
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      { status: 429, headers: rl.headers }
    );

  const auth = await requireAdminWrite(request);
  if ("error" in auth)
    return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { user, admin } = auth;
  const { id } = await params;

  try {
    const { data: campaign, error: fetchError } = await admin
      .from("email_campaigns")
      .select("id, status")
      .eq("id", id)
      .single();

    if (fetchError || !campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    if (campaign.status !== "draft") {
      return NextResponse.json(
        { error: `Cannot delete a campaign with status "${campaign.status}" — only draft campaigns may be deleted` },
        { status: 409 }
      );
    }

    await logCampaignAudit(admin, {
      campaignId: id,
      actorId: user.id,
      action: "campaign_deleted",
      metadata: { previous_status: campaign.status },
    });

    const { error: deleteError } = await admin
      .from("email_campaigns")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("[campaigns/[id]][DELETE] error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
