import unittest
from unittest import mock
import numpy as np
import datetime
from fastapi.testclient import TestClient
import sys
import os
import json

# Import your app
from main import app, db, startup, shutdown

client = TestClient(app)

class MockPrismaStock:
    def __init__(self, id, instrument):
        self.id = id
        self.instrument = instrument

class MockPrismaStockData:
    def __init__(self, id, stockId, datetime, close, high, low, open, volume):
        self.id = id
        self.stockId = stockId
        self.datetime = datetime
        self.close = close
        self.high = high
        self.low = low
        self.open = open
        self.volume = volume

class TestAppSetup(unittest.TestCase):
    @mock.patch('main.db.connect')
    async def test_startup(self, mock_connect):
        await startup()
        mock_connect.assert_called_once()
    
    @mock.patch('main.db.disconnect')
    async def test_shutdown(self, mock_disconnect):
        await shutdown()
        mock_disconnect.assert_called_once()

class TestRootEndpoint(unittest.TestCase):
    def test_read_root(self):
        response = client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"message": "Server is running healthy"})
        
    def test_root_with_query_params(self):
        response = client.get("/?param=test")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"message": "Server is running healthy"})
        
    def test_root_with_post(self):
        response = client.post("/")
        self.assertEqual(response.status_code, 405)  # Method not allowed

class TestGetAllStocks(unittest.TestCase):
    @mock.patch('main.db.stock.find_many')
    async def test_get_all_stocks_success(self, mock_find_many):
        mock_stocks = [
            MockPrismaStock(id=1, instrument="HINDALCO"),
            MockPrismaStock(id=2, instrument="TATASTEEL")
        ]
        mock_find_many.return_value = mock_stocks
        
        response = client.get("/get-all-stocks")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data), 2)
        self.assertEqual(data[0]["instrument"], "HINDALCO")
        self.assertEqual(data[1]["instrument"], "TATASTEEL")
    
    @mock.patch('main.db.stock.find_many')
    async def test_get_all_stocks_empty(self, mock_find_many):
        mock_find_many.return_value = []
        
        response = client.get("/get-all-stocks")
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json(), {"detail": "No stocks found"})
        
    @mock.patch('main.db.stock.find_many')
    async def test_get_all_stocks_db_error(self, mock_find_many):
        mock_find_many.side_effect = Exception("Database error")
        
        with self.assertRaises(Exception) as context:
            response = client.get("/get-all-stocks")
        self.assertTrue("Database error" in str(context.exception))
        
    def test_get_all_stocks_wrong_method(self):
        response = client.post("/get-all-stocks")
        self.assertEqual(response.status_code, 405)  # Method not allowed

class TestGetStockData(unittest.TestCase):
    @mock.patch('main.db.stockdata.find_many')
    @mock.patch('main.db.stock.find_unique')
    async def test_get_stock_data_success(self, mock_find_unique, mock_find_many):
        mock_stock = MockPrismaStock(id=1, instrument="HINDALCO")
        mock_find_unique.return_value = mock_stock

        today = datetime.datetime.now()
        mock_data = [
            MockPrismaStockData(id=1, stockId=1, datetime=today, close=114.0, high=115.35, low=113.0, open=113.15, volume=5737135),
            MockPrismaStockData(id=2, stockId=1, datetime=today - datetime.timedelta(days=1), close=111.1, high=112.7, low=109.3, open=112.0, volume=8724577)
        ]
        mock_find_many.return_value = mock_data
        
        response = client.get("/get-stock-data?instrument=HINDALCO")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("stock", data)
        self.assertIn("data", data)
        self.assertEqual(data["stock"]["instrument"], "HINDALCO")
        self.assertEqual(len(data["data"]), 2)
        self.assertEqual(data["data"][0]["close"], 114.0)
    
    @mock.patch('main.db.stock.find_unique')
    async def test_get_stock_data_stock_not_found(self, mock_find_unique):
        mock_find_unique.return_value = None
        
        response = client.get("/get-stock-data?instrument=NONEXISTENT")
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json(), {"detail": "Stock not found"})
    
    def test_get_stock_data_missing_instrument(self):
        response = client.get("/get-stock-data")
        self.assertEqual(response.status_code, 422)

    @mock.patch('main.db.stockdata.find_many')
    @mock.patch('main.db.stock.find_unique')
    async def test_get_stock_data_no_data(self, mock_find_unique, mock_find_many):
        mock_stock = MockPrismaStock(id=1, instrument="HINDALCO")
        mock_find_unique.return_value = mock_stock
        mock_find_many.return_value = []
        
        response = client.get("/get-stock-data?instrument=HINDALCO")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("stock", data)
        self.assertIn("data", data)
        self.assertEqual(data["data"], [])
        
    @mock.patch('main.db.stock.find_unique')
    async def test_get_stock_data_db_error(self, mock_find_unique):
        mock_find_unique.side_effect = Exception("Database error")
        
        with self.assertRaises(Exception) as context:
            response = client.get("/get-stock-data?instrument=HINDALCO")
        self.assertTrue("Database error" in str(context.exception))
    
    def test_get_stock_data_wrong_method(self):
        response = client.post("/get-stock-data?instrument=HINDALCO")
        self.assertEqual(response.status_code, 405)  # Method not allowed

