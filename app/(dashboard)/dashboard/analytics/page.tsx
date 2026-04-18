'use client';

import React from 'react';
import { useAuth } from '@/contexts/auth-context';
import { NeuroRadarChart } from '@/components/neuro-radar-chart';
import { MedicalMap } from '@/components/medical-map';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Activity, Brain, Target, Zap } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const historicalData = [
  { name: 'Month 1', score: 65 },
  { name: 'Month 2', score: 72 },
  { name: 'Month 3', score: 68 },
  { name: 'Month 4', score: 85 },
  { name: 'Month 5', score: 82 },
  { name: 'Month 6', score: 94 },
];

export default function AnalyticsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-10 pb-10">
      {/* Header Section */}
      <div className="px-1 flex justify-between items-end mb-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase leading-none flex items-center gap-4">
            <TrendingUp className="w-10 h-10 text-primary" />
            Biometric Insights
          </h1>
          <p className="text-muted-foreground mt-3 font-black uppercase tracking-widest text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Long-Term Cognitive Data Analysis // {user?.name || 'Operator'}
          </p>
        </div>
        <div className="hidden md:flex items-center gap-6 opacity-40">
           <div className="text-right">
             <p className="text-[8px] font-black uppercase text-muted-foreground">Session ID</p>
             <p className="text-[10px] font-bold text-foreground">XRN-992-ALPHA</p>
           </div>
           <div className="w-[2px] h-10 bg-border" />
           <div className="text-right">
             <p className="text-[8px] font-black uppercase text-muted-foreground">Encryption</p>
             <p className="text-[10px] font-bold text-primary">AES-256-GCM</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Radar Chart and Stats */}
        <div className="lg:col-span-1 space-y-8">
          <NeuroRadarChart />
          
          <Card className="border-2 border-border bg-background/50 rounded-none overflow-hidden">
            <div className="bg-muted/30 p-4 border-b border-border">
              <h3 className="font-black text-[10px] uppercase tracking-widest text-foreground">Performance Metrics</h3>
            </div>
            <CardContent className="p-6 space-y-6">
              {[
                { label: 'Neural Speed', val: '124 ms', icon: <Zap className="w-3 h-3 text-yellow-500" /> },
                { label: 'Focus Period', val: '42 min', icon: <Target className="w-3 h-3 text-primary" /> },
                { label: 'Logic Coherence', val: '92.4%', icon: <Brain className="w-3 h-3 text-indigo-500" /> },
                { label: 'Physical Response', val: '0.8s', icon: <Activity className="w-3 h-3 text-red-500" /> },
              ].map((stat, i) => (
                <div key={i} className="flex justify-between items-center group cursor-default">
                  <div className="flex items-center gap-3">
                    {stat.icon}
                    <span className="text-[9px] font-black uppercase text-muted-foreground group-hover:text-foreground transition-colors">{stat.label}</span>
                  </div>
                  <span className="text-sm font-black text-foreground tabular-nums">{stat.val}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Historical Growth Chart */}
        <div className="lg:col-span-2">
          <Card className="border-4 border-border rounded-none bg-background shadow-xl h-full flex flex-col">
            <CardHeader className="bg-muted/20 border-b-2 border-border flex flex-row items-center justify-between py-6">
              <div>
                <CardTitle className="text-xl font-black uppercase tracking-tighter leading-none">Historical Growth Tracking</CardTitle>
                <p className="text-[10px] font-bold text-muted-foreground uppercase mt-2">6-Month Neurological Progression</p>
              </div>
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-primary rounded-none" />
                <span className="text-[8px] font-black uppercase text-muted-foreground">Cognitive Index</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1 pt-8">
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={historicalData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="name" 
                    hide 
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.2)" 
                    style={{ fontSize: '10px', fontWeight: 'bold' }}
                    tickFormatter={(val) => `${val}%`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000', border: '1px solid var(--primary)', borderRadius: '0' }}
                    labelStyle={{ display: 'none' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="var(--primary)" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorScore)" 
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
              
              <div className="mt-8 grid grid-cols-3 gap-8">
                <div className="space-y-1">
                  <p className="text-[8px] font-black text-muted-foreground uppercase opacity-40">Global Average</p>
                  <p className="text-xl font-black text-foreground">72.4</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[8px] font-black text-primary uppercase">Personal Peak</p>
                  <p className="text-xl font-black text-primary">94.0</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[8px] font-black text-muted-foreground uppercase opacity-40">Consistency</p>
                  <p className="text-xl font-black text-foreground">88%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Map Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-[2px] flex-1 bg-border" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Tactical Medical Map</h3>
          <div className="h-[2px] flex-1 bg-border" />
        </div>
        <MedicalMap />
      </div>

      {/* Footer Meta */}
      <div className="flex justify-between items-center opacity-20 py-4">
        <p className="text-[8px] font-black uppercase tracking-widest">Biometric Archive v4.2.0 // Orion Protocol</p>
        <div className="flex gap-2">
           {[...Array(20)].map((_, i) => (
             <div key={i} className="w-1 h-3 bg-foreground" style={{ opacity: Math.random() }} />
           ))}
        </div>
      </div>
    </div>
  );
}
