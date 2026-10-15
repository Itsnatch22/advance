import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://assets.calendly.com https://*.calendly.com https://vercel.live https://www.google.com https://www.gstatic.com https://www.recaptcha.net;",
  "script-src-elem 'self' 'unsafe-inline' https://assets.calendly.com https://*.calendly.com https://vercel.live https://www.google.com https://www.gstatic.com https://www.recaptcha.net;",
  "frame-src 'self' https://calendly.com https://*.calendly.com https://accounts.google.com https://accounts.microsoft.com https://vercel.live https://www.google.com https://www.recaptcha.net;",
  "connect-src 'self' https://calendly.com https://api.calendly.com https://*.calendly.com https://*.pusher.com wss://*.pusher.com https://ws-us3.pusher.com https://www.google.com https://www.gstatic.com",
            "style-src 'self' 'unsafe-inline' https://assets.calendly.com",
            "img-src 'self' data: blob: https:",
            "font-src 'self' data: https://assets.calendly.com https://vercel.live/geist.woff2 https://vercel.live/geist_mono.woff2",
].join("; "),
          },
        ],
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
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
  
  // Enable caching for better build performance
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})(nextConfig);