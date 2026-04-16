'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Brain, Sparkles, AlertCircle } from 'lucide-react';

interface SequenceGameProps {
  data: {
    sequence?: number[];
    pattern?: number[];
    items?: number[];
    gridSize?: number;
    size?: number;
    [key: string]: any;
  };
  onComplete: (score: number) => void;
}

export function SequenceGame({ data, onComplete }: SequenceGameProps) {
  const gridSize = data?.content?.gridSize || data?.gridSize || data?.content?.size || data?.size || 3;
  const fullSequence = data?.content?.sequence || data?.sequence || data?.content?.pattern || data?.pattern || data?.content?.items || data?.items || [0, 1, 2];
  
  const [gameState, setGameState] = useState<'idle' | 'showing' | 'playing' | 'failed' | 'success'>('idle');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [activeTile, setActiveTile] = useState<number | null>(null);

  const playSequence = useCallback(async (level: number) => {
    setGameState('showing');
    setUserSequence([]);
    const sequenceToPlay = fullSequence.slice(0, level);

    for (let i = 0; i < sequenceToPlay.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setActiveTile(sequenceToPlay[i]);
      await new Promise(resolve => setTimeout(resolve, 600));
      setActiveTile(null);
    }

    setGameState('playing');
  }, [fullSequence]);

  const handleTileClick = (index: number) => {
    if (gameState !== 'playing') return;

    setActiveTile(index);
    setTimeout(() => setActiveTile(null), 200);

    const newUserSequence = [...userSequence, index];
    const currentIndex = userSequence.length;

    if (index !== fullSequence[currentIndex]) {
      setGameState('failed');
      setTimeout(() => {
        const finalScore = Math.round(((currentLevel - 1) / fullSequence.length) * 100);
        onComplete(finalScore);
      }, 1500);
      return;
    }

    setUserSequence(newUserSequence);

    if (newUserSequence.length === currentLevel) {
      if (currentLevel === fullSequence.length) {
        setGameState('success');
        setTimeout(() => onComplete(100), 1500);
      } else {
        setTimeout(() => {
          setCurrentLevel(prev => prev + 1);
          playSequence(currentLevel + 1);
        }, 1000);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Memory Level</p>
          <p className="text-3xl font-black">{currentLevel} <span className="text-lg font-normal text-muted-foreground">/ {fullSequence.length}</span></p>
        </div>
        <Badge variant={gameState === 'showing' ? 'default' : 'secondary'} className="px-4 py-1.5 rounded-full animate-pulse transition-all">
          {gameState === 'idle' && 'Ready?'}
          {gameState === 'showing' && 'Watch Closely'}
          {gameState === 'playing' && 'Your Turn'}
          {gameState === 'failed' && 'Incorrect'}
          {gameState === 'success' && 'Perfect!'}
        </Badge>
      </div>

      <div 
        className="grid gap-4" 
        style={{ 
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` 
        }}
      >
        {Array.from({ length: gridSize * gridSize }).map((_, i) => (
          <button
            key={i}
            onClick={() => handleTileClick(i)}
            disabled={gameState !== 'playing'}
            className={cn(
              "aspect-square rounded-2xl transition-all duration-300 transform active:scale-95 shadow-lg relative overflow-hidden",
              "border-2",
              activeTile === i 
                ? "bg-primary border-primary scale-105 shadow-[0_0_30px_rgba(var(--primary),0.5)] z-20" 
                : "bg-background border-border hover:border-primary/30",
              gameState === 'failed' && activeTile === i && "bg-destructive border-destructive shadow-destructive/50"
            )}
          >
            {activeTile === i && (
              <div className="absolute inset-0 bg-white/20 animate-ping" />
            )}
          </button>
        ))}
      </div>

      {gameState === 'idle' && (
        <Button 
          size="lg" 
          className="w-full h-16 text-xl font-bold rounded-2xl shadow-xl shadow-primary/20 group"
          onClick={() => playSequence(1)}
        >
          Start Game
          <Sparkles className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
        </Button>
      )}

      {gameState === 'failed' && (
        <div className="flex items-center gap-2 justify-center text-destructive animate-bounce">
          <AlertCircle className="w-5 h-5" />
          <p className="font-bold">Sequence Missed!</p>
        </div>
      )}
    </div>
  );
}
