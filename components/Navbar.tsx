'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, GraduationCap, Smile, Code2, BookOpen } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 border-b border-amber-100/60 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Branding */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-400 to-sky-400 p-0.5 shadow-md group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-fredoka text-xl font-bold bg-gradient-to-r from-amber-600 via-sky-600 to-teal-600 bg-clip-text text-transparent">
                Junior Copilot
              </span>
              <span className="text-[10px] font-medium tracking-wide text-slate-500 uppercase -mt-1">
                Grade 1–5 AI Companion
              </span>
            </div>
          </Link>

          {/* Role Navigation Pills */}
          <nav className="flex items-center gap-1.5 sm:gap-2 bg-slate-100/80 p-1.5 rounded-full border border-slate-200/60">
            <Link
              href="/"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                pathname === '/'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">Overview</span>
            </Link>

            <Link
              href="/kids"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                pathname === '/kids'
                  ? 'bg-amber-400 text-slate-950 shadow-sm scale-105'
                  : 'text-amber-800 hover:bg-amber-100/80'
              }`}
            >
              <Smile className="w-4 h-4 text-amber-900" />
              <span>Kids Portal</span>
            </Link>

            <Link
              href="/teacher"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                pathname === '/teacher'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-200/80'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-sky-400" />
              <span>Teacher Portal</span>
            </Link>

            <Link
              href="/#sandbox-demo"
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all text-teal-700 hover:bg-teal-50`}
            >
              <Code2 className="w-3.5 h-3.5 text-teal-600" />
              <span>Sandbox Demo</span>
            </Link>
          </nav>

          {/* Quick Info & Attribution Tag */}
          <div className="hidden lg:flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Zero-Hallucination RAG Active
            </span>
          </div>

        </div>
      </div>
    </header>
  );
}
