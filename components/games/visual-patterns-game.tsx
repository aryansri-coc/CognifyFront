'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Check, X, Box, Square, Circle, Triangle, Diamond, Hexagon, Star } from 'lucide-react';

interface Round {
  options: string[]; // Icon names like 'Square', 'Circle'
  correctIndex: number;
}

interface VisualPatternsGameProps {
  data: {
    rounds?: Round[];
    levels?: Round[];
    items?: Round[];
    [key: string]: any;
  };
  onComplete: (score: number) => void;
}

const SHAPE_MAP: Record<string, any> = {
  Square: Square,
  Circle: Circle,
  Triangle: Triangle,
  Diamond: Diamond,
  Hexagon: Hexagon,
  Star: Star,
};

export function VisualPatternsGame({ data, onComplete }: VisualPatternsGameProps) {
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const rounds = Array.isArray(data) 
    ? data 
    : (data?.content?.rounds || data?.rounds || data?.content?.levels || data?.levels || data?.content?.items || data?.items || []);
  const currentR = rounds[currentRound];

  const handleSelect = (index: number) => {
    if (isAnswered) return;
    setSelected(index);
    setIsAnswered(true);

    const isCorrect = index === currentR.correctIndex;
    if (isCorrect) setScore(prev => prev + 1);

    setTimeout(() => {
      if (currentRound < rounds.length - 1) {
        setCurrentRound(prev => prev + 1);
        setSelected(null);
        setIsAnswered(false);
      } else {
        const finalScore = Math.round(((score + (isCorrect ? 1 : 0)) / rounds.length) * 100);
        onComplete(finalScore);
      }
    }, 1000);
  };

  if (!currentR) return null;

  const progress = ((currentRound + 1) / rounds.length) * 100;

  return (
    <div className="max-w-xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-black tracking-tight">Visual Memory</h2>
        <p className="text-muted-foreground">Identify the odd shape out of the group</p>
        <Progress value={progress} className="h-1.5 max-w-[200px] mx-auto" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {currentR.options.map((shapeName: string, index: number) => {
          const ShapeIcon = SHAPE_MAP[shapeName] || Box;
          const isCorrect = index === currentR.correctIndex;
          const isSelected = selected === index;

          return (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              disabled={isAnswered}
              className={cn(
                "aspect-square rounded-[2.5rem] flex items-center justify-center transition-all duration-500 hover:scale-105 active:scale-95 group relative",
                "bg-background border-2 border-border shadow-sm",
                isAnswered && isCorrect && "bg-emerald-50 border-emerald-500 dark:bg-emerald-950/20",
                isAnswered && isSelected && !isCorrect && "bg-red-50 border-red-500 dark:bg-red-950/20",
                !isAnswered && "hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5"
              )}
            >
              <ShapeIcon 
                className={cn(
                  "w-12 h-12 transition-all duration-500",
                  !isAnswered && "text-muted-foreground group-hover:text-primary group-hover:rotate-12",
                  isAnswered && isCorrect && "text-emerald-500 scale-110",
                  isAnswered && isSelected && !isCorrect && "text-red-500"
                )} 
              />
              
              {isAnswered && isCorrect && (
                <div className="absolute top-4 right-4 text-emerald-500">
                  <Check className="w-6 h-6 animate-in zoom-in" />
                </div>
              )}
              {isAnswered && isSelected && !isCorrect && (
                <div className="absolute top-4 right-4 text-red-500">
                  <X className="w-6 h-6 animate-in zoom-in" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="pt-12 text-center">
        <p className="text-sm font-bold text-muted-foreground tracking-widest uppercase">
          Round {currentRound + 1} of {rounds.length}
        </p>
      </div>
    </div>
  );
}
