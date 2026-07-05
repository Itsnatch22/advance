import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import { contactLimiter, checkRateLimit } from "@/lib/security/rate-limit";
import ContactNotification from "@/emails/ContactNotification";
import ContactAutoReply from "@/emails/ContactAutoReply";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters").max(200),
  message: z
    .string()
    .min(20, "Message must be at least 20 characters")
    .max(2000),
  honeypot: z.string().optional(),
});

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const supabase =
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      )
    : null;

const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || "support@eaziwage.com";

export async function GET() {
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 503 }
    );
  }

  const { count, error } = await supabase
    .from("employers")
    .select("*", { count: "exact", head: true })
    .eq("status", "approved");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ count: count ?? 0 });
}

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const rateLimitResult = await checkRateLimit(contactLimiter, ip);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Please try again later.",
          message: "Too many requests from this IP address",
        },
        {
          status: 429,
          headers: {
            ...rateLimitResult.headers,
          },
        }
      );
    }

    const body = await request.json();

    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          issues: parsed.error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    if (parsed.data.honeypot) {
      console.log(`Bot detected from IP: ${ip}`);
      return NextResponse.json(
        { message: "Message sent successfully" },
        { status: 200 }
      );
    }

    const { name, email, subject, message } = parsed.data;

    if (!resend) {
      console.error("Resend API key not configured");
      return NextResponse.json(
        { error: "Email service is not available. Please try again later." },
        { status: 503 }
      );
    }

    if (supabase) {
      const { error: dbError } = await supabase.from("contacts").insert([
        {
          name,
          email,
          subject,
          message,
          ip_address: ip,
          user_agent: request.headers.get("user-agent") || "unknown",
          submitted_at: new Date().toISOString(),
        },
      ]);

      if (dbError) {
        console.error("[contact/route] contacts.insert failed:", dbError);
      }
    }

    const submittedAt = new Date();

    try {
      await resend.emails.send({
        from: `EaziWage Contact <${SUPPORT_EMAIL}>`,
        to: SUPPORT_EMAIL,
        replyTo: email,
        subject: `[Contact Form] ${subject}`,
        react: ContactNotification({
          name,
          email,
          subject,
          message,
          submittedAt: submittedAt.toLocaleString("en-US", {
            dateStyle: "long",
            timeStyle: "short",
          }),
        }),
      });
    } catch (emailError) {
      console.error("Failed to send notification email:", emailError);
    }

    try {
      await resend.emails.send({
        from: `EaziWage Support <${SUPPORT_EMAIL}>`,
        to: email,
        subject: "We received your message - EaziWage",
        react: ContactAutoReply({
          name,
          subject,
        }),
      });
    } catch (emailError) {
      console.error("Failed to send auto-reply:", emailError);
    }

    return NextResponse.json(
      {
        message: "Message sent successfully",
        success: true,
      },
      {
        status: 200,
        headers: {
          "X-RateLimit-Limit": "5",
          "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
        },
      }
    );
  } catch (error) {
    console.error("Unexpected error in contact form:", error);

    return NextResponse.json(
      {
        error: "An unexpected error occurred. Please try again later.",
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    }
  );
}
