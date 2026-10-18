"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import LanguageToggle from "@/components/LanguageToggle";
import Footer from "@/components/Footer";
import HeroCarousel from "@/components/home/HeroCarousel";

export default function Home() {
  const { dict, language } = useLanguage();
  const { user, openAuthModal, signOut } = useAuth();

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
      title: language === "bn" ? "ওয়ার্কআউট প্ল্যানার" : "Workout Planner",
      badge: language === "bn" ? "শক্তি ও ভলিউম" : "SETS & REPS",
      description:
        language === "bn"
          ? "সেট, রিপস, রেস্ট টাইমার এবং প্রোগ্রেসিভ ওভারলোড সহ বাস্তব ব্যায়াম ট্র্যাকিং।"
          : "Sets, reps, rest timer, and progressive overload with real-time exercise logging.",
      image:
        "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80",
      href: "/dashboard/workouts",
    },
    {
      title: language === "bn" ? "পুষ্টি ও ক্যালরি হাব" : "Nutrition Hub",
      badge: language === "bn" ? "ম্যাক্রো ও এনার্জি" : "MACROS & FUEL",
      description:
        language === "bn"
          ? "সঠিক ম্যাক্রো বিন্যাস (প্রোটিন, কার্ব, ফ্যাট), ক্যালরি এবং লাইভ মিল পারসিস্টেন্স।"
          : "Macro breakdown, calories, and real meal persistence for peak muscle recovery.",
      image:
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
      href: "/dashboard/nutrition",
    },
    {
      title: language === "bn" ? "হাইড্রেশন ও স্ট্রিকস" : "Hydration & Analytics",
      badge: language === "bn" ? "দৈনিক কোটা" : "HYDRATION & STREAKS",
      description:
        language === "bn"
          ? "দৈনিক ২৫০ মিলি ইন্টারভ্যাল, ৭-দিনের অবিচল সাইকেল স্ট্রিক এবং টেলিমেট্রি।"
          : "Daily 250ml intervals, 7-day cyclical streaks, and holistic consistency telemetry.",
      image:
        "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=800&q=80",
      href: "/dashboard",
    },
    {
      title: language === "bn" ? "বিএমআই ও শারীরিক সূচক" : "BMI & Body Composition",
      badge: language === "bn" ? "বডি টেলিমেট্রি" : "BODY TELEMETRY",
      description:
        language === "bn"
          ? "উচ্চতা ও ওজনের অনুপাত, পরিমাপের রেকর্ড এবং বাস্তব ঐতিহাসিক পরিবর্তন।"
          : "Mass-to-height index, circumference logs, and real historical progress metrics.",
      image:
        "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?auto=format&fit=crop&w=800&q=80",
      href: "/dashboard/bmi",
    },
  ];

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
            <a
              href="#how-it-works"
              className="hover:text-[#ccff00] transition-colors"
            >
              {dict.howItWorks}
            </a>
            <Link
              href="/dashboard/workouts"
              className="hover:text-[#ccff00] transition-colors"
            >
              {dict.workouts}
            </Link>
            <Link
              href="/dashboard/nutrition"
              className="hover:text-[#ccff00] transition-colors"
            >
              {dict.nutrition}
            </Link>
            <Link
              href="/dashboard/bmi"
              className="hover:text-[#ccff00] transition-colors"
            >
              {dict.bmi}
            </Link>
          </nav>

          {/* Language Switcher & Glowing CTA / User Badge */}
          <div className="flex items-center gap-3 sm:gap-4">
            <LanguageToggle />
            {user ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  href="/dashboard"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider bg-[#121826] border border-[#a3e635]/40 text-[#ccff00] hover:border-[#ccff00] shadow-[0_0_15px_rgba(204,255,0,0.15)] transition-all"
                >
                  <span>{dict.dashboard}</span>
                  <span>&rarr;</span>
                </Link>

                {/* User Initial / Avatar Badge */}
                <div
                  title={user.email || "Athlete"}
                  className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[rgba(18,24,38,0.9)] border border-[#a3e635]/40 shadow-[0_0_15px_rgba(204,255,0,0.2)]"
                >
                  <div className="w-6 h-6 rounded-full bg-[#ccff00] text-black font-black text-xs flex items-center justify-center uppercase shadow-[0_0_8px_rgba(204,255,0,0.4)]">
                    {(
                      user.user_metadata?.full_name?.[0] ||
                      user.email?.[0] ||
                      "A"
                    ).toUpperCase()}
                  </div>
                  <span className="hidden md:inline-block text-xs font-bold text-white max-w-[110px] truncate">
                    {user.user_metadata?.full_name ||
                      user.email?.split("@")[0] ||
                      "Athlete"}
                  </span>
                </div>

                {/* Accessible Log Out Option */}
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="text-xs font-bold text-[#94a3b8] hover:text-[#ccff00] px-2.5 py-1.5 rounded-lg border border-[rgba(163,230,53,0.15)] hover:border-[rgba(163,230,53,0.35)] transition-colors uppercase tracking-wider"
                >
                  {dict.logOut}
                </button>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => openAuthModal("signin")}
                  className="hidden sm:inline-block text-xs font-bold uppercase tracking-wider text-[#94a3b8] hover:text-white px-2.5 py-1.5 transition-colors cursor-pointer"
                >
                  {dict.login}
                </button>
                <button
                  type="button"
                  onClick={() => openAuthModal("signup")}
                  className="relative px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider bg-[#ccff00] hover:bg-[#d8ff33] text-black transition-all duration-200 shadow-[0_0_25px_rgba(204,255,0,0.35)] hover:shadow-[0_0_35px_rgba(204,255,0,0.55)] active:scale-95 cursor-pointer"
                >
                  {dict.joinFree}
                </button>
              </>
            )}
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
            <p className="text-base sm:text-lg text-[#94a3b8] leading-relaxed max-w-xl mb-4">
              {dict.heroSubtitle}
            </p>

            {/* Sub-headline explaining exact purpose */}
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[rgba(18,24,38,0.7)] border border-[rgba(163,230,53,0.25)] text-xs sm:text-sm font-semibold text-[#ccff00] max-w-xl mb-8 shadow-[0_0_20px_rgba(204,255,0,0.06)]">
              <span className="w-2 h-2 rounded-full bg-[#ccff00] shrink-0 animate-ping" />
              <span>{dict.heroSubheadline}</span>
            </div>

            {/* High-Energy CTA */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-12 w-full sm:w-auto">
              {user ? (
                <Link
                  href="/dashboard"
                  className="px-8 py-4 rounded-xl text-sm font-black uppercase tracking-wider bg-[#ccff00] hover:bg-[#d8ff33] text-black flex items-center justify-center gap-3 transition-all duration-200 shadow-[0_0_30px_rgba(204,255,0,0.45)] hover:shadow-[0_0_45px_rgba(204,255,0,0.65)] hover:-translate-y-0.5 active:scale-95"
                >
                  <span>{dict.getStarted}</span>
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
              ) : (
                <button
                  type="button"
                  onClick={() => openAuthModal("signup")}
                  className="px-8 py-4 rounded-xl text-sm font-black uppercase tracking-wider bg-[#ccff00] hover:bg-[#d8ff33] text-black flex items-center justify-center gap-3 transition-all duration-200 shadow-[0_0_30px_rgba(204,255,0,0.45)] hover:shadow-[0_0_45px_rgba(204,255,0,0.65)] hover:-translate-y-0.5 active:scale-95 cursor-pointer"
                >
                  <span>{dict.getStarted}</span>
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
                </button>
              )}
              <a
                href="#how-it-works"
                className="px-6 py-4 rounded-xl text-sm font-bold uppercase tracking-wider text-white bg-[rgba(18,24,38,0.7)] hover:bg-[rgba(18,24,38,0.95)] border border-[rgba(163,230,53,0.2)] hover:border-[rgba(204,255,0,0.45)] backdrop-blur-md transition-all text-center flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>{dict.howItWorks}</span>
                <span className="text-[#ccff00] group-hover:translate-y-0.5 transition-transform">&darr;</span>
              </a>
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

          {/* Center & Right Column: Interactive 3D Hero Athlete Carousel */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <HeroCarousel />
          </div>
        </div>
      </section>

      {/* 2.5. "How to Get Started" (3-Step Quick Guide) */}
      <section
        id="how-it-works"
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 w-full border-t border-[rgba(163,230,53,0.12)] scroll-mt-20"
      >
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[rgba(18,24,38,0.85)] border border-[rgba(163,230,53,0.3)] shadow-[0_0_15px_rgba(204,255,0,0.1)] mb-4">
            <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-widest text-[#ccff00]">
              {dict.howItWorksBadge}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white mb-4">
            {dict.howItWorks}
          </h2>
          <p className="text-sm sm:text-base text-[#94a3b8] leading-relaxed">
            {dict.howItWorksSubtitle}
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative">
          {/* Step 1 */}
          <div className="relative p-6 sm:p-8 rounded-2xl bg-[rgba(18,24,38,0.65)] backdrop-blur-xl border border-[rgba(163,230,53,0.2)] hover:border-[#ccff00]/60 shadow-[0_10px_30px_rgba(0,0,0,0.4)] transition-all duration-300 group hover:-translate-y-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-3xl font-black font-mono text-[#ccff00]/30 group-hover:text-[#ccff00] transition-colors">
                  01
                </span>
                <div className="w-12 h-12 rounded-xl bg-[#07090e] border border-[#a3e635]/30 flex items-center justify-center text-[#ccff00] group-hover:border-[#ccff00] group-hover:shadow-[0_0_20px_rgba(204,255,0,0.25)] transition-all">
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight mb-3 group-hover:text-[#ccff00] transition-colors">
                {dict.step1Title}
              </h3>
              <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed mb-6">
                {dict.step1Desc}
              </p>
            </div>
            <div>
              {user ? (
                <Link
                  href="/dashboard/bmi"
                  className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#ccff00] hover:text-white transition-colors"
                >
                  <span>{dict.explore} BMI &rarr;</span>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => openAuthModal("signup")}
                  className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#ccff00] hover:text-white transition-colors cursor-pointer"
                >
                  <span>{dict.joinFree} &rarr;</span>
                </button>
              )}
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative p-6 sm:p-8 rounded-2xl bg-[rgba(18,24,38,0.65)] backdrop-blur-xl border border-[rgba(163,230,53,0.2)] hover:border-[#ccff00]/60 shadow-[0_10px_30px_rgba(0,0,0,0.4)] transition-all duration-300 group hover:-translate-y-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-3xl font-black font-mono text-[#ccff00]/30 group-hover:text-[#ccff00] transition-colors">
                  02
                </span>
                <div className="w-12 h-12 rounded-xl bg-[#07090e] border border-[#a3e635]/30 flex items-center justify-center text-[#ccff00] group-hover:border-[#ccff00] group-hover:shadow-[0_0_20px_rgba(204,255,0,0.25)] transition-all">
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
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight mb-3 group-hover:text-[#ccff00] transition-colors">
                {dict.step2Title}
              </h3>
              <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed mb-6">
                {dict.step2Desc}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/workouts"
                className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#ccff00] hover:text-white transition-colors"
              >
                <span>{dict.workouts} &rarr;</span>
              </Link>
              <span className="text-white/20">|</span>
              <Link
                href="/dashboard/nutrition"
                className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#ccff00] hover:text-white transition-colors"
              >
                <span>{dict.nutrition} &rarr;</span>
              </Link>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative p-6 sm:p-8 rounded-2xl bg-[rgba(18,24,38,0.65)] backdrop-blur-xl border border-[rgba(163,230,53,0.2)] hover:border-[#ccff00]/60 shadow-[0_10px_30px_rgba(0,0,0,0.4)] transition-all duration-300 group hover:-translate-y-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-3xl font-black font-mono text-[#ccff00]/30 group-hover:text-[#ccff00] transition-colors">
                  03
                </span>
                <div className="w-12 h-12 rounded-xl bg-[#07090e] border border-[#a3e635]/30 flex items-center justify-center text-[#ccff00] group-hover:border-[#ccff00] group-hover:shadow-[0_0_20px_rgba(204,255,0,0.25)] transition-all">
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
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight mb-3 group-hover:text-[#ccff00] transition-colors">
                {dict.step3Title}
              </h3>
              <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed mb-6">
                {dict.step3Desc}
              </p>
            </div>
            <div>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#ccff00] hover:text-white transition-colors"
              >
                <span>{dict.dashboard} &rarr;</span>
              </Link>
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
              className="card-neon-glass rounded-2xl overflow-hidden flex flex-col group transition-all duration-300 hover:border-[#ccff00]/50 hover:-translate-y-1"
            >
              {/* Card Photography */}
              <Link
                href={card.href}
                className="relative w-full aspect-[16/11] overflow-hidden block"
              >
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

              </Link>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <Link href={card.href}>
                    <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2 group-hover:text-[#ccff00] transition-colors">
                      {card.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-[#94a3b8] leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-[rgba(163,230,53,0.12)] flex items-center justify-between">
                  <Link
                    href={card.href}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider bg-[#121826] border border-[#a3e635]/30 text-[#ccff00] hover:bg-[#ccff00] hover:text-black hover:border-[#ccff00] transition-all shadow-[0_0_12px_rgba(204,255,0,0.1)] group/btn"
                  >
                    <span>{dict.tryNow}</span>
                    <span className="group-hover/btn:translate-x-0.5 transition-transform">&rarr;</span>
                  </Link>
                  <Link
                    href={card.href}
                    className="text-[11px] font-bold uppercase tracking-wider text-[#94a3b8] hover:text-[#ccff00] transition-colors"
                  >
                    {dict.explore}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Footer */}
      <Footer />
    </div>
  );
}
