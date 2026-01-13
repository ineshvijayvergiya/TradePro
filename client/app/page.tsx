"use client";
import Link from 'next/link';
import { motion } from "framer-motion"; // 👈 Animation ke liye
import { 
  TrendingUp, ArrowRight, Zap, BarChart3, 
  Activity, Globe, Lock, Wallet, Star, 
  Layout, Smartphone, MousePointer2, ChevronRight
} from 'lucide-react';

export default function LandingPage() {

  // Animation Variants (Settings)
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f14] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
        
        {/* --- NAVBAR --- */}
        <nav className="fixed top-0 w-full z-50 bg-[#0b0f14]/80 backdrop-blur-md border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="bg-blue-600 p-2 rounded-lg">
                        <TrendingUp size={20} className="text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">TradePro</span>
                </div>
                
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
                    <a href="#features" className="hover:text-white transition-colors">Platform</a>
                    <a href="#markets" className="hover:text-white transition-colors">Markets</a>
                    <a href="#start" className="hover:text-white transition-colors">How it Works</a>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/login" className="text-sm font-semibold text-gray-300 hover:text-white">Log in</Link>
                    <Link href="/signup" className="bg-white text-black px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-200 transition-all">Sign Up Free</Link>
                </div>
            </div>
        </nav>

        {/* --- HERO SECTION (Animated) --- */}
        <section className="pt-36 pb-16 px-6 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full -z-10 opacity-50"></div>
            
            <div className="max-w-7xl mx-auto text-center relative z-10">
                <motion.div 
                    initial="hidden" 
                    animate="visible" 
                    variants={fadeInUp}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-8">
                      <span className="animate-pulse w-2 h-2 rounded-full bg-blue-400"></span>
                      V2.0 is Live with Real-Time Data
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
                        Master the Markets. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Zero Risk Involved.</span>
                    </h1>
                    
                    {/* 👇 Updated to ₹10,000 */}
                    <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                        Experience a professional trading terminal with <strong>₹10,000</strong> virtual capital. 
                        Real-time data for Stocks, Crypto, and Forex.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mb-16">
                        <Link href="/login" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/25 hover:-translate-y-1">
                            Start Paper Trading <ArrowRight size={20} />
                        </Link>
                        <Link href="#markets" className="px-8 py-4 rounded-xl font-bold text-lg border border-gray-700 hover:bg-gray-800 text-gray-300 transition-all">
                            View Live Markets
                        </Link>
                    </div>
                </motion.div>

                {/* Dashboard Screenshot with Floating Animation */}
                <motion.div 
                    initial={{ opacity: 0, y: 50, rotateX: 10 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative mx-auto max-w-6xl mt-8 perspective-1000"
                >
                  <div className="absolute -inset-1 bg-gradient-to-b from-blue-500 to-transparent rounded-xl blur opacity-20"></div>
                  <img 
                    src="/TradePro-app.png" 
                    alt="TradePro Dashboard Interface" 
                    className="relative rounded-xl border border-gray-800 shadow-2xl bg-[#0b0f14] w-full"
                  />
                  <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0b0f14] to-transparent"></div>
                </motion.div>
            </div>
        </section>

        {/* --- BENTO GRID FEATURES (Staggered Animation) --- */}
        <section id="features" className="py-24 px-6 bg-[#0e1117]">
            <div className="max-w-7xl mx-auto">
                <motion.div 
                    initial="hidden" 
                    whileInView="visible" 
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Tools for Every Trader</h2>
                    <p className="text-gray-400">Everything you need to analyze, trade, and grow.</p>
                </motion.div>

                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]"
                >
                    
                    {/* Large Card */}
                    <motion.div variants={fadeInUp} className="md:col-span-2 relative group overflow-hidden rounded-3xl bg-[#161b22] border border-gray-800 p-8 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10">
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 text-blue-400">
                                <BarChart3 size={24} />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Pro-Level Charting</h3>
                            <p className="text-gray-400 max-w-md">Advanced technical indicators, drawing tools, and multi-timeframe analysis right in your browser.</p>
                        </div>
                        <div className="absolute right-0 bottom-0 w-2/3 h-full opacity-20 group-hover:opacity-30 transition-opacity">
                             <svg className="w-full h-full text-blue-500 fill-current" viewBox="0 0 400 200">
                                 <path d="M0 150 Q 50 100 100 120 T 200 80 T 300 100 T 400 50 V 200 H 0 Z" />
                             </svg>
                        </div>
                    </motion.div>

                    {/* Tall Card */}
                    <motion.div variants={fadeInUp} className="md:row-span-2 relative group overflow-hidden rounded-3xl bg-gradient-to-b from-[#161b22] to-blue-900/10 border border-gray-800 p-8 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10">
                        <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 text-purple-400">
                            <Smartphone size={24} />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Trade Anywhere</h3>
                        <p className="text-gray-400 mb-8">Fully responsive interface. Monitor your positions from your desktop, tablet, or phone.</p>
                        
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-64 bg-[#0b0f14] border-t-4 border-x-4 border-gray-700 rounded-t-3xl p-4 shadow-2xl group-hover:translate-y-2 transition-transform">
                             <div className="w-full h-8 bg-gray-800 rounded-full mb-4 animate-pulse"></div>
                             <div className="w-2/3 h-4 bg-gray-800 rounded-full mb-2"></div>
                             <div className="w-full h-32 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-xl mt-4 border border-gray-700"></div>
                        </div>
                    </motion.div>

                    {/* Small Card */}
                    <motion.div variants={fadeInUp} className="relative group overflow-hidden rounded-3xl bg-[#161b22] border border-gray-800 p-8 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10">
                        <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-4 text-green-400">
                            <Activity size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Deep Analytics</h3>
                        <p className="text-gray-400 text-sm">Track your Win/Loss ratio and visualize portfolio growth.</p>
                    </motion.div>

                    {/* Small Card */}
                    <motion.div variants={fadeInUp} className="relative group overflow-hidden rounded-3xl bg-[#161b22] border border-gray-800 p-8 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10">
                        <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center mb-4 text-yellow-400">
                            <Globe size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Global Markets</h3>
                        <p className="text-gray-400 text-sm">Access NYSE, NASDAQ, and NSE data in real-time.</p>
                    </motion.div>

                </motion.div>
            </div>
        </section>

        {/* --- 3-STEP START GUIDE --- */}
        <section id="start" className="py-24 px-6">
            <div className="max-w-7xl mx-auto">
                <motion.div 
                    initial="hidden" 
                    whileInView="visible" 
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl font-bold">Start Paper Trading in Minutes</h2>
                    <p className="text-gray-400">No deposit required. It's completely free.</p>
                </motion.div>

                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    {[
                        { step: "01", title: "Create Account", desc: "Sign up in 30 seconds. No credit card needed." },
                        { step: "02", title: "Get Virtual Cash", desc: "Instant ₹10,000 credited to your demo wallet." }, // 👈 Updated to 10k
                        { step: "03", title: "Place Trades", desc: "Buy and sell stocks with live market prices." }
                    ].map((item, i) => (
                        <motion.div key={i} variants={fadeInUp} className="relative p-8 rounded-2xl bg-[#161b22] border border-gray-800 hover:bg-[#1c222b] transition-colors">
                            <span className="absolute -top-6 left-8 text-6xl font-black text-gray-800/50 select-none">{item.step}</span>
                            <div className="relative z-10 pt-4">
                                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                <p className="text-gray-400">{item.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>

        {/* --- LIVE MARKETS TABLE --- */}
        <section id="markets" className="py-24 px-6 bg-[#0e1117]">
             <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">Market Movers</h2>
                        <p className="text-gray-400">Top traded assets today</p>
                    </div>
                    <Link href="/login" className="text-blue-400 hover:text-blue-300 flex items-center gap-1">
                        View All Markets <ChevronRight size={16} />
                    </Link>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="overflow-x-auto rounded-2xl border border-gray-800 shadow-2xl"
                >
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#1c222b] text-xs uppercase text-gray-400">
                            <tr>
                                <th className="p-4 font-medium">Symbol</th>
                                <th className="p-4 font-medium">Price</th>
                                <th className="p-4 font-medium">Change</th>
                                <th className="p-4 font-medium hidden md:table-cell">Market Cap</th>
                                <th className="p-4 font-medium text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800 bg-[#161b22]">
                            {[
                                { sym: "RELIANCE", name: "Reliance Industries", price: "2,448.90", chg: "+1.2%", cap: "₹16.5T", up: true },
                                { sym: "TCS", name: "Tata Consultancy Srv", price: "3,980.50", chg: "-0.5%", cap: "₹14.2T", up: false },
                                { sym: "HDFCBANK", name: "HDFC Bank Ltd", price: "1,450.00", chg: "+0.8%", cap: "₹11.0T", up: true },
                                { sym: "INFY", name: "Infosys Limited", price: "1,620.45", chg: "+2.1%", cap: "₹6.8T", up: true },
                            ].map((stock, i) => (
                                <tr key={i} className="hover:bg-white/5 transition-colors cursor-pointer group">
                                    <td className="p-4">
                                        <div className="font-bold text-white group-hover:text-blue-400 transition-colors">{stock.sym}</div>
                                        <div className="text-xs text-gray-500">{stock.name}</div>
                                    </td>
                                    <td className="p-4 font-medium">{stock.price}</td>
                                    <td className={`p-4 font-medium ${stock.up ? 'text-green-500' : 'text-red-500'}`}>
                                        {stock.chg}
                                    </td>
                                    <td className="p-4 text-gray-400 hidden md:table-cell">{stock.cap}</td>
                                    <td className="p-4 text-right">
                                        <Link href="/login" className="inline-flex p-2 rounded-lg bg-gray-800 hover:bg-blue-600 hover:text-white text-gray-400 transition-colors">
                                            <Zap size={16} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>
             </div>
        </section>

        {/* --- CTA & FOOTER --- */}
        <footer className="pt-24 pb-12 px-6 border-t border-gray-800 text-center">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="max-w-4xl mx-auto mb-16"
            >
                <h2 className="text-4xl font-bold mb-6">Ready to test your strategies?</h2>
                <p className="text-xl text-gray-400 mb-8">Join 500+ traders mastering the markets risk-free.</p>
                <Link href="/signup" className="inline-block bg-white text-black px-10 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors hover:scale-105 transform">
                    Create Free Account
                </Link>
            </motion.div>
            <p className="text-gray-600 text-sm">&copy; {new Date().getFullYear()} TradePro. Built for educational purposes.</p>
        </footer>
    </div>
  );
}