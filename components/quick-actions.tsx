import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Brain, Pill, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    <Card className="overflow-hidden border-2 rounded-xl shadow-sm">
      <CardHeader className="bg-muted/30 border-b">
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
          {actions.map((action, index) => (
            <Link 
              key={action.href} 
              href={action.href}
              className={cn(
                "group relative p-6 transition-all duration-300 hover:bg-muted/50 flex flex-col items-start gap-3",
                index % 2 === 0 && "sm:border-r border-border",
                index < 2 && "border-b border-border",
                index >= 2 && "sm:border-b-0 border-b last:border-b-0 border-border"
              )}
            >
              {/* Decorative accent bar on hover */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full text-primary transition-transform group-hover:scale-110">
                  {action.icon}
                </div>
                <div>
                  <p className="font-bold text-sm tracking-tight group-hover:text-primary transition-colors">{action.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{action.description}</p>
                </div>
              </div>

              {/* Box Corner Decor */}
              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-10 opacity-30 transition-opacity">
                <AlertCircle className="w-12 h-12 text-primary -mr-4 -mb-4 rotate-12" />
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
