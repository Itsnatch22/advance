import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "smartcdn.gprod.postmedia.digital",
      },
      {
        protocol: "https",
        hostname: "ml.globenewswire.com",
      },
      {
        protocol: "https",
        hostname: "www.niemanlab.org",
      },
      {
        protocol: "https",
        hostname: "media.zenfs.com",
      },
      {
        protocol: "https",
        hostname: "nairobileo.co.ke",
      },
    ]
  }
};

export default nextConfig;
