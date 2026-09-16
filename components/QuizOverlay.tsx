'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, Star, Lightbulb, CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MicroQuizQuestion } from '../lib/types';

interface QuizOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  questions: MicroQuizQuestion[];
  onAddPoints?: (pts: number) => void;
}

export default function QuizOverlay({
  isOpen,
  onClose,
  questions,
  onAddPoints
}: QuizOverlayProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  if (!isOpen || questions.length === 0) return null;

  const currentQ = questions[currentIndex];

  const handleSelectOption = (optionId: string) => {
    if (isAnswered) return;
    setSelectedOption(optionId);
    setIsAnswered(true);

    const isCorrect = optionId === currentQ.correct_option_id;
    if (isCorrect) {
      setScore((prev) => prev + 10);
      if (onAddPoints) onAddPoints(10);
      // Trigger confetti celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowHint(false);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowHint(false);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: 30 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden flex flex-col"
        >
          {/* Top Bar */}
          <div className="bg-linear-to-r from-amber-400 via-yellow-400 to-amber-500 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-slate-950 fill-slate-900" />
              <span className="font-fredoka text-lg font-bold text-slate-950">
                Pop Quiz Time!
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-amber-900 shadow-xs">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                <span>Score: {score} pts</span>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-slate-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {!quizFinished ? (
            <div className="p-6">
              {/* Question Progress Dots */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <div className="flex gap-1.5">
                  {questions.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-2 rounded-full transition-all ${
                        idx === currentIndex
                          ? 'w-6 bg-amber-400'
                          : idx < currentIndex
                          ? 'w-2 bg-emerald-400'
                          : 'w-2 bg-slate-200'
                      }`}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Subject Tag */}
              <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 mb-3">
                {currentQ.subject}
              </div>

              {/* Question Text */}
              <h3 className="font-fredoka text-xl font-bold text-slate-900 mb-6 leading-snug">
                {currentQ.question}
              </h3>

              {/* Hint Box Toggle */}
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mb-4 p-3 bg-amber-50 border-2 border-amber-200 rounded-2xl text-xs font-medium text-amber-900 flex items-start gap-2"
                >
                  <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Chip's Clue: </span>
                    {currentQ.hint_text}
                  </div>
                </motion.div>
              )}

              {/* Options Stack */}
              <div className="space-y-3 mb-6">
                {currentQ.options.map((opt) => {
                  const isSelected = selectedOption === opt.id;
                  const isCorrectOpt = opt.id === currentQ.correct_option_id;

                  let optionStyle = 'bg-slate-50 border-2 border-slate-200 text-slate-800 hover:border-amber-400';
                  if (isAnswered) {
                    if (isCorrectOpt) {
                      optionStyle = 'bg-emerald-100 border-2 border-emerald-500 text-emerald-950 font-bold';
                    } else if (isSelected && !isCorrectOpt) {
                      optionStyle = 'bg-rose-100 border-2 border-rose-400 text-rose-950';
                    } else {
                      optionStyle = 'bg-slate-50 border-slate-200 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      disabled={isAnswered}
                      className={`w-full p-4 rounded-2xl text-left font-fredoka text-base transition-all flex items-center justify-between ${optionStyle}`}
                    >
                      <span>{opt.text}</span>
                      {isAnswered && isCorrectOpt && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100 shrink-0" />
                      )}
                      {isAnswered && isSelected && !isCorrectOpt && (
                        <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback & Action Controls */}
              {isAnswered ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div
                    className={`p-4 rounded-2xl text-sm font-medium ${
                      selectedOption === currentQ.correct_option_id
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                        : 'bg-rose-50 text-rose-900 border border-rose-200'
                    }`}
                  >
                    <p className="font-bold font-fredoka text-base mb-1">
                      {selectedOption === currentQ.correct_option_id
                        ? '🎉 Perfect Answer!'
                        : 'Almost there!'}
                    </p>
                    <p>{currentQ.explanation}</p>
                  </div>

                  <button
                    onClick={handleNextQuestion}
                    className="w-full btn-kids-yellow py-3 text-base flex items-center justify-center gap-2"
                  >
                    <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </motion.div>
              ) : (
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 px-3.5 py-2 rounded-full transition-colors"
                  >
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <span>{showHint ? 'Hide Hint' : 'Need a Hint?'}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Quiz Completion Summary Screen */
            <div className="p-8 text-center space-y-6">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner">
                🏆
              </div>

              <div>
                <h3 className="font-fredoka text-2xl font-bold text-slate-900 mb-2">
                  Quiz Completed!
                </h3>
                <p className="text-slate-600 font-medium">
                  You earned <span className="font-bold text-amber-600">{score} Star Points</span> today!
                </p>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={handleRestart}
                  className="btn-kids-blue px-6 py-3 text-sm flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Try Again</span>
                </button>

                <button
                  onClick={onClose}
                  className="btn-kids-yellow px-6 py-3 text-sm"
                >
                  Awesome!
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
