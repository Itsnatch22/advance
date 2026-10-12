import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { escalateLimiter, checkRateLimit } from "@/lib/security/rate-limit";
import { EMAIL_CONFIG } from '@/constants/config';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

const escalateSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  query: z.string().min(1).max(2000),
});

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rl = await checkRateLimit(escalateLimiter, ip);
    if (!rl.success) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429, headers: rl.headers });

    const body = await req.json();
    const parsed = escalateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
    }

    const { name, email, query } = parsed.data;
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeQuery = escapeHtml(query);

    if (!resend) {
      return NextResponse.json({ error: "Email service not configured" }, { status: 503 });
    }

    await resend.emails.send({
          from: `Wiza Chat <${EMAIL_CONFIG.SENDER_ADDRESS}>`,
          to: EMAIL_CONFIG.SUPPORT_EMAIL,
          cc: EMAIL_CONFIG.SUPPORT_CC_EMAILS,
      replyTo: email,
      subject: `Chat escalation from ${safeName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <div style="background: #059669; border-radius: 12px; padding: 20px 24px; margin-bottom: 24px;">
            <h2 style="color: white; margin: 0; font-size: 18px;">New support request via Wiza Chat</h2>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 13px; width: 100px;">Name</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-size: 14px; font-weight: 600;">${safeName}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 13px;">Email</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-size: 14px;"><a href="mailto:${safeEmail}" style="color: #059669;">${safeEmail}</a></td>
            </tr>
          </table>

          <div style="background: #f8fafc; border-left: 4px solid #059669; border-radius: 4px; padding: 16px 20px;">
            <p style="color: #64748b; font-size: 12px; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Their message</p>
            <p style="color: #0f172a; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${safeQuery}</p>
          </div>

          <p style="color: #94a3b8; font-size: 12px; margin-top: 32px; text-align: center;">
            Reply directly to this email to respond to ${safeName}.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[escalate]", err);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
