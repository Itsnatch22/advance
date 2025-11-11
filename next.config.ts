import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["@tabler/icons-react", "lucide-react"],
  },
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
