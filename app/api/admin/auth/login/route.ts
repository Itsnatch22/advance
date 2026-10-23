import { NextRequest } from "next/server";
import { z } from "zod";
import { sendSuccess, sendError } from "@/lib/utils/response";
import { adminLoginLimiter, checkRateLimit } from "@/lib/security/rate-limit";

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY!;

const precheckSchema = z.object({
  email: z.string().email().max(254),
  honeypot: z.string().optional(),
  // Optional so a failed CAPTCHA script does not prevent Supabase Auth from
  // applying its own authentication controls and rate limits.
  recaptchaToken: z.string().min(1).optional().nullable(),
});

/**
 * Pre-authentication bot mitigation only. Supabase Auth verifies credentials
 * and creates the session; system_admins authorizes access to admin resources.
 */
export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-real-ip") ??
      request.headers.get("x-forwarded-for")?.split(",", 1)[0]?.trim() ??
      "anonymous";
    const rateLimitResult = await checkRateLimit(
      adminLoginLimiter,
      `admin:login:${ip}`
    );

    if (!rateLimitResult.success) {
      return sendError(
        "Too many login attempts. Please try again later.",
        429,
        undefined,
        rateLimitResult.headers
      );
    }

    const body = await request.json();
    const { honeypot, recaptchaToken } = precheckSchema.parse(body);

    if (honeypot) {
      return sendError("Invalid request", 400);
    }

    if (recaptchaToken) {
      if (!RECAPTCHA_SECRET_KEY) {
        return sendError("Unable to verify sign-in right now.", 503);
      }
      const recaptchaResponse = await fetch(
        "https://www.google.com/recaptcha/api/siteverify",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            secret: RECAPTCHA_SECRET_KEY,
            response: recaptchaToken,
          }),
        }
      );

      const recaptchaData = await recaptchaResponse.json();

      if (!recaptchaData.success || recaptchaData.score < 0.5) {
        return sendError("reCAPTCHA verification failed", 400);
      }
    } else {
      console.warn(
        "Admin login precheck: no reCAPTCHA token; relying on Supabase Auth rate limits + honeypot"
      );
    }

    return sendSuccess({ ok: true });
  } catch {
    // Avoid logging request/validation details that could contain credentials.
    console.error("Admin login precheck failed");
    return sendError("Invalid request", 400);
  }
}
