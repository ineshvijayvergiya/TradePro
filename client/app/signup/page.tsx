"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2 } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { supabase } from '@/lib/supabase'; // ✅ Supabase Import
import { toast } from 'react-hot-toast';

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirm: '' });

  // --- GOOGLE SIGNUP ---
  const handleGoogleSignup = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`, // Login ke baad Dashboard par bhejega
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error("Google Signup Failed");
    }
  };

  // --- EMAIL SIGNUP ---
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Password Check
    if(formData.password !== formData.confirm) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      // 2. Create User in Supabase
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          // User ka naam metadata mein save hoga
          data: { full_name: formData.name } 
        }
      });

      if (error) throw error;

      // 3. Success
      toast.success("Account Created! Welcome to TradePro.");
      
      // Local storage for instant UI update (Optional but good for speed)
      localStorage.setItem('tradeProUser', JSON.stringify({ name: formData.name }));
      
      router.push('/dashboard');

    } catch (error: any) {
      toast.error(error.message || "Signup failed");
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
           <h1 className="text-3xl font-bold mb-2 text-foreground">Create Account</h1>
           <p className="text-muted mb-8">Start with ₹10,00,000 virtual cash.</p>

           <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-1.5">
                 <label className="block text-sm font-semibold text-foreground">Full Name</label>
                 <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                   className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="John Doe" />
              </div>
              <div className="space-y-1.5">
                 <label className="block text-sm font-semibold text-foreground">Email</label>
                 <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                   className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="name@example.com" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                   <label className="block text-sm font-semibold text-foreground">Password</label>
                   <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                     className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" placeholder="••••••••" />
                </div>
                <div className="space-y-1.5">
                   <label className="block text-sm font-semibold text-foreground">Confirm</label>
                   <input required type="password" value={formData.confirm} onChange={e => setFormData({...formData, confirm: e.target.value})}
                     className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" placeholder="••••••••" />
                </div>
              </div>

              <button 
                type="submit" disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-primary/25 disabled:opacity-70 mt-4"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : 'Get Started'} 
                {!isLoading && <ArrowRight size={18}/>}
              </button>
           </form>

           <div className="relative my-8 text-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
              <span className="relative bg-card px-3 text-xs text-muted uppercase font-medium">Or sign up with</span>
           </div>

           <button 
             type="button" 
             onClick={handleGoogleSignup}
             className="w-full bg-background border border-border hover:bg-muted/10 text-foreground font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-3"
           >
             <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
             Google
           </button>

           <p className="text-center text-muted text-sm mt-8">
              Already a member? <Link href="/login" className="text-primary hover:text-primary/80 font-bold">Log in</Link>
           </p>
        </div>
      </div>

      {/* RIGHT: ILLUSTRATION */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-bl from-secondary via-teal-600 to-primary relative items-center justify-center p-12">
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
         <div className="relative bg-white/10 backdrop-blur-md border border-white/20 p-10 rounded-3xl shadow-2xl max-w-lg text-white">
            <h2 className="text-3xl font-bold mb-4">Master the Market.</h2>
            <p className="text-teal-50 text-lg leading-relaxed">
               Advanced charting, portfolio analysis, and risk-free execution.
            </p>
         </div>
      </div>

    </div>
  );
}