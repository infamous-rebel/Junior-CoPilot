## E2E Product Architecture & Implementation Blueprint: Junior Copilot

### Executive Summary & System Philosophy

Junior Copilot is a low-latency, zero-hallucination educational Copilot designed for Grade 1–5 students. The platform operates on a closed-loop Retrieval-Augmented Generation (RAG) architecture. It constrains the AI engine to ground its answers exclusively on verified daily inputs provided by teachers, mitigating hallucinations and ensuring high-stakes educational reliability.

  

## 1. System Architecture & Tech Stack

```
+-----------------------------------------------------------------------+
|                            FRONTEND TIER                              |
|  [ Next.js 14 App Router | Tailwind CSS | Framer Motion | Rive ]       |
+-------------------+-------------------------------+-------------------+
                    |                               |
          REST / WebSockets                    REST API
                    |                               |
+-------------------v-------------------------------+-------------------+
|                            BACKEND TIER                               |
|       [ Node.js / Express API Gateway | Supabase Auth ]              |
+-------------------+-------------------------------+-------------------+
                    |                               |
            Vector / SQL Queries            Inference API
                    |                               |
+-------------------v-------------------+  +--------v-------------------+
|           DATA TIER                   |  |      INFERENCE TIER        |
|  [ Supabase PostgreSQL + pgvector ]   |  |  [ Groq / Gemini API ]     |
|  [ Redis Cache (Upstash) ]            |  +----------------------------+
+---------------------------------------+

```

-   **Frontend Framework:** Next.js 14 (App Router, Server Components) + TypeScript.
    
      
    
-   **Styling & Animation:** Tailwind CSS, Framer Motion (page transitions, UI micro-interactions), Rive (interactive vector mascot animations).
    
      
    
-   **Backend & Database:** Supabase (PostgreSQL with `pgvector` enabled, Row-Level Security, Edge Functions).
    
      
    
-   **AI Orchestration & RAG:** LangChain / LlamaIndex Node.js SDK for prompt assembly and semantic search over daily teacher inputs.
    
      
    
-   **LLM Engine:** Groq API (`llama-3.3-70b-versatile`) or Google Gemini 1.5 Flash via AI Studio for low-latency, zero-cost / low-cost inference.
    
      
    
-   **State & Caching:** Upstash Redis for session state, API rate limiting, and quiz state tracking.
    
      
    

## 2. End-to-End User Experience & Interface Design Direction

### Visual Design System

-   **Typography:** Rounded, highly legible typefaces (_Fredoka_ or _Outfit_ for Headings; _Inter_ for readable Body copy).
    
      
    
-   **Color Palette:**
    
      
    -   **Kids Portal:** Playful primary tones — Sunflower Yellow (`#FFC72C`), Sky Blue (`#00A8E8`), Soft Mint (`#2EC4B6`), Coral Orange (`#FF6B6B`), over a warm off-white background (`#FAFAEF`).
        
          
        
    -   **Teacher Portal:** Professional slate and navy — Deep Indigo (`#1E1E38`), Slate Blue (`#4A4E69`), Muted Teal (`#2A9D8F`), Light Background (`#F8FAFC`).
        
          
        
-   **Motion & Animation Spec:**
    
      
    -   **Micro-Interactions:** Buttons inflate slightly on hover (`scale: 1.05`), with elastic feedback on click.
        
          
        
    -   **Interactive Mascot:** A live Rive vector mascot stays present on screen. It blinks when idle, gets excited when a child answers correctly, and offers supportive nudges when a child struggles.
        
          
        
    -   **Page Transitions:** Staggered slide-in cards using Framer Motion (`type: "spring", stiffness: 260, damping: 20`).
        
          
        

### Dashboard Mockups & Wireframe Architecture

#### A. Teacher Portal Dashboard

-   **Header Bar:** Class Selector Dropdown (`Grade 3 - Section A`), Date Navigator, Quick Add Button (`+ New Daily Intake`).
    
      
    
-   **Main Intake Canvas:**
    
      
    -   Multi-step daily logging form:
        
          
        1.  **Subject Picker** (Math, Science, English, Social Studies).
            
              
            
        2.  **Topics Covered** (Rich-text summary + key vocabulary tags).
            
              
            
        3.  **Homework Assignment** (Description, due date, hint flags for Copilot).
            
              
            
        4.  **Test Scheduler** (Upcoming test toggle, coverage items).
            
              
            
-   **Intake Stream (History Panel):** Vertical timeline of recent logs with editing privileges and a "Generate Quiz Preview" trigger.
    
      
    

