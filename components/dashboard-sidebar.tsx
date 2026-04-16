'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Home,
  Activity,
  Brain,
  Pill,
  AlertCircle,
  Users,
  BarChart3,
  X,
  Command
} from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface DashboardSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const navItems = [
  {
    label: 'Overview',
    href: '/dashboard',
    icon: Home,
  },
  {
    label: 'Health',
    href: '/dashboard/health',
    icon: Activity,
  },
  {
    label: 'Exercises',
    href: '/dashboard/exercises',
    icon: Brain,
  },
  {
    label: 'Reminders',
    href: '/dashboard/reminders',
    icon: Pill,
  },
  {
    label: 'Emergency',
    href: '/dashboard/emergency',
    icon: AlertCircle,
  },
  {
    label: 'Caregivers',
    href: '/dashboard/caregivers',
    icon: Users,
  },
  {
    label: 'Reports',
    href: '/dashboard/reports',
    icon: BarChart3,
  },
];

export function DashboardSidebar({ open, onOpenChange }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-zinc-950/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => onOpenChange(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 w-64 bg-background border-r border-border transition-transform duration-300 lg:translate-x-0 lg:w-64 flex flex-col',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-border">
           <Link href="/dashboard" className="flex items-center gap-2">
              <Image src="/logo.png" alt="Cognify Logo" width={32} height={32} className="rounded-md" />
              <h1 className="text-lg font-bold tracking-tight text-foreground">Cognify</h1>
           </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="lg:hidden text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === '/dashboard' 
              ? pathname === '/dashboard' 
              : pathname.startsWith(item.href);

            return (
              <Link key={item.href} href={item.href}>
                <button
                  onClick={() => onOpenChange(false)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium',
                    isActive
                      ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50'
                      : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-50'
                  )}
                >
                  <Icon className={cn("w-4 h-4", isActive ? "text-zinc-900 dark:text-zinc-50" : "text-zinc-400 dark:text-zinc-500")} />
                  <span>{item.label}</span>
                </button>
              </Link>
            );
          })}
        </div>
      </aside>
    </>
  );
}
