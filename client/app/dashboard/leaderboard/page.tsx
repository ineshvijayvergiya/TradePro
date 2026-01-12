"use client";

import React, { useEffect, useState } from "react";
import { Trophy, Crown } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface TraderProfile {
  id: string;
  full_name: string | null;
  balance: number;
}

export default function LeaderboardPage() {
  const [traders, setTraders] = useState<TraderProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState({
    name: "Trader",
    rank: 1,
    balance: 1000000,
  });

  useEffect(() => {
    async function load() {
      try {
        const storedUser = JSON.parse(localStorage.getItem("tradeProUser") || "{}");
        const balance = Number(localStorage.getItem("tradeProBalance") || 1000000);

        if (storedUser?.name) {
          await supabase.from("profiles").upsert(
            { full_name: storedUser.name, balance },
            { onConflict: "full_name" }
          );
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("id, full_name, balance")
          .order("balance", { ascending: false });

        if (error) throw error;

        setTraders(data || []);

        const myIndex = (data || []).findIndex(
          (t) => t.full_name?.toLowerCase() === storedUser.name?.toLowerCase()
        );

        setUserStats({
          name: storedUser.name || "You",
          balance,
          rank: myIndex !== -1 ? myIndex + 1 : 1,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0f14] text-white p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black flex items-center gap-3">
            <Trophy className="text-yellow-400" /> Market Titans
          </h1>
          <p className="text-gray-400 mt-1">Live rankings updated in real-time.</p>
        </div>

        <div className="bg-blue-600 p-0.5 rounded-xl">
          <div className="bg-[#161b22] px-5 py-3 rounded-lg text-right">
            <p className="text-[10px] uppercase text-blue-400 font-bold">Your Rank</p>
            <p className="text-xl font-black">#{userStats.rank}</p>
            <p className="text-xs text-green-400 font-mono">
              ₹{userStats.balance.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center text-gray-400 mt-20 tracking-widest uppercase text-xs">
          Syncing leaderboard...
        </div>
      )}

      {/* Empty */}
      {!loading && traders.length === 0 && (
        <div className="text-center text-gray-400 mt-20">
          No traders yet. Start trading to appear here 🚀
        </div>
      )}

      {/* Podium */}
      {!loading && traders.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {traders.slice(0, 3).map((t, i) => (
            <div
              key={t.id}
              className={`bg-[#161b22] rounded-2xl p-6 text-center border ${
                i === 0 ? "border-yellow-400/40" : "border-gray-800"
              }`}
            >
              {i === 0 && <Crown className="mx-auto text-yellow-400 mb-2" />}
              <div className="text-2xl font-black mb-1">#{i + 1}</div>
              <div className="font-bold">{t.full_name || "Trader"}</div>
              <div className="text-green-400 font-mono mt-1">
                ₹{Number(t.balance).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
