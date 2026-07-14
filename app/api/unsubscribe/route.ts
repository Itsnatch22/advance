import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { checkRateLimit, rateLimiter } from "@/lib/security/rate-limit";
import { verifyUnsubscribeToken } from "@/server/utils/unsubscribeToken";
import UnsubscribeConfirmation from "@/emails/UnsubscribeConfirmation";
import { EMAIL_CONFIG } from '@/constants/config';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    "[unsubscribe] Missing env vars. Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set."
  );
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://eaziwage.com";

type Body = {
  email: string;
  product: string;
  token: string;
  feedback?: string;
};

async function sendConfirmationEmail(email: string, product: string): Promise<void> {
  if (!resend) {
    console.warn("[unsubscribe] RESEND_API_KEY not set — skipping confirmation email.");
    return;
  }

  const { error } = await resend.emails.send({
  from: `EaziWage <${EMAIL_CONFIG.SENDER_ADDRESS}>`,
    to: email,
    subject: `Unsubscription confirmed`,
    react: UnsubscribeConfirmation({ email, product, resubscribeUrl: APP_URL }),
  });

  if (error) {
    console.error("[unsubscribe] Failed to send confirmation email:", error);
  }
}

const VALID_PRODUCTS = ["newsletter", "partners", "sales", "all"] as const;
type ValidProduct = (typeof VALID_PRODUCTS)[number];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const product = searchParams.get("product");
  const token = searchParams.get("token");

  // Validate all three params are present
  if (!email || !product || !token) {
    return redirect(`${APP_URL}/unsubscribe?error=missing`);
  }

  // Validate token
  if (!verifyUnsubscribeToken(token, email, product)) {
    return redirect(`${APP_URL}/unsubscribe?error=invalid`);
  }

  // Validate product
  if (!VALID_PRODUCTS.includes(product as ValidProduct)) {
    return redirect(`${APP_URL}/unsubscribe?error=invalid`);
  }

  const normalizedEmail = email.trim().toLowerCase();
  const now = new Date().toISOString();

  try {
    // Update newsletter_subscriptions — upsert on email conflict
    const { error: dbError } = await supabase
      .from("newsletter_subscriptions")
      .upsert(
        { email: normalizedEmail, status: "inactive", unsubscribed_at: now },
        { onConflict: "email" }
      )
      .select();

    if (dbError) {
      console.error("[unsubscribe][GET] newsletter_subscriptions upsert error:", dbError);
      return redirect(`${APP_URL}/unsubscribe?error=server`);
    }

    // Fire-and-forget confirmation email
    sendConfirmationEmail(normalizedEmail, product).catch((err) =>
      console.error("[unsubscribe][GET] sendConfirmationEmail threw:", err)
    );

    return redirect(`${APP_URL}/unsubscribe?success=true&product=${encodeURIComponent(product)}`);
  } catch (err) {
    console.error("[unsubscribe][GET] unexpected error:", err);
    return redirect(`${APP_URL}/unsubscribe?error=server`);
  }
}

export async function POST(req: Request) {
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
    const { email, product, token, feedback } = body;

    if (!email || !product || !token) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400, headers: rl.headers }
      );
    }

    if (!verifyUnsubscribeToken(token, email, product)) {
      return NextResponse.json(
        { message: "Invalid or expired unsubscribe link." },
        { status: 401, headers: rl.headers }
      );
    }

    const validProducts = ["newsletter", "partners", "sales", "all"];
    if (!validProducts.includes(product)) {
      return NextResponse.json(
        { message: "Invalid product." },
        { status: 400, headers: rl.headers }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const now = new Date().toISOString();

    if (product === "newsletter" || product === "all") {
      const { error: newsletterError } = await supabase
        .from("newsletter_subscriptions")
        .upsert(
          { email: normalizedEmail, status: "inactive", unsubscribed_at: now },
          { onConflict: "email" }
        )
        .select();

      if (newsletterError) {
        console.error("[unsubscribe] Newsletter table error:", newsletterError);
        return NextResponse.json(
          { message: "Database error. Please try again." },
          { status: 500, headers: rl.headers }
        );
      }
    }

    const { error } = await supabase
      .from("subscriptions")
      .upsert(
        {
          email: normalizedEmail,
          product,
          subscribed: false,
          unsubscribed_at: now,
          feedback: feedback ?? null,
        },
        { onConflict: "email,product" }
      )
      .select();

    if (error && error.code !== "42P01") {
      console.error("[unsubscribe] Supabase error:", error);
      return NextResponse.json(
        { message: "Database error. Please try again." },
        { status: 500, headers: rl.headers }
      );
    }
    if (error?.code === "42P01") {
      console.warn('[unsubscribe] "subscriptions" table not found; skipped legacy preference upsert.');
    }

    sendConfirmationEmail(normalizedEmail, product).catch((err) =>
      console.error("[unsubscribe] sendConfirmationEmail threw:", err)
    );

    return NextResponse.json(
      { message: `You have been unsubscribed from ${product}. A confirmation email will arrive shortly.` },
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
