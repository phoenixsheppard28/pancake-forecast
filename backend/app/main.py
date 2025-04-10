from fastapi import FastAPI, HTTPException, Depends, status, Header
from fastapi.responses import JSONResponse
from typing import Final
from datetime import datetime,timedelta
import httpx
from bs4 import BeautifulSoup
from dotenv import load_dotenv
import uvicorn
import os
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import pytz

load_dotenv()
API_KEY = os.getenv("API_KEY")
assert(API_KEY != None)
DINING_HALLS: Final = ["markley","bursley","mosher-jordan",
                       "east-quad","north-quad","south-quad","twigs-at-oxford",
                       "select-access/martha-cook"] # need special access for this one 
eastern = pytz.timezone("America/Detroit")  
today = datetime.now(eastern)

cache = {"forecast-1": None, "forecast-2": None} # { "forecast-1": { "data": {...}, "created_date": date } }

app=FastAPI()
# cron job once per day that shifts the dates to check or rather just refetches the endpoint and updates the website 
async def fetch(client,hall, formatted_date):
        await asyncio.sleep(0.5)
        headers={
            'Cookie':'gwlob=on',
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'accept-language': 'en-US,en;q=0.9',
            'cache-control': 'no-cache',
            'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'sec-fetch-dest': 'document',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-user': '?1',
            'upgrade-insecure-requests': '1',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36'
        }
        r = await client.get(f"https://dining.umich.edu/menus-locations/dining-halls/{hall}/?menuDate={formatted_date}", headers=headers)
        if r.status_code != 200:
            print(f"Error fetching data for {hall} on {formatted_date}: {r.status_code}")
        soup = BeautifulSoup(r.text, "lxml")
        divs = soup.find_all("div", class_="item-name")
        pancake_div = next((div for div in divs if "pancakes" in str(div.text).lower()), None)
        if pancake_div:
            return {
                "date": formatted_date,
                "hall": hall,
                "pancake": str(pancake_div.text).strip()
            }
        return None

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://umpancake.vercel.app"],  # Add your frontend URL
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)



@app.get("/forecast-1")
async def get_forecast_1(x_api_key:str = Header(...)):
    if(x_api_key!=API_KEY):
        return JSONResponse(content="Invalid or none API Key",status_code=401)
    
    if(cache["forecast-1"] != None and cache["forecast-1"]["created_date"] == today.strftime("%Y-%m-%d")):
        return cache["forecast-1"]["data"]
   
    pancake_map = {
        (today+timedelta(i)).strftime("%Y-%m-%d"): []
        for i in range(4)
    }

    async with httpx.AsyncClient(
        timeout=60,
        limits=httpx.Limits(max_keepalive_connections=20, max_connections=50)
    ) as client:
        tasks = []
        for i in range(4):
            date = today + timedelta(i)
            formatted_date = date.strftime("%Y-%m-%d")
            for hall in DINING_HALLS:
                tasks.append(fetch(client=client,hall=hall, formatted_date=formatted_date))

        results = await asyncio.gather(*tasks)
        for result in results:
            if result:
                pancake_map[result["date"]].append({
                    "hall": result["hall"],
                    "pancake": result["pancake"]
                })
    cache["forecast-1"] = {
        "data": pancake_map,
        "created_date": today.strftime("%Y-%m-%d")
    } 
    return pancake_map

@app.get("/forecast-2")
async def get_forecast_2(x_api_key:str = Header(...)):
    if(x_api_key!=API_KEY):
        return JSONResponse(content="Invalid or none API Key",status_code=401)
    
    if(cache["forecast-2"] != None and cache["forecast-2"]["created_date"] == today.strftime("%Y-%m-%d")):
        return cache["forecast-2"]["data"]
    
    pancake_map={
        (today+timedelta(i+4)).strftime("%Y-%m-%d"):[]
        for i in range(4)
    }

    async with httpx.AsyncClient(
        timeout=60,
        limits=httpx.Limits(max_keepalive_connections=20, max_connections=50)
    ) as client:
        tasks = []
        for i in range(4):
            date = today + timedelta(i+4)
            formatted_date = date.strftime("%Y-%m-%d")
            for hall in DINING_HALLS:
                tasks.append(fetch(client=client,hall=hall, formatted_date=formatted_date))

        results = await asyncio.gather(*tasks)
        for result in results:
            if result!=None:
                pancake_map[result["date"]].append({
                    "hall": result["hall"],
                    "pancake": result["pancake"]
                })
   
    cache["forecast-2"] = {
        "data": pancake_map,
        "created_date": today.strftime("%Y-%m-%d")
    }
                    
    return pancake_map