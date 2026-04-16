'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Check, X, RotateCcw } from 'lucide-react';

interface WordItem {
  word: string;
  category: string;
}

interface WordGameProps {
  data: {
    words?: WordItem[];
    wordList?: WordItem[];
    items?: WordItem[];
    categories?: string[];
    categoryList?: string[];
    options?: string[];
    [key: string]: any;
  };
  onComplete: (score: number) => void;
}

export function WordGame({ data, onComplete }: WordGameProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [selections, setSelections] = useState<Record<number, string>>({});
  const [shake, setShake] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  const words = data?.content?.words || data?.words || data?.content?.wordList || data?.wordList || data?.content?.items || data?.items || [];
  const categories = data?.content?.categories || data?.categories || data?.content?.categoryList || data?.categoryList || data?.content?.options || data?.options || [];
  const currentWord = words[currentWordIndex];

  const handleCategorySelect = (category: string) => {
    if (isFinishing) return;

    const isCorrect = category === currentWord.category;
    
    setSelections({
      ...selections,
      [currentWordIndex]: category
    });

    if (!isCorrect) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }

    if (currentWordIndex < words.length - 1) {
      setTimeout(() => {
        setCurrentWordIndex((prev) => prev + 1);
      }, 300);
    } else {
      setIsFinishing(true);
      setTimeout(() => {
        const correctCount = words.filter((w, i) => selections[i] === w.category || (i === currentWordIndex && category === w.category)).length;
        const finalScore = Math.round((correctCount / words.length) * 100);
        onComplete(finalScore);
      }, 1000);
    }
  };

  if (!currentWord && !isFinishing) return null;

  return (
    <div className="max-w-xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <Badge variant="secondary" className="px-4 py-1 rounded-full text-sm font-medium">
          Category Match
        </Badge>
        <p className="text-muted-foreground">Classify the word below into the correct category</p>
        {currentWord?.hint && (
          <p className="text-sm font-medium text-primary bg-primary/10 inline-block px-3 py-1 rounded-lg">
            Hint: {currentWord.hint}
          </p>
        )}
      </div>

      <div className={cn(
        "relative flex justify-center perspective-1000",
        shake && "animate-[shake_0.5s_ease-in-out]"
      )}>
        <Card className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-background to-muted/50 border-none shadow-2xl backdrop-blur-sm overflow-hidden group">
          <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
          <h2 className="text-5xl md:text-6xl font-black tracking-tighter z-10 animate-in zoom-in duration-300">
            {currentWord?.scrambled || currentWord?.word || "Done!"}
          </h2>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant="outline"
            size="lg"
            onClick={() => handleCategorySelect(cat)}
            disabled={isFinishing}
            className="h-20 text-xl font-bold rounded-2xl border-2 hover:border-primary hover:bg-primary/5 transition-all duration-300 shadow-sm"
          >
            {cat}
          </Button>
        ))}
      </div>

      <div className="flex justify-center gap-2">
        {words.map((_, index) => (
          <div
            key={index}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all duration-500",
              index === currentWordIndex ? "w-8 bg-primary" : index < currentWordIndex ? "bg-primary/40" : "bg-muted"
            )}
          />
        ))}
      </div>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-10px); }
          40%, 80% { transform: translateX(10px); }
        }
      `}</style>
    </div>
  );
}
