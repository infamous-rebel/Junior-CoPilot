-- 1. Class Roster / Meta Table
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grade_level INT NOT NULL CHECK (grade_level BETWEEN 1 AND 5),
    section VARCHAR(10) NOT NULL,
    teacher_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Daily Teacher Inputs (Lessons & Homework)
CREATE TABLE daily_inputs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    input_date DATE NOT NULL DEFAULT CURRENT_DATE,
    subject VARCHAR(50) NOT NULL, -- e.g., Math, Science, English
    topics_covered TEXT NOT NULL,  -- Summary of what was taught today
    homework_assigned TEXT,        -- Homework instructions
    has_upcoming_test BOOLEAN DEFAULT FALSE,
    test_details TEXT,             -- Date and topic of upcoming test
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Generated Micro-Quizzes
CREATE TABLE micro_quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    daily_input_id UUID REFERENCES daily_inputs(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options JSONB,                -- e.g., ["Option A", "Option B", "Option C"]
    correct_answer TEXT NOT NULL,
    explanation TEXT,             -- Simple explanation for the child
    difficulty_level VARCHAR(20) DEFAULT 'easy'
);

-- 4. Student Quiz Responses
CREATE TABLE student_quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL,
    quiz_id UUID REFERENCES micro_quizzes(id) ON DELETE CASCADE,
    student_answer TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);