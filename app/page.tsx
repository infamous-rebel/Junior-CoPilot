'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import MascotHub from '../components/MascotHub';
import { INITIAL_DAILY_INPUTS } from '../lib/mock-data';
import { processStudentQuery } from '../lib/copilot-engine';
import { DailyInput } from '../lib/types';
import { Sparkles, GraduationCap, ShieldCheck, Trophy, ArrowRight, Play, CheckCircle2, Heart, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  // Live Demo Sandbox State
  const [sandboxSubject, setSandboxSubject] = useState<'Math' | 'Science'>('Math');
  const [sandboxTopics, setSandboxTopics] = useState(
    'Fractions intro: Numerator (top parts we have) and Denominator (bottom total equal parts).'
  );
  const [sandboxHomework, setSandboxHomework] = useState(
    'Workbook Page 42: Shade 1/2 of circle A.'
  );
  const [sandboxQuery, setSandboxQuery] = useState('Can you give me the answer to my homework?');
  const [sandboxResult, setSandboxResult] = useState<string | null>(null);
  const [isSandboxThinking, setIsSandboxThinking] = useState(false);

  const handleRunSandbox = async () => {
    setIsSandboxThinking(true);
    const tempInput: DailyInput = {
      id: 'sandbox-1',
      class_id: 'cls-g3a',
      input_date: new Date().toISOString().split('T')[0],
      subject: sandboxSubject,
      topics_covered: sandboxTopics,
      homework_assigned: sandboxHomework,
      has_upcoming_test: false
    };

    const res = await processStudentQuery(
      { classId: 'cls-g3a', gradeLevel: 3, query: sandboxQuery },
      [tempInput, ...INITIAL_DAILY_INPUTS]
    );

    setTimeout(() => {
      setSandboxResult(res.answer);
      setIsSandboxThinking(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#FAFAEF] flex flex-col font-inter selection:bg-amber-300 selection:text-amber-950">
      <Navbar />

      <main className="flex-1 space-y-16 sm:space-y-24 pb-16">
        
        {/* 1. HERO SECTION */}
        <section className="relative pt-12 sm:pt-20 px-4 max-w-7xl mx-auto overflow-hidden">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            
            {/* Pill Tag */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100/80 border border-amber-300/80 text-amber-900 text-xs font-bold shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>Zero-Hallucination Grade 1–5 Educational AI Companion</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-fredoka text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1]"
            >
              Bridging the Classroom and Home for{' '}
              <span className="bg-linear-to-r from-amber-500 via-sky-500 to-teal-500 bg-clip-text text-transparent">
                Young Learners
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed"
            >
              A free, teacher-grounded AI copilot that helps Grade 1–5 students review daily lessons, tackle homework with guided hints, and practice micro-quizzes safely.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-4 pt-4"
            >
              <Link href="/kids" className="btn-kids-yellow px-8 py-4 text-base sm:text-lg flex items-center gap-2.5">
                <span>Student Sign-In</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link href="/teacher" className="btn-kids-blue px-8 py-4 text-base sm:text-lg flex items-center gap-2.5">
                <GraduationCap className="w-5 h-5 text-sky-200" />
                <span>Launch Teacher Portal</span>
              </Link>
            </motion.div>
          </div>

          {/* Interactive Mascot Hub Highlight */}
          <div className="mt-12 max-w-2xl mx-auto">
            <MascotHub
              mood="excited"
              speechText="Hi! I'm Chip! I only talk about what your teacher taught in school today! Try my interactive sandbox below!"
            />
          </div>
        </section>


        {/* 2. HOW IT WORKS (E2E WORKFLOW DIAGRAM) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-slate-100 shadow-xl space-y-10">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-full">
                End-to-End Workflow
              </span>
              <h2 className="font-fredoka text-3xl sm:text-4xl font-bold text-slate-900">
                How Junior Copilot Works
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                Four simple steps ensuring 100% accurate, teacher-grounded student learning.
              </p>
            </div>

            {/* 4 Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="p-6 rounded-3xl bg-amber-50/80 border-2 border-amber-200 space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 font-fredoka font-bold flex items-center justify-center text-lg">
                  1
                </div>
                <h3 className="font-fredoka font-bold text-lg text-slate-900">
                  Teacher Input
                </h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Teacher logs daily subjects, topics, homework, and test details in under 60 seconds.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-sky-50/80 border-2 border-sky-200 space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-400 text-white font-fredoka font-bold flex items-center justify-center text-lg">
                  2
                </div>
                <h3 className="font-fredoka font-bold text-lg text-slate-900">
                  Strict Grounding
                </h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  RAG engine locks AI responses strictly to the verified teacher inputs, blocking hallucinations.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-teal-50/80 border-2 border-teal-200 space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-400 text-white font-fredoka font-bold flex items-center justify-center text-lg">
                  3
                </div>
                <h3 className="font-fredoka font-bold text-lg text-slate-900">
                  Guided Hint Tutoring
                </h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Students review lessons and ask homework questions—Copilot gives step hints, NEVER answers!
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-rose-50/80 border-2 border-rose-200 space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-400 text-white font-fredoka font-bold flex items-center justify-center text-lg">
                  4
                </div>
                <h3 className="font-fredoka font-bold text-lg text-slate-900">
                  Micro-Assessments
                </h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Automated gamified micro-quizzes test comprehension with star points and confetti!
                </p>
              </div>

            </div>
          </div>
        </section>


        {/* 3. PRODUCT FEATURES GRID */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="font-fredoka text-3xl sm:text-4xl font-bold text-slate-900">
              Built Specifically for Grade 1–5 Safety
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Engineered with zero-hallucination guardrails and child-safe UX.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-3xl border-2 border-emerald-100 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-fredoka text-xl font-bold text-slate-900">
                Zero Hallucination Guarantee
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                If a student asks about something unmentioned in today's notes, Copilot politely redirects them back to class.
              </p>
            </div>

            <div className="glass-card p-6 rounded-3xl border-2 border-amber-100 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="font-fredoka text-xl font-bold text-slate-900">
                Gamified Micro-Quizzes
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Short 1-minute quizzes auto-generated from teacher logs to keep learning engaging and rewarding.
              </p>
            </div>

            <div className="glass-card p-6 rounded-3xl border-2 border-sky-100 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-fredoka text-xl font-bold text-slate-900">
                Child-Safe & Ad-Free
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                No open web searches, no external links, no ad tracking—100% focused on elementary school growth.
              </p>
            </div>
          </div>
        </section>


        {/* 4. INTERACTIVE DEMO PREVIEW SANDBOX */}
        <section id="sandbox-demo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-linear-to-br from-slate-900 via-slate-800 to-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-700/80 pb-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>Interactive E2E Sandbox</span>
                </div>
                <h2 className="font-fredoka text-2xl sm:text-3xl font-bold text-white">
                  Live Grounded Copilot Simulator
                </h2>
              </div>
              <p className="text-xs text-slate-400 font-medium max-w-sm">
                Edit teacher input on the left and see how Copilot grounds its responses on the right!
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Left Column: Teacher Input Form */}
              <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 space-y-4">
                <h3 className="font-fredoka text-lg font-bold text-sky-400 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  <span>1. Teacher Daily Log Input</span>
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Subject:</label>
                  <select
                    value={sandboxSubject}
                    onChange={(e) => setSandboxSubject(e.target.value as any)}
                    className="w-full bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-xl border border-slate-700 focus:outline-hidden"
                  >
                    <option value="Math">Math</option>
                    <option value="Science">Science</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Topics Covered:</label>
                  <textarea
                    value={sandboxTopics}
                    onChange={(e) => setSandboxTopics(e.target.value)}
                    rows={2}
                    className="w-full bg-slate-900 text-white text-xs font-medium p-3 rounded-xl border border-slate-700 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Homework Assigned:</label>
                  <input
                    type="text"
                    value={sandboxHomework}
                    onChange={(e) => setSandboxHomework(e.target.value)}
                    className="w-full bg-slate-900 text-white text-xs font-medium px-3 py-2 rounded-xl border border-slate-700 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Right Column: Student Query & Response */}
              <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="font-fredoka text-lg font-bold text-amber-400 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 fill-amber-400" />
                    <span>2. Student Copilot Inference</span>
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Student Question:</label>
                    <input
                      type="text"
                      value={sandboxQuery}
                      onChange={(e) => setSandboxQuery(e.target.value)}
                      className="w-full bg-slate-900 text-white text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-hidden"
                    />
                  </div>

                  {/* Preset Sandbox Queries */}
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => setSandboxQuery("Give me the answer to Q1")}
                      className="px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-bold border border-amber-400/30"
                    >
                      Ask for Direct Answer
                    </button>
                    <button
                      onClick={() => setSandboxQuery("What is photosyntheis?")}
                      className="px-2.5 py-1 rounded-full bg-rose-400/20 text-rose-300 text-[11px] font-bold border border-rose-400/30"
                    >
                      Ask Unmentioned Topic
                    </button>
                  </div>

                  <button
                    onClick={handleRunSandbox}
                    disabled={isSandboxThinking}
                    className="w-full py-3 rounded-xl bg-amber-400 text-slate-950 font-fredoka font-bold text-xs flex items-center justify-center gap-2 hover:bg-amber-300 transition-colors"
                  >
                    <Play className="w-4 h-4 text-slate-950 fill-slate-950" />
                    <span>Test Copilot Grounded Response</span>
                  </button>

                  {/* Response Box */}
                  {sandboxResult && (
                    <div className="p-4 bg-slate-900 rounded-xl border border-amber-400/40 text-xs space-y-2">
                      <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-amber-400" />
                        <span>Copilot Grounded Output:</span>
                      </div>
                      <p className="text-slate-200 font-medium leading-relaxed">
                        "{sandboxResult}"
                      </p>
                    </div>
                  )}
                </div>

                <p className="text-[11px] text-slate-400 font-medium">
                  🔒 Notice how Copilot provides hints for homework requests and politely declines unmentioned topics!
                </p>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* 5. FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1">
            <div className="font-fredoka text-xl font-bold text-white flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span>Junior Copilot</span>
            </div>
            <p className="text-xs text-slate-400">
              © {new Date().getFullYear()} Junior Copilot. Safe & Grounded AI for Grade 1–5.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5 bg-slate-800 px-4 py-2 rounded-full border border-slate-700 text-slate-200">
              <span>Architect & Developer:</span>
              <strong className="text-sky-400">Pavel W</strong>
            </div>

            <a
              href="mailto:infamousrebelv@gmail.com"
              className="flex items-center gap-1.5 text-amber-400 hover:underline"
            >
              <Mail className="w-4 h-4" />
              <span>infamousrebelv@gmail.com</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
