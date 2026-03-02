import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Search, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Question {
  id: string;
  exam_type: string;
  section: string;
  skill_type: string;
  question_content: string;
  options: unknown;
  correct_answer: string;
  explanation: string | null;
  difficulty: string;
  is_official: boolean;
}

const SAT_SKILLS = [
  'Craft and Structure',
  'Information and Ideas',
  'Standard English Conventions',
  'Expression of Ideas',
  'Algebra',
  'Advanced Math',
  'Problem Solving',
  'Geometry and Trigonometry'
];

const IELTS_SKILLS = [
  'Multiple Choice',
  'True/False/Not Given',
  'Matching',
  'Completion',
  'Summary',
  'Task 1',
  'Task 2',
  'Speaking Part 1',
  'Speaking Part 2',
  'Speaking Part 3'
];

const OLYMPIAD_SUBJECTS = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science'
];

export function QuestionBankManager() {
  const { toast } = useToast();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterExam, setFilterExam] = useState<string>('all');
  const [filterSkill, setFilterSkill] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    exam_type: 'sat' as 'sat' | 'ielts' | 'olympiad',
    section: '',
    skill_type: '',
    question_content: '',
    options: ['', '', '', ''],
    correct_answer: '',
    explanation: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    is_official: false
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Error', description: 'Failed to load questions', variant: 'destructive' });
    } else {
      setQuestions(data || []);
    }
    setLoading(false);
  };

  const getSkillOptions = () => {
    switch (formData.exam_type) {
      case 'sat':
        return SAT_SKILLS;
      case 'ielts':
        return IELTS_SKILLS;
      case 'olympiad':
        return OLYMPIAD_SUBJECTS;
      default:
        return [];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const questionData = {
      exam_type: formData.exam_type,
      section: formData.section,
      skill_type: formData.skill_type,
      question_content: formData.question_content,
      options: formData.options.filter(o => o.trim() !== ''),
      correct_answer: formData.correct_answer,
      explanation: formData.explanation || null,
      difficulty: formData.difficulty,
      is_official: formData.is_official
    };

    let error;
    if (editingQuestion) {
      const { error: updateError } = await supabase
        .from('questions')
        .update(questionData)
        .eq('id', editingQuestion.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('questions')
        .insert(questionData);
      error = insertError;
    }

    if (error) {
      toast({ 
        title: 'Error', 
        description: `Failed to ${editingQuestion ? 'update' : 'create'} question`, 
        variant: 'destructive' 
      });
    } else {
      toast({ 
        title: 'Success', 
        description: `Question ${editingQuestion ? 'updated' : 'created'} successfully` 
      });
      setIsDialogOpen(false);
      resetForm();
      fetchQuestions();
    }
    setSaving(false);
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    const optionsArray = Array.isArray(question.options) ? question.options as string[] : ['', '', '', ''];
    setFormData({
      exam_type: question.exam_type as 'sat' | 'ielts' | 'olympiad',
      section: question.section,
      skill_type: question.skill_type,
      question_content: question.question_content,
      options: optionsArray.length >= 4 ? optionsArray : [...optionsArray, ...Array(4 - optionsArray.length).fill('')],
      correct_answer: question.correct_answer,
      explanation: question.explanation || '',
      difficulty: question.difficulty as 'easy' | 'medium' | 'hard',
      is_official: question.is_official
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    const { error } = await supabase
      .from('questions')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: 'Error', description: 'Failed to delete question', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Question deleted successfully' });
      fetchQuestions();
    }
  };

  const resetForm = () => {
    setEditingQuestion(null);
    setFormData({
      exam_type: 'sat',
      section: '',
      skill_type: '',
      question_content: '',
      options: ['', '', '', ''],
      correct_answer: '',
      explanation: '',
      difficulty: 'medium',
      is_official: false
    });
  };

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.question_content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         q.skill_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesExam = filterExam === 'all' || q.exam_type === filterExam;
    const matchesSkill = filterSkill === 'all' || q.skill_type === filterSkill;
    return matchesSearch && matchesExam && matchesSkill;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Question Bank</h2>
          <p className="text-muted-foreground">Manage questions for all exam types</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingQuestion ? 'Edit Question' : 'Add New Question'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Exam Type</Label>
                  <Select 
                    value={formData.exam_type} 
                    onValueChange={(v) => setFormData({ ...formData, exam_type: v as any, skill_type: '' })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sat">SAT</SelectItem>
                      <SelectItem value="ielts">IELTS</SelectItem>
                      <SelectItem value="olympiad">Olympiad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Difficulty</Label>
                  <Select 
                    value={formData.difficulty} 
                    onValueChange={(v) => setFormData({ ...formData, difficulty: v as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Section</Label>
                  <Input 
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    placeholder="e.g., Reading, Math, Listening"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Skill Type</Label>
                  <Select 
                    value={formData.skill_type} 
                    onValueChange={(v) => setFormData({ ...formData, skill_type: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select skill" />
                    </SelectTrigger>
                    <SelectContent>
                      {getSkillOptions().map(skill => (
                        <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Question</Label>
                <Textarea 
                  value={formData.question_content}
                  onChange={(e) => setFormData({ ...formData, question_content: e.target.value })}
                  placeholder="Enter the question text..."
                  className="min-h-24"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Answer Options</Label>
                {formData.options.map((option, idx) => (
                  <Input 
                    key={idx}
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...formData.options];
                      newOptions[idx] = e.target.value;
                      setFormData({ ...formData, options: newOptions });
                    }}
                    placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                  />
                ))}
              </div>

              <div className="space-y-2">
                <Label>Correct Answer</Label>
                <Input 
                  value={formData.correct_answer}
                  onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
                  placeholder="Enter the correct answer"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Explanation (Optional)</Label>
                <Textarea 
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  placeholder="Explain why this is the correct answer..."
                  className="min-h-20"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_official"
                  checked={formData.is_official}
                  onChange={(e) => setFormData({ ...formData, is_official: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="is_official">Official Question (from College Board, etc.)</Label>
              </div>

              <Button type="submit" className="w-full" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  editingQuestion ? 'Update Question' : 'Add Question'
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="border-border">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterExam} onValueChange={setFilterExam}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Exam Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Exams</SelectItem>
                <SelectItem value="sat">SAT</SelectItem>
                <SelectItem value="ielts">IELTS</SelectItem>
                <SelectItem value="olympiad">Olympiad</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Questions Table */}
      <Card className="border-border">
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Question</TableHead>
                  <TableHead>Exam</TableHead>
                  <TableHead>Skill</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuestions.map((q) => (
                  <TableRow key={q.id}>
                    <TableCell className="max-w-md">
                      <p className="truncate">{q.question_content}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{q.exam_type.toUpperCase()}</Badge>
                    </TableCell>
                    <TableCell>{q.skill_type}</TableCell>
                    <TableCell>
                      <Badge variant={
                        q.difficulty === 'easy' ? 'secondary' :
                        q.difficulty === 'hard' ? 'destructive' : 'default'
                      }>
                        {q.difficulty}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(q)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(q.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredQuestions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No questions found. Add your first question!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
