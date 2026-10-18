"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import Footer from "@/components/Footer";

export default function AboutPage() {
  const { language } = useLanguage();
  const isBn = language === "bn";

  return (
    <div className="relative min-h-screen bg-[#07090e] text-[#f9fafb] flex flex-col justify-between overflow-x-hidden selection:bg-[#ccff00] selection:text-black">
      {/* Ambient Lighting & Grid Background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#ccff00]/[0.04] blur-[180px] rounded-full" />
        <div className="absolute top-[40%] -right-40 w-[500px] h-[500px] bg-[#a3e635]/[0.03] blur-[170px] rounded-full" />
      </div>

      {/* Header / Navbar */}
      <header className="relative z-30 w-full border-b border-[rgba(163,230,53,0.12)] bg-[#07090e]/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#121826] border border-[#a3e635]/40 flex items-center justify-center shadow-[0_0_20px_rgba(204,255,0,0.2)] group-hover:border-[#ccff00] transition-all">
              <svg
                className="w-5 h-5 text-[#ccff00]"
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
            <span className="font-black text-xl tracking-wider text-white">
              IRON <span className="text-[#ccff00]">&</span> HABIT
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs font-bold text-[#94a3b8] hover:text-[#ccff00] uppercase tracking-wider transition-colors"
            >
              ← {isBn ? "হোমপেজ" : "Home"}
            </Link>
            <Link
              href="/dashboard"
              className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider bg-[#121826] border border-[#a3e635]/40 text-[#ccff00] hover:border-[#ccff00] transition-all"
            >
              {isBn ? "ড্যাশবোর্ড" : "Dashboard"} &rarr;
            </Link>
            <LanguageToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 w-full flex-1">
        {/* Page Badge & Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[rgba(18,24,38,0.85)] border border-[rgba(163,230,53,0.3)] shadow-[0_0_15px_rgba(204,255,0,0.1)] mb-6">
            <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest text-[#ccff00]">
              {isBn ? "আমাদের পরিচয় ও লক্ষ্য" : "About Iron & Habit"}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white mb-6">
            {isBn ? (
              <>
                বাস্তব শক্তি এবং <span className="text-[#ccff00]">শৃঙ্খলার অভ্যাস</span>
              </>
            ) : (
              <>
                Building Real Strength & <span className="text-[#ccff00]">Daily Discipline</span>
              </>
            )}
          </h1>

          <p className="text-base sm:text-lg text-[#94a3b8] leading-relaxed">
            {isBn
              ? "Iron & Habit একটি সৎ, কার্যকর এবং স্পষ্ট ফিটনেস প্ল্যাটফর্ম, যা মানুষের আসল শক্তি (Iron) ও শৃঙ্খলাবদ্ধ দৈনিক রুটিন (Habit) গড়ে তুলতে সাহায্য করে।"
              : "Iron & Habit is a genuine, effective, and clear fitness platform that helps people build real strength (Iron) and a disciplined daily routine (Habit)."}
          </p>

          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[rgba(18,24,38,0.7)] border border-[rgba(163,230,53,0.2)] text-xs text-[#94a3b8]">
            <span className="text-white font-bold">{isBn ? "উদ্যোক্তা ও পরিচালক:" : "Owner & Creator:"}</span>
            <span className="text-[#ccff00] font-black uppercase tracking-wider">MD SIAM</span>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Card 1: Visual Learning */}
          <div className="card-neon-glass p-8 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#07090e] border border-[#a3e635]/30 flex items-center justify-center text-[#ccff00] mb-6">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-black uppercase tracking-tight text-white mb-3">
                {isBn ? "২-ধাপের ভিজ্যুয়াল গাইড" : "Two-Step Visual Guides"}
              </h2>
              <p className="text-sm text-[#94a3b8] leading-relaxed">
                {isBn
                  ? "প্রতিটি ব্যায়ামে রয়েছে স্পষ্ট দ্বি-পর্যায়ের ভিজ্যুয়াল গাইড, যা ব্যবহারকারীদের সঠিক অঙ্গভঙ্গি ও মুভমেন্ট প্যাটার্ন শিখতে সহায়তা করে।"
                  : "Each exercise has a clear two-step visual guide that helps people learn correct form."}
              </p>
            </div>
          </div>

          {/* Card 2: Environment Versatility */}
          <div className="card-neon-glass p-8 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#07090e] border border-[#a3e635]/30 flex items-center justify-center text-[#ccff00] mb-6">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-black uppercase tracking-tight text-white mb-3">
                {isBn ? "বাসা ও জিম — উভয়ের জন্য" : "Home & Gym Training"}
              </h2>
              <p className="text-sm text-[#94a3b8] leading-relaxed">
                {isBn
                  ? "এটি বাসায় কোনো সরঞ্জাম ছাড়া শরীরের ওজনে ক্যালিস্তেনিক্স এবং জিমে বারবেল, ডাম্বেল ও মেশিনের মাধ্যমে ভারী অনুশীলন — উভয়ের জন্যই সমানভাবে কাজ করে।"
                  : "It works for both home (bodyweight/calisthenics, no equipment) and gym (barbells, dumbbells, machines)."}
              </p>
            </div>
          </div>
        </div>

        {/* Training Tiers by Level */}
        <div className="card-neon-glass p-8 sm:p-10 rounded-3xl mb-16">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-black uppercase tracking-widest text-[#ccff00] block mb-2">
              {isBn ? "প্রশিক্ষণ স্তর" : "Structured Progression"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
              {isBn ? "দক্ষতা অনুসারে ব্যায়ামের বিভাজন" : "Exercises Separated by Level"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Beginner */}
            <div className="p-6 rounded-2xl bg-[rgba(7,9,14,0.6)] border border-[rgba(163,230,53,0.15)] flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-[#38bdf8] uppercase tracking-wider block mb-2">
                  LEVEL 01
                </span>
                <h3 className="text-lg font-black uppercase text-white mb-2">
                  {isBn ? "শিক্ষানবিস (Beginner)" : "Beginner"}
                </h3>
                <p className="text-xs text-[#94a3b8] leading-relaxed mb-4">
                  {isBn
                    ? "নিরাপদ ও মৌলিক নড়াচড়া যেমন ওয়াল/নী পুশ-আপ এবং গোবলেট স্কোয়াট।"
                    : "Safe foundational movements like wall/knee push-ups and goblet squats."}
                </p>
              </div>
              <div className="text-[11px] font-mono text-[#ccff00]/80">
                {isBn ? "ফোকাস: ফর্ম ও ভিত্তি" : "Focus: Form & Base"}
              </div>
            </div>

            {/* Intermediate */}
            <div className="p-6 rounded-2xl bg-[rgba(7,9,14,0.6)] border border-[rgba(163,230,53,0.25)] flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-[#ccff00] uppercase tracking-wider block mb-2">
                  LEVEL 02
                </span>
                <h3 className="text-lg font-black uppercase text-white mb-2">
                  {isBn ? "মধ্যম (Intermediate)" : "Intermediate"}
                </h3>
                <p className="text-xs text-[#94a3b8] leading-relaxed mb-4">
                  {isBn
                    ? "নিয়ন্ত্রিত রেজিস্ট্যান্স মুভমেন্ট যেমন বারবেল স্কোয়াট এবং রিভার্স লাঞ্জেস।"
                    : "Progressive movements like barbell squats and reverse lunges."}
                </p>
              </div>
              <div className="text-[11px] font-mono text-[#ccff00]/80">
                {isBn ? "ফোকাস: শক্তি ও ভলিউম" : "Focus: Strength & Volume"}
              </div>
            </div>

            {/* Advanced */}
            <div className="p-6 rounded-2xl bg-[rgba(7,9,14,0.6)] border border-[rgba(163,230,53,0.15)] flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-[#f59e0b] uppercase tracking-wider block mb-2">
                  LEVEL 03
                </span>
                <h3 className="text-lg font-black uppercase text-white mb-2">
                  {isBn ? "অগ্রসর (Advanced)" : "Advanced"}
                </h3>
                <p className="text-xs text-[#94a3b8] leading-relaxed mb-4">
                  {isBn
                    ? "উচ্চ দক্ষতার যৌগিক ব্যায়াম যেমন বার্পিজ এবং অলিম্পিক ডেডলিফট।"
                    : "High-intensity compound challenges like burpees and Olympic deadlifts."}
                </p>
              </div>
              <div className="text-[11px] font-mono text-[#ccff00]/80">
                {isBn ? "ফোকাস: পিক অ্যাথলেটিক আউটপুট" : "Focus: Peak Athletic Output"}
              </div>
            </div>
          </div>
        </div>

        {/* Philosophy: No Fake Stats */}
        <div className="card-neon-glass p-8 sm:p-10 rounded-3xl border border-[rgba(163,230,53,0.3)] bg-gradient-to-br from-[rgba(18,24,38,0.85)] to-[rgba(7,9,14,0.95)]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#ccff00]/10 border border-[#ccff00]/30 flex items-center justify-center text-[#ccff00] shrink-0 font-bold">
              ✓
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-white">
              {isBn ? "বাস্তব ধারাবাহিকতা — কোনো কৃত্রিম চালাকি ছাড়া" : "Authentic Habits Without Marketing Tricks"}
            </h2>
          </div>
          <p className="text-sm text-[#94a3b8] leading-relaxed mb-4">
            {isBn
              ? "এই অ্যাপের মূল লক্ষ্য হলো মানুষের মধ্যে বাস্তব অভ্যাস ও ধারাবাহিকতা গড়ে তোলা। এখানে কোনো ভুয়া পরিসংখ্যান, কৃত্রিম হার্ট রেট সেন্সর ডেটা বা বিজ্ঞাপনী কৌশল নেই।"
              : "The app aims to build real habits and consistency, without fake stats or marketing tricks. We feature no fabricated metrics, no simulated sensor telemetry, and no deceptive vanity counters."}
          </p>
          <p className="text-xs text-[#94a3b8]/70 italic">
            {isBn
              ? "সাধারণ নির্দেশিকা মাত্র, চিকিৎসা পরামর্শ নয়।"
              : "General guidance only, not medical advice."}
          </p>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
