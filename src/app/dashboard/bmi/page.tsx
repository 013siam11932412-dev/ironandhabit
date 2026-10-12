"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import LanguageToggle from "@/components/LanguageToggle";
import {
  BmiRecord,
  fetchBmiRecords,
  insertBmiRecord,
  deleteBmiRecord,
} from "@/lib/db";
import { getStoredStreak } from "@/lib/storage";

export default function BmiPage() {
  const pathname = usePathname();
  const { dict, language } = useLanguage();
  const { user } = useAuth();

  // BMI inputs (Feet, Inches, and Weight in KG) - Empty Initial State (No fake data)
  const [feet, setFeet] = useState<string>("");
  const [inches, setInches] = useState<string>("");
  const [weightKg, setWeightKg] = useState<string>("");
  const [bmiResult, setBmiResult] = useState<number | null>(null);

  // Historical Records State
  const [records, setRecords] = useState<BmiRecord[]>([]);
  const [isLoadingRecords, setIsLoadingRecords] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [streakDay] = useState<number>(() => getStoredStreak());

  // Load Historical BMI Records from Supabase / localStorage
  useEffect(() => {
    let mounted = true;
    setIsLoadingRecords(true);

    fetchBmiRecords(user?.id)
      .then((data) => {
        if (mounted) {
          setRecords(data);
          // If there's a previous record, initialize latest BMI result display
          if (data.length > 0 && bmiResult === null) {
            setBmiResult(data[0].bmi);
          }
          setIsLoadingRecords(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load BMI records:", err);
        if (mounted) setIsLoadingRecords(false);
      });

    return () => {
      mounted = false;
    };
  }, [user]);

  // Determine category & advice
  function getBmiData(bmi: number | null) {
    if (bmi === null) return null;
    const isBn = language === "bn";

    if (bmi < 18.5) {
      return {
        category: isBn ? "কম ওজন" : "Underweight",
        color: "#38bdf8",
        advice: isBn
          ? "একটি স্বাস্থ্যকর ক্যালোরিক উদ্বৃত্ত (+৩০০ থেকে +৫০০ ক্যালরি/দিন) বজায় রাখুন। পেশি বৃদ্ধির জন্য রেজিস্ট্যান্স ট্রেনিং এবং উচ্চ প্রোটিনযুক্ত খাবারের দিকে নজর দিন।"
          : "Target a clean caloric surplus (+300 to +500 kcal/day). Focus on progressive resistance training and high-density protein meals to build lean muscular mass.",
        positionPercent: Math.max(5, (bmi / 18.5) * 25),
      };
    } else if (bmi <= 24.9) {
      return {
        category: isBn ? "স্বাভাবিক ওজন" : "Normal / Athletic",
        color: "#ccff00",
        advice: isBn
          ? "উত্তম স্বাস্থ্যকর স্তর। বর্তমান ওয়ার্কআউট ভলিউম ধরে রাখুন, শরীরের ওজনের প্রতি কেজিতে ১.৬–২.২ গ্রাম প্রোটিন গ্রহণ করুন এবং শক্তি বৃদ্ধিতে ফোকাস করুন।"
          : "Prime optimal zone. Maintain current training volume, aim for 1.6–2.2g of protein per kg of bodyweight, and focus on progressive strength overload.",
        positionPercent: 25 + ((bmi - 18.5) / (24.9 - 18.5)) * 25,
      };
    } else if (bmi <= 29.9) {
      return {
        category: isBn ? "অতিরিক্ত ওজন" : "Overweight / High Muscularity",
        color: "#f59e0b",
        advice: isBn
          ? "যদি আপনার পেশিবহুল শরীর থাকে তবে বিএমআই বেশি দেখাতে পারে। চর্বি কমাতে চাইলে ৩০০-৫০০ ক্যালোরি ঘাটতি বজায় রাখুন এবং প্রোটিন গ্রহণ অব্যাহত রাখুন।"
          : "If you carry high muscle mass, BMI may overestimate body fat. If targeting fat loss, implement a slight caloric deficit (300-500 kcal) with high protein retention.",
        positionPercent: 50 + ((bmi - 25) / (29.9 - 25)) * 25,
      };
    } else {
      return {
        category: isBn ? "স্থূলতা" : "Obese Category",
        color: "#ef4444",
        advice: isBn
          ? "ক্যালোরি ঘাটতি, পর্যাপ্ত পানি পান এবং হালকা কার্ডিও ব্যায়ামের সাথে শক্তি প্রশিক্ষণ সমন্বয় করুন যাতে মেটাবলিজম সক্রিয় থাকে।"
          : "Prioritize caloric deficit, high daily hydration, and steady-state Zone 2 cardiovascular work paired with hypertrophy training to preserve metabolic rate.",
        positionPercent: Math.min(95, 75 + ((bmi - 30) / 10) * 20),
      };
    }
  }

  async function calculateAndSaveBmi() {
    const ft = parseFloat(feet) || 0;
    const inc = parseFloat(inches) || 0;
    const w = parseFloat(weightKg);
    const totalInches = ft * 12 + inc;

    if (totalInches > 0 && w > 0) {
      setIsSaving(true);
      const totalMeters = totalInches * 0.0254;
      const heightCm = Math.round(totalMeters * 100);
      const calculated = w / (totalMeters * totalMeters);
      const bmiVal = parseFloat(calculated.toFixed(1));
      setBmiResult(bmiVal);

      const categoryData = getBmiData(bmiVal);
      const categoryName = categoryData?.category || "Normal / Athletic";

      try {
        const saved = await insertBmiRecord(user?.id || null, {
          height: heightCm,
          weight: w,
          bmi: bmiVal,
          category: categoryName,
        });
        setRecords((prev) => [saved, ...prev]);
      } catch (err) {
        console.error("Failed to save BMI record:", err);
      } finally {
        setIsSaving(false);
      }
    }
  }

  async function handleDeleteRecord(id: string | number) {
    try {
      await deleteBmiRecord(user?.id || null, id);
      setRecords((prev) => prev.filter((r) => String(r.id) !== String(id)));
    } catch (err) {
      console.error("Failed to delete BMI record:", err);
    }
  }

  const bmiData = getBmiData(bmiResult);

  const navTabs = [
    { name: dict.overview, href: "/dashboard" },
    { name: dict.bmi, href: "/dashboard/bmi" },
    { name: dict.workouts, href: "/dashboard/workouts" },
    { name: dict.nutrition, href: "/dashboard/nutrition" },
  ];

  return (
    <div className="relative min-h-screen bg-[#07090e] text-[#f9fafb] flex flex-col justify-between selection:bg-[#ccff00] selection:text-black">
      {/* Ambient Lighting */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-10 left-1/3 w-[600px] h-[400px] bg-[#ccff00]/[0.04] blur-[170px] rounded-full" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-[#a3e635]/[0.03] blur-[160px] rounded-full" />
      </div>

      {/* Top Header / Bar */}
      <header className="relative z-30 w-full border-b border-[rgba(163,230,53,0.15)] bg-[#07090e]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-20 flex items-center justify-between">
            {/* Brand Logo & Module Name */}
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
                    {dict.bmiTelemetry}
                  </span>
                </div>
              </Link>
            </div>

            {/* Language Toggle, Streak & Status Badge */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <LanguageToggle />
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(18,24,38,0.85)] border border-[rgba(163,230,53,0.3)] shadow-[0_0_15px_rgba(204,255,0,0.15)]">
                <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
                <span className="text-xs font-black uppercase text-[#ccff00] tracking-wider font-mono">
                  {language === "bn" ? `দিন ${streakDay} / ৭ 🔥` : `Day ${streakDay} / 7 🔥`}
                </span>
              </div>
              <Link
                href="/dashboard"
                className="text-xs font-bold text-[#94a3b8] hover:text-white px-2.5 py-1.5 rounded-lg border border-[rgba(163,230,53,0.15)] hover:border-[rgba(163,230,53,0.35)] transition-colors"
              >
                {dict.dashboard}
              </Link>
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

      {/* Main Content Workspace */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* Module Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#ccff00] mb-1">
              <span>{dict.bmiTelemetry}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
              {dict.bmiTitle}
            </h1>
          </div>
          <p className="text-xs text-[#94a3b8] max-w-md">
            {dict.bmiSubtitle}
          </p>
        </div>

        {/* Top Grid: BMI Calculator & Visual Gauge */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (5 cols): Inputs & Calculator */}
          <div className="lg:col-span-5 bg-[rgba(18,24,38,0.7)] backdrop-blur-md border border-[rgba(163,230,53,0.2)] rounded-2xl p-6 shadow-xl">
            <h3 className="text-base font-black uppercase text-white mb-1">
              {dict.calculateBmi}
            </h3>
            <p className="text-xs text-[#94a3b8] mb-5">
              {dict.calculateBmiSubtitle}
            </p>

            <div className="space-y-4">
              {/* Feet and Inches Inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8] mb-1.5">
                    {dict.heightFeet}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="8"
                      value={feet}
                      onChange={(e) => setFeet(e.target.value)}
                      placeholder="5"
                      className="w-full bg-[#07090e] border border-[rgba(163,230,53,0.2)] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] font-mono transition-colors"
                    />
                    <span className="absolute right-4 top-3.5 text-xs text-[#94a3b8] font-bold font-mono">
                      FT
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8] mb-1.5">
                    {dict.heightInches}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="11"
                      value={inches}
                      onChange={(e) => setInches(e.target.value)}
                      placeholder="9"
                      className="w-full bg-[#07090e] border border-[rgba(163,230,53,0.2)] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] font-mono transition-colors"
                    />
                    <span className="absolute right-4 top-3.5 text-xs text-[#94a3b8] font-bold font-mono">
                      IN
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8] mb-1.5">
                  {dict.bodyWeightKg}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    placeholder="75"
                    className="w-full bg-[#07090e] border border-[rgba(163,230,53,0.2)] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] font-mono transition-colors"
                  />
                  <span className="absolute right-4 top-3.5 text-xs text-[#94a3b8] font-bold font-mono">
                    KG
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={calculateAndSaveBmi}
                disabled={isSaving || !feet || !weightKg}
                className="w-full py-3.5 rounded-xl text-sm font-black uppercase tracking-wider bg-[#ccff00] hover:bg-[#d8ff33] text-black transition-all duration-200 shadow-[0_0_20px_rgba(204,255,0,0.3)] hover:shadow-[0_0_30px_rgba(204,255,0,0.5)] active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isSaving
                  ? dict.savedToStorage
                  : bmiResult !== null
                  ? dict.recalculateBmi
                  : dict.calculateBmi}
              </button>
            </div>

            {/* Quick Profiles Helper */}
            <div className="mt-5 pt-4 border-t border-[rgba(163,230,53,0.1)] flex items-center justify-between text-xs text-[#94a3b8]">
              <span>{dict.sampleProfiles}</span>
              <div className="space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setFeet("5");
                    setInches("9");
                    setWeightKg("70");
                  }}
                  className="text-[#ccff00] hover:underline font-mono text-[11px]"
                >
                  5&apos;9&quot; 70kg
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFeet("6");
                    setInches("0");
                    setWeightKg("82");
                  }}
                  className="text-[#ccff00] hover:underline font-mono text-[11px]"
                >
                  6&apos;0&quot; 82kg
                </button>
              </div>
            </div>
          </div>

          {/* Right Column (7 cols): Visual BMI Neon Gauge & Category Advice Box */}
          <div className="lg:col-span-7 bg-[rgba(18,24,38,0.7)] backdrop-blur-md border border-[rgba(163,230,53,0.2)] rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black uppercase text-white">
                  {dict.classificationMeter}
                </h3>
                <p className="text-xs text-[#94a3b8]">
                  {dict.whoSpectrum}
                </p>
              </div>
              {bmiResult !== null ? (
                <div className="text-right">
                  <div className="text-3xl font-black text-[#ccff00] font-mono leading-none">
                    {bmiResult}
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-[#94a3b8] mt-1">
                    {dict.indexScore}
                  </div>
                </div>
              ) : (
                <div className="text-right">
                  <div className="text-sm font-black text-[#94a3b8] font-mono leading-none">
                    --.-
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-[#94a3b8] mt-1">
                    {dict.indexScore}
                  </div>
                </div>
              )}
            </div>

            {/* Visual Neon Gauge Bar */}
            <div className="space-y-2 pt-2">
              {/* Marker pin */}
              <div className="relative h-6 w-full">
                {bmiData && (
                  <div
                    className="absolute -top-1 -translate-x-1/2 flex flex-col items-center transition-all duration-500"
                    style={{ left: `${bmiData.positionPercent}%` }}
                  >
                    <span className="text-xs font-black font-mono text-white bg-[#07090e] px-2 py-0.5 rounded border border-[#ccff00] shadow-[0_0_10px_rgba(204,255,0,0.5)]">
                      {bmiResult}
                    </span>
                    <span className="text-[#ccff00] text-xs leading-none">▼</span>
                  </div>
                )}
              </div>

              {/* 4 Multi-Color Segments */}
              <div className="grid grid-cols-4 h-3.5 rounded-full overflow-hidden p-0.5 bg-[#07090e] border border-[rgba(163,230,53,0.2)] gap-1">
                <div className="bg-sky-400 rounded-l-full" title={dict.underweight} />
                <div className="bg-[#ccff00]" title={dict.normalWeight} />
                <div className="bg-amber-400" title={dict.overweight} />
                <div className="bg-rose-500 rounded-r-full" title={dict.obese} />
              </div>

              {/* Legend Labels */}
              <div className="grid grid-cols-4 text-center text-[10px] text-[#94a3b8] font-bold uppercase tracking-wider pt-1">
                <div>
                  <span className="text-sky-400 block font-mono">&lt; 18.5</span>
                  {dict.underweight}
                </div>
                <div>
                  <span className="text-[#ccff00] block font-mono">18.5 - 24.9</span>
                  {dict.normalWeight}
                </div>
                <div>
                  <span className="text-amber-400 block font-mono">25 - 29.9</span>
                  {dict.overweight}
                </div>
                <div>
                  <span className="text-rose-400 block font-mono">30.0+</span>
                  {dict.obese}
                </div>
              </div>
            </div>

            {/* Personalized Neon Advice Box */}
            {bmiData ? (
              <div className="p-4 sm:p-5 rounded-xl bg-[#07090e]/90 border border-[rgba(163,230,53,0.3)] shadow-[0_0_20px_rgba(204,255,0,0.06)] animate-in fade-in">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: bmiData.color }}
                    />
                    <span className="text-xs font-black uppercase tracking-wider text-white">
                      {language === "bn" ? "শ্রেণিবিভাগ" : "CLASSIFICATION"}: {bmiData.category}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#ccff00]">
                    {language === "bn" ? "অ্যাথলেটিক প্রোটোকল" : "ATHLETIC PROTOCOL"}
                  </span>
                </div>
                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  {bmiData.advice}
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-[#07090e]/50 border border-[rgba(163,230,53,0.15)] text-center text-xs text-[#94a3b8]">
                {language === "bn"
                  ? "আপনার বিএমআই স্কোর এবং ব্যক্তিগত অ্যাথলেটিক পরামর্শ দেখতে বামপাশে উচ্চতা ও ওজন প্রবেশ করান।"
                  : "Enter your height and weight on the left to calculate your BMI and athletic guidance protocol."}
              </div>
            )}
          </div>
        </div>

        {/* Real Historical BMI Entries List (Live Supabase & Offline Persistence) */}
        <div className="bg-[rgba(18,24,38,0.7)] backdrop-blur-md border border-[rgba(163,230,53,0.2)] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[rgba(163,230,53,0.15)] pb-4">
            <div>
              <h3 className="text-base font-black uppercase text-white tracking-tight">
                {dict.bmiHistoryTitle}
              </h3>
              <p className="text-xs text-[#94a3b8]">
                {dict.bmiHistorySubtitle}
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[#ccff00] bg-[#07090e] px-3 py-1 rounded-lg border border-[rgba(163,230,53,0.2)]">
              {records.length} {language === "bn" ? "টি রেকর্ড" : "records"}
            </span>
          </div>

          {isLoadingRecords ? (
            <div className="py-10 text-center text-xs text-[#94a3b8] font-mono animate-pulse">
              {language === "bn" ? "বিএমআই হিস্ট্রি লোড হচ্ছে..." : "Loading BMI records..."}
            </div>
          ) : records.length === 0 ? (
            /* Authentic Zero-State */
            <div className="py-10 px-4 rounded-xl bg-[#07090e]/60 border border-[rgba(163,230,53,0.15)] flex flex-col items-center justify-center text-center space-y-2">
              <span className="text-2xl">📏</span>
              <p className="text-sm font-bold text-white">
                {dict.noBmiRecords}
              </p>
              <p className="text-xs text-[#94a3b8] max-w-sm">
                {language === "bn"
                  ? "আপনার শারীরিক পরিবর্তন ও মেটাবলিক ভারসাম্য পর্যবেক্ষণ করতে প্রথম পরিমাপ রেকর্ড করুন।"
                  : "Your body composition telemetry will automatically accumulate here with each log."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {records.map((rec) => {
                const dateLabel = rec.created_at
                  ? new Date(rec.created_at).toLocaleDateString([], {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "Today";

                const timeLabel = rec.created_at
                  ? new Date(rec.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "";

                return (
                  <div
                    key={rec.id}
                    className="p-4 rounded-xl bg-[#07090e]/80 border border-[rgba(163,230,53,0.15)] hover:border-[rgba(163,230,53,0.3)] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#121826] border border-[#a3e635]/30 flex items-center justify-center font-mono font-black text-[#ccff00] text-sm">
                        {rec.bmi}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black uppercase text-white">
                            {rec.category}
                          </span>
                          <span className="text-[10px] font-mono text-[#a3e635] bg-[#ccff00]/10 px-2 py-0.5 rounded border border-[#ccff00]/25">
                            {rec.weight} kg
                          </span>
                          <span className="text-[10px] font-mono text-[#94a3b8]">
                            {rec.height} cm
                          </span>
                        </div>
                        <div className="text-[11px] text-[#94a3b8] font-mono mt-0.5">
                          {dateLabel} {timeLabel && `• ${timeLabel}`}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <button
                        type="button"
                        onClick={() => handleDeleteRecord(rec.id)}
                        className="text-[#94a3b8] hover:text-rose-400 p-1.5 rounded transition-colors"
                        title={dict.deleteRecord}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[rgba(163,230,53,0.12)] bg-[#07090e]/95 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#94a3b8]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ccff00]" />
            <span className="font-bold text-white">IRON & HABIT</span>
            <span>&mdash; ATHLETIC TELEMETRY ENGINE</span>
          </div>
          <div>
            &copy; 2026 IRON & HABIT Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
