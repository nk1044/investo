from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
from prisma import Prisma
from typing import List

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