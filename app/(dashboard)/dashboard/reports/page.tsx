'use client';

import { useState, useEffect } from 'react';
import { ApiClient } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Activity, Brain, Pill, AlertCircle } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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
    } else {
      console.log('Failed to fetch reports:', response.error);
    }
    setIsLoading(false);
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Health Reports & Analytics</h1>
        <p className="text-muted-foreground mt-2">Track your progress and health trends</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Health Score</span>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-3xl font-bold">90/100</div>
              <p className="text-xs text-green-600 dark:text-green-400">+5 from last month</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Cognitive Score</span>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-3xl font-bold">91/100</div>
              <p className="text-xs text-green-600 dark:text-green-400">+4 from last month</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Med Adherence</span>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-3xl font-bold">100%</div>
              <p className="text-xs text-green-600 dark:text-green-400">Perfect this month</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Avg Sleep</span>
                <TrendingDown className="w-4 h-4 text-orange-500" />
              </div>
              <div className="text-3xl font-bold">7.8h</div>
              <p className="text-xs text-orange-600 dark:text-orange-400">-0.2h from last month</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Scores Trend</CardTitle>
          <CardDescription>Your health, cognitive, and medication adherence scores over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="health"
                stroke="var(--color-chart-1)"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Health Score"
              />
              <Line
                type="monotone"
                dataKey="cognitive"
                stroke="var(--color-chart-2)"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Cognitive Score"
              />
              <Line
                type="monotone"
                dataKey="adherence"
                stroke="var(--color-chart-3)"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Med Adherence %"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Medicine Adherence</CardTitle>
            <CardDescription>Your medication compliance this month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={adherenceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {adherenceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity Summary</CardTitle>
            <CardDescription>Your activity levels this week</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Steps</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: '85%' }} />
                </div>
                <span className="text-sm font-semibold">61k/70k</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Exercise</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-accent" style={{ width: '90%' }} />
                </div>
                <span className="text-sm font-semibold">4.5/5h</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Sleep</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-secondary" style={{ width: '80%' }} />
                </div>
                <span className="text-sm font-semibold">54h/56h</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Milestones</CardTitle>
          <CardDescription>Achievements and progress highlights</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
              <Activity className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="font-medium text-sm">100% Medication Adherence</p>
              <p className="text-xs text-muted-foreground">Achieved 30-day perfect adherence streak</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
              <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="font-medium text-sm">Brain Game Master</p>
              <p className="text-xs text-muted-foreground">Completed 20 cognitive exercises</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="font-medium text-sm">Health Score Increase</p>
              <p className="text-xs text-muted-foreground">Improved overall health score by 12 points</p>
            </div>
          </div>
        </CardContent>
      </Card>
        </>
      )}
    </div>
  );
}