class TestCreateStock(unittest.TestCase):
    @mock.patch('main.db.stock.create')
    @mock.patch('main.db.stock.find_unique')
    async def test_create_stock_success(self, mock_find_unique, mock_create):
        mock_find_unique.return_value = None
        mock_new_stock = MockPrismaStock(id=1, instrument="NEWSTOCK")
        mock_create.return_value = mock_new_stock
        
        response = client.post("/create-stock", json={"instrument": "NEWSTOCK"})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["instrument"], "NEWSTOCK")
    
    @mock.patch('main.db.stock.find_unique')
    async def test_create_stock_already_exists(self, mock_find_unique):
        mock_existing_stock = MockPrismaStock(id=1, instrument="HINDALCO")
        mock_find_unique.return_value = mock_existing_stock
        
        response = client.post("/create-stock", json={"instrument": "HINDALCO"})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), {"detail": "Stock already exists"})
    
    def test_create_stock_invalid_input(self):
        response = client.post("/create-stock", json={})
        self.assertEqual(response.status_code, 422)
        
    def test_create_stock_malformed_input(self):
        response = client.post("/create-stock", json={"wrong_field": "NEWSTOCK"})
        self.assertEqual(response.status_code, 422)
    
    def test_create_stock_empty_instrument(self):
        response = client.post("/create-stock", json={"instrument": ""})
        self.assertEqual(response.status_code, 200)  # FastAPI allows empty strings
        
    @mock.patch('main.db.stock.find_unique')
    @mock.patch('main.db.stock.create')
    async def test_create_stock_db_error(self, mock_create, mock_find_unique):
        mock_find_unique.return_value = None
        mock_create.side_effect = Exception("Database error")
        
        with self.assertRaises(Exception) as context:
            response = client.post("/create-stock", json={"instrument": "NEWSTOCK"})
        self.assertTrue("Database error" in str(context.exception))
    
    def test_create_stock_wrong_method(self):
        response = client.get("/create-stock")
        self.assertEqual(response.status_code, 405)  # Method not allowed