```
+-----------------------------------------------------------------------+
| [LOGO] Junior Copilot - Teacher  | Class: Grade 3-A  | Profile (Ms. R) |
+-----------------------------------------------------------------------+
|                                                                       |
|  +--------------------------------+  +-----------------------------+  |
|  |  Daily Lesson & Intake Log     |  | Recent Log Timeline         |  |
|  |                                |  |                             |  |
|  |  [ Subject: Math          v ]  |  | [Today] Fractions Intro     |  |
|  |  [ Topics Covered           ]  |  |  - 3 Homework Tasks         |  |
|  |  [ Homework Assignment      ]  |  |  - Test: Fri, Sep 18        |  |
|  |  [ Test Toggle: ON          ]  |  |                             |  |
|  |                                |  | [Yesterday] Plant Lifecycle |  |
|  |  [ Submit & Sync to Copilot ]  |  |                             |  |
|  +--------------------------------+  +-----------------------------+  |
+-----------------------------------------------------------------------+

```

#### B. Kids Portal Dashboard

-   **Hero Section (Interactive Mascot Hub):** Centered mascot greeting the student by name: _"Hey Alex! Ready to see what we learned in school today?"_
    
      
    
-   **Core Action Cards (Large, Accessible Tap Targets):**
    
      
    -   **"What Did We Learn Today?"** (Triggers vocal/text summary of the daily log).
        
          
        
    -   **"Homework Buddy"** (Opens step-by-step hint-based homework assistant).
        
          
        
    -   **"Pop Quiz Time!"** (Launches gamified micro-quiz).
        
          
        
-   **Interactive Quiz Overlay:** Card-swiping interface with immediate visual sound/particle feedback upon selecting options.
    
      
    

```
+-----------------------------------------------------------------------+
| (Avatar) Hi Alex!                          [ Progress Badge: ⭐️ 120 ]  |
+-----------------------------------------------------------------------+
|                                                                       |
|                     +---------------------------+                     |
|                     |    [ Animated Mascot ]    |                     |
|                     | "What are we doing today?"|                     |
|                     +---------------------------+                     |
|                                                                       |
|  +--------------------+   +--------------------+   +---------------+  |
|  |  📖 What We        |   |  ✏️ Homework        |   |  🎯 Quick     |  |
|  |     Learned Today  |   |     Buddy          |   |     Quiz      |  |
|  +--------------------+   +--------------------+   +---------------+  |
+-----------------------------------------------------------------------+

```

## 3. Production Database Schema (PostgreSQL / Supabase)

SQL

```
-- Enable Vector Extension for RAG Context Matching
CREATE EXTENSION IF NOT EXISTS vector;

-- Schools & Classes Schema
CREATE TABLE schools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    grade_level INT NOT NULL CHECK (grade_level BETWEEN 1 AND 5),
    section VARCHAR(20) NOT NULL,
    teacher_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily Teacher Log Engine
CREATE TABLE daily_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    subject VARCHAR(100) NOT NULL,
    topics_summary TEXT NOT NULL,
    homework_details TEXT,
    has_test BOOLEAN DEFAULT FALSE,
    test_details TEXT,
    embedding vector(1536), -- Supports semantic search retrieval
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gamified Micro-Quiz System
CREATE TABLE quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    daily_log_id UUID REFERENCES daily_logs(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL, -- Format: [{"id": "a", "text": "..."}, {"id": "b", "text": "..."}]
    correct_option_id VARCHAR(10) NOT NULL,
    hint_text TEXT NOT NULL,
    explanation TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE student_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL,
    question_id UUID REFERENCES quiz_questions(id) ON DELETE CASCADE,
    selected_option_id VARCHAR(10) NOT NULL,
    is_correct BOOLEAN NOT NULL,
    attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row-Level Security (RLS) Policies
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to class daily logs" 
ON daily_logs FOR SELECT USING (true);

```

## 4. Grounded AI Context Ingestion Engine

### RAG & Prompt Assembly Logic (`lib/copilot-engine.ts`)

TypeScript

```
import { VectorStore } from "@/lib/vector-store";
import { GroqClient } from "@/lib/groq-client";

interface StudentQueryPayload {
  studentId: string;
  classId: string;
  query: string;
  gradeLevel: number;
}

export async function processStudentQuery({
  classId,
  query,
  gradeLevel
}: StudentQueryPayload) {
  // 1. Fetch relevant teacher logs for context grounding
  const todayDate = new Date().toISOString().split("T")[0];
  const logs = await VectorStore.getLogsForClassAndDate(classId, todayDate);

  if (!logs || logs.length === 0) {
    return {
      response: "Your teacher hasn't posted today's lesson notes yet! Check back after school.",
      sources: []
    };
  }

  // 2. Build Zero-Hallucination Prompt Envelope
  const systemPrompt = `
