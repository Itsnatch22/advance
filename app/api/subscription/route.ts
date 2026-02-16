// app/api/subscription/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { SubscriptionNotification } from "@/emails/SubscriptionNotification";

// Initialize clients
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

// Validation schema
const subscriptionSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  honeypot: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
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

    // Bot detection
    if (honeypot) {
      console.log("Bot detected, ignoring submission");
      return NextResponse.json(
        { message: "Subscription successful" },
        { status: 200 }
      );
    }

    // Check if email already exists
    const { data: existingSubscription, error: checkError } = await supabase
      .from("newsletter_subscriptions")
      .select("email, status")
      .eq("email", email)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 is "not found" error, which is fine
      console.error("Error checking subscription:", checkError);
      throw new Error("Database error");
    }

    // If already subscribed
    if (existingSubscription) {
      if (existingSubscription.status === "active") {
        return NextResponse.json(
          { error: "This email is already subscribed to our newsletter" },
          { status: 400 }
        );
      }
      
      // Reactivate if previously unsubscribed
      const { error: updateError } = await supabase
        .from("newsletter_subscriptions")
        .update({
          status: "active",
          subscribed_at: new Date().toISOString(),
        })
        .eq("email", email);

      if (updateError) {
        console.error("Error reactivating subscription:", updateError);
        throw new Error("Failed to reactivate subscription");
      }
    } else {
      // Create new subscription
      const { error: insertError } = await supabase
        .from("newsletter_subscriptions")
        .insert({
          email,
          status: "active",
          subscribed_at: new Date().toISOString(),
          source: "website_footer",
        });

      if (insertError) {
        console.error("Error creating subscription:", insertError);
        throw new Error("Failed to create subscription");
      }
    }

    // Send welcome email
    try {
      await resend.emails.send({
        from: "EaziWage <newsletter@eaziwage.com>",
        to: email,
        subject: "Welcome to EaziWage Newsletter! 🎉",
        react: SubscriptionNotification({ email }),
      });
    } catch (emailError) {
      console.error("Error sending welcome email:", emailError);
      // Don't fail the subscription if email fails
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