import { NextResponse } from "next/server";

// export const runtime = 'edge';
export const maxDuration = 60;

export async function GET() {
  try {
    
    const apiResponse = await fetch("https://umpancake-backend.vercel.app/forecast", {
      headers: {
        "x-api-key": process.env.API_KEY || "",
      },
        next: { revalidate: 200 }, // optional for upstream caching if backend is a Next.js route
      });

    if (!apiResponse.ok) {
      throw new Error("Failed to fetch from backend");
    }

    const data = await apiResponse.json();
    const response = NextResponse.json(data);
    response.headers.set("Cache-Control", "s-maxage=86400, stale-while-revalidate");

    return response
  } catch (error) {
    console.error("Error fetching second half pancake data:", error);
    return NextResponse.json(
      { error: "Failed to retrieve pancake data" }, 
      { status: 500 }
    );
  }
}