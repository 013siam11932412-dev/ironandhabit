"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

export default function BmiPage() {
  const pathname = usePathname();
  const { dict, language } = useLanguage();

  // BMI inputs (Feet, Inches, and Weight in KG)
  const [feet, setFeet] = useState<string>("5");
  const [inches, setInches] = useState<string>("9");
  const [weightKg, setWeightKg] = useState<string>("78");
  const [bmiResult, setBmiResult] = useState<number | null>(25.4);

  function calculateBmi() {
    const ft = parseFloat(feet) || 0;
    const inc = parseFloat(inches) || 0;
    const w = parseFloat(weightKg);
    const totalInches = ft * 12 + inc;
    if (totalInches > 0 && w > 0) {
      const totalMeters = totalInches * 0.0254;
      const calculated = w / (totalMeters * totalMeters);
      const bmiVal = parseFloat(calculated.toFixed(1));
      setBmiResult(bmiVal);

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(
            "iron_bmi_data",
            JSON.stringify({
              bmi: bmiVal,
              feet: ft,
              inches: inc,
              weightKg: w,
              calculatedAt: "2026-10-11",
            })
          );
        } catch {
          // ignore
        }
      }
    }
  }

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

  const bmiData = getBmiData(bmiResult);

  const navTabs = [
    { name: dict.overview, href: "/dashboard" },
    { name: dict.bmi, href: "/dashboard/bmi" },
    { name: dict.workouts, href: "/dashboard/workout" },
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
                <span className="text-xs font-black uppercase text-[#ccff00] tracking-wider">
                  {dict.streak7DaysBadge}
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
              const isActive = pathname === tab.href;
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
                    placeholder="78"
                    className="w-full bg-[#07090e] border border-[rgba(163,230,53,0.2)] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] font-mono transition-colors"
                  />
                  <span className="absolute right-4 top-3.5 text-xs text-[#94a3b8] font-bold font-mono">
                    KG
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={calculateBmi}
                className="w-full py-3.5 rounded-xl text-sm font-black uppercase tracking-wider bg-[#ccff00] hover:bg-[#d8ff33] text-black transition-all duration-200 shadow-[0_0_20px_rgba(204,255,0,0.3)] hover:shadow-[0_0_30px_rgba(204,255,0,0.5)] active:scale-95"
              >
                {dict.recalculateBmi}
              </button>
            </div>

            {/* Quick Presets */}
            <div className="mt-5 pt-4 border-t border-[rgba(163,230,53,0.1)] flex items-center justify-between text-xs text-[#94a3b8]">
              <span>{dict.sampleProfiles}</span>
              <div className="space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setFeet("5");
                    setInches("9");
                    setWeightKg("70");
                    setBmiResult(22.8);
                  }}
                  className="text-[#ccff00] hover:underline font-mono text-[11px]"
                >
                  Lean 5&apos;9&quot; 70kg
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFeet("6");
                    setInches("1");
                    setWeightKg("90");
                    setBmiResult(26.2);
                  }}
                  className="text-[#ccff00] hover:underline font-mono text-[11px]"
                >
                  Heavy 6&apos;1&quot; 90kg
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
              {bmiResult !== null && (
                <div className="text-right">
                  <div className="text-3xl font-black text-[#ccff00] font-mono leading-none">
                    {bmiResult}
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
            {bmiData && (
              <div className="p-4 sm:p-5 rounded-xl bg-[#07090e]/90 border border-[rgba(163,230,53,0.3)] shadow-[0_0_20px_rgba(204,255,0,0.06)]">
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
            )}
          </div>
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
