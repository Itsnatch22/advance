// app/api/unsubscribe/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import { checkRateLimit, rateLimiter } from "@/lib/rate-limit";

// ─── Env validation ──────────────────────────────────────────────────────────

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const UNSUBSCRIBE_SECRET = process.env.UNSUBSCRIBE_SECRET!;
const RESEND_API_KEY = process.env.RESEND_API_KEY!; // or any email provider

const CONFIRMATION_DELAY_DAYS = parseInt(
  process.env.UNSUBSCRIBE_CONFIRMATION_DELAY_DAYS ?? "3",
  10
);

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !UNSUBSCRIBE_SECRET) {
  console.warn(
    "[unsubscribe] Missing env vars. Ensure SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and UNSUBSCRIBE_SECRET are set."
  );
}

// ─── Supabase ─────────────────────────────────────────────────────────────────

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ─── Types ───────────────────────────────────────────────────────────────────

type Body = {
  email: string;
  product: string;
  feedback?: string;
  token?: string;
};

// ─── HMAC helpers ─────────────────────────────────────────────────────────────

function computeHmac(email: string, product: string, expiry: string): string {
  return crypto
    .createHmac("sha256", UNSUBSCRIBE_SECRET)
    .update(`${email}|${product}|${expiry}`)
    .digest("hex");
}

