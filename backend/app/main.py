from fastapi import FastAPI, HTTPException, Depends, status
import uvicorn
from httpx import AsyncClient

app=FastAPI()

@app.get("/")
async def home():
    return "hello world!"