'use client';

import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Menu, LogOut, User, Settings, Bell, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardHeaderProps {
  onMenuClick: () => void;
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b-2 border-border bg-background/95 px-8 backdrop-blur shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden flex h-10 w-10 items-center justify-center rounded-none border-2 border-border bg-background hover:bg-muted text-muted-foreground transition-all"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden lg:flex items-center gap-3">
          <div className="w-6 h-6 overflow-hidden">
            <Image src="/logo.png" alt="Cognify Logo" width={24} height={24} className="w-full h-full object-cover grayscale brightness-200" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Neuro-Sync Online</span>
        </div>
      </div>

      <div className="flex items-center gap-4 h-full">
        <button className="hidden sm:flex h-10 w-10 items-center justify-center rounded-none border-2 border-border hover:bg-muted text-muted-foreground transition-all">
           <Bell className="h-5 w-5" />
        </button>

        <div className="h-10 w-[2px] bg-border mx-2 hidden sm:block" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-12 gap-4 px-4 hover:bg-muted rounded-none border-2 border-transparent hover:border-border transition-all group">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">Authenticated</span>
                <span className="text-sm font-black uppercase tracking-tight text-foreground">{user?.name || 'Authorized User'}</span>
              </div>
              <div className="h-8 w-8 rounded-none border-2 border-foreground bg-foreground flex items-center justify-center text-background group-hover:scale-110 transition-transform">
                <span className="text-xs font-black">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 rounded-none border-2 border-border p-0 shadow-2xl">
            <div className="bg-muted/50 p-4 border-b-2 border-border">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">User Identifier</p>
                <p className="text-sm font-black uppercase text-foreground truncate">{user?.name || 'User'}</p>
                <p className="text-[9px] font-bold text-muted-foreground truncate">{user?.email || 'user@example.com'}</p>
            </div>
            
            <div className="p-1">
              <DropdownMenuItem 
                onClick={() => router.push('/dashboard/profile')}
                className="gap-3 cursor-pointer rounded-none font-bold uppercase text-[10px] tracking-widest py-3"
              >
                <User className="h-4 w-4 text-primary" />
                <span>Access Profile</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={() => router.push('/dashboard/settings')}
                className="gap-3 cursor-pointer rounded-none font-bold uppercase text-[10px] tracking-widest py-3"
              >
                <Settings className="h-4 w-4 text-primary" />
                <span>System Config</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator className="bg-border h-[2px] my-1" />
              
              <DropdownMenuItem 
                onClick={handleLogout} 
                className="gap-3 cursor-pointer rounded-none font-black uppercase text-[10px] tracking-widest py-3 text-destructive focus:bg-destructive focus:text-white"
              >
                <LogOut className="h-4 w-4" />
                <span>Terminate Session</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
