export type GradeLevel = 1 | 2 | 3 | 4 | 5;

export type SubjectName = 'Math' | 'Science' | 'English' | 'Social Studies' | 'Art' | 'General';

export interface ClassRoom {
  id: string;
  grade_level: GradeLevel;
  section: string;
  teacher_name: string;
  school_name: string;
}

export interface DailyInput {
  id: string;
  class_id: string;
  input_date: string; // YYYY-MM-DD
  subject: SubjectName;
  topics_covered: string;
  homework_assigned: string;
  has_upcoming_test: boolean;
  test_details?: string;
  vocabulary_tags?: string[];
  created_at?: string;
}

export interface QuizOption {
  id: string; // 'a', 'b', 'c', 'd'
  text: string;
}

export interface MicroQuizQuestion {
  id: string;
  daily_input_id: string;
  subject: SubjectName;
  question: string;
  options: QuizOption[];
  correct_option_id: string;
  hint_text: string;
  explanation: string;
  difficulty_level: 'easy' | 'medium' | 'hard';
}

export interface StudentAttempt {
  id: string;
  student_id: string;
  quiz_id: string;
  selected_option_id: string;
  is_correct: boolean;
  attempted_at: string;
}

export interface CopilotQueryRequest {
  studentId?: string;
  classId: string;
  gradeLevel: GradeLevel;
  query: string;
  mode?: 'recall' | 'homework_buddy' | 'quiz' | 'general';
}

export interface CopilotResponse {
  answer: string;
  isGrounded: boolean;
  groundedSources: {
    id: string;
    subject: string;
    topics: string;
    homework?: string;
  }[];
  suggestedFollowups?: string[];
  hintsGiven?: string[];
}
