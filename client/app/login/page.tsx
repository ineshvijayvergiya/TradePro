"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Lock, Mail, Loader2 } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { supabase } from '@/lib/supabase'; // ✅ Supabase Import
import { toast } from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  // --- GOOGLE LOGIN ---
  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error("Google Login Failed");
    }
  };

  // --- EMAIL LOGIN ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Supabase Auth Check
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      // 2. Success Logic
      toast.success("Welcome back, Trader!");
      
      // User ka data local storage mein daal do taaki UI par naam dikhe
      const userName = formData.email.split('@')[0];
      localStorage.setItem('tradeProUser', JSON.stringify({ name: userName, email: formData.email }));
      
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden font-sans">
      
      {/* LEFT: FORM */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12 bg-card relative z-10 shadow-xl">
        <div className="absolute top-8 left-8 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-white text-xl group-hover:scale-105 transition-transform">T</div>
              <span className="font-bold text-lg text-foreground">TradePro</span>
          </Link>
        </div>
        <div className="absolute top-8 right-8">
            <ThemeToggle />
        </div>

        <div className="max-w-md w-full mx-auto animate-fade-in-up">
            <h1 className="text-3xl font-bold mb-2 text-foreground">Welcome back</h1>
            <p className="text-muted mb-8">Enter your details to access your portfolio.</p>

            <form onSubmit={handleLogin} className="space-y-5">
               <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-foreground">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-muted h-5 w-5" />
                    <input 
                      required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted/50"
                      placeholder="name@example.com"
                    />
                  </div>
               </div>
               <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-foreground">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-muted h-5 w-5" />
                    <input 
                      required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                      className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted/50"
                      placeholder="••••••••"
                    />
                  </div>
               </div>

               <button 
                 type="submit" 
                 disabled={isLoading}
                 className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-primary/25 disabled:opacity-70"
               >
                 {isLoading ? <Loader2 className="animate-spin" /> : 'Sign In'} 
                 {!isLoading && <ArrowRight size={18}/>}
               </button>
            </form>

            <div className="relative my-8 text-center">
               <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
               <span className="relative bg-card px-3 text-xs text-muted uppercase font-medium">Or continue with</span>
            </div>

            <button 
              type="button"
              onClick={handleGoogleLogin} // ✅ Google Logic Linked
              className="w-full bg-background border border-border hover:bg-muted/10 text-foreground font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
              Google
            </button>

            <p className="text-center text-muted text-sm mt-8">
               Don't have an account? <Link href="/signup" className="text-primary hover:text-primary/80 font-bold">Sign up</Link>
            </p>
        </div>
      </div>

      {/* RIGHT: ILLUSTRATION */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary via-blue-600 to-purple-600 relative items-center justify-center p-12">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          <div className="relative bg-white/10 backdrop-blur-md border border-white/20 p-10 rounded-3xl shadow-2xl max-w-lg text-white">
            <h2 className="text-3xl font-bold mb-4">Secure & Seamless.</h2>
            <p className="text-blue-50 text-lg leading-relaxed mb-6">
               Join thousands of traders practicing their strategies in a risk-free environment.
            </p>
            <div className="flex gap-4">
               <div className="h-2 w-12 bg-white/50 rounded-full"></div>
               <div className="h-2 w-8 bg-white/30 rounded-full"></div>
            </div>
          </div>
      </div>

    </div>
  );
}