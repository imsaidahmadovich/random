import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProgressRing } from '@/components/dashboard/ProgressRing';
import { 
  Globe, 
  Headphones, 
  BookOpen, 
  PenTool, 
  Mic, 
  Play,
  ChevronRight,
  Sparkles,
  Clock,
  Target,
  TrendingUp,
  FileText,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const sections = [
  { 
    id: 'listening', 
    name: 'Listening', 
    icon: <Headphones className="w-5 h-5" />,
    color: 'from-violet-500 to-purple-600',
    duration: 30,
    tips: ['Read questions before audio', 'Mark key words', 'Watch for distractors']
  },
  { 
    id: 'reading', 
    name: 'Reading', 
    icon: <BookOpen className="w-5 h-5" />,
    color: 'from-blue-500 to-indigo-600',
    duration: 60,
    tips: ['Skim passages first', 'Use keywords from questions', 'Time management is key']
  },
  { 
    id: 'writing', 
    name: 'Writing', 
    icon: <PenTool className="w-5 h-5" />,
    color: 'from-emerald-500 to-teal-600',
    duration: 60,
    tips: ['Plan before writing', 'Use varied vocabulary', 'Check grammar and spelling']
  },
  { 
    id: 'speaking', 
    name: 'Speaking', 
    icon: <Mic className="w-5 h-5" />,
    color: 'from-amber-500 to-orange-600',
    duration: 15,
    tips: ['Practice with stories', 'Use linking words', 'Stay calm and confident']
  },
];

const mockTests = [
  { id: '1', title: 'Full Mock Test 1', status: 'available' },
  { id: '2', title: 'Full Mock Test 2', status: 'locked' },
  { id: '3', title: 'Full Mock Test 3', status: 'locked' },
];

export function IELTSDashboard() {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
            <Globe className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">IELTS Preparation</h1>
        </div>
        <p className="text-muted-foreground">Master all 4 skills with AI-powered practice and feedback</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">7.0</p>
                <p className="text-xs text-muted-foreground">Target Band</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">0/3</p>
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
                <p className="text-2xl font-bold text-foreground">2h 45m</p>
                <p className="text-xs text-muted-foreground">Test Duration</p>
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
                <p className="text-2xl font-bold text-foreground">Academic</p>
                <p className="text-xs text-muted-foreground">Test Type</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section) => (
          <Card 
            key={section.id}
            className="cursor-pointer hover:shadow-card-hover transition-all"
            onClick={() => setSelectedSection(section.id)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("p-3 rounded-xl bg-gradient-to-r text-white", section.color)}>
                    {section.icon}
                  </div>
                  <div>
                    <CardTitle>{section.name}</CardTitle>
                    <CardDescription>{section.duration} minutes</CardDescription>
                  </div>
                </div>
                <ProgressRing progress={0} size={60} strokeWidth={4}>
                  <span className="text-sm font-bold">0%</span>
                </ProgressRing>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Quick Tips:</p>
                {section.tips.map((tip, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    {tip}
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4" variant="outline">
                Practice {section.name} <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mock Tests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-500" />
            Full Mock Tests
          </CardTitle>
          <CardDescription>
            Complete practice tests with all 4 sections - AI evaluates your responses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockTests.map((test) => (
              <div 
                key={test.id}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all",
                  test.status === 'available' 
                    ? "border-emerald-500 bg-emerald-500/5 cursor-pointer hover:shadow-md" 
                    : "border-border opacity-60"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  {test.status === 'available' ? (
                    <Play className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-muted-foreground" />
                  )}
                  <Badge variant={test.status === 'available' ? 'default' : 'secondary'}>
                    {test.status === 'available' ? 'Start' : 'Locked'}
                  </Badge>
                </div>
                <h4 className="font-semibold text-foreground">{test.title}</h4>
                <p className="text-sm text-muted-foreground">2h 45m • All skills</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-4 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            Mock tests are optional but highly recommended before your actual exam
          </p>
        </CardContent>
      </Card>

      {/* AI Recommendation */}
      <Card className="border-emerald-500/30 bg-gradient-to-r from-emerald-500/5 to-transparent">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl gradient-success text-white animate-bounce-subtle">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-foreground mb-1">AI Study Plan</h3>
              <p className="text-muted-foreground mb-3">
                Start with a full mock test to identify your weak areas. The AI will analyze your performance 
                across all 4 skills and create a personalized improvement plan.
              </p>
              <div className="flex gap-3">
                <Button className="gradient-success text-white">
                  Take Full Mock Test <Play className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline">
                  Practice by Section
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
