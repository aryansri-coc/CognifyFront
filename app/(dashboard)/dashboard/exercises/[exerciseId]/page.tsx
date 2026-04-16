'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ApiClient } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { QuizGame } from '@/components/games/quiz-game';
import { WordGame } from '@/components/games/word-game';
import { SequenceGame } from '@/components/games/sequence-game';
import { VisualPatternsGame } from '@/components/games/visual-patterns-game';
import { ArrowLeft, Trophy, RefreshCcw, Home, Star, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function GameSessionPage() {
  const params = useParams();
  const router = useRouter();
  const exerciseId = params.exerciseId as string;

  const [exercise, setExercise] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [gameState, setGameState] = useState<'playing' | 'completed'>('playing');
  const [finalScore, setFinalScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchExercise();
  }, [exerciseId]);

  const fetchExercise = async () => {
    setIsLoading(true);
    console.log(`[v0] Fetching exercise session for: ${exerciseId}`);
    try {
      const response = await ApiClient.getExercise(exerciseId);
      console.log('[v0] Exercise API Response:', response);
      
      if (response.success && response.data) {
        // If the data is nested under another 'data' or 'exercise' key, unwrap it
        const rawData = response.data.exercise || response.data.data || response.data;
        setExercise(rawData);
      } else {
        console.error('[v0] Failed to fetch exercise:', response.error);
      }
    } catch (err) {
      console.error('[v0] Unexpected error in fetchExercise:', err);
    }
    setIsLoading(false);
  };

  const handleGameComplete = async (score: number) => {
    setFinalScore(score);
    setGameState('completed');
    setIsSubmitting(true);
    try {
      await ApiClient.submitExercise(exerciseId, score);
    } catch (err) {
      console.error('Failed to submit score:', err);
    }
    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground animate-pulse font-medium">Preparing your session...</p>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center">
        <div className="bg-destructive/10 p-4 rounded-full">
          <ArrowLeft className="w-8 h-8 text-destructive" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Exercise Not Found</h2>
          <p className="text-muted-foreground mt-2">We couldn't load the workout data for this session.</p>
        </div>
        <Button onClick={() => router.push('/dashboard/exercises')} variant="outline">
          Back to Exercises
        </Button>
      </div>
    );
  }

  // Determine game type from metadata or ID
  const getGameType = () => {
    // Priority 1: Use the explicit type from the backend
    if (exercise.type) {
      if (exercise.type === 'WORD_GAME') return 'word';
      if (exercise.type === 'RECALL_QUIZ') return 'quiz';
      if (exercise.type === 'NUMBER_SEQUENCE') return 'sequence';
      if (exercise.type === 'VISUAL_PATTERNS') return 'visual';
    }

    const category = (exercise.category || '').toLowerCase();
    const id = (exerciseId || exercise.id || '').toLowerCase();
    
    // Favor category detection first for 'Memory' as it maps to the user's preferred Block Puzzle
    if (category.includes('memory') || category.includes('sequence')) return 'sequence';
    if (category.includes('quiz')) return 'quiz';
    if (category.includes('word')) return 'word';
    if (category.includes('visual') || category.includes('pattern')) return 'visual';
    
    // Fallback to ID-based detection if category is missing
    if (id.startsWith('word') || id.startsWith('wg_')) return 'word';
    if (id.startsWith('quiz') || id.startsWith('rq_') || id.startsWith('recall')) return 'quiz';
    if (id.startsWith('seq')) return 'sequence';
    if (id.startsWith('vp_')) return 'visual';
    
    return 'unknown';
  };

  if (gameState === 'completed') {
    return (
      <div className="max-w-xl mx-auto py-10 animate-in zoom-in duration-500">
        <Card className="border-none shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] bg-gradient-to-b from-background to-muted/30 overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-primary p-12 text-primary-foreground text-center relative overflow-hidden">
               {/* Decorative background elements */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-32 -mb-32" />
               
               <div className="relative z-10 space-y-4">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-md rounded-full border-4 border-white/30 shadow-2xl mb-4 animate-bounce">
                    <Trophy className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="text-4xl font-black tracking-tight">Session Complete!</h2>
                  <p className="opacity-80 text-lg">Great work, your mind is sharper than ever.</p>
               </div>
            </div>

            <div className="p-10 space-y-10">
               <div className="grid grid-cols-2 gap-8 text-center pt-2">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Your Score</p>
                    <p className="text-5xl font-black tracking-tighter text-primary">{finalScore}%</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Difficulty</p>
                    <p className="text-2xl font-bold capitalize">{exercise.difficulty || 'Normal'}</p>
                  </div>
               </div>

               <div className="flex flex-col gap-3">
                  <Button 
                    variant="default" 
                    size="lg" 
                    className="h-16 text-lg font-bold rounded-2xl shadow-lg shadow-primary/20 group hover:scale-[1.02] transition-all"
                    onClick={() => {
                        setGameState('playing');
                        setFinalScore(0);
                    }}
                  >
                    <RefreshCcw className="w-5 h-5 mr-3 group-hover:rotate-180 transition-transform duration-500" />
                    Play Again
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="h-16 text-lg font-semibold rounded-2xl border-2 hover:bg-muted transition-all"
                    onClick={() => router.push('/dashboard/exercises')}
                  >
                    <Home className="w-5 h-5 mr-3" />
                    Back to Dashboard
                  </Button>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Determine which game to render based on category or type
  const renderGame = () => {
    const gameType = getGameType();
    // Use the backend 'content' if available, otherwise fallback
    const rawData = exercise.content || exercise.gameData || exercise;
    
    // Transform data to meet component expectations
    let gameData = { ...rawData };

    switch (gameType) {
      case 'quiz':
        // Handle array of questions from the backend
        if (gameData.questions && Array.isArray(gameData.questions)) {
          gameData.questions = gameData.questions.map((q: any) => ({
            ...q,
            correctAnswer: q.options ? q.options.indexOf(q.answer) : 0
          }));
        } else if (gameData.question && !gameData.questions) {
          // Fallback for single question
          gameData.questions = [{
            question: gameData.question,
            options: gameData.options || [],
            correctAnswer: gameData.options ? gameData.options.indexOf(gameData.answer) : 0
          }];
        }
        return <QuizGame data={gameData} onComplete={handleGameComplete} />;
      case 'word':
        // Ensure words array exists for WordGame
        if (gameData.word && !gameData.words) {
          gameData.words = [{
            word: gameData.word,
            category: exercise.category || 'General',
            scrambled: gameData.scrambled,
            hint: gameData.hint
          }];
          // Add default categories if missing for the UI
          if (!gameData.categories && !gameData.options) {
             gameData.categories = ['General', 'Nature', 'Food', 'Object'];
          }
        }
        return <WordGame data={gameData} onComplete={handleGameComplete} />;
      case 'sequence':
        return <SequenceGame data={gameData} onComplete={handleGameComplete} />;
      case 'visual':
        // VisualPatternsGame expects 'rounds' with 'options'
        if (gameData.pattern && !gameData.rounds) {
          // Create dummy rounds based on the pattern
          gameData.rounds = [{
            options: ['Circle', 'Square', 'Triangle', 'Star', 'Hexagon', 'Diamond'],
            correctIndex: Math.floor(Math.random() * 6) // Dummy logic for now
          }];
        }
        return <VisualPatternsGame data={gameData} onComplete={handleGameComplete} />;
      default:
        return (
          <div className="text-center py-20 space-y-4 bg-muted/30 rounded-3xl border border-dashed border-muted-foreground/30">
            <p className="text-lg text-muted-foreground font-medium">Unsupported or missing game data: {exercise.type || exerciseId}</p>
            <Button onClick={() => handleGameComplete(85)}>Simulate Win (Debug)</Button>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="gap-2 px-0 hover:bg-transparent -ml-1 text-muted-foreground hover:text-foreground transition-colors group" onClick={() => router.push('/dashboard/exercises')}>
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Exit Session</span>
        </Button>
        <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-3 py-1 bg-background">Level: {exercise.difficulty}</Badge>
            <div className="flex items-center gap-0.5">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <Star className={cn("w-4 h-4 text-amber-500", exercise.difficulty === 'easy' ? 'text-muted/30 fill-none' : 'fill-amber-500')} />
            </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">{exercise.name}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{exercise.description}</p>
        </div>

        {renderGame()}
      </div>
    </div>
  );
}
