# 🌟 Junior Copilot

> **An Encouraging, Friendly, and Safe Zero-Hallucination AI Learning Companion for Grade 1–5 Students & Teachers.**

[![Next.js](https://img.shields.io/badge/Next.js-14%2B-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-13.4-purple?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?style=for-the-badge&logo=postgresql)](https://supabase.com/)

---

## 📌 Executive Summary & System Philosophy

**Junior Copilot** is a low-latency, zero-hallucination educational Copilot designed specifically for elementary school students (Grade 1 through Grade 5) and their teachers. 

The platform operates on a **closed-loop Retrieval-Augmented Generation (RAG) architecture**. It constrains the AI engine to ground its answers **exclusively** on verified daily inputs provided by teachers, completely mitigating hallucinations, blocking adult or off-topic queries, and ensuring high-stakes educational reliability.

```
+-----------------------------------------------------------------------+
|                            FRONTEND TIER                              |
|  [ Next.js 14 App Router | Tailwind CSS | Framer Motion | Canvas-Confetti ]
+-------------------+-------------------------------+-------------------+
                    |                               |
          REST / Client Sync                    REST API
                    |                               |
+-------------------v-------------------------------+-------------------+
|                            BACKEND TIER                               |
|       [ Node.js API Gateway | RAG Grounding Engine ]                 |
+-------------------+-------------------------------+-------------------+
                    |                               |
            Vector / SQL Queries            Inference API
                    |                               |
+-------------------v-------------------+  +--------v-------------------+
|           DATA TIER                   |  |      INFERENCE TIER        |
|  [ Supabase PostgreSQL + pgvector ]   |  |  [ Groq / Gemini API ]     |
|  [ Local Storage Fallback Cache ]     |  +----------------------------+
+---------------------------------------+
```

---

## ✨ Key Features & User Portals

### 1. 🎒 Kids Portal (`/kids`)
- **Interactive Animated Mascot ("Chip"):** A live vector robot companion with reactive expressions (`idle`, `happy`, `thinking`, `excited`, `supportive`), speech bubbles, and interactive tap high-fives (+5 star bonus).
- **📖 What Did We Learn Today?** Triggers an instant, age-appropriate vocal/text recap of verified daily teacher logs for Math, Science, and English.
- **✏️ Homework Buddy:** Step-by-step hint tutor. When a child asks for homework answers, Copilot breaks down the problem into small clues and guiding questions—**NEVER revealing direct answers**.
- **🎯 Pop Quiz Time!** Gamified 1-minute micro-quizzes with immediate confetti celebrations, hints, star points tracking (`⭐️ 120`), and clear explanations.

### 2. 🎓 Teacher Intake Portal (`/teacher`)
- **Classroom Selector:** Switch between Grade 1 to 5 sections (`Grade 3 - Section A`).
- **Multi-Step Daily Intake Logger:** Submit topics covered, vocabulary tags, homework instructions with hint flags, and upcoming test schedules in under 60 seconds.
- **Intake Timeline & History:** View, edit, or delete recent daily submissions.
- **Live Copilot Grounded Simulator:** Real-time side panel letting teachers test how the AI will answer student questions based on their submitted lesson notes.

### 3. 🌐 Official Landing Page & Interactive Sandbox (`/`)
- **Hero Section:** Clear positioning ("Bridging the Classroom and Home for Young Learners") with role CTA buttons.
- **4-Step E2E Workflow Diagram:** Visual breakdown of Teacher Input ➔ Strict Grounding ➔ Guided Review ➔ Micro-Assessment.
- **Features Grid:** Highlighting the Zero-Hallucination Guarantee, Gamified Micro-Quizzes, and Child-Safe UX (no ads, no web search).
- **Interactive Sandbox Simulator:** Try live queries on sample teacher data right from the homepage.

---

## 🔒 Strict AI Safety & Zero-Hallucination Rules

1. **Zero Hallucination Bound:** If a student asks about something not present in today's verified teacher data, Copilot responds:
   > *"Hmm, your teacher didn't add that to today's list! Check with them tomorrow."*
2. **Hint-Based Tutoring:** If a student requests direct homework solutions (*"Give me the answer to Q1"*), Copilot provides step-by-step hints and asks guiding questions.
3. **Short & Age-Appropriate:** Keeps responses under **3 short sentences** using simple, encouraging vocabulary appropriate for Grade 1–5.
4. **Child Safety:** Automatically filters off-topic or adult subjects and gently redirects back to school review.

---

## 🛠 Tech Stack

| Tier | Technologies |
| :--- | :--- |
| **Framework** | Next.js 14 (App Router, Turbopack, React 19) |
| **Language** | TypeScript (Strict Mode) |
| **Styling** | Tailwind CSS v4, Glassmorphism, Custom Theme Tokens |
| **Animations** | Framer Motion, Canvas Confetti |
| **Icons** | Lucide React |
| **AI / RAG** | Closed-Loop Grounding Engine, Groq API / Gemini API support |
| **Database** | PostgreSQL / Supabase with `pgvector` & Row-Level Security |

---

## 🗄 Production Database Schema (`schema.sql`)

```sql
-- Enable Vector Extension for RAG Context Matching
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. Class Roster
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
    subject VARCHAR(50) NOT NULL,
    topics_covered TEXT NOT NULL,
    homework_assigned TEXT,
    has_upcoming_test BOOLEAN DEFAULT FALSE,
    test_details TEXT,
    embedding vector(1536),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Micro-Quizzes
CREATE TABLE micro_quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    daily_input_id UUID REFERENCES daily_inputs(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_option_id VARCHAR(10) NOT NULL,
    hint_text TEXT NOT NULL,
    explanation TEXT NOT NULL,
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
```

---

## 🚀 Future Specifications & Full Production Roadmap

```
+---------------------------------------------------------------------------+
|                          PRODUCTION ROADMAP                               |
|                                                                           |
|  [ Phase 1: Core Grounding & Dashboards ] -------------> (COMPLETED ✅)   |
|  [ Phase 2: Voice Mascot & TTS/STT ] ------------------> (Q4 2026 🔜)    |
|  [ Phase 3: Automated Quiz Generation via Fine-Tuning ]  (Q1 2027 🔮)    |
|  [ Phase 4: Parent Weekly Digest & Offline PWA Sync ] -> (Q2 2027 🔮)    |
+---------------------------------------------------------------------------+
```

### Phase 2: Voice-to-Voice Mascot Interaction (Q4 2026)
- **Web Speech API / ElevenLabs Integration:** Allow Grade 1–2 students who are still learning to read/type to speak directly to Chip the Copilot.
- **Real-Time Mascot Lip Sync:** Animate Chip's mouth in sync with audio playback.

### Phase 3: Autonomous Quiz Auto-Generation (Q1 2027)
- **LLM Question Synthesizer:** Automatically parse teacher daily summaries and generate 3 difficulty tiers of multiple-choice questions with hints and explanations.
- **Teacher Review Queue:** Allow teachers to approve or tweak auto-generated questions before they push to students.

### Phase 4: Parent Portal & Offline PWA (Q2 2027)
- **Parent Weekly Progress Reports:** Automated SMS/Email summaries detailing student quiz accuracy, star milestones, and homework completion.
- **Offline PWA Sync:** Cache lesson notes locally so students without continuous internet access can review lessons offline.

---

## 💻 Local Development Guide

### Prerequisites
- Node.js 18.0 or higher
- npm, pnpm, or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/infamous-rebel/Junior-CoPilot.git
cd Junior-CoPilot
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 📤 How to Push to GitHub

Follow these step-by-step terminal commands to push this project to your GitHub repository:

```bash
# 1. Initialize Git (if not already initialized)
git init

# 2. Add all project files
git add .

# 3. Create initial commit
git commit -m "feat: complete Junior Copilot E2E platform implementation"

# 4. Set main branch name
git branch -M main

# 5. Add your remote GitHub repository
git remote add origin https://github.com/infamous-rebel/Junior-CoPilot.git

# 6. Push code to GitHub
git push -u origin main
```

*(Note: If the remote repository already contains files, run `git push -u origin main --force` on first push).*

---

## 👨‍💻 Architect & Developer Credit

Designed, Engineered, and Maintained with ❤️ by:

- **Architect & Developer:** **Pavel W**
- **Contact Email:** [infamousrebelv@gmail.com](mailto:infamousrebelv@gmail.com)
- **GitHub:** [@infamous-rebel](https://github.com/infamous-rebel)

---

*Junior Copilot — Empowering young minds through safe, grounded, and joyful AI learning.*
