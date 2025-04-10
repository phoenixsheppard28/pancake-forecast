import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async rewrites() {
        return [
            {
                source: "/api/pancake-data-first",
                destination: "https://umpancake-backend.vercel.app/forecast-1",
            },
            {
                source: "/api/pancake-data-second",
                destination: "https://umpancake-backend.vercel.app/forecast-2",
            },
        ];
    },
};

export default nextConfig;