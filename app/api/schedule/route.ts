import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import MeetingConfirmation from "@/emails/MeetingConfirmation";
import { checkRateLimit, rateLimiter } from "@/lib/security/rate-limit";
import { EMAIL_CONFIG } from '@/constants/config';

const ADMIN_EMAIL = EMAIL_CONFIG.SUPPORT_EMAIL;
const SUPPORT_CC_EMAILS = EMAIL_CONFIG.SUPPORT_CC_EMAILS;

const scheduleSchema = z.object({
  userEmail: z.string().trim().refine(
    (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    { message: "Invalid email address" }
  ),
  meetingType: z.enum(["user_to_admin", "sales_demo", "partner_onboarding"]),
  calendlyEventId: z.string().optional(),
  scheduledAt: z.string(),
});

const supabaseAdmin =
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
    : null;

export async function POST(request: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    return NextResponse.json({ error: "Email service unavailable" }, { status: 503 });
  }
  const resend = new Resend(resendApiKey);

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const rl = await checkRateLimit(rateLimiter, `schedule:${ip}`);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: rl.headers }
    );
  }

  try {
    const body = await request.json();
    const validatedData = scheduleSchema.parse(body);

    const scheduledDateObj = new Date(validatedData.scheduledAt);
    if (isNaN(scheduledDateObj.getTime()) || scheduledDateObj <= new Date()) {
      return NextResponse.json(
        { error: "scheduledAt must be a valid future ISO datetime" },
        { status: 400 }
      );
    }

    const { error: dbError } = await supabaseAdmin.from("meeting_logs").insert({
      user_email: validatedData.userEmail,
      admin_email: ADMIN_EMAIL,
      cc_emails: SUPPORT_CC_EMAILS.join(","),
      meeting_type: validatedData.meetingType,
      calendly_event_id: validatedData.calendlyEventId,
      scheduled_at: validatedData.scheduledAt,
    });

    if (dbError) {
      console.error("Supabase error:", dbError);
      throw new Error("Failed to log meeting");
    }

    const scheduledDate = new Date(validatedData.scheduledAt).toLocaleString(
      "en-US",
      {
        dateStyle: "full",
        timeStyle: "short",
      }
    );

    await resend.emails.send({
      from: `EaziWage <${EMAIL_CONFIG.MEETINGS_SENDER}>`,
      to: validatedData.userEmail,
      subject: "Meeting Confirmed - EaziWage",
      react: MeetingConfirmation({
        userEmail: validatedData.userEmail,
        adminEmail: ADMIN_EMAIL,
        meetingType: validatedData.meetingType,
        scheduledAt: scheduledDate,
      }),
    });

    await resend.emails.send({
      from: `EaziWage <${EMAIL_CONFIG.MEETINGS_SENDER}>`,
      to: ADMIN_EMAIL,
      cc: SUPPORT_CC_EMAILS,
      subject: "New Meeting Scheduled - EaziWage",
      react: MeetingConfirmation({
        userEmail: validatedData.userEmail,
        adminEmail: ADMIN_EMAIL,
        meetingType: validatedData.meetingType,
        scheduledAt: scheduledDate,
      }),
    });

    return NextResponse.json({
      success: true,
      message: "Meeting logged and emails sent",
    });
  } catch (error) {
    console.error("Schedule API error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", issues: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
