import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface FameIconProps {
  percentage: number;
  examType: 'sat' | 'ielts' | 'olympiad';
  className?: string;
}

type FameLevel = 
  | 'tennis' | 'football' | 'basketball' 
  | 'meteorite' | 'asteroid' 
  | 'moon1' | 'moon2' | 'moon3'
  | 'earth1' | 'earth2' | 'earth3'
  | 'saturn1' | 'saturn2' | 'saturn3'
  | 'jupiter1' | 'jupiter2' | 'jupiter3'
  | 'sun1' | 'sun2' | 'sun3'
  | 'blackhole';

function getFameLevel(percentage: number): FameLevel {
  if (percentage <= 3) return 'tennis';
  if (percentage <= 7) return 'football';
  if (percentage <= 10) return 'basketball';
  if (percentage <= 15) return 'meteorite';
  if (percentage <= 25) return 'asteroid';
  if (percentage <= 30) return 'moon1';
  if (percentage <= 35) return 'moon2';
  if (percentage <= 40) return 'moon3';
  if (percentage <= 45) return 'earth1';
  if (percentage <= 50) return 'earth2';
  if (percentage <= 55) return 'earth3';
  if (percentage <= 60) return 'saturn1';
  if (percentage <= 65) return 'saturn2';
  if (percentage <= 70) return 'saturn3';
  if (percentage <= 75) return 'jupiter1';
  if (percentage <= 80) return 'jupiter2';
  if (percentage <= 84) return 'jupiter3';
  if (percentage <= 88) return 'sun1';
  if (percentage <= 92) return 'sun2';
  if (percentage <= 95) return 'sun3';
  return 'blackhole';
}

function getFameName(level: FameLevel): string {
  const names: Record<FameLevel, string> = {
    tennis: '🎾 Tennis Ball',
    football: '⚽ Football',
    basketball: '🏀 Basketball',
    meteorite: '☄️ Meteorite',
    asteroid: '🪨 Asteroid',
    moon1: '🌑 Moon I',
    moon2: '🌒 Moon II',
    moon3: '🌓 Moon III',
    earth1: '🌍 Earth I',
    earth2: '🌎 Earth II',
    earth3: '🌏 Earth III',
    saturn1: '🪐 Saturn I',
    saturn2: '🪐 Saturn II',
    saturn3: '🪐 Saturn III',
    jupiter1: '🟤 Jupiter I',
    jupiter2: '🟤 Jupiter II',
    jupiter3: '🟤 Jupiter III',
    sun1: '☀️ Sun I',
    sun2: '☀️ Sun II',
    sun3: '☀️ Sun III',
    blackhole: '🕳️ Black Hole'
  };
  return names[level];
}

function getFameEmoji(level: FameLevel): string {
  const emojis: Record<FameLevel, string> = {
    tennis: '🎾',
    football: '⚽',
    basketball: '🏀',
    meteorite: '☄️',
    asteroid: '🪨',
    moon1: '🌑',
    moon2: '🌒',
    moon3: '🌓',
    earth1: '🌍',
    earth2: '🌎',
    earth3: '🌏',
    saturn1: '🪐',
    saturn2: '🪐',
    saturn3: '🪐',
    jupiter1: '🟤',
    jupiter2: '🟤',
    jupiter3: '🟤',
    sun1: '☀️',
    sun2: '☀️',
    sun3: '☀️',
    blackhole: '🕳️'
  };
  return emojis[level];
}

function getFameSize(level: FameLevel): string {
  if (['tennis', 'football', 'basketball'].includes(level)) return 'text-3xl';
  if (['meteorite', 'asteroid'].includes(level)) return 'text-4xl';
  if (level.startsWith('moon')) return 'text-4xl';
  if (level.startsWith('earth')) return 'text-5xl';
  if (level.startsWith('saturn')) return 'text-5xl';
  if (level.startsWith('jupiter')) return 'text-6xl';
  if (level.startsWith('sun')) return 'text-6xl';
  return 'text-7xl'; // black hole
}

function getGlowEffect(level: FameLevel): string {
  if (level === 'blackhole') return 'animate-pulse drop-shadow-[0_0_20px_rgba(128,0,128,0.8)]';
  if (level.startsWith('sun')) return 'animate-pulse drop-shadow-[0_0_15px_rgba(255,200,0,0.8)]';
  if (level.startsWith('jupiter')) return 'drop-shadow-[0_0_10px_rgba(210,180,140,0.6)]';
  if (level.startsWith('saturn')) return 'drop-shadow-[0_0_8px_rgba(218,165,32,0.5)]';
  if (level.startsWith('earth')) return 'drop-shadow-[0_0_6px_rgba(34,139,34,0.5)]';
  return '';
}

function getNextLevelInfo(percentage: number): { next: string; remaining: number } | null {
  const thresholds = [
    { max: 3, next: 'Football' },
    { max: 7, next: 'Basketball' },
    { max: 10, next: 'Meteorite' },
    { max: 15, next: 'Asteroid' },
    { max: 25, next: 'Moon I' },
    { max: 30, next: 'Moon II' },
    { max: 35, next: 'Moon III' },
    { max: 40, next: 'Earth I' },
    { max: 45, next: 'Earth II' },
    { max: 50, next: 'Earth III' },
    { max: 55, next: 'Saturn I' },
    { max: 60, next: 'Saturn II' },
    { max: 65, next: 'Saturn III' },
    { max: 70, next: 'Jupiter I' },
    { max: 75, next: 'Jupiter II' },
    { max: 80, next: 'Jupiter III' },
    { max: 84, next: 'Sun I' },
    { max: 88, next: 'Sun II' },
    { max: 92, next: 'Sun III' },
    { max: 95, next: 'Black Hole' },
    { max: 100, next: null }
  ];

  for (const threshold of thresholds) {
    if (percentage <= threshold.max) {
      if (threshold.next) {
        return { next: threshold.next, remaining: threshold.max - Math.floor(percentage) + 1 };
      }
      return null;
    }
  }
  return null;
}

export function FameIcon({ percentage, examType, className }: FameIconProps) {
  const level = getFameLevel(percentage);
  const fameName = getFameName(level);
  const emoji = getFameEmoji(level);
  const size = getFameSize(level);
  const glow = getGlowEffect(level);
  const nextLevel = getNextLevelInfo(percentage);

  const examColors = {
    sat: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30',
    ielts: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30',
    olympiad: 'from-amber-500/20 to-orange-500/20 border-amber-500/30'
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn(
            "flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-br border cursor-pointer transition-all hover:scale-105",
            examColors[examType],
            className
          )}>
            <span className={cn(size, glow, "transition-all duration-300")}>
              {emoji}
            </span>
            <p className="text-xs text-muted-foreground mt-2 font-medium">
              {fameName.split(' ').slice(1).join(' ')}
            </p>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-popover border-border max-w-xs">
          <div className="text-center space-y-1">
            <p className="font-bold text-lg">{fameName}</p>
            <p className="text-primary font-semibold">{percentage.toFixed(1)}% Mastery</p>
            {nextLevel && (
              <p className="text-sm text-muted-foreground">
                {nextLevel.remaining}% more to reach {nextLevel.next}
              </p>
            )}
            {!nextLevel && (
              <p className="text-sm text-muted-foreground">
                🏆 Maximum mastery achieved!
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
