import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useApp } from '@/contexts/AppContext';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children: ReactNode;
  onNavigate: (path: string) => void;
  currentPath: string;
}

export function MainLayout({ children, onNavigate, currentPath }: MainLayoutProps) {
  const { sidebarOpen } = useApp();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar onNavigate={onNavigate} currentPath={currentPath} />
      <main 
        className={cn(
          "transition-all duration-300 min-h-screen",
          sidebarOpen ? "ml-64" : "ml-20"
        )}
      >
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
