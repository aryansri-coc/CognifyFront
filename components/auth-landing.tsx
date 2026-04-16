'use client';

import { Activity, Brain, Clock, Shield, Zap, Sparkles, TrendingUp, Cpu, Server, Database, Search, Bell, Smartphone } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface AuthLandingProps {
  children?: React.ReactNode;
}

export function AuthLanding({ children }: AuthLandingProps) {
  return (
    <div className="w-full bg-slate-950 text-slate-300 relative">
      
      {/* Hero Section */}
      <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-b-2 border-slate-900 px-8 py-20 lg:py-32">
        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        
        <div className="container max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24 relative z-10">
          
          <div className="flex-1 space-y-10 animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="flex items-center gap-3">
               <div className="w-12 h-12 border-2 border-primary/40 flex items-center justify-center bg-primary/10">
                 <Zap className="w-6 h-6 text-primary fill-primary" />
               </div>
               <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Continuous Intelligence</span>
            </div>
            
            <div className="space-y-6">
              <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tighter leading-[0.9] uppercase">
                Beyond the <br /> Snapshot.
              </h1>
              <p className="text-xl text-slate-400 max-w-xl leading-relaxed font-medium">
                Traditional healthcare relies on periodic measurements. Cognify captures the invisible shifts in cognitive health through non-stop biometric stream analysis.
              </p>
            </div>

            <div className="flex flex-wrap gap-6 pt-4">
               <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Live AI Monitoring</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Wearable Integration</span>
               </div>
            </div>
          </div>

          <div className="w-full max-w-[440px] animate-in fade-in slide-in-from-right-8 duration-1000">
            {children}
          </div>

        </div>
      </div>

      <div className="container max-w-7xl mx-auto py-32 px-8 space-y-48">
        
        {/* Section 2: Visual 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-[4/3] w-full border-2 border-slate-900 group overflow-hidden">
             <Image 
               src="/biometric_stream_minimal.png" 
               alt="Biometric Data Stream" 
               layout="fill" 
               objectFit="cover" 
               className="opacity-80 group-hover:scale-105 transition-transform duration-1000"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
             <div className="absolute bottom-6 left-6 right-6 p-6 border-l-2 border-primary bg-slate-950/60 backdrop-blur-md">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Observation Layer</p>
                <p className="text-sm font-bold text-white uppercase tracking-tight">30-Day Fingerprint Calibration</p>
             </div>
          </div>
          <div className="space-y-8">
            <h2 className="text-4xl font-bold text-white uppercase tracking-tight">The 30-Day <br/> Calibration</h2>
            <p className="text-lg text-slate-400 leading-relaxed font-medium">
              We monitor your unique physiological signature for 30 consecutive days to establish a demographic-specific baseline. 
              Cognify doesn't compare you to a static population—it compares your specification to your unique demographic peers.
            </p>
          </div>
        </div>

        {/* Section 3: The Work Case */}
        <div className="space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
             <h2 className="text-4xl font-bold text-white uppercase tracking-tight">Clinical Tracking Case</h2>
             <p className="text-slate-400 font-medium">
                Using Smartwatches (Google Fit integration) to track HRV, Gait, Sleep, and steps, we identifies abnormal trends over years—not just hours.
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-2 border-slate-900 bg-slate-900/10">
             <div className="p-10 border-b md:border-b-0 md:border-r border-slate-900 hover:bg-primary/5 transition-all duration-300">
                <Clock className="w-8 h-8 text-primary mb-6" />
                <h3 className="font-bold text-white uppercase text-sm tracking-widest mb-4">5-Year Trend Analysis</h3>
                <p className="text-xs uppercase font-medium text-slate-500 leading-relaxed">Detecting abnormal shifts over half-decades. We focus on the gradual decrease in cognition that periodic measurements fail to capture.</p>
             </div>
             <div className="p-10 hover:bg-accent/5 transition-all duration-300">
                <TrendingUp className="w-8 h-8 text-accent mb-6" />
                <h3 className="font-bold text-white uppercase text-sm tracking-widest mb-4">Dynamic Demographic Baselines</h3>
                <p className="text-xs uppercase font-medium text-slate-500 leading-relaxed">Peer-specific matching based on BMI, activity levels, and sleep cycles. Dynamic in nature, avoiding static population thresholds.</p>
             </div>
          </div>
        </div>

        {/* Section 4: Visual 2 + Stack */}
        <div className="space-y-24">
           <div className="relative aspect-[21/9] w-full border-2 border-slate-900 group overflow-hidden">
             <Image 
               src="/health_trends_minimal.png" 
               alt="Health Trends Visualization" 
               layout="fill" 
               objectFit="cover" 
               className="opacity-70 group-hover:scale-105 transition-transform duration-1000"
             />
             <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/40 to-transparent" />
           </div>

           <div className="space-y-12">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h2 className="text-4xl font-bold text-white uppercase tracking-tight">System Architecture</h2>
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Multistage Risk Assessment Pipeline</p>
                </div>
                <div className="text-right">
                   <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">Cognify Engine v1.0.4</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-0 border-2 border-slate-900 rounded-none overflow-hidden bg-slate-900/10">
                {[
                  { title: 'Data Acquisition', icon: Smartphone, desc: 'Google Fit API Sync' },
                  { title: 'Storage Layer', icon: Database, desc: 'PostgreSQL x Prisma' },
                  { title: 'Preprocessing', icon: Cpu, desc: 'Daily Aggregation' },
                  { title: 'Drift Engine', icon: Search, desc: 'Temporal Drift' },
                  { title: 'Anomaly Core', icon: Activity, desc: 'Z-Score Analysis' },
                  { title: 'Risk Engine', icon: Brain, desc: 'ML Risk Score' },
                  { title: 'Alert Logic', icon: Bell, desc: 'Multi-Stage Verification' },
                  { title: 'Backend Link', icon: Server, desc: 'Secure Node.js Bridge' },
                  { title: 'ML Master', icon: Sparkles, desc: 'Python Analytics Core' },
                  { title: 'Prediction Unit', icon: Zap, desc: 'Domain Specific Risks' },
                ].map((module, i) => (
                  <div key={i} className="p-8 border-r border-b border-slate-900 hover:bg-primary/10 transition-all group cursor-default">
                    <module.icon className="w-6 h-6 text-slate-600 group-hover:text-primary transition-colors mb-4" />
                    <h4 className="text-[10px] font-bold text-white uppercase tracking-widest mb-1">{module.title}</h4>
                    <p className="text-[8px] font-medium text-slate-600 uppercase leading-tight">{module.desc}</p>
                  </div>
                ))}
              </div>
           </div>
        </div>

        {/* Section 6: Domains */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {[
            { label: 'Neuro Domain', desc: 'Predicting cognitive decline via neurological indicators and behavioral signals.' },
            { label: 'Cardio Domain', desc: 'Analyzing trends in heart rate variability and demographic heart health.' },
            { label: 'Frailty Domain', desc: 'Tracking physical activity patterns and advanced mobility decline indicators.' },
          ].map((domain, i) => (
            <div key={i} className="flex flex-col p-10 border-2 border-slate-900 group hover:border-primary/50 bg-slate-900/5 hover:bg-primary/5 transition-all">
              <Shield className="w-8 h-8 text-primary/40 group-hover:text-primary transition-colors mb-8" />
              <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-4">{domain.label}</h3>
              <p className="text-sm font-medium text-slate-500 leading-relaxed uppercase">{domain.desc}</p>
            </div>
          ))}
        </div>

        <div className="py-20 border-t border-slate-900 text-center opacity-40">
           <p className="text-[8px] font-bold uppercase tracking-[0.5em] text-slate-500">Cognify Clinical Intelligence • Registered Protocol 54-X • Multi-Stage Risk Assessment</p>
        </div>
      </div>
    </div>
  );
}
