import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import SubscriptionNotification from "@/emails/SubscriptionNotification";
import { EMAIL_CONFIG } from '@/constants/config';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  const successUrl = `${APP_URL}/?subscribed=confirmed`;
  const errorUrl = `${APP_URL}/?subscribed=invalid`;
  const expiredUrl = `${APP_URL}/?subscribed=expired`;

  if (!token) return NextResponse.redirect(errorUrl);

  if (!/^[0-9a-f]{64}$/i.test(token)) return NextResponse.redirect(errorUrl);

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: subscription, error } = await supabase
      .from("newsletter_subscriptions")
      .select("id, email, status, confirmation_token, subscribed_at")
      .eq("confirmation_token", token)
      .single();

    if (error || !subscription) return NextResponse.redirect(errorUrl);

    if (subscription.status === "active")
      return NextResponse.redirect(successUrl);

    // subscribed_at is set when the subscription row is created (token issue time)
    const tokenIssuedAt = new Date(subscription.subscribed_at);
    const hoursSince = (Date.now() - tokenIssuedAt.getTime()) / (1000 * 60 * 60);
    if (hoursSince > 24) {
      await supabase
        .from("newsletter_subscriptions")
        .delete()
        .eq("id", subscription.id);
      return NextResponse.redirect(expiredUrl);
    }

    const { error: updateError } = await supabase
      .from("newsletter_subscriptions")
      .update({
        status: "active",
        confirmed_at: new Date().toISOString(),
        confirmation_token: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", subscription.id);

    if (updateError) {
      console.error("[newsletter][confirm] update error:", updateError);
      return NextResponse.redirect(errorUrl);
    }

    if (resend) {
      try {
        await resend.emails.send({
                  from: `EaziWage <${EMAIL_CONFIG.NEWSLETTER_SENDER}>`,
          to: subscription.email,
          subject: "Welcome to EaziWage Updates! 🎉",
          react: SubscriptionNotification({ email: subscription.email }),
        });
      } catch (emailError) {
        console.error(
          "[newsletter][confirm] welcome email failed:",
          emailError
        );
      }
    }

    return NextResponse.redirect(successUrl);
  } catch (err) {
    console.error("[newsletter][confirm] error:", err);
    return NextResponse.redirect(errorUrl);
  }
}
