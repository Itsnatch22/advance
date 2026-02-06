// app/api/sales/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { Resend } from "resend";
import SalesNotification from "@/emails/SalesNotification"; // Adjust path as needed

const salesSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().min(3),
  message: z.string().min(20),
  honeypot: z.string().optional(),
});

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "10 m"), // 5 requests per 10 minutes
  analytics: true,
});

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "anonymous";
  const { success, limit, reset, remaining } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const data = await request.json();
    const validatedData = salesSchema.parse(data);

    if (validatedData.honeypot) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
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
      from: "sales@eaziwage.com",
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