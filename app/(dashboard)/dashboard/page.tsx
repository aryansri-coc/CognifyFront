'use client';

import { useAuth } from '@/contexts/auth-context';
import { HealthSummary } from '@/components/health-summary';
import { QuickActions } from '@/components/quick-actions';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-10 pb-10">
      <div className="px-1">
        <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase italic leading-none">
          SYSTEM STATUS: ONLINE
        </h1>
        <p className="text-muted-foreground mt-3 font-black uppercase tracking-widest text-xs flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Welcome back, {user?.name?.split(' ')[0] || 'Operator'}
        </p>
      </div>

      <HealthSummary />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <QuickActions />
        </div>

        <div className="flex flex-col border-4 border-border rounded-none shadow-xl bg-background overflow-hidden h-fit">
          <div className="bg-muted/30 p-6 border-b-2 border-border">
            <h3 className="font-black text-xs uppercase tracking-[0.2em] text-foreground">Core Directives</h3>
            <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">Daily Wellness Protocol</p>
          </div>
          <div className="p-0 divide-y-2 divide-border">
            <div className="p-6 hover:bg-muted/30 transition-colors group">
              <p className="font-black text-sm tracking-tight text-foreground mb-1 group-hover:text-primary transition-colors italic">01. HYDRATION</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">Execute 2.5L liquid intake cycle daily.</p>
            </div>
            <div className="p-6 hover:bg-muted/30 transition-colors group">
              <p className="font-black text-sm tracking-tight text-foreground mb-1 group-hover:text-accent transition-colors italic">02. KINETICS</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">Initialize 30m aerobic calibration.</p>
            </div>
            <div className="p-6 hover:bg-muted/30 transition-colors group">
              <p className="font-black text-sm tracking-tight text-foreground mb-1 group-hover:text-secondary transition-colors italic">03. RECOVERY</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">Ensure 8H neurological rest phase.</p>
            </div>
          </div>
          <div className="bg-muted/10 p-4 text-center mt-auto border-t border-border">
             <span className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-[0.3em]">Cognify OS v1.0.4</span>
          </div>
        </div>
      </div>
    </div>
  );
}
