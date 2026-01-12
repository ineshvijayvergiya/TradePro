"use client";

import React, { useState } from 'react';
import Link from 'next/link'; // 👈 CHANGE 1: Ye Import add kiya hai
import { 
  Globe, 
  Clock, 
  Search, 
  Zap,
  Calendar,
  Share2,
  Bookmark,
  Loader2
} from 'lucide-react';

// --- MOCK DATA ---
const INITIAL_NEWS_DATA = [
  {
    id: 1,
    source: "Bloomberg",
    title: "US Fed Signals Potential Rate Cut in June as Inflation Cools",
    summary: "Federal Reserve officials expressed confidence that inflation is moving towards the 2% target, sparking a rally in global tech stocks.",
    time: "2 mins ago",
    category: "Global Economy",
    sentiment: "Bullish",
    tags: ["USD", "GOLD", "NASDAQ"],
    image: "https://images.unsplash.com/photo-1611974765270-ca1258634369?auto=format&fit=crop&q=80&w=200&h=120"
  },
  {
    id: 2,
    source: "Reuters",
    title: "Reliance Industries to acquire major stake in European Solar Firm",
    summary: "The conglomerate expands its green energy portfolio with a $2B acquisition deal expected to close next quarter.",
    time: "15 mins ago",
    category: "Indian Market",
    sentiment: "Bullish",
    tags: ["RELIANCE", "NIFTY"],
    image: "https://images.unsplash.com/photo-1593672715438-d88a70629afd?auto=format&fit=crop&q=80&w=200&h=120"
  },
  {
    id: 3,
    source: "CoinDesk",
    title: "Bitcoin faces resistance at $68,000 amidst regulatory concerns",
    summary: "SEC's new guidelines on crypto custody might delay institutional adoption, causing short-term volatility.",
    time: "45 mins ago",
    category: "Crypto",
    sentiment: "Bearish",
    tags: ["BTC", "ETH"],
    image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&q=80&w=200&h=120"
  },
  {
    id: 4,
    source: "CNBC",
    title: "Crude Oil prices jump 3% due to Middle East tensions",
    summary: "Supply chain disruptions in the Red Sea have led to a sharp increase in Brent Crude prices this morning.",
    time: "1 hour ago",
    category: "Commodities",
    sentiment: "Bearish", 
    tags: ["CRUDEOIL", "ONGC"],
    image: "https://images.unsplash.com/photo-1518655048521-f130df041f66?auto=format&fit=crop&q=80&w=200&h=120"
  },
  {
    id: 5,
    source: "MoneyControl",
    title: "TCS Q4 Results: Revenue up 4%, misses street estimates",
    summary: "IT giant reports steady growth but margins remain under pressure due to wage hikes.",
    time: "2 hours ago",
    category: "Earnings",
    sentiment: "Neutral",
    tags: ["TCS", "IT"],
    image: null
  }
];

const EXTRA_STORIES = [
    {
      id: 6,
      source: "Mint",
      title: "HDFC Bank merger synergies to take longer than expected",
      summary: "Management indicates that full integration benefits will reflect in books by FY26.",
      time: "3 hours ago",
      category: "Indian Market",
      sentiment: "Neutral",
      tags: ["HDFCBANK", "BANKNIFTY"],
      image: null
    },
    {
      id: 7,
      source: "The Verge",
      title: "Nvidia announces new AI chip, stocks rally 5%",
      summary: "The new Blackwell architecture promises 30x performance improvement.",
      time: "4 hours ago",
      category: "Global Economy",
      sentiment: "Bullish",
      tags: ["NVDA", "AI"],
      image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=200&h=120"
    }
];

const ECONOMIC_CALENDAR = [
  { time: "14:30", event: "US CPI Data", impact: "High", actual: "3.2%", forecast: "3.1%" },
  { time: "19:00", event: "FOMC Minutes", impact: "High", actual: "-", forecast: "-" },
  { time: "Tomorrow", event: "RBI Policy", impact: "Medium", actual: "-", forecast: "6.5%" },
];

