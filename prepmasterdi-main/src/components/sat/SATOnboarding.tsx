import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar, Clock, Target, ArrowRight, BookOpen, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SATOnboardingProps {
  onComplete: (preferences: {
    examDate: Date;
    dailyStudyTime: number;
    targetScore: number;
    currentScore?: number;
  }) => void;
}

export function SATOnboarding({ onComplete }: SATOnboardingProps) {
  const [step, setStep] = useState(1);
  const [examDate, setExamDate] = useState('');
  const [dailyStudyTime, setDailyStudyTime] = useState(60);
  const [targetScore, setTargetScore] = useState(1400);
  const [currentScore, setCurrentScore] = useState<number | undefined>();

  const studyTimeOptions = [
    { value: 30, label: '30 min', description: 'Light practice' },
    { value: 60, label: '1 hour', description: 'Recommended' },
    { value: 90, label: '1.5 hours', description: 'Intensive' },
    { value: 120, label: '2+ hours', description: 'Full focus' },
  ];

  const targetScoreOptions = [
    { value: 1200, label: '1200+', description: 'Good score' },
    { value: 1400, label: '1400+', description: 'Competitive' },
    { value: 1500, label: '1500+', description: 'Top schools' },
    { value: 1550, label: '1550+', description: 'Elite' },
  ];

  const calculateWeeksLeft = () => {
    if (!examDate) return null;
    const exam = new Date(examDate);
    const now = new Date();
    const diff = exam.getTime() - now.getTime();
    const weeks = Math.ceil(diff / (1000 * 60 * 60 * 24 * 7));
    return weeks > 0 ? weeks : 0;
  };

  const weeksLeft = calculateWeeksLeft();

  const handleSubmit = () => {
    onComplete({
      examDate: new Date(examDate),
      dailyStudyTime,
      targetScore,
      currentScore,
    });
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all",
              step >= s 
                ? "gradient-primary text-white" 
                : "bg-muted text-muted-foreground"
            )}>
              {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
            </div>
            {s < 3 && (
              <div className={cn(
                "w-20 h-1 mx-2 rounded-full transition-all",
                step > s ? "bg-primary" : "bg-muted"
              )} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Exam Date */}
      {step === 1 && (
        <Card className="border-2 border-primary/20">
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">When is your SAT exam?</CardTitle>
            <CardDescription>
              We'll create a personalized study plan based on your timeline
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="examDate">Exam Date</Label>
              <Input
                id="examDate"
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="text-lg h-12"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {weeksLeft !== null && weeksLeft > 0 && (
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Time until exam:</span>
                  <span className="text-2xl font-bold text-primary">{weeksLeft} weeks</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {weeksLeft >= 8 
                    ? "Great! You have plenty of time for thorough preparation."
                    : weeksLeft >= 4
                    ? "Good timeline. Focus on your weak areas."
                    : "Let's prioritize high-impact practice!"}
                </p>
              </div>
            )}

            <Button 
              className="w-full h-12 gradient-primary text-white"
              onClick={() => setStep(2)}
              disabled={!examDate}
            >
              Continue <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Daily Study Time */}
      {step === 2 && (
        <Card className="border-2 border-primary/20">
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 rounded-2xl gradient-secondary flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">How much time can you study daily?</CardTitle>
            <CardDescription>
              Be realistic - consistency beats intensity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
              {studyTimeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setDailyStudyTime(option.value)}
                  className={cn(
                    "p-4 rounded-xl border-2 text-left transition-all",
                    dailyStudyTime === option.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <span className="text-xl font-bold text-foreground block">{option.label}</span>
                  <span className="text-sm text-muted-foreground">{option.description}</span>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 h-12" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button 
                className="flex-1 h-12 gradient-primary text-white"
                onClick={() => setStep(3)}
              >
                Continue <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Target Score */}
      {step === 3 && (
        <Card className="border-2 border-primary/20">
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 rounded-2xl gradient-success flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">What's your target score?</CardTitle>
            <CardDescription>
              Set an ambitious but achievable goal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
              {targetScoreOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTargetScore(option.value)}
                  className={cn(
                    "p-4 rounded-xl border-2 text-left transition-all",
                    targetScore === option.value
                      ? "border-accent bg-accent/5"
                      : "border-border hover:border-accent/50"
                  )}
                >
                  <span className="text-xl font-bold text-foreground block">{option.label}</span>
                  <span className="text-sm text-muted-foreground">{option.description}</span>
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentScore">Current/Practice Score (optional)</Label>
              <Input
                id="currentScore"
                type="number"
                placeholder="e.g., 1200"
                value={currentScore || ''}
                onChange={(e) => setCurrentScore(e.target.value ? parseInt(e.target.value) : undefined)}
                className="h-12"
                min={400}
                max={1600}
              />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 h-12" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button 
                className="flex-1 h-12 gradient-success text-white"
                onClick={handleSubmit}
              >
                Start Learning <BookOpen className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
