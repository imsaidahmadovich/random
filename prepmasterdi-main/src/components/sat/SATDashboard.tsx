import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { SATOnboarding } from './SATOnboarding';
import { ProgressRing } from '@/components/dashboard/ProgressRing';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Calculator, 
  FileText, 
  Play, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Clock,
  Target,
  Sparkles,
  ChevronRight,
  Lightbulb
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SATPreferences, SATSkill } from '@/types';

const skillCategories = [
  {
    section: 'Reading & Writing',
    icon: <BookOpen className="w-5 h-5" />,
    color: 'from-violet-500 to-purple-600',
    skills: [
      { id: 'craft-structure' as SATSkill, name: 'Craft & Structure', description: 'Analyze word choice, text structure' },
      { id: 'information-ideas' as SATSkill, name: 'Information & Ideas', description: 'Central ideas, evidence, inferences' },
      { id: 'standard-english' as SATSkill, name: 'Standard English', description: 'Grammar, punctuation, syntax' },
      { id: 'expression-ideas' as SATSkill, name: 'Expression of Ideas', description: 'Organization, style, tone' },
    ]
  },
  {
    section: 'Math',
    icon: <Calculator className="w-5 h-5" />,
    color: 'from-blue-500 to-indigo-600',
    skills: [
      { id: 'algebra' as SATSkill, name: 'Algebra', description: 'Linear equations, systems, functions' },
      { id: 'advanced-math' as SATSkill, name: 'Advanced Math', description: 'Quadratics, polynomials, exponentials' },
      { id: 'problem-solving' as SATSkill, name: 'Problem Solving', description: 'Ratios, rates, data analysis' },
      { id: 'geometry-trig' as SATSkill, name: 'Geometry & Trig', description: 'Shapes, angles, trigonometry' },
    ]
  }
];

const mockTests = [
  { id: '1', title: 'Diagnostic Test', description: 'Full-length practice test', duration: 134, status: 'available' },
  { id: '2', title: 'Practice Test 1', description: 'College Board official test', duration: 134, status: 'locked' },
  { id: '3', title: 'Practice Test 2', description: 'College Board official test', duration: 134, status: 'locked' },
];

export function SATDashboard() {
  const { user, updateUserProgress } = useApp();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(
    !!user?.examPreferences?.sat
  );
  const [preferences, setPreferences] = useState<SATPreferences | null>(
    user?.examPreferences?.sat || null
  );

  const handleOnboardingComplete = (prefs: SATPreferences) => {
    setPreferences(prefs);
    setHasCompletedOnboarding(true);
  };

  if (!hasCompletedOnboarding) {
    return <SATOnboarding onComplete={handleOnboardingComplete} />;
  }

  const progress = user?.progress?.sat;
  const weeksLeft = preferences?.examDate 
    ? Math.ceil((preferences.examDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 7))
    : null;

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">SAT Preparation</h1>
          <p className="text-muted-foreground">Your personalized study plan to reach {preferences?.targetScore || 1400}+</p>
        </div>
        {weeksLeft && weeksLeft > 0 && (
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">{weeksLeft}</div>
            <div className="text-sm text-muted-foreground">weeks left</div>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{preferences?.targetScore || 1400}</p>
                <p className="text-xs text-muted-foreground">Target Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{progress?.mockTestsTaken || 0}/3</p>
                <p className="text-xs text-muted-foreground">Mock Tests</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{preferences?.dailyStudyTime || 60}m</p>
                <p className="text-xs text-muted-foreground">Daily Goal</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-violet-500/10 text-violet-500">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{progress?.totalQuestions || 0}</p>
                <p className="text-xs text-muted-foreground">Questions Done</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mock Tests Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Mock Tests
          </CardTitle>
          <CardDescription>
            Take full-length practice tests and get AI-powered feedback
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockTests.map((test, index) => (
              <div 
                key={test.id}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all",
                  test.status === 'available' 
                    ? "border-primary bg-primary/5 cursor-pointer hover:shadow-md" 
                    : "border-border opacity-60"
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {test.status === 'available' ? (
                      <Play className="w-5 h-5 text-primary" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-muted-foreground" />
                    )}
                    <Badge variant={test.status === 'available' ? 'default' : 'secondary'}>
                      {test.status === 'available' ? 'Start' : 'Locked'}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">{test.duration} min</span>
                </div>
                <h4 className="font-semibold text-foreground">{test.title}</h4>
                <p className="text-sm text-muted-foreground">{test.description}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-4 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            Complete the diagnostic test first to unlock personalized practice
          </p>
        </CardContent>
      </Card>

      {/* Skills Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {skillCategories.map((category) => (
          <Card key={category.section}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className={cn("p-2 rounded-lg bg-gradient-to-r text-white", category.color)}>
                  {category.icon}
                </div>
                {category.section}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {category.skills.map((skill) => {
                const mastery = progress?.skillMastery?.[skill.id] || 0;
                const isWeak = mastery < 50;
                return (
                  <div 
                    key={skill.id}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                  >
                    <ProgressRing progress={mastery} size={48} strokeWidth={4}>
                      <span className="text-xs font-bold">{mastery}%</span>
                    </ProgressRing>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{skill.name}</span>
                        {isWeak && (
                          <Badge variant="destructive" className="text-xs">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Focus
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{skill.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Recommendation */}
      <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-transparent">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl gradient-primary text-white animate-bounce-subtle">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-foreground mb-1">AI Study Recommendation</h3>
              <p className="text-muted-foreground mb-3">
                Start with the <span className="font-semibold text-primary">Diagnostic Test</span> to identify your weak areas. 
                The AI will then create a personalized study plan focusing on the skills you need to improve most.
              </p>
              <Button className="gradient-primary text-white">
                Take Diagnostic Test <Play className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bluebook Guide */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Taking SAT on Bluebook?</h3>
              <p className="text-sm text-muted-foreground">
                Download the official Bluebook app and practice with real interface
              </p>
            </div>
            <Button variant="outline">
              View Guide <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
