'use client';

import { useState, useEffect, useMemo } from 'react';
import { ApiClient } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Brain, 
  Clock, 
  AlertCircle, 
  Plus, 
  History,
  CheckCircle2,
  Calendar,
  Loader2
} from 'lucide-react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [activeReportId, setActiveReportId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async (selectLatest = true) => {
    setIsLoading(true);
    try {
      const response = await ApiClient.getReports();
      if (response.success && response.data?.reports) {
        const fetchedReports = response.data.reports;
        setReports(fetchedReports);
        if (selectLatest && fetchedReports.length > 0) {
          setActiveReportId(fetchedReports[0].id);
        }
      }
    } catch (error) {
      toast.error('Failed to load assessment data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async (type: 'weekly' | 'fortnightly') => {
    setIsGenerating(true);
    toast.info(`Initializing ${type} ML risk assessment...`);
    try {
      const response = await ApiClient.generateReport(type);
      if (response.success) {
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} report generated successfully`);
        await fetchReports(true);
      } else {
        toast.error(response.error || 'Generation failed');
      }
    } catch (error) {
      toast.error('System error during assessment');
    } finally {
      setIsGenerating(false);
    }
  };

  const activeReport = useMemo(() => {
    return reports.find(r => r.id === activeReportId) || null;
  }, [reports, activeReportId]);

  // Derived data for charts
  const monthlyData = useMemo(() => {
    return reports.slice().reverse().map(r => ({
      month: format(new Date(r.createdAt), 'MMM dd'),
      health: r.data?.stabilityScore || r.data?.healthScore || 0,
      cognitive: r.data?.cognitiveIndex || 0,
      adherence: r.data?.adherenceRate || 0,
    }));
  }, [reports]);

  const adherenceData = useMemo(() => {
    if (!activeReport?.data) return [];
    return [
      { name: 'On Time', value: activeReport.data.adherenceRate || 0, color: '#10b981' },
      { name: 'Missed', value: 100 - (activeReport.data.adherenceRate || 0), color: '#ef4444' },
    ];
  }, [activeReport]);

  const loadMetrics = useMemo(() => {
    if (!activeReport?.data) return [];
    return [
      { label: 'STEPS', value: `${activeReport.data.stepsScore || 0}%`, color: 'bg-primary' },
      { label: 'COGNITIVE', value: `${activeReport.data.cognitiveIndex || 0}%`, color: 'bg-accent' },
      { label: 'CARDIO', value: `${activeReport.data.cardioScore || 0}%`, color: 'bg-secondary' }
    ];
  }, [activeReport]);

  if (isLoading && reports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Hydrating Analytics Engine...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase italic px-1">Analytics Engine</h1>
          <p className="text-muted-foreground mt-2 font-black uppercase tracking-widest text-[10px] bg-primary/10 px-2 py-0.5 inline-block">System Performance & Bio-Metric Trends</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 mr-4 bg-muted/50 p-2 border-2 border-border shadow-inner">
            <History className="w-4 h-4 text-muted-foreground" />
            <select 
              value={activeReportId || ''} 
              onChange={(e) => setActiveReportId(e.target.value)}
              className="bg-transparent text-[10px] font-black uppercase tracking-widest border-none focus:ring-0 cursor-pointer"
            >
              {reports.map((r) => (
                <option key={r.id} value={r.id}>
                  {format(new Date(r.createdAt), 'MMM dd, yyyy')} ({r.type})
                </option>
              ))}
            </select>
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-none border-2 border-border font-black uppercase text-[10px] tracking-widest h-10 px-6 hover:bg-primary hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] active:translate-y-1 active:shadow-none"
            onClick={() => handleGenerate('weekly')}
            disabled={isGenerating}
          >
            {isGenerating ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : <Plus className="w-3 h-3 mr-2" />}
            Weekly
          </Button>
          <Button 
            size="sm" 
            className="rounded-none border-2 border-primary font-black uppercase text-[10px] tracking-widest h-10 px-6 shadow-[4px_4px_0px_0px_rgba(var(--primary),0.2)] active:translate-y-1 active:shadow-none bg-primary text-white"
            onClick={() => handleGenerate('fortnightly')}
            disabled={isGenerating}
          >
            {isGenerating ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : <Sparkles className="w-3 h-3 mr-2" />}
            Fortnightly
          </Button>
        </div>
      </div>

      {!activeReport ? (
        <Card className="rounded-none border-4 border-dashed border-border p-20 text-center bg-muted/10">
           <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
           <h2 className="text-xl font-black uppercase italic tracking-tight">No Assessment Data Found</h2>
           <p className="max-w-md mx-auto text-xs font-bold text-muted-foreground uppercase mt-2">Initialize your first ML risk assessment using the generation controls above to populate the clinical dashboard.</p>
        </Card>
      ) : (
        <div className="space-y-8 animate-in fade-in duration-700">
          {/* Top Score Cubes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border-4 border-border rounded-none overflow-hidden shadow-2xl bg-background">
            <div className="p-8 border-b sm:border-b-0 sm:border-r border-border hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">Neuro-Quant Score</span>
                <Activity className="w-4 h-4 text-primary" />
              </div>
              <div className="text-5xl font-black tracking-tighter text-foreground">
                {activeReport.data?.stabilityScore || activeReport.data?.healthScore || 0}
                <span className="text-xl text-muted-foreground">/100</span>
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase mt-2 italic">Current Assessment Stability</p>
            </div>

            <div className="p-8 border-b sm:border-b-0 lg:border-r border-border hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">Cognitive Index</span>
                <Brain className="w-4 h-4 text-primary" />
              </div>
              <div className="text-5xl font-black tracking-tighter text-foreground">
                {activeReport.data?.cognitiveIndex || 0}
                <span className="text-xl text-muted-foreground">/100</span>
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase mt-2 italic">Precision Logic Performance</p>
            </div>

            <div className="p-8 border-b md:border-b-0 sm:border-r border-border hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">Adherence Rate</span>
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-5xl font-black tracking-tighter text-foreground">
                {activeReport.data?.adherenceRate || 0}
                <span className="text-xl text-muted-foreground">%</span>
              </div>
              <p className="text-[10px] font-bold text-green-600 uppercase mt-2 italic">Clinical Follow-through</p>
            </div>

            <div className="p-8 hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">Sleep Efficiency</span>
                <Clock className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-5xl font-black tracking-tighter text-foreground">
                {activeReport.data?.sleepEfficiency || 0}
                <span className="text-xl text-muted-foreground">%</span>
              </div>
              <p className="text-[10px] font-bold text-indigo-600 uppercase mt-2 italic">Restorative Quality</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 rounded-none border-4 border-border shadow-xl overflow-hidden">
              <CardHeader className="bg-muted/30 border-b-2 border-border">
                <CardTitle className="font-black text-xl uppercase italic">Temporal Trend Analysis</CardTitle>
                <CardDescription className="font-bold text-[10px] uppercase tracking-widest italic">{reports.length} assessment snapshots captured</CardDescription>
              </CardHeader>
              <CardContent className="pt-8">
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="0" stroke="var(--color-border)" vertical={false} strokeOpacity={0.2} />
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
                      <Line type="monotone" dataKey="health" stroke="var(--color-chart-1)" strokeWidth={4} dot={false} name="HEALTH" />
                      <Line type="monotone" dataKey="cognitive" stroke="var(--color-chart-2)" strokeWidth={4} dot={false} name="COGNITIVE" />
                      <Line type="monotone" dataKey="adherence" stroke="var(--color-chart-3)" strokeWidth={4} dot={false} name="ADHERENCE" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-8">
               <Card className="rounded-none border-4 border-border shadow-xl overflow-hidden">
                <CardHeader className="bg-muted/30 border-b-2 border-border p-4 text-center">
                  <CardTitle className="font-black text-xs uppercase tracking-[0.2em]">Compliance Matrix</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={adherenceData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={0}
                          dataKey="value"
                        >
                          {adherenceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
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
                  <CardTitle className="font-black text-xs uppercase tracking-[0.2em]">Domain Indices</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {loadMetrics.map((item) => (
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
              <CardTitle className="font-black text-2xl uppercase italic">Historical Assessment Log</CardTitle>
              <CardDescription className="font-bold text-[10px] uppercase tracking-widest text-primary">Chronological assessment snapshots</CardDescription>
            </CardHeader>
            <CardContent className="p-0 divide-y-2 divide-border">
              {reports.slice(0, 5).map((r) => (
                <div 
                  key={r.id} 
                  className={cn(
                    "flex items-center gap-6 p-6 hover:bg-muted/20 transition-colors group cursor-pointer",
                    activeReportId === r.id && "bg-primary/5"
                  )}
                  onClick={() => setActiveReportId(r.id)}
                >
                  <div className={cn(
                    "w-14 h-14 rounded-none flex items-center justify-center text-white shrink-0 shadow-lg group-hover:scale-110 transition-transform",
                    r.type === 'weekly' ? "bg-primary" : "bg-accent"
                  )}>
                    {r.type === 'weekly' ? <Calendar className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-black text-lg tracking-tight uppercase italic line-clamp-1">{r.type} Assessment</h4>
                    <p className="text-xs font-bold text-muted-foreground uppercase">{format(new Date(r.createdAt), 'PPPP')}</p>
                  </div>
                  <div className="ml-auto opacity-10 font-black text-4xl italic uppercase hidden md:block">{r.status}</div>
                  <div className="text-right">
                    <p className="text-xl font-black">{r.data?.stabilityScore || r.data?.healthScore || 0}%</p>
                    <p className="text-[8px] font-bold text-muted-foreground uppercase">Stability</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

const Sparkles = ({ className, ...props }: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4" />
    <path d="M19 17v4" />
    <path d="M3 5h4" />
    <path d="M17 19h4" />
  </svg>
);
