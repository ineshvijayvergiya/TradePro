"use client";

import "./globals.css"; 
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  CandlestickChart, 
  Briefcase, 
  Newspaper, 
  LogOut, 
  Menu, 
  X,
  UserCircle,
  TrendingUp,
  Trophy 
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast'; 

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{name: string} | null>(null);
  const [loading, setLoading] = useState(true);

  // --- Auth Check ---
  useEffect(() => {
    if (pathname === '/' || pathname === '/login' || pathname === '/signup') {
        setLoading(false);
        return;
    }

    if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('tradeProUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
             setUser({ name: "Guest User" }); 
        }
    }
    setLoading(false);
  }, [pathname]);

  const navItems = [
    { name: 'Markets', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Trade', href: '/dashboard/trade', icon: CandlestickChart },
    { name: 'Portfolio', href: '/dashboard/portfolio', icon: Briefcase },
    { name: 'Leaderboard', href: '/dashboard/leaderboard', icon: Trophy }, // ✅ Added here
    { name: 'News', href: '/dashboard/news', icon: Newspaper },
  ];

  // 1️⃣ SPECIAL CASE: Landing Page / Login / Signup (NO SIDEBAR)
  if (pathname === '/' || pathname === '/login' || pathname === '/signup') {
    return (
      <html lang="en">
        <body className="bg-[#0b0f14] text-white">
          {children}
          <Toaster position="bottom-right" />
        </body>
      </html>
    );
  }

  // 2️⃣ SPECIAL CASE: Trade Page (Full Screen)
  if (pathname === '/dashboard/trade') {
    return (
      <html lang="en">
        <body className="bg-[#0b0f14] text-white">
            <div className="h-screen w-full overflow-hidden">
                {children}
            </div>
            <Toaster position="bottom-right" toastOptions={{
              style: { background: '#1f2937', color: '#fff', border: '1px solid #374151' }
            }}/>
        </body>
      </html>
    );
  }

  // 3️⃣ NORMAL DASHBOARD LAYOUT
  return (
    <html lang="en">
      <body className="bg-slate-50 dark:bg-[#0b0f14] text-slate-900 dark:text-gray-100 h-screen overflow-hidden transition-colors duration-300">
        
        {loading ? (
            <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-[#0b0f14]">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                <p className="text-sm font-medium text-slate-500 animate-pulse">Loading Terminal...</p>
              </div>
            </div>
        ) : (
            <div className="flex h-full w-full">
            
                {/* --- MOBILE HEADER --- */}
                <div className="lg:hidden fixed top-0 w-full bg-white dark:bg-[#161b22] border-b border-gray-200 dark:border-gray-800 z-50 px-4 h-16 flex justify-between items-center shadow-sm">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-600 p-1.5 rounded-lg">
                            <TrendingUp className="text-white w-5 h-5" />
                        </div>
                        <span className="font-bold text-lg text-slate-900 dark:text-white">TradePro</span>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                       {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* --- SIDEBAR --- */}
                <aside className={`
                    fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-[#161b22] border-r border-gray-200 dark:border-gray-800 
                    transform transition-transform duration-300 ease-in-out shadow-xl lg:shadow-none
                    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
                    lg:relative lg:translate-x-0 lg:flex lg:flex-col lg:h-full
                `}>
                    {/* Brand Logo */}
                    <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#161b22]">
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-xl shadow-lg shadow-blue-500/20">
                                <TrendingUp className="text-white w-5 h-5" strokeWidth={2.5} />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">TradePro</span>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                            <Link 
                                key={item.name} 
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                                isActive 
                                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 shadow-sm border border-blue-100 dark:border-blue-900/50' 
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-200'
                                }`}
                            >
                                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                {item.name}
                            </Link>
                            )
                        })}
                    </nav>

                    {/* User Profile Footer */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0e1117]">
                        <div className="flex items-center gap-3 mb-4 p-2 rounded-lg bg-white dark:bg-[#161b22] border border-gray-100 dark:border-gray-800 shadow-sm">
                            <div className="bg-slate-100 dark:bg-gray-800 p-1.5 rounded-full">
                                <UserCircle className="w-6 h-6 text-slate-400" />
                            </div>
                            <div className="overflow-hidden flex-1">
                                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.name || 'Guest Trader'}</p>
                                <p className="text-[10px] font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">Pro Plan</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => {
                                localStorage.removeItem('tradeProUser');
                                router.push('/'); 
                            }}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/10 dark:hover:bg-red-900/20 dark:text-red-400 rounded-xl transition-all"
                        >
                            <LogOut size={16} strokeWidth={2.5} /> 
                            Sign Out
                        </button>
                    </div>
                </aside>

                {/* --- MAIN CONTENT AREA --- */}
                <main className="flex-1 h-full overflow-y-auto bg-slate-50 dark:bg-[#0b0f14] pt-16 lg:pt-0 relative">
                    <div className="min-h-full">
                        {children}
                    </div>
                    <Toaster position="bottom-right" />
                </main>

            </div>
        )}
      </body>
    </html>
  );
}