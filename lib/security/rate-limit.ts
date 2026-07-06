import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { getEnv } from "@/env";

const env = getEnv();

export const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});

/**
 * Rate limiter for registration endpoint
 * Limits to 5 registration attempts per hour per IP
 */
export const rateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 h"),
  analytics: true,
  prefix: "ratelimit:register",
});

/**
 * Rate limiter for email verification resend
 * Limits to 3 resend attempts per hour per email
 */
export const resendLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "1 h"),
  analytics: true,
  prefix: "ratelimit:resend",
});

/**
 * Rate limiter for the unsubscribe endpoint.
 * Limits to 10 attempts per hour per IP — generous enough for legitimate use,
 * strict enough to block abuse / scraping confirmation of valid emails.
 */
export const unsubscribeLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 h"),
  analytics: true,
  prefix: "ratelimit:unsubscribe",
});

/**
 * Rate limiter for the public contact form.
 * Uses Upstash-backed Redis so it survives restarts and scales across processes.
 */
export const contactLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 h"),
  analytics: true,
  prefix: "ratelimit:contact",
});

/**
 * Rate limiter for general API endpoints
 * Limits to 100 requests per minute per IP
 */
export const apiLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "1 m"),
  analytics: true,
  prefix: "ratelimit:api",
});

/** Wage calculator — 30 requests per minute per IP */
export const calcLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, "1 m"),
  analytics: true,
  prefix: "ratelimit:calc",
});

/** Chat endpoints (Wiza AI) — 60 requests per minute per IP */
export const chatLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, "1 m"),
  analytics: true,
  prefix: "ratelimit:chat",
});

/** Wiza AI streaming — 20 requests per minute per IP */
export const wizaStreamLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "1 m"),
  analytics: true,
  prefix: "ratelimit:wiza:stream",
});

/** Escalation emails — 5 per hour per IP */
export const escalateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 h"),
  analytics: true,
  prefix: "ratelimit:escalate",
});

/** Public read APIs (resources, fx, gifs, stats) — 120 per minute per IP */
export const publicReadLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(120, "1 m"),
  analytics: true,
  prefix: "ratelimit:public-read",
});

/** Admin login attempts — 5 per hour per IP (strict for security) */
export const adminLoginLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 h"),
  analytics: true,
  prefix: "ratelimit:admin:login",
});

/**
 * Helper to format rate limit response headers
 */
export function getRateLimitHeaders(
  limit: number,
  remaining: number,
  reset: number
): Record<string, string> {
  return {
    "X-RateLimit-Limit": limit.toString(),
    "X-RateLimit-Remaining": remaining.toString(),
    "X-RateLimit-Reset": new Date(reset).toISOString(),
  };
}

/**
 * Type for rate limit result
 */
export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  headers: Record<string, string>;
}

/**
 * Wrapper to check rate limit and return formatted result
 */
export async function checkRateLimit(
  limiter: Ratelimit,
  identifier: string
): Promise<RateLimitResult> {
  const result = await limiter.limit(identifier);

  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
    headers: getRateLimitHeaders(result.limit, result.remaining, result.reset),
  };
}
