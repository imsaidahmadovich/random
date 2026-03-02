import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ExamType, UserProfile, UserProgress } from '@/types';

interface AppState {
  currentExam: ExamType | null;
  isAdmin: boolean;
  user: UserProfile | null;
  sidebarOpen: boolean;
}

interface AppContextType extends AppState {
  setCurrentExam: (exam: ExamType | null) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  setUser: (user: UserProfile | null) => void;
  setSidebarOpen: (open: boolean) => void;
  updateUserProgress: (examType: ExamType, progress: Partial<UserProgress>) => void;
}

const defaultProgress: UserProgress = {
  sat: {
    mockTestsTaken: 0,
    totalQuestions: 0,
    correctAnswers: 0,
    skillMastery: {
      'craft-structure': 0,
      'information-ideas': 0,
      'standard-english': 0,
      'expression-ideas': 0,
      'algebra': 0,
      'advanced-math': 0,
      'problem-solving': 0,
      'geometry-trig': 0,
    },
    recentScores: [],
    weakAreas: [],
    strongAreas: [],
  },
  ielts: {
    mockTestsTaken: 0,
    sectionScores: {
      listening: 0,
      reading: 0,
      writing: 0,
      speaking: 0,
    },
    skillMastery: {
      'multiple-choice': 0,
      'true-false-ng': 0,
      'matching': 0,
      'completion': 0,
      'summary': 0,
      'task1': 0,
      'task2': 0,
      'part1': 0,
      'part2': 0,
      'part3': 0,
    },
    weakAreas: [],
    strongAreas: [],
  },
  olympiad: {
    testsCompleted: 0,
    topicMastery: {},
    questionsAttempted: 0,
    questionsCorrect: 0,
  },
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    currentExam: null,
    isAdmin: false,
    user: {
      id: '1',
      name: 'Student',
      email: 'student@example.com',
      isAdmin: false,
      examPreferences: {},
      progress: defaultProgress,
    },
    sidebarOpen: true,
  });

  const setCurrentExam = (exam: ExamType | null) => {
    setState(prev => ({ ...prev, currentExam: exam }));
  };

  const setIsAdmin = (isAdmin: boolean) => {
    setState(prev => ({ ...prev, isAdmin }));
  };

  const setUser = (user: UserProfile | null) => {
    setState(prev => ({ ...prev, user }));
  };

  const setSidebarOpen = (open: boolean) => {
    setState(prev => ({ ...prev, sidebarOpen: open }));
  };

  const updateUserProgress = (examType: ExamType, progress: Partial<UserProgress>) => {
    setState(prev => ({
      ...prev,
      user: prev.user ? {
        ...prev.user,
        progress: {
          ...prev.user.progress,
          [examType]: {
            ...prev.user.progress[examType],
            ...progress[examType],
          },
        },
      } : null,
    }));
  };

  return (
    <AppContext.Provider value={{
      ...state,
      setCurrentExam,
      setIsAdmin,
      setUser,
      setSidebarOpen,
      updateUserProgress,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
