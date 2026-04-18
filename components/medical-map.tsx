'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Clock, ExternalLink, Globe } from 'lucide-react';

const facilities = [
  {
    name: "Coming Soon"
  },

];

export function MedicalMap() {
  return (
    <Card className="border-4 border-border rounded-none shadow-2xl bg-background overflow-hidden h-full">
      <CardHeader className="bg-muted/30 border-b-2 border-border flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-black uppercase tracking-tighter leading-none">Nearby Medical Facilities</CardTitle>
          <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">Tactical Logistics Interface</p>
        </div>
        <div className="flex gap-2">
          <MapPin className="w-5 h-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="p-0 flex flex-col lg:flex-row h-[500px]">
        {/* Map View */}
        <div className="flex-1 bg-muted relative overflow-hidden group">
          {/* Stylized Map Iframe Embed (Defaulting to a tech-styled map) */}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3402.551515!2d77.594562!3d12.971598!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1z!2z!5e0!3m2!1sen!2sin!4v123456789"
            className="w-full h-full border-0 dark:brightness-[0.6] dark:contrast-[1.2] dark:grayscale hover:grayscale-0 transition-all duration-700"
            allowFullScreen
            loading="lazy"
          ></iframe>

          {/* Reticle Overlay */}
          <div className="absolute inset-0 pointer-events-none border border-primary/20 flex items-center justify-center">
            <div className="w-12 h-12 border border-primary/40 animate-[spin_10s_linear_infinite]" />
            <div className="absolute top-4 right-4 bg-black/80 p-2 border border-primary/30 text-[8px] font-black text-primary uppercase tracking-widest">
              Tracking Signal: Locked
            </div>
          </div>
        </div>

        {/* Facilities List */}
        <div className="w-full lg:w-80 bg-background border-l-2 border-border flex flex-col overflow-y-auto divide-y divide-border">
          {facilities.map((fac, idx) => (
            <div key={idx} className="p-6 hover:bg-muted/30 transition-all cursor-pointer group">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-black text-sm text-foreground group-hover:text-primary transition-colors leading-tight uppercase font-normal">{fac.name}</h4>
                <span className="text-[8px] border border-border px-1 font-bold text-muted-foreground bg-muted/50 whitespace-nowrap">{fac.dist}</span>
              </div>
              <p className="text-[9px] font-black text-primary/60 uppercase tracking-widest mb-4">{fac.type}</p>

              <div className="space-y-2">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span className="text-[9px] font-bold uppercase">{fac.open}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Phone className="w-3 h-3" />
                  <span className="text-[9px] font-bold uppercase">{fac.phone}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border/50 flex gap-2">
                <button className="flex-1 py-2 bg-primary/10 hover:bg-primary/20 text-[8px] font-black uppercase text-primary tracking-widest transition-all">
                  Navigate
                </button>
                <button className="p-2 border border-border hover:bg-muted">
                  <ExternalLink className="w-3 h-3 text-muted-foreground" />
                </button>
              </div>
            </div>
          ))}

          <div className="p-6 mt-auto bg-muted/20">
            <div className="flex items-center gap-3 text-primary/40">
              <Globe className="w-4 h-4 animate-pulse" />
              <p className="text-[8px] font-black uppercase tracking-[0.2em]">Global Network Verified</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
