import { useAuth } from '@/contexts/AuthContext';
import { useUserStats } from '@/hooks/useUserStats';
import { ExamCard } from './ExamCard';
import { StreakFire } from './StreakFire';
import { FameIcon } from './FameIcon';
import { ExamType } from '@/types';
import { Sparkles, Clock, Target, Loader2 } from 'lucide-react';

interface DashboardProps {
  onExamSelect: (exam: ExamType) => void;
}

function formatTimeWeek(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  return `${hours}h ${mins}m`;
}

export function Dashboard({ onExamSelect }: DashboardProps) {
  const { user } = useAuth();
  const { streak, weeklyStats, examProgress, loading } = useUserStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg gradient-hero">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}!
          </h1>
        </div>
        <p className="text-muted-foreground">
          Continue your learning journey and achieve your goals
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Streak Fire */}
        <StreakFire 
          streak={streak.currentStreak}
          streakStartDate={streak.streakStartDate ? new Date(streak.streakStartDate) : null}
        />

        {/* Time This Week */}
        <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-blue-500/10">
            <Clock className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {formatTimeWeek(weeklyStats.totalTimeMinutes)}
            </p>
            <p className="text-sm text-muted-foreground">Time This Week</p>
          </div>
        </div>

        {/* Questions Solved (correct only) */}
        <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-emerald-500/10">
            <Target className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {weeklyStats.totalQuestionsCorrect}
            </p>
            <p className="text-sm text-muted-foreground">Questions Correct</p>
          </div>
        </div>
      </div>

      {/* Exam Cards with Fame Icons */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground mb-4">Your Exam Prep</h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <ExamCard
            type="sat"
            title="SAT Prep"
            description="Master Reading, Writing & Math with AI-powered practice"
            progress={examProgress.sat.mastery}
            testsCompleted={examProgress.sat.testsCompleted}
            onClick={() => onExamSelect('sat')}
          />
          <div className="flex justify-center">
            <FameIcon 
              percentage={examProgress.sat.mastery} 
              examType="sat" 
              className="w-full"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <ExamCard
            type="ielts"
            title="IELTS Prep"
            description="Improve all 4 skills: Listening, Reading, Writing, Speaking"
            progress={examProgress.ielts.mastery}
            testsCompleted={examProgress.ielts.testsCompleted}
            onClick={() => onExamSelect('ielts')}
          />
          <div className="flex justify-center">
            <FameIcon 
              percentage={examProgress.ielts.mastery} 
              examType="ielts"
              className="w-full"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <ExamCard
            type="olympiad"
            title="Olympiad Prep"
            description="Prepare for Math, Physics, Chemistry & more competitions"
            progress={examProgress.olympiad.mastery}
            testsCompleted={examProgress.olympiad.testsCompleted}
            onClick={() => onExamSelect('olympiad')}
          />
          <div className="flex justify-center">
            <FameIcon 
              percentage={examProgress.olympiad.mastery} 
              examType="olympiad"
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* AI Recommendation */}
      <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border border-primary/20">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl gradient-primary text-white">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground mb-1">AI Recommendation</h3>
            <p className="text-muted-foreground">
              {examProgress.sat.mastery < examProgress.ielts.mastery && examProgress.sat.mastery < examProgress.olympiad.mastery ? (
                <>Based on your progress, we recommend focusing on <span className="font-semibold text-primary">SAT preparation</span> today. Build your foundation with practice questions.</>
              ) : examProgress.ielts.mastery < examProgress.olympiad.mastery ? (
                <>Based on your progress, we recommend focusing on <span className="font-semibold text-primary">IELTS skills</span> today. Practice all four sections.</>
              ) : (
                <>Based on your progress, we recommend focusing on <span className="font-semibold text-primary">Olympiad problems</span> today. Challenge yourself with harder questions.</>
              )}
            </p>
            <button className="mt-3 px-4 py-2 rounded-lg gradient-primary text-white font-medium text-sm hover:opacity-90 transition-opacity">
              Start Practice Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
