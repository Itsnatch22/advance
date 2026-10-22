// lib/security/csp.ts
// Nonce-based Content Security Policy for Next.js 16 (App Router).
// Used by proxy.ts. A fresh nonce is generated for every request.

const isDev = process.env.NODE_ENV === "development";

export function generateNonce(): string {
  return Buffer.from(crypto.randomUUID()).toString("base64");
}

type Source = string | false | undefined;

export function buildCsp(nonce: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseWs = supabaseUrl?.replace(/^https:/, "wss:"); // Realtime

  const directives: Record<string, Source[]> = {
    "default-src": ["'self'"],

    // 'strict-dynamic' lets a nonced script load the scripts it needs (Calendly,
    // reCAPTCHA). Modern browsers then ignore the host list below; it stays only
    // as a fallback for old browsers. React/Next only need 'unsafe-eval' in dev.
    "script-src": [
      "'self'",
      `'nonce-${nonce}'`,
      "'strict-dynamic'",
      isDev && "'unsafe-eval'",
      "https://assets.calendly.com",
      "https://*.calendly.com",
      "https://vercel.live",
      "https://www.google.com",
      "https://www.gstatic.com",
      "https://www.recaptcha.net",
    ],

    // Deliberately NOT nonce-based: Framer Motion / GSAP write inline style
    // attributes, which a nonce cannot cover. (Adding a nonce here would make
    // the browser ignore 'unsafe-inline'.) Script injection is the real risk.
    "style-src": ["'self'", "'unsafe-inline'", "https://assets.calendly.com"],

    "frame-src": [
      "'self'",
      "https://calendly.com",
      "https://*.calendly.com",
      "https://accounts.google.com",
      "https://accounts.microsoft.com",
      "https://vercel.live",
      "https://www.google.com",
      "https://www.recaptcha.net",
    ],

    "connect-src": [
      "'self'",
      supabaseUrl,
      supabaseWs,
      "https://calendly.com",
      "https://api.calendly.com",
      "https://*.calendly.com",
      "https://*.pusher.com",
      "wss://*.pusher.com",
      "https://www.google.com",
      "https://www.gstatic.com",
      "https://www.recaptcha.net",
    ],

    "img-src": ["'self'", "data:", "blob:", "https:"],
    "font-src": [
      "'self'",
      "data:",
      "https://assets.calendly.com",
      "https://vercel.live/geist.woff2",
      "https://vercel.live/geist_mono.woff2",
    ],

    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'none'"],
  };

  return Object.entries(directives)
    .map(([name, sources]) => `${name} ${sources.filter(Boolean).join(" ")}`)
    .join("; ");
}