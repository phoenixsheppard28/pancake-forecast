import { NextResponse } from "next/server";
export const maxDuration = 60; // This function can run for a maximum of 60 seconds

export async function GET() {
  try {
    const apiResponse = await fetch("https://umpancake-backend.vercel.app/forecast-2", {
      headers: {
        "x-api-key": process.env.API_KEY,
      },
    });

    if (!apiResponse.ok) {
      throw new Error("Failed to fetch from backend");
    }

    const data = await apiResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching second half pancake data:", error);
    return NextResponse.json({ error: "Failed to retrieve pancake data" }, { status: 500 });
  }
}