"use client";

import React, { useState } from 'react';
import { Check, X, Zap, Crown, Shield } from 'lucide-react';

export default function SubscriptionPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: "Basic Trader",
      price: "Free",
      description: "Essential tools for casual investors.",
      features: [
        "Real-time Market Data (15min delay)",
        "Basic Charting Tools",
        "Daily News Updates",
        "Portfolio Tracking (Max 5 Stocks)",
      ],
      notIncluded: [
        "F&O Dashboard Access",
        "AI Sentiment Analysis",
        "Institutional Flow Data",
        "SMS/WhatsApp Alerts"
      ],
      buttonText: "Current Plan",
      highlight: false
    },
    {
      name: "TradePro Elite",
      price: billingCycle === 'monthly' ? "₹999" : "₹9,999",
      period: billingCycle === 'monthly' ? "/mo" : "/yr",
      description: "Advanced intelligence for serious traders.",
      features: [
        "Real-time Data (Tick-by-Tick)",
        "Advanced F&O & Option Chain",
        "AI-Powered News Sentiment",
        "Unlimited Portfolio Tracking",
        "Institutional (FII/DII) Heatmaps",
        "Instant WhatsApp Signals"
      ],
      notIncluded: [],
      buttonText: "Upgrade Now",
      highlight: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b0f14] py-10 px-4 pb-20">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Upgrade your Trading Arsenal
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Get the unfair advantage with TradePro Elite. Faster data, smarter insights, and better execution.
        </p>

        {/* Toggle Button */}
        <div className="mt-8 inline-flex bg-white dark:bg-[#161b22] p-1 rounded-xl border border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
              billingCycle === 'monthly' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
              billingCycle === 'yearly' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Yearly <span className="ml-1 text-[10px] bg-green-500 text-white px-1.5 py-0.5 rounded-full">SAVE 20%</span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <div 
            key={plan.name}
            className={`relative rounded-2xl p-8 border transition-transform hover:-translate-y-1 duration-300 ${
              plan.highlight 
                ? 'bg-white dark:bg-[#161b22] border-blue-500 shadow-xl ring-1 ring-blue-500' 
                : 'bg-white dark:bg-[#161b22] border-gray-200 dark:border-gray-800'
            }`}
          >
            {plan.highlight && (
              <div className="absolute top-0 right-0 -mt-3 -mr-3">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                  <Crown size={12} fill="currentColor" /> RECOMMENDED
                </span>
              </div>
            )}

            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{plan.name}</h3>
            <p className="text-sm text-gray-500 mt-2 h-10">{plan.description}</p>
            
            <div className="my-6">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
              {plan.period && <span className="text-gray-500">{plan.period}</span>}
            </div>

            <button className={`w-full py-3 rounded-xl font-bold mb-8 transition-colors ${
              plan.highlight 
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}>
              {plan.buttonText}
            </button>

            <div className="space-y-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Features</p>
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <div className={`mt-0.5 p-0.5 rounded-full ${plan.highlight ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                    <Check size={14} />
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                </div>
              ))}
              
              {plan.notIncluded.map((feature) => (
                <div key={feature} className="flex items-start gap-3 opacity-50">
                  <div className="mt-0.5 p-0.5 rounded-full bg-red-100 dark:bg-red-900/20 text-red-500">
                    <X size={14} />
                  </div>
                  <span className="text-sm text-gray-500 line-through">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Trust Badges */}
      <div className="mt-16 text-center">
        <p className="text-sm text-gray-500 mb-6">Trusted by 50,000+ Traders across India</p>
        <div className="flex justify-center gap-8 opacity-50 grayscale">
            {/* Logos ke liye placeholders - text hi kaafi hai abhi */}
            <span className="font-bold text-xl text-gray-600 dark:text-gray-400">HDFC securities</span>
            <span className="font-bold text-xl text-gray-600 dark:text-gray-400">Zerodha</span>
            <span className="font-bold text-xl text-gray-600 dark:text-gray-400">Groww</span>
        </div>
      </div>

    </div>
  );
}