export default function NewsPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  
  const [stories, setStories] = useState(INITIAL_NEWS_DATA);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const filters = ["All", "Global Economy", "Indian Market", "Crypto", "Commodities"];

  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
        setStories([...stories, ...EXTRA_STORIES]); 
        setLoadingMore(false);
        setHasMore(false); 
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b0f14] pb-20">
      
      {/* --- LIVE TICKER BAR --- */}
      <div className="bg-red-600 text-white text-xs font-bold py-2 px-4 flex items-center gap-4 overflow-hidden whitespace-nowrap">
        <span className="bg-white text-red-600 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider animate-pulse">Live</span>
        <div className="animate-marquee inline-block">
          SENSEX hits all-time high of 75,000 • GOLD drops below $2300 • APPLE launches new AI chip • ELON MUSK tweets about Dogecoin...
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 lg:p-6 space-y-6">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Globe className="text-blue-500" /> Global News Wire
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Real-time financial intelligence</p>
          </div>
          
          <div className="relative w-full md:w-96">
            <input 
              type="text" 
              placeholder="Search symbols (e.g., RELIANCE)..." 
              className="w-full bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-800 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-gray-200"
            />
            <Search size={18} className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        {/* --- MAIN GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT: NEWS FEED */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {filters.map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                    activeFilter === filter 
                      ? "bg-blue-600 border-blue-600 text-white" 
                      : "bg-white dark:bg-[#161b22] border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* News List */}
            <div className="space-y-4">
              {stories.map((news) => (
                <div key={news.id} className="bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-800 rounded-xl p-4 hover:border-blue-500/30 transition-all group cursor-pointer animate-fade-in">
                  <div className="flex gap-4">
                    
                    {/* Image with Error Handling */}
                    {news.image && (
                      <div className="hidden sm:block w-32 h-20 flex-shrink-0 rounded-lg overflow-hidden relative bg-gray-100 dark:bg-gray-800">
                        <img 
                          src={news.image} 
                          alt="News" 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}

                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">{news.source}</span>
                           <span className="text-[10px] text-gray-400 flex items-center gap-1"><Clock size={10} /> {news.time}</span>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                             news.sentiment === 'Bullish' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                             news.sentiment === 'Bearish' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                             'bg-gray-500/10 text-gray-500 border-gray-500/20'
                        }`}>
                             {news.sentiment}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-gray-800 dark:text-gray-200 leading-tight group-hover:text-blue-500 transition-colors">
                        {news.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                        {news.summary}
                      </p>

                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex gap-2">
                          {news.tags.map(tag => (
                            <span key={tag} className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-3 text-gray-400">
                           <Share2 size={16} className="hover:text-blue-500" />
                           <Bookmark size={16} className="hover:text-blue-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Load More Button */}
            {hasMore ? (
                <button 
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="w-full py-3 bg-gray-100 dark:bg-[#161b22] border border-gray-200 dark:border-gray-800 text-sm font-medium text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  {loadingMore ? (
                    <> <Loader2 size={16} className="animate-spin" /> Loading... </>
                  ) : (
                    "Load More Stories"
                  )}
                </button>
            ) : (
                <p className="text-center text-xs text-gray-500 mt-4">You're all caught up!</p>
            )}

          </div>

          {/* RIGHT: WIDGETS */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Calendar */}
            <div className="bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-800 rounded-xl p-5">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Calendar size={18} className="text-orange-500" /> Economic Calendar
              </h3>
              <div className="space-y-4">
                {ECONOMIC_CALENDAR.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                     <div className="flex gap-3 items-center">
                        <span className="text-xs font-mono text-gray-500 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">{item.time}</span>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-gray-200">{item.event}</p>
                          <p className="text-[10px] text-gray-500">Fcst: {item.forecast}</p>
                        </div>
                     </div>
                     <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                       item.impact === 'High' ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'
                     }`}>
                       {item.impact}
                     </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending */}
            <div className="bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-800 rounded-xl p-5">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Zap size={18} className="text-yellow-500" /> Trending Tickers
              </h3>
              <div className="space-y-3">
                {[
                  { name: "NVDA", price: "$880.4", chg: "+2.4%", up: true },
                  { name: "RELIANCE", price: "₹2,940", chg: "-0.8%", up: false },
                  { name: "BTC/USD", price: "$69,420", chg: "+5.1%", up: true },
                  { name: "XAU/USD", price: "$2,350", chg: "+0.4%", up: true },
                ].map((asset, i) => (
                  <div key={i} className="flex justify-between items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded cursor-pointer transition-colors">
                    <span className="font-bold text-sm text-gray-700 dark:text-gray-300">{asset.name}</span>
                    <div className="text-right">
                      <span className="block text-xs text-gray-500">{asset.price}</span>
                      <span className={`text-xs font-bold ${asset.up ? 'text-green-500' : 'text-red-500'}`}>
                        {asset.chg}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pro Ad */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-5 text-center text-white">
              <h3 className="font-bold text-lg mb-2">Get Real-time Alerts</h3>
              <p className="text-xs text-blue-100 mb-4">Don't miss a beat. Upgrade to Pro for instant SMS & WhatsApp signals.</p>
              
              {/* 👇 CHANGE 2: Link component add kiya hai */}
              <Link href="/dashboard/subscription">
                <button className="w-full bg-white text-blue-600 text-xs font-bold px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition-colors">
                  Upgrade to Pro
                </button>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}