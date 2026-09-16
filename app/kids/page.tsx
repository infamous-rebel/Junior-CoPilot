'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import MascotHub, { MascotMood } from '../../components/MascotHub';
import HomeworkBuddyModal from '../../components/HomeworkBuddyModal';
import QuizOverlay from '../../components/QuizOverlay';
import { INITIAL_DAILY_INPUTS, INITIAL_QUIZZES } from '../../lib/mock-data';
import { DailyInput, GradeLevel, MicroQuizQuestion } from '../../lib/types';
import { getSavedDailyInputs, processStudentQuery } from '../../lib/copilot-engine';
import { BookOpen, Sparkles, Star, Lightbulb, Trophy, Calendar, CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function KidsPortalPage() {
  const [gradeLevel, setGradeLevel] = useState<GradeLevel>(3);
  const [dailyInputs, setDailyInputs] = useState<DailyInput[]>(INITIAL_DAILY_INPUTS);
  const [quizzes, setQuizzes] = useState<MicroQuizQuestion[]>(INITIAL_QUIZZES);
  const [starPoints, setStarPoints] = useState(120);
  
  // Mascot state
  const [mascotMood, setMascotMood] = useState<MascotMood>('idle');
  const [speechText, setSpeechText] = useState("Hey Alex! Ready to see what we learned in school today?");

  // Modals
  const [isHomeworkOpen, setIsHomeworkOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [dailySummaryText, setDailySummaryText] = useState<string | null>(null);

  useEffect(() => {
    const loaded = getSavedDailyInputs('cls-g3a', INITIAL_DAILY_INPUTS);
    setDailyInputs(loaded);
  }, []);

  const handleLearnToday = async () => {
    setMascotMood('excited');
    setSpeechText("Let's recall our lessons! Today in Grade 3 we did Math Fractions and Science Plants!");

    const res = await processStudentQuery(
      { classId: 'cls-g3a', gradeLevel, query: 'What did we learn today?' },
      dailyInputs
    );
    setDailySummaryText(res.answer);
  };

  const handleOpenHomeworkBuddy = () => {
    setMascotMood('thinking');
    setSpeechText("Need a clue for your homework? I'll give you step-by-step hints!");
    setIsHomeworkOpen(true);
  };

  const handleOpenQuiz = () => {
    setMascotMood('happy');
    setSpeechText("Pop Quiz time! Let's score some awesome star points! 🌟");
    setIsQuizOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAFAEF] flex flex-col font-inter">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 sm:py-8 space-y-8">
        
        {/* Top Header Bar with Grade Selector & Star Counter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-3xl shadow-xs border-2 border-amber-100 glass-card-kids">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 flex items-center justify-center font-fredoka font-bold text-slate-900 text-xl shadow-sm">
              🎒
            </div>
            <div>
              <h1 className="font-fredoka text-2xl font-bold text-slate-900">
                Welcome back, Alex!
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Grade 3 - Section A • Sunshine Elementary
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Grade Switcher */}
            <div className="flex items-center gap-1 bg-amber-50 p-1 rounded-2xl border border-amber-200">
              {([1, 2, 3, 4, 5] as GradeLevel[]).map((g) => (
                <button
                  key={g}
                  onClick={() => setGradeLevel(g)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    gradeLevel === g
                      ? 'bg-amber-400 text-slate-950 shadow-xs scale-105'
                      : 'text-amber-800 hover:bg-amber-100'
                  }`}
                >
                  G{g}
                </button>
              ))}
            </div>

            {/* Star Points Progress Badge */}
            <div className="flex items-center gap-1.5 bg-linear-to-r from-amber-400 to-yellow-400 text-slate-950 px-4 py-2 rounded-full font-fredoka font-bold text-sm shadow-sm border border-amber-300">
              <Star className="w-4 h-4 fill-slate-950 text-slate-950" />
              <span>⭐️ {starPoints} Stars</span>
            </div>
          </div>
        </div>

        {/* Mascot Hub Section */}
        <div className="bg-linear-to-b from-sky-100/60 to-amber-50/60 p-6 sm:p-10 rounded-3xl border-4 border-white shadow-xl relative overflow-hidden">
          <MascotHub
            mood={mascotMood}
            speechText={speechText}
            studentName="Alex"
            onTapMascot={() => {
              setStarPoints((prev) => prev + 5);
              setMascotMood('excited');
              setSpeechText("High Five! You gained +5 bonus Star Points!");
            }}
          />
        </div>

        {/* Daily Recap Summary Box (If triggered) */}
        {dailySummaryText && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-linear-to-r from-sky-50 to-teal-50 border-3 border-sky-200 rounded-3xl shadow-sm text-slate-800"
          >
            <div className="flex items-center gap-2 mb-2 text-sky-700 font-fredoka font-bold text-lg">
              <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400" />
              <span>Today's Verified Classroom Summary</span>
            </div>
            <p className="font-medium text-base leading-relaxed text-slate-700">
              {dailySummaryText}
            </p>
          </motion.div>
        )}

        {/* Core Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: What Did We Learn Today? */}
          <motion.div
            whileHover={{ y: -6 }}
            className="glass-card-kids p-6 rounded-3xl border-3 border-amber-200 flex flex-col justify-between space-y-4 hover:shadow-2xl transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-400/30 flex items-center justify-center text-3xl mb-2">
              📖
            </div>
            <div>
              <h3 className="font-fredoka text-xl font-bold text-slate-900 mb-1">
                What Did We Learn Today?
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Review verified teacher notes for Math, Science & English taught in class today.
              </p>
            </div>
            <button
              onClick={handleLearnToday}
              className="btn-kids-yellow w-full py-3 text-sm flex items-center justify-center gap-2"
            >
              <span>Recall Today's Lesson</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Card 2: Homework Buddy */}
          <motion.div
            whileHover={{ y: -6 }}
            className="glass-card-kids p-6 rounded-3xl border-3 border-sky-200 flex flex-col justify-between space-y-4 hover:shadow-2xl transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-sky-400/30 flex items-center justify-center text-3xl mb-2">
              ✏️
            </div>
            <div>
              <h3 className="font-fredoka text-xl font-bold text-slate-900 mb-1">
                Homework Buddy
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Stuck on a problem? Get step-by-step hints and clues without revealing answers.
              </p>
            </div>
            <button
              onClick={handleOpenHomeworkBuddy}
              className="btn-kids-blue w-full py-3 text-sm flex items-center justify-center gap-2"
            >
              <span>Ask for Hints</span>
              <Lightbulb className="w-4 h-4 text-amber-300 fill-amber-300" />
            </button>
          </motion.div>

          {/* Card 3: Pop Quiz Time */}
          <motion.div
            whileHover={{ y: -6 }}
            className="glass-card-kids p-6 rounded-3xl border-3 border-teal-200 flex flex-col justify-between space-y-4 hover:shadow-2xl transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-teal-400/30 flex items-center justify-center text-3xl mb-2">
              🎯
            </div>
            <div>
              <h3 className="font-fredoka text-xl font-bold text-slate-900 mb-1">
                Pop Quiz Time!
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Take a 1-minute gamified micro-quiz on today's topics and earn Star Points!
              </p>
            </div>
            <button
              onClick={handleOpenQuiz}
              className="btn-kids-mint w-full py-3 text-sm flex items-center justify-center gap-2"
            >
              <span>Start 1-Min Quiz</span>
              <Trophy className="w-4 h-4 text-amber-300" />
            </button>
          </motion.div>

        </div>

        {/* Today's Subjects List & Test Schedule Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lessons Stream */}
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-fredoka text-lg font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-sky-500" />
                <span>Today's Verified Classroom Logs</span>
              </h3>
              <span className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full">
                {dailyInputs.length} Subjects Logged
              </span>
            </div>

            <div className="space-y-3">
              {dailyInputs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70 hover:bg-amber-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-fredoka font-bold text-sm text-slate-900">
                      {log.subject}
                    </span>
                    <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                      Teacher Verified
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium line-clamp-2 mb-2">
                    {log.topics_covered}
                  </p>
                  {log.homework_assigned && (
                    <div className="text-[11px] font-semibold text-sky-800 bg-sky-50 p-2 rounded-xl border border-sky-100 flex items-start gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-sky-500 shrink-0 mt-0.5" />
                      <span>Homework: {log.homework_assigned}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Test Schedule Box */}
          <div className="bg-linear-to-br from-amber-400 to-yellow-400 p-6 rounded-3xl text-slate-950 shadow-lg flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-950 font-fredoka font-bold text-lg">
                <Calendar className="w-5 h-5" />
                <span>Upcoming Tests</span>
              </div>
              <p className="text-xs font-medium text-slate-800">
                Check upcoming test dates announced by your teacher.
              </p>

              <div className="mt-4 p-4 bg-white/90 rounded-2xl backdrop-blur-md space-y-2 border border-white/60">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900">
                  Math Test Alert
                </span>
                <p className="font-fredoka font-bold text-sm text-slate-900">
                  Fractions & Basic Division Quick Test
                </p>
                <div className="text-xs font-semibold text-slate-600">
                  🗓️ Scheduled for Friday, Sep 18th
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-950 text-white rounded-2xl text-xs font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Tip: Practice Pop Quizzes to prepare for Friday!</span>
            </div>
          </div>
        </div>

      </main>

      {/* Modals */}
      <HomeworkBuddyModal
        isOpen={isHomeworkOpen}
        onClose={() => setIsHomeworkOpen(false)}
        dailyInputs={dailyInputs}
        gradeLevel={gradeLevel}
      />

      <QuizOverlay
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        questions={quizzes}
        onAddPoints={(pts) => setStarPoints((prev) => prev + pts)}
      />
    </div>
  );
}
