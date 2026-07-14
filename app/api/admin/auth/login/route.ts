import { NextRequest } from "next/server";
import { z } from "zod";
import { sendSuccess, sendError } from "@/lib/utils/response";
import { adminLoginLimiter, checkRateLimit } from "@/lib/security/rate-limit";

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY!;

const precheckSchema = z.object({
  email: z.string().email(),
  honeypot: z.string().optional(),
  // Optional: the client falls back to no token if reCAPTCHA fails to load
  // or execute (blocked script, misconfigured site key, Google outage).
  // Rate limiting + honeypot below carry the bot-mitigation load in that case.
  recaptchaToken: z.string().min(1).optional().nullable(),
});

/**
 * Pre-authentication gate: rate limiting, honeypot, and reCAPTCHA.
 * Actual credential verification happens client-side via Supabase Auth
 * (supabase.auth.signInWithPassword) so this route never sees the password.
 */
export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "anonymous";
    const rateLimitResult = await checkRateLimit(adminLoginLimiter, `admin:login:${ip}`);

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
      const recaptchaResponse = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: RECAPTCHA_SECRET_KEY,
          response: recaptchaToken,
        }),
      });

      const recaptchaData = await recaptchaResponse.json();

      if (!recaptchaData.success || recaptchaData.score < 0.5) {
        return sendError("reCAPTCHA verification failed", 400);
      }
    } else {
      console.warn(`Admin login precheck for ${ip}: no reCAPTCHA token, relying on rate limit + honeypot`);
    }

    return sendSuccess({ ok: true });
  } catch (error) {
    console.error("Login precheck error:", error);
    return sendError("Invalid request", 400);
  }
}
