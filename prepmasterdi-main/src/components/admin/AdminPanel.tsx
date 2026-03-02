import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QuestionBankManager } from './QuestionBankManager';
import { 
  Settings, 
  Database, 
  Users, 
  FileQuestion,
  ClipboardList,
  Brain,
  LogOut
} from 'lucide-react';

export function AdminPanel() {
  const { signOut, isAdmin } = useAuth();
  const [selectedAI, setSelectedAI] = useState('gemini');

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-foreground mb-2">Access Denied</h2>
        <p className="text-muted-foreground">You don't have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
          <p className="text-muted-foreground">Manage your exam prep platform</p>
        </div>
        <Button variant="outline" onClick={signOut}>
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>

      <Tabs defaultValue="questions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="questions" className="gap-2">
            <FileQuestion className="w-4 h-4" />
            Questions
          </TabsTrigger>
          <TabsTrigger value="tests" className="gap-2">
            <ClipboardList className="w-4 h-4" />
            Mock Tests
          </TabsTrigger>
          <TabsTrigger value="ai" className="gap-2">
            <Brain className="w-4 h-4" />
            AI Settings
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Question Bank Tab */}
        <TabsContent value="questions">
          <QuestionBankManager />
        </TabsContent>

        {/* Mock Tests Tab */}
        <TabsContent value="tests">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5" />
                Mock Test Manager
              </CardTitle>
              <CardDescription>Create and manage mock tests for all exam types</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Mock test creation interface coming soon. You can currently add questions to the question bank.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Settings Tab */}
        <TabsContent value="ai">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AI Configuration
              </CardTitle>
              <CardDescription>Configure which AI model analyzes student results</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div 
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedAI === 'gemini' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedAI('gemini')}
                >
                  <h3 className="font-semibold mb-1">Google Gemini 3 Flash</h3>
                  <p className="text-sm text-muted-foreground">Fast and efficient for most tasks</p>
                  <p className="text-xs text-primary mt-2">Recommended</p>
                </div>
                <div 
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedAI === 'gemini-pro' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedAI('gemini-pro')}
                >
                  <h3 className="font-semibold mb-1">Google Gemini 2.5 Pro</h3>
                  <p className="text-sm text-muted-foreground">Best for complex reasoning</p>
                </div>
                <div 
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedAI === 'gpt5' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedAI('gpt5')}
                >
                  <h3 className="font-semibold mb-1">OpenAI GPT-5</h3>
                  <p className="text-sm text-muted-foreground">Powerful all-rounder</p>
                </div>
                <div 
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedAI === 'gpt5-mini' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedAI('gpt5-mini')}
                >
                  <h3 className="font-semibold mb-1">OpenAI GPT-5 Mini</h3>
                  <p className="text-sm text-muted-foreground">Cost-effective option</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                The selected AI model will be used for analyzing student test results and generating personalized feedback.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <div className="grid gap-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Database Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-primary/5 rounded-xl text-center">
                    <p className="text-3xl font-bold text-primary">0</p>
                    <p className="text-sm text-muted-foreground">Total Questions</p>
                  </div>
                  <div className="p-4 bg-emerald-500/5 rounded-xl text-center">
                    <p className="text-3xl font-bold text-emerald-500">0</p>
                    <p className="text-sm text-muted-foreground">Mock Tests</p>
                  </div>
                  <div className="p-4 bg-amber-500/5 rounded-xl text-center">
                    <p className="text-3xl font-bold text-amber-500">0</p>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  User Management
                </CardTitle>
                <CardDescription>Manage user roles and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-4">
                  User management interface coming soon.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
