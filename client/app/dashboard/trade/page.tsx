"use client";

import React, { useState, useEffect, useRef } from 'react';
import { createChart, ColorType, CandlestickSeries, CrosshairMode } from 'lightweight-charts';
import { 
  ArrowLeft, Search, Wallet, TrendingUp, TrendingDown, 
  BarChart2, Settings, Clock, 
  Maximize2, Plus, Minus, X, AlertCircle,
  Pencil, MousePointer2, Type, Eraser, RotateCcw, 
  Share2, MoreHorizontal
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

// --- 🔥 REALISTIC MARKET DATABASE (Jan 2026 Estimates) ---
const MOCK_STOCKS: Record<string, number> = {
    // 🇮🇳 INDIAN STOCKS (NSE)
    'RELIANCE': 3250.00, 'TCS': 4150.00, 'HDFCBANK': 1750.00,
    'INFY': 1850.00, 'ICICIBANK': 1250.00, 'SBIN': 850.00,
    'BHARTIARTL': 1400.00, 'ITC': 520.00, 'L&T': 3800.00,
    'HINDUNILVR': 2900.00, 'TATAMOTORS': 1150.00, 'M&M': 2100.00,
    'MARUTI': 13500.00, 'ADANIENT': 3400.00, 'SUNPHARMA': 1600.00,
    'TITAN': 3800.00, 'BAJFINANCE': 7800.00, 'ASIANPAINT': 3200.00,
    'ULTRACEMCO': 10500.00, 'WIPRO': 550.00, 'JSWSTEEL': 950.00,
    'NTPC': 420.00, 'POWERGRID': 350.00, 'TATASTEEL': 180.00,
    'COALINDIA': 520.00, 'ONGC': 310.00, 'BPCL': 700.00,
    'EICHERMOT': 4900.00, 'HEROMOTOCO': 5100.00, 'DRREDDY': 6200.00,
    'ZOMATO': 280.00, 'PAYTM': 650.00, 'NYKAA': 190.00,
    'MRF': 155000.00, 'PAGEIND': 42000.00, 'BOSCHLTD': 32000.00,

    // 🇺🇸 US STOCKS (NASDAQ/NYSE - in USD converted to approx INR or keep USD logic)
    // For simplicity, showing in INR equivalent or assuming user trades in INR
    'APPLE': 15500.00, 'TESLA': 21000.00, 'MICROSOFT': 35000.00,
    'AMAZON': 14500.00, 'GOOGLE': 14000.00, 'META': 42000.00,
    'NVIDIA': 98000.00, 'NETFLIX': 52000.00,

    // 🪙 CRYPTO
    'BTC': 8400000.00, 'ETH': 320000.00, 'SOL': 12500.00,
    'BNB': 52000.00, 'XRP': 65.00, 'DOGE': 15.00,

    // 📈 INDICES
    'NIFTY 50': 25750.00, 'BANKNIFTY': 54200.00, 'SENSEX': 84500.00,
    
    // 🧈 COMMODITIES
    'GOLD': 145000.00, // per 10gm
    'SILVER': 275000.00, // per kg
    'CRUDEOIL': 6800.00,
    'NATURALGAS': 250.00,
    'COPPER': 850.00
};

export default function TradePage() {
  const router = useRouter();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<any>(null);
  const lastCandleRef = useRef<any>(null);

  // --- GLOBAL STATE ---
  const [symbol, setSymbol] = useState("RELIANCE");
  const [marketPrice, setMarketPrice] = useState(3250.00);
  const [inputPrice, setInputPrice] = useState(3250.00);
  const [qty, setQty] = useState(1);
  
  // Order State
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('MARKET');
  
  // User Data
  const [balance, setBalance] = useState(10000); 
  const [portfolio, setPortfolio] = useState<any[]>([]);
  
  // UI State
  const [timeframe, setTimeframe] = useState('5m');
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeBottomTab, setActiveBottomTab] = useState('POSITIONS');
  const [activeTool, setActiveTool] = useState('cursor');
  const [showOrderPanel, setShowOrderPanel] = useState(true);
  
  // Modal States
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // OHLC Stats
  const [stats, setStats] = useState({ o: 0, h: 0, l: 0, c: 0, vol: '2.4M' });

  // Order Book Data
  const [orderBook, setOrderBook] = useState<{bids: any[], asks: any[]}>({ bids: [], asks: [] });

  // --- 1. FORCE RESET TO 10K ---
  useEffect(() => {
      if (typeof window !== 'undefined') {
          const storedBal = Number(localStorage.getItem('tradeProBalance') || '10000');
          const storedPort = JSON.parse(localStorage.getItem('tradeProPortfolio') || '[]');

          if (storedBal > 12000) {
              setBalance(10000);
              setPortfolio([]);
              localStorage.setItem('tradeProBalance', '10000');
              localStorage.setItem('tradeProPortfolio', '[]');
              toast.success("Balance Reset to ₹10,000", { icon: '🔄' });
          } else {
              setBalance(storedBal);
              setPortfolio(storedPort);
          }
      }
  }, []);

  // --- 2. GENERATE ORDER BOOK DATA ---
  useEffect(() => {
      const bids = Array.from({ length: 5 }).map(() => ({
          width: Math.random() * 80,
          qty: Math.floor(Math.random() * 200),
      }));
      const asks = Array.from({ length: 5 }).map(() => ({
          width: Math.random() * 80,
          qty: Math.floor(Math.random() * 200),
      }));
      setOrderBook({ bids, asks });
  }, []);

  // --- CHART SETUP ---
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: { 
        background: { type: ColorType.Solid, color: '#131722' }, 
        textColor: '#d1d4dc',
      },
      grid: { 
        vertLines: { color: '#1f2937', style: 2 }, 
        horzLines: { color: '#1f2937', style: 2 } 
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      crosshair: { mode: CrosshairMode.Normal },
      timeScale: { 
          timeVisible: true, 
          secondsVisible: false,
          borderColor: '#2B2B43'
      },
      rightPriceScale: { borderColor: '#2B2B43' },
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#089981', downColor: '#f23645', 
      borderVisible: false, 
      wickUpColor: '#089981', wickDownColor: '#f23645',
    });
    
    chartRef.current = chart;
    seriesRef.current = series;

    const resizeObserver = new ResizeObserver(entries => {
        if (entries.length === 0 || entries[0].target !== chartContainerRef.current) { return; }
        const newRect = entries[0].contentRect;
        chart.applyOptions({ width: newRect.width, height: newRect.height });
    });

    resizeObserver.observe(chartContainerRef.current);

    return () => {
        resizeObserver.disconnect();
        chart.remove();
    };
  }, []);

  // --- DATA FEED SIMULATION ---
  useEffect(() => {
      // 🔥 FIX: Check MOCK list first, else fallback
      let basePrice = MOCK_STOCKS[symbol];
      
      // Smart Fallback: If exact match not found, try finding keys that *contain* the search
      if (!basePrice) {
          const key = Object.keys(MOCK_STOCKS).find(k => k.includes(symbol) || symbol.includes(k));
          if(key) basePrice = MOCK_STOCKS[key];
      }

      // If still not found, random gen (so app never breaks)
      if (!basePrice) {
          basePrice = Math.floor(Math.random() * 2000) + 100;
          MOCK_STOCKS[symbol] = basePrice; // Cache it
      }

      setMarketPrice(basePrice);
      if(orderType === 'MARKET') setInputPrice(basePrice);

      setStats({
          o: basePrice - 5, h: basePrice + 10, l: basePrice - 8, c: basePrice, vol: (Math.random() * 10).toFixed(2) + 'M'
      });

      let data = [];
      let time = Math.floor(Date.now() / 1000) - (300 * 300); 
      let value = basePrice;
      
      for (let i = 0; i < 300; i++) {
          const volatility = basePrice * 0.002;
          let change = (Math.random() - 0.5) * volatility;
          let open = value;
          let close = value + change;
          let high = Math.max(open, close) + Math.random() * (volatility * 0.5);
          let low = Math.min(open, close) - Math.random() * (volatility * 0.5);
          
          const candle = { time: time + (i * 300), open, high, low, close };
          data.push(candle);
          value = close;
          
          if (i === 299) lastCandleRef.current = candle;
      }
      
      if(seriesRef.current) seriesRef.current.setData(data);

  }, [symbol, timeframe]);

  // --- LIVE PRICE TICKER ---
  useEffect(() => {
      const interval = setInterval(() => {
          const volatility = marketPrice * 0.0002;
          const movement = (Math.random() - 0.5) * volatility;
          const newPrice = Number((marketPrice + movement).toFixed(2));
          
          setMarketPrice(newPrice);
          if (orderType === 'MARKET') setInputPrice(newPrice);

          if (seriesRef.current && lastCandleRef.current) {
              const current = lastCandleRef.current;
              const updatedCandle = {
                  ...current,
                  close: newPrice,
                  high: Math.max(current.high, newPrice),
                  low: Math.min(current.low, newPrice),
              };
              seriesRef.current.update(updatedCandle);
              lastCandleRef.current = updatedCandle;
              
              setStats(prev => ({
                  ...prev, c: newPrice, h: Math.max(prev.h, newPrice), l: Math.min(prev.l, newPrice)
              }));
          }
      }, 1000);
      return () => clearInterval(interval);
  }, [marketPrice, orderType]);

  // --- ORDER EXECUTION ---
  const handleOrder = () => {
      const totalVal = inputPrice * qty;

      if(side === 'BUY') {
          if(balance < totalVal) return toast.error('Insufficient Funds');
          
          const newPort = [...portfolio];
          const idx = newPort.findIndex(p => p.symbol === symbol);
          if(idx > -1) {
              const old = newPort[idx];
              const totalCost = (old.qty * old.avg) + totalVal;
              const totalQty = Number(old.qty) + Number(qty);
              newPort[idx] = { ...old, qty: totalQty, avg: totalCost / totalQty };
          } else {
              newPort.push({ symbol, qty, avg: inputPrice });
          }
          
          const newBal = balance - totalVal;
          setBalance(newBal);
          setPortfolio(newPort);
          saveData(newBal, newPort);
          toast.success(`Bought ${qty} ${symbol}`);
      } else {
          const idx = portfolio.findIndex(p => p.symbol === symbol);
          if(idx === -1 || portfolio[idx].qty < qty) return toast.error('Check Holdings');
          
          const newPort = [...portfolio];
          newPort[idx].qty -= qty;
          if(newPort[idx].qty === 0) newPort.splice(idx, 1);
          
          const newBal = balance + totalVal;
          setBalance(newBal);
          setPortfolio(newPort);
          saveData(newBal, newPort);
          toast.success(`Sold ${qty} ${symbol}`);
      }
  };

  const saveData = (bal: number, port: any[]) => {
      localStorage.setItem('tradeProBalance', bal.toString());
      localStorage.setItem('tradeProPortfolio', JSON.stringify(port));
  };

  // 🔥 FIX: Allow any search input
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if(e.key === 'Enter') {
          const val = e.currentTarget.value.toUpperCase().trim();
          if(!val) return;

          setSymbol(val);
          setSearchOpen(false);
          
          if(MOCK_STOCKS[val]) {
              toast.success(`Loaded ${val}`);
          } else {
              // Try partial match
              const match = Object.keys(MOCK_STOCKS).find(k => k.includes(val));
              if(match) {
                  setSymbol(match);
                  toast.success(`Loaded ${match}`);
              } else {
                  toast.success(`Loaded ${val} (Simulated)`);
              }
          }
      }
  };

  const getPnl = (p: any) => {
      const current = MOCK_STOCKS[p.symbol] || p.avg; 
      const price = p.symbol === symbol ? marketPrice : current; 
      return (price - p.avg) * p.qty;
  };

  const resetAccount = () => {
      if(confirm("Reset account to ₹10,000?")) {
          setBalance(10000);
          setPortfolio([]);
          saveData(10000, []);
          toast.success("Account Reset");
      }
  }

  // --- TOOL HANDLER (Mock Functionality) ---
  const handleToolClick = (tool: string) => {
      setActiveTool(tool);
      toast(`Active Tool: ${tool.toUpperCase()}`, { icon: '✏️', position: 'bottom-left' });
  };

  // --- PUBLISH HANDLER ---
  const handlePublish = () => {
      toast.success("Chart Snapshot Shared to Community!", { icon: '📸' });
  };

  return (
    <div className="flex flex-col h-screen bg-[#131722] text-[#d1d4dc] font-sans overflow-hidden selection:bg-[#2962ff] selection:text-white">
      
      {/* 1. TOP HEADER */}
      <header className="h-10 bg-[#131722] border-b border-[#2a2e39] flex items-center px-4 justify-between shrink-0 select-none z-20">
         <div className="flex items-center gap-4">
             <button onClick={() => router.back()} className="text-gray-400 hover:text-white"><ArrowLeft size={16}/></button>
             
             <div className="relative group">
                {searchOpen ? (
                    <input 
                        autoFocus
                        className="bg-[#2a2e39] border border-blue-500 rounded px-2 py-0.5 text-xs text-white outline-none w-28 uppercase"
                        onBlur={() => setSearchOpen(false)}
                        onKeyDown={handleSearch}
                        placeholder="SYMBOL"
                    />
                ) : (
                    <div onClick={() => setSearchOpen(true)} className="flex items-center gap-2 cursor-pointer hover:bg-[#2a2e39] px-2 py-1 rounded transition-colors">
                        <span className="font-bold text-white text-sm tracking-wide">{symbol}</span>
                        <span className="text-[10px] bg-[#2a2e39] border border-[#434651] px-1 rounded text-gray-400">NSE</span>
                    </div>
                )}
             </div>

             <div className="hidden md:flex items-center gap-3 text-xs font-mono border-l border-[#2a2e39] pl-3">
                 <span className={`font-bold ${stats.c >= stats.o ? 'text-[#089981]' : 'text-[#f23645]'}`}>{marketPrice.toFixed(2)}</span>
                 <div className="flex gap-2 text-[10px] text-gray-500">
                    <span>O <span className={stats.c >= stats.o ? 'text-[#089981]' : 'text-[#f23645]'}>{stats.o.toFixed(2)}</span></span>
                    <span>H <span className={stats.c >= stats.o ? 'text-[#089981]' : 'text-[#f23645]'}>{stats.h.toFixed(2)}</span></span>
                    <span>L <span className={stats.c >= stats.o ? 'text-[#089981]' : 'text-[#f23645]'}>{stats.l.toFixed(2)}</span></span>
                 </div>
             </div>
         </div>

         <div className="flex items-center gap-4">
             {/* Wallet Reset */}
             <div className="flex items-center gap-2 bg-[#1e222d] border border-[#2a2e39] px-3 py-1 rounded text-xs cursor-pointer hover:border-gray-500 transition-colors" title="Click to Reset" onClick={resetAccount}>
                 <Wallet size={12} className="text-blue-400"/>
                 <span className="font-mono font-bold text-white">₹{balance.toLocaleString()}</span>
                 <RotateCcw size={10} className="text-gray-600 ml-1"/>
             </div>
             
             <div className="flex gap-2">
                {/* Header Search */}
                <button className="p-1.5 hover:bg-[#2a2e39] rounded text-gray-400" onClick={() => setSearchOpen(true)}><Search size={16}/></button>
                {/* Header Settings */}
                <button className="p-1.5 hover:bg-[#2a2e39] rounded text-gray-400" onClick={() => setActiveModal('settings')}><Settings size={16}/></button>
                {/* Publish Button */}
                <button onClick={handlePublish} className="bg-[#2962ff] hover:bg-[#1e53e5] text-white text-xs font-bold px-3 py-1.5 rounded transition-colors flex items-center gap-1">
                    <Share2 size={12}/> Publish
                </button>
             </div>
         </div>
      </header>

      {/* 2. MAIN WORKSPACE */}
      <div className="flex-1 flex overflow-hidden relative">
          
          {/* LEFT TOOLBAR */}
          <div className="w-12 border-r border-[#2a2e39] flex flex-col items-center py-2 gap-1 shrink-0 bg-[#131722] z-10">
              <ToolIcon icon={<CrosshairModeIcon />} active={activeTool === 'cursor'} onClick={() => handleToolClick('cursor')} />
              <ToolIcon icon={<TrendingUp size={18}/>} active={activeTool === 'trend'} onClick={() => handleToolClick('trend')} />
              <ToolIcon icon={<Pencil size={18}/>} active={activeTool === 'draw'} onClick={() => handleToolClick('draw')} />
              <ToolIcon icon={<Type size={18}/>} active={activeTool === 'text'} onClick={() => handleToolClick('text')} />
              <div className="w-4 h-px bg-[#2a2e39] my-1"></div>
              <ToolIcon icon={<Eraser size={18}/>} onClick={() => toast.success("Drawings Cleared")} />
              <ToolIcon icon={<Maximize2 size={18}/>} onClick={() => {
                  if (!document.fullscreenElement) {
                      document.documentElement.requestFullscreen();
                  } else {
                      document.exitFullscreen();
                  }
              }} />
          </div>

          {/* CENTER: CHART & POSITIONS */}
          <div className="flex-1 flex flex-col min-w-0 bg-[#131722] relative">
              {/* Chart Top Toolbar */}
              <div className="h-10 border-b border-[#2a2e39] flex items-center px-2 gap-2 text-xs font-medium text-gray-400 bg-[#131722]">
                  {['1m','5m','15m','30m','1h','4h','1D'].map(tf => (
                      <button 
                        key={tf} 
                        onClick={() => setTimeframe(tf)}
                        className={`hover:bg-[#2a2e39] hover:text-[#2962ff] px-2 py-1 rounded transition-colors ${timeframe===tf ? 'text-[#2962ff] font-bold bg-[#2a2e39]' : ''}`}
                      >
                          {tf}
                      </button>
                  ))}
                  <div className="w-px h-4 bg-[#2a2e39] mx-1"></div>
                  <button onClick={() => setActiveModal('indicators')} className="flex items-center gap-1 hover:text-white px-2 py-1 hover:bg-[#2a2e39] rounded"><BarChart2 size={14}/> Indicators</button>
                  <button onClick={() => setActiveModal('alerts')} className="flex items-center gap-1 hover:text-white px-2 py-1 hover:bg-[#2a2e39] rounded"><AlertCircle size={14}/> Alerts</button>
                  <button className="flex items-center gap-1 hover:text-white px-2 py-1 hover:bg-[#2a2e39] rounded"><Clock size={14}/> Replay</button>
              </div>

              {/* Chart Canvas */}
              <div className={`flex-1 relative w-full h-full cursor-${activeTool === 'cursor' ? 'default' : 'crosshair'}`} onClick={() => {
                  if(activeTool !== 'cursor') toast(`Placed ${activeTool} (Mock)`, {icon: '🖊️', position: 'bottom-center'})
              }}>
                   <div ref={chartContainerRef} className="absolute inset-0" />
                   <div className="absolute bottom-4 left-4 pointer-events-none opacity-10 text-4xl font-black text-white z-0">
                       TRADEPRO
                   </div>
              </div>

              {/* BOTTOM PANEL (Positions) */}
              <div className="h-56 border-t border-[#2a2e39] bg-[#131722] flex flex-col z-10">
                  <div className="flex justify-between items-center border-b border-[#2a2e39] text-xs font-bold text-gray-500 bg-[#1e222d] px-2">
                      <div className="flex">
                        <button onClick={() => setActiveBottomTab('POSITIONS')} className={`px-4 py-2 border-t-2 ${activeBottomTab==='POSITIONS' ? 'border-[#2962ff] text-[#2962ff] bg-[#131722]' : 'border-transparent hover:text-white hover:bg-[#2a2e39]'}`}>Positions</button>
                        <button onClick={() => setActiveBottomTab('ORDERS')} className={`px-4 py-2 border-t-2 ${activeBottomTab==='ORDERS' ? 'border-[#2962ff] text-[#2962ff] bg-[#131722]' : 'border-transparent hover:text-white hover:bg-[#2a2e39]'}`}>Open Orders</button>
                      </div>
                      
                      {!showOrderPanel && (
                          <button onClick={() => setShowOrderPanel(true)} className="flex items-center gap-1 text-[#2962ff] hover:text-white px-2">
                              <MoreHorizontal size={14} /> Show Order Panel
                          </button>
                      )}
                  </div>
                  
                  <div className="flex-1 overflow-auto bg-[#131722]">
                    <table className="w-full text-left text-xs whitespace-nowrap">
                        <thead className="bg-[#1e222d] text-gray-500 sticky top-0 z-10">
                            <tr>
                                <th className="px-4 py-2 font-medium">Symbol</th>
                                <th className="px-4 py-2 font-medium">Side</th>
                                <th className="px-4 py-2 font-medium">Qty</th>
                                <th className="px-4 py-2 font-medium">Avg. Price</th>
                                <th className="px-4 py-2 font-medium">LTP</th>
                                <th className="px-4 py-2 font-medium text-right">P&L</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2a2e39]">
                            {portfolio.length > 0 ? portfolio.map((p, i) => {
                                const pnl = getPnl(p);
                                return (
                                    <tr key={i} className="hover:bg-[#2a2e39] transition-colors">
                                        <td className="px-4 py-2 font-bold text-white">{p.symbol}</td>
                                        <td className="px-4 py-2"><span className="bg-[#089981]/20 text-[#089981] px-1.5 py-0.5 rounded text-[10px] font-bold">BUY</span></td>
                                        <td className="px-4 py-2 text-white">{p.qty}</td>
                                        <td className="px-4 py-2 text-gray-400">{p.avg.toFixed(2)}</td>
                                        <td className="px-4 py-2 text-white">
                                            {p.symbol === symbol ? marketPrice.toFixed(2) : (MOCK_STOCKS[p.symbol] || p.avg).toFixed(2)}
                                        </td>
                                        <td className={`px-4 py-2 font-bold text-right ${pnl >= 0 ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                                            {pnl > 0 ? '+' : ''}{pnl.toFixed(2)}
                                        </td>
                                    </tr>
                                )
                            }) : (
                                <tr>
                                    <td colSpan={6} className="text-center py-10 text-gray-600">
                                        No open positions.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                  </div>
              </div>
          </div>

          {/* RIGHT: ORDER PANEL (DOM) */}
          {showOrderPanel && (
            <div className="w-[300px] bg-[#1e222d] border-l border-[#2a2e39] flex flex-col shrink-0 z-20 overflow-y-auto [&::-webkit-scrollbar]:hidden transition-all">
                <div className="h-10 border-b border-[#2a2e39] flex items-center justify-between px-4 bg-[#1e222d] font-bold text-xs text-white shrink-0 sticky top-0 z-20">
                    <span>Order Panel</span>
                    <div className="flex gap-2">
                       <span className="p-1 hover:bg-[#2a2e39] rounded cursor-pointer" onClick={() => setActiveModal('settings')}><Settings size={14}/></span>
                       <span className="p-1 hover:bg-[#2a2e39] rounded cursor-pointer" onClick={() => setShowOrderPanel(false)}><X size={14}/></span>
                    </div>
                </div>

                <div className="p-4 flex-1">
                    <div className="flex bg-[#131722] rounded mb-6 border border-[#2a2e39] p-0.5">
                        <button 
                          onClick={() => setSide('BUY')}
                          className={`flex-1 py-2 text-sm font-bold rounded transition-all ${side === 'BUY' ? 'bg-[#089981] text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            Buy
                        </button>
                        <button 
                          onClick={() => setSide('SELL')}
                          className={`flex-1 py-2 text-sm font-bold rounded transition-all ${side === 'SELL' ? 'bg-[#f23645] text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            Sell
                        </button>
                    </div>

                    <div className="space-y-4 text-xs">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-gray-400 font-medium">Order Type</label>
                            <div className="grid grid-cols-2 gap-2">
                                <button onClick={() => setOrderType('MARKET')} className={`py-1.5 border rounded ${orderType === 'MARKET' ? 'border-blue-500 text-blue-500 bg-blue-500/10' : 'border-[#2a2e39] bg-[#131722] text-gray-400'}`}>Market</button>
                                <button onClick={() => setOrderType('LIMIT')} className={`py-1.5 border rounded ${orderType === 'LIMIT' ? 'border-blue-500 text-blue-500 bg-blue-500/10' : 'border-[#2a2e39] bg-[#131722] text-gray-400'}`}>Limit</button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <div className="flex justify-between">
                                <label className="text-gray-400 font-medium">Quantity</label>
                            </div>
                            <div className="flex items-center bg-[#131722] border border-[#2a2e39] rounded focus-within:border-blue-500 transition-colors">
                                 <button onClick={() => setQty(Math.max(1, qty-1))} className="p-2 hover:bg-[#2a2e39] text-gray-400"><Minus size={14}/></button>
                                 <input 
                                    type="number" value={qty} onChange={(e) => setQty(Number(e.target.value))}
                                    className="w-full bg-transparent text-center text-white outline-none font-mono py-2"
                                 />
                                 <button onClick={() => setQty(qty+1)} className="p-2 hover:bg-[#2a2e39] text-gray-400"><Plus size={14}/></button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-gray-400 font-medium">Price</label>
                            <div className="flex items-center bg-[#131722] border border-[#2a2e39] rounded focus-within:border-blue-500 transition-colors relative">
                                 <span className="absolute left-3 text-gray-500">₹</span>
                                 <input 
                                    type="number" value={inputPrice} onChange={(e) => setInputPrice(Number(e.target.value))}
                                    disabled={orderType === 'MARKET'}
                                    className={`w-full bg-transparent py-2 pl-6 pr-2 text-white outline-none font-mono ${orderType === 'MARKET' ? 'opacity-50' : ''}`}
                                 />
                            </div>
                        </div>

                        <div className="bg-[#2a2e39]/50 p-3 rounded border border-[#2a2e39] space-y-2 mt-4">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Margin Req.</span>
                                <span className="text-white font-mono">₹{(inputPrice * qty).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Balance</span>
                                <span className="text-blue-400 font-mono">₹{balance.toFixed(2)}</span>
                            </div>
                        </div>

                        <button 
                            onClick={handleOrder}
                            className={`w-full py-3 rounded font-bold text-white mt-2 shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${side === 'BUY' ? 'bg-[#089981] hover:bg-[#067a65]' : 'bg-[#f23645] hover:bg-[#ce2130]'}`}
                        >
                            {side} {symbol}
                        </button>
                    </div>

                    <div className="mt-8 border-t border-[#2a2e39] pt-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-xs font-bold text-gray-400">Order Book</h4>
                          <span className="text-[10px] text-gray-500">Spread: 0.05</span>
                        </div>
                        
                        <div className="flex gap-0.5 text-[10px]">
                           <div className="flex-1">
                               <div className="text-gray-500 mb-1 px-1">Bid</div>
                               {orderBook.bids.map((b: any, i) => (
                                    <div key={i} className="flex justify-between relative h-5 items-center px-1 hover:bg-[#2a2e39]">
                                        <div className="absolute right-0 top-0 bottom-0 bg-[#089981]/10" style={{width: `${b.width}%`}}></div>
                                        <span className="relative z-10 text-[#089981] font-mono">{b.qty}</span>
                                        <span className="relative z-10 text-gray-300 font-mono">{(marketPrice - (i*0.05) - 0.05).toFixed(2)}</span>
                                    </div>
                                ))}
                           </div>
                           <div className="flex-1">
                               <div className="text-gray-500 mb-1 text-right px-1">Ask</div>
                               {orderBook.asks.map((a: any, i) => (
                                    <div key={i} className="flex justify-between relative h-5 items-center px-1 hover:bg-[#2a2e39]">
                                        <div className="absolute left-0 top-0 bottom-0 bg-[#f23645]/10" style={{width: `${a.width}%`}}></div>
                                        <span className="relative z-10 text-gray-300 font-mono">{(marketPrice + (i*0.05) + 0.05).toFixed(2)}</span>
                                        <span className="relative z-10 text-[#f23645] font-mono">{a.qty}</span>
                                    </div>
                                ))}
                           </div>
                        </div>
                    </div>
                </div>
            </div>
          )}

          {/* 3. MODALS (Indicators, Settings, Alerts) */}
          {activeModal && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                  <div className="bg-[#1e222d] w-96 rounded-xl border border-[#2a2e39] shadow-2xl animate-in fade-in zoom-in duration-200">
                      <div className="flex justify-between items-center p-4 border-b border-[#2a2e39]">
                          <h3 className="font-bold text-white">
                              {activeModal === 'indicators' && 'Indicators'}
                              {activeModal === 'alerts' && 'Set Alert'}
                              {activeModal === 'settings' && 'Settings'}
                          </h3>
                          <button onClick={() => setActiveModal(null)}><X size={18} className="text-gray-400 hover:text-white"/></button>
                      </div>
                      <div className="p-4 space-y-2">
                          {activeModal === 'indicators' && (
                              ['RSI', 'MACD', 'Bollinger Bands', 'Moving Average'].map(i => (
                                  <button key={i} onClick={() => {toast.success(`${i} Added`); setActiveModal(null)}} className="w-full text-left p-3 hover:bg-[#2a2e39] rounded text-sm text-gray-300 hover:text-white transition-colors">
                                      {i}
                                  </button>
                              ))
                          )}
                          {activeModal === 'alerts' && (
                              <div className="space-y-4">
                                  <div className="space-y-1">
                                      <label className="text-xs text-gray-500">Condition</label>
                                      <div className="p-3 bg-[#131722] rounded border border-[#2a2e39] text-sm">
                                          {symbol} Crossing {marketPrice.toFixed(2)}
                                      </div>
                                  </div>
                                  <button onClick={() => {toast.success("Alert Created"); setActiveModal(null)}} className="w-full py-2 bg-[#2962ff] text-white rounded font-bold">Create Alert</button>
                              </div>
                          )}
                          {activeModal === 'settings' && (
                              <div className="space-y-2">
                                  <button className="w-full text-left p-3 hover:bg-[#2a2e39] rounded text-sm flex justify-between">Dark Mode <span className="text-[#2962ff]">On</span></button>
                                  <button className="w-full text-left p-3 hover:bg-[#2a2e39] rounded text-sm flex justify-between">Notifications <span className="text-[#2962ff]">On</span></button>
                                  <button onClick={() => {resetAccount(); setActiveModal(null)}} className="w-full text-left p-3 hover:bg-red-500/10 text-red-500 rounded text-sm">Reset Account</button>
                              </div>
                          )}
                      </div>
                  </div>
              </div>
          )}

      </div>
    </div>
  );
}

// Icon Helper
const ToolIcon = ({ icon, active = false, onClick }: { icon: any, active?: boolean, onClick?: () => void }) => (
    <div onClick={onClick} className={`p-2 rounded cursor-pointer transition-colors ${active ? 'text-[#2962ff] bg-[#2a2e39]' : 'text-gray-400 hover:bg-[#2a2e39] hover:text-white'}`}>
        {icon}
    </div>
);

const CrosshairModeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>
);