'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Send, Lightbulb, HelpCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import { CopilotQueryRequest, CopilotResponse, DailyInput } from '../lib/types';
import { processStudentQuery } from '../lib/copilot-engine';

interface HomeworkBuddyModalProps {
  isOpen: boolean;
  onClose: () => void;
  dailyInputs: DailyInput[];
  gradeLevel: 1 | 2 | 3 | 4 | 5;
}

interface ChatMessage {
  id: string;
  sender: 'student' | 'copilot';
  text: string;
  isHint?: boolean;
  sources?: string[];
}

export default function HomeworkBuddyModal({
  isOpen,
  onClose,
  dailyInputs,
  gradeLevel
}: HomeworkBuddyModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'copilot',
      text: "Hi there! I'm your Homework Buddy! What problem or question are we working on today? Remember, I'll give you super helpful hints to guide you!"
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (customText?: string) => {
    const textToSend = customText || inputQuery;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'student',
      text: textToSend
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputQuery('');
    setIsThinking(true);

    try {
      const request: CopilotQueryRequest = {
        classId: 'cls-g3a',
        gradeLevel,
        query: textToSend,
        mode: 'homework_buddy'
      };

      const res: CopilotResponse = await processStudentQuery(request, dailyInputs);

      setTimeout(() => {
        const copilotMsg: ChatMessage = {
          id: `msg-copilot-${Date.now()}`,
          sender: 'copilot',
          text: res.answer,
          isHint: true,
          sources: res.groundedSources.map(s => s.subject)
        };
        setMessages((prev) => [...prev, copilotMsg]);
        setIsThinking(false);
      }, 400);
    } catch (e) {
      setIsThinking(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border-4 border-sky-300 overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="bg-linear-to-r from-sky-400 to-teal-400 p-4 sm:p-5 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40">
                <Lightbulb className="w-6 h-6 text-amber-300 fill-amber-300" />
              </div>
              <div>
                <h3 className="font-fredoka text-xl font-bold">Homework Buddy Hints</h3>
                <p className="text-xs text-sky-100 font-medium">
                  Grade {gradeLevel} Step-by-Step Guided Hints (No Direct Answers!)
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages List */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-sky-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${
                  msg.sender === 'student' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'copilot' && (
                  <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-slate-900 font-bold shrink-0 border-2 border-white shadow-xs">
                    🤖
                  </div>
                )}
                <div
                  className={`max-w-[82%] px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed ${
                    msg.sender === 'student'
                      ? 'bg-sky-500 text-white rounded-br-none shadow-md'
                      : 'bg-white text-slate-800 rounded-bl-none border-2 border-sky-100 shadow-sm'
                  }`}
                >
                  <p>{msg.text}</p>
                  {msg.isHint && (
                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-teal-600">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Grounded Teacher Hint</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="flex gap-2 items-center text-sky-600 text-xs font-semibold p-2">
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-bounce [animation-delay:0.4s]"></span>
                <span>Thinking up a helpful hint...</span>
              </div>
            )}
          </div>

          {/* Quick Hint Starter Buttons */}
          <div className="px-4 py-2 bg-white border-t border-slate-100 flex gap-2 overflow-x-auto">
            <button
              onClick={() => handleSend("I need a hint for my Math homework!")}
              className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 hover:bg-amber-200 shrink-0 transition-colors"
            >
              💡 Hint for Math
            </button>
            <button
              onClick={() => handleSend("Can you explain denominator again?")}
              className="px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 hover:bg-sky-200 shrink-0 transition-colors"
            >
              🍕 What is Denominator?
            </button>
            <button
              onClick={() => handleSend("Give me the direct answer")}
              className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 hover:bg-rose-200 shrink-0 transition-colors"
            >
              🔒 Direct Answer Test
            </button>
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 sm:p-4 bg-white border-t border-sky-100 flex gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask your homework question..."
              className="flex-1 px-4 py-2.5 rounded-full border-2 border-slate-200 focus:border-sky-400 focus:outline-hidden text-sm font-medium"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim()}
              className="btn-kids-blue px-5 py-2.5 text-sm flex items-center gap-1.5 disabled:opacity-50 disabled:pointer-events-none"
            >
              <span>Ask</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
