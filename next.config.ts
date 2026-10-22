import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

// ---------------------------------------------------------------------------
// Content Security Policy
// ---------------------------------------------------------------------------
// Supabase is derived from the env var so the policy always matches whichever
// project the build points at. Without it in connect-src, the browser blocks
// supabase.auth.* calls before they leave the machine.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseWs = supabaseUrl?.replace(/^https:/, "wss:"); // Realtime

const csp: Record<string, Array<string | undefined>> = {
  "default-src": ["'self'"],

  // TODO: 'unsafe-inline' + 'unsafe-eval' weaken XSS protection a lot.
  // Move to nonces when there is time.
  "script-src": [
    "'self'",
    "'unsafe-inline'",
    "'unsafe-eval'",
    "https://assets.calendly.com",
    "https://*.calendly.com",
    "https://vercel.live",
    "https://www.google.com",
    "https://www.gstatic.com",
    "https://www.recaptcha.net",
  ],

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

  "style-src": ["'self'", "'unsafe-inline'", "https://assets.calendly.com"],
  "img-src": ["'self'", "data:", "blob:", "https:"],
  "font-src": [
    "'self'",
    "data:",
    "https://assets.calendly.com",
    "https://vercel.live/geist.woff2",
    "https://vercel.live/geist_mono.woff2",
  ],

  // These do not fall back to default-src, so they must be set explicitly.
  "object-src": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
  "frame-ancestors": ["'none'"], // blocks clickjacking of /admin
};

const contentSecurityPolicy = Object.entries(csp)
  .map(([directive, sources]) => `${directive} ${sources.filter(Boolean).join(" ")}`)
  .join("; ");

// ---------------------------------------------------------------------------
// Next config
// ---------------------------------------------------------------------------
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [{ key: "Content-Security-Policy", value: contentSecurityPolicy }],
      },
    ];
  },

  images: {
    // All app-owned images are local. Third-party article thumbnails are
    // rendered unoptimized so arbitrary publisher hosts never reach the
    // server-side image optimizer.
    remotePatterns: [],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  experimental: {
    optimizePackageImports: [
      "@tabler/icons-react",
      "lucide-react",
      "framer-motion",
      "gsap",
      "@radix-ui/react-avatar",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-slot",
    ],
  },

  poweredByHeader: false,
  compress: true,

  // Dev server only: how long unused pages stay compiled in memory.
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})(nextConfig);