class TestAddStockData(unittest.TestCase):
    @mock.patch('main.db.stockdata.create')
    @mock.patch('main.db.stock.find_unique')
    async def test_add_stock_data_success(self, mock_find_unique, mock_create):
        mock_stock = MockPrismaStock(id=1, instrument="HINDALCO")
        mock_find_unique.return_value = mock_stock
        
        today = datetime.datetime.now()
        mock_new_data = MockPrismaStockData(
            id=1, stockId=1, datetime=today, close=114.0, high=115.35, 
            low=113.0, open=113.15, volume=5737135
        )
        mock_create.return_value = mock_new_data
        
        stock_data = {
            "stockId": 1,
            "datetime": today.isoformat(),
            "close": 114.0,
            "high": 115.35,
            "low": 113.0,
            "open": 113.15,
            "volume": 5737135
        }
        
        response = client.post("/add-stock-data", json=stock_data)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("message", data)
        self.assertEqual(data["message"], "Stock data created successfully")
        self.assertIn("data", data)
    
    @mock.patch('main.db.stock.find_unique')
    async def test_add_stock_data_stock_not_found(self, mock_find_unique):
        mock_find_unique.return_value = None
        
        today = datetime.datetime.now()
        stock_data = {
            "stockId": 999,
            "datetime": today.isoformat(),
            "close": 114.0,
            "high": 115.35,
            "low": 113.0,
            "open": 113.15,
            "volume": 5737135
        }
        
        response = client.post("/add-stock-data", json=stock_data)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json(), {"detail": "Stock not found"})
    
    def test_add_stock_data_invalid_input(self):
        response = client.post("/add-stock-data", json={})
        self.assertEqual(response.status_code, 422)
    
    def test_add_stock_data_missing_fields(self):
        response = client.post("/add-stock-data", json={"stockId": 1})
        self.assertEqual(response.status_code, 422)
    
    def test_add_stock_data_invalid_types(self):
        today = datetime.datetime.now()
        stock_data = {
            "stockId": "not_an_integer",
            "datetime": today.isoformat(),
            "close": 114.0,
            "high": 115.35,
            "low": 113.0,
            "open": 113.15,
            "volume": 5737135
        }
        response = client.post("/add-stock-data", json=stock_data)
        self.assertEqual(response.status_code, 422)
    
    def test_add_stock_data_invalid_date(self):
        stock_data = {
            "stockId": 1,
            "datetime": "not-a-date",
            "close": 114.0,
            "high": 115.35,
            "low": 113.0,
            "open": 113.15,
            "volume": 5737135
        }
        response = client.post("/add-stock-data", json=stock_data)
        self.assertEqual(response.status_code, 422)
    
    @mock.patch('main.db.stock.find_unique')
    @mock.patch('main.db.stockdata.create')
    async def test_add_stock_data_db_error(self, mock_create, mock_find_unique):
        mock_stock = MockPrismaStock(id=1, instrument="HINDALCO")
        mock_find_unique.return_value = mock_stock
        mock_create.side_effect = Exception("Database error")
        
        today = datetime.datetime.now()
        stock_data = {
            "stockId": 1,
            "datetime": today.isoformat(),
            "close": 114.0,
            "high": 115.35,
            "low": 113.0,
            "open": 113.15,
            "volume": 5737135
        }
        
        with self.assertRaises(Exception) as context:
            response = client.post("/add-stock-data", json=stock_data)
        self.assertTrue("Database error" in str(context.exception))
    
    def test_add_stock_data_wrong_method(self):
        response = client.get("/add-stock-data")
        self.assertEqual(response.status_code, 405)  # Method not allowed

