'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizGameProps {
  data: {
    questions?: Question[];
    items?: Question[];
    [key: string]: any;
  };
  onComplete: (score: number) => void;
}

export function QuizGame({ data, onComplete }: QuizGameProps) {
  const [phase, setPhase] = useState<'story' | 'playing'>(data.story ? 'story' : 'playing');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const questions = Array.isArray(data) 
    ? data 
    : (data?.content?.questions || data?.questions || data?.content?.items || data?.items || []);
  const currentQ = questions[currentQuestion];

  const handleOptionSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const correct = index === currentQ.correctAnswer;
    if (correct) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedOption(null);
        setIsAnswered(false);
      } else {
        const finalScore = Math.round(((score + (correct ? 1 : 0)) / questions.length) * 100);
        onComplete(finalScore);
      }
    }, 1500);
  };

  if (phase === 'story' && data.story) {
    return (
      <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Card className="border-none bg-background/50 backdrop-blur-xl shadow-2xl overflow-hidden">
          <CardContent className="p-8 md:p-12 space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-black tracking-tight">Recall the Story</h2>
              <p className="text-muted-foreground text-lg">Read the passage carefully. You will be asked questions about it next.</p>
            </div>
            
            <div className="bg-muted/30 p-8 rounded-3xl border border-muted-foreground/10 leading-relaxed text-xl font-medium">
              {data.story}
            </div>

            <Button 
              size="lg" 
              className="w-full h-16 text-xl font-bold rounded-2xl shadow-xl shadow-primary/20 group"
              onClick={() => setPhase('playing')}
            >
              I'm Ready, Start Quiz
              <CheckCircle2 className="ml-2 w-6 h-6 group-hover:scale-110 transition-transform" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentQ) return null;

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Question {currentQuestion + 1} of {questions.length}
          </p>
          <p className="text-2xl font-bold text-primary">{Math.round(progress)}%</p>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="border-none bg-background/50 backdrop-blur-xl shadow-2xl overflow-hidden">
        <CardContent className="p-8 md:p-12 space-y-10">
          <h2 className="text-2xl md:text-3xl font-bold text-center leading-tight">
            {currentQ.question}
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {currentQ.options.map((option: string, index: number) => {
              const isSelected = selectedOption === index;
              const isCorrect = index === currentQ.correctAnswer;
              
              let variant: 'outline' | 'default' = 'outline';
              let className = "h-auto py-5 px-6 text-lg justify-between transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]";

              if (isAnswered) {
                if (isCorrect) {
                  className += " border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-400 border-2";
                } else if (isSelected) {
                  className += " border-red-500 bg-red-50 text-red-900 dark:bg-red-950/30 dark:text-red-400 border-2";
                } else {
                  className += " opacity-50";
                }
              }

              return (
                <Button
                  key={index}
                  variant={variant}
                  className={cn(className)}
                  onClick={() => handleOptionSelect(index)}
                  disabled={isAnswered}
                >
                  <span className="text-left w-full">{option}</span>
                  {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500 shrink-0" />}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
