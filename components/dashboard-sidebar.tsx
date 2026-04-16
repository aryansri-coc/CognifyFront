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
          'fixed lg:static inset-y-0 left-0 z-50 w-72 bg-zinc-950 text-zinc-400 border-r-2 border-zinc-900 transition-all duration-300 lg:translate-x-0 flex flex-col',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="h-20 flex items-center justify-between px-8 border-b-2 border-zinc-900 bg-zinc-950">
           <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 border-2 border-primary flex items-center justify-center bg-primary/10">
                <Zap className="w-6 h-6 text-primary fill-primary" />
              </div>
              <h1 className="text-xl font-black tracking-tighter text-zinc-50 uppercase italic">Cognify</h1>
           </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="lg:hidden text-zinc-400 hover:text-zinc-50 hover:bg-zinc-900 rounded-none border border-zinc-800"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto py-8 px-4 space-y-2">
          <div className="px-4 mb-4">
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">Primary Systems</p>
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
                      ? 'bg-primary text-zinc-950 border-primary shadow-[0_0_15px_rgba(var(--primary),0.3)]'
                      : 'hover:bg-zinc-900 hover:text-zinc-50 hover:border-zinc-800'
                  )}
                >
                  <Icon className={cn("w-5 h-5", isActive ? "text-zinc-950" : "text-zinc-500")} />
                  <span>{item.label}</span>
                  {isActive && <div className="ml-auto w-1 h-4 bg-zinc-950 shadow-sm" />}
                </button>
              </Link>
            );
          })}
        </div>

        <div className="mt-auto border-t-2 border-zinc-900 p-6 bg-zinc-950">
           <div className="p-4 border-2 border-zinc-900 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-green-500" />
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Security Status</p>
                 <p className="text-[10px] font-black uppercase text-green-500">Encrypted Path</p>
              </div>
           </div>
        </div>
      </aside>
    </>
  );
}
