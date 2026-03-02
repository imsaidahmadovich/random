import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UserStreak {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
  streakStartDate: string | null;
  missedYesterday: boolean;
  yesterdayTasksRequired: number;
  yesterdayTasksCompleted: number;
}

interface DailyActivity {
  timeSpentMinutes: number;
  questionsAttempted: number;
  questionsCorrect: number;
  tasksCompleted: number;
}

interface WeeklyStats {
  totalTimeMinutes: number;
  totalQuestionsCorrect: number;
}

interface ExamProgress {
  sat: { mastery: number; testsCompleted: number; questionsCorrect: number };
  ielts: { mastery: number; testsCompleted: number; questionsCorrect: number };
  olympiad: { mastery: number; testsCompleted: number; questionsCorrect: number };
}

export function useUserStats() {
  const { user } = useAuth();
  const [streak, setStreak] = useState<UserStreak>({
    currentStreak: 0,
    longestStreak: 0,
    lastActivityDate: null,
    streakStartDate: null,
    missedYesterday: false,
    yesterdayTasksRequired: 0,
    yesterdayTasksCompleted: 0
  });
  const [todayActivity, setTodayActivity] = useState<DailyActivity>({
    timeSpentMinutes: 0,
    questionsAttempted: 0,
    questionsCorrect: 0,
    tasksCompleted: 0
  });
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats>({
    totalTimeMinutes: 0,
    totalQuestionsCorrect: 0
  });
  const [examProgress, setExamProgress] = useState<ExamProgress>({
    sat: { mastery: 0, testsCompleted: 0, questionsCorrect: 0 },
    ielts: { mastery: 0, testsCompleted: 0, questionsCorrect: 0 },
    olympiad: { mastery: 0, testsCompleted: 0, questionsCorrect: 0 }
  });
  const [loading, setLoading] = useState(true);

  // Track page visit time
  const [sessionStartTime] = useState(Date.now());

  const fetchStreak = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('user_streaks')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (data && !error) {
      setStreak({
        currentStreak: data.current_streak,
        longestStreak: data.longest_streak,
        lastActivityDate: data.last_activity_date,
        streakStartDate: data.streak_start_date,
        missedYesterday: data.missed_yesterday,
        yesterdayTasksRequired: data.yesterday_tasks_required,
        yesterdayTasksCompleted: data.yesterday_tasks_completed
      });
    }
  }, [user]);

  const fetchTodayActivity = useCallback(async () => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('daily_activity')
      .select('*')
      .eq('user_id', user.id)
      .eq('activity_date', today)
      .maybeSingle();

    if (data && !error) {
      setTodayActivity({
        timeSpentMinutes: data.time_spent_minutes,
        questionsAttempted: data.questions_attempted,
        questionsCorrect: data.questions_correct,
        tasksCompleted: data.tasks_completed
      });
    }
  }, [user]);

  const fetchWeeklyStats = useCallback(async () => {
    if (!user) return;

    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const { data, error } = await supabase
      .from('daily_activity')
      .select('time_spent_minutes, questions_correct')
      .eq('user_id', user.id)
      .gte('activity_date', weekAgo.toISOString().split('T')[0]);

    if (data && !error) {
      const totalTime = data.reduce((sum, d) => sum + (d.time_spent_minutes || 0), 0);
      const totalCorrect = data.reduce((sum, d) => sum + (d.questions_correct || 0), 0);
      setWeeklyStats({
        totalTimeMinutes: totalTime,
        totalQuestionsCorrect: totalCorrect
      });
    }
  }, [user]);

  const fetchExamProgress = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('exam_progress')
      .select('*')
      .eq('user_id', user.id);

    if (data && !error) {
      const progress: ExamProgress = {
        sat: { mastery: 0, testsCompleted: 0, questionsCorrect: 0 },
        ielts: { mastery: 0, testsCompleted: 0, questionsCorrect: 0 },
        olympiad: { mastery: 0, testsCompleted: 0, questionsCorrect: 0 }
      };

      data.forEach((item) => {
        const examType = item.exam_type as 'sat' | 'ielts' | 'olympiad';
        progress[examType] = {
          mastery: Number(item.mastery_percentage) || 0,
          testsCompleted: item.tests_completed || 0,
          questionsCorrect: item.total_questions_correct || 0
        };
      });

      setExamProgress(progress);
    }
  }, [user]);

  // Record activity when visiting
  const recordVisit = useCallback(async () => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    
    // Upsert today's activity
    const { error } = await supabase
      .from('daily_activity')
      .upsert({
        user_id: user.id,
        activity_date: today,
        time_spent_minutes: 0
      }, {
        onConflict: 'user_id,activity_date'
      });

    if (error) console.error('Error recording visit:', error);

    // Update streak
    await updateStreak();
  }, [user]);

  const updateStreak = useCallback(async () => {
    if (!user) return;

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    const { data: streakData } = await supabase
      .from('user_streaks')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!streakData) return;

    const lastActivity = streakData.last_activity_date;
    let newStreak = streakData.current_streak;
    let newLongest = streakData.longest_streak;
    let newStreakStart = streakData.streak_start_date;
    let missedYesterday = false;

    if (!lastActivity) {
      // First visit
      newStreak = 1;
      newStreakStart = todayStr;
    } else {
      const lastDate = new Date(lastActivity);
      const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        // Same day, no change
      } else if (diffDays === 1) {
        // Consecutive day
        newStreak += 1;
      } else if (diffDays === 2) {
        // Missed one day - give chance to continue if half tasks completed
        missedYesterday = true;
        const halfTasksCompleted = streakData.yesterday_tasks_completed >= (streakData.yesterday_tasks_required / 2);
        if (!halfTasksCompleted) {
          // Reset streak
          newStreak = 1;
          newStreakStart = todayStr;
        } else {
          // Allow continuation
          newStreak += 1;
        }
      } else {
        // Missed 2+ days - reset streak
        newStreak = 1;
        newStreakStart = todayStr;
      }
    }

    if (newStreak > newLongest) {
      newLongest = newStreak;
    }

    // Store yesterday's tasks for potential recovery
    const { data: yesterdayActivity } = await supabase
      .from('daily_activity')
      .select('tasks_completed')
      .eq('user_id', user.id)
      .eq('activity_date', new Date(today.getTime() - 86400000).toISOString().split('T')[0])
      .maybeSingle();

    await supabase
      .from('user_streaks')
      .update({
        current_streak: newStreak,
        longest_streak: newLongest,
        last_activity_date: todayStr,
        streak_start_date: newStreakStart,
        missed_yesterday: missedYesterday,
        yesterday_tasks_completed: yesterdayActivity?.tasks_completed || 0
      })
      .eq('user_id', user.id);

    await fetchStreak();
  }, [user, fetchStreak]);

  // Update time spent periodically
  const updateTimeSpent = useCallback(async () => {
    if (!user) return;

    const minutesSpent = Math.floor((Date.now() - sessionStartTime) / 60000);
    const today = new Date().toISOString().split('T')[0];

    await supabase
      .from('daily_activity')
      .upsert({
        user_id: user.id,
        activity_date: today,
        time_spent_minutes: minutesSpent
      }, {
        onConflict: 'user_id,activity_date'
      });
  }, [user, sessionStartTime]);

  // Increment correct answers
  const incrementCorrectAnswers = useCallback(async (examType: 'sat' | 'ielts' | 'olympiad', count: number = 1) => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];

    // Update daily activity manually
    const { data } = await supabase
      .from('daily_activity')
      .select('*')
      .eq('user_id', user.id)
      .eq('activity_date', today)
      .maybeSingle();

    if (data) {
      await supabase
        .from('daily_activity')
        .update({ 
          questions_correct: (data.questions_correct || 0) + count,
          questions_attempted: (data.questions_attempted || 0) + 1
        })
        .eq('id', data.id);
    } else {
      await supabase
        .from('daily_activity')
        .insert({
          user_id: user.id,
          activity_date: today,
          questions_correct: count,
          questions_attempted: 1
        });
    }

    // Update exam progress
    const { data: progress } = await supabase
      .from('exam_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('exam_type', examType)
      .maybeSingle();

    if (progress) {
      const newCorrect = (progress.total_questions_correct || 0) + count;
      const newAttempted = (progress.total_questions_attempted || 0) + 1;
      const newMastery = newAttempted > 0 ? (newCorrect / newAttempted) * 100 : 0;

      await supabase
        .from('exam_progress')
        .update({
          total_questions_correct: newCorrect,
          total_questions_attempted: newAttempted,
          mastery_percentage: Math.min(newMastery, 100)
        })
        .eq('id', progress.id);
    }

    await fetchTodayActivity();
    await fetchExamProgress();
  }, [user, fetchTodayActivity, fetchExamProgress]);

  // Initial fetch
  useEffect(() => {
    if (user) {
      setLoading(true);
      Promise.all([
        recordVisit(),
        fetchStreak(),
        fetchTodayActivity(),
        fetchWeeklyStats(),
        fetchExamProgress()
      ]).finally(() => setLoading(false));
    }
  }, [user, recordVisit, fetchStreak, fetchTodayActivity, fetchWeeklyStats, fetchExamProgress]);

  // Update time spent every minute
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(updateTimeSpent, 60000);
    
    // Also update on page unload
    const handleUnload = () => updateTimeSpent();
    window.addEventListener('beforeunload', handleUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleUnload);
      updateTimeSpent();
    };
  }, [user, updateTimeSpent]);

  return {
    streak,
    todayActivity,
    weeklyStats,
    examProgress,
    loading,
    incrementCorrectAnswers,
    refreshStats: () => {
      fetchStreak();
      fetchTodayActivity();
      fetchWeeklyStats();
      fetchExamProgress();
    }
  };
}
