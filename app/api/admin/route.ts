import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { apiLimiter, checkRateLimit } from "@/lib/security/rate-limit";
import { requireAdminWrite } from "@/lib/admin/campaigns";

const RESEND_API_KEY = process.env.RESEND_API_KEY;

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

import { EMAIL_CONFIG } from '@/constants/config';

const DANGEROUS_TAGS =
  /(<(script|iframe|object|embed|base|form)[^>]*>[\s\S]*?<\/\2>|<(script|iframe|object|embed|base|form)[^>]*\/?>)/gi;
const EVENT_ATTRS = /\s+on\w+\s*=\s*("([^"]*)"|'([^']*)'|[^\s>]+)/gi;
const JS_URLS = /(href|src|action)\s*=\s*["']?\s*javascript:[^"'\s>]*/gi;
// Strip data: URIs from href/src attributes (can carry inline scripts/content)
const DATA_URIS = /(href|src)\s*=\s*["']data:[^"']*["']/gi;

function sanitizeHtml(raw: string): string {
  return raw
    .replace(DANGEROUS_TAGS, "")
    .replace(EVENT_ATTRS, "")
    .replace(JS_URLS, "")
    .replace(DATA_URIS, "");
}

const sendSchema = z.object({
  subject: z.string().min(3, "Subject too short"),
  previewText: z.string().optional(),
  htmlContent: z.string().min(10, "Content too short").max(200_000, "Content too large"),
  recipients: z.array(z.string().email()).optional(),
});

export async function POST(request: NextRequest) {
  // Rate limit (admin-gated, generous 100/min from apiLimiter)
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rl = await checkRateLimit(apiLimiter, ip);
  if (!rl.success)
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      { status: 429, headers: rl.headers }
    );

  try {
    const auth = await requireAdminWrite(request);
    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    const { admin } = auth;

    const body = await request.json();
    const parsed = sendSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const { subject, previewText, recipients } = parsed.data;
    const htmlContent = sanitizeHtml(parsed.data.htmlContent);

    if (!resend) {
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

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
      return NextResponse.json({
        success: true,
        sent: 0,
        message: "No active subscribers",
      });
    }

    const BATCH_SIZE = 100;
    let sent = 0;
    let failed = 0;

    for (let i = 0; i < emails.length; i += BATCH_SIZE) {
      const batch = emails.slice(i, i + BATCH_SIZE);

      try {
        await resend.batch.send(
          batch.map((to) => ({
            from: `EaziWage <${EMAIL_CONFIG.NEWSLETTER_SENDER}>`,
            to,
            subject,
            html: `<!DOCTYPE html><html><head><meta name="x-apple-disable-message-reformatting"/>${previewText ? `<meta name="description" content="${previewText}"/>` : ""}</head><body>${htmlContent}</body></html>`,
          }))
        );
        sent += batch.length;
      } catch (batchError) {
        console.error(
          `[newsletter][send] batch ${i / BATCH_SIZE + 1} failed:`,
          batchError
        );
        failed += batch.length;
      }
    }

    const { error: notifyError } = await admin
      .from("admin_notifications")
      .insert({
        type: "system_alert",
        title: `Newsletter sent: ${subject}`,
        message: `Delivered to ${sent} subscribers. ${failed > 0 ? `${failed} failed.` : ""}`,
        metadata: { sent, failed, total: emails.length, subject },
        read: false,
      });
    if (notifyError)
      console.error("[newsletter][send] admin_notifications.insert failed:", notifyError);

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
