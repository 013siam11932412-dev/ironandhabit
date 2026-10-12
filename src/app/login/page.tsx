"use client";

import Link from "next/link";
import LanguageToggle from "@/components/LanguageToggle";
import AuthForm from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen bg-[#07090e] text-[#f9fafb] flex flex-col items-center justify-center p-4 selection:bg-[#ccff00] selection:text-black">
      {/* Top Bar with Language Toggle and Return Home */}
      <div className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between p-4 sm:p-6 max-w-7xl mx-auto w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#94a3b8] hover:text-[#ccff00] transition-colors"
        >
          <span>←</span>
          <span>HOME</span>
        </Link>
        <LanguageToggle />
      </div>

      {/* Ambient Neon Lighting */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#ccff00]/[0.05] blur-[160px] rounded-full" />
        <div className="absolute bottom-10 -right-20 w-[400px] h-[400px] bg-[#a3e635]/[0.03] blur-[150px] rounded-full" />
      </div>

      {/* Main Centered Card */}
      <div className="relative z-10 w-full max-w-md my-16">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-[#121826] border border-[#a3e635]/40 flex items-center justify-center shadow-[0_0_20px_rgba(204,255,0,0.2)] group-hover:border-[#ccff00] group-hover:shadow-[0_0_25px_rgba(204,255,0,0.4)] transition-all">
              <svg
                className="w-6 h-6 text-[#ccff00]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <span className="font-black text-2xl tracking-wider text-white">
              IRON <span className="text-[#ccff00]">&</span> HABIT
            </span>
          </Link>
          <p className="text-xs uppercase tracking-[0.2em] text-[#94a3b8] font-bold mt-2">
            ATHLETIC DISCIPLINE PORTAL
          </p>
        </div>

        {/* Card Surface */}
        <div className="bg-[rgba(18,24,38,0.7)] backdrop-blur-md border border-[rgba(163,230,53,0.2)] rounded-2xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
          <AuthForm initialTab="signin" />
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-[#94a3b8]/60">
          &copy; 2026 IRON & HABIT Inc. All rights reserved.
        </div>
      </div>
    </div>
  );
}
