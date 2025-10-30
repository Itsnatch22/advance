import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    cacheComponents: true,
    experimental: {
        // Allow dev access from LAN IPs to Next dev server resources (/_next/*)
        allowedDevOrigins: [
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            // Replace with your LAN origin used in logs
            "http://10.109.197.134:3000",
        ],
    },
};

export default nextConfig;
