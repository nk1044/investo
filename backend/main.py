from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
from prisma import Prisma
from typing import List
import numpy as np

app = FastAPI()
db = Prisma()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    await db.connect()

@app.on_event("shutdown")
async def shutdown():
    await db.disconnect()

@app.get("/")
def read_root():
    return {"message": "Server is running healthy"}

@app.get("/get-all-stocks")
async def get_all_stocks():
    stocks = await db.stock.find_many()
    if not stocks:
        raise HTTPException(status_code=404, detail="No stocks found")
    return stocks


@app.get("/get-stock-data")
async def get_stock_data(instrument: str):
    stock = await db.stock.find_unique(where={"instrument": instrument})
    
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")

    stock_data = await db.stockdata.find_many(where={"stockId": stock.id})

    return {"stock": stock, "data": stock_data}



class StockCreate(BaseModel):
    instrument: str

@app.post("/create-stock")
async def create_stock(stock: StockCreate):
    existing_stock = await db.stock.find_unique(where={"instrument": stock.instrument})
    if existing_stock:
        raise HTTPException(status_code=400, detail="Stock already exists")

    new_stock = await db.stock.create(
        data={"instrument": stock.instrument}
    )
    print("Stock created:", new_stock)
    return new_stock



class StockDataCreate(BaseModel):
    stockId: int
    datetime: datetime
    close: float
    high: float
    low: float
    open: float
    volume: int

@app.post("/add-stock-data")
async def add_stock_data(data: StockDataCreate):
    stock = await db.stock.find_unique(where={"id": data.stockId})
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")

    new_stock_data = await db.stockdata.create(
        data={
            "stockId": data.stockId,
            "datetime": data.datetime,
            "close": data.close,
            "high": data.high,
            "low": data.low,
            "open": data.open,
            "volume": data.volume
        }
    )
    
    return {"message": "Stock data created successfully", "data": new_stock_data}


@app.get("/strategy/performance")
async def get_strategy_performance(instrument: str):
    stock = await db.stock.find_unique(where={"instrument": instrument})
    
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")

    stock_data = await db.stockdata.find_many(where={"stockId": stock.id})
    if not stock_data:
        raise HTTPException(status_code=404, detail="Stock data not found")
   
    print("Stock Data:", stock_data[0].close)
    close_prices = np.array([entry.close for entry in stock_data])
    window_size = 3
    weights = np.ones(window_size) / window_size
    moving_avg = np.convolve(close_prices, weights, mode="valid")


    min_price = np.inf
    min_index = 0 
    max_profit = 0 
    buy_index = 0 
    sell_index = 0

    for i in range(len(close_prices)):
        if close_prices[i] < min_price:
            min_price = close_prices[i]
            min_index = i
        elif close_prices[i] - min_price > max_profit:
            max_profit = close_prices[i] - min_price
            buy_index = min_index
            sell_index = i
    BestBuySell = {"BuyIndex": buy_index, "SellIndex": sell_index, "Profit": max_profit}
    return {"MovingAverage": moving_avg.tolist(), "BestBuySell": BestBuySell}

