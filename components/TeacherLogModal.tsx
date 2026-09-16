'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Plus, Sparkles, Calendar, CheckCircle2 } from 'lucide-react';
import { DailyInput, SubjectName } from '../lib/types';
import { saveNewTeacherInput } from '../lib/copilot-engine';

interface TeacherLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogSaved: (newLog: DailyInput) => void;
  classId?: string;
  gradeLevel?: number;
}

export default function TeacherLogModal({
  isOpen,
  onClose,
  onLogSaved,
  classId = 'cls-g3a',
  gradeLevel = 3
}: TeacherLogModalProps) {
  const [subject, setSubject] = useState<SubjectName>('Math');
  const [topicsCovered, setTopicsCovered] = useState('');
  const [homeworkAssigned, setHomeworkAssigned] = useState('');
  const [hasTest, setHasTest] = useState(false);
  const [testDetails, setTestDetails] = useState('');
  const [vocabTagInput, setVocabTagInput] = useState('');
  const [vocabTags, setVocabTags] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleAddVocabTag = () => {
    if (vocabTagInput.trim() && !vocabTags.includes(vocabTagInput.trim())) {
      setVocabTags([...vocabTags, vocabTagInput.trim()]);
      setVocabTagInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicsCovered.trim()) return;

    const newLog: DailyInput = {
      id: `log-${Date.now()}`,
      class_id: classId,
      input_date: new Date().toISOString().split('T')[0],
      subject,
      topics_covered: topicsCovered,
      homework_assigned: homeworkAssigned,
      has_upcoming_test: hasTest,
      test_details: hasTest ? testDetails : undefined,
      vocabulary_tags: vocabTags.length > 0 ? vocabTags : undefined,
      created_at: new Date().toISOString()
    };

    saveNewTeacherInput(newLog);
    onLogSaved(newLog);
    onClose();

    // Reset form
    setTopicsCovered('');
    setHomeworkAssigned('');
    setHasTest(false);
    setTestDetails('');
    setVocabTags([]);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-fredoka text-xl font-bold">New Daily Intake Log</h3>
                <p className="text-xs text-slate-400 font-medium">
                  Grade {gradeLevel} Section A • Syncs immediately to Student Copilot
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
            {/* Subject Picker */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                1. Select Subject
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['Math', 'Science', 'English', 'Social Studies'] as SubjectName[]).map((subj) => (
                  <button
                    key={subj}
                    type="button"
                    onClick={() => setSubject(subj)}
                    className={`py-2.5 px-3 rounded-2xl text-xs font-bold transition-all border ${
                      subject === subj
                        ? 'bg-sky-500 text-white border-sky-500 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {subj}
                  </button>
                ))}
              </div>
            </div>

            {/* Topics Covered */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                2. Topics Covered Today (Teacher Context)
              </label>
              <textarea
                value={topicsCovered}
                onChange={(e) => setTopicsCovered(e.target.value)}
                required
                rows={3}
                placeholder="e.g. Introduction to Fractions: Numerator (top part) and Denominator (total equal slices)..."
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 text-sm font-medium focus:outline-hidden"
              />
            </div>

            {/* Homework Assignment */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                3. Assigned Homework & Hint Guidelines
              </label>
              <input
                type="text"
                value={homeworkAssigned}
                onChange={(e) => setHomeworkAssigned(e.target.value)}
                placeholder="e.g. Workbook Page 42, Questions 1-5. Shade 1/2 of shape A..."
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 text-sm font-medium focus:outline-hidden"
              />
            </div>

            {/* Vocabulary Tags */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                4. Key Vocabulary Tags (Optional)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={vocabTagInput}
                  onChange={(e) => setVocabTagInput(e.target.value)}
                  placeholder="Add tag (e.g. Numerator)"
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={handleAddVocabTag}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold hover:bg-slate-200"
                >
                  Add Tag
                </button>
              </div>
              {vocabTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {vocabTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-semibold border border-sky-200"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Test Scheduler */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Upcoming Test Toggle
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={hasTest}
                  onChange={(e) => setHasTest(e.target.checked)}
                  className="w-4 h-4 accent-sky-500 rounded cursor-pointer"
                />
              </div>

              {hasTest && (
                <input
                  type="text"
                  value={testDetails}
                  onChange={(e) => setTestDetails(e.target.value)}
                  placeholder="e.g. Unit Test on Friday, Sep 18th covering Fractions & Division"
                  className="w-full px-3 py-2 mt-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden"
                />
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!topicsCovered.trim()}
              className="w-full py-3.5 px-6 rounded-2xl bg-sky-500 text-white font-fredoka text-base font-bold shadow-md hover:bg-sky-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-5 h-5 text-amber-300 fill-amber-300" />
              <span>Submit & Sync to Copilot Context</span>
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
