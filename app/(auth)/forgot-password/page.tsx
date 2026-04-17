'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowRight, LifeBuoy, Mail, ShieldAlert } from 'lucide-react';
import { AuthLanding } from '@/components/auth-landing';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const data = await forgotPassword(email);
      
      // Since nodemailer is not set up, backend returns resetToken directly
      if (data && data.resetToken) {
        setSuccess('Reset token generated. Redirecting to recovery terminal...');
        setTimeout(() => {
          router.push(`/reset-password?token=${data.resetToken}`);
        }, 2000);
      } else {
        setSuccess('If an account exists with this email, recovery instructions have been sent.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Recovery request failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLanding>
      <div className="w-full bg-slate-900/60 backdrop-blur-xl border-2 border-slate-800 p-8 md:p-12 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
        
        <div className="relative z-10">
          <div className="mb-10 text-center lg:text-left">
            <div className="flex items-center gap-3 mb-4 justify-center lg:justify-start">
              <div className="p-2 bg-primary/20 rounded-none border border-primary/30">
                <ShieldAlert className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-white uppercase">Emergency Recovery</h2>
            </div>
            <p className="text-sm text-slate-400 font-medium uppercase tracking-wider">Initialize protocol to regain registry access</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive" className="animate-in fade-in zoom-in-95 border-destructive/50 bg-destructive/10 text-destructive shadow-lg shadow-destructive/10 rounded-none">
                <AlertDescription className="font-bold text-[10px] uppercase tracking-widest">{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="animate-in fade-in zoom-in-95 border-emerald-500/50 bg-emerald-500/10 text-emerald-500 shadow-lg shadow-emerald-500/10 rounded-none text-center">
                <AlertDescription className="font-bold text-[10px] uppercase tracking-widest">{success}</AlertDescription>
              </Alert>
            )}

            {!success && (
              <>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                      Registered Registry Email
                    </label>
                    <div className="relative group/input">
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-14 px-4 pl-12 bg-slate-950/50 border-slate-800 focus:border-primary transition-all rounded-none text-white placeholder:text-slate-700"
                        required
                      />
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700 group-focus-within/input:text-primary transition-colors" />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-14 text-sm font-bold tracking-[0.2em] group rounded-none bg-primary hover:bg-primary/90 text-white mt-4 relative overflow-hidden border-2 border-primary/20"
                  disabled={isLoading}
                >
                  <span className="relative z-10 flex items-center justify-center uppercase">
                    {isLoading ? 'Processing...' : 'Request Recovery'}
                    {!isLoading && <LifeBuoy className="w-5 h-5 ml-2 group-hover:rotate-180 transition-transform duration-700" />}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                </Button>
              </>
            )}
          </form>

          <div className="mt-10 pt-10 border-t border-slate-800 text-center flex flex-col gap-4">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              Remember your key?{' '}
              <Link href="/login" className="text-white hover:text-primary transition-all">
                Return to Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AuthLanding>
  );
}
