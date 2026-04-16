'use client';

import { useState, useEffect } from 'react';
import { Heart, Moon, Footprints, Thermometer, ShieldAlert, Zap } from 'lucide-react';
import { ApiClient } from '@/lib/api';
import { cn } from '@/lib/utils';

interface HealthMetric {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  status: 'good' | 'fair' | 'poor';
}

export function HealthSummary() {
  const [metrics, setMetrics] = useState<HealthMetric[]>([
    {
      icon: <Heart className="w-5 h-5" />,
      label: 'Cardiac Rhythm',
      value: '--',
      unit: 'BPM',
      status: 'good',
    },
    {
      icon: <Moon className="w-5 h-5" />,
      label: 'Delta Recovery',
      value: '--',
      unit: 'HRS',
      status: 'good',
    },
    {
      icon: <Footprints className="w-5 h-5" />,
      label: 'Kinetic Output',
      value: '--',
      unit: 'STEPS',
      status: 'fair',
    },
    {
      icon: <Thermometer className="w-5 h-5" />,
      label: 'Thermal Status',
      value: '--',
      unit: '°F',
      status: 'good',
    },
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHealthData();
  }, []);

  const fetchHealthData = async () => {
    setIsLoading(true);
    const response = await ApiClient.getLatestHealth();
    if (response.success && response.data) {
      const latest = response.data;
      
      const heartRate = latest.heartRateAvg ?? latest.heartRate ?? 0;
      const sleepHours = latest.sleepTotalHours ?? latest.sleepHours ?? 0;
      const steps = latest.steps ?? latest.stepsCount ?? 0;

      setMetrics([
        {
          icon: <Heart className="w-5 h-5" />,
          label: 'Cardiac Rhythm',
          value: heartRate.toString(),
          unit: 'BPM',
          status: (heartRate > 60 && heartRate < 100) ? 'good' : 'fair',
        },
        {
          icon: <Moon className="w-5 h-5" />,
          label: 'Delta Recovery',
          value: sleepHours.toString(),
          unit: 'HRS',
          status: sleepHours >= 7 ? 'good' : (sleepHours >= 5 ? 'fair' : 'poor'),
        },
        {
          icon: <Footprints className="w-5 h-5" />,
          label: 'Kinetic Output',
          value: steps.toLocaleString(),
          unit: 'STEPS',
          status: steps >= 8000 ? 'good' : (steps >= 4000 ? 'fair' : 'poor'),
        },
        {
          icon: <Thermometer className="w-5 h-5" />,
          label: 'Thermal Status',
          value: '98.6',
          unit: '°F',
          status: 'good',
        },
      ]);
    }
    setIsLoading(false);
  };

  const getStatusTextColor = (status: 'good' | 'fair' | 'poor') => {
    switch (status) {
      case 'good':
        return 'text-green-500';
      case 'fair':
        return 'text-yellow-500';
      case 'poor':
        return 'text-red-500';
    }
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 border-4 border-border rounded-none overflow-hidden shadow-2xl bg-background">
      {metrics.map((metric, index) => (
        <div 
          key={metric.label} 
          className={cn(
            "relative group flex flex-col p-8 transition-all duration-300 cursor-pointer hover:bg-muted/30",
            index < metrics.length - 1 && "border-r-2 border-border",
            index < 2 && "lg:border-b-0 border-b-2 md:border-b-2 lg:border-r-2 border-border",
            "last:border-r-0"
          )}
          onClick={() => console.log(`Inquiring ${metric.label}`)}
        >
          {/* Status Accent Line */}
          <div className={cn(
            "absolute top-0 left-0 w-full h-1.5 transition-all duration-500",
            metric.status === 'good' ? "bg-green-500" : (metric.status === 'fair' ? "bg-yellow-500" : "bg-red-500")
          )} />

          <div className="flex flex-col gap-6">
             <div className="flex items-center justify-between">
                <div className={cn(
                  "w-10 h-10 border-2 flex items-center justify-center transition-all group-hover:bg-foreground group-hover:text-background",
                  metric.status === 'good' ? "border-green-500/30 text-green-500" : 
                  (metric.status === 'fair' ? "border-yellow-500/30 text-yellow-500" : "border-red-500/30 text-red-500")
                )}>
                  {metric.icon}
                </div>
                {metric.status === 'poor' && (
                  <ShieldAlert className="w-4 h-4 text-red-500 animate-bounce" />
                )}
             </div>
             
             <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">
                  {metric.label}
                </p>
                <div className="flex items-baseline gap-2">
                  {isLoading ? (
                    <div className="w-16 h-8 bg-muted animate-pulse"></div>
                  ) : (
                    <span className="text-4xl font-black tracking-tighter text-foreground italic">
                      {metric.value}
                    </span>
                  )}
                  {!isLoading && (
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                      {metric.unit}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 pt-2">
                   <div className={cn("w-2 h-2 rounded-full", metric.status === 'good' ? "bg-green-500" : (metric.status === 'fair' ? "bg-yellow-500" : "bg-red-500"))} />
                   <span className={cn("text-[9px] font-black uppercase tracking-widest", getStatusTextColor(metric.status))}>
                      {metric.status} Status
                   </span>
                </div>
             </div>
          </div>

          {/* Grid Background Accent */}
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />
          
          {/* Decorative Corner */}
          <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-transparent group-hover:border-primary transition-all" />
        </div>
      ))}
    </div>
  );
}
