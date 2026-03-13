import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import MeetingConfirmation from "@/emails/MeetingConfirmation";

const scheduleSchema = z.object({
  userEmail: z.string().email(),
  adminEmail: z.string().email(),
  meetingType: z.enum(["admin_to_user", "user_to_admin"]),
  calendlyEventId: z.string().optional(),
  scheduledAt: z.string(), // ISO string
});

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = scheduleSchema.parse(body);

    // 1. Log to Supabase
    const { error: dbError } = await supabaseAdmin.from("meeting_logs").insert({
      user_email: validatedData.userEmail,
      admin_email: validatedData.adminEmail,
      meeting_type: validatedData.meetingType,
      calendly_event_id: validatedData.calendlyEventId,
      scheduled_at: validatedData.scheduledAt,
    });

    if (dbError) {
      console.error("Supabase error:", dbError);
      throw new Error("Failed to log meeting");
    }

    // 2. Send confirmation emails
    const scheduledDate = new Date(validatedData.scheduledAt).toLocaleString(
      "en-US",
      {
        dateStyle: "full",
        timeStyle: "short",
      }
    );

    // Email to User
    await resend.emails.send({
      from: "EaziWage <meetings@eaziwage.com>",
      to: validatedData.userEmail,
      subject: "Meeting Confirmed - EaziWage",
      react: MeetingConfirmation({
        userEmail: validatedData.userEmail,
        adminEmail: validatedData.adminEmail,
        meetingType: validatedData.meetingType,
        scheduledAt: scheduledDate,
      }),
    });

    // Email to Admin
    await resend.emails.send({
      from: "EaziWage <meetings@eaziwage.com>",
      to: validatedData.adminEmail,
      subject: "New Meeting Scheduled - EaziWage",
      react: MeetingConfirmation({
        userEmail: validatedData.userEmail,
        adminEmail: validatedData.adminEmail,
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
