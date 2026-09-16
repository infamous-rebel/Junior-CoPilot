'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageCircle, Heart, Star, Award } from 'lucide-react';

export type MascotMood = 'idle' | 'happy' | 'thinking' | 'excited' | 'supportive' | 'quiz';

interface MascotHubProps {
  mood?: MascotMood;
  speechText?: string;
  studentName?: string;
  onTapMascot?: () => void;
}

export default function MascotHub({
  mood = 'idle',
  speechText = "Hey Alex! Ready to see what we learned in school today?",
  studentName = "Alex",
  onTapMascot
}: MascotHubProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [tapCount, setTapCount] = useState(0);

  const handleTap = () => {
    setTapCount((prev) => prev + 1);
    if (onTapMascot) onTapMascot();
  };

  // Dynamic eye expressions
  const getEyeComponent = () => {
    switch (mood) {
      case 'happy':
      case 'excited':
        return (
          <div className="flex justify-between w-12 px-1">
            <span className="text-xl font-bold text-slate-800">^</span>
            <span className="text-xl font-bold text-slate-800">^</span>
          </div>
        );
      case 'thinking':
        return (
          <div className="flex justify-between w-12 px-1">
            <span className="text-base font-bold text-slate-800">o</span>
            <span className="text-base font-bold text-slate-800">?</span>
          </div>
        );
      case 'supportive':
        return (
          <div className="flex justify-between w-12 px-1">
            <span className="text-base font-bold text-rose-600">♥</span>
            <span className="text-base font-bold text-rose-600">♥</span>
          </div>
        );
      default:
        return (
          <div className="flex justify-between w-12 px-1">
            <div className="w-3.5 h-3.5 rounded-full bg-slate-900 animate-pulse"></div>
            <div className="w-3.5 h-3.5 rounded-full bg-slate-900 animate-pulse"></div>
          </div>
        );
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center py-4">
      {/* Speech Bubble Container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={speechText}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="relative mb-6 max-w-md w-full px-6 py-4 bg-white/95 rounded-3xl shadow-xl border-4 border-amber-300 text-center glass-card-kids"
        >
          <div className="flex items-center justify-center gap-2 mb-1 text-amber-600 font-fredoka font-semibold text-sm">
            <Sparkles className="w-4 h-4 fill-amber-400" />
            <span>Chip your AI Learning Buddy</span>
          </div>
          <p className="font-fredoka text-lg sm:text-xl font-medium text-slate-800 leading-snug">
            "{speechText}"
          </p>
          
          {/* Speech Bubble Tail */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white rotate-45 border-r-4 border-b-4 border-amber-300"></div>
        </motion.div>
      </AnimatePresence>

      {/* Mascot Vector Robot Character */}
      <motion.div
        whileHover={{ scale: 1.08, rotate: [0, -3, 3, 0] }}
        whileTap={{ scale: 0.92 }}
        onClick={handleTap}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="relative cursor-pointer select-none group"
      >
        {/* Floating Halo Stars */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -inset-6 rounded-full border-2 border-dashed border-amber-300/60 opacity-60 pointer-events-none"
        ></motion.div>

        {/* Mascot Body Container */}
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-linear-to-b from-sky-300 via-amber-300 to-teal-300 p-2.5 shadow-2xl shadow-sky-300/30">
          <div className="w-full h-full bg-linear-to-b from-sky-400 to-sky-500 rounded-full flex flex-col items-center justify-center relative overflow-hidden border-4 border-white shadow-inner">
            
            {/* Robot Antenna */}
            <div className="absolute top-1 flex flex-col items-center">
              <motion.div 
                animate={{ scale: [1, 1.3, 1] }} 
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-4 h-4 rounded-full bg-amber-400 border-2 border-white shadow-md shadow-amber-400"
              ></motion.div>
              <div className="w-1 h-3 bg-slate-200"></div>
            </div>

            {/* Robot Head Screen Face */}
            <div className="w-24 h-16 sm:w-28 sm:h-20 bg-amber-100 rounded-2xl border-4 border-slate-800 flex flex-col items-center justify-center p-2 mt-4 shadow-md relative">
              {/* Eyes */}
              <div className="flex items-center justify-center mb-1">
                {getEyeComponent()}
              </div>

              {/* Mouth */}
              <div className="w-8 h-2 bg-slate-800 rounded-full mt-1 overflow-hidden relative">
                {mood === 'happy' || mood === 'excited' ? (
                  <div className="w-4 h-2 bg-rose-400 rounded-full mx-auto mt-0.5"></div>
                ) : null}
              </div>

              {/* Cheeks */}
              <div className="absolute left-2 bottom-2 w-3 h-2 rounded-full bg-rose-300/70"></div>
              <div className="absolute right-2 bottom-2 w-3 h-2 rounded-full bg-rose-300/70"></div>
            </div>

            {/* Mascot Chest Badge */}
            <div className="mt-2 flex items-center gap-1 px-3 py-0.5 rounded-full bg-slate-900/30 text-white text-[11px] font-fredoka font-bold">
              <Star className="w-3 h-3 text-amber-300 fill-amber-300" />
              <span>G1–G5 Buddy</span>
            </div>
          </div>
        </div>

        {/* Tap Counter / Reaction Badge */}
        {tapCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 bg-amber-400 text-slate-950 text-xs font-bold px-2.5 py-1 rounded-full border-2 border-white shadow-lg flex items-center gap-1"
          >
            <Award className="w-3.5 h-3.5 text-slate-900" />
            <span>High Five!</span>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
