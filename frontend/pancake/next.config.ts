import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/pancake-data", // Frontend route
        destination: "https://umpancake-backend.vercel.app/forecast", // Backend route
      },
    ];
  },
};

export default nextConfig;