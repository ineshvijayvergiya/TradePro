"use client";
import Link from 'next/link';
import { 
  TrendingUp, ArrowRight, Shield, Zap, BarChart3, 
  Activity, Globe, Smartphone, CheckCircle, Lock,
  ArrowUpRight, ArrowDownRight, Wallet, Star
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0b0f14] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden scroll-smooth">
        
        {/* --- NAVBAR --- */}
        <nav className="fixed top-0 w-full z-50 bg-[#0b0f14]/80 backdrop-blur-md border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-600/20">
                        <TrendingUp size={20} className="text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">TradePro</span>
                </div>
                
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
                    <a href="#features" className="hover:text-white transition-colors">Features</a>
                    <a href="#market-preview" className="hover:text-white transition-colors">Markets</a>
                    <a href="#testimonials" className="hover:text-white transition-colors">Reviews</a>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/login" className="text-sm font-semibold text-gray-300 hover:text-white transition-colors">Log in</Link>
                    <Link href="/signup" className="bg-white text-black px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-200 transition-all shadow-md">Sign Up Free</Link>
                </div>
            </div>
        </nav>

        {/* --- HERO SECTION --- */}
        <section className="pt-40 pb-20 px-6 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-blue-600/10 blur-[120px] rounded-full -z-10"></div>
            <div className="max-w-7xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-800 text-xs font-medium text-blue-400 mb-8">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    Live Trading Simulator v2.0 Now Real-Time
                </div>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
                    Practice Stock Trading <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">With Zero Risk.</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Trade real market data with <strong>₹10,00,000</strong> virtual money. 
                    Learn strategies and build confidence before investing real capital.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mb-16">
                    <Link href="/login" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95">
                        Start Paper Trading <ArrowRight size={20} />
                    </Link>
                    <Link href="#market-preview" className="px-8 py-4 rounded-xl font-bold text-lg border border-gray-700 hover:bg-gray-800 text-gray-300 transition-all active:scale-95">View Market Data</Link>
                </div>
            </div>
        </section>

        {/* --- TRUST ROW --- */}
        <section className="border-y border-gray-800 bg-[#0e1117]">
            <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div className="flex flex-col items-center gap-2">
                    <Activity className="text-green-500 w-8 h-8" /><h3 className="font-bold">Real-Time Data</h3>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <Wallet className="text-blue-500 w-8 h-8" /><h3 className="font-bold">₹10 Lakh Virtual</h3>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <Zap className="text-yellow-500 w-8 h-8" /><h3 className="font-bold">Instant Execution</h3>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <Lock className="text-purple-500 w-8 h-8" /><h3 className="font-bold">Secure Platform</h3>
                </div>
            </div>
        </section>

        {/* --- MARKET PREVIEW --- */}
        <section id="market-preview" className="py-24 px-6">
            <div className="max-w-7xl mx-auto text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Live Market Pulse</h2>
                <p className="text-gray-400">Top indices performance today</p>
            </div>
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                {[{ name: 'NIFTY 50', val: '22,145', up: true }, { name: 'SENSEX', val: '73,500', up: true }, { name: 'NASDAQ', val: '16,200', up: false }].map((idx) => (
                    <div key={idx.name} className="p-6 bg-[#161b22] border border-gray-800 rounded-xl">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-bold text-gray-400">{idx.name}</span>
                            {idx.up ? <ArrowUpRight className="text-green-500"/> : <ArrowDownRight className="text-red-500"/>}
                        </div>
                        <span className="text-2xl font-bold">{idx.val}</span>
                    </div>
                ))}
            </div>
        </section>

        {/* --- FEATURES --- */}
        <section id="features" className="py-24 px-6 bg-[#0e1117]">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {[{ icon: BarChart3, title: "Pro Charting", desc: "Advanced technical charts." }, { icon: Globe, title: "News Feed", desc: "Global financial news." }, { icon: Shield, title: "Analytics", desc: "Deep P&L reports." }].map((f, i) => (
                    <div key={i} className="p-8 bg-[#161b22] border border-gray-800 rounded-2xl hover:border-blue-500/50 transition-all">
                        <f.icon className="text-blue-500 mb-6" size={32} />
                        <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                        <p className="text-gray-400">{f.desc}</p>
                    </div>
                ))}
            </div>
        </section>

        {/* --- TESTIMONIALS --- */}
        <section id="testimonials" className="py-24 px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Loved by Traders</h2>
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                {["TradePro is clean and fast.", "Best simulator for NSE stocks.", "Helped me build my confidence."].map((quote, i) => (
                    <div key={i} className="p-6 bg-[#161b22] border border-gray-800 rounded-xl italic text-gray-300">
                        <Star className="text-yellow-500 mb-4" size={16} fill="currentColor" />
                        "{quote}"
                    </div>
                ))}
            </div>
        </section>

        {/* --- FOOTER --- */}
        <footer className="py-12 px-6 border-t border-gray-800 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} TradePro Inc. All rights reserved.</p>
        </footer>
    </div>
  );
}