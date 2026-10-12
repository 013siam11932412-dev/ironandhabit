"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

export default function Home() {
  const { dict, language } = useLanguage();

  const quickHighlights = [
    {
      title: dict.workoutTracker,
      icon: (
        <svg
          className="w-4 h-4 text-[#ccff00]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 6h3m12 0h3M3 18h3m12 0h3M6 4v16M18 4v16M9 9h6M9 15h6M9 9v6M15 9v6"
          />
        </svg>
      ),
    },
    {
      title: dict.nutritionPlans,
      icon: (
        <svg
          className="w-4 h-4 text-[#ccff00]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343a7.975 7.975 0 012.344 5.657c0 2.12-.832 4.157-2.343 5.657z"
          />
        </svg>
      ),
    },
    {
      title: dict.dailyHabit,
      icon: (
        <svg
          className="w-4 h-4 text-[#ccff00]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: dict.trackProgress,
      icon: (
        <svg
          className="w-4 h-4 text-[#ccff00]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      ),
    },
  ];

  const featureCards = [
    {
      title: language === "bn" ? "ওয়ার্কআউট ট্র্যাকার" : "Workout Tracker",
      badge: language === "bn" ? "শক্তি ও রিপস" : "STRENGTH & REPS",
      description:
        language === "bn"
          ? "হেভি কম্পাউন্ড সেট লগ করুন, প্রোগ্রেসিভ ওভারলোড ট্র্যাক করুন এবং ভেলোসিটি পরিমাপ করুন।"
          : "Log heavy compound sets, target progressive overload, and measure velocity with seamless rep tracking.",
      image:
        "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80",
      metric: "5x5 @ 315 LBS",
    },
    {
      title: language === "bn" ? "পুষ্টি ও ক্যালরি হাব" : "Nutrition & Calorie Hub",
      badge: language === "bn" ? "ম্যাক্রো ও এনার্জি" : "MACROS & FUEL",
      description:
        language === "bn"
          ? "সঠিক ম্যাক্রো বিন্যাস, ক্যালরি বণ্টন এবং পেশির পুষ্টি পর্যবেক্ষণ করুন।"
          : "Tailor macro distributions, caloric surpluses, and post-workout fuel with surgical nutrition accuracy.",
      image:
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
      metric: "2,750 KCAL / 190G P",
    },
    {
      title: language === "bn" ? "পানি ও অভ্যাসের ধারাবাহিকতা" : "Water & Habit Consistency",
      badge: language === "bn" ? "দৈনিক হাইড্রেশন" : "DAILY HYDRATION",
      description:
        language === "bn"
          ? "ইলেক্ট্রোলাইট ব্যালান্স, দৈনিক পানির কোটা এবং অবিচ্ছিন্ন স্ট্রিক শৃঙ্খলা গড়ে তুলুন।"
          : "Electrolyte pacing, daily water quotas, and unbroken streak psychology built for relentless discipline.",
      image:
        "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=800&q=80",
      metric: "3.8 LITERS TODAY",
    },
    {
      title: language === "bn" ? "স্মার্ট প্রগ্রেস অ্যানালিটিক্স" : "Smart Progress Analytics",
      badge: language === "bn" ? "লাইভ টেলিমেট্রি" : "LIVE TELEMETRY",
      description:
        language === "bn"
          ? "রিয়েল-টাইম ভলিউম চার্ট, শরীর গঠনের পরিবর্তন এবং রিকভারি ডেটা ভিজুয়ালাইজ করুন।"
          : "Real-time volume load curves, body composition trends, and recovery analytics visualized seamlessly.",
      image:
        "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?auto=format&fit=crop&w=800&q=80",
      metric: "+16.4% VOL GROWTH",
    },
  ];

  const brandPartners = ["NIKE", "ROGUE", "MYPROTEIN", "UNDER ARMOUR", "GYMSHARK"];

  return (
    <div className="relative min-h-screen bg-[#07090e] text-[#f9fafb] flex flex-col justify-between overflow-x-hidden selection:bg-[#ccff00] selection:text-black">
      {/* Ambient Lighting & Grid Background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-[#ccff00]/[0.04] blur-[180px] rounded-full" />
        <div className="absolute top-[40%] -right-40 w-[500px] h-[500px] bg-[#a3e635]/[0.03] blur-[170px] rounded-full" />
        <div className="absolute bottom-10 -left-40 w-[450px] h-[450px] bg-[#ccff00]/[0.03] blur-[160px] rounded-full" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(rgba(163, 230, 53, 0.7) 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* 1. Header / Navbar */}
      <header className="relative z-30 w-full border-b border-[rgba(163,230,53,0.12)] bg-[#07090e]/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#121826] border border-[#a3e635]/40 flex items-center justify-center shadow-[0_0_20px_rgba(204,255,0,0.2)] group-hover:border-[#ccff00] group-hover:shadow-[0_0_25px_rgba(204,255,0,0.4)] transition-all">
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

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#94a3b8]">
            <Link
              href="/"
              className="text-white hover:text-[#ccff00] transition-colors"
            >
              {dict.home}
            </Link>
            <Link
              href="#workouts"
              className="hover:text-[#ccff00] transition-colors"
            >
              {dict.workouts}
            </Link>
            <Link
              href="#nutrition"
              className="hover:text-[#ccff00] transition-colors"
            >
              {dict.nutrition}
            </Link>
            <Link
              href="#progress"
              className="hover:text-[#ccff00] transition-colors"
            >
              {dict.progress}
            </Link>
          </nav>

          {/* Language Switcher & Glowing CTA */}
          <div className="flex items-center gap-3 sm:gap-4">
            <LanguageToggle />
            <Link
              href="/login"
              className="hidden sm:inline-block text-xs font-bold uppercase tracking-wider text-[#94a3b8] hover:text-white px-2.5 py-1.5 transition-colors"
            >
              {dict.login}
            </Link>
            <Link
              href="/signup"
              className="relative px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider bg-[#ccff00] hover:bg-[#d8ff33] text-black transition-all duration-200 shadow-[0_0_25px_rgba(204,255,0,0.35)] hover:shadow-[0_0_35px_rgba(204,255,0,0.55)] active:scale-95"
            >
              {dict.joinFree}
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 lg:pt-16 lg:pb-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[rgba(18,24,38,0.85)] border border-[rgba(163,230,53,0.3)] shadow-[0_0_15px_rgba(204,255,0,0.1)] mb-6">
              <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
              <span className="text-xs font-black uppercase tracking-widest text-[#ccff00]">
                {dict.trainSmarter}
              </span>
            </div>

            {/* Big Bold Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight leading-[1.02] mb-6">
              {language === "bn" ? (
                <>
                  প্রতিদিন আরও <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#f1f5f9] to-[#ccff00] drop-shadow-[0_0_40px_rgba(204,255,0,0.25)]">
                    শক্তিশালী
                  </span>
                </>
              ) : (
                <>
                  STRONGER <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#f1f5f9] to-[#ccff00] drop-shadow-[0_0_40px_rgba(204,255,0,0.25)]">
                    EVERY DAY
                  </span>
                </>
              )}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#94a3b8] leading-relaxed max-w-xl mb-8">
              {dict.heroSubtitle}
            </p>

            {/* High-Energy CTA */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-12 w-full sm:w-auto">
              <Link
                href="/signup"
                className="px-8 py-4 rounded-xl text-sm font-black uppercase tracking-wider bg-[#ccff00] hover:bg-[#d8ff33] text-black flex items-center justify-center gap-3 transition-all duration-200 shadow-[0_0_30px_rgba(204,255,0,0.45)] hover:shadow-[0_0_45px_rgba(204,255,0,0.65)] hover:-translate-y-0.5 active:scale-95"
              >
                <span>{dict.startJourney}</span>
                <svg
                  className="w-4 h-4 text-black font-extrabold"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </Link>
              <Link
                href="/dashboard"
                className="px-6 py-4 rounded-xl text-sm font-bold uppercase tracking-wider text-white bg-[rgba(18,24,38,0.7)] hover:bg-[rgba(18,24,38,0.95)] border border-[rgba(163,230,53,0.2)] hover:border-[rgba(204,255,0,0.45)] backdrop-blur-md transition-all text-center"
              >
                {dict.viewDemo}
              </Link>
            </div>

            {/* 4 Quick Icon Highlights Below CTA */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full border-t border-[rgba(163,230,53,0.15)] pt-6">
              {quickHighlights.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 p-2 rounded-lg bg-[rgba(18,24,38,0.45)] border border-[rgba(163,230,53,0.1)] hover:border-[rgba(163,230,53,0.3)] transition-colors"
                >
                  <div className="w-7 h-7 rounded-md bg-[#07090e] border border-[rgba(163,230,53,0.25)] flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </div>
                  <span className="text-xs font-bold text-[#f9fafb] tracking-tight">
                    {item.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Center & Right Column: Hero Visuals & Athlete Imagery */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Ambient Radial Neon Glow Behind Hero Image */}
            <div className="absolute w-[340px] sm:w-[460px] h-[340px] sm:h-[460px] rounded-full bg-gradient-to-tr from-[#ccff00]/25 via-[#a3e635]/15 to-transparent blur-[90px] pointer-events-none" />

            {/* Athlete Hero Image Container */}
            <div className="relative w-full max-w-[420px] aspect-[4/5] rounded-3xl overflow-hidden border-2 border-[rgba(163,230,53,0.3)] shadow-[0_20px_60px_rgba(0,0,0,0.85)] group">
              <Image
                src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80"
                alt="Elite Athlete Hero Conditioning"
                fill
                priority
                unoptimized={true}
                sizes="(max-width: 768px) 100vw, 420px"
                className="w-full h-full object-cover object-top filter contrast-110 brightness-95 group-hover:scale-105 transition-transform duration-700"
              />

              {/* Cinematic Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-transparent to-black/30 opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20" />

              {/* Floating Heart Rate Card (Bottom Left) */}
              <div className="absolute left-4 bottom-5 p-3.5 rounded-2xl bg-[rgba(18,24,38,0.75)] backdrop-blur-xl border border-[rgba(163,230,53,0.35)] shadow-[0_10px_30px_rgba(0,0,0,0.7)] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#07090e] border border-[#ccff00]/40 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-[#ccff00] animate-pulse"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-[#94a3b8]">
                    {dict.peakHeartRate}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black text-white font-mono">
                      128
                    </span>
                    <span className="text-xs font-bold text-[#ccff00]">BPM</span>
                    <svg
                      className="w-12 h-4 text-[#ccff00]"
                      viewBox="0 0 50 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        d="M0 8h12l3-6 5 12 4-9 3 5 4-2h9"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Metric Widgets on Right Side */}
            <div className="hidden sm:flex flex-col gap-3 absolute -right-4 lg:-right-8 top-10 z-20">
              {/* Widget 1: Calories */}
              <div className="p-3.5 rounded-2xl bg-[rgba(18,24,38,0.75)] backdrop-blur-xl border border-[rgba(163,230,53,0.3)] shadow-[0_12px_30px_rgba(0,0,0,0.6)] flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#ccff00]/10 border border-[#ccff00]/30 flex items-center justify-center">
                  <span className="text-sm">🔥</span>
                </div>
                <div>
                  <div className="text-sm font-black text-white font-mono leading-none">
                    2,450
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-[#94a3b8] mt-1">
                    {dict.caloriesBurned}
                  </div>
                </div>
              </div>

              {/* Widget 2: Workouts */}
              <div className="p-3.5 rounded-2xl bg-[rgba(18,24,38,0.75)] backdrop-blur-xl border border-[rgba(163,230,53,0.3)] shadow-[0_12px_30px_rgba(0,0,0,0.6)] flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#ccff00]/10 border border-[#ccff00]/30 flex items-center justify-center">
                  <span className="text-sm">⚡</span>
                </div>
                <div>
                  <div className="text-sm font-black text-white font-mono leading-none">
                    28
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-[#94a3b8] mt-1">
                    {dict.workoutsCompleted}
                  </div>
                </div>
              </div>

              {/* Widget 3: Streak */}
              <div className="p-3.5 rounded-2xl bg-[rgba(18,24,38,0.75)] backdrop-blur-xl border border-[rgba(163,230,53,0.3)] shadow-[0_12px_30px_rgba(0,0,0,0.6)] flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#ccff00]/10 border border-[#ccff00]/30 flex items-center justify-center">
                  <span className="text-sm">🏆</span>
                </div>
                <div>
                  <div className="text-sm font-black text-[#ccff00] font-mono leading-none">
                    14 DAYS
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-[#94a3b8] mt-1">
                    {dict.activeStreak}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Feature Showcase Cards (With Contextual Matching Photography) */}
      <section
        id="workouts"
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 w-full"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#ccff00] mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00]" />
              {dict.performanceSuite}
            </div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
              {dict.engineeredSupremacy}
            </h2>
          </div>
          <p className="text-sm text-[#94a3b8] max-w-md mt-3 md:mt-0">
            {dict.suiteSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureCards.map((card, idx) => (
            <div
              key={idx}
              className="card-neon-glass rounded-2xl overflow-hidden flex flex-col group"
            >
              {/* Card Photography */}
              <div className="relative w-full aspect-[16/11] overflow-hidden">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  unoptimized={true}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 filter contrast-105 brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(18,24,38,0.95)] via-transparent to-black/20" />

                {/* Neon Category Tag */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#07090e]/85 border border-[#a3e635]/40 text-[10px] font-black uppercase tracking-wider text-[#ccff00] backdrop-blur-sm">
                  {card.badge}
                </div>

                {/* Metric pill */}
                <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-[rgba(18,24,38,0.85)] border border-[rgba(163,230,53,0.2)] text-[10px] font-mono font-bold text-white">
                  {card.metric}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2 group-hover:text-[#ccff00] transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-[#94a3b8] leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-[rgba(163,230,53,0.12)] flex items-center justify-between">
                  <span className="text-[11px] font-bold text-white group-hover:text-[#ccff00] transition-colors">
                    {dict.exploreModule}
                  </span>
                  <svg
                    className="w-4 h-4 text-[#ccff00] transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Footer Trust Badges (Brand Ticker) & Minimal Footer */}
      <footer className="relative z-10 border-t border-[rgba(163,230,53,0.15)] bg-[#07090e]/95 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          {/* Brand Partner Ticker */}
          <div className="w-full text-center mb-10">
            <p className="text-[11px] font-black uppercase tracking-[0.25em] text-[#94a3b8]/60 mb-6">
              COMPATIBLE ECOSYSTEM & ATHLETIC STANDARDS
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 md:gap-20">
              {brandPartners.map((brand, i) => (
                <span
                  key={i}
                  className="text-base sm:text-lg font-black tracking-widest text-[#94a3b8]/40 hover:text-[#ccff00] transition-colors duration-200 cursor-default"
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="w-full pt-8 border-t border-[rgba(163,230,53,0.08)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#94a3b8]/70">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ccff00]" />
              <span className="font-bold text-white">IRON & HABIT</span>
              <span>&mdash; STRONGER EVERY DAY.</span>
            </div>
            <div>
              &copy; 2026 IRON & HABIT Inc. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
