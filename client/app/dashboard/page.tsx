"use client";

import { useEffect, useRef, useState } from "react";
import {
  createChart,
  LineSeries,
  HistogramSeries,
  ColorType,
  Time,
} from "lightweight-charts";

const TIMEFRAMES = [
  { label: "1m", step: 60 },
  { label: "5m", step: 300 },
  { label: "1h", step: 3600 },
  { label: "1D", step: 86400 },
];

// ✅ FIXED: Real-time Market Values (Jan 2026 Updated)
const ASSETS = [
  { key: "BTC", name: "Bitcoin", unit: "₹ / BTC", base: 8311700, color: "#8B5CF6" }, // Updated: ~83 Lakhs
  { key: "GOLD", name: "Gold", unit: "₹ / 10gm", base: 144000, color: "#F59E0B" },   // Updated: ~1.44 Lakhs
  { key: "NIFTY", name: "NIFTY 50", unit: "Index", base: 25720, color: "#22C55E" },  // Updated: ~25.7k
  { key: "SILVER", name: "Silver", unit: "₹ / Kg", base: 275000, color: "#9CA3AF" }, // Updated: ~2.75 Lakhs
  { key: "SENSEX", name: "Sensex", unit: "Index", base: 83610, color: "#3B82F6" },  // Updated: ~83.6k
];

const TABLE_SECTIONS = [
  { title: "Top Gainers", color: "green", stocks: ["RELIANCE", "ADANIENT", "TCS", "ITC", "LT", "POWERGRID"] },
  { title: "Top Losers", color: "red", stocks: ["WIPRO", "ONGC", "SBIN", "AXISBANK", "HINDALCO", "COALINDIA"] },
  { title: "Most Active", color: "blue", stocks: ["RELIANCE", "TCS", "INFY", "HDFCBANK", "ICICIBANK", "ITC"] },
  { title: "52W High", color: "green", stocks: ["ADANIENT", "TRENT", "LTIM", "HAL", "BEL"] },
  { title: "52W Low", color: "red", stocks: ["PAYTM", "ZOMATO", "YESBANK", "IDEA"] },
  { title: "High Volume", color: "purple", stocks: ["RELIANCE", "TATASTEEL", "SBIN", "INFY"] },
  { title: "F&O Long Build-up", color: "green", stocks: ["NIFTY", "BANKNIFTY", "RELIANCE"] },
  { title: "F&O Short Build-up", color: "red", stocks: ["ITC", "HDFCBANK", "TATASTEEL"] },
  { title: "Trending", color: "blue", stocks: ["PAYTM", "ZOMATO", "NYKAA", "OLA"] },
];

function calculateEMA(data: any[], period: number) {
  const k = 2 / (period + 1);
  let ema = data[0]?.value || 0;
  return data.map((d, i) => {
    if (i === 0) return { ...d, value: ema };
    ema = d.value * k + ema * (1 - k);
    return { ...d, value: ema };
  });
}

