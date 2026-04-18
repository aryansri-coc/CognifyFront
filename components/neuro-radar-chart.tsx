'use client';

import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const data = [
  { subject: 'Focus', A: 120, B: 110, fullMark: 150 },
  { subject: 'Logic', A: 98, B: 130, fullMark: 150 },
  { subject: 'Memory', A: 86, B: 130, fullMark: 150 },
  { subject: 'Reaction', A: 99, B: 100, fullMark: 150 },
  { subject: 'Coordination', A: 85, B: 90, fullMark: 150 },
];

export function NeuroRadarChart() {
  return (
    <Card className="border-2 border-primary/20 bg-background/50 backdrop-blur-md rounded-none overflow-hidden h-full">
      <CardHeader className="bg-muted/30 border-b border-border">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-black uppercase tracking-tighter leading-none">Cognitive Balance</CardTitle>
            <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">Multi-Facet Performance Analysis</p>
          </div>
          <div className="text-right">
             <span className="text-[8px] font-black text-primary uppercase tracking-widest border border-primary/30 px-2 py-0.5">V7-INSIGHT</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 relative">
        {/* Radar Backdrop Decors */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
           <div className="w-full h-full bg-[radial-gradient(circle,rgba(68,187,255,1)_0%,transparent_70%)]" />
        </div>
        
        <ResponsiveContainer width="100%" height={350}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="var(--primary)" strokeOpacity={0.1} />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: 'var(--foreground)', fontSize: 10, fontWeight: 'bold' }} 
            />
            <PolarRadiusAxis 
              angle={30} 
              domain={[0, 150]} 
              tick={false} 
              axisLine={false} 
            />
            <Radar
              name="Previous Phase"
              dataKey="B"
              stroke="var(--primary)"
              fill="var(--primary)"
              fillOpacity={0.2}
              strokeWidth={2}
            />
            <Radar
              name="Current Active"
              dataKey="A"
              stroke="#ef4444"
              fill="#ef4444"
              fillOpacity={0.4}
              strokeWidth={2}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(0,0,0,0.8)', 
                border: '1px solid var(--primary)',
                color: '#fff',
                fontSize: '10px',
                fontWeight: 'bold',
                textTransform: 'uppercase'
              }}
            />
          </RadarChart>
        </ResponsiveContainer>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 border-l-2 border-primary pl-3 py-1">
             <div>
               <p className="text-[8px] font-black text-muted-foreground uppercase">Neural Plasticity</p>
               <p className="text-sm font-black text-foreground">+12.4%</p>
             </div>
          </div>
          <div className="flex items-center gap-2 border-l-2 border-red-500 pl-3 py-1">
             <div>
               <p className="text-[8px] font-black text-muted-foreground uppercase">Stability Index</p>
               <p className="text-sm font-black text-foreground">98.2%</p>
             </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