You are "Junior Copilot," a warm, encouraging AI learning buddy for Grade ${gradeLevel} students.

STRICT ACCURACY RULES:
1. Answer ONLY using the Teacher Data provided below.
2. If the answer is not in the Teacher Data, say: "Hmm, your teacher didn't mention that in today's notes! Ask them in class tomorrow."
3. Never give direct homework answers. Offer helpful clues and hints instead.
4. Keep all responses under 3 short sentences. Use simple words suitable for Grade ${gradeLevel}.

[TEACHER DATA START]
${logs.map((l) => `Subject: ${l.subject}\nTopics: ${l.topics_summary}\nHomework: ${l.homework_details}\nTest Info: ${l.test_details}`).join("\n---\n")}
[TEACHER DATA END]
`;

  // 3. Inference Execution via Low-Latency API
  const aiResponse = await GroqClient.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: query }
    ],
    temperature: 0.2 // Low temperature prevents creative drift/hallucination
  });

  return {
    response: aiResponse.choices[0].message.content,
    groundedSources: logs.map(l => l.id)
  };
}

```

## 5. Official Landing Page Architecture & Specifications

### Page Section Layout

1.  **Hero Section:**
    
      
    -   Headline: _"Bridging the Classroom and Home for Young Learners."_
        
          
        
    -   Subheadline: _"A free, teacher-grounded AI copilot that helps Grade 1–5 students review daily lessons, tackle homework with hints, and practice quizzes safely."_
        
          
        
    -   CTA Buttons: `[Launch Teacher Portal]` | `[Student Sign-In]`
        
          
        
2.  **Interactive "How It Works" Diagram (E2E Workflow):**
    
      
    -   **Step 1: Input** — Teacher submits daily topics and homework in under 60 seconds.
        
          
        
    -   **Step 2: Grounding** — System locks AI responses strictly to the teacher's input.
        
          
        
    -   **Step 3: Review** — Students ask Copilot what they learned today and receive guided hints for home study.
        
          
        
    -   **Step 4: Micro-Assessment** — Automated quizzes assess comprehension through interactive games.
        
          
        
3.  **Product Features Grid:**
    
      
    -   _Zero Hallucination Guarantee_ (Teacher-constrained responses).
        
          
        
    -   _Gamified Micro-Quizzes_ (Automatic question generation).
        
          
        
    -   _Child-Safe UX_ (No open web queries, no advertisement tracking).
        
          
        
4.  **Interactive Demo Preview:** A live sandbox preview showing teacher input on the left and immediate Copilot responses on the right.
    
      
    
5.  **Footer:**
    
      
    -   Product Copyright & Legal Disclaimers.
        
          
        
    -   **Architect & Developer Credit:** Designed and Engineered by **Pavel W**.
        
          
        
    -   **Contact Email:** `infamousrebelv@gmail.com`
        
          
        

## 6. Qoder Technical Implementation Checklist

Import this document directly into **Qoder** to execute the build phase.

  

-   [ ] **Phase 1: Database Setup**
    
      
    -   [ ] Execute SQL Schema & Row Level Security (RLS) policies in Supabase.
        
          
        
    -   [ ] Enable `pgvector` extension for vector indexing of daily summaries.
        
          
        
-   [ ] **Phase 2: API Gateway & RAG Integration**
    
      
    -   [ ] Implement `processStudentQuery` prompt wrapper with hallucination bounds.
        
          
        
    -   [ ] Wire up Groq API / Gemini API keys in environment variables.
        
          
        
-   [ ] **Phase 3: Frontend Dashboards**
    
      
    -   [ ] Build Teacher Intake Portal using Next.js App Router forms.
        
          
        
    -   [ ] Build Kids Portal Dashboard using Tailwind CSS & Framer Motion cards.
        
          
        
    -   [ ] Integrate Rive vector animation asset for interactive mascot reactions.
        
          
        
-   [ ] **Phase 4: Landing Page Deployment**
    
      
    -   [ ] Build landing page with hero header, E2E feature breakdown, and developer footer attribution.
        
          
        
-   [ ] **Phase 5: Production Hardening**
    
      
    -   [ ] Verify zero-hallucination fallback logic using test data.
        
          
        
    -   [ ] Deploy production build to Vercel / Cloudflare Pages.
