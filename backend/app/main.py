from fastapi import FastAPI, HTTPException, Depends, status, Header
from fastapi.responses import JSONResponse
from typing import Final
from datetime import datetime,timedelta
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
import uvicorn

API_KEY = load_dotenv("API_KEY")
assert(API_KEY != None)

app=FastAPI()
# cron job once per day that shifts the dates to check or rather just refetches the endpoint and updates the website 

DINING_HALLS: Final = ["markley","bursley","mosher-jordan",
                       "east-quad","north-quad","south-quad","twigs-at-oxford",
                       "select-access/martha-cook"] # need special access for this one 



@app.get("/forecast")
async def get_forecast(x_api_key:str = Header(...)):
    if(x_api_key!=API_KEY):
        return JSONResponse(content="Invalid or none API Key",status_code=401)
   
    pancake_map={
        (datetime.today()+timedelta(i)).strftime("%Y-%m-%d"):[]
        for i in range(7)
    }

    for i in range(8):
        today = datetime.today() + timedelta(i)
        formatted_date = today.strftime("%Y-%m-%d")

        for hall in DINING_HALLS:
            payload ={"menuDate": formatted_date}
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
            soup = BeautifulSoup(r.text,"lxml")
            divs = soup.find_all("div",class_="item-name")
            pancake_div = next((div for div in divs if "pancakes" in div.text.lower()), None)
            
            if(pancake_div):
                info = {
                    "hall":hall,
                    "pancake":str(pancake_div.text).strip() 
                }
                pancake_map[formatted_date].append(info)
                print(info)
            else:
                print("none found")
                
    return pancake_map

