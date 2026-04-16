'use client';

import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HealthSummary } from '@/components/health-summary';
import { QuickActions } from '@/components/quick-actions';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {user?.name.split(' ')[0]}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Here&apos;s your health overview for today
        </p>
      </div>

      <HealthSummary />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <QuickActions />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Tips</CardTitle>
            <CardDescription>Daily wellness advice</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm">
              <p className="font-medium text-foreground mb-1">💧 Stay Hydrated</p>
              <p className="text-muted-foreground">Drink at least 8 glasses of water daily</p>
            </div>
            <div className="text-sm">
              <p className="font-medium text-foreground mb-1">🧘 Daily Exercise</p>
              <p className="text-muted-foreground">Aim for 30 minutes of moderate activity</p>
            </div>
            <div className="text-sm">
              <p className="font-medium text-foreground mb-1">😴 Sleep Well</p>
              <p className="text-muted-foreground">Get 7-9 hours of quality sleep</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
