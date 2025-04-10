import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

module.exports = {
  async rewrites() {
    return [
      {
        source: "/api/pancake-data", // Frontend route
        destination: "https://umpancake-backend.vercel.app/forecast", // Backend route
      },
    ];
  },
};
