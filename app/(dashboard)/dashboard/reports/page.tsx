'use client';

import { useState, useEffect } from 'react';
import { ApiClient } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Activity, Brain, Pill, AlertCircle } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { cn } from '@/lib/utils';

export default function ReportsPage() {
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [adherenceData, setAdherenceData] = useState<any[]>([
    { name: 'On Time', value: 100, color: '#10b981' },
    { name: 'Late', value: 0, color: '#f59e0b' },
    { name: 'Missed', value: 0, color: '#ef4444' },
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setIsLoading(true);
    const response = await ApiClient.getReports();
    if (response.success && response.data) {
      if (response.data.monthlyData) {
        setMonthlyData(response.data.monthlyData);
      }
      if (response.data.adherenceData) {
        setAdherenceData(response.data.adherenceData);
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-10 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase italic px-1">Analytics Engine</h1>
          <p className="text-muted-foreground mt-2 font-black uppercase tracking-widest text-[10px] bg-primary/10 px-2 py-0.5 inline-block">System Performance & Bio-Metric Trends</p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Real-time Sync Active
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Top Score Cubes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border-4 border-border rounded-xl overflow-hidden shadow-2xl bg-background">
            <div className="p-8 border-b sm:border-b-0 sm:border-r border-border hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">Neuro-Quant Score</span>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-5xl font-black tracking-tighter text-foreground">90<span className="text-xl text-muted-foreground">/100</span></div>
              <p className="text-[10px] font-bold text-green-600 uppercase mt-2">▲ 5.2% VS LAST PHASE</p>
            </div>

            <div className="p-8 border-b sm:border-b-0 lg:border-r border-border hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">Cognitive Index</span>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-5xl font-black tracking-tighter text-foreground">91<span className="text-xl text-muted-foreground">/100</span></div>
              <p className="text-[10px] font-bold text-green-600 uppercase mt-2">▲ 4.1% STABILITY GAIN</p>
            </div>

            <div className="p-8 border-b md:border-b-0 sm:border-r border-border hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">Adherence Rate</span>
                <div className="w-2 h-2 rounded-full bg-green-500" />
              </div>
              <div className="text-5xl font-black tracking-tighter text-foreground">100<span className="text-xl text-muted-foreground">%</span></div>
              <p className="text-[10px] font-bold text-green-600 uppercase mt-2">OPTIMAL COMPLIANCE</p>
            </div>

            <div className="p-8 hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">Sleep Efficiency</span>
                <TrendingDown className="w-4 h-4 text-orange-500" />
              </div>
              <div className="text-5xl font-black tracking-tighter text-foreground">7.8<span className="text-xl text-muted-foreground">H</span></div>
              <p className="text-[10px] font-bold text-orange-600 uppercase mt-2">▼ 0.2H DEFICIT DETECTED</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 rounded-none border-4 border-border shadow-xl overflow-hidden">
              <CardHeader className="bg-muted/30 border-b-2 border-border">
                <CardTitle className="font-black text-xl uppercase italic">Temporal Trend Analysis</CardTitle>
                <CardDescription className="font-bold text-[10px] uppercase tracking-widest">Multi-metric longitudinal progression</CardDescription>
              </CardHeader>
              <CardContent className="pt-8">
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="2 2" stroke="var(--color-border)" vertical={false} />
                    <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={10} fontWeight="bold" />
                    <YAxis stroke="var(--color-muted-foreground)" fontSize={10} fontWeight="bold" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--color-card)',
                        border: '2px solid var(--color-border)',
                        borderRadius: '0px',
                        fontWeight: '900',
                        fontSize: '10px'
                      }}
                    />
                    <Legend iconType="rect" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '20px' }} />
                    <Line type="stepAfter" dataKey="health" stroke="var(--color-chart-1)" strokeWidth={4} dot={false} name="HEALTH" />
                    <Line type="stepAfter" dataKey="cognitive" stroke="var(--color-chart-2)" strokeWidth={4} dot={false} name="COGNITIVE" />
                    <Line type="stepAfter" dataKey="adherence" stroke="var(--color-chart-3)" strokeWidth={4} dot={false} name="ADHERENCE" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="space-y-8">
               <Card className="rounded-none border-4 border-border shadow-xl overflow-hidden">
                <CardHeader className="bg-muted/30 border-b-2 border-border p-4 text-center">
                  <CardTitle className="font-black text-xs uppercase tracking-[0.2em]">Compliance Matrix</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={adherenceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {adherenceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-4 mt-2">
                    {adherenceData.map((entry) => (
                       <div key={entry.name} className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5" style={{ backgroundColor: entry.color }} />
                          <span className="text-[8px] font-black uppercase tracking-tighter">{entry.name}</span>
                       </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-none border-4 border-border shadow-xl overflow-hidden">
                <CardHeader className="bg-muted/30 border-b-2 border-border p-4">
                  <CardTitle className="font-black text-xs uppercase tracking-[0.2em]">Weekly Load</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {[
                    { label: 'STEPS', value: '85%', color: 'bg-primary' },
                    { label: 'BRAIN', value: '90%', color: 'bg-accent' },
                    { label: 'REST', value: '80%', color: 'bg-secondary' }
                  ].map((item) => (
                    <div key={item.label} className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-black tracking-widest">
                        <span>{item.label}</span>
                        <span>{item.value}</span>
                      </div>
                      <div className="h-1 bg-muted">
                        <div className={cn("h-full transition-all duration-500", item.color)} style={{ width: item.value }} />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="rounded-none border-4 border-border shadow-2xl overflow-hidden">
            <CardHeader className="bg-muted/30 border-b-2 border-border">
              <CardTitle className="font-black text-2xl uppercase italic">Milestone Log</CardTitle>
              <CardDescription className="font-bold text-[10px] uppercase tracking-widest text-primary">Cryptographically verified accomplishments</CardDescription>
            </CardHeader>
            <CardContent className="p-0 divide-y-2 divide-border">
              {[
                { title: '100% MED ADHERENCE', desc: 'Achieved 30-day perfect adherence streak', icon: <Activity className="w-5 h-5" />, color: 'bg-green-500' },
                { title: 'BRAIN GAME MASTER', desc: 'Completed 20 precision cognitive exercises', icon: <Brain className="w-5 h-5" />, color: 'bg-blue-500' },
                { title: 'SYSTEM OPTIMIZATION', desc: 'Improved overall health index by 12 points', icon: <TrendingUp className="w-5 h-5" />, color: 'bg-purple-500' }
              ].map((m) => (
                <div key={m.title} className="flex items-center gap-6 p-6 hover:bg-muted/20 transition-colors group">
                  <div className={cn("w-14 h-14 rounded-none flex items-center justify-center text-white shrink-0 shadow-lg group-hover:scale-110 transition-transform", m.color)}>
                    {m.icon}
                  </div>
                  <div>
                    <h4 className="font-black text-lg tracking-tight uppercase italic">{m.title}</h4>
                    <p className="text-xs font-bold text-muted-foreground uppercase">{m.desc}</p>
                  </div>
                  <div className="ml-auto opacity-10 font-black text-4xl italic uppercase">VERIFIED</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
