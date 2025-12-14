import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async rewrites() {
        return [
            {
                source: "/api/pancake-data",
                destination: "https://umpancake-backend.vercel.app/forecast",
            },
            
        ];
    },
};

export default nextConfig;