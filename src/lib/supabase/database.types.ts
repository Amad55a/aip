export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type CurriculumTranslation = {
  title?: string;
  description?: string | null;
  short_description?: string | null;
};

export type LessonStudyMaterialTranslation = {
  introduction: string;
  explanation: string;
  example: string;
  codeExample: {
    title: string;
    language: string;
    code: string;
    explanation: string;
  };
  useCases: string[];
  mistakes: string[];
  tips: string[];
  practice: string[];
};

export type LessonContentTranslation = CurriculumTranslation & {
  content?: string;
  explanation?: string;
  examples?: { title: string; body: string }[];
  code_examples?: {
    title: string;
    language: "html" | "css" | "javascript";
    code: string;
    preview?: boolean;
    explanation?: string;
  }[];
  notes?: string[];
  common_mistakes?: string[];
  practice?: string[];
  quiz_questions?: LessonQuizQuestion[];
  study_material?: LessonStudyMaterialTranslation;
};

export type LearningPath = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  difficulty: string;
  estimated_hours: number;
  thumbnail_url: string | null;
  is_published: boolean;
  translations: Partial<Record<"en" | "so" | "ar", CurriculumTranslation>>;
  created_at: string;
  updated_at: string;
};

export type Course = {
  id: string;
  learning_path_id: string;
  title: string;
  slug: string;
  description: string | null;
  order_index: number;
  is_published: boolean;
  translations: Partial<Record<"en" | "so" | "ar", CurriculumTranslation>>;
  created_at: string;
  updated_at: string;
};

export type Module = {
  id: string;
  course_id: string;
  title: string;
  slug: string;
  description: string | null;
  level: "basic" | "intermediate" | "advanced";
  order_index: number;
  estimated_hours: number;
  is_published: boolean;
  translations: Partial<Record<"en" | "so" | "ar", CurriculumTranslation>>;
  created_at: string;
  updated_at: string;
};

export type Lesson = {
  id: string;
  module_id: string;
  title: string;
  slug: string;
  description: string | null;
  content: string;
  explanation: string;
  examples: { title: string; body: string }[];
  code_examples: {
    title: string;
    language: "html" | "css" | "javascript";
    code: string;
    preview?: boolean;
  }[];
  notes: string[];
  common_mistakes: string[];
  practice: string[];
  quiz_questions: LessonQuizQuestion[];
  translations: Partial<Record<"en" | "so" | "ar", LessonContentTranslation>>;
  lesson_type: "lesson" | "coding" | "quiz" | "project";
  order_index: number;
  estimated_minutes: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type LessonQuizQuestion = {
  id: string;
  type: "multiple_choice" | "true_false" | "short_answer";
  prompt: string;
  options?: string[];
  correctAnswer: string;
  acceptableAnswers?: string[];
  explanation: string;
};

export type Enrollment = {
  id: string;
  user_id: string;
  learning_path_id: string;
  status: "active" | "completed" | "paused";
  started_at: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type LessonProgress = {
  id: string;
  user_id: string;
  lesson_id: string;
  status: "not_started" | "in_progress" | "completed";
  started_at: string | null;
  completed_at: string | null;
  last_accessed_at: string | null;
  quiz_score: number | null;
  created_at: string;
  updated_at: string;
};

export type ProjectCompletion = {
  id: string;
  user_id: string;
  project_id: string;
  completed_at: string;
  created_at: string;
  updated_at: string;
};

export type AIUsage = {
  id: string;
  user_id: string;
  usage_date: string;
  question_count: number;
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      learning_paths: {
        Row: LearningPath;
        Insert: Omit<LearningPath, "id" | "created_at" | "updated_at" | "translations"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
          translations?: LearningPath["translations"];
        };
        Update: Partial<Omit<LearningPath, "id">>;
        Relationships: [];
      };
      courses: {
        Row: Course;
        Insert: Omit<Course, "id" | "created_at" | "updated_at" | "translations"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
          translations?: Course["translations"];
        };
        Update: Partial<Omit<Course, "id">>;
        Relationships: [];
      };
      modules: {
        Row: Module;
        Insert: Omit<Module, "id" | "created_at" | "updated_at" | "translations"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
          translations?: Module["translations"];
        };
        Update: Partial<Omit<Module, "id">>;
        Relationships: [];
      };
      lessons: {
        Row: Lesson;
        Insert: Omit<
          Lesson,
          | "id"
          | "created_at"
          | "updated_at"
          | "explanation"
          | "examples"
          | "code_examples"
          | "notes"
          | "common_mistakes"
          | "practice"
          | "quiz_questions"
          | "translations"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
          explanation?: string;
          examples?: Lesson["examples"];
          code_examples?: Lesson["code_examples"];
          notes?: string[];
          common_mistakes?: string[];
          practice?: string[];
          quiz_questions?: LessonQuizQuestion[];
          translations?: Lesson["translations"];
        };
        Update: Partial<Omit<Lesson, "id">>;
        Relationships: [];
      };
      enrollments: {
        Row: Enrollment;
        Insert: Omit<
          Enrollment,
          "id" | "created_at" | "updated_at" | "started_at" | "completed_at"
        > & {
          id?: string;
          started_at?: string;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Enrollment, "id">>;
        Relationships: [];
      };
      lesson_progress: {
        Row: LessonProgress;
        Insert: Omit<
          LessonProgress,
          | "id"
          | "created_at"
          | "updated_at"
          | "started_at"
          | "completed_at"
          | "last_accessed_at"
          | "quiz_score"
        > & {
          id?: string;
          started_at?: string | null;
          completed_at?: string | null;
          last_accessed_at?: string | null;
          quiz_score?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<LessonProgress, "id">>;
        Relationships: [];
      };
      project_completions: {
        Row: ProjectCompletion;
        Insert: Omit<ProjectCompletion, "id" | "completed_at" | "created_at" | "updated_at"> & {
          id?: string;
          completed_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<ProjectCompletion, "id">>;
        Relationships: [];
      };
      ai_usage: {
        Row: AIUsage;
        Insert: Omit<AIUsage, "id" | "created_at" | "updated_at" | "usage_date" | "question_count"> & {
          id?: string;
          usage_date?: string;
          question_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<AIUsage, "id">>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_ai_usage: {
        Args: { p_daily_limit: number };
        Returns: {
          usage_date: string;
          question_count: number;
          daily_limit: number;
          remaining_count: number;
        }[];
      };
      reserve_ai_question: {
        Args: {
          p_daily_limit: number;
          p_request_id: string;
          p_context_type: string;
          p_language: string;
        };
        Returns: {
          request_id: string | null;
          usage_date: string;
          question_count: number;
          daily_limit: number;
          remaining_count: number;
          allowed: boolean;
        }[];
      };
      finalize_ai_request: {
        Args: {
          p_request_id: string;
          p_status: string;
          p_provider: string | null;
          p_model: string | null;
          p_error_code: string | null;
          p_response_time_ms: number;
          p_attempts: Json;
        };
        Returns: boolean;
      };
      get_learning_path_progress: {
        Args: { p_learning_path_id: string };
        Returns: {
          total_lessons: number;
          completed_lessons: number;
        }[];
      };
      search_learning_content: {
        Args: { p_query: string; p_language: string };
        Returns: {
          id: string;
          result_type: string;
          title: string;
          description: string;
          href: string;
          context: string;
          used_english_fallback: boolean;
        }[];
      };
    };
    Enums: Record<string, never>;
  };
};