class TestStrategyEndpoint(unittest.TestCase):
    @mock.patch('main.db.stockdata.find_many')
    @mock.patch('main.db.stock.find_unique')
    async def test_strategy_success(self, mock_find_unique, mock_find_many):
        mock_stock = MockPrismaStock(id=1, instrument="HINDALCO")
        mock_find_unique.return_value = mock_stock
        
        today = datetime.datetime.now()
        mock_data = [
            MockPrismaStockData(id=1, stockId=1, datetime=today - datetime.timedelta(days=5), close=100.0, high=102.0, low=99.0, open=101.0, volume=1000),
            MockPrismaStockData(id=2, stockId=1, datetime=today - datetime.timedelta(days=4), close=90.0, high=101.0, low=89.0, open=100.0, volume=1500),
            MockPrismaStockData(id=3, stockId=1, datetime=today - datetime.timedelta(days=3), close=95.0, high=97.0, low=94.0, open=91.0, volume=2000),
            MockPrismaStockData(id=4, stockId=1, datetime=today - datetime.timedelta(days=2), close=110.0, high=112.0, low=105.0, open=96.0, volume=2500),
            MockPrismaStockData(id=5, stockId=1, datetime=today - datetime.timedelta(days=1), close=105.0, high=111.0, low=104.0, open=109.0, volume=1800)
        ]
        mock_find_many.return_value = mock_data
        
        response = client.get("/strategy?instrument=HINDALCO")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        self.assertIn("MovingAverage", data)
        self.assertIn("BestBuySell", data)
        
        expected_ma = [(100.0 + 90.0 + 95.0) / 3, (90.0 + 95.0 + 110.0) / 3, (95.0 + 110.0 + 105.0) / 3]
        for i, ma_value in enumerate(data["MovingAverage"]):
            self.assertAlmostEqual(ma_value, expected_ma[i], places=2)
        
        self.assertEqual(data["BestBuySell"]["BuyIndex"], 1)
        self.assertEqual(data["BestBuySell"]["SellIndex"], 3)
        self.assertEqual(data["BestBuySell"]["Profit"], 20.0)
    
    @mock.patch('main.db.stock.find_unique')
    async def test_strategy_stock_not_found(self, mock_find_unique):
        mock_find_unique.return_value = None
        
        response = client.get("/strategy?instrument=NONEXISTENT")
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json(), {"detail": "Stock not found"})
    
    @mock.patch('main.db.stockdata.find_many')
    @mock.patch('main.db.stock.find_unique')
    async def test_strategy_no_stock_data(self, mock_find_unique, mock_find_many):
        mock_stock = MockPrismaStock(id=1, instrument="HINDALCO")
        mock_find_unique.return_value = mock_stock
        
        mock_find_many.return_value = []
        
        response = client.get("/strategy?instrument=HINDALCO")
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json(), {"detail": "Stock data not found"})
    
    def test_strategy_missing_instrument(self):
        response = client.get("/strategy")
        self.assertEqual(response.status_code, 422)
    
    @mock.patch('main.db.stockdata.find_many')
    @mock.patch('main.db.stock.find_unique')
    async def test_strategy_single_data_point(self, mock_find_unique, mock_find_many):
        mock_stock = MockPrismaStock(id=1, instrument="HINDALCO")
        mock_find_unique.return_value = mock_stock
        
        today = datetime.datetime.now()
        mock_data = [
            MockPrismaStockData(id=1, stockId=1, datetime=today, close=100.0, high=102.0, low=99.0, open=101.0, volume=1000)
        ]
        mock_find_many.return_value = mock_data
        
        response = client.get("/strategy?instrument=HINDALCO")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        self.assertEqual(len(data["MovingAverage"]), 0)  # No MA values with only one data point
        self.assertEqual(data["BestBuySell"]["BuyIndex"], 0)
        self.assertEqual(data["BestBuySell"]["SellIndex"], 0)
        self.assertEqual(data["BestBuySell"]["Profit"], 0)
    
    @mock.patch('main.db.stockdata.find_many')
    @mock.patch('main.db.stock.find_unique')
    async def test_strategy_two_data_points(self, mock_find_unique, mock_find_many):
        mock_stock = MockPrismaStock(id=1, instrument="HINDALCO")
        mock_find_unique.return_value = mock_stock
        
        today = datetime.datetime.now()
        mock_data = [
            MockPrismaStockData(id=1, stockId=1, datetime=today - datetime.timedelta(days=1), close=100.0, high=102.0, low=99.0, open=101.0, volume=1000),
            MockPrismaStockData(id=2, stockId=1, datetime=today, close=110.0, high=112.0, low=105.0, open=106.0, volume=2000)
        ]
        mock_find_many.return_value = mock_data
        
        response = client.get("/strategy?instrument=HINDALCO")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        self.assertEqual(len(data["MovingAverage"]), 0)  # No MA values with only two data points (< window size 3)
        self.assertEqual(data["BestBuySell"]["BuyIndex"], 0)
        self.assertEqual(data["BestBuySell"]["SellIndex"], 1)
        self.assertEqual(data["BestBuySell"]["Profit"], 10.0)
    
    @mock.patch('main.db.stockdata.find_many')
    @mock.patch('main.db.stock.find_unique')
    async def test_strategy_v_shaped_market(self, mock_find_unique, mock_find_many):
        mock_stock = MockPrismaStock(id=1, instrument="HINDALCO")
        mock_find_unique.return_value = mock_stock
        
        today = datetime.datetime.now()
        mock_data = [
            MockPrismaStockData(id=1, stockId=1, datetime=today - datetime.timedelta(days=7), close=100.0, high=102.0, low=99.0, open=101.0, volume=1000),
            MockPrismaStockData(id=2, stockId=1, datetime=today - datetime.timedelta(days=6), close=95.0, high=98.0, low=94.0, open=96.0, volume=1200),
            MockPrismaStockData(id=3, stockId=1, datetime=today - datetime.timedelta(days=5), close=90.0, high=92.0, low=89.0, open=91.0, volume=1500),
            MockPrismaStockData(id=4, stockId=1, datetime=today - datetime.timedelta(days=4), close=85.0, high=91.0, low=84.0, open=90.0, volume=1800),
            MockPrismaStockData(id=5, stockId=1, datetime=today - datetime.timedelta(days=3), close=90.0, high=91.0, low=85.0, open=86.0, volume=1600),
            MockPrismaStockData(id=6, stockId=1, datetime=today - datetime.timedelta(days=2), close=95.0, high=96.0, low=89.0, open=90.0, volume=1400),
            MockPrismaStockData(id=7, stockId=1, datetime=today - datetime.timedelta(days=1), close=100.0, high=101.0, low=94.0, open=95.0, volume=1300),
            MockPrismaStockData(id=8, stockId=1, datetime=today, close=105.0, high=106.0, low=99.0, open=100.0, volume=1100)
        ]
        mock_find_many.return_value = mock_data
        
        response = client.get("/strategy?instrument=HINDALCO")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        self.assertEqual(len(data["MovingAverage"]), 6)  # 8 data points - window size + 1
        self.assertEqual(data["BestBuySell"]["BuyIndex"], 3)  # Lowest point at index 3
        self.assertEqual(data["BestBuySell"]["SellIndex"], 7)  # Highest point at the end
        self.assertEqual(data["BestBuySell"]["Profit"], 20.0)  # 105 - 85 = 20
    
    @mock.patch('main.db.stockdata.find_many')
    @mock.patch('main.db.stock.find_unique')
    async def test_strategy_real_world_data(self, mock_find_unique, mock_find_many):
        mock_stock = MockPrismaStock(id=1, instrument="HINDALCO")
        mock_find_unique.return_value = mock_stock
        
        # Using the sample data provided
        today = datetime.datetime.now()
        datetime1 = datetime.datetime(2014, 1, 24)
        datetime2 = datetime.datetime(2014, 1, 27)
        datetime3 = datetime.datetime(2014, 1, 28)
        datetime4 = datetime.datetime(2014, 1, 29)
        datetime5 = datetime.datetime(2014, 1, 30)
        datetime6 = datetime.datetime(2014, 1, 31)
        
        mock_data = [
            MockPrismaStockData(id=1, stockId=1, datetime=datetime1, close=114.0, high=115.35, low=113.0, open=113.15, volume=5737135),
            MockPrismaStockData(id=2, stockId=1, datetime=datetime2, close=111.1, high=112.7, low=109.3, open=112.0, volume=8724577),
            MockPrismaStockData(id=3, stockId=1, datetime=datetime3, close=113.8, high=115.0, low=109.75, open=110.0, volume=4513345),
            MockPrismaStockData(id=4, stockId=1, datetime=datetime4, close=111.75, high=114.75, low=111.15, open=114.5, volume=4713458),
            MockPrismaStockData(id=5, stockId=1, datetime=datetime5, close=108.1, high=110.7, low=107.6, open=110.2, volume=5077231),
            MockPrismaStockData(id=6, stockId=1, datetime=datetime6, close=109.55, high=110.0, low=107.0, open=109.05, volume=8287236)
        ]
        mock_find_many.return_value = mock_data
        
        response = client.get("/strategy?instrument=HINDALCO")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        self.assertEqual(len(data["MovingAverage"]), 4)  # 6 data points - window size + 1
        
        # Calculate expected MA values
        expected_ma = [
            (114.0 + 111.1 + 113.8) / 3,
            (111.1 + 113.8 + 111.75) / 3,
            (113.8 + 111.75 + 108.1) / 3,
            (111.75 + 108.1 + 109.55) / 3
        ]
        
        for i, ma_value in enumerate(data["MovingAverage"]):
            self.assertAlmostEqual(ma_value, expected_ma[i], places=2)
        
        # The lowest price is at index 4 (108.1)
        # The highest price after that is at index 5 (109.55)
        self.assertEqual(data["BestBuySell"]["BuyIndex"], 4)
        self.assertEqual(data["BestBuySell"]["SellIndex"], 5)
        self.assertAlmostEqual(data["BestBuySell"]["Profit"], 1.45)
    
    @mock.patch('main.db.stock.find_unique')
    @mock.patch('main.db.stockdata.find_many')
    async def test_strategy_db_error(self, mock_find_many, mock_find_unique):
        mock_stock = MockPrismaStock(id=1, instrument="HINDALCO")
        mock_find_unique.return_value = mock_stock
        mock_find_many.side_effect = Exception("Database error")
        
        with self.assertRaises(Exception) as context:
            response = client.get("/strategy?instrument=HINDALCO")
        self.assertTrue("Database error" in str(context.exception))
    
    def test_strategy_wrong_method(self):
        response = client.post("/strategy?instrument=HINDALCO")
        self.assertEqual(response.status_code, 405)  # Method not allowed
    
    def test_strategy_invalid_instrument_format(self):
        response = client.get("/strategy?instrument=123")  # Testing with a non-string instrument
        # This won't result in a 422 because FastAPI automatically converts path params to strings
        self.assertEqual(response.status_code, 404)  # Will return "Stock not found"

