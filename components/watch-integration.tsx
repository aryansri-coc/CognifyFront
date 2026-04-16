'use client';

import { useState, useMemo } from 'react';
import { Smartphone, ShieldCheck, Watch, Zap, Search, CheckCircle, AlertTriangle, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

const steps = [
  {
    icon: Smartphone,
    title: 'ACQUIRE APP',
    desc: 'Download the Cognify Mobile Bridge to initiate telemetry.',
    color: 'border-primary text-primary bg-primary/10'
  },
  {
    icon: ShieldCheck,
    title: 'PERMIT CORE',
    desc: 'Authorize Google Fit API and biometric stream permissions.',
    color: 'border-accent text-accent bg-accent/10'
  },
  {
    icon: Watch,
    title: 'SYNC HARDWARE',
    desc: 'Pair your smartwatch via the Google Fit enabled portal.',
    color: 'border-secondary text-secondary bg-secondary/10'
  },
  {
    icon: Zap,
    title: 'CALIBRATE',
    desc: 'System active. Google Fit cloud synchronization initiated.',
    color: 'border-indigo-500 text-indigo-500 bg-indigo-500/10'
  }
];

const COMPATIBLE_MODELS = [
  // ─── Google Pixel Watch (Native Wear OS) ───
  'Google Pixel Watch',
  'Google Pixel Watch 2',
  'Google Pixel Watch 3 (41mm)',
  'Google Pixel Watch 3 (45mm)',
  'Google Pixel Watch 4 (41mm)',
  'Google Pixel Watch 4 (45mm)',

  // ─── Samsung Galaxy Watch (Wear OS, Gen 4+) ───
  'Samsung Galaxy Watch 4',
  'Samsung Galaxy Watch 4 Classic',
  'Samsung Galaxy Watch 5',
  'Samsung Galaxy Watch 5 Pro',
  'Samsung Galaxy Watch 6',
  'Samsung Galaxy Watch 6 Classic',
  'Samsung Galaxy Watch 7',
  'Samsung Galaxy Watch Ultra',
  'Samsung Galaxy Watch FE',

  // ─── Fossil (Wear OS) ───
  'Fossil Gen 5 Carlyle HR',
  'Fossil Gen 5 Julianna HR',
  'Fossil Gen 5E',
  'Fossil Gen 6',
  'Fossil Gen 6 Wellness Edition',

  // ─── TicWatch / Mobvoi (Wear OS) ───
  'TicWatch Pro 3',
  'TicWatch Pro 3 Ultra GPS',
  'TicWatch E3',
  'TicWatch Pro 5',
  'TicWatch Pro 5 Enduro',
  'TicWatch Atlas',
  'TicWatch GTH Pro',

  // ─── OnePlus (Wear OS) ───
  'OnePlus Watch 2',
  'OnePlus Watch 2R',

  // ─── Xiaomi (via Mi Fitness app) ───
  'Xiaomi Watch 2',
  'Xiaomi Watch S3',
  'Xiaomi Mi Band 7',
  'Xiaomi Mi Band 8',
  'Xiaomi Smart Band 9',
  'Xiaomi Redmi Watch 4',
  'Xiaomi Redmi Watch 5',

  // ─── Realme (via Realme Link app) ───
  'Realme Watch S',
  'Realme Watch S Pro',
  'Realme Watch 3',
  'Realme Watch 3 Pro',
  'Realme TechLife Watch S100',
  'Realme TechLife Watch R100',

  // ─── Amazfit / Zepp (via Zepp app) ───
  'Amazfit GTR 4',
  'Amazfit GTR Mini',
  'Amazfit GTR 3 Pro',
  'Amazfit GTS 4',
  'Amazfit GTS 4 Mini',
  'Amazfit Band 7',
  'Amazfit Balance',
  'Amazfit Active',
  'Amazfit Active 2',
  'Amazfit Active Max',
  'Amazfit T-Rex 3',
  'Amazfit T-Rex Ultra',
  'Amazfit T-Rex Ultra 2',
  'Amazfit Cheetah Pro',
  'Amazfit Falcon',

  // ─── boAt (via boAt smartwatch app) ───
  'boAt Wave Flex Connect',
  'boAt Lunar Connect Pro',
  'boAt Storm Call 2',
  'boAt Enigma X700',

  // ─── Noise (via NoiseFit app) ───
  'Noise ColorFit Pro 5',
  'Noise ColorFit Pro 5 Max',
  'Noise ColorFit Ultra 3',
  'Noise ColorFit Icon Ultra',
  'Noise Twist Round',

  // ─── Fitbit (via Google account) ───
  'Fitbit Charge 6',
  'Fitbit Sense 2',
  'Fitbit Versa 4',
  'Fitbit Inspire 3',
  'Fitbit Luxe',

  // ─── Polar (via Polar Flow app) ───
  'Polar Vantage M3',
  'Polar Vantage V3',
  'Polar Pacer Pro',
  'Polar Ignite 3',
  'Polar Grit X2 Pro',

  // ─── Garmin (via HealthSync / third-party) ───
  'Garmin Venu 3',
  'Garmin Venu 4',
  'Garmin Forerunner 265',
  'Garmin Forerunner 965',
  'Garmin Instinct 3',

  // ─── Withings (via Health Mate app) ───
  'Withings ScanWatch',
  'Withings ScanWatch 2',
  'Withings ScanWatch Nova',
  'Withings Move ECG',

  // ─── Huawei (older Wear OS / Health Sync) ───
  'Huawei Watch 2',
  'Huawei Watch 2 Classic',

  // ─── Skagen (Wear OS) ───
  'Skagen Falster Gen 6',

  // ─── Suunto (via Suunto app) ───
  'Suunto 7',
  'Suunto Race',
  'Suunto Race S',

  // ─── Wahoo (via Wahoo Fitness app) ───
  'Wahoo TICKR X',
  'Wahoo TICKR Fit',

  // ─── Michael Kors (Wear OS) ───
  'Michael Kors Gen 6 Bradshaw',
  'Michael Kors Access Runway',

  // ─── Casio (Wear OS) ───
  'Casio WSD-F20',
  'Casio WSD-F30',
];

export function WatchIntegration() {
  const [searchQuery, setSearchQuery] = useState('');

  const searchResult = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const found = COMPATIBLE_MODELS.some(model =>
      model.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return {
      found,
      query: searchQuery
    };
  }, [searchQuery]);

  return (
    <div className="border-4 border-border rounded-none shadow-2xl bg-background overflow-hidden mt-8">
      <div className="bg-muted/30 p-8 border-b-2 border-border flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="font-black text-2xl uppercase italic tracking-tighter">Integration Journey</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-1 underline decoration-primary decoration-2">Google Fit API Protocol</p>
        </div>

        <div className="relative w-full md:w-72 group">
          <Input
            placeholder="CHECK COMPATIBILITY..."
            className="rounded-none border-2 border-border font-black text-[10px] uppercase tracking-widest pl-10 h-10 bg-background focus-visible:ring-0 focus-visible:border-primary transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />

          {searchResult && (
            <div className={cn(
              "absolute top-full left-0 w-full mt-2 p-3 border-2 z-50 animate-in fade-in slide-in-from-top-1",
              searchResult.found ? "bg-green-500/10 border-green-500 text-green-600" : "bg-red-500/10 border-red-500 text-red-600"
            )}>
              <div className="flex items-center gap-2">
                {searchResult.found ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                <span className="text-[9px] font-black uppercase tracking-widest">
                  {searchResult.found ? 'DEVICE VERIFIED: GOOGLE FIT OK' : 'INCOMPATIBLE OR NOT FOUND'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-10 relative">
        <div className="absolute top-[50%] left-0 w-full h-1 border-b-4 border-dashed border-border -translate-y-1/2 z-0 hidden lg:block" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
          {steps.map((step, index) => (
            <div key={step.title} className="flex flex-col items-center text-center group">
              <div className={cn(
                "w-20 h-20 border-4 rounded-none flex items-center justify-center transition-all duration-300 shadow-lg group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(var(--primary),0.3)]",
                step.color,
                "bg-background z-20"
              )}>
                <step.icon className="w-10 h-10" />
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-border text-[10px] flex items-center justify-center font-black">
                  0{index + 1}
                </div>
              </div>

              <div className="mt-6 space-y-2 max-w-[200px]">
                <h3 className="font-black text-xs uppercase tracking-[0.1em]">{step.title}</h3>
                <p className="text-[10px] font-bold text-muted-foreground leading-relaxed uppercase opacity-80 group-hover:opacity-100 transition-opacity">
                  {step.desc}
                </p>
              </div>

              {index < steps.length - 1 && (
                <div className="lg:hidden w-1 h-12 border-l-4 border-dashed border-border mt-6" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-muted border-t-2 border-border p-4 flex flex-wrap justify-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-primary" />
          <span className="text-[8px] font-black uppercase text-muted-foreground tracking-[0.1em]">Google Pixel Watch Series</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-accent" />
          <span className="text-[8px] font-black uppercase text-muted-foreground tracking-[0.1em]">Samsung Galaxy Watch (4+)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-secondary" />
          <span className="text-[8px] font-black uppercase text-muted-foreground tracking-[0.1em]">Fossil / TicWatch / WearOS</span>
        </div>
        <div className="flex items-center gap-2">
          <Cpu className="w-3 h-3 text-muted-foreground/50" />
          <span className="text-[8px] font-black uppercase text-muted-foreground tracking-[0.1em]">Requires Google Fit API</span>
        </div>
      </div>
    </div>
  );
}
