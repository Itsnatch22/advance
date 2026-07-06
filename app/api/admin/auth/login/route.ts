import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { adminLoginLimiter, checkRateLimit } from "@/lib/security/rate-limit";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY!;

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  honeypot: z.string().optional(),
  recaptchaToken: z.string().min(1, "reCAPTCHA token is required"),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") ?? "anonymous";
    const rateLimitResult = await checkRateLimit(adminLoginLimiter, `admin:login:${ip}`);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429, headers: rateLimitResult.headers }
      );
    }

    const body = await request.json();
    const { email, password, honeypot, recaptchaToken } = loginSchema.parse(body);

    // Honeypot check
    if (honeypot) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // reCAPTCHA verification
    const recaptchaResponse = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: RECAPTCHA_SECRET_KEY,
        response: recaptchaToken,
      }),
    });

    const recaptchaData = await recaptchaResponse.json();
    console.log("reCAPTCHA response:", recaptchaData);

    if (!recaptchaData.success || recaptchaData.score < 0.5) {
      return NextResponse.json({ error: "reCAPTCHA verification failed" }, { status: 400 });
    }

    // Verify password
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Check if email exists in system_admins
    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data: adminRecord, error: adminError } = await admin
      .from("system_admins")
      .select("id, email")
      .eq("email", email)
      .single();

    console.log("Admin check:", { adminRecord, adminError });

    if (adminError || !adminRecord) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Create response with session cookie
    const response = NextResponse.json({ success: true });
    
    // Set secure session cookie
    response.cookies.set("admin_session", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/admin",
    });

    return response;
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