class TestMovingAverageAlgorithm(unittest.TestCase):
    def test_moving_average_calculation(self):
        close_prices = np.array([100.0, 105.0, 110.0, 115.0, 120.0])
        
        expected_ma = np.array([105.0, 110.0, 115.0])
        
        window_size = 3
        weights = np.ones(window_size) / window_size
        calculated_ma = np.convolve(close_prices, weights, mode="valid")
        
        np.testing.assert_array_almost_equal(calculated_ma, expected_ma)
    
    def test_moving_average_with_real_data(self):
        close_prices = np.array([114.0, 111.1, 113.8, 111.75, 108.1, 109.55])
        
        expected_ma = np.array([
            (114.0 + 111.1 + 113.8) / 3,
            (111.1 + 113.8 + 111.75) / 3,
            (113.8 + 111.75 + 108.1) / 3,
            (111.75 + 108.1 + 109.55) / 3
        ])
        
        window_size = 3
        weights = np.ones(window_size) / window_size
        calculated_ma = np.convolve(close_prices, weights, mode="valid")
        
        np.testing.assert_array_almost_equal(calculated_ma, expected_ma)
    
    def test_moving_average_insufficient_data(self):
        close_prices = np.array([100.0, 105.0])
        
        window_size = 3
        weights = np.ones(window_size) / window_size
        calculated_ma = np.convolve(close_prices, weights, mode="valid")
        
        self.assertEqual(len(calculated_ma), 0)
    
    def test_moving_average_exact_window_size(self):
        close_prices = np.array([100.0, 105.0, 110.0])
        
        window_size = 3
        weights = np.ones(window_size) / window_size
        calculated_ma = np.convolve(close_prices, weights, mode="valid")
        
        self.assertEqual(len(calculated_ma), 1)
        self.assertAlmostEqual(calculated_ma[0], 105.0)

