'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Moon, Footprints, Thermometer } from 'lucide-react';
import { ApiClient } from '@/lib/api';

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
      icon: <Heart className="w-6 h-6" />,
      label: 'Heart Rate',
      value: '--',
      unit: 'bpm',
      status: 'good',
    },
    {
      icon: <Moon className="w-6 h-6" />,
      label: 'Sleep',
      value: '--',
      unit: 'hours',
      status: 'good',
    },
    {
      icon: <Footprints className="w-6 h-6" />,
      label: 'Steps',
      value: '--',
      unit: 'steps',
      status: 'fair',
    },
    {
      icon: <Thermometer className="w-6 h-6" />,
      label: 'Temperature',
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
      
      const heartRate = latest.heartRate ?? latest.heartRateAvg ?? 0;
      const sleepHours = latest.sleepHours ?? latest.sleepTotalHours ?? 0;
      const steps = latest.stepsCount ?? latest.steps ?? 0;

      setMetrics([
        {
          icon: <Heart className="w-6 h-6" />,
          label: 'Heart Rate',
          value: heartRate.toString(),
          unit: 'bpm',
          status: (heartRate > 60 && heartRate < 100) ? 'good' : 'fair',
        },
        {
          icon: <Moon className="w-6 h-6" />,
          label: 'Sleep',
          value: sleepHours.toString(),
          unit: 'hours',
          status: sleepHours >= 7 ? 'good' : (sleepHours >= 5 ? 'fair' : 'poor'),
        },
        {
          icon: <Footprints className="w-6 h-6" />,
          label: 'Steps',
          value: steps.toLocaleString(),
          unit: 'steps',
          status: steps >= 8000 ? 'good' : (steps >= 4000 ? 'fair' : 'poor'),
        },
        {
          icon: <Thermometer className="w-6 h-6" />,
          label: 'Temperature',
          value: '98.6',
          unit: '°F',
          status: 'good',
        },
      ]);
    }
    setIsLoading(false);
  };

  const getStatusColor = (status: 'good' | 'fair' | 'poor') => {
    switch (status) {
      case 'good':
        return 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800';
      case 'fair':
        return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800';
      case 'poor':
        return 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800';
    }
  };

  const getStatusTextColor = (status: 'good' | 'fair' | 'poor') => {
    switch (status) {
      case 'good':
        return 'text-green-700 dark:text-green-300';
      case 'fair':
        return 'text-yellow-700 dark:text-yellow-300';
      case 'poor':
        return 'text-red-700 dark:text-red-300';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <Card key={metric.label} className={`border-2 ${getStatusColor(metric.status)}`}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                <div className="flex items-baseline gap-1 mt-2">
                  {isLoading ? (
                    <div className="w-12 h-6 bg-muted animate-pulse rounded"></div>
                  ) : (
                    <span className="text-2xl font-bold text-foreground">{metric.value}</span>
                  )}
                  {isLoading ? (
                    <div className="w-8 h-4 bg-muted animate-pulse rounded ml-1"></div>
                  ) : (
                    <span className="text-sm text-muted-foreground">{metric.unit}</span>
                  )}
                </div>
              </div>
              <div className={`p-2 rounded-lg ${getStatusTextColor(metric.status)}`}>
                {metric.icon}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
