"use client";

import React from 'react';
import { ArrowUp, ArrowDown, TrendingUp, BarChart2 } from 'lucide-react';

export default function FNODashboard() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto pb-20">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="text-blue-500" /> F&O Dashboard
        </h1>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded text-sm font-medium border border-green-500/20">PCR: 1.2 (Bullish)</span>
          <span className="px-3 py-1 bg-red-500/10 text-red-500 rounded text-sm font-medium border border-red-500/20">VIX: 12.5 (-2%)</span>
        </div>
      </div>

      {/* Spot Prices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* NIFTY CARD */}
        <div className="bg-white dark:bg-[#161b22] p-6 rounded-xl border border-gray-200 dark:border-gray-800 flex justify-between items-center relative overflow-hidden">
           <div className="relative z-10">
              <h2 className="text-gray-500 text-sm font-bold uppercase tracking-wider">Nifty 50</h2>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mt-1">22,430.50</div>
              <div className="text-green-500 font-medium flex items-center gap-1 mt-1">
                 <ArrowUp size={16} /> 124.50 (0.56%)
              </div>
           </div>
           {/* Background Chart Effect */}
           <div className="absolute right-0 bottom-0 opacity-10">
              <BarChart2 size={100} className="text-blue-500" />
           </div>
        </div>

        {/* BANK NIFTY CARD */}
        <div className="bg-white dark:bg-[#161b22] p-6 rounded-xl border border-gray-200 dark:border-gray-800 flex justify-between items-center relative overflow-hidden">
           <div className="relative z-10">
              <h2 className="text-gray-500 text-sm font-bold uppercase tracking-wider">Bank Nifty</h2>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mt-1">47,820.10</div>
              <div className="text-red-500 font-medium flex items-center gap-1 mt-1">
                 <ArrowDown size={16} /> 150.20 (0.32%)
              </div>
           </div>
           <div className="absolute right-0 bottom-0 opacity-10">
              <BarChart2 size={100} className="text-purple-500" />
           </div>
        </div>
      </div>

      {/* Option Chain Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Open Interest Analysis */}
        <div className="lg:col-span-2 bg-white dark:bg-[#161b22] p-5 rounded-xl border border-gray-200 dark:border-gray-800">
           <h3 className="font-bold text-gray-800 dark:text-white mb-4">Open Interest (OI) Change</h3>
           
           {/* Fake Chart Bars */}
           <div className="space-y-4">
              <div className="flex items-center gap-2">
                 <span className="text-xs w-12 text-gray-500">22500 CE</span>
                 <div className="flex-1 h-4 bg-gray-800 rounded overflow-hidden">
                    <div className="h-full bg-red-500 w-[60%]"></div>
                 </div>
                 <span className="text-xs w-12 text-right text-red-500">32L</span>
              </div>
              <div className="flex items-center gap-2">
                 <span className="text-xs w-12 text-gray-500">22400 PE</span>
                 <div className="flex-1 h-4 bg-gray-800 rounded overflow-hidden">
                    <div className="h-full bg-green-500 w-[85%]"></div>
                 </div>
                 <span className="text-xs w-12 text-right text-green-500">45L</span>
              </div>
              <div className="flex items-center gap-2">
                 <span className="text-xs w-12 text-gray-500">22400 CE</span>
                 <div className="flex-1 h-4 bg-gray-800 rounded overflow-hidden">
                    <div className="h-full bg-red-500 w-[30%]"></div>
                 </div>
                 <span className="text-xs w-12 text-right text-red-500">15L</span>
              </div>
           </div>
           <div className="mt-4 text-xs text-gray-500 flex justify-between">
              <span>Note: Green bar indicates Put Writing (Support)</span>
              <span>Red bar indicates Call Writing (Resistance)</span>
           </div>
        </div>

        {/* Right: Top Movers */}
        <div className="bg-white dark:bg-[#161b22] p-5 rounded-xl border border-gray-200 dark:border-gray-800">
           <h3 className="font-bold text-gray-800 dark:text-white mb-4">Long Buildup</h3>
           <div className="space-y-3">
              {[
                 { name: "TATAMOTORS", price: "980.5", chg: "+4.5%" },
                 { name: "DLF", price: "920.1", chg: "+3.2%" },
                 { name: "SBIN", price: "760.0", chg: "+2.1%" },
              ].map((stock) => (
                 <div key={stock.name} className="flex justify-between items-center p-2 hover:bg-gray-800/50 rounded cursor-pointer">
                    <div>
                       <div className="font-bold text-sm text-gray-200">{stock.name}</div>
                       <div className="text-xs text-gray-500">Fut</div>
                    </div>
                    <div className="text-right">
                       <div className="font-bold text-sm text-white">{stock.price}</div>
                       <div className="text-xs text-green-500">{stock.chg}</div>
                    </div>
                 </div>
              ))}
           </div>
        </div>

      </div>

    </div>
  );
}