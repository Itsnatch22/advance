import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { createRouteHandlerClient } from "@/lib/supabase/route-handler";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const RESEND_API_KEY = process.env.RESEND_API_KEY;

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

const sendSchema = z.object({
  subject: z.string().min(3, "Subject too short"),
  previewText: z.string().optional(),
  htmlContent: z.string().min(10, "Content too short"),
  // Optional — send to a specific batch of emails instead of all active
  recipients: z.array(z.string().email()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Auth — admin only
    const supabase = await createRouteHandlerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: adminRecord, error: adminError } = await admin
      .from("system_admins")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (adminError || !adminRecord) {
      return NextResponse.json({ error: "Forbidden — admins only" }, { status: 403 });
    }

    // Validate body
    const body = await request.json();
    const parsed = sendSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const { subject, previewText, htmlContent, recipients } = parsed.data;

    if (!resend) {
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
    }

    // Fetch recipients — either provided list or all active subscribers
    let emails: string[] = [];

    if (recipients && recipients.length > 0) {
      emails = recipients;
    } else {
      const { data: subs, error: subsError } = await admin
        .from("newsletter_subscriptions")
        .select("email")
        .eq("status", "active");

      if (subsError) throw subsError;
      emails = (subs ?? []).map((s: { email: string }) => s.email);
    }

    if (emails.length === 0) {
      return NextResponse.json({ success: true, sent: 0, message: "No active subscribers" });
    }

    // Resend supports batch sending up to 100 per call
    const BATCH_SIZE = 100;
    let sent = 0;
    let failed = 0;

    for (let i = 0; i < emails.length; i += BATCH_SIZE) {
      const batch = emails.slice(i, i + BATCH_SIZE);

      try {
        await resend.batch.send(
          batch.map((to) => ({
            from: "EaziWage <newsletter@eaziwage.com>",
            to,
            subject,
            html: `<!DOCTYPE html><html><head><meta name="x-apple-disable-message-reformatting"/>${previewText ? `<meta name="description" content="${previewText}"/>` : ''}</head><body>${htmlContent}</body></html>`,
          }))
        );
        sent += batch.length;
      } catch (batchError) {
        console.error(`[newsletter][send] batch ${i / BATCH_SIZE + 1} failed:`, batchError);
        failed += batch.length;
      }
    }

    // Log the send in admin_notifications for audit trail
    await admin.from("admin_notifications").insert({
      type: "system_alert",
      title: `Newsletter sent: ${subject}`,
      message: `Delivered to ${sent} subscribers. ${failed > 0 ? `${failed} failed.` : ""}`,
      metadata: { sent, failed, total: emails.length, subject },
      read: false,
    }).match(() => {}); // non-blocking

    return NextResponse.json({
      success: true,
      sent,
      failed,
      total: emails.length,
    });
  } catch (err) {
    console.error("[newsletter][send] error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}