function verifyToken(
  token: string | undefined,
  email: string,
  product: string
): boolean {
  if (!token) return false;

  const parts = token.split(":");
  if (parts.length !== 2) return false;

  const [expiryStr, hmac] = parts;
  const expiry = parseInt(expiryStr, 10);
  if (Number.isNaN(expiry)) return false;

  const now = Math.floor(Date.now() / 1000);
  if (now > expiry) return false;

  const expected = computeHmac(email, product, expiryStr);
  try {
    const a = Buffer.from(expected, "utf8");
    const b = Buffer.from(hmac, "utf8");
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

// ─── Email sender ────────────────────────────────────────────────────────────

/**
 * Sends a confirmation email after CONFIRMATION_DELAY_DAYS days.
 * Uses Resend (https://resend.com) — swap the fetch call for your own provider
 * (SendGrid, Postmark, SES, etc.) as needed.
 *
 * If you prefer not to schedule, you can remove the `scheduledAt` field and
 * the email will fire immediately instead.
 */
async function scheduleConfirmationEmail(
  email: string,
  product: string
): Promise<void> {
  if (!RESEND_API_KEY) {
    console.warn("[unsubscribe] RESEND_API_KEY not set — skipping confirmation email.");
    return;
  }

  const sendAt = new Date(
    Date.now() + CONFIRMATION_DELAY_DAYS * 24 * 60 * 60 * 1000
  );

  const productLabel: Record<string, string> = {
    newsletter: "Newsletter",
    partners: "Partner Emails",
    sales: "Sales & Leads",
    all: "All EaziWage Emails",
  };
  const label = productLabel[product] ?? product;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "EaziWage <noreply@eaziwage.com>",
      to: email,
      subject: `You've been unsubscribed from ${label}`,
      // scheduled_at is an ISO-8601 string; Resend will deliver at this time.
      scheduled_at: sendAt.toISOString(),
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
          </head>
          <body style="font-family:'DM Sans',Arial,sans-serif;background:#f9fafb;margin:0;padding:40px 16px;">
            <table align="center" width="520" cellpadding="0" cellspacing="0"
              style="background:#fff;border:1px solid #e8e8f0;border-radius:16px;overflow:hidden">
              <tr>
                <td style="background:#16a34a;padding:20px 32px;">
                  <span style="font-family:Georgia,serif;font-size:22px;font-weight:800;color:#fff;letter-spacing:-0.3px">
                    EaziWage
                  </span>
                </td>
              </tr>
              <tr>
                <td style="padding:32px;">
                  <h2 style="font-family:Georgia,serif;font-size:24px;color:#1a1a2e;margin:0 0 12px">
                    Unsubscription confirmed ✓
                  </h2>
                  <p style="font-size:15px;color:#4a4a6a;line-height:1.6;margin:0 0 16px">
                    Hi there,
                  </p>
                  <p style="font-size:15px;color:#4a4a6a;line-height:1.6;margin:0 0 16px">
                    This is a confirmation that <strong>${email}</strong> has been unsubscribed
                    from <strong>${label}</strong>. You won't receive any more of these emails.
                  </p>
                  <p style="font-size:15px;color:#4a4a6a;line-height:1.6;margin:0 0 24px">
                    Changed your mind? You can always re-subscribe from our website.
                  </p>
                  <a href="https://eaziwage.com"
                    style="display:inline-block;background:#16a34a;color:#fff;padding:11px 22px;
                      border-radius:8px;font-size:15px;font-weight:600;text-decoration:none">
                    Visit EaziWage
                  </a>
                </td>
              </tr>
              <tr>
                <td style="padding:16px 32px;border-top:1px solid #e8e8f0;font-size:12px;color:#8888aa;">
                  © ${new Date().getFullYear()} EaziWage ·
                  <a href="https://eaziwage.com/data.pdf" style="color:#8888aa">Privacy</a> ·
                  <a href="https://eaziwage.com/terms.pdf" style="color:#8888aa">Terms</a>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
      text: `
You've been unsubscribed from ${label}.

This confirms that ${email} has been removed from ${label}. You won't receive any more of these emails.

Changed your mind? Visit https://eaziwage.com to re-subscribe.

© ${new Date().getFullYear()} EaziWage
      `.trim(),
    }),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => "(no body)");
    console.error("[unsubscribe] Failed to schedule confirmation email:", err);
  }
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  // ── Rate limiting ──
  // Use the requester's IP as the rate-limit key.
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const rl = await checkRateLimit(rateLimiter, `unsubscribe:${ip}`);

  if (!rl.success) {
    return NextResponse.json(
      { message: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          ...rl.headers,
          "Retry-After": Math.ceil((rl.reset - Date.now()) / 1000).toString(),
        },
      }
    );
  }

  try {
    const body: Body = await req.json();
    const { email, product, feedback, token } = body;

    // ── Basic validation ──
    if (!email || !product) {
      return NextResponse.json(
        { message: "Missing email or product." },
        { status: 400, headers: rl.headers }
      );
    }

    const validProducts = ["newsletter", "partners", "sales", "all"];
    if (!validProducts.includes(product)) {
      return NextResponse.json(
        { message: "Invalid product." },
        { status: 400, headers: rl.headers }
      );
    }

    // ── Token verification ──
    if (!verifyToken(token, email, product)) {
      return NextResponse.json(
        { message: "Invalid or expired unsubscribe link. Please request a new one." },
        { status: 401, headers: rl.headers }
      );
    }

    const now = new Date().toISOString();

    // ── Upsert subscription row ──
    const { error } = await supabase
      .from("subscriptions")
      .upsert(
        {
          email,
          product,
          subscribed: false,
          unsubscribed_at: now,
          feedback: feedback ?? null,
        },
        { onConflict: "email,product" }
      )
      .select();

    if (error) {
      console.error("[unsubscribe] Supabase error:", error);
      return NextResponse.json(
        { message: "Database error. Please try again." },
        { status: 500, headers: rl.headers }
      );
    }

    // ── Schedule confirmation email ──
    // Fire-and-forget — don't block the response on email delivery.
    scheduleConfirmationEmail(email, product).catch((err) =>
      console.error("[unsubscribe] scheduleConfirmationEmail threw:", err)
    );

    return NextResponse.json(
      {
        message: `You have been unsubscribed from ${product}. A confirmation email will arrive within ${CONFIRMATION_DELAY_DAYS} day${CONFIRMATION_DELAY_DAYS !== 1 ? "s" : ""}.`,
      },
      { status: 200, headers: rl.headers }
    );
  } catch (err) {
    console.error("[unsubscribe] Unexpected error:", err);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}