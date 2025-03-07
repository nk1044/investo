import React, { useState, useEffect } from 'react';
import { getAllStocks } from '../Server/server.js';
import { useNavigate } from 'react-router-dom';

function Stocks() {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const fetchStocks = async () => {
        try {
            const data = await getAllStocks();
            //   console.log(data);
            setStocks(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchStocks();
    }, []);

    return (
        <div className="min-h-screen bg-neutral-900 text-neutral-100 pt-24 px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <span className="inline-block px-3 py-1 text-sm font-medium text-blue-400 bg-blue-400/10 rounded-full mb-4">Market Explorer</span>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                        Available <span className="text-blue-400">Stocks</span>
                    </h1>
                    <p className="text-neutral-300 max-w-2xl mx-auto">
                        Browse our comprehensive collection of stocks from global markets. Get real-time data and in-depth analysis for informed trading decisions.
                    </p>
                </div>


                {/* Stock List Section */}
                <div className="bg-neutral-800/40 rounded-2xl shadow-xl border border-neutral-700/50 overflow-hidden">
                    <div className="p-6 border-b border-neutral-700">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">Stock List</h2>
                            <div className="flex space-x-2">

                                <button className="bg-neutral-700 cursor-pointer hover:bg-neutral-600 text-white px-4 py-2 
                rounded-lg text-sm font-medium transition-colors"
                                    onClick={() => {
                                        setLoading(true);
                                        setError(null);
                                        fetchStocks();
                                    }
                                    }>
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
                            <div className="text-red-400 mb-2">Error loading stocks</div>
                            <p className="text-neutral-400">{error}</p>
                        </div>
                    ) : stocks.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="text-neutral-300 mb-2 text-xl">No stocks available</div>
                            <p className="text-neutral-400 mb-6">Check back later for updates to our stock listings.</p>
                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors">
                                Refresh Listings
                            </button>
                        </div>
                    ) : (
                        <div>
                            <div className="bg-neutral-700/50 px-6 py-3 grid grid-cols-12">
                                <div className="col-span-1 text-neutral-400 text-sm font-medium">index</div>
                                <div className="col-span-5 text-neutral-400 text-sm font-medium">Instrument</div>
                            </div>

                            {stocks.map((stock, index) => (
                                <div key={stock.id} className="divide-y cursor-pointer divide-neutral-700/50"
                                onClick={() => navigate(`/stocks-data/${stock.instrument}`)}
                                >
                                    <div className="px-6 py-4 grid grid-cols-12 items-center hover:bg-neutral-700/20 transition-colors">
                                        <div className="col-span-1 text-neutral-400">{index + 1}</div>
                                        <div className="col-span-5">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                                                    <span className="text-blue-400 font-semibold">{stock.instrument.charAt(0)}</span>
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-white">{stock.instrument}</h3>
                                                    <p className="text-xs text-neutral-400">ID: {stock.id}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Stocks;