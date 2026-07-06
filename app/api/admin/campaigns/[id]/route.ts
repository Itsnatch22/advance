import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { createRouteHandlerClient } from "@/lib/supabase/route-handler";
import { apiLimiter, checkRateLimit } from "@/lib/security/rate-limit";
import { sanitizeCampaignHtml } from "@/lib/campaigns/utils";
import type { CampaignStatus } from "@/types/campaigns";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const updateSchema = z.object({
  subject: z.string().min(3).max(300).optional(),
  title: z.string().min(3).max(300).optional(),
  html_content: z.string().min(10).max(500_000).optional(),
  plain_text_content: z.string().max(500_000).nullable().optional(),
  scheduled_at: z.string().datetime().nullable().optional(),
});

async function getAuthenticatedAdmin(request: NextRequest) {
  const supabase = await createRouteHandlerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) return { error: "Unauthorized", status: 401 as const };

  const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const { data: adminRecord, error: adminError } = await admin
    .from("system_admins")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (adminError || !adminRecord) {
    return { error: "Forbidden — admins only", status: 403 as const };
  }

  return { user, admin };
}

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

  const { admin } = auth;
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

  const auth = await getAuthenticatedAdmin(request);
  if ("error" in auth)
    return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { admin } = auth;
  const { id } = await params;

  try {
    // Fetch current campaign to check status
    const { data: campaign, error: fetchError } = await admin
      .from("email_campaigns")
      .select("id, status")
      .eq("id", id)
      .single();

    if (fetchError || !campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    const lockedStatuses: CampaignStatus[] = ["sending", "completed", "failed"];
    if (lockedStatuses.includes(campaign.status as CampaignStatus)) {
      return NextResponse.json(
        { error: `Cannot edit a campaign with status "${campaign.status}"` },
        { status: 409 }
      );
    }

    const body = await request.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.issues },
        { status: 400 }
      );
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

    const { data: updated, error: updateError } = await admin
      .from("email_campaigns")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json({ campaign: updated });
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

  const auth = await getAuthenticatedAdmin(request);
  if ("error" in auth)
    return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { admin } = auth;
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
