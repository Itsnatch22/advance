// app/api/subscription/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import SubscriptionNotification from "@/emails/SubscriptionNotification";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;

function getSupabaseClient() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return null;
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

const subscriptionSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .transform((value) => value.toLowerCase()),
  honeypot: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error("Subscription route misconfigured: missing Supabase env vars");
      return NextResponse.json(
        { error: "Subscription service is temporarily unavailable." },
        { status: 500 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body. Expected JSON payload." },
        { status: 400 }
      );
    }

    const validationResult = subscriptionSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          issues: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { email, honeypot } = validationResult.data;

    if (honeypot) {
      console.log("Bot detected, ignoring submission");
      return NextResponse.json({ message: "Subscription successful" }, { status: 200 });
    }

    // Case-insensitive lookup protects against legacy mixed-case rows.
    const { data: existingRows, error: checkError } = await supabase
      .from("newsletter_subscriptions")
      .select("email, status")
      .ilike("email", email)
      .limit(1);

    if (checkError) {
      console.error("Error checking subscription:", checkError);
      throw new Error("Database error");
    }

    const existingSubscription = existingRows?.[0];

    if (existingSubscription) {
      if (existingSubscription.status === "active") {
        return NextResponse.json(
          { error: "This email is already subscribed to our newsletter" },
          { status: 400 }
        );
      }

      const { error: updateError } = await supabase
        .from("newsletter_subscriptions")
        .update({
          status: "active",
          subscribed_at: new Date().toISOString(),
          unsubscribed_at: null,
        })
        .ilike("email", email);

      if (updateError) {
        console.error("Error reactivating subscription:", updateError);
        throw new Error("Failed to reactivate subscription");
      }
    } else {
      const { error: insertError } = await supabase.from("newsletter_subscriptions").insert({
        email,
        status: "active",
        subscribed_at: new Date().toISOString(),
        source: "website_footer",
      });

      if (insertError) {
        if (insertError.code === "23505") {
          // Unique-constraint race from concurrent requests.
          return NextResponse.json(
            { error: "This email is already subscribed to our newsletter" },
            { status: 400 }
          );
        }
        console.error("Error creating subscription:", insertError);
        throw new Error("Failed to create subscription");
      }
    }

    if (resend) {
      try {
        await resend.emails.send({
          from: "EaziWage <newsletter@eaziwage.com>",
          to: email,
          subject: "Welcome to EaziWage Newsletter!",
          react: SubscriptionNotification({ email }),
        });
      } catch (emailError) {
        console.error("Error sending welcome email:", emailError);
      }
    } else {
      console.warn("RESEND_API_KEY is missing; welcome email not sent.");
    }

    return NextResponse.json(
      {
        message: "Successfully subscribed to newsletter",
        email,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json(
      {
        error: "An unexpected error occurred. Please try again later.",
      },
      { status: 500 }
    );
  }
}