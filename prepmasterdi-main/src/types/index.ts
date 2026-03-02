export type ExamType = 'sat' | 'ielts' | 'olympiad';

export type SATSection = 'reading-writing' | 'math';
export type SATSkill = 
  | 'craft-structure' 
  | 'information-ideas' 
  | 'standard-english' 
  | 'expression-ideas'
  | 'algebra'
  | 'advanced-math'
  | 'problem-solving'
  | 'geometry-trig';

export type IELTSSection = 'listening' | 'reading' | 'writing' | 'speaking';
export type IELTSSkill = 
  | 'multiple-choice'
  | 'true-false-ng'
  | 'matching'
  | 'completion'
  | 'summary'
  | 'task1'
  | 'task2'
  | 'part1'
  | 'part2'
  | 'part3';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  examPreferences: ExamPreferences;
  progress: UserProgress;
}

export interface ExamPreferences {
  sat?: SATPreferences;
  ielts?: IELTSPreferences;
  olympiad?: OlympiadPreferences;
}

export interface SATPreferences {
  examDate: Date;
  dailyStudyTime: number; // minutes
  targetScore: number;
  currentScore?: number;
}

export interface IELTSPreferences {
  examDate: Date;
  dailyStudyTime: number;
  targetBand: number;
  currentBand?: number;
  academicOrGeneral: 'academic' | 'general';
}

export interface OlympiadPreferences {
  grade: number;
  country: string;
  subject: string;
  examDate?: Date;
}

export interface UserProgress {
  sat?: SATProgress;
  ielts?: IELTSProgress;
  olympiad?: OlympiadProgress;
}

export interface SATProgress {
  mockTestsTaken: number;
  totalQuestions: number;
  correctAnswers: number;
  skillMastery: Record<SATSkill, number>;
  recentScores: number[];
  weakAreas: SATSkill[];
  strongAreas: SATSkill[];
}

export interface IELTSProgress {
  mockTestsTaken: number;
  sectionScores: Record<IELTSSection, number>;
  skillMastery: Record<IELTSSkill, number>;
  weakAreas: IELTSSkill[];
  strongAreas: IELTSSkill[];
}

export interface OlympiadProgress {
  testsCompleted: number;
  topicMastery: Record<string, number>;
  questionsAttempted: number;
  questionsCorrect: number;
}

export interface MockTest {
  id: string;
  title: string;
  examType: ExamType;
  sections: TestSection[];
  duration: number; // minutes
  createdBy: string;
  isOfficial: boolean;
}

export interface TestSection {
  id: string;
  name: string;
  questions: Question[];
  timeLimit: number;
}

export interface Question {
  id: string;
  type: string;
  content: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  skill: string;
  difficulty: 'easy' | 'medium' | 'hard';
  imageUrl?: string;
}

export interface AIFeedback {
  overallAnalysis: string;
  weakPoints: string[];
  strongPoints: string[];
  recommendations: string[];
  practiceQuestions: Question[];
}
