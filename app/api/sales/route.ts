import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import SalesNotification from "@/emails/SalesNotification";
import { checkRateLimit, rateLimiter } from "@/lib/rate-limit"; // ← Using provided file

const salesSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().min(3),
  message: z.string().min(20),
  honeypot: z.string().optional(),
  recaptchaToken: z.string().min(1, "reCAPTCHA token is required"),
});

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "anonymous";

  // Rate limiting from provided file
  const rateLimitResult = await checkRateLimit(rateLimiter, `sales:${ip}`);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please try again later." },
      { status: 429, headers: rateLimitResult.headers }
    );
  }

  try {
    const data = await request.json();
    const validatedData = salesSchema.parse(data);

    if (validatedData.honeypot) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // reCAPTCHA verification
    const recaptchaResponse = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_KEY!,
        response: validatedData.recaptchaToken,
        remoteip: ip,
      }),
    });

    const recaptchaData = await recaptchaResponse.json();

    if (!recaptchaData.success || (recaptchaData.score && recaptchaData.score < 0.5)) {
      return NextResponse.json(
        { error: "reCAPTCHA verification failed. Please try again." },
        { status: 400 }
      );
    }

    // Insert into Supabase
    const { error: dbError } = await supabaseAdmin
      .from("sales_leads")
      .insert({
        name: validatedData.name,
        email: validatedData.email,
        company: validatedData.company,
        message: validatedData.message,
      });

    if (dbError) {
      throw new Error(dbError.message);
    }

    // Send email notification
    await resend.emails.send({
      from: "sales@contact.eaziwage.com",
      to: "admin@eaziwage.com",
      subject: "New Sales Lead",
      react: SalesNotification({
        name: validatedData.name,
        email: validatedData.email,
        company: validatedData.company,
        message: validatedData.message,
      }),
    });

    return NextResponse.json({ message: "Request submitted successfully" }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ issues: error.issues }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}