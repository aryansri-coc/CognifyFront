'use client';

import React, { useEffect, useRef, useMemo } from 'react';

interface Point3D {
  x: number;
  y: number;
  z: number;
  id: number;
  connections: number[];
  firing: number;
}

interface NeuralWave {
  sourceId: number;
  startTime: number;
  duration: number;
  maxRadius: number;
}

export function Brain3DAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const state = useRef({
    rotation: { x: 0.3, y: 0, vx: 0, vy: 0.0006 },
    isDragging: false,
    lastMouse: { x: 0, y: 0 },
    waves: [] as NeuralWave[],
    firingStates: new Float32Array(1100), 
  });

  const points = useMemo(() => {
    const pts: Point3D[] = [];
    const nodeCount = 950; // Increased density for complex structure

    for (let i = 0; i < nodeCount; i++) {
      // Logic split: 80% Hemispheres, 10% Cerebellum, 10% Brainstem/Cord
      const section = i / nodeCount;
      
      if (section < 0.8) {
        // --- CEREBRAL HEMISPHERES ---
        const hemisphere = section < 0.4 ? -1 : 1;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        const rx_base = 0.48;
        const ry_base = 0.40; // Squashed
        const rz_base = 0.85; // Elongated

        const wrinkle = 1 + 
          0.08 * Math.sin(theta * 14) * Math.cos(phi * 14) +
          0.04 * Math.sin(theta * 28) * Math.sin(phi * 20);

        let x = rx_base * Math.sin(phi) * Math.cos(theta) * wrinkle;
        let y = ry_base * Math.sin(phi) * Math.sin(theta) * wrinkle;
        let z = rz_base * Math.cos(phi) * wrinkle;

        // Tapering
        if (z > 0) {
          x *= (1 - z * 0.3);
          y *= (1 - z * 0.1);
        }
        
        // Temporal Lobe Curvature
        if (z > -0.1 && z < 0.4 && Math.abs(x) > 0.25) {
          y -= 0.12; 
          x *= 1.15;
        }

        const xOffset = hemisphere * 0.26;
        x += xOffset;
        
        if (hemisphere === -1 && x > -0.02) x = -0.02;
        if (hemisphere === 1 && x < 0.02) x = 0.02;

        pts.push({ x, y, z, id: pts.length, connections: [], firing: 0 });

      } else if (section < 0.9) {
        // --- CEREBELLUM ---
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        const r_base = 0.35;
        const x = r_base * Math.sin(phi) * Math.cos(theta) * 0.8;
        const y = (r_base * Math.sin(phi) * Math.sin(theta) * 0.5) - 0.45;
        const z = (r_base * Math.cos(phi) * 1.2) - 0.5;

        pts.push({ x, y, z, id: pts.length, connections: [], firing: 0 });

      } else {
        // --- BRAINSTEM + UPPER SPINAL CORD ---
        const h = Math.random(); // Height 0 to 1
        const theta = Math.random() * Math.PI * 2;
        const r = 0.12 * (1 - h * 0.4); // Tapered Cylinder
        
        const x = r * Math.cos(theta);
        const y = -0.4 - (h * 0.6); // Extends downwards
        const z = -0.2 - (h * 0.1); // Slightly angled back
        
        pts.push({ x, y, z, id: pts.length, connections: [], firing: 0 });
      }
    }

    // Connect nodes
    for (let i = 0; i < pts.length; i++) {
      const distances = [];
      for (let j = 0; j < pts.length; j++) {
        if (i === j) continue;
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const dz = pts[i].z - pts[j].z;
        const distSq = dx * dx + dy * dy + dz * dz;
        // Limit search radius for brainstem to keep it linear
        if (distSq < 0.4) {
          distances.push({ id: j, distSq });
        }
      }
      distances.sort((a, b) => a.distSq - b.distSq);
      // Connect to 5 closest neighbors
      for (let k = 0; k < Math.min(5, distances.length); k++) {
        pts[i].connections.push(distances[k].id);
      }
    }

    return pts;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    
    const resize = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    const spawnWave = () => {
      if (state.current.waves.length < 8) {
        state.current.waves.push({
          sourceId: Math.floor(Math.random() * points.length),
          startTime: Date.now(),
          duration: 3000 + Math.random() * 2000,
          maxRadius: 2.2,
        });
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      state.current.isDragging = true;
      state.current.lastMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!state.current.isDragging) return;
      const dx = e.clientX - state.current.lastMouse.x;
      const dy = e.clientY - state.current.lastMouse.y;
      state.current.rotation.vy += dx * 0.0002;
      state.current.rotation.vx += dy * 0.0002;
      state.current.lastMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      state.current.isDragging = false;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mousedown', onMouseDown);
    resize();

    const render = () => {
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      const centerX = w / 2;
      const centerY = h / 2 - 20; // Shift up slightly to center the cord
      const scale = Math.min(w, h) * 0.36;
      const now = Date.now();

      ctx.clearRect(0, 0, w, h);
      
      // Physics
      if (!state.current.isDragging) {
        state.current.rotation.vy *= 0.95;
        state.current.rotation.vx *= 0.95;
        state.current.rotation.vy += 0.0006; 
      }
      state.current.rotation.x += state.current.rotation.vx;
      state.current.rotation.y += state.current.rotation.vy;

      // Update Waves
      state.current.firingStates.fill(0);
      for (let i = state.current.waves.length - 1; i >= 0; i--) {
        const wave = state.current.waves[i];
        const progress = (now - wave.startTime) / wave.duration;
        if (progress >= 1) { state.current.waves.splice(i, 1); continue; }
        const rSq = Math.pow(progress * wave.maxRadius, 2);
        const source = points[wave.sourceId];
        points.forEach(p => {
          const dSq = Math.pow(p.x-source.x,2) + Math.pow(p.y-source.y,2) + Math.pow(p.z-source.z,2);
          const diff = Math.abs(dSq - rSq);
          if (diff < 0.05) state.current.firingStates[p.id] = Math.max(state.current.firingStates[p.id], (1-diff/0.05) * (1-progress));
        });
      }
      if (Math.random() > 0.96) spawnWave();

      // Project
      const projected = points.map(p => {
        let x = p.x * Math.cos(state.current.rotation.y) - p.z * Math.sin(state.current.rotation.y);
        let z = p.x * Math.sin(state.current.rotation.y) + p.z * Math.cos(state.current.rotation.y);
        let y = p.y;
        const ty = y * Math.cos(state.current.rotation.x) - z * Math.sin(state.current.rotation.x);
        const tz = y * Math.sin(state.current.rotation.x) + z * Math.cos(state.current.rotation.x);
        y = ty; z = tz;
        const perspect = 5 / (5 + z);
        return { sx: x * scale * perspect + centerX, sy: y * scale * perspect + centerY, sz: z, perspect, firing: state.current.firingStates[p.id] };
      });

      // Render
      ctx.lineWidth = 0.5;
      points.forEach((p, i) => {
        const p1 = projected[i];
        p.connections.forEach(cid => {
          if (cid < i) return;
          const p2 = projected[cid];
          const opacity = Math.max(0.04, 0.25 - (p1.sz + p2.sz) * 0.12);
          ctx.strokeStyle = `rgba(68, 187, 255, ${opacity})`;
          ctx.beginPath(); ctx.moveTo(p1.sx, p1.sy); ctx.lineTo(p2.sx, p2.sy); ctx.stroke();
          const f = (p1.firing + p2.firing)/2;
          if (f > 0.1) { ctx.strokeStyle = `rgba(255,255,255,${f*0.6})`; ctx.lineWidth = 1.2; ctx.stroke(); ctx.lineWidth = 0.5; }
        });
      });

      projected.forEach(p => {
        const s = p.perspect * (1.1 + p.firing * 2.5);
        if (p.firing > 0.1) { ctx.fillStyle = `rgba(255,255,255,${p.firing})`; ctx.shadowBlur = p.firing * 12; ctx.shadowColor = '#44bbff'; }
        else { ctx.fillStyle = `rgba(129, 140, 248, ${Math.max(0.2, 0.75 - p.sz * 0.4)})`; ctx.shadowBlur = 0; }
        ctx.beginPath(); ctx.arc(p.sx, p.sy, s, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('mousedown', onMouseDown);
      cancelAnimationFrame(animationId);
    };
  }, [points]);

  return (
    <div className="border-4 border-border rounded-none shadow-2xl bg-[#010208] overflow-hidden mt-10 relative group h-[600px] select-none cursor-grab active:cursor-grabbing">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(68,187,255,0.08)_0%,transparent_80%)] pointer-events-none" />
      
      <div className="absolute top-0 left-0 w-full p-8 flex justify-between items-start z-10 pointer-events-none text-white font-black">
        <div className="space-y-1">
          <h3 className="text-2xl uppercase tracking-tighter mix-blend-difference">Neural Integration Model</h3>
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary">Human Brain Model Demo</p>
        </div>
        <div className="flex flex-col items-end gap-1 opacity-40">
           <div className="flex gap-1">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-1.5 h-6 bg-primary/40 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        </div>
      </div>

      <div ref={containerRef} className="w-full h-full">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-end z-10 border-t border-white/5">
        <div className="space-y-2">
          <div className="flex gap-4">
             <div className="flex items-center gap-1.5">
               <div className="w-1 h-1 bg-primary" />
               <span className="text-[7px] font-black text-white/50 uppercase">Neural Stem Active</span>
             </div>
             <div className="flex items-center gap-1.5">
               <div className="w-1 h-1 bg-accent" />
               <span className="text-[7px] font-black text-white/50 uppercase">Synaptic Flow: Normal</span>
             </div>
          </div>
          <p className="text-[9px] font-black text-primary/60 uppercase tracking-widest">Cognify Medical Simulation // Brainstem_Integrated</p>
        </div>
        <div className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">
          v4.5-Advanced
        </div>
      </div>
    </div>
  );
}
