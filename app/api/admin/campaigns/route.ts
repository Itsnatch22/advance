import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { apiLimiter, checkRateLimit } from "@/lib/security/rate-limit";
import { sanitizeCampaignHtml } from "@/lib/campaigns/utils";
import {
  getAuthenticatedAdmin,
  requireAdminWrite,
  logCampaignAudit,
} from "@/lib/admin/campaigns";
import { sendSuccess, sendError } from "@/lib/utils/response";

const createSchema = z.object({
  subject: z.string().min(3).max(300),
  title: z.string().min(3).max(300),
  html_content: z.string().min(10).max(500_000),
  plain_text_content: z.string().max(500_000).optional(),
  scheduled_at: z.string().datetime().optional(),
  template_key: z.string().max(80).nullable().optional(),
  audience_filter: z
    .object({
      segment: z.enum(["all", "active", "recent", "manual"]).default("all"),
      emails: z.array(z.string().email()).max(500).optional(),
    })
    .optional(),
  ab_test_subject_b: z.string().min(3).max(300).nullable().optional(),
  ab_test_percent: z.number().int().min(0).max(50).optional(),
});

export async function GET(request: NextRequest) {
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

  const { admin } = auth;

  try {
    const { data: campaigns, error } = await admin
      .from("email_campaigns")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return sendSuccess({ campaigns });
  } catch (err) {
    console.error("[campaigns][GET] error:", err);
    return sendError("Internal error", 500);
  }
}

export async function POST(request: NextRequest) {
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
  let createdCampaignId: string | null = null;
  let createdSchedule = false;

  try {
    const body = await request.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return sendError("Validation failed", 400, {
        issues: parsed.error.issues,
      });
    }
    if (
      parsed.data.scheduled_at &&
      new Date(parsed.data.scheduled_at).getTime() <= Date.now()
    ) {
      return sendError("Scheduled time must be in the future.", 400);
    }

    const {
      subject,
      title,
      plain_text_content,
      scheduled_at,
      template_key,
      audience_filter,
      ab_test_subject_b,
      ab_test_percent,
    } = parsed.data;
    const html_content = sanitizeCampaignHtml(parsed.data.html_content);

    const { data: campaign, error } = await admin
      .from("email_campaigns")
      .insert({
        subject,
        title,
        html_content,
        plain_text_content: plain_text_content ?? null,
        scheduled_at: scheduled_at ?? null,
        status: scheduled_at ? "scheduled" : "draft",
        template_key: template_key ?? null,
        audience_filter: audience_filter ?? { segment: "all" },
        ab_test_subject_b: ab_test_subject_b ?? null,
        ab_test_percent: ab_test_percent ?? 0,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    createdCampaignId = campaign.id;

    // If scheduled_at is a future date, create a schedule row to be picked up by the scheduler
    if (scheduled_at) {
      createdSchedule = true;
      const scheduleRes = await admin
        .from("email_campaign_schedules")
        .insert({
          campaign_id: campaign.id,
          scheduled_at,
          created_by: user.id,
        })
        .select()
        .single();
      if (scheduleRes.error || !scheduleRes.data?.id) {
        throw scheduleRes.error ?? new Error("Schedule row was not created");
      }
      const { error: scheduleReferenceError } = await admin
        .from("email_campaigns")
        .update({ scheduled_job_id: scheduleRes.data.id })
        .eq("id", campaign.id);
      if (scheduleReferenceError) throw scheduleReferenceError;
    }

    await logCampaignAudit(admin, {
      campaignId: campaign.id,
      actorId: user.id,
      action: scheduled_at ? "campaign_scheduled" : "campaign_created",
      metadata: { status: scheduled_at ? "scheduled" : "draft" },
    });

    return sendSuccess({ campaign }, 201);
  } catch (err) {
    console.error("[campaigns][POST] error:", err);
    if (createdCampaignId) {
      if (createdSchedule) {
        const { error: scheduleCleanupError } = await admin
          .from("email_campaign_schedules")
          .delete()
          .eq("campaign_id", createdCampaignId);
        if (scheduleCleanupError) {
          console.error(
            "[campaigns][POST] schedule cleanup failed",
            scheduleCleanupError
          );
        }
      }

      const { error: campaignCleanupError } = await admin
        .from("email_campaigns")
        .delete()
        .eq("id", createdCampaignId);
      if (campaignCleanupError) {
        console.error(
          "[campaigns][POST] campaign cleanup failed",
          campaignCleanupError
        );
      }
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
