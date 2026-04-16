'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ApiClient } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Clock, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Exercise {
  id: string;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number;
  bestScore?: number;
  category: string;
}

export default function ExercisesPage() {
  const router = useRouter();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    setIsLoading(true);
    console.log('[v0] Fetching daily exercises...');
    try {
      const response = await ApiClient.getDailyExercises();
      console.log('[v0] API Response for exercises:', response);

      if (response.success && response.data) {
        const dataArray = Array.isArray(response.data)
          ? response.data
          : (response.data.exercises || response.data.data || response.data.list || []);

        const fetchedExercises = dataArray
          .map((e: any, idx: number) => {
            const type = e.type || '';
            let name = e.name || 'Mental Workout';
            let description = e.description || 'Challenge your cognitive abilities.';
            let category = e.category || 'Cognitive';

            if (type === 'WORD_GAME') {
              name = 'Word Scramble';
              description = 'Unscramble words and test your vocabulary recall.';
              category = 'Language';
            } else if (type === 'NUMBER_SEQUENCE') {
              name = 'Sequence Memory';
              description = 'Memorize and repeat numerical patterns to boost focus.';
              category = 'Memory';
            } else if (type === 'RECALL_QUIZ') {
              name = 'Recall Challenge';
              description = 'Test your short-term memory with dynamic quiz questions.';
              category = 'Recall';
            } else if (type === 'VISUAL_PATTERNS') {
              name = 'Pattern Recognition';
              description = 'Spot the odd one out in complex visual patterns.';
              category = 'Visual';
            }

            return {
              id: e.id || e._id || `exercise-${idx}-${Date.now()}`,
              name,
              description,
              difficulty: e.difficulty || 'medium',
              duration: e.duration || 5,
              bestScore: e.bestScore,
              category,
            };
          })
          .filter((exercise: any, index: number, self: any[]) =>
            index === self.findIndex((t) => t.id === exercise.id)
          );
        setExercises(fetchedExercises);
      }
    } catch (err) {
      console.error('[v0] Unexpected error in fetchExercises:', err);
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-foreground">Brain Gym</h1>
        <p className="text-muted-foreground mt-2 font-medium">Precision cognitive exercises designed for your progress.</p>
      </div>

      {/* Summary Metrics Cubes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-2 border-border rounded-xl overflow-hidden shadow-sm bg-background">
        <div className="flex flex-col items-center justify-center p-8 border-b md:border-b-0 md:border-r border-border hover:bg-muted/30 transition-colors">
          <Brain className="w-8 h-8 text-primary mb-3" />
          <div className="text-4xl font-black">{exercises.length}</div>
          <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">Available</div>
        </div>
        <div className="flex flex-col items-center justify-center p-8 border-b md:border-b-0 md:border-r border-border hover:bg-muted/30 transition-colors">
          <TrendingUp className="w-8 h-8 text-accent mb-3" />
          <div className="text-4xl font-black">89</div>
          <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">Avg Score</div>
        </div>
        <div className="flex flex-col items-center justify-center p-8 hover:bg-muted/30 transition-colors">
          <Clock className="w-8 h-8 text-secondary mb-3" />
          <div className="text-4xl font-black">48</div>
          <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">Mins Played</div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
      ) : exercises.length === 0 ? (
        <div className="p-12 border-2 border-dashed border-border rounded-xl text-center text-muted-foreground">
          No daily exercises found yet. Check back later!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-2 border-border rounded-xl overflow-hidden shadow-md">
          {exercises.map((exercise, index) => (
            <div 
              key={exercise.id}
              className={cn(
                "group relative p-8 transition-all duration-300 cursor-pointer hover:bg-muted/50",
                "border-b border-border",
                (index + 1) % 3 !== 0 && "lg:border-r border-border",
                (index + 1) % 2 !== 0 && "md:border-r border-border",
                "last:border-b-0"
              )}
              onClick={() => router.push(`/dashboard/exercises/${exercise.id}`)}
            >
              {/* Difficulty Accent */}
              <div className={cn(
                "absolute top-0 left-0 w-full h-1.5",
                exercise.difficulty === 'easy' ? "bg-green-500" : (exercise.difficulty === 'hard' ? "bg-red-500" : "bg-yellow-500")
              )} />

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="rounded-none border-primary/30 text-[10px] font-black uppercase tracking-widest">
                      {exercise.category}
                    </Badge>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {exercise.duration} MIN
                    </span>
                  </div>
                  <h3 className="text-xl font-black tracking-tight group-hover:text-primary transition-colors leading-tight">
                    {exercise.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 font-medium">
                    {exercise.description}
                  </p>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-border/50">
                   {exercise.bestScore ? (
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Best Score</span>
                        <span className="text-lg font-black text-primary">{exercise.bestScore}%</span>
                      </div>
                   ) : (
                      <div className="text-xs font-semibold text-muted-foreground">No score yet</div>
                   )}
                   <Button size="sm" className="rounded-none font-bold px-6 group-hover:translate-x-1 transition-transform">
                     Play
                   </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