function ChartCard({ asset }: any) {
  const ref = useRef<HTMLDivElement>(null);
  const [price, setPrice] = useState(asset.base);
  const [tf, setTf] = useState(TIMEFRAMES[1]);

  useEffect(() => {
    if (!ref.current) return;

    ref.current.innerHTML = "";

    const chart = createChart(ref.current, {
      height: 280,
      layout: { 
        background: { type: ColorType.Solid, color: "#FFFFFF" }, 
        textColor: "#374151" 
      },
      grid: { 
        vertLines: { color: "#F3F4F6" }, 
        horzLines: { color: "#F3F4F6" } 
      },
      rightPriceScale: { borderColor: "#E5E7EB", scaleMargins: { top: 0.1, bottom: 0.1 } },
      timeScale: { borderColor: "#E5E7EB", timeVisible: true },
      crosshair: {
        vertLine: { labelVisible: false },
      },
    });

    const priceSeries = chart.addSeries(LineSeries, {
      color: asset.color,
      lineWidth: 2,
      crosshairMarkerVisible: true,
    });

    const ema20Series = chart.addSeries(LineSeries, {
      color: "#3B82F6",
      lineWidth: 1,
      lineStyle: 2, // Dashed
    });

    const ema50Series = chart.addSeries(LineSeries, {
      color: "#EF4444",
      lineWidth: 1,
      lineStyle: 2,
    });

    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: "#CBD5E1",
      priceFormat: { type: 'volume' },
      priceScaleId: '', // Overlay mode
    });
    
    chart.priceScale('').applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    });

    let t = Math.floor(Date.now() / 1000) - tf.step * 100;
    let v = asset.base;
    let data: any[] = [];
    let volData: any[] = [];

    for (let i = 0; i < 100; i++) {
        v += (Math.random() - 0.5) * (asset.base * 0.005);
        t += tf.step;
        data.push({ time: t, value: v });
        volData.push({ 
            time: t, 
            value: Math.random() * 1000 + 500,
            color: Math.random() > 0.5 ? '#86efac' : '#fca5a5'
        });
    }

    priceSeries.setData(data);
    volumeSeries.setData(volData);
    ema20Series.setData(calculateEMA(data, 20));
    ema50Series.setData(calculateEMA(data, 50));
    
    setPrice(v);

    const interval = setInterval(() => {
      v += (Math.random() - 0.5) * (asset.base * 0.002);
      t += tf.step;

      const point = { time: t as Time, value: v };
      
      priceSeries.update(point);
      
      const currentEMA20 = v * (2/21) + ((ema20Series.dataByIndex(data.length-1) as any)?.value || v) * (1 - 2/21);
      const currentEMA50 = v * (2/51) + ((ema50Series.dataByIndex(data.length-1) as any)?.value || v) * (1 - 2/51);
      
      ema20Series.update({ time: t as Time, value: currentEMA20 });
      ema50Series.update({ time: t as Time, value: currentEMA50 });

      volumeSeries.update({
        time: t as Time,
        value: Math.random() * 1000 + 200,
        color: Math.random() > 0.5 ? '#86efac' : '#fca5a5'
      });

      setPrice(v);
    }, 2000);

    return () => {
      clearInterval(interval);
      chart.remove();
    };
  }, [tf, asset]);

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-3 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-bold text-gray-800 flex items-center gap-2">
            {asset.name}
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium">LIVE</span>
          </p>
          <p className="text-xs text-gray-500 font-medium">{asset.unit}</p>
        </div>
        <div className={`font-mono font-bold text-lg ${price >= asset.base ? 'text-green-600' : 'text-red-600'}`}>
          ₹{price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </div>
      </div>

      <div className="flex gap-2 text-xs border-b border-gray-100 pb-2">
        {TIMEFRAMES.map((t) => (
          <button
            key={t.label}
            onClick={() => setTf(t)}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              tf.label === t.label
                ? "bg-slate-800 text-white shadow-sm"
                : "text-gray-500 hover:bg-slate-100"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div ref={ref} className="overflow-hidden rounded-lg" />

      <div className="flex flex-wrap gap-4 text-[11px] text-gray-500 pt-1">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: asset.color }}></span> Price
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span> EMA 20
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500"></span> EMA 50
        </div>
      </div>
    </div>
  );
}

function LiveTable({ title, color, stocks }: any) {
  const [rows, setRows] = useState(
    stocks.map((s: string) => ({ name: s, change: (Math.random() * 4 - 2).toFixed(2) }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setRows((prev: any[]) =>
        prev.map((r: any) => ({
          ...r,
          change: (parseFloat(r.change) + (Math.random() - 0.5)).toFixed(2),
        }))
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-all">
      <div className="flex items-center gap-2 mb-4">
          <div className={`w-1 h-5 rounded-full ${color === 'green' ? 'bg-green-500' : color === 'red' ? 'bg-red-500' : color === 'blue' ? 'bg-blue-500' : 'bg-purple-500'}`}></div>
          <h3 className="font-bold text-gray-800">{title}</h3>
      </div>
      
      <div className="space-y-3 text-sm">
        {rows.map((r: any) => {
            const isPos = parseFloat(r.change) > 0;
            return (
                <div key={r.name} className="flex justify-between items-center group cursor-pointer p-1 rounded hover:bg-slate-50">
                    <span className="font-medium text-slate-600 group-hover:text-slate-900">{r.name}</span>
                    <span className={`font-bold px-2 py-0.5 rounded text-xs ${isPos ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                    {isPos ? '+' : ''}{r.change}%
                    </span>
                </div>
            )
        })}
      </div>
    </div>
  );
}

export default function MarketPage() {
  return (
    <div className="p-6 space-y-8 bg-slate-50/50 min-h-screen">

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Market Overview</h1>
            <p className="text-slate-500 text-sm mt-1">Track live indices, commodities, and top movers.</p>
        </div>
        <div className="flex gap-2 bg-white p-1 rounded-xl border shadow-sm">
          <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium shadow-sm transition-all">Stocks</button>
          <button className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg text-sm font-medium transition-all">F&O</button>
          <button className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg text-sm font-medium transition-all">Crypto</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ASSETS.slice(0, 3).map((a) => <ChartCard key={a.key} asset={a} />)}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ASSETS.slice(3).map((a) => <ChartCard key={a.key} asset={a} />)}
      </div>

      <div className="pt-4">
        <h2 className="text-xl font-bold text-slate-800">Market Movers & Trends</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
        {TABLE_SECTIONS.map(t => <LiveTable key={t.title} {...t} />)}
      </div>

    </div>
  );
}