import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import SubscriptionNotification from "@/emails/SubscriptionNotification";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  // Always redirect — never expose raw errors to the browser
  const successUrl = `${APP_URL}/?subscribed=confirmed`;
  const errorUrl = `${APP_URL}/?subscribed=invalid`;
  const expiredUrl = `${APP_URL}/?subscribed=expired`;

  if (!token) return NextResponse.redirect(errorUrl);

  try {
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    const { data: subscription, error } = await supabase
      .from("newsletter_subscriptions")
      .select("id, email, status, confirmation_token, subscribed_at")
      .eq("confirmation_token", token)
      .single();

    if (error || !subscription) return NextResponse.redirect(errorUrl);

    // Already confirmed
    if (subscription.status === "active") return NextResponse.redirect(successUrl);

    // Check token age — 24 hour expiry
    const subscribedAt = new Date(subscription.subscribed_at);
    const hoursSince = (Date.now() - subscribedAt.getTime()) / (1000 * 60 * 60);
    if (hoursSince > 24) {
      // Clean up expired pending row
      await supabase
        .from("newsletter_subscriptions")
        .delete()
        .eq("id", subscription.id);
      return NextResponse.redirect(expiredUrl);
    }

    // Flip to active — clear token so it can't be reused
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

    // Send welcome email now that they've confirmed
    if (resend) {
      try {
        await resend.emails.send({
          from: "EaziWage <newsletter@eaziwage.com>",
          to: subscription.email,
          subject: "Welcome to EaziWage Updates! 🎉",
          react: SubscriptionNotification({ email: subscription.email }),
        });
      } catch (emailError) {
        console.error("[newsletter][confirm] welcome email failed:", emailError);
        // Don't block the redirect — confirmation succeeded
      }
    }

    return NextResponse.redirect(successUrl);
  } catch (err) {
    console.error("[newsletter][confirm] error:", err);
    return NextResponse.redirect(errorUrl);
  }
}