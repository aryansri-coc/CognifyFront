'use client';

import React from 'react';
import { Smartphone, Download, Box, Zap, QrCode, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function AppDownloadBanner() {
  return (
    <div className="relative group overflow-hidden border-4 border-primary rounded-none shadow-[0_0_30px_rgba(var(--primary-rgb),0.2)] bg-background mt-2 mb-8">
      {/* Dynamic Animated Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[200%] bg-[linear-gradient(transparent_0%,rgba(68,187,255,0.4)_50%,transparent_100%)] animate-[shimmer_8s_linear_infinite]" />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#44bbff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
      </div>

      <div className="relative z-10 p-8 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          <div className="relative">
             <div className="w-20 h-20 border-4 border-primary flex items-center justify-center bg-primary/10 relative overflow-hidden group-hover:scale-110 transition-transform duration-500">
                <Smartphone className="w-10 h-10 text-primary animate-bounce pt-2" />
                <div className="absolute top-0 left-0 w-full h-1 bg-primary animate-[pulse_2s_infinite]" />
             </div>
             {/* Tech Decors */}
             <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-primary" />
             <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-primary" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="px-2 py-0.5 bg-primary text-[8px] font-black text-white uppercase tracking-widest">Mobile Bridge v1.2</span>
              <span className="text-[8px] font-black uppercase text-muted-foreground tracking-widest border border-border px-2 py-0.5">Ready for Telemetry</span>
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tighter text-foreground leading-none">Download Mobile Companion</h2>
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider max-w-[400px]">
              Sync your health metrics in real-time with the Cognify Android APK. Enable high-frequency biometric monitoring.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <Button 
            className="rounded-none bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-[0.2em] px-10 h-16 group relative overflow-hidden flex flex-col items-center justify-center"
            asChild
          >
            <a href="https://github.com/aryansri-coc/CognifyFront/raw/main/downloads/cognify-app.apk">
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5 animate-pulse" />
                <span>Acquire APK</span>
              </div>
              <span className="text-[8px] mt-1 opacity-60">System Version: Oxygen-OS4</span>
              
              {/* Button Hover Shine */}
              <div className="absolute top-0 -left-[100%] w-full h-full bg-white/20 skew-x-[45deg] group-hover:left-[100%] transition-all duration-700" />
            </a>
          </Button>
        </div>
      </div>

      {/* Security/Warning Bar */}
      <div className="bg-primary/5 border-t border-primary/20 p-2 px-8 flex flex-wrap gap-4 items-center justify-center md:justify-start">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-3 h-3 text-primary" />
          <span className="text-[8px] font-black uppercase tracking-widest text-primary/80">Verified Source: Team Orion</span>
        </div>
        <div className="flex items-center gap-2">
          <Box className="w-3 h-3 text-muted-foreground" />
          <span className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground/60">SHA-256 CHECK: F42X-99P-ALFA</span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <Zap className="w-3 h-3 text-primary animate-pulse" />
          <span className="text-[8px] font-black uppercase tracking-[0.3em] text-primary/40">Encryption Active // 2048-Bit SSL</span>
        </div>
      </div>
    </div>
  );
}
