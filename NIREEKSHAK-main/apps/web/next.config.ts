import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["10.113.1.57"],
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://nireekshak-api-vaxr.onrender.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;