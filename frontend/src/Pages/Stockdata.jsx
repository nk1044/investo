import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getStockdata, getStockPerformance } from '../Server/server';

function Stockdata() {
    const [stockdata, setStockdata] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { instrument } = useParams();
    const [MovingAverage, setMovingAverage] = useState([]);
    const [bestBuyIndex, setBestBuyIndex] = useState(null);
    const [bestSellIndex, setBestSellIndex] = useState(null);
    const [profit, setProfit] = useState(0);

    const fetchStocks = async () => {
        try {
            const data = await getStockdata(instrument);
            //   console.log(data);
            setStockdata(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchStockPerformance = async () => {
        try {
            const data = await getStockPerformance(instrument);
            // console.log(data);
            setMovingAverage(data.MovingAverage);
            setBestBuyIndex(data.BestBuySell?.BuyIndex);
            setBestSellIndex(data.BestBuySell?.SellIndex);
            setProfit(data.BestBuySell?.Profit);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStocks();
        // fetchStockPerformance();
        // console.log(instrument);
    }, [instrument]);


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    return (
        <div className="min-h-screen bg-neutral-900 text-neutral-100 pt-24 pb-10 px-4 md:px-6">
            <div className="max-w-6xl mx-auto">

                <div className="text-center mb-12">
                    <span className="inline-block px-3 py-1 text-sm font-medium text-blue-400 bg-blue-400/10 rounded-full mb-4">Stock Details</span>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                        Stock Data <span className="text-blue-400">{instrument}</span>
                    </h1>
                    <p className="text-neutral-300 max-w-2xl mx-auto">
                        View detailed price history and trading information for {instrument}. Track open, high, low, close prices and volume data.
                    </p>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {!loading && !error && stockdata.length > 0 && (
                        <>
                            <div className="bg-neutral-800/60 backdrop-blur-sm border border-neutral-700/50 p-6 rounded-xl shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-neutral-400 text-sm">Highest Price</p>
                                        <h3 className="text-xl font-bold text-green-400 mt-1">
                                            ${Math.max(...stockdata.map(item => item.high)).toFixed(2)}
                                        </h3>
                                        <p className="text-xs text-neutral-500 mt-1">
                                            {formatDate(stockdata.sort((a, b) => b.high - a.high)[0].datetime)}
                                        </p>
                                    </div>
                                    <div className="bg-green-400/10 p-3 rounded-lg">
                                        <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-neutral-800/60 backdrop-blur-sm border border-neutral-700/50 p-6 rounded-xl shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-neutral-400 text-sm">Lowest Price</p>
                                        <h3 className="text-xl font-bold text-red-400 mt-1">
                                            ${Math.min(...stockdata.map(item => item.low)).toFixed(2)}
                                        </h3>
                                        <p className="text-xs text-neutral-500 mt-1">
                                            {formatDate(stockdata.sort((a, b) => a.low - b.low)[0].datetime)}
                                        </p>
                                    </div>
                                    <div className="bg-red-400/10 p-3 rounded-lg">
                                        <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path>
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-neutral-800/60 backdrop-blur-sm border border-neutral-700/50 p-6 rounded-xl shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-neutral-400 text-sm">Average Volume</p>
                                        <h3 className="text-xl font-bold text-blue-400 mt-1">
                                            {Math.round(stockdata.reduce((sum, item) => sum + item.volume, 0) / stockdata.length).toLocaleString()}
                                        </h3>
                                        <p className="text-xs text-neutral-500 mt-1">
                                            Across {stockdata.length} data points
                                        </p>
                                    </div>
                                    <div className="bg-blue-400/10 p-3 rounded-lg">
                                        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-neutral-800/60 backdrop-blur-sm border border-neutral-700/50 p-6 rounded-xl shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-neutral-400 text-sm">Price Change</p>
                                        {stockdata.length > 1 && (
                                            <>
                                                <h3 className={`text-xl font-bold mt-1 ${stockdata[0].close > stockdata[stockdata.length - 1].close
                                                    ? 'text-green-400'
                                                    : stockdata[0].close < stockdata[stockdata.length - 1].close
                                                        ? 'text-red-400'
                                                        : 'text-white'
                                                    }`}>
                                                    {((stockdata[0].close - stockdata[stockdata.length - 1].close) / stockdata[stockdata.length - 1].close * 100).toFixed(2)}%
                                                </h3>
                                                <p className="text-xs text-neutral-500 mt-1">
                                                    First to last entry
                                                </p>
                                            </>
                                        )}
                                    </div>
                                    <div className="bg-purple-400/10 p-3 rounded-lg">
                                        <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>


                <div className="bg-neutral-800/40 rounded-2xl shadow-xl border border-neutral-700/50 overflow-hidden">
                    <div className="p-6 border-b border-neutral-700">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                Price History
                                <span className="bg-blue-500/20 text-blue-300 text-sm font-medium px-3 py-1 rounded-full flex items-center">
                                    <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                    </svg>
                                    {stockdata.length} records
                                </span>
                            </h2>
                            <div className="flex space-x-2">
                                <button
                                    className="bg-neutral-700 cursor-pointer hover:bg-neutral-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                    onClick={() => {
                                        setLoading(true);
                                        setError(null);
                                        fetchStocks();
                                    }}
                                >
                                    Refresh
                                </button>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center p-12">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-400"></div>
                        </div>
                    ) : error ? (
                        <div className="p-12 text-center">
                            <div className="text-red-400 mb-2">Error loading stock data</div>
                            <p className="text-neutral-400">{error}</p>
                        </div>
                    ) : stockdata.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="text-neutral-300 mb-2 text-xl">No historical data available</div>
                            <p className="text-neutral-400 mb-6">There's currently no price history data for this instrument.</p>
                            <button
                                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
                                onClick={() => {
                                    setLoading(true);
                                    setError(null);
                                    fetchStocks();
                                }}
                            >
                                Refresh Data
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto mb-10" style={{ maxHeight: "calc(100vh - 450px)" }}>
                            <table className="min-w-full divide-y divide-neutral-700/50">
                                <thead className="bg-neutral-700/50 sticky top-0">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">#</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Instrument</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Open</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">High</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Low</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Close</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Volume</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Date-Time</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-neutral-800/20 divide-y divide-neutral-700/50">
                                    {stockdata.map((stock, index) => (
                                        <tr key={stock.id} className="hover:bg-neutral-700/20 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">{index + 1}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                                                        <span className="text-blue-400 font-semibold">{instrument?.charAt(0) || 'S'}</span>
                                                    </div>
                                                    <span className="font-medium text-white">{instrument}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">${stock.open.toFixed(2)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">${stock.high.toFixed(2)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-400">${stock.low.toFixed(2)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">${stock.close.toFixed(2)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{stock.volume.toLocaleString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">{formatDate(stock.datetime)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>


            </div>
        </div>
    );
}

export default Stockdata;