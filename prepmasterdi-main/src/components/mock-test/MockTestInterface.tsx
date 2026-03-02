import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, ChevronLeft, ChevronRight, Flag, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Question {
  id: string;
  question_content: string;
  options: string[] | null;
  correct_answer: string;
  explanation?: string;
  skill_type: string;
  difficulty: string;
}

interface MockTestInterfaceProps {
  testId: string;
  testTitle: string;
  questions: Question[];
  durationMinutes: number;
  onComplete: (results: TestResults) => void;
  onCancel: () => void;
}

interface TestResults {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  skipped: number;
  timeSpentSeconds: number;
  answers: Record<string, { selected: string; correct: boolean }>;
  score: number;
}

export function MockTestInterface({
  testId,
  testTitle,
  questions,
  durationMinutes,
  onComplete,
  onCancel
}: MockTestInterfaceProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
  const [isReviewing, setIsReviewing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<TestResults | null>(null);

  const currentQuestion = questions[currentIndex];

  // Timer
  useEffect(() => {
    if (showResults) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showResults]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const toggleFlag = (questionId: string) => {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  };

  const handleSubmit = useCallback(() => {
    const answeredQuestions = Object.entries(answers);
    let correct = 0;
    let wrong = 0;
    const answerResults: Record<string, { selected: string; correct: boolean }> = {};

    questions.forEach((q) => {
      const userAnswer = answers[q.id];
      if (userAnswer) {
        const isCorrect = userAnswer === q.correct_answer;
        answerResults[q.id] = { selected: userAnswer, correct: isCorrect };
        if (isCorrect) correct++;
        else wrong++;
      }
    });

    const testResults: TestResults = {
      totalQuestions: questions.length,
      correctAnswers: correct,
      wrongAnswers: wrong,
      skipped: questions.length - answeredQuestions.length,
      timeSpentSeconds: durationMinutes * 60 - timeLeft,
      answers: answerResults,
      score: Math.round((correct / questions.length) * 100)
    };

    setResults(testResults);
    setShowResults(true);
    onComplete(testResults);
  }, [answers, questions, durationMinutes, timeLeft, onComplete]);

  const getQuestionStatus = (questionId: string) => {
    if (answers[questionId]) return 'answered';
    if (flagged.has(questionId)) return 'flagged';
    return 'unanswered';
  };

  if (showResults && results) {
    return (
      <div className="max-w-4xl mx-auto p-6 animate-fade-in">
        <Card className="border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Test Complete!</CardTitle>
            <p className="text-muted-foreground">{testTitle}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Score */}
            <div className="text-center">
              <div className="text-6xl font-bold text-primary mb-2">{results.score}%</div>
              <p className="text-muted-foreground">Your Score</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-emerald-500/10 rounded-xl p-4 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-emerald-500">{results.correctAnswers}</p>
                <p className="text-sm text-muted-foreground">Correct</p>
              </div>
              <div className="bg-red-500/10 rounded-xl p-4 text-center">
                <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-red-500">{results.wrongAnswers}</p>
                <p className="text-sm text-muted-foreground">Wrong</p>
              </div>
              <div className="bg-amber-500/10 rounded-xl p-4 text-center">
                <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-amber-500">{results.skipped}</p>
                <p className="text-sm text-muted-foreground">Skipped</p>
              </div>
              <div className="bg-blue-500/10 rounded-xl p-4 text-center">
                <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-500">
                  {Math.floor(results.timeSpentSeconds / 60)}m
                </p>
                <p className="text-sm text-muted-foreground">Time Spent</p>
              </div>
            </div>

            {/* Review Answers */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Review Answers</h3>
              {questions.map((q, idx) => {
                const result = results.answers[q.id];
                const userAnswer = answers[q.id];
                const isCorrect = result?.correct;
                const wasSkipped = !userAnswer;

                return (
                  <div 
                    key={q.id}
                    className={cn(
                      "p-4 rounded-xl border",
                      isCorrect && "bg-emerald-500/5 border-emerald-500/30",
                      !isCorrect && !wasSkipped && "bg-red-500/5 border-red-500/30",
                      wasSkipped && "bg-amber-500/5 border-amber-500/30"
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-medium">Question {idx + 1}</span>
                      <Badge variant={isCorrect ? "default" : wasSkipped ? "secondary" : "destructive"}>
                        {isCorrect ? "Correct" : wasSkipped ? "Skipped" : "Wrong"}
                      </Badge>
                    </div>
                    <p className="text-sm mb-2">{q.question_content}</p>
                    {userAnswer && !isCorrect && (
                      <p className="text-sm text-red-500">Your answer: {userAnswer}</p>
                    )}
                    <p className="text-sm text-emerald-500">Correct answer: {q.correct_answer}</p>
                    {q.explanation && (
                      <p className="text-sm text-muted-foreground mt-2 italic">{q.explanation}</p>
                    )}
                  </div>
                );
              })}
            </div>

            <Button onClick={onCancel} className="w-full">
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 bg-card rounded-xl border border-border p-4">
        <div>
          <h2 className="font-semibold text-lg">{testTitle}</h2>
          <p className="text-sm text-muted-foreground">
            Question {currentIndex + 1} of {questions.length}
          </p>
        </div>
        <div className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg",
          timeLeft < 300 ? "bg-red-500/10 text-red-500" : "bg-primary/10 text-primary"
        )}>
          <Clock className="w-5 h-5" />
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress */}
      <Progress 
        value={(Object.keys(answers).length / questions.length) * 100} 
        className="mb-6 h-2"
      />

      {/* Question Navigation Pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {questions.map((q, idx) => {
          const status = getQuestionStatus(q.id);
          return (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                "w-10 h-10 rounded-lg font-medium text-sm transition-all",
                idx === currentIndex && "ring-2 ring-primary",
                status === 'answered' && "bg-emerald-500 text-white",
                status === 'flagged' && "bg-amber-500 text-white",
                status === 'unanswered' && "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Question Card */}
      <Card className="border-border mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant="outline">{currentQuestion.skill_type}</Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleFlag(currentQuestion.id)}
              className={cn(
                flagged.has(currentQuestion.id) && "text-amber-500"
              )}
            >
              <Flag className="w-4 h-4 mr-1" />
              {flagged.has(currentQuestion.id) ? 'Flagged' : 'Flag'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg">{currentQuestion.question_content}</p>

          {currentQuestion.options && (
            <RadioGroup
              value={answers[currentQuestion.id] || ''}
              onValueChange={(value) => handleAnswer(currentQuestion.id, value)}
            >
              {currentQuestion.options.map((option, idx) => (
                <div 
                  key={idx}
                  className={cn(
                    "flex items-center space-x-3 p-4 rounded-xl border transition-all cursor-pointer hover:border-primary/50",
                    answers[currentQuestion.id] === option && "border-primary bg-primary/5"
                  )}
                  onClick={() => handleAnswer(currentQuestion.id, option)}
                >
                  <RadioGroupItem value={option} id={`option-${idx}`} />
                  <Label htmlFor={`option-${idx}`} className="cursor-pointer flex-1">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>

        <Button
          variant="default"
          className="gradient-primary"
          onClick={() => {
            if (currentIndex === questions.length - 1) {
              handleSubmit();
            } else {
              setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1));
            }
          }}
        >
          {currentIndex === questions.length - 1 ? 'Submit Test' : 'Next'}
          {currentIndex !== questions.length - 1 && <ChevronRight className="w-4 h-4 ml-1" />}
        </Button>
      </div>
    </div>
  );
}
