import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { createRouteHandlerClient } from "@/lib/supabase/route-handler";
import { apiLimiter, checkRateLimit } from "@/lib/security/rate-limit";
import {
  sanitizeCampaignHtml,
  buildCampaignEmailHtml,
  interpolate,
} from "@/lib/campaigns/utils";
import { EMAIL_CONFIG } from "@/constants/config";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const testSchema = z.object({
  recipient_email: z.string().email().optional(),
  email: z.string().email().optional(),
}).refine((value) => value.recipient_email || value.email, {
  message: "Recipient email is required",
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

export async function POST(
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
    const body = await request.json();
    const parsed = testSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const recipient_email = parsed.data.recipient_email ?? parsed.data.email!;

    // Fetch campaign
    const { data: campaign, error: fetchError } = await admin
      .from("email_campaigns")
      .select("id, subject, html_content")
      .eq("id", id)
      .single();

    if (fetchError || !campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    if (!resend) {
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 503 }
      );
    }

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ?? "https://eaziwage.com";

    // Sanitize, interpolate with "Test User", then wrap in email shell
    const sanitized = sanitizeCampaignHtml(campaign.html_content);
    const personalized = interpolate(sanitized, "Test User");
    const emailHtml = buildCampaignEmailHtml(
      personalized,
      campaign.subject,
      "#", // unsubscribeUrl — placeholder for test
      appUrl
    );

    const { error: sendError } = await resend.emails.send({
      from: `EaziWage Test <${EMAIL_CONFIG.SENDER_ADDRESS}>`,
      to: recipient_email,
      subject: `[TEST] ${campaign.subject}`,
      html: emailHtml,
    });

    if (sendError) {
      console.error("[campaigns/[id]/test][POST] resend error:", sendError);
      return NextResponse.json(
        { error: "Failed to send test email", details: sendError },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Test email sent to ${recipient_email}`,
    });
  } catch (err) {
    console.error("[campaigns/[id]/test][POST] error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
