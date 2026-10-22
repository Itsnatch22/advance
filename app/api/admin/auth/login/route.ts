import { NextRequest } from "next/server";
import { createHash, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { sendSuccess, sendError } from "@/lib/utils/response";
import { adminLoginLimiter, checkRateLimit } from "@/lib/security/rate-limit";

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY!;

const precheckSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(1).max(1024),
  honeypot: z.string().optional(),
  // Optional: the client falls back to no token if reCAPTCHA fails to load
  // or execute (blocked script, misconfigured site key, Google outage).
  // Rate limiting + honeypot below carry the bot-mitigation load in that case.
  recaptchaToken: z.string().min(1).optional().nullable(),
});

function matchesConfiguredAdmin(email: string, password: string): boolean {
  const configuredAdmins = process.env.SYSTEM_ADMINS;
  const configuredPassword = process.env.SYSTEM_ADMINS_PASSWORD;
  if (!configuredAdmins || !configuredPassword) return false;

  // Support comma or semicolon separated addresses, and require exact matches.
  const allowedEmails = configuredAdmins
    .split(/[;,\r\n]+/)
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  // Hash both inputs to fixed-length buffers so timingSafeEqual does not throw
  // or reveal the configured password length.
  const submittedHash = createHash("sha256").update(password, "utf8").digest();
  const configuredHash = createHash("sha256")
    .update(configuredPassword, "utf8")
    .digest();
  const passwordMatches = timingSafeEqual(submittedHash, configuredHash);
  const emailMatches = allowedEmails.includes(email.trim().toLowerCase());

  return emailMatches && passwordMatches;
}

/**
 * Server-side environment credential gate plus rate limiting, honeypot, and
 * reCAPTCHA. Supabase Auth still establishes the session and system_admins
 * remains the authorization source for protected admin pages and APIs.
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
    const { email, password, honeypot, recaptchaToken } =
      precheckSchema.parse(body);

    if (honeypot) {
      return sendError("Invalid request", 400);
    }

    if (!matchesConfiguredAdmin(email, password)) {
      return sendError("Invalid email or password.", 401);
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
        "Admin login precheck: no reCAPTCHA token; relying on rate limit + honeypot"
      );
    }

    return sendSuccess({ ok: true });
  } catch {
    // Avoid logging request/validation details that could contain credentials.
    console.error("Admin login precheck failed");
    return sendError("Invalid request", 400);
  }
}
