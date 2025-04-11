import { NextResponse } from "next/server";

export const runtime = 'edge'; // Enable edge runtime
export const maxDuration = 60;

export async function GET() {
  try {
    // Cache for 24 hours
    const cacheOptions = {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400',
      },
    };

    const apiResponse = await fetch("https://umpancake-backend.vercel.app/forecast-1", {
      headers: {
        "x-api-key": process.env.API_KEY || "",
      },
      next: { revalidate: 86400 }, // Revalidate every 24 hours
    });

    if (!apiResponse.ok) {
      throw new Error("Failed to fetch from backend");
    }

    const data = await apiResponse.json();
    return NextResponse.json(data, cacheOptions);
  } catch (error) {
    console.error("Error fetching first half pancake data:", error);
    return NextResponse.json(
      { error: "Failed to retrieve pancake data" }, 
      { status: 500 }
    );
  }
}