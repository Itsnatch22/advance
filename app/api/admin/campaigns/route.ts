import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { createRouteHandlerClient } from "@/lib/supabase/route-handler";
import { apiLimiter, checkRateLimit } from "@/lib/security/rate-limit";
import { sanitizeCampaignHtml } from "@/lib/campaigns/utils";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const createSchema = z.object({
  subject: z.string().min(3).max(300),
  title: z.string().min(3).max(300),
  html_content: z.string().min(10).max(500_000),
  plain_text_content: z.string().max(500_000).optional(),
  scheduled_at: z.string().datetime().optional(),
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

    return NextResponse.json({ campaigns });
  } catch (err) {
    console.error("[campaigns][GET] error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
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

  const auth = await getAuthenticatedAdmin(request);
  if ("error" in auth)
    return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { user, admin } = auth;

  try {
    const body = await request.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const { subject, title, plain_text_content, scheduled_at } = parsed.data;
    const html_content = sanitizeCampaignHtml(parsed.data.html_content);

    const { data: campaign, error } = await admin
      .from("email_campaigns")
      .insert({
        subject,
        title,
        html_content,
        plain_text_content: plain_text_content ?? null,
        scheduled_at: scheduled_at ?? null,
        status: "draft",
        created_by: user.id,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ campaign }, { status: 201 });
  } catch (err) {
    console.error("[campaigns][POST] error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
