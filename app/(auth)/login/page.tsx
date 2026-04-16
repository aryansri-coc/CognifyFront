'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Activity, Heart, ArrowRight, ShieldCheck, BrainCircuit, ActivitySquare, Sparkles } from 'lucide-react';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-background overflow-hidden relative">
      
      {/* Decorative background glow for the right panel */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

      {/* Left Pane - Website Preview / Marketing */}
      <div className="hidden lg:flex w-1/2 relative bg-slate-900 items-center justify-center flex-col overflow-hidden">
        {/* Abstract Generated Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/auth-bg.png" 
            alt="Cognify AI Illustration" 
            layout="fill" 
            objectFit="cover" 
            className="opacity-60 mix-blend-screen scale-105 animate-[pulse_10s_ease-in-out_infinite]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950/90 via-violet-900/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 flex flex-col p-16 text-primary-foreground max-w-2xl h-full justify-between w-full">
          {/* Logo & Headline */}
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-xl flex items-center justify-center p-2 opacity-90 transition-transform hover:scale-105">
                <Image src="/logo.png" alt="Cognify Logo" width={48} height={48} priority />
              </div>
              <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">Cognify</span>
            </div>
            <h1 className="text-6xl font-black mb-6 tracking-tight leading-[1.05]">
              Intelligent care,<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-fuchsia-300">
                orchestrated by AI.
              </span>
            </h1>
            <p className="text-xl text-slate-300 max-w-lg leading-relaxed font-light">
              Connect your vitals, communicate with caregivers, and preserve your cognitive health using proactive machine learning.
            </p>
          </div>

          {/* Interactive Floating Preview Card */}
          <div className="bg-white/5 backdrop-blur-2xl rounded-[2rem] p-8 border border-white/10 mt-12 shadow-[0_45px_70px_-15px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 duration-1000 delay-200 hover:bg-white/10 hover:-translate-y-1 hover:shadow-[0_50px_80px_-10px_rgba(139,92,246,0.2)] transition-all overflow-hidden relative group">
            
            {/* Glossy highlight effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <div className="flex items-center justify-between mb-8 relative z-10">
               <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-inner relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/20 animate-pulse mix-blend-overlay" />
                    <Sparkles className="w-8 h-8 text-white relative z-10" />
                  </div>
                  <div>
                    <p className="text-sm text-violet-200 font-medium uppercase tracking-wider">AI Platform Core</p>
                    <p className="text-2xl font-bold text-white tracking-tight">Cognitive Engine</p>
                  </div>
               </div>
               <div className="text-right">
                 <p className="text-4xl font-black text-white">100%</p>
                 <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-emerald-500/20 text-emerald-300 px-4 py-1.5 mt-1 rounded-full border border-emerald-500/30 backdrop-blur-md">
                   <ShieldCheck className="w-3 h-3" />
                   HIPAA Secure
                 </span>
               </div>
            </div>
            
            <div className="grid grid-cols-2 gap-5 relative z-10">
              <div className="bg-slate-900/40 rounded-2xl p-5 border border-white/5 hover:border-violet-500/30 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <ActivitySquare className="w-5 h-5 text-violet-400" />
                  <p className="text-xs text-slate-300 font-bold uppercase tracking-wider">Insights</p>
                </div>
                <p className="text-xl font-bold text-white">Real-time <span className="text-sm font-medium text-slate-400">Analysis</span></p>
              </div>
              <div className="bg-slate-900/40 rounded-2xl p-5 border border-white/5 hover:border-fuchsia-500/30 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <BrainCircuit className="w-5 h-5 text-fuchsia-400" />
                  <p className="text-xs text-slate-300 font-bold uppercase tracking-wider">Brain Health</p>
                </div>
                <p className="text-xl font-bold text-white">Advanced <span className="text-sm font-medium text-slate-400">Tracking</span></p>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-16 text-sm text-slate-400 font-medium tracking-wide">
             <p>&copy; {new Date().getFullYear()} Cognify Technologies. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* Right Pane - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative overflow-y-auto z-10 bg-background/50 backdrop-blur-xl">
        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-[0.02] mix-blend-overlay pointer-events-none" />
        
        <div className="w-full max-w-[420px] animate-in fade-in slide-in-from-right-8 duration-700">
          
          {/* Mobile Logo Fallback */}
          <div className="lg:hidden flex items-center gap-2 mb-10 justify-center">
            <Image src="/logo.png" alt="Cognify Logo" width={40} height={40} className="rounded-xl shadow-lg" />
            <span className="text-3xl font-extrabold text-foreground tracking-tight">Cognify</span>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-4xl font-black tracking-tight text-foreground mb-3">Welcome back</h2>
            <p className="text-lg text-muted-foreground font-medium">Please enter your details to sign in.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive" className="animate-in fade-in zoom-in-95 border-destructive/50 bg-destructive/10 text-destructive shadow-lg shadow-destructive/10">
                <AlertDescription className="font-medium">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-bold text-foreground/80 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative group">
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 px-4 bg-muted/40 border-muted group-hover:border-primary/50 focus:border-primary transition-all rounded-xl text-base"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-bold text-foreground/80 uppercase tracking-wider">
                    Password
                  </label>
                  <Link href="#" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative group">
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-14 px-4 bg-muted/40 border-muted group-hover:border-primary/50 focus:border-primary transition-all rounded-xl text-base tracking-widest"
                    required
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-14 text-lg font-bold hover:scale-[1.02] transition-all duration-300 shadow-xl shadow-primary/20 group rounded-xl bg-primary hover:bg-primary/90 mt-4 relative overflow-hidden"
              disabled={isLoading}
            >
              <span className="relative z-10 flex items-center justify-center">
                {isLoading ? 'Authenticating...' : 'Sign In'}
                {!isLoading && <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
              </span>
              {/* Button inner glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            </Button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-muted-foreground font-medium">
              New to Cognify?{' '}
              <Link href="/register" className="text-primary font-bold hover:underline transition-all">
                Create an account
              </Link>
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}
