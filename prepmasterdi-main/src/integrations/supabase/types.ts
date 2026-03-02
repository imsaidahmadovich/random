export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      daily_activity: {
        Row: {
          activity_date: string
          created_at: string
          id: string
          questions_attempted: number
          questions_correct: number
          tasks_completed: number
          time_spent_minutes: number
          updated_at: string
          user_id: string
        }
        Insert: {
          activity_date?: string
          created_at?: string
          id?: string
          questions_attempted?: number
          questions_correct?: number
          tasks_completed?: number
          time_spent_minutes?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          activity_date?: string
          created_at?: string
          id?: string
          questions_attempted?: number
          questions_correct?: number
          tasks_completed?: number
          time_spent_minutes?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      exam_preferences: {
        Row: {
          country: string | null
          created_at: string
          current_score: number | null
          daily_study_time_minutes: number | null
          exam_date: string | null
          exam_type: Database["public"]["Enums"]["exam_type"]
          grade: number | null
          id: string
          preferences: Json
          subject: string | null
          target_score: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          country?: string | null
          created_at?: string
          current_score?: number | null
          daily_study_time_minutes?: number | null
          exam_date?: string | null
          exam_type: Database["public"]["Enums"]["exam_type"]
          grade?: number | null
          id?: string
          preferences?: Json
          subject?: string | null
          target_score?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          country?: string | null
          created_at?: string
          current_score?: number | null
          daily_study_time_minutes?: number | null
          exam_date?: string | null
          exam_type?: Database["public"]["Enums"]["exam_type"]
          grade?: number | null
          id?: string
          preferences?: Json
          subject?: string | null
          target_score?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      exam_progress: {
        Row: {
          created_at: string
          exam_type: Database["public"]["Enums"]["exam_type"]
          id: string
          mastery_percentage: number
          skill_mastery: Json
          tests_completed: number
          total_questions_attempted: number
          total_questions_correct: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          exam_type: Database["public"]["Enums"]["exam_type"]
          id?: string
          mastery_percentage?: number
          skill_mastery?: Json
          tests_completed?: number
          total_questions_attempted?: number
          total_questions_correct?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          exam_type?: Database["public"]["Enums"]["exam_type"]
          id?: string
          mastery_percentage?: number
          skill_mastery?: Json
          tests_completed?: number
          total_questions_attempted?: number
          total_questions_correct?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      mock_test_questions: {
        Row: {
          created_at: string
          id: string
          mock_test_id: string
          question_id: string
          question_order: number
          section_name: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          mock_test_id: string
          question_id: string
          question_order: number
          section_name?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          mock_test_id?: string
          question_id?: string
          question_order?: number
          section_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mock_test_questions_mock_test_id_fkey"
            columns: ["mock_test_id"]
            isOneToOne: false
            referencedRelation: "mock_tests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mock_test_questions_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      mock_tests: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          duration_minutes: number
          exam_type: Database["public"]["Enums"]["exam_type"]
          id: string
          is_official: boolean
          title: string
          total_questions: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration_minutes: number
          exam_type: Database["public"]["Enums"]["exam_type"]
          id?: string
          is_official?: boolean
          title: string
          total_questions?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration_minutes?: number
          exam_type?: Database["public"]["Enums"]["exam_type"]
          id?: string
          is_official?: boolean
          title?: string
          total_questions?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      questions: {
        Row: {
          correct_answer: string
          created_at: string
          created_by: string | null
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          exam_type: Database["public"]["Enums"]["exam_type"]
          explanation: string | null
          id: string
          image_url: string | null
          is_official: boolean
          options: Json | null
          question_content: string
          section: string
          skill_type: string
          updated_at: string
        }
        Insert: {
          correct_answer: string
          created_at?: string
          created_by?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          exam_type: Database["public"]["Enums"]["exam_type"]
          explanation?: string | null
          id?: string
          image_url?: string | null
          is_official?: boolean
          options?: Json | null
          question_content: string
          section: string
          skill_type: string
          updated_at?: string
        }
        Update: {
          correct_answer?: string
          created_at?: string
          created_by?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          exam_type?: Database["public"]["Enums"]["exam_type"]
          explanation?: string | null
          id?: string
          image_url?: string | null
          is_official?: boolean
          options?: Json | null
          question_content?: string
          section?: string
          skill_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_streaks: {
        Row: {
          created_at: string
          current_streak: number
          id: string
          last_activity_date: string | null
          longest_streak: number
          missed_yesterday: boolean
          streak_start_date: string | null
          updated_at: string
          user_id: string
          yesterday_tasks_completed: number
          yesterday_tasks_required: number
        }
        Insert: {
          created_at?: string
          current_streak?: number
          id?: string
          last_activity_date?: string | null
          longest_streak?: number
          missed_yesterday?: boolean
          streak_start_date?: string | null
          updated_at?: string
          user_id: string
          yesterday_tasks_completed?: number
          yesterday_tasks_required?: number
        }
        Update: {
          created_at?: string
          current_streak?: number
          id?: string
          last_activity_date?: string | null
          longest_streak?: number
          missed_yesterday?: boolean
          streak_start_date?: string | null
          updated_at?: string
          user_id?: string
          yesterday_tasks_completed?: number
          yesterday_tasks_required?: number
        }
        Relationships: []
      }
      user_test_attempts: {
        Row: {
          ai_feedback: Json | null
          answers: Json
          completed_at: string | null
          created_at: string
          id: string
          mock_test_id: string
          score: number | null
          started_at: string
          time_spent_seconds: number | null
          total_correct: number
          total_questions: number
          user_id: string
        }
        Insert: {
          ai_feedback?: Json | null
          answers?: Json
          completed_at?: string | null
          created_at?: string
          id?: string
          mock_test_id: string
          score?: number | null
          started_at?: string
          time_spent_seconds?: number | null
          total_correct?: number
          total_questions?: number
          user_id: string
        }
        Update: {
          ai_feedback?: Json | null
          answers?: Json
          completed_at?: string | null
          created_at?: string
          id?: string
          mock_test_id?: string
          score?: number | null
          started_at?: string
          time_spent_seconds?: number | null
          total_correct?: number
          total_questions?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_test_attempts_mock_test_id_fkey"
            columns: ["mock_test_id"]
            isOneToOne: false
            referencedRelation: "mock_tests"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      difficulty_level: "easy" | "medium" | "hard"
      exam_type: "sat" | "ielts" | "olympiad"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      difficulty_level: ["easy", "medium", "hard"],
      exam_type: ["sat", "ielts", "olympiad"],
    },
  },
} as const
