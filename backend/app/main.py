from fastapi import FastAPI, HTTPException, Depends, status, Header
from fastapi.responses import JSONResponse
from typing import Final
from datetime import datetime,timedelta
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
import uvicorn
import os
from fastapi.middleware.cors import CORSMiddleware



load_dotenv()
API_KEY = os.getenv("API_KEY")
assert(API_KEY != None)

app=FastAPI()
# cron job once per day that shifts the dates to check or rather just refetches the endpoint and updates the website 


app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://umpancake.vercel.app"],  # Add your frontend URL
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["GET"],
)

DINING_HALLS: Final = ["markley","bursley","mosher-jordan",
                       "east-quad","north-quad","south-quad","twigs-at-oxford",
                       "select-access/martha-cook"] # need special access for this one 



@app.get("/forecast-1")
async def get_forecast(x_api_key:str = Header(...)):
    if(x_api_key!=API_KEY):
        return JSONResponse(content="Invalid or none API Key",status_code=401)
   
    pancake_map={
        (datetime.today()+timedelta(i)).strftime("%Y-%m-%d"):[]
        for i in range(4)
    }

    for i in range(4):
        today = datetime.today() + timedelta(i)
        formatted_date = today.strftime("%Y-%m-%d")
        for hall in DINING_HALLS:
            params={
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
            r = requests.get(f"https://dining.umich.edu/menus-locations/dining-halls/{hall}/?menuDate={formatted_date}",params=params)
            if(r.status_code!=200):
                return JSONResponse(content="Error fetching data from dining hall",status_code=500)
            
            soup = BeautifulSoup(r.text,"lxml")
            divs = soup.find_all("div",class_="item-name")
            pancake_div = next((div for div in divs if "pancakes" in str(div.text).lower()), None)
            if(pancake_div!=None):
                info = {
                    "hall":hall,
                    "pancake":str(pancake_div.text).strip() 
                }
                pancake_map[formatted_date].append(info)
            else:
                pass
                
    return pancake_map

@app.get("/forecast-2")
async def get_forecast_2(x_api_key:str = Header(...)):
    if(x_api_key!=API_KEY):
        return JSONResponse(content="Invalid or none API Key",status_code=401)
    pancake_map={
        (datetime.today()+timedelta(i+4)).strftime("%Y-%m-%d"):[]
        for i in range(4)
    }

    for i in range(4):
        today = datetime.today() + timedelta(i+4)
        formatted_date = today.strftime("%Y-%m-%d")
        for hall in DINING_HALLS:
            params={
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
            r = requests.get(f"https://dining.umich.edu/menus-locations/dining-halls/{hall}/?menuDate={formatted_date}",params=params)
            if(r.status_code!=200):
                return JSONResponse(content="Error fetching data from dining hall",status_code=500)
            
            soup = BeautifulSoup(r.text,"lxml")
            divs = soup.find_all("div",class_="item-name")
            pancake_div = next((div for div in divs if "pancakes" in str(div.text).lower()), None)
            if(pancake_div!=None):
                info = {
                    "hall":hall,
                    "pancake":str(pancake_div.text).strip() 
                }
                pancake_map[formatted_date].append(info)
            else:
                pass
                
    return pancake_map