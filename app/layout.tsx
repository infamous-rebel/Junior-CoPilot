import type { Metadata } from "next";
import { Fredoka, Inter } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Junior Copilot | Zero-Hallucination AI Learning Companion for Grade 1-5",
  description: "A free, teacher-grounded AI copilot that helps Grade 1-5 students review daily lessons, tackle homework with hints, and practice micro-quizzes safely.",
  keywords: ["Junior Copilot", "Elementary Education", "Teacher Intake", "AI Tutor", "Kids Learning", "Zero Hallucination RAG"],
  authors: [{ name: "Pavel W", url: "mailto:infamousrebelv@gmail.com" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fredoka.variable} ${inter.variable}`}>
      <body className="min-h-screen antialiased bg-[#FAFAEF] text-slate-800 font-inter">
        {children}
      </body>
    </html>
  );
}
