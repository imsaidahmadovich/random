import { cn } from '@/lib/utils';
import { Flame } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface StreakFireProps {
  streak: number;
  streakStartDate?: Date | null;
  className?: string;
}

type StreakLevel = 'small' | 'medium' | 'large' | 'legendary';

function getStreakLevel(streak: number): StreakLevel {
  if (streak >= 90) return 'legendary'; // 3+ months
  if (streak >= 30) return 'large'; // 1-3 months
  if (streak >= 7) return 'medium'; // 1 week - 1 month
  return 'small'; // less than 1 week
}

function getStreakColor(streak: number): string {
  if (streak >= 90) return 'text-red-500'; // Red after 3 months
  return 'text-yellow-500'; // Yellow otherwise
}

function getGlowClass(streak: number): string {
  const level = getStreakLevel(streak);
  switch (level) {
    case 'legendary':
      return 'drop-shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-pulse';
    case 'large':
      return 'drop-shadow-[0_0_12px_rgba(234,179,8,0.7)]';
    case 'medium':
      return 'drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]';
    case 'small':
    default:
      return 'drop-shadow-[0_0_4px_rgba(234,179,8,0.3)]';
  }
}

function getFireSize(streak: number): { iconSize: number; containerSize: string } {
  const level = getStreakLevel(streak);
  switch (level) {
    case 'legendary':
      return { iconSize: 32, containerSize: 'w-14 h-14' };
    case 'large':
      return { iconSize: 28, containerSize: 'w-12 h-12' };
    case 'medium':
      return { iconSize: 24, containerSize: 'w-10 h-10' };
    case 'small':
    default:
      return { iconSize: 20, containerSize: 'w-8 h-8' };
  }
}

export function StreakFire({ streak, streakStartDate, className }: StreakFireProps) {
  const color = getStreakColor(streak);
  const glowClass = getGlowClass(streak);
  const { iconSize, containerSize } = getFireSize(streak);
  const level = getStreakLevel(streak);

  const getLevelLabel = () => {
    switch (level) {
      case 'legendary':
        return '🔥 Legendary Streak!';
      case 'large':
        return '⭐ Amazing Streak!';
      case 'medium':
        return '💪 Great Streak!';
      default:
        return '✨ Building Streak';
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn(
            "flex items-center gap-3 bg-card rounded-xl border border-border p-4 cursor-pointer transition-all hover:border-yellow-500/50",
            className
          )}>
            <div className={cn(
              "flex items-center justify-center rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-500/20",
              containerSize
            )}>
              <Flame 
                className={cn(color, glowClass, "transition-all duration-300")}
                style={{ width: iconSize, height: iconSize }}
                fill="currentColor"
              />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{streak} days</p>
              <p className="text-sm text-muted-foreground">Study Streak</p>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="bg-popover border-border">
          <div className="text-center">
            <p className="font-semibold">{getLevelLabel()}</p>
            <p className="text-sm text-muted-foreground">
              {streak < 7 && `${7 - streak} days until next level`}
              {streak >= 7 && streak < 30 && `${30 - streak} days until monthly badge`}
              {streak >= 30 && streak < 90 && `${90 - streak} days until legendary status`}
              {streak >= 90 && 'You are a learning legend!'}
            </p>
            {streakStartDate && (
              <p className="text-xs text-muted-foreground mt-1">
                Started: {new Date(streakStartDate).toLocaleDateString()}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
