import { NextResponse } from "next/server";
import { HEADERS, BASE_URL, DINING_HALLS } from "@lib/config";
import * as cheerio from "cheerio";

// export const runtime = 'edge';
export const maxDuration = 60;

export async function GET() {
  // fix ts
  try {
    const days = Array.from({ length: 8 }, (_, i) =>
      new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString(
        "en-CA",
        {
          timeZone: "America/New_York",
        }
      )
    );

    const urls = DINING_HALLS.flatMap((hall) => {
      return days.map((day) => {
        return `${BASE_URL}${hall}/?menuDate=${day}`;
      });
    });

    const results = await Promise.allSettled(
      urls.map(async (url) => {
        const res = await fetch(url, { headers: HEADERS });
        if (!res.ok) {
          console.log(res.status)
          return ""
        }
        return res.text();
      })
    );

    const groupedByDate: Record<string, Array<{ hall: string; pancake: string }>> = {};

    results.forEach((result, urlIdx) => {
      if (result.status !== "fulfilled") return;

      // Map back to hall/date based on request ordering
      const hallIdx = Math.floor(urlIdx / days.length);
      const dayIdx = urlIdx % days.length;
      const hall = DINING_HALLS[hallIdx];
      const date = days[dayIdx];

      const $ = cheerio.load(result.value.toString());
      const pancakeDiv = $("div.item-name")
        .toArray()
        .find((el) => $(el).text().toLowerCase().includes("pancakes"));

      if (pancakeDiv) {
        if (!groupedByDate[date]) {
          groupedByDate[date] = [];
        }
        groupedByDate[date].push({
          hall,
          pancake: $(pancakeDiv).text().trim(),
        });
      }
    });

    const response = NextResponse.json(groupedByDate);
    response.headers.set(
      "Cache-Control",
      "s-maxage=86400, stale-while-revalidate"
    );

    return response;
  } catch (error) {
    console.error("Error fetching second half pancake data:", error);
    return NextResponse.json(
      { error: "Failed to retrieve pancake data" },
      { status: 500 }
    );
  }
}
