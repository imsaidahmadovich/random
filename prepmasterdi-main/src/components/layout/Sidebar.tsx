import { cn } from '@/lib/utils';
import { useApp } from '@/contexts/AppContext';
import { ExamType } from '@/types';
import { 
  BookOpen, 
  Globe, 
  Trophy, 
  Settings, 
  LayoutDashboard,
  ChevronLeft,
  Sparkles,
  GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  onNavigate: (path: string) => void;
  currentPath: string;
}

const examItems: { type: ExamType; label: string; icon: React.ReactNode; color: string }[] = [
  { 
    type: 'sat', 
    label: 'SAT Prep', 
    icon: <BookOpen className="w-5 h-5" />,
    color: 'from-blue-500 to-indigo-600'
  },
  { 
    type: 'ielts', 
    label: 'IELTS Prep', 
    icon: <Globe className="w-5 h-5" />,
    color: 'from-emerald-500 to-teal-600'
  },
  { 
    type: 'olympiad', 
    label: 'Olympiads', 
    icon: <Trophy className="w-5 h-5" />,
    color: 'from-amber-500 to-orange-600'
  },
];

export function Sidebar({ onNavigate, currentPath }: SidebarProps) {
  const { currentExam, setCurrentExam, sidebarOpen, setSidebarOpen, isAdmin } = useApp();

  const handleExamSelect = (exam: ExamType) => {
    setCurrentExam(exam);
    onNavigate(`/${exam}`);
  };

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-full bg-card border-r border-border z-40 transition-all duration-300 flex flex-col",
        sidebarOpen ? "w-64" : "w-20"
      )}
    >
      {/* Logo */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
            <GraduationCap className="w-6 h-6 text-primary-foreground" />
          </div>
          {sidebarOpen && (
            <div className="animate-fade-in">
              <h1 className="font-bold text-lg text-foreground">PrepMaster</h1>
              <p className="text-xs text-muted-foreground">AI-Powered Learning</p>
            </div>
          )}
        </div>
      </div>

      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-20 w-6 h-6 rounded-full border bg-card shadow-md"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <ChevronLeft className={cn("w-4 h-4 transition-transform", !sidebarOpen && "rotate-180")} />
      </Button>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
        {/* Dashboard */}
        <button
          onClick={() => {
            setCurrentExam(null);
            onNavigate('/');
          }}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200",
            currentPath === '/' 
              ? "bg-primary/10 text-primary" 
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
          {sidebarOpen && <span className="font-medium">Dashboard</span>}
        </button>

        {/* Exam Types */}
        <div className="pt-4">
          {sidebarOpen && (
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Exam Prep
            </p>
          )}
          {examItems.map((item) => (
            <button
              key={item.type}
              onClick={() => handleExamSelect(item.type)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group",
                currentExam === item.type
                  ? `bg-gradient-to-r ${item.color} text-white shadow-md`
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <div className={cn(
                "flex-shrink-0 transition-transform group-hover:scale-110",
                currentExam === item.type && "animate-bounce-subtle"
              )}>
                {item.icon}
              </div>
              {sidebarOpen && (
                <span className="font-medium">{item.label}</span>
              )}
            </button>
          ))}
        </div>

        {/* AI Assistant */}
        {sidebarOpen && (
          <div className="pt-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">AI Assistant</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Get personalized feedback and practice questions
              </p>
            </div>
          </div>
        )}
      </nav>

      {/* Admin/Settings */}
      <div className="p-3 border-t border-border">
        <button
          onClick={() => onNavigate('/admin')}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200",
            currentPath === '/admin'
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          {sidebarOpen && <span className="font-medium">Admin Panel</span>}
        </button>
      </div>
    </aside>
  );
}
