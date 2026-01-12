"use client";

import React, { useState, useEffect, useRef } from 'react';
import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts';
import { 
  ArrowLeft, Activity, Layers, Search, 
  Trophy, Wallet, RefreshCw, X, TrendingUp, TrendingDown, MoreVertical 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

// --- 1. MOCK STOCK DATABASE ---
const MOCK_STOCKS: Record<string, number> = {
    'RELIANCE': 2450.00,
    'TCS': 3890.00,
    'INFY': 1450.00,
    'HDFCBANK': 1520.00,
    'TATAMOTORS': 980.00,
    'AMAZON': 180.00,
    'APPLE': 175.00,
    'TESLA': 240.00,
    'MRF': 130000.00,
    'ZOMATO': 160.00,
    'SBI': 600.00
};

export default function TradePage() {
  const router = useRouter();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<any>(null);
  const lastCandleRef = useRef<any>(null); // 🔥 NEW: To track live candle

  // --- STATE ---
  const [symbol, setSymbol] = useState("RELIANCE");
  const [marketPrice, setMarketPrice] = useState(2450.00);
  const [inputPrice, setInputPrice] = useState(2450.00);
  const [qty, setQty] = useState(1);
  const [productType, setProductType] = useState<'MIS' | 'CNC'>('MIS');
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('MARKET');
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
  
  // 🔥 NEW: Timeframe State
  const [timeframe, setTimeframe] = useState('1m'); 
  
  // User Data State
  const [balance, setBalance] = useState(10000);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [rank, setRank] = useState(5000);
  
  // UI States
  const [showModal, setShowModal] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'CHART' | 'DEPTH'>('CHART');

  // --- LOAD USER DATA ---
  useEffect(() => {
      if (typeof window !== 'undefined') {
          const storedBal = Number(localStorage.getItem('tradeProBalance') || '10000');
          const storedPort = JSON.parse(localStorage.getItem('tradeProPortfolio') || '[]');
          setBalance(storedBal);
          setPortfolio(storedPort);

          const profit = storedBal - 10000;
          const calculatedRank = Math.max(1, 10000 - Math.floor(profit / 10)); 
          setRank(calculatedRank);
      }
  }, []);

  // --- CHART INIT ---
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: { background: { type: ColorType.Solid, color: '#0b0f14' }, textColor: '#6b7280' },
      grid: { vertLines: { color: '#1f2937' }, horzLines: { color: '#1f2937' } },
      width: chartContainerRef.current.clientWidth,
      height: 450,
      timeScale: { timeVisible: true, secondsVisible: false },
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#10b981', downColor: '#ef4444', borderVisible: false, wickUpColor: '#10b981', wickDownColor: '#ef4444',
    });
    
    chartRef.current = chart;
    seriesRef.current = series;

    const handleResize = () => {
        if(chartContainerRef.current) chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };
    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('resize', handleResize);
        chart.remove();
    };
  }, []);

  // Helper for Timeframe
  function getIntervalSeconds(tf: string) {
      switch(tf) {
          case '1m': return 60;
          case '5m': return 300;
          case '15m': return 900;
          case '1h': return 3600;
          case '1D': return 86400;
          default: return 60;
      }
  }

  // --- GENERATE CHART DATA (Updated for Live Updates) ---
  useEffect(() => {
      const basePrice = MOCK_STOCKS[symbol] || 500.00;
      setMarketPrice(basePrice);
      if(orderType === 'MARKET') setInputPrice(basePrice);

      let data = [];
      let time = Math.floor(Date.now() / 1000) - (200 * getIntervalSeconds(timeframe));
      let value = basePrice;
      
      const interval = getIntervalSeconds(timeframe);

      for (let i = 0; i < 200; i++) {
          const volatility = basePrice * 0.005; 
          let change = (Math.random() - 0.5) * volatility;
          let open = value;
          let close = value + change;
          let high = Math.max(open, close) + Math.random() * (volatility * 0.5);
          let low = Math.min(open, close) - Math.random() * (volatility * 0.5);
          
          const candle = { time: time + (i * interval), open, high, low, close };
          data.push(candle);
          value = close;
          
          // Save the very last candle to Ref so we can update it live
          if (i === 199) {
              lastCandleRef.current = candle;
          }
      }
      
      if(seriesRef.current) {
          seriesRef.current.setData(data);
      }
  }, [symbol, timeframe]);

  // --- LIVE TICKER (Moves Chart + Price) ---
  useEffect(() => {
      const interval = setInterval(() => {
          const volatility = marketPrice * 0.0005; 
          const movement = (Math.random() - 0.5) * volatility;
          const newPrice = Number((marketPrice + movement).toFixed(2));
          
          setMarketPrice(newPrice);
          if (orderType === 'MARKET') setInputPrice(newPrice);

          // 🔥 REAL-TIME CHART UPDATE LOGIC 🔥
          if (seriesRef.current && lastCandleRef.current) {
              const current = lastCandleRef.current;
              
              const updatedCandle = {
                  ...current,
                  close: newPrice, // Current price ab closing price hai
                  high: Math.max(current.high, newPrice), 
                  low: Math.min(current.low, newPrice),
              };

              seriesRef.current.update(updatedCandle);
              lastCandleRef.current = updatedCandle;
          }

      }, 1000); // 1 Second Update
      return () => clearInterval(interval);
  }, [marketPrice, orderType]);


  // --- SEARCH HANDLER ---
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
          const rawSym = e.currentTarget.value.toUpperCase();
          if(MOCK_STOCKS[rawSym]) {
              setSymbol(rawSym);
              setSearchOpen(false);
              toast.success(`Loaded ${rawSym}`);
          } else {
              setSymbol(rawSym);
              MOCK_STOCKS[rawSym] = 500.00; 
              toast('Symbol not found, using default price.', { icon: '⚠️' });
              setSearchOpen(false);
          }
      }
  };

  // --- EXECUTE ORDER ---
  const executeOrder = () => {
      const totalVal = inputPrice * qty;

      if(side === 'BUY') {
          if (balance < totalVal) {
              toast.error('Insufficient Funds!');
              setShowModal(false);
              return;
          }
          
          const newPortfolio = [...portfolio];
          const idx = newPortfolio.findIndex(p => p.symbol === symbol);
          
          if(idx > -1) {
              const old = newPortfolio[idx];
              const totalCost = (old.qty * old.avg) + totalVal;
              const totalQty = Number(old.qty) + Number(qty);
              newPortfolio[idx] = { ...old, qty: totalQty, avg: totalCost / totalQty };
          } else {
              newPortfolio.push({ symbol, qty, avg: inputPrice, ltp: inputPrice });
          }

          const newBalance = balance - totalVal;
          setBalance(newBalance);
          setPortfolio(newPortfolio);
          
          localStorage.setItem('tradeProBalance', newBalance.toString());
          localStorage.setItem('tradeProPortfolio', JSON.stringify(newPortfolio));
          
          toast.success(`Bought ${qty} ${symbol} @ ${inputPrice}`);
      } 
      
      if (side === 'SELL') {
          const idx = portfolio.findIndex(p => p.symbol === symbol);
          if (idx === -1 || portfolio[idx].qty < qty) {
              toast.error('Insufficient Holdings to Sell!');
              setShowModal(false);
              return;
          }

          const newPortfolio = [...portfolio];
          newPortfolio[idx].qty -= qty;
          if(newPortfolio[idx].qty === 0) newPortfolio.splice(idx, 1);

          const newBalance = balance + totalVal;
          setBalance(newBalance);
          setPortfolio(newPortfolio);

          localStorage.setItem('tradeProBalance', newBalance.toString());
          localStorage.setItem('tradeProPortfolio', JSON.stringify(newPortfolio));

          toast.success(`Sold ${qty} ${symbol} @ ${inputPrice}`);
      }
      setShowModal(false);
  };

  // Helpers
  const currentHolding = portfolio.find(p => p.symbol === symbol);
  const holdingQty = currentHolding?.qty || 0;
  const holdingAvg = currentHolding?.avg || 0;
  const holdingPnL = holdingQty * (marketPrice - holdingAvg);

  return (
    <div className="flex flex-col h-screen bg-[#0b0f14] text-gray-300 font-sans overflow-hidden">
      
      {/* 1. HEADER */}
      <header className="h-14 bg-[#161b22] border-b border-[#22262e] flex items-center justify-between px-4 shrink-0 z-20">
        <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-[#22262e] rounded-lg text-gray-400 hover:text-white transition-colors">
                <ArrowLeft size={20} />
            </button>
            
            {searchOpen ? (
                <div className="flex items-center bg-[#0d1117] border border-[#30363d] rounded-lg px-2 animate-in fade-in zoom-in duration-200">
                    <Search size={16} />
                    <input 
                        autoFocus
                        className="bg-transparent border-none focus:ring-0 text-sm px-2 py-1 text-white outline-none w-32 uppercase font-bold"
                        placeholder="SYMBOL (e.g. TCS)"
                        onBlur={() => setSearchOpen(false)}
                        onKeyDown={handleSearch}
                    />
                </div>
            ) : (
                <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setSearchOpen(true)}>
                    <h1 className="font-bold text-white tracking-tight text-lg">{symbol}</h1>
                    <span className="text-[10px] font-bold bg-[#22262e] text-gray-400 px-1.5 py-0.5 rounded border border-[#30363d]">NSE</span>
                    <Search size={14} className="text-gray-500 group-hover:text-white transition-colors" />
                </div>
            )}
        </div>

        <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-3 bg-[#21262d] px-3 py-1.5 rounded-lg border border-[#30363d]">
                <div className="flex items-center gap-2">
                    <Wallet size={14} className="text-blue-400" />
                    <span className="text-xs font-mono font-bold text-white">₹{balance.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div className="w-px h-3 bg-gray-600"></div>
                <div className="flex items-center gap-2">
                    <Trophy size={14} className="text-yellow-500" />
                    <span className="text-xs font-bold text-white">Rank #{rank}</span>
                </div>
            </div>
            <button className="p-2 hover:bg-[#22262e] rounded text-gray-400"><MoreVertical size={18} /></button>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
         
         {/* LEFT COLUMN */}
         <div className="flex-1 flex flex-col min-w-0 bg-[#0b0f14] relative">
            
            {/* Chart Toolbar (Fix: Buttons work now) */}
            <div className="h-10 border-b border-[#22262e] flex items-center px-4 gap-4 text-xs font-medium text-gray-500 bg-[#0b0f14]">
                <div className="flex bg-[#161b22] rounded border border-[#30363d] p-0.5">
                    {['1m', '5m', '15m', '1h', '1D'].map(tf => (
                        <button 
                            key={tf} 
                            onClick={() => setTimeframe(tf)} // 🔥 Update Timeframe
                            className={`px-2.5 py-0.5 rounded transition-colors ${timeframe === tf ? 'bg-[#21262d] text-white' : 'hover:text-white hover:bg-[#22262e]'}`}
                        >
                            {tf}
                        </button>
                    ))}
                </div>
                <div className="h-4 w-px bg-[#30363d]"></div>
                <button className={`flex items-center gap-1 transition-colors ${activeTab === 'CHART' ? 'text-blue-400' : 'hover:text-white'}`} onClick={() => setActiveTab('CHART')}>
                    <Activity size={14}/> Chart
                </button>
                <button className={`flex items-center gap-1 transition-colors ${activeTab === 'DEPTH' ? 'text-blue-400' : 'hover:text-white'}`} onClick={() => setActiveTab('DEPTH')}>
                    <Layers size={14}/> Depth
                </button>
            </div>

            {/* Chart Container */}
            <div className="flex-1 relative w-full h-full">
                <div ref={chartContainerRef} className={`absolute inset-0 ${activeTab === 'CHART' ? 'block' : 'hidden'}`} />
                
                {/* 🔥 REAL MARKET DEPTH UI 🔥 */}
                {activeTab === 'DEPTH' && (
                    <div className="flex h-full gap-1 p-2 bg-[#0b0f14]">
                        <div className="flex-1 bg-[#161b22] rounded border border-[#22262e] p-2 flex flex-col">
                            <h3 className="text-xs font-bold text-blue-400 mb-2 uppercase border-b border-blue-500/20 pb-1">Bid (Buyers)</h3>
                            <div className="space-y-1 overflow-y-auto custom-scrollbar">
                                {[...Array(15)].map((_, i) => (
                                    <div key={i} className="flex justify-between text-xs font-mono border-b border-[#22262e] py-1 last:border-0 hover:bg-[#22262e] px-1 transition-colors">
                                        <span className="text-white">{(marketPrice - (i * 0.05 + 0.05)).toFixed(2)}</span>
                                        <span className="text-blue-500 font-bold">{Math.floor(Math.random() * 500) + 10}</span>
                                        <div className="w-12 h-1 bg-blue-500/20 rounded-full mt-1.5 overflow-hidden">
                                            <div className="h-full bg-blue-500" style={{width: `${Math.random() * 100}%`}}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 bg-[#161b22] rounded border border-[#22262e] p-2 flex flex-col">
                            <h3 className="text-xs font-bold text-red-400 mb-2 uppercase border-b border-red-500/20 pb-1">Ask (Sellers)</h3>
                            <div className="space-y-1 overflow-y-auto custom-scrollbar">
                                {[...Array(15)].map((_, i) => (
                                    <div key={i} className="flex justify-between text-xs font-mono border-b border-[#22262e] py-1 last:border-0 hover:bg-[#22262e] px-1 transition-colors">
                                        <span className="text-white">{(marketPrice + (i * 0.05 + 0.05)).toFixed(2)}</span>
                                        <span className="text-red-500 font-bold">{Math.floor(Math.random() * 500) + 10}</span>
                                        <div className="w-12 h-1 bg-red-500/20 rounded-full mt-1.5 overflow-hidden">
                                            <div className="h-full bg-red-500" style={{width: `${Math.random() * 100}%`}}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* YOUR POSITION PANEL */}
            <div className="h-40 bg-[#161b22] border-t border-[#22262e] p-4 animate-in slide-in-from-bottom duration-300">
                <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                    <Wallet size={14}/> Your Position: {symbol}
                </h3>
                {holdingQty > 0 ? (
                    <div className="flex gap-10">
                        <div>
                            <p className="text-[10px] text-gray-500 font-bold tracking-wider">QUANTITY</p>
                            <p className="text-2xl font-bold text-white mt-1">{holdingQty}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-500 font-bold tracking-wider">AVG. PRICE</p>
                            <p className="text-2xl font-bold text-white mt-1">₹{holdingAvg.toFixed(2)}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-500 font-bold tracking-wider">P&L</p>
                            <div className={`text-2xl font-bold flex items-center gap-1 mt-1 ${holdingPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {holdingPnL >= 0 ? '+' : ''}₹{holdingPnL.toFixed(2)}
                                {holdingPnL >= 0 ? <TrendingUp size={16}/> : <TrendingDown size={16}/>}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-[#22262e] rounded-xl text-sm text-gray-500">
                        <p>No open positions in {symbol}</p>
                        <span className="text-xs opacity-50">Place an order to see details here</span>
                    </div>
                )}
            </div>
         </div>

         {/* RIGHT: ORDER PANEL */}
         <aside className="w-80 bg-[#161b22] border-l border-[#22262e] flex flex-col shrink-0 z-10 shadow-xl">
            {/* Tabs */}
            <div className="flex border-b border-[#22262e]">
                <button onClick={() => setSide('BUY')} className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${side === 'BUY' ? 'border-green-500 text-green-500 bg-green-500/5' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>BUY</button>
                <button onClick={() => setSide('SELL')} className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${side === 'SELL' ? 'border-red-500 text-red-500 bg-red-500/5' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>SELL</button>
            </div>

            <div className="p-5 space-y-6 flex-1 overflow-y-auto">
                {/* Order Type Toggle */}
                <div className="flex bg-[#0d1117] rounded-lg border border-[#30363d] p-1">
                    <button onClick={() => setOrderType('MARKET')} className={`flex-1 py-1.5 text-xs font-bold rounded transition-all ${orderType === 'MARKET' ? 'bg-[#21262d] text-white shadow' : 'text-gray-500 hover:text-gray-300'}`}>Market</button>
                    <button onClick={() => setOrderType('LIMIT')} className={`flex-1 py-1.5 text-xs font-bold rounded transition-all ${orderType === 'LIMIT' ? 'bg-[#21262d] text-white shadow' : 'text-gray-500 hover:text-gray-300'}`}>Limit</button>
                </div>

                {/* Inputs */}
                <div className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Quantity</label>
                        <div className="relative group">
                            <input 
                                type="number" 
                                value={qty} 
                                onChange={(e) => setQty(Number(e.target.value))} 
                                className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg py-3 px-4 text-white font-mono text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all group-hover:border-gray-600"
                            />
                            <span className="absolute right-4 top-3 text-xs text-gray-600">Qty</span>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Buying Price</label>
                        <div className="relative group">
                            <input 
                                type="number" 
                                value={inputPrice} 
                                // Disable input if MARKET order
                                disabled={orderType === 'MARKET'}
                                onChange={(e) => setInputPrice(Number(e.target.value))} 
                                className={`w-full bg-[#0d1117] border border-[#30363d] rounded-lg py-3 px-4 text-white font-mono text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all ${orderType === 'MARKET' ? 'opacity-50 cursor-not-allowed' : ''}`}
                            />
                            <span className="absolute right-4 top-3 text-xs text-gray-600">₹</span>
                        </div>
                    </div>
                </div>

                {/* Calculations */}
                <div className="bg-[#21262d]/50 rounded-lg p-4 space-y-3 border border-[#30363d]">
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Margin Required</span>
                        <span className="text-white font-mono font-bold">₹{(inputPrice * qty).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Available Cash</span>
                        <span className="text-white font-mono">₹{balance.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Execute Button */}
            <div className="p-4 border-t border-[#22262e] bg-[#0d1117]">
                <button 
                    onClick={() => setShowModal(true)} // 🔥 Opens Popup First
                    className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 ${
                        side === 'BUY' 
                        ? 'bg-green-600 hover:bg-green-500 shadow-green-900/20' 
                        : 'bg-red-600 hover:bg-red-500 shadow-red-900/20'
                    }`}
                >
                    {side} {symbol}
                </button>
            </div>
         </aside>
      </div>

      {/* POPUP CONFIRMATION */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 w-full max-w-md shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-white">Confirm Order</h3>
                    <button onClick={() => setShowModal(false)}><X size={20} className="text-gray-400 hover:text-white"/></button>
                </div>

                <div className="bg-[#0d1117] rounded-xl p-4 space-y-3 mb-6 border border-[#22262e]">
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Symbol</span><span className="font-bold text-white">{symbol}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Type</span><span className={`font-bold ${side==='BUY'?'text-green-500':'text-red-500'}`}>{side} / {productType}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Qty</span><span className="font-bold text-white">{qty}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Price</span><span className="font-bold text-white">₹{inputPrice}</span></div>
                    <div className="h-px bg-[#30363d] my-2"></div>
                    <div className="flex justify-between text-base"><span className="text-gray-400">Total Value</span><span className="font-bold text-white">₹{(qty * inputPrice).toFixed(2)}</span></div>
                </div>

                <div className="flex gap-3">
                    <button onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl border border-[#30363d] text-gray-300 hover:bg-[#22262e] font-bold transition-colors">Cancel</button>
                    <button onClick={executeOrder} className={`flex-1 py-3 rounded-xl text-white font-bold shadow-lg ${side==='BUY'?'bg-green-600 hover:bg-green-500':'bg-red-600 hover:bg-red-500'}`}>Confirm {side}</button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}