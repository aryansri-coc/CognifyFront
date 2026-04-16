'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface HealthData {
  date: string;
  heartRate: number;
  bloodPressureSys: number;
  bloodPressureDia: number;
  glucose: number;
  weight: number;
  steps: number;
  sleepHours: number;
}

interface HealthChartProps {
  data: HealthData[];
  metric: keyof HealthData;
  title: string;
  unit: string;
  hideTitle?: boolean;
}

export function HealthChart({ data, metric, title, unit, hideTitle }: HealthChartProps) {
  const getMetricColor = (metric: keyof HealthData) => {
    switch (metric) {
      case 'heartRate':
        return '#ef4444'; // red
      case 'weight':
        return '#8b5cf6'; // purple
      case 'steps':
        return '#06b6d4'; // cyan
      case 'sleepHours':
        return '#3b82f6'; // blue
      case 'glucose':
        return '#f59e0b'; // amber
      case 'bloodPressureSys':
        return '#ec4899'; // pink
      case 'bloodPressureDia':
        return '#14b8a6'; // teal
      default:
        return '#06b6d4';
    }
  };

  const chartData = data.map(d => ({
    name: d.date,
    value: d[metric] as number,
  }));

  return (
    <Card>
      {!hideTitle && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className={!hideTitle ? '' : 'pt-6'}>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="name"
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '0.875rem' }}
            />
            <YAxis
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '0.875rem' }}
              label={{ value: unit, angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-card)',
                border: `1px solid var(--color-border)`,
                borderRadius: '0.5rem',
              }}
              labelStyle={{ color: 'var(--color-foreground)' }}
              formatter={(value) => [value, unit]}
            />
            {!hideTitle && <Legend />}
            <Line
              type="monotone"
              dataKey="value"
              stroke={getMetricColor(metric)}
              strokeWidth={2}
              dot={{ fill: getMetricColor(metric), r: 4 }}
              activeDot={{ r: 6 }}
              name={title}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