class TestBestBuySellAlgorithm(unittest.TestCase):
    def test_best_buy_sell_calculation(self):
        close_prices = np.array([100.0, 90.0, 95.0, 110.0, 105.0])
        
        expected_buy_index = 1
        expected_sell_index = 3
        expected_profit = 20.0
        
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
        
        self.assertEqual(buy_index, expected_buy_index)
        self.assertEqual(sell_index, expected_sell_index)
        self.assertEqual(max_profit, expected_profit)
    
    def test_best_buy_sell_with_real_data(self):
        close_prices = np.array([114.0, 111.1, 113.8, 111.75, 108.1, 109.55])
        
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
        
        self.assertEqual(buy_index, 4)
        self.assertEqual(sell_index, 5)
        self.assertAlmostEqual(max_profit, 1.45)
    
    def test_best_buy_sell_declining_market(self):
        close_prices = np.array([100.0, 95.0, 90.0, 85.0, 80.0])
        
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
        
        self.assertEqual(max_profit, 0)
    
    def test_best_buy_sell_single_point(self):
        close_prices = np.array([100.0])
        
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
        
        self.assertEqual(buy_index, 0)
        self.assertEqual(sell_index, 0)
        self.assertEqual(max_profit, 0)
    
    def test_best_buy_sell_increasing_market(self):
        close_prices = np.array([80.0, 85.0, 90.0, 95.0, 100.0])
        
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
        
        self.assertEqual(buy_index, 0)
        self.assertEqual(sell_index, 4)
        self.assertEqual(max_profit, 20.0)

if __name__ == "__main__":
    unittest.main()