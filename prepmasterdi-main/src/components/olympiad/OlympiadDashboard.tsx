import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProgressRing } from '@/components/dashboard/ProgressRing';
import { 
  Trophy, 
  Brain,
  Atom,
  FlaskConical,
  Calculator,
  Code,
  Play,
  ChevronRight,
  Sparkles,
  Target,
  TrendingUp,
  FileText,
  Lightbulb,
  Upload,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const subjects = [
  { id: 'math', name: 'Mathematics', icon: <Calculator className="w-5 h-5" />, color: 'from-blue-500 to-indigo-600' },
  { id: 'physics', name: 'Physics', icon: <Atom className="w-5 h-5" />, color: 'from-amber-500 to-orange-600' },
  { id: 'chemistry', name: 'Chemistry', icon: <FlaskConical className="w-5 h-5" />, color: 'from-emerald-500 to-teal-600' },
  { id: 'biology', name: 'Biology', icon: <Brain className="w-5 h-5" />, color: 'from-rose-500 to-pink-600' },
  { id: 'informatics', name: 'Informatics', icon: <Code className="w-5 h-5" />, color: 'from-violet-500 to-purple-600' },
];

const countries = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'India', 
  'China', 'Singapore', 'South Korea', 'Japan', 'Germany', 'France', 'Other'
];

const grades = [
  { value: '9', label: 'Grade 9 / Year 10' },
  { value: '10', label: 'Grade 10 / Year 11' },
  { value: '11', label: 'Grade 11 / Year 12' },
  { value: '12', label: 'Grade 12 / Year 13' },
];

interface OlympiadSetup {
  grade: string;
  country: string;
  subject: string;
}

export function OlympiadDashboard() {
  const [setup, setSetup] = useState<OlympiadSetup | null>(null);
  const [formData, setFormData] = useState<Partial<OlympiadSetup>>({});

  const handleSetupComplete = () => {
    if (formData.grade && formData.country && formData.subject) {
      setSetup(formData as OlympiadSetup);
    }
  };

  if (!setup) {
    return (
      <div className="animate-fade-in max-w-2xl mx-auto">
        <Card className="border-2 border-amber-500/30">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Olympiad Preparation</CardTitle>
            <CardDescription>
              Tell us about yourself so we can find relevant problems and create a study plan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Your Grade Level</Label>
              <Select onValueChange={(v) => setFormData({...formData, grade: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your grade" />
                </SelectTrigger>
                <SelectContent>
                  {grades.map((g) => (
                    <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Country</Label>
              <Select onValueChange={(v) => setFormData({...formData, country: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Subject</Label>
              <div className="grid grid-cols-2 gap-3">
                {subjects.map((subject) => (
                  <button
                    key={subject.id}
                    onClick={() => setFormData({...formData, subject: subject.id})}
                    className={cn(
                      "p-4 rounded-xl border-2 flex items-center gap-3 transition-all",
                      formData.subject === subject.id
                        ? "border-amber-500 bg-amber-500/5"
                        : "border-border hover:border-amber-500/50"
                    )}
                  >
                    <div className={cn("p-2 rounded-lg bg-gradient-to-r text-white", subject.color)}>
                      {subject.icon}
                    </div>
                    <span className="font-medium text-foreground">{subject.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <Button 
              className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-600 text-white"
              onClick={handleSetupComplete}
              disabled={!formData.grade || !formData.country || !formData.subject}
            >
              Start Preparation <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const selectedSubject = subjects.find(s => s.id === setup.subject);

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className={cn("p-2 rounded-lg bg-gradient-to-r text-white", selectedSubject?.color)}>
              {selectedSubject?.icon}
            </div>
            <h1 className="text-3xl font-bold text-foreground">{selectedSubject?.name} Olympiad</h1>
          </div>
          <p className="text-muted-foreground">
            Grade {setup.grade} • {setup.country} • AI-analyzed problem sets
          </p>
        </div>
        <Button variant="outline" onClick={() => setSetup(null)}>
          Change Settings
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">0</p>
                <p className="text-xs text-muted-foreground">Topics Mastered</p>
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
                <p className="text-2xl font-bold text-foreground">0</p>
                <p className="text-xs text-muted-foreground">Problems Solved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">0/1</p>
                <p className="text-xs text-muted-foreground">Tests Completed</p>
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
                <p className="text-2xl font-bold text-foreground">0</p>
                <p className="text-xs text-muted-foreground">Questions Uploaded</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upload Section */}
      <Card className="border-dashed border-2 border-amber-500/30">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-amber-500" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Upload Past Olympiad Questions</h3>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              Upload past papers from your country's olympiad. The AI will analyze question types 
              and create a personalized practice plan.
            </p>
            <Button className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
              <Upload className="w-4 h-4 mr-2" /> Upload Questions
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Analysis */}
      <Card className="border-amber-500/30 bg-gradient-to-r from-amber-500/5 to-transparent">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white animate-bounce-subtle">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-foreground mb-1">AI Question Analysis</h3>
              <p className="text-muted-foreground mb-3">
                Upload olympiad questions and the AI will:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500" />
                  Analyze question types and difficulty levels
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500" />
                  Identify knowledge areas required for each problem
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500" />
                  Generate similar practice problems for weak areas
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500" />
                  Provide step-by-step explanations and pro tips
                </li>
              </ul>
              <Button variant="outline">
                Learn More <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Practice Test */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-500" />
            Practice Tests
          </CardTitle>
          <CardDescription>
            Complete full olympiad-style tests to prepare for the competition
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-xl border-2 border-amber-500 bg-amber-500/5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Play className="w-5 h-5 text-amber-500" />
                <Badge className="bg-amber-500 text-white">Available</Badge>
              </div>
            </div>
            <h4 className="font-semibold text-foreground">First Practice Test</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Complete at least one full test with no doubts before your olympiad
            </p>
            <Button className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
              Start Test <Play className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            Upload past questions first for AI to analyze and create relevant practice
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
