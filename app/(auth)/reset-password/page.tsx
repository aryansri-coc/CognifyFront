'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { KeyRound, Lock, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { AuthLanding } from '@/components/auth-landing';
import Link from 'next/link';

function ResetPasswordForm() {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPassword } = useAuth();

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      // If no token, redirect back to forgot-password after a short delay
      setError('Invalid or missing recovery session. Redirecting to initialization terminal...');
      setTimeout(() => {
        router.push('/forgot-password');
      }, 3000);
    }
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!token) {
      setError('Recovery session expired or invalid. Please request a new token.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;
    if (!passwordRegex.test(password)) {
      setError('Access Key security insufficient. Requirements: Minimum 6 characters, at least one uppercase letter (A-Z), and at least one special character/symbol.');
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword(token, password);
      setSuccess('Registry access key updated successfully.');
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Password reset failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-slate-900/60 backdrop-blur-xl border-2 border-slate-800 p-8 md:p-12 shadow-2xl relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
      
      <div className="relative z-10">
        <div className="mb-10 text-center lg:text-left">
          <div className="flex items-center gap-3 mb-4 justify-center lg:justify-start">
            <div className="p-2 bg-primary/20 rounded-none border border-primary/30">
              <KeyRound className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white uppercase">Reset Access Key</h2>
          </div>
          <p className="text-sm text-slate-400 font-medium uppercase tracking-wider">Configure new authentication credentials</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive" className="animate-in fade-in zoom-in-95 border-destructive/50 bg-destructive/10 text-destructive shadow-lg shadow-destructive/10 rounded-none">
              <AlertDescription className="font-bold text-[10px] uppercase tracking-widest">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="animate-in fade-in zoom-in-95 border-emerald-500/50 bg-emerald-500/10 text-emerald-500 shadow-lg shadow-emerald-500/10 rounded-none text-center py-8">
              <div className="flex flex-col items-center gap-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 animate-bounce" />
                <AlertDescription className="font-bold text-xs uppercase tracking-[0.2em]">{success}</AlertDescription>
                <p className="text-[10px] text-emerald-500/60 uppercase tracking-widest">Redirecting to login terminal...</p>
              </div>
            </Alert>
          )}

          {!success && token && (
            <>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="password" className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                    New Access Key
                  </label>
                  <div className="relative group/input">
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-14 px-4 pl-12 bg-slate-950/50 border-slate-800 focus:border-primary transition-all rounded-none text-white placeholder:text-slate-700"
                      required
                    />
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700 group-focus-within/input:text-primary transition-colors" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                    Confirm Access Key
                  </label>
                  <div className="relative group/input">
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-14 px-4 pl-12 bg-slate-950/50 border-slate-800 focus:border-primary transition-all rounded-none text-white placeholder:text-slate-700"
                      required
                    />
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700 group-focus-within/input:text-primary transition-colors" />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-14 text-sm font-bold tracking-[0.2em] group rounded-none bg-primary hover:bg-primary/90 text-white mt-4 relative overflow-hidden border-2 border-primary/20"
                disabled={isLoading}
              >
                <span className="relative z-10 flex items-center justify-center uppercase">
                  {isLoading ? 'Updating Key...' : 'Update Registry Key'}
                  {!isLoading && <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
              </Button>
            </>
          )}
        </form>

        <div className="mt-10 pt-10 border-t border-slate-800 text-center flex flex-col gap-4">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            Back to login?{' '}
            <Link href="/login" className="text-white hover:text-primary transition-all">
              Return to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthLanding>
      <Suspense fallback={
        <div className="w-full bg-slate-900/60 backdrop-blur-xl border-2 border-slate-800 p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="text-center text-white uppercase tracking-widest font-bold">Initializing Recovery Terminal...</div>
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </AuthLanding>
  );
}
