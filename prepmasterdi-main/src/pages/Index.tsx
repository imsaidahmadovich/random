import { useState } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { SATDashboard } from '@/components/sat/SATDashboard';
import { IELTSDashboard } from '@/components/ielts/IELTSDashboard';
import { OlympiadDashboard } from '@/components/olympiad/OlympiadDashboard';
import { AdminPanel } from '@/components/admin/AdminPanel';
import { ExamType } from '@/types';
import Auth from './Auth';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const [currentPath, setCurrentPath] = useState('/');
  const { user, loading, isAdmin } = useAuth();

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
  };

  const handleExamSelect = (exam: ExamType) => {
    setCurrentPath(`/${exam}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  const renderContent = () => {
    switch (currentPath) {
      case '/':
        return <Dashboard onExamSelect={handleExamSelect} />;
      case '/sat':
        return <SATDashboard />;
      case '/ielts':
        return <IELTSDashboard />;
      case '/olympiad':
        return <OlympiadDashboard />;
      case '/admin':
        return isAdmin ? <AdminPanel /> : <Dashboard onExamSelect={handleExamSelect} />;
      default:
        return <Dashboard onExamSelect={handleExamSelect} />;
    }
  };

  return (
    <MainLayout onNavigate={handleNavigate} currentPath={currentPath}>
      {renderContent()}
    </MainLayout>
  );
}

const Index = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default Index;
