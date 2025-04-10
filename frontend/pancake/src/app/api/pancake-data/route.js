import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiResponse = await fetch("/api/pancake-data", {
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
    console.error("Error fetching pancake data:", error);
    return NextResponse.json({ error: "Failed to retrieve pancake data" }, { status: 500 });
  }
}