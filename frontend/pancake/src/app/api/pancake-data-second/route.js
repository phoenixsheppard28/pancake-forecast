import { NextResponse } from "next/server";

export const runtime = 'edge';
export const maxDuration = 60;

export async function GET() {
  try {
    const cacheOptions = {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400',
      },
    };

    const apiResponse = await fetch("https://umpancake-backend.vercel.app/forecast-2", {
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
    console.error("Error fetching second half pancake data:", error);
    return NextResponse.json(
      { error: "Failed to retrieve pancake data" }, 
      { status: 500 }
    );
  }
}