import { NextResponse } from "next/server";

export const runtime = 'edge';
export const maxDuration = 60;

export async function GET() {
  try {
    
    const apiResponse = await fetch("http://127.0.0.1:8000/forecast", {
      headers: {
        "x-api-key": process.env.API_KEY || "",
      }    });

    if (!apiResponse.ok) {
      throw new Error("Failed to fetch from backend");
    }

    const data = await apiResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching second half pancake data:", error);
    return NextResponse.json(
      { error: "Failed to retrieve pancake data" }, 
      { status: 500 }
    );
  }
}