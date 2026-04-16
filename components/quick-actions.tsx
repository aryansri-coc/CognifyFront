'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Activity,
  Brain,
  Pill,
  AlertCircle,
} from 'lucide-react';

interface Action {
  icon: React.ReactNode;
  label: string;
  href: string;
  description: string;
}

export function QuickActions() {
  const actions: Action[] = [
    {
      icon: <Activity className="w-5 h-5" />,
      label: 'Log Health Data',
      href: '/dashboard/health',
      description: 'Track your vital signs',
    },
    {
      icon: <Brain className="w-5 h-5" />,
      label: 'Brain Game',
      href: '/dashboard/exercises',
      description: 'Play a cognitive exercise',
    },
    {
      icon: <Pill className="w-5 h-5" />,
      label: 'Take Medicine',
      href: '/dashboard/reminders',
      description: 'Record medicine intake',
    },
    {
      icon: <AlertCircle className="w-5 h-5" />,
      label: 'Emergency',
      href: '/dashboard/emergency',
      description: 'View emergency contacts',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {actions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Button
                variant="outline"
                className="w-full h-auto justify-start p-4 hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <div className="flex items-start gap-3 text-left">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary mt-0.5">
                    {action.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{action.label}</p>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
