import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiResponse = await fetch("https://umpancake-backend.vercel.app/forecast", {
      headers: {
        "x_api_key": process.env.API_KEY,
      },
    });

    if (!apiResponse.ok) {
      throw new Error("Failed to fetch from backend");
    }

    const data = await apiResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching pancake data:", error);
    return NextResponse.json({ error: "Failed to retrieve pancake data" }, { status: 500 });
  }
}