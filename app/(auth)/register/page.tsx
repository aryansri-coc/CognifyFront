'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import Image from 'next/image';
import { Activity, ShieldCheck, BrainCircuit, ActivitySquare, Sparkles, UserPlus } from 'lucide-react';
import { AuthLanding } from '@/components/auth-landing';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      await register(email, password, name);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLanding>
      <div className="w-full bg-slate-900/60 backdrop-blur-xl border-2 border-slate-800 p-8 md:p-12 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
        
        <div className="relative z-10">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-2 uppercase">Create Registry</h2>
            <p className="text-sm text-slate-400 font-medium uppercase tracking-wider">Join our clinical monitoring network</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="animate-in fade-in zoom-in-95 border-destructive/50 bg-destructive/10 text-destructive shadow-lg shadow-destructive/10 rounded-none">
                <AlertDescription className="font-bold text-[10px] uppercase tracking-widest leading-relaxed">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="name" className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                  Full Identity
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Official Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 px-4 bg-slate-950/50 border-slate-800 focus:border-primary transition-all rounded-none text-white placeholder:text-slate-700"
                  required
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="email" className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                  Registry Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 px-4 bg-slate-950/50 border-slate-800 focus:border-primary transition-all rounded-none text-white placeholder:text-slate-700"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="password" className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                    Access Key
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 px-4 bg-slate-950/50 border-slate-800 focus:border-primary transition-all rounded-none text-white tracking-widest placeholder:text-slate-700"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="confirm-password" className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                    Verify Key
                  </label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-12 px-4 bg-slate-950/50 border-slate-800 focus:border-primary transition-all rounded-none text-white tracking-widest placeholder:text-slate-700"
                    required
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-14 text-sm font-bold tracking-[0.2em] group rounded-none bg-primary hover:bg-primary/90 text-white mt-4 relative overflow-hidden border-2 border-primary/20"
              disabled={isLoading}
            >
              <span className="relative z-10 flex items-center justify-center uppercase">
                {isLoading ? 'Creating Registry...' : 'Initialize Account'}
                {!isLoading && <UserPlus className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-800 text-center">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              Already have a registry key?{' '}
              <Link href="/login" className="text-white hover:text-primary transition-all">
                Sign in instead
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AuthLanding>
  );
}
