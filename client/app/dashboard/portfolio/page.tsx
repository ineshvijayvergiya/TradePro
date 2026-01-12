"use client";

import React, { useEffect, useState } from "react";
import { Wallet, PieChart, Trophy, Shield, TrendingUp } from "lucide-react";

const START_CAPITAL = 1_000_000;

const STOCK_META: Record<string, { name: string; sector: string }> = {
  RELIANCE: { name: "Reliance Industries", sector: "Energy" },
  TCS: { name: "Tata Consultancy", sector: "IT" },
  INFY: { name: "Infosys", sector: "IT" },
  HDFCBANK: { name: "HDFC Bank", sector: "Finance" },
  TATAMOTORS: { name: "Tata Motors", sector: "Auto" },
};

interface Holding {
  symbol: string;
  qty: number;
  avg: number;
  ltp: number;
}

export default function PortfolioPage() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [balance, setBalance] = useState(START_CAPITAL);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("tradeProPortfolio") || "[]");
    const bal = Number(localStorage.getItem("tradeProBalance") || START_CAPITAL);
    setHoldings(stored.map((h: any) => ({ ...h, ltp: h.avg })));
    setBalance(bal);
  }, []);

  useEffect(() => {
    const i = setInterval(() => {
      setHoldings((prev) =>
        prev.map((s) => ({
          ...s,
          ltp: +(s.ltp + (Math.random() - 0.5) * s.ltp * 0.01).toFixed(2),
        }))
      );
    }, 3000);
    return () => clearInterval(i);
  }, []);

  const invested = holdings.reduce((a, s) => a + s.qty * s.avg, 0);
  const currentValue = holdings.reduce((a, s) => a + s.qty * s.ltp, 0);
  const profit = currentValue - invested;
  const profitPct = invested > 0 ? (profit / invested) * 100 : 0;

  const topGainer =
    holdings.length > 0
      ? holdings.reduce((a, b) =>
          (b.ltp - b.avg) / b.avg > (a.ltp - a.avg) / a.avg ? b : a
        )
      : null;

  const sectorMap: Record<string, number> = {};
  holdings.forEach((h) => {
    const sector = STOCK_META[h.symbol]?.sector || "Other";
    sectorMap[sector] = (sectorMap[sector] || 0) + h.qty * h.ltp;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f14] p-8 text-white">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Summary title="Invested" value={invested} />
          <Summary title="Current Value" value={currentValue} />
          <Summary
            title="Total Returns"
            value={profit}
            sub={`${profitPct.toFixed(2)}%`}
            positive={profit >= 0}
          />
          <Summary title="Cash" value={balance} />
        </div>

        {/* MAIN */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Holdings */}
          <div className="lg:col-span-8 bg-[#161b22] rounded-2xl border border-gray-800 overflow-hidden">
            <div className="p-4 font-bold border-b border-gray-800">
              Holdings ({holdings.length})
            </div>
            <table className="w-full text-sm">
              <thead className="text-gray-400 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">Stock</th>
                  <th className="px-4 py-3 text-right">Qty</th>
                  <th className="px-4 py-3 text-right">Avg</th>
                  <th className="px-4 py-3 text-right">LTP</th>
                  <th className="px-4 py-3 text-right">P&L</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((h, i) => {
                  const pnl = (h.ltp - h.avg) * h.qty;
                  return (
                    <tr key={i} className="border-t border-gray-800">
                      <td className="px-4 py-3">{h.symbol}</td>
                      <td className="px-4 py-3 text-right">{h.qty}</td>
                      <td className="px-4 py-3 text-right">₹{h.avg}</td>
                      <td className="px-4 py-3 text-right text-blue-400">₹{h.ltp}</td>
                      <td
                        className={`px-4 py-3 text-right font-bold ${
                          pnl >= 0 ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        ₹{pnl.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
                {holdings.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-gray-500">
                      Start trading to build your portfolio 🚀
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Sector Allocation */}
            <div className="bg-[#161b22] p-6 rounded-2xl border border-gray-800">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <PieChart size={18} /> Sector Allocation
              </h3>
              {Object.keys(sectorMap).length === 0 && (
                <p className="text-gray-500 text-sm">No allocation yet.</p>
              )}
              {Object.entries(sectorMap).map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm mb-1">
                  <span>{k}</span>
                  <span>₹{v.toFixed(0)}</span>
                </div>
              ))}
            </div>

            {/* Top Gainer */}
            <div className="bg-[#161b22] p-6 rounded-2xl border border-gray-800">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <TrendingUp size={18} /> Top Performer
              </h3>
              {topGainer ? (
                <div>
                  <div className="text-lg font-black">{topGainer.symbol}</div>
                  <div className="text-green-400 text-sm">
                    +{(((topGainer.ltp - topGainer.avg) / topGainer.avg) * 100).toFixed(2)}%
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No data yet.</p>
              )}
            </div>

            {/* Rank */}
            <div className="bg-gradient-to-br from-blue-800 to-black p-6 rounded-2xl">
              <p className="text-xs uppercase text-blue-300">Global Rank</p>
              <div className="text-3xl font-black mt-1">#1</div>
              <p className="text-xs text-gray-400">Simulation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Summary({
  title,
  value,
  sub,
  positive,
}: {
  title: string;
  value: number;
  sub?: string;
  positive?: boolean;
}) {
  return (
    <div className="bg-[#161b22] p-6 rounded-2xl border border-gray-800">
      <p className="text-xs uppercase text-gray-400">{title}</p>
      <div
        className={`text-2xl font-black ${
          positive === undefined
            ? "text-white"
            : positive
            ? "text-green-400"
            : "text-red-400"
        }`}
      >
        ₹{value.toLocaleString()}
      </div>
      {sub && <p className="text-xs text-gray-400">{sub}</p>}
    </div>
  );
}
