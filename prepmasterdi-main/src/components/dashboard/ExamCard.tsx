import { cn } from '@/lib/utils';
import { ExamType } from '@/types';
import { ProgressRing } from './ProgressRing';
import { ArrowRight, BookOpen, Globe, Trophy } from 'lucide-react';

interface ExamCardProps {
  type: ExamType;
  title: string;
  description: string;
  progress: number;
  testsCompleted: number;
  onClick: () => void;
}

const examIcons: Record<ExamType, React.ReactNode> = {
  sat: <BookOpen className="w-8 h-8" />,
  ielts: <Globe className="w-8 h-8" />,
  olympiad: <Trophy className="w-8 h-8" />,
};

const examGradients: Record<ExamType, string> = {
  sat: 'from-blue-500 to-indigo-600',
  ielts: 'from-emerald-500 to-teal-600',
  olympiad: 'from-amber-500 to-orange-600',
};

const examColors: Record<ExamType, string> = {
  sat: 'stroke-blue-500',
  ielts: 'stroke-emerald-500',
  olympiad: 'stroke-amber-500',
};

export function ExamCard({ type, title, description, progress, testsCompleted, onClick }: ExamCardProps) {
  return (
    <div 
      onClick={onClick}
      className="group relative bg-card rounded-2xl border border-border p-6 cursor-pointer transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
    >
      {/* Gradient accent */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r",
        examGradients[type]
      )} />

      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Icon */}
          <div className={cn(
            "w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center text-white mb-4",
            examGradients[type]
          )}>
            {examIcons[type]}
          </div>

          {/* Content */}
          <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground mb-4">{description}</p>

          {/* Stats */}
          <div className="flex items-center gap-4">
            <div>
              <p className="text-2xl font-bold text-foreground">{testsCompleted}</p>
              <p className="text-xs text-muted-foreground">Tests Completed</p>
            </div>
          </div>
        </div>

        {/* Progress Ring */}
        <div className="flex flex-col items-center">
          <ProgressRing 
            progress={progress} 
            size={90} 
            strokeWidth={6}
            color={examColors[type]}
          >
            <div className="text-center">
              <span className="text-lg font-bold text-foreground">{Math.round(progress)}%</span>
              <p className="text-[10px] text-muted-foreground">Mastery</p>
            </div>
          </ProgressRing>
        </div>
      </div>

      {/* Action */}
      <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
        <span className="text-sm font-medium text-primary">Continue Learning</span>
        <ArrowRight className="w-5 h-5 text-primary transition-transform group-hover:translate-x-1" />
      </div>
    </div>
  );
}
