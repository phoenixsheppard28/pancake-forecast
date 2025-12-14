import { NextResponse } from "next/server";
import { HEADERS, BASE_URL, DINING_HALLS } from "@lib/config";

// export const runtime = 'edge';
export const maxDuration = 60;

export async function GET() { // fix ts
  try {
    const days = Array.from({ length: 8 }, (_, i) =>
      new Date(Date.now() + i * 24 * 60 * 60 * 1000)
        .toLocaleDateString("en-CA", {
          timeZone: "America/New_York",
        })
    );
    
   

    


    

    const apiResponse = await fetch("https://umpancake-backend.vercel.app/forecast", {// need to fix ts 
      headers: {
        "x-api-key": process.env.API_KEY || "",
      }
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