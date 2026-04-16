'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ApiClient } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Clock, TrendingUp } from 'lucide-react';

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
        // Robust mapping to find the array in common response patterns
        const dataArray = Array.isArray(response.data)
          ? response.data
          : (response.data.exercises || response.data.data || response.data.list || []);

        console.log('[v0] Resolved data array:', dataArray);

        if (dataArray.length === 0) {
          console.warn('[v0] API returned success but empty exercises list.');
        }

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
      } else {
        console.error('[v0] Failed to fetch exercises:', response.error);
      }
    } catch (err) {
      console.error('[v0] Unexpected error in fetchExercises:', err);
    }
    setIsLoading(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'hard':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Brain Games</h1>
        <p className="text-muted-foreground mt-2">Keep your mind sharp with cognitive exercises</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Brain className="w-10 h-10 text-primary mx-auto mb-2" />
              <div className="text-3xl font-bold">{exercises.length}</div>
              <div className="text-sm text-muted-foreground">Exercises Available</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <TrendingUp className="w-10 h-10 text-accent mx-auto mb-2" />
              <div className="text-3xl font-bold">89</div>
              <div className="text-sm text-muted-foreground">Average Score</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Clock className="w-10 h-10 text-secondary mx-auto mb-2" />
              <div className="text-3xl font-bold">48</div>
              <div className="text-sm text-muted-foreground">Minutes Played</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
      ) : exercises.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No daily exercises found yet. Check back later!
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {exercises.map((exercise) => (
            <Card
              key={exercise.id}
              className="hover:shadow-lg transition-all cursor-pointer hover:-translate-y-1 group"
              onClick={() => router.push(`/dashboard/exercises/${exercise.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">{exercise.name}</CardTitle>
                    <CardDescription className="mt-1">{exercise.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge className={getDifficultyColor(exercise.difficulty)}>
                    {exercise.difficulty}
                  </Badge>
                  <Badge variant="outline">{exercise.category}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {exercise.duration} min
                  </span>
                  {exercise.bestScore && (
                    <span className="text-primary font-medium">
                      Best: {exercise.bestScore}%
                    </span>
                  )}
                </div>
                <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground">Play</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
