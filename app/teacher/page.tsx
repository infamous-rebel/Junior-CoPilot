'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import TeacherLogModal from '../../components/TeacherLogModal';
import { INITIAL_CLASSES, INITIAL_DAILY_INPUTS } from '../../lib/mock-data';
import { ClassRoom, DailyInput } from '../../lib/types';
import { getSavedDailyInputs, processStudentQuery } from '../../lib/copilot-engine';
import { Plus, Calendar, BookOpen, GraduationCap, Clock, Sparkles, CheckCircle2, ChevronDown, Edit3, Play, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TeacherPortalPage() {
  const [selectedClassId, setSelectedClassId] = useState('cls-g3a');
  const [dailyLogs, setDailyLogs] = useState<DailyInput[]>(INITIAL_DAILY_INPUTS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Live Grounded Simulator State
  const [simQuery, setSimQuery] = useState("What did we learn today in Math?");
  const [simResponse, setSimResponse] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    const loaded = getSavedDailyInputs(selectedClassId, INITIAL_DAILY_INPUTS);
    setDailyLogs(loaded);
  }, [selectedClassId]);

  const handleSimulateQuery = async () => {
    setIsSimulating(true);
    const res = await processStudentQuery(
      { classId: selectedClassId, gradeLevel: 3, query: simQuery },
      dailyLogs
    );
    setSimResponse(res.answer);
    setIsSimulating(false);
  };

  const handleLogSaved = (newLog: DailyInput) => {
    setDailyLogs((prev) => [newLog, ...prev]);
  };

  const handleDeleteLog = (id: string) => {
    setDailyLogs((prev) => prev.filter((l) => l.id !== id));
  };

  const selectedClass = INITIAL_CLASSES.find((c) => c.id === selectedClassId) || INITIAL_CLASSES[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-inter">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:py-8 space-y-6">
        
        {/* Header Bar */}
        <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400 text-xl font-bold">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-fredoka text-2xl font-bold text-white">
                  Teacher Intake Dashboard
                </h1>
                <span className="text-xs bg-sky-500/20 text-sky-300 px-2.5 py-0.5 rounded-full border border-sky-400/30">
                  Ms. Ramirez
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Log daily topics & homework • Ground your students' AI Copilot in real time
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Class Selector Dropdown */}
            <div className="relative">
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="appearance-none bg-slate-800 text-white text-xs font-bold px-4 py-2.5 pr-8 rounded-2xl border border-slate-700 focus:outline-hidden cursor-pointer"
              >
                {INITIAL_CLASSES.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    Grade {cls.grade_level} - Section {cls.section} ({cls.school_name})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
            </div>

            {/* Quick Add Button */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="py-2.5 px-5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-fredoka font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>+ New Daily Intake Log</span>
            </button>
          </div>
        </div>

        {/* Dashboard Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Recent Log Timeline Panel (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-fredoka text-xl font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-sky-600" />
                <span>Class Intake Timeline (Grade {selectedClass.grade_level}-{selectedClass.section})</span>
              </h2>
              <span className="text-xs font-semibold text-slate-500">
                {dailyLogs.length} Verified Entries
              </span>
            </div>

            {dailyLogs.length === 0 ? (
              <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center text-slate-500 space-y-3">
                <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="font-medium text-sm">No lesson logs submitted for today yet.</p>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2 bg-sky-50 text-sky-700 text-xs font-bold rounded-full border border-sky-200"
                >
                  Create First Intake Log
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {dailyLogs.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3 hover:border-sky-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-fredoka font-bold text-base text-slate-900">
                          {log.subject}
                        </span>
                        <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100">
                          {log.input_date}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDeleteLog(log.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors rounded-lg"
                          title="Delete log"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Topics & Summary:
                      </p>
                      <p className="text-sm text-slate-800 font-medium leading-relaxed">
                        {log.topics_covered}
                      </p>
                    </div>

                    {log.homework_assigned && (
                      <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 font-medium">
                        <span className="font-bold">Assigned Homework: </span>
                        {log.homework_assigned}
                      </div>
                    )}

                    {log.has_upcoming_test && (
                      <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 text-xs text-rose-900 font-medium flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-rose-500 shrink-0" />
                        <span><strong>Test Scheduled: </strong>{log.test_details}</span>
                      </div>
                    )}

                    {log.vocabulary_tags && log.vocabulary_tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {log.vocabulary_tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-semibold"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Copilot Grounded Simulator Side Panel (1 Col) */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-fredoka font-bold text-lg pb-3 border-b border-slate-100">
                <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400" />
                <span>Copilot Grounded Response Simulator</span>
              </div>

              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Test how the AI Copilot will answer student queries using your logged teacher context.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Simulate Student Query:
                </label>
                <input
                  type="text"
                  value={simQuery}
                  onChange={(e) => setSimQuery(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-medium focus:border-sky-500 focus:outline-hidden"
                />
              </div>

              {/* Preset Query Buttons */}
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSimQuery("What is the denominator?")}
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-[11px] font-bold text-slate-700"
                >
                  Math Denominator
                </button>
                <button
                  onClick={() => setSimQuery("Give me the answer to Q1")}
                  className="px-2.5 py-1 rounded-full bg-amber-100 hover:bg-amber-200 text-[11px] font-bold text-amber-900"
                >
                  Homework Answer Request
                </button>
                <button
                  onClick={() => setSimQuery("What is photosyntheis?")}
                  className="px-2.5 py-1 rounded-full bg-sky-100 hover:bg-sky-200 text-[11px] font-bold text-sky-900"
                >
                  Science Query
                </button>
              </div>

              <button
                onClick={handleSimulateQuery}
                disabled={isSimulating}
                className="w-full py-3 rounded-2xl bg-slate-900 text-white font-fredoka font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
              >
                <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Run Grounded AI Inference</span>
              </button>

              {/* Output Box */}
              {simResponse && (
                <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200 text-xs space-y-2">
                  <div className="flex items-center gap-1.5 text-sky-800 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-sky-600" />
                    <span>Copilot Grounded Answer</span>
                  </div>
                  <p className="text-slate-800 font-medium leading-relaxed">
                    "{simResponse}"
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
              🔒 Zero-Hallucination Bound: Unmentioned topics strictly yield fallback redirect.
            </div>
          </div>

        </div>

      </main>

      {/* Teacher Log Intake Modal */}
      <TeacherLogModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onLogSaved={handleLogSaved}
        classId={selectedClassId}
        gradeLevel={selectedClass.grade_level}
      />
    </div>
  );
}
