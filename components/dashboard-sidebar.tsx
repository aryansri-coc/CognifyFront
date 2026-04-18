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
  ShieldCheck,
  Zap
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
    label: 'Health Data',
    href: '/dashboard/health',
    icon: Activity,
  },
  {
    label: 'Cognition',
    href: '/dashboard/exercises',
    icon: Brain,
  },
  {
    label: 'Apothecary',
    href: '/dashboard/reminders',
    icon: Pill,
  },
  {
    label: 'Emergency',
    href: '/dashboard/emergency',
    icon: AlertCircle,
  },
  {
    label: 'Guardians',
    href: '/dashboard/caregivers',
    icon: Users,
  },
  {
    label: 'Analytics',
    href: '/dashboard/reports',
    icon: BarChart3,
  },
  {
    label: 'Neural Insights',
    href: '/dashboard/analytics',
    icon: Zap,
  },
];

export function DashboardSidebar({ open, onOpenChange }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-zinc-950/40 backdrop-blur-md z-40 lg:hidden"
          onClick={() => onOpenChange(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 w-72 bg-sidebar text-sidebar-foreground border-r-2 border-sidebar-border transition-all duration-300 lg:translate-x-0 flex flex-col',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="h-20 flex items-center justify-between px-8 border-b-2 border-sidebar-border bg-sidebar">
           <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 border-2 border-primary flex items-center justify-center bg-primary/10 overflow-hidden">
                <Image src="/logo.png" alt="Cognify Logo" width={40} height={40} className="w-full h-full object-cover" />
              </div>
            <h1 className="text-xl font-black tracking-tighter text-sidebar-foreground uppercase">Cognify</h1>
           </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="lg:hidden text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-none border border-sidebar-border"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto py-8 px-4 space-y-2">
          <div className="px-4 mb-4">
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-sidebar-foreground/30">Primary Systems</p>
          </div>
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
                    'w-full flex items-center gap-4 px-4 py-3 rounded-none transition-all text-xs font-black uppercase tracking-widest border-2 border-transparent',
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground border-sidebar-primary shadow-[0_0_15px_rgba(var(--primary),0.3)]'
                      : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:border-sidebar-border'
                  )}
                >
                  <Icon className={cn("w-5 h-5", isActive ? "text-sidebar-primary-foreground" : "text-sidebar-foreground/50")} />
                  <span>{item.label}</span>
                  {isActive && <div className="ml-auto w-1 h-4 bg-sidebar-primary-foreground shadow-sm" />}
                </button>
              </Link>
            );
          })}
        </div>

        <div className="mt-auto border-t-2 border-sidebar-border p-6 bg-sidebar">
           <div className="p-4 border-2 border-sidebar-border flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-green-500" />
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-sidebar-foreground/50">Security Status</p>
                 <p className="text-[10px] font-black uppercase text-green-500">Encrypted Path</p>
              </div>
           </div>
        </div>
      </aside>
    </>
  );
}
