"use client";

import { useEffect, useRef, useState } from "react";
import {
  createChart,
  LineSeries,
  HistogramSeries,
} from "lightweight-charts";
import {ColorType, Time } from 'lightweight-charts';
const TIMEFRAMES = [
  { label: "1m", step: 60 },
  { label: "5m", step: 300 },
  { label: "1h", step: 3600 },
  { label: "1D", step: 86400 },
];

const ASSETS = [
  { key: "BTC", name: "Bitcoin", unit: "₹ / BTC", base: 9000000, color: "#8B5CF6" },
  { key: "GOLD", name: "Gold", unit: "₹ / 10gm", base: 72000, color: "#F59E0B" },
  { key: "NIFTY", name: "NIFTY 50", unit: "Index", base: 22100, color: "#22C55E" },
  { key: "SILVER", name: "Silver", unit: "₹ / Kg", base: 88000, color: "#9CA3AF" },
  { key: "SENSEX", name: "Sensex", unit: "Index", base: 73500, color: "#3B82F6" },
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
      layout: { background: { color: "#F9FAFB" }, textColor: "#374151" },
      grid: { vertLines: { color: "#E5E7EB" }, horzLines: { color: "#E5E7EB" } },
      rightPriceScale: { borderColor: "#E5E7EB" },
      timeScale: { borderColor: "#E5E7EB", timeVisible: true },
    });

    const priceSeries = chart.addSeries(LineSeries, {
      color: asset.color,
      lineWidth: 2,
    });

    const ema20Series = chart.addSeries(LineSeries, {
      color: "#3B82F6",
      lineWidth: 1,
    });

    const ema50Series = chart.addSeries(LineSeries, {
      color: "#EF4444",
      lineWidth: 1,
    });

    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: "#CBD5E1",
      priceScaleId: "",
    });

    let t = Math.floor(Date.now() / 1000) - tf.step * 50;
    let v = asset.base;
    let data: any[] = [];

    const interval = setInterval(() => {
      v += (Math.random() - 0.5) * asset.base * 0.002;
      t += tf.step;

      const point = { time: t, value: v };
      data.push(point);
      if (data.length > 100) data.shift();

      priceSeries.setData(data);
      ema20Series.setData(calculateEMA(data, 20));
      ema50Series.setData(calculateEMA(data, 50));

      volumeSeries.update({
        time: t as Time,
        value: Math.random() * 1000 + 200,
      });

      setPrice(v);
    }, 2000);

    return () => {
      clearInterval(interval);
      chart.remove();
    };
  }, [tf, asset]);

  return (
    <div className="bg-white rounded-2xl p-4 shadow border space-y-2">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-bold">{asset.name}</p>
          <p className="text-xs text-gray-500">{asset.unit}</p>
        </div>
        <div className="font-mono text-green-600">₹{price.toLocaleString()}</div>
      </div>

      <div className="flex gap-2 text-xs">
        {TIMEFRAMES.map((t) => (
          <button
            key={t.label}
            onClick={() => setTf(t)}
            className={`px-2 py-1 rounded ${
              tf.label === t.label
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div ref={ref} />

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-[11px] text-gray-500 mt-2">
        <div className="flex items-center gap-1">
          <span className="w-3 h-[2px]" style={{ background: asset.color }}></span> Price
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-[2px] bg-blue-500"></span> EMA 20
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-[2px] bg-red-500"></span> EMA 50
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-gray-300"></span> Volume
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
    <div className="bg-white rounded-xl shadow border p-4">
      <h3 className="font-semibold mb-3 text-gray-800">{title}</h3>
      <div className="space-y-2 text-sm">
        {rows.map((r: any) => (
          <div key={r.name} className="flex justify-between">
            <span className="text-gray-700">{r.name}</span>
            <span className={`text-${color}-600 font-medium animate-pulse`}>
              {r.change}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MarketPage() {
  return (
    <div className="p-6 space-y-8 bg-slate-50 min-h-screen">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Market Overview</h1>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border rounded-lg shadow hover:bg-gray-100">Stocks</button>
          <button className="px-4 py-2 bg-white border rounded-lg shadow hover:bg-gray-100">F&O</button>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ASSETS.slice(0, 3).map((a) => <ChartCard key={a.key} asset={a} />)}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ASSETS.slice(3).map((a) => <ChartCard key={a.key} asset={a} />)}
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TABLE_SECTIONS.map(t => <LiveTable key={t.title} {...t} />)}
      </div>

    </div>
  );
}
