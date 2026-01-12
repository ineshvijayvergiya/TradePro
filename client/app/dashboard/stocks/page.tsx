"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ArrowUpDown, Filter, TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';

// --- MOCK DATABASE (Badi List) ---
const ALL_STOCKS = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2980.50, change: 1.45, sector: 'Energy' },
  { symbol: 'TCS', name: 'Tata Consultancy Svcs', price: 3950.20, change: -0.80, sector: 'IT' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', price: 1520.40, change: 0.25, sector: 'Finance' },
  { symbol: 'INFY', name: 'Infosys Limited', price: 1480.00, change: -1.20, sector: 'IT' },
  { symbol: 'TATAMOTORS', name: 'Tata Motors', price: 980.00, change: 2.10, sector: 'Auto' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd', price: 1080.50, change: 0.90, sector: 'Finance' },
  { symbol: 'SBIN', name: 'State Bank of India', price: 760.30, change: -0.45, sector: 'Finance' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel', price: 1200.10, change: 1.15, sector: 'Telecom' },
  { symbol: 'ITC', name: 'ITC Limited', price: 430.00, change: -0.10, sector: 'FMCG' },
  { symbol: 'L&T', name: 'Larsen & Toubro', price: 3600.00, change: 3.50, sector: 'Construction' },
  { symbol: 'AXISBANK', name: 'Axis Bank Ltd', price: 1100.00, change: 0.60, sector: 'Finance' },
  { symbol: 'MARUTI', name: 'Maruti Suzuki', price: 12500.00, change: -1.50, sector: 'Auto' },
  { symbol: 'SUNPHARMA', name: 'Sun Pharma', price: 1550.00, change: 0.80, sector: 'Pharma' },
  { symbol: 'TITAN', name: 'Titan Company', price: 3700.00, change: 1.20, sector: 'Consumer' },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance', price: 6800.00, change: -2.30, sector: 'Finance' },
  { symbol: 'ADANIENT', name: 'Adani Enterprises', price: 3150.00, change: 4.50, sector: 'Energy' },
  { symbol: 'WIPRO', name: 'Wipro Limited', price: 480.00, change: -0.90, sector: 'IT' },
  { symbol: 'ZOMATO', name: 'Zomato Ltd', price: 165.00, change: 2.80, sector: 'Tech' },
  { symbol: 'PAYTM', name: 'One 97 Comm', price: 400.00, change: -4.50, sector: 'Tech' },
  { symbol: 'MRF', name: 'MRF Tyres', price: 130000.00, change: 0.10, sector: 'Auto' },
];

export default function AllStocksPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortType, setSortType] = useState('market_cap'); // default

  // --- FILTER & SORT LOGIC ---
  const filteredStocks = ALL_STOCKS.filter(stock => 
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    if (sortType === 'price_high') return b.price - a.price;
    if (sortType === 'price_low') return a.price - b.price;
    if (sortType === 'gainers') return b.change - a.change;
    if (sortType === 'losers') return a.change - b.change;
    return 0; // Default
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 pb-20">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Market Watch</h1>
          <p className="text-slate-500 dark:text-gray-400 mt-1">Explore all listed companies and live prices.</p>
        </div>
        
        {/* FILTERS */}
        <div className="flex gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 md:w-64 group">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500 group-focus-within:text-blue-500" />
                <input 
                    type="text" 
                    placeholder="Search stock..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-800 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
                <div className="absolute left-3 top-2.5 pointer-events-none">
                    <ArrowUpDown size={14} className="text-gray-500"/>
                </div>
                <select 
                    value={sortType}
                    onChange={(e) => setSortType(e.target.value)}
                    className="h-full bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-800 rounded-xl py-2 pl-9 pr-4 text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                    <option value="market_cap">Default</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="gainers">Top Gainers</option>
                    <option value="losers">Top Losers</option>
                </select>
            </div>
        </div>
      </div>

      {/* STOCKS LIST */}
      <div className="bg-white dark:bg-[#161b22] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-[#0d1117] text-slate-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
                    <tr>
                        <th className="px-6 py-4 font-semibold">Company</th>
                        <th className="px-6 py-4 font-semibold text-right">Price</th>
                        <th className="px-6 py-4 font-semibold text-right">Change %</th>
                        <th className="px-6 py-4 font-semibold text-right">Sector</th>
                        <th className="px-6 py-4 font-semibold text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {filteredStocks.length > 0 ? (
                        filteredStocks.map((stock) => (
                            <tr key={stock.symbol} className="hover:bg-slate-50 dark:hover:bg-gray-800/40 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-slate-900 dark:text-white">{stock.symbol}</div>
                                    <div className="text-xs text-slate-500 dark:text-gray-500">{stock.name}</div>
                                </td>
                                <td className="px-6 py-4 text-right font-mono font-medium text-slate-900 dark:text-white">
                                    ₹{stock.price.toLocaleString()}
                                </td>
                                <td className={`px-6 py-4 text-right font-bold ${stock.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    <div className="flex items-center justify-end gap-1">
                                        {stock.change > 0 ? '+' : ''}{stock.change}%
                                        {stock.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className="px-2 py-1 bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-400 rounded text-xs">
                                        {stock.sector}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Link 
                                        href={`/dashboard/trade?symbol=${stock.symbol}`} // Pass symbol if needed later, currently static routing
                                        className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold text-xs hover:underline"
                                    >
                                        TRADE <ChevronRight size={14} />
                                    </Link>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-slate-500 dark:text-gray-400">
                                No stocks found matching "{searchTerm}"
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>

    </div>
  );
}