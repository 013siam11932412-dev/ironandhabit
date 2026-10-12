"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import LanguageToggle from "@/components/LanguageToggle";
import ProgressChartBoard from "@/components/dashboard/ProgressChartBoard";
import {
  DailyRecord,
  getStoredHistory,
  getStoredStreak,
  saveStoredStreak,
  checkAndRunMidnightReset,
  forceMidnightReset,
  getTodayIsoDate,
  formatDayLabel,
} from "@/lib/storage";
import {
  fetchDailyMetrics,
  fetchAllDailyMetrics,
  upsertDailyMetrics,
  fetchTodayNutritionLogs,
  fetchTodayWorkoutLogs,
} from "@/lib/db";

export default function DashboardPage() {
  const pathname = usePathname();
  const router = useRouter();
  const { dict, language } = useLanguage();
  const { user, signOut } = useAuth();

  // 1. Streak State: 7-Day Cyclical Tracker (0 to 7)
  const [streakDay, setStreakDay] = useState<number>(() => getStoredStreak());
  const [streakIncrementedToday, setStreakIncrementedToday] = useState(false);

  // 2. Real Telemetry Metrics (Dynamic from Supabase / localStorage)
  const [todayCalories, setTodayCalories] = useState<number>(0);
  const [todayWorkoutMinutes, setTodayWorkoutMinutes] = useState<number>(0);

  // 3. 30-Day History State (starts empty / authentic records only)
  const [history30Days, setHistory30Days] = useState<DailyRecord[]>(() =>
    getStoredHistory()
  );
  const [midnightNotice, setMidnightNotice] = useState<boolean>(false);

  // 4. Water Hydration Tracker (8 Glasses = 250ml each = 2000ml) - Clean Zero-State
  const [glasses, setGlasses] = useState<boolean[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("iron_water_glasses");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length === 8) return parsed;
        }
      } catch {
        // ignore
      }
    }
    return [false, false, false, false, false, false, false, false];
  });

  // 5. Daily Quests Checklist - Clean Zero-State (All start uncompleted)
  const [quests, setQuests] = useState(() => {
    const defaultQuests = [
      {
        id: 1,
        titleEn: "Log Morning Compound Workout (Chest & Triceps)",
        titleBn: "সকালের কম্পাউন্ড ওয়ার্কআউট সম্পন্ন করুন (বুক ও ট্রাইসেপ)",
        categoryEn: "TRAINING",
        categoryBn: "ট্রেনিং",
        completed: false,
        points: "+150 XP",
      },
      {
        id: 2,
        titleEn: "Hit 190g Daily Protein Fuel Target",
        titleBn: "দৈনিক ১৯০ গ্রাম প্রোটিন লক্ষ্যমাত্রা পূরণ করুন",
        categoryEn: "NUTRITION",
        categoryBn: "পুষ্টি",
        completed: false,
        points: "+100 XP",
      },
      {
        id: 3,
        titleEn: "Reach 8 Glasses of Pure Hydration",
        titleBn: "৮ গ্লাস বিশুদ্ধ পানি পান করুন",
        categoryEn: "HYDRATION",
        categoryBn: "পানি",
        completed: false,
        points: "+80 XP",
      },
      {
        id: 4,
        titleEn: "10-Min Post-Workout Mobility & Stretch",
        titleBn: "১০ মিনিট পোস্ট-ওয়ার্কআউট স্ট্রেচিং সম্পন্ন করুন",
        categoryEn: "RECOVERY",
        categoryBn: "রিকভারি",
        completed: false,
        points: "+60 XP",
      },
      {
        id: 5,
        titleEn: "Record Fasted Weight & Resting Heart Rate",
        titleBn: "সকালের ওজন ও হার্ট রেট রেকর্ড করুন",
        categoryEn: "METRICS",
        categoryBn: "পরিমাপ",
        completed: false,
        points: "+50 XP",
      },
    ];

    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("iron_daily_quests");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length === 5) return parsed;
        }
      } catch {
        // ignore
      }
    }
    return defaultQuests;
  });

  // Load live data from Supabase & localStorage on mount & user change
  useEffect(() => {
    let mounted = true;
    const today = getTodayIsoDate();

    // 1. Fetch today's daily_metrics
    fetchDailyMetrics(user?.id || null, today).then((metrics) => {
      if (!mounted || !metrics) return;

      if (metrics.water_ml > 0) {
        const glassCount = Math.min(8, Math.floor(metrics.water_ml / 250));
        setGlasses((prev) =>
          prev.map((_, i) => i < glassCount)
        );
      }
      if (metrics.calories_consumed > 0) {
        setTodayCalories(metrics.calories_consumed);
      }
      if (metrics.streak_count > 0) {
        setStreakDay(metrics.streak_count);
      }
    });

    // 2. Fetch today's meals to calculate real calories
    fetchTodayNutritionLogs(user?.id).then((meals) => {
      if (!mounted || meals.length === 0) return;
      const totalMealCals = meals.reduce((acc, m) => acc + (m.calories || 0), 0);
      setTodayCalories((prev) => Math.max(prev, totalMealCals));
    });

    // 3. Fetch today's workout logs to calculate workout minutes
    fetchTodayWorkoutLogs(user?.id).then((workouts) => {
      if (!mounted || workouts.length === 0) return;
      const completedSets = workouts.filter((w) => w.completed).length;
      if (completedSets > 0) {
        setTodayWorkoutMinutes(Math.min(60, completedSets * 12));
      }
    });

    // 4. Fetch 30-day historical metrics
    fetchAllDailyMetrics(user?.id || null).then((metricRows) => {
      if (!mounted || metricRows.length === 0) return;

      const mappedHistory: DailyRecord[] = metricRows.map((row) => {
        const [yr, mo, dy] = row.date.split("-").map(Number);
        const dObj = new Date(yr, (mo || 1) - 1, dy || 1);
        const isCompleted = row.water_ml >= 2000 && row.calories_consumed >= 2000;
        return {
          id: String(row.id || row.date),
          date: formatDayLabel(dObj, "en"),
          isoDate: row.date,
          caloriesBurned: Math.round(row.calories_consumed * 0.9),
          waterMl: row.water_ml,
          habitsScore: isCompleted ? 100 : row.water_ml > 0 ? 60 : 0,
          completedQuestsCount: isCompleted ? 5 : 2,
          totalQuestsCount: 5,
          status: isCompleted ? "completed" : row.water_ml > 0 ? "partial" : "rest",
        };
      });

      setHistory30Days(mappedHistory);
    });

    // Midnight rollover check
    const resetResult = checkAndRunMidnightReset({
      glassesCount: 8,
      completedQuests: 5,
      totalQuests: 5,
    });
    if (resetResult.didReset) {
      setGlasses([false, false, false, false, false, false, false, false]);
      setQuests((prev) => prev.map((q) => ({ ...q, completed: false })));
      setHistory30Days(resetResult.updatedHistory);
      setMidnightNotice(true);
      setTimeout(() => setMidnightNotice(false), 5000);
    }

    function handleStorage() {
      setStreakDay(getStoredStreak());
      setHistory30Days(getStoredHistory());
    }
    window.addEventListener("storage", handleStorage);

    return () => {
      mounted = false;
      window.removeEventListener("storage", handleStorage);
    };
  }, [user]);

  function checkAndUpdateStreak(
    updatedQuests: typeof quests,
    updatedGlasses: boolean[]
  ) {
    const filledCount = updatedGlasses.filter(Boolean).length;
    const completedCount = updatedQuests.filter((q) => q.completed).length;
    const percentage = Math.round(
      ((completedCount + filledCount / 8) / (updatedQuests.length + 1)) * 100
    );

    if (percentage === 100 && !streakIncrementedToday) {
      setStreakIncrementedToday(true);
      const next = streakDay >= 7 ? 1 : streakDay + 1;
      setStreakDay(next);
      saveStoredStreak(next);

      const today = getTodayIsoDate();
      upsertDailyMetrics(user?.id || null, {
        date: today,
        water_ml: filledCount * 250,
        calories_consumed: todayCalories,
        streak_count: next,
      });
    }
  }

  async function toggleGlass(index: number) {
    const updated = [...glasses];
    updated[index] = !updated[index];
    setGlasses(updated);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("iron_water_glasses", JSON.stringify(updated));
      } catch {
        // ignore
      }
    }

    const allFilled = updated.filter(Boolean).length === 8;
    const nextQuests = quests.map((q) =>
      q.id === 3 ? { ...q, completed: allFilled } : q
    );
    setQuests(nextQuests);

    const filledCount = updated.filter(Boolean).length;
    const waterMl = filledCount * 250;
    const today = getTodayIsoDate();

    // Persist to Supabase public.daily_metrics & local map
    await upsertDailyMetrics(user?.id || null, {
      date: today,
      water_ml: waterMl,
      calories_consumed: todayCalories,
      streak_count: streakDay,
    });

    checkAndUpdateStreak(nextQuests, updated);
  }

  function toggleQuest(id: number) {
    const nextQuests = quests.map((q) =>
      q.id === id ? { ...q, completed: !q.completed } : q
    );
    setQuests(nextQuests);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("iron_daily_quests", JSON.stringify(nextQuests));
      } catch {
        // ignore
      }
    }

    checkAndUpdateStreak(nextQuests, glasses);
  }

  const filledGlassesCount = glasses.filter(Boolean).length;
  const completedQuestsCount = quests.filter((q) => q.completed).length;
  const completionPercentage = Math.round(
    ((completedQuestsCount + filledGlassesCount / 8) / (quests.length + 1)) *
      100
  );

  // SVG circular ring calculations
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (completionPercentage / 100) * circumference;

  const navTabs = [
    { name: dict.overview, href: "/dashboard" },
    { name: dict.bmi, href: "/dashboard/bmi" },
    { name: dict.workouts, href: "/dashboard/workouts" },
    { name: dict.nutrition, href: "/dashboard/nutrition" },
  ];

  // Manual trigger for testing midnight reset (00:00)
  function handleManualMidnightReset() {
    setGlasses([false, false, false, false, false, false, false, false]);
    setQuests((prev) => prev.map((q) => ({ ...q, completed: false })));
    const { updatedHistory } = forceMidnightReset({
      glassesCount: filledGlassesCount,
      completedQuests: completedQuestsCount,
      totalQuests: quests.length,
    });
    setHistory30Days(updatedHistory);
    setMidnightNotice(true);
    setTimeout(() => setMidnightNotice(false), 4500);
  }

  return (
    <div className="relative min-h-screen bg-[#07090e] text-[#f9fafb] flex flex-col justify-between selection:bg-[#ccff00] selection:text-black">
      {/* Ambient Glows */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 right-1/4 w-[650px] h-[400px] bg-[#ccff00]/[0.04] blur-[170px] rounded-full" />
        <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-[#a3e635]/[0.03] blur-[160px] rounded-full" />
      </div>

      {/* Top Header / Bar */}
      <header className="relative z-30 w-full border-b border-[rgba(163,230,53,0.15)] bg-[#07090e]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-20 flex items-center justify-between">
            {/* Brand Logo & Section */}
            <div className="flex items-center gap-3 sm:gap-4">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-xl bg-[#121826] border border-[#a3e635]/40 flex items-center justify-center shadow-[0_0_15px_rgba(204,255,0,0.2)] group-hover:border-[#ccff00] transition-colors">
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
                <div>
                  <span className="font-black text-lg tracking-wider text-white">
                    IRON <span className="text-[#ccff00]">&</span> HABIT
                  </span>
                  <span className="hidden sm:inline-block text-[10px] font-black tracking-widest text-[#94a3b8] ml-2 pl-2 border-l border-[rgba(163,230,53,0.2)]">
                    {dict.dashboardTitle}
                  </span>
                </div>
              </Link>
            </div>

            {/* Language Switcher, 7-Day Cyclical Streak & Status Badge */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <LanguageToggle />

              {/* 7-Day Cyclical Streak Tracker Badge */}
              <div
                title="7-Day Cyclical Streak Tracker"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(18,24,38,0.85)] border border-[rgba(163,230,53,0.35)] shadow-[0_0_15px_rgba(204,255,0,0.2)]"
              >
                <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
                <span className="text-xs font-black uppercase text-[#ccff00] tracking-wider font-mono">
                  {language === "bn"
                    ? `দিন ${streakDay} / ৭ 🔥`
                    : `Day ${streakDay} / 7 🔥`}
                </span>
              </div>

              {/* User Initial / Avatar Badge */}
              {user && (
                <div
                  title={user.email || "Athlete"}
                  className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[rgba(18,24,38,0.9)] border border-[#a3e635]/40 shadow-[0_0_15px_rgba(204,255,0,0.2)]"
                >
                  <div className="w-6 h-6 rounded-full bg-[#ccff00] text-black font-black text-xs flex items-center justify-center uppercase shadow-[0_0_8px_rgba(204,255,0,0.4)]">
                    {(
                      user.user_metadata?.full_name?.[0] ||
                      user.email?.[0] ||
                      "A"
                    ).toUpperCase()}
                  </div>
                  <span className="hidden md:inline-block text-xs font-bold text-white max-w-[100px] truncate">
                    {user.user_metadata?.full_name ||
                      user.email?.split("@")[0] ||
                      "Athlete"}
                  </span>
                </div>
              )}

              <button
                type="button"
                onClick={async () => {
                  await signOut();
                  router.push("/");
                }}
                className="text-xs font-bold text-[#94a3b8] hover:text-[#ccff00] px-2.5 py-1.5 rounded-lg border border-[rgba(163,230,53,0.15)] hover:border-[rgba(163,230,53,0.35)] transition-colors cursor-pointer uppercase tracking-wider"
              >
                {dict.signOut}
              </button>
            </div>
          </div>

          {/* Navigation Tabs Bar */}
          <nav className="flex space-x-1 sm:space-x-2 border-t border-[rgba(163,230,53,0.08)] py-2 overflow-x-auto">
            {navTabs.map((tab) => {
              const isActive =
                pathname === tab.href ||
                (tab.href === "/dashboard/workouts" &&
                  pathname === "/dashboard/workout");
              return (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-[#ccff00] text-black shadow-[0_0_20px_rgba(204,255,0,0.3)]"
                      : "text-[#94a3b8] hover:text-white hover:bg-[rgba(18,24,38,0.5)]"
                  }`}
                >
                  {tab.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Dashboard Workspace */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* Midnight Reset Notification Banner */}
        {midnightNotice && (
          <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-[#ccff00] text-xs font-bold text-[#ccff00] flex items-center justify-between shadow-[0_0_20px_rgba(204,255,0,0.2)] animate-in fade-in">
            <div className="flex items-center gap-2">
              <span>🌙</span>
              <span>
                {language === "bn"
                  ? "মধ্যরাত (১২:০০) রিসেট সম্পন্ন: পূর্ববর্তী দিনের মেট্রিক্স সংরক্ষিত হয়েছে এবং আজকের নতুন ট্র্যাকার সক্রিয়।"
                  : "Midnight (00:00) reset executed: previous day telemetry archived, fresh day trackers activated."}
              </span>
            </div>
            <span className="font-mono text-[10px] text-white">00:00 AM RESET</span>
          </div>
        )}

        {/* 1. Metrics Overview Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Metric 1: Calories (Real & Dynamic Zero-State) */}
          <div className="bg-[rgba(18,24,38,0.7)] backdrop-blur-md border border-[rgba(163,230,53,0.2)] rounded-2xl p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#94a3b8]">
                {dict.dailyCalories}
              </span>
              <span className="text-xs">🔥</span>
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-2xl font-black text-white font-mono">
                {todayCalories.toLocaleString()}
              </span>
              <span className="text-xs text-[#94a3b8] font-mono">
                / 2,400 kcal
              </span>
            </div>
            <div className="w-full bg-[#07090e] h-2 rounded-full overflow-hidden border border-[rgba(163,230,53,0.1)]">
              <div
                className="bg-[#ccff00] h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(204,255,0,0.4)]"
                style={{ width: `${Math.min(100, (todayCalories / 2400) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] text-[#94a3b8] mt-2 font-mono">
              <span>{Math.max(0, 2400 - todayCalories)} kcal {dict.remaining}</span>
              <span className="text-[#ccff00] font-bold">
                {Math.min(100, Math.round((todayCalories / 2400) * 100))}% {dict.target}
              </span>
            </div>
          </div>

          {/* Metric 2: Workout Time (Real & Dynamic Zero-State) */}
          <div className="bg-[rgba(18,24,38,0.7)] backdrop-blur-md border border-[rgba(163,230,53,0.2)] rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#94a3b8]">
                {dict.workoutTime}
              </span>
              <span className="text-xs">⏱️</span>
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-2xl font-black text-white font-mono">
                {todayWorkoutMinutes}
              </span>
              <span className="text-xs text-[#94a3b8] font-mono">
                / 60 mins
              </span>
            </div>
            <div className="w-full bg-[#07090e] h-2 rounded-full overflow-hidden border border-[rgba(163,230,53,0.1)]">
              <div
                className="bg-[#a3e635] h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(163,230,53,0.4)]"
                style={{ width: `${Math.min(100, (todayWorkoutMinutes / 60) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] text-[#94a3b8] mt-2 font-mono">
              <span>
                {todayWorkoutMinutes > 0
                  ? language === "bn" ? "ওয়ার্কআউট সক্রিয়" : "Active Session"
                  : dict.noWorkoutToday}
              </span>
              <span className="text-[#ccff00] font-bold">
                {todayWorkoutMinutes > 0 ? dict.completed : "0%"}
              </span>
            </div>
          </div>

          {/* Metric 3: Water Status */}
          <div className="bg-[rgba(18,24,38,0.7)] backdrop-blur-md border border-[rgba(163,230,53,0.2)] rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#94a3b8]">
                {dict.waterIntake}
              </span>
              <span className="text-xs">💧</span>
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-2xl font-black text-[#ccff00] font-mono">
                {filledGlassesCount * 250}
              </span>
              <span className="text-xs text-[#94a3b8] font-mono">
                / 2,000 ml
              </span>
            </div>
            <div className="w-full bg-[#07090e] h-2 rounded-full overflow-hidden border border-[rgba(163,230,53,0.1)]">
              <div
                className="bg-[#ccff00] h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(204,255,0,0.4)]"
                style={{ width: `${(filledGlassesCount / 8) * 100}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] text-[#94a3b8] mt-2 font-mono">
              <span>
                {filledGlassesCount} / 8 {dict.glasses}
              </span>
              <span className="text-[#ccff00] font-bold">
                {Math.round((filledGlassesCount / 8) * 100)}%
              </span>
            </div>
          </div>

          {/* Metric 4: 7-Day Cyclical Streak Metric Card */}
          <div className="bg-[rgba(18,24,38,0.7)] backdrop-blur-md border border-[rgba(163,230,53,0.2)] rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#94a3b8]">
                {language === "bn" ? "৭-দিনের সাইকেল স্ট্রিক" : "7-DAY CYCLE STREAK"}
              </span>
              <span className="text-xs">🏆</span>
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-2xl font-black text-[#ccff00] font-mono">
                {language === "bn" ? `দিন ${streakDay} / ৭` : `Day ${streakDay} / 7`}
              </span>
              <span className="text-xs text-[#94a3b8] font-mono">
                {streakDay >= 7 ? "🔥 Cycle Ready" : "Active"}
              </span>
            </div>
            <div className="w-full bg-[#07090e] h-2 rounded-full overflow-hidden border border-[rgba(163,230,53,0.1)]">
              <div
                className="bg-gradient-to-r from-[#a3e635] to-[#ccff00] h-full rounded-full transition-all duration-500"
                style={{ width: `${(streakDay / 7) * 100}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] text-[#94a3b8] mt-2 font-mono">
              <span>{language === "bn" ? "৭ দিনে পূর্ণ চক্র" : "7-Day Peak Mastery"}</span>
              <span className="text-[#ccff00] font-bold">
                {Math.round((streakDay / 7) * 100)}%
              </span>
            </div>
          </div>
        </section>

        {/* 2. Middle Row: Habit Ring + Interactive Water + Quests */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (5 cols): Habit Progress Ring + Water Grid */}
          <div className="lg:col-span-5 space-y-6">
            {/* Habit Progress Ring Card */}
            <div className="bg-[rgba(18,24,38,0.7)] backdrop-blur-md border border-[rgba(163,230,53,0.2)] rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-center gap-6">
              {/* Dynamic Circular SVG Ring */}
              <div className="relative w-36 h-36 flex-shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    stroke="rgba(163, 230, 53, 0.15)"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    stroke="#ccff00"
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-700 ease-out"
                    style={{
                      filter: "drop-shadow(0 0 8px rgba(204, 255, 0, 0.5))",
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-black text-white font-mono">
                    {completionPercentage}%
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-wider text-[#94a3b8]">
                    {dict.completed}
                  </span>
                </div>
              </div>

              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#07090e] border border-[rgba(163,230,53,0.2)] text-[10px] font-black uppercase text-[#ccff00] mb-2">
                  {dict.dailyDiscipline}
                </div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight">
                  {dict.ironHabitScore}
                </h3>
                <p className="text-xs text-[#94a3b8] leading-relaxed mt-1">
                  {completionPercentage >= 80
                    ? dict.habitExceptional
                    : dict.habitPending}
                </p>
              </div>
            </div>

            {/* Interactive 8-Glass Water Hydration Grid */}
            <div className="bg-[rgba(18,24,38,0.7)] backdrop-blur-md border border-[rgba(163,230,53,0.2)] rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">
                    {dict.hydrationProtocol}
                  </h3>
                  <p className="text-xs text-[#94a3b8]">
                    {dict.clickGlass}
                  </p>
                </div>
                <div className="text-right font-mono">
                  <span className="text-sm font-black text-[#ccff00]">
                    {filledGlassesCount * 250} / 2000 ml
                  </span>
                </div>
              </div>

              {/* 8-Glass Grid */}
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                {glasses.map((isFilled, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleGlass(idx)}
                    className={`aspect-[3/4] rounded-xl flex flex-col items-center justify-center p-2 border transition-all duration-200 group ${
                      isFilled
                        ? "bg-[rgba(163,230,53,0.15)] border-[#ccff00] shadow-[0_0_15px_rgba(204,255,0,0.25)]"
                        : "bg-[#07090e] border-[rgba(163,230,53,0.15)] hover:border-[rgba(163,230,53,0.35)]"
                    }`}
                  >
                    <svg
                      className={`w-5 h-6 transition-transform group-hover:scale-110 ${
                        isFilled ? "text-[#ccff00]" : "text-[#94a3b8]/40"
                      }`}
                      fill={isFilled ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                      />
                    </svg>
                    <span
                      className={`text-[10px] font-mono mt-1 font-bold ${
                        isFilled ? "text-[#ccff00]" : "text-[#94a3b8]/50"
                      }`}
                    >
                      #{idx + 1}
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-[#94a3b8]">
                <span>
                  {filledGlassesCount >= 8
                    ? language === "bn"
                      ? "লক্ষ্য অর্জিত হয়েছে 💧"
                      : "Goal Achieved 💧"
                    : `${8 - filledGlassesCount} ${
                        language === "bn" ? "গ্লাস বাকি" : "glasses remaining"
                      }`}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setGlasses([true, true, true, true, true, true, true, true])
                  }
                  className="text-[11px] font-bold text-[#ccff00] hover:underline"
                >
                  {dict.quickFillAll}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column (7 cols): Daily Quests Checklist */}
          <div className="lg:col-span-7 bg-[rgba(18,24,38,0.7)] backdrop-blur-md border border-[rgba(163,230,53,0.2)] rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[rgba(163,230,53,0.12)]">
              <div>
                <h3 className="text-lg font-black uppercase tracking-tight text-white">
                  {dict.dailyQuests}
                </h3>
                <p className="text-xs text-[#94a3b8]">
                  {dict.questsSubtitle}
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-[#ccff00] bg-[#07090e] px-3 py-1.5 rounded-lg border border-[rgba(163,230,53,0.2)]">
                {completedQuestsCount} / {quests.length} {dict.completed}
              </span>
            </div>

            <div className="space-y-3">
              {quests.map((quest) => (
                <div
                  key={quest.id}
                  onClick={() => toggleQuest(quest.id)}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 cursor-pointer transition-all duration-200 select-none ${
                    quest.completed
                      ? "bg-[rgba(18,24,38,0.95)] border-[rgba(163,230,53,0.35)] shadow-[0_0_15px_rgba(204,255,0,0.08)]"
                      : "bg-[#07090e]/80 border-[rgba(163,230,53,0.12)] hover:border-[rgba(163,230,53,0.3)]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                        quest.completed
                          ? "bg-[#ccff00] border-[#ccff00] text-black shadow-[0_0_10px_rgba(204,255,0,0.5)]"
                          : "bg-[#07090e] border-[rgba(163,230,53,0.3)] text-transparent"
                      }`}
                    >
                      <svg
                        className="w-4 h-4 font-black"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                    </div>

                    <div>
                      <span
                        className={`text-xs sm:text-sm font-bold block transition-colors ${
                          quest.completed
                            ? "text-white line-through opacity-70"
                            : "text-[#f9fafb]"
                        }`}
                      >
                        {language === "bn" ? quest.titleBn : quest.titleEn}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#94a3b8]">
                        {language === "bn"
                          ? quest.categoryBn
                          : quest.categoryEn}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold text-[#ccff00] whitespace-nowrap">
                    {quest.points}
                  </span>
                </div>
              ))}
            </div>

            {/* Quests Footer Motivation & Midnight Simulation button */}
            <div className="mt-6 pt-4 border-t border-[rgba(163,230,53,0.1)] flex flex-wrap items-center justify-between gap-3 text-xs text-[#94a3b8]">
              <div className="flex items-center gap-2">
                <span>
                  {language === "bn"
                    ? "স্ট্রিক সুরক্ষা সক্রিয়"
                    : "Streak Protection Active"}
                </span>
                <span className="text-[#ccff00] font-bold">
                  {language === "bn"
                    ? `দিন ${streakDay} / ৭`
                    : `Day ${streakDay} / 7`}
                </span>
              </div>
              <button
                type="button"
                onClick={handleManualMidnightReset}
                className="text-[10px] font-mono text-[#94a3b8] hover:text-[#ccff00] border border-[rgba(163,230,53,0.2)] hover:border-[#ccff00] px-2.5 py-1 rounded-md transition-colors"
                title="Simulate 12:00 AM Midnight tracker reset"
              >
                🌙 {language === "bn" ? "মধ্যরাত রিসেট টেস্ট" : "Test 00:00 Reset"}
              </button>
            </div>
          </div>
        </div>

        {/* 3. 30-Day Progress Chart Board */}
        <section className="pt-2">
          <ProgressChartBoard
            history={history30Days}
            todayMetrics={{
              caloriesBurned: todayCalories,
              waterMl: filledGlassesCount * 250,
              habitsScore: completionPercentage,
              completedQuestsCount: completedQuestsCount,
              totalQuestsCount: quests.length,
            }}
          />
        </section>

        {/* 4. Quick Navigation Cards to Connected Modules */}
        <section className="pt-2">
          <h3 className="text-sm font-black uppercase tracking-widest text-[#ccff00] mb-4">
            {dict.connectedModules}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* BMI & Body Module */}
            <Link
              href="/dashboard/bmi"
              className="card-neon-glass p-6 rounded-2xl group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#07090e] border border-[rgba(163,230,53,0.3)] flex items-center justify-center text-[#ccff00] group-hover:border-[#ccff00] transition-colors">
                    📏
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#ccff00] bg-[rgba(163,230,53,0.1)] px-2.5 py-1 rounded-full border border-[rgba(163,230,53,0.2)]">
                    {language === "bn" ? "শারীরিক পরিমাপ" : "BODY METRICS"}
                  </span>
                </div>
                <h4 className="text-lg font-black uppercase text-white group-hover:text-[#ccff00] transition-colors">
                  {dict.bmiTitle}
                </h4>
                <p className="text-xs text-[#94a3b8] mt-1.5 leading-relaxed">
                  {language === "bn"
                    ? "রিয়েল-টাইম বিএমআই হিসাব করুন, মানদণ্ড স্কেল যাচাই করুন এবং বুক, কোমর ও বাইসেপের বৃদ্ধি লগ করুন।"
                    : "Calculate real-time BMI index, analyze classification gauges, and log circumferences for chest, waist, and biceps."}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[rgba(163,230,53,0.15)] flex items-center justify-between text-xs font-bold text-white group-hover:text-[#ccff00]">
                <span>
                  {language === "bn"
                    ? "ক্যালকুলেটর খুলুন"
                    : "LAUNCH CALCULATOR"}
                </span>
                <span>&rarr;</span>
              </div>
            </Link>

            {/* Workout Module */}
            <Link
              href="/dashboard/workout"
              className="card-neon-glass p-6 rounded-2xl group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#07090e] border border-[rgba(163,230,53,0.3)] flex items-center justify-center text-[#ccff00] group-hover:border-[#ccff00] transition-colors">
                    🏋️
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#ccff00] bg-[rgba(163,230,53,0.1)] px-2.5 py-1 rounded-full border border-[rgba(163,230,53,0.2)]">
                    {language === "bn"
                      ? "ওভারলোড প্রগ্রেস"
                      : "PROGRESSIVE OVERLOAD"}
                  </span>
                </div>
                <h4 className="text-lg font-black uppercase text-white group-hover:text-[#ccff00] transition-colors">
                  {dict.workoutTracker}
                </h4>
                <p className="text-xs text-[#94a3b8] mt-1.5 leading-relaxed">
                  {language === "bn"
                    ? "ওয়ার্কিং সেট লগ করুন, মোট ভলিউম গণনা করুন এবং সর্বোচ্চ ব্যক্তিগত রেকর্ড পর্যবেক্ষণ করুন।"
                    : "Log working sets, calculate volume load, track personal bests, and monitor rest intervals between sets."}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[rgba(163,230,53,0.15)] flex items-center justify-between text-xs font-bold text-white group-hover:text-[#ccff00]">
                <span>
                  {language === "bn"
                    ? "ওয়ার্কআউট শুরু করুন"
                    : "START WORKOUT"}
                </span>
                <span>&rarr;</span>
              </div>
            </Link>

            {/* Nutrition Module */}
            <Link
              href="/dashboard/nutrition"
              className="card-neon-glass p-6 rounded-2xl group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#07090e] border border-[rgba(163,230,53,0.3)] flex items-center justify-center text-[#ccff00] group-hover:border-[#ccff00] transition-colors">
                    🥗
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#ccff00] bg-[rgba(163,230,53,0.1)] px-2.5 py-1 rounded-full border border-[rgba(163,230,53,0.2)]">
                    {language === "bn" ? "ম্যাক্রো অনুপাত" : "MACRO SPLITS"}
                  </span>
                </div>
                <h4 className="text-lg font-black uppercase text-white group-hover:text-[#ccff00] transition-colors">
                  {dict.nutritionPlans}
                </h4>
                <p className="text-xs text-[#94a3b8] mt-1.5 leading-relaxed">
                  {language === "bn"
                    ? "প্রোটিন সিন্থেসিস, ক্যালোরিক বাজেট এবং ওয়ার্কআউটের খাদ্য তালিকার সুনির্দিষ্ট ট্র্যাকার।"
                    : "Precision macro tracker for protein synthesis, caloric budget, and nutrient timing around heavy sessions."}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[rgba(163,230,53,0.15)] flex items-center justify-between text-xs font-bold text-white group-hover:text-[#ccff00]">
                <span>
                  {language === "bn"
                    ? "পুষ্টি তথ্য দেখুন"
                    : "VIEW NUTRITION"}
                </span>
                <span>&rarr;</span>
              </div>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[rgba(163,230,53,0.12)] bg-[#07090e]/95 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#94a3b8]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ccff00]" />
            <span className="font-bold text-white">IRON & HABIT</span>
            <span>&mdash; ATHLETIC PERFORMANCE SYSTEM</span>
          </div>
          <div>
            &copy; 2026 IRON & HABIT Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
