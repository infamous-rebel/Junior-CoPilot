-- Junior Copilot Production Database Schema (PostgreSQL / Supabase)
-- Author: Pavel W
-- Features: Vector Embedding Search, Class Roster, Daily Teacher Inputs, Micro-Quizzes, RLS Policies

-- Enable Vector Extension for RAG Context Matching
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. Schools & Classes Schema
CREATE TABLE IF NOT EXISTS schools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    grade_level INT NOT NULL CHECK (grade_level BETWEEN 1 AND 5),
    section VARCHAR(20) NOT NULL,
    teacher_id UUID NOT NULL,
    teacher_name VARCHAR(255) DEFAULT 'Ms. Ramirez',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Daily Teacher Inputs (Lessons & Homework Log Engine)
CREATE TABLE IF NOT EXISTS daily_inputs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    input_date DATE NOT NULL DEFAULT CURRENT_DATE,
    subject VARCHAR(50) NOT NULL, -- Math, Science, English, Social Studies
    topics_covered TEXT NOT NULL,  -- Summary of what was taught today
    homework_assigned TEXT,        -- Homework instructions & hint guidelines
    has_upcoming_test BOOLEAN DEFAULT FALSE,
    test_details TEXT,             -- Date and topic of upcoming test
    embedding vector(1536),        -- Supports semantic search retrieval
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Gamified Micro-Quizzes Table
CREATE TABLE IF NOT EXISTS micro_quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    daily_input_id UUID REFERENCES daily_inputs(id) ON DELETE CASCADE,
    subject VARCHAR(50) NOT NULL,
    question TEXT NOT NULL,
    options JSONB NOT NULL,        -- Format: [{"id": "a", "text": "..."}, ...]
    correct_option_id VARCHAR(10) NOT NULL,
    hint_text TEXT NOT NULL,
    explanation TEXT NOT NULL,     -- Simple explanation suitable for Grade 1-5
    difficulty_level VARCHAR(20) DEFAULT 'easy',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Student Quiz Responses & Analytics
CREATE TABLE IF NOT EXISTS student_quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL,
    quiz_id UUID REFERENCES micro_quizzes(id) ON DELETE CASCADE,
    selected_option_id VARCHAR(10) NOT NULL,
    is_correct BOOLEAN NOT NULL,
    attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row-Level Security (RLS) Policies
ALTER TABLE daily_inputs ENABLE ROW LEVEL SECURITY;
ALTER TABLE micro_quizzes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to class daily inputs" 
ON daily_inputs FOR SELECT USING (true);

CREATE POLICY "Allow public read access to class micro quizzes" 
ON micro_quizzes FOR SELECT USING (true);
