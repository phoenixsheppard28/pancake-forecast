// /pages/api/cron/revalidate.ts
import { NextResponse,NextRequest } from 'next/server'

export const runtime = 'edge';

export async function GET(request:NextRequest) {
    try {
  
        const token = request.headers.get('Authorization');
        if (!token || token !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }


        const response = await fetch("https://umpancake-backend.vercel.app/forecast",{
            headers: {
                "x-api-key": process.env.API_KEY || ""
            },
            cache: 'no-store', // Force fresh data,

    });
       
        
        const revalidatePancake = await response.json();
  
        return NextResponse.json({ revalidted: true, revalidatePancake, timestamp: new Date().toISOString(),
        })
    } catch (error) {
        console.error("Error fetching pancake data:", error);
        return NextResponse.json({
            revalidated: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString()
        }, { 
            status: 500 
        })
      }
}

