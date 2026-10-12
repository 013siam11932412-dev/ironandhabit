"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

export default function NutritionPage() {
  const pathname = usePathname();
  const { dict, language } = useLanguage();

  const [meals] = useState([
    {
      id: 1,
      nameEn: "Pre-Workout Fuel: Oats & Whey",
      nameBn: "প্রি-ওয়ার্কআউট খাবার: ওটস ও হুই প্রোটিন",
      calories: 520,
      protein: 48,
      carbs: 65,
      fats: 8,
      time: "07:30 AM",
    },
    {
      id: 2,
      nameEn: "Post-Workout: Rice Bowl & Grilled Chicken",
      nameBn: "পোস্ট-ওয়ার্কআউট: ভাত ও গ্রিল্ড চিকেন",
      calories: 780,
      protein: 62,
      carbs: 90,
      fats: 14,
      time: "12:15 PM",
    },
    {
      id: 3,
      nameEn: "Afternoon Recovery Snack: Greek Yogurt & Berries",
      nameBn: "বিকালের নাস্তা: গ্রিক দই ও বেরি",
      calories: 320,
      protein: 34,
      carbs: 28,
      fats: 6,
      time: "04:30 PM",
    },
    {
      id: 4,
      nameEn: "Dinner: Salmon, Sweet Potato & Asparagus",
      nameBn: "রাতের খাবার: স্যালমন, মিষ্টি আলু ও সবজি",
      calories: 680,
      protein: 52,
      carbs: 55,
      fats: 22,
      time: "08:00 PM (Scheduled)",
    },
  ]);

  const navTabs = [
    { name: dict.overview, href: "/dashboard" },
    { name: dict.bmi, href: "/dashboard/bmi" },
    { name: dict.workouts, href: "/dashboard/workouts" },
    { name: dict.nutrition, href: "/dashboard/nutrition" },
  ];

  return (
    <div className="relative min-h-screen bg-[#07090e] text-[#f9fafb] flex flex-col justify-between selection:bg-[#ccff00] selection:text-black">
      {/* Top Header */}
      <header className="relative z-30 w-full border-b border-[rgba(163,230,53,0.15)] bg-[#07090e]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#121826] border border-[#a3e635]/40 flex items-center justify-center text-[#ccff00]">
                🥗
              </div>
              <div>
                <span className="font-black text-lg tracking-wider text-white">
                  IRON <span className="text-[#ccff00]">&</span> HABIT
                </span>
                <span className="hidden sm:inline-block text-[10px] font-black tracking-widest text-[#94a3b8] ml-2 pl-2 border-l border-[rgba(163,230,53,0.2)]">
                  {dict.nutrition}
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <LanguageToggle />
              <div className="px-3 py-1.5 rounded-full bg-[rgba(18,24,38,0.85)] border border-[rgba(163,230,53,0.3)] text-xs font-black text-[#ccff00]">
                {language === "bn" ? "লক্ষ্য: ২,৪০০ ক্যালরি" : "GOAL: 2,400 KCAL"}
              </div>
              <Link
                href="/dashboard"
                className="text-xs font-bold text-[#94a3b8] hover:text-white px-2.5 py-1.5 rounded-lg border border-[rgba(163,230,53,0.15)]"
              >
                {dict.dashboard}
              </Link>
            </div>
          </div>

          <nav className="flex space-x-2 border-t border-[rgba(163,230,53,0.08)] py-2 overflow-x-auto">
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

      {/* Main Workspace */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-[#ccff00] mb-1">
              {language === "bn" ? "অ্যানাবলিক পুষ্টি ও পুনরুদ্ধার" : "ANABOLIC FUEL & RECOVERY"}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
              {language === "bn" ? "ম্যাক্রো ও ক্যালরি হাব" : "MACRO & CALORIE HUB"}
            </h1>
          </div>
          <button
            type="button"
            className="px-5 py-2.5 rounded-xl bg-[#ccff00] text-black font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(204,255,0,0.3)] self-start sm:self-auto"
          >
            {language === "bn" ? "+ খাবার লগ করুন" : "+ LOG MEAL"}
          </button>
        </div>

        {/* Macro Targets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[rgba(18,24,38,0.7)] border border-[rgba(163,230,53,0.2)] rounded-2xl p-5">
            <span className="text-[10px] font-black uppercase text-[#94a3b8]">
              {language === "bn" ? "শক্তি / ক্যালরি" : "ENERGY"}
            </span>
            <div className="text-2xl font-black text-white font-mono mt-1">1,850 / 2,400</div>
            <span className="text-xs text-[#ccff00] font-mono">kcal</span>
          </div>
          <div className="bg-[rgba(18,24,38,0.7)] border border-[rgba(163,230,53,0.2)] rounded-2xl p-5">
            <span className="text-[10px] font-black uppercase text-[#94a3b8]">
              {language === "bn" ? "প্রোটিন" : "PROTEIN"}
            </span>
            <div className="text-2xl font-black text-[#ccff00] font-mono mt-1">144 / 190</div>
            <span className="text-xs text-[#ccff00] font-mono">
              {language === "bn" ? "গ্রাম (৭৬%)" : "grams (76%)"}
            </span>
          </div>
          <div className="bg-[rgba(18,24,38,0.7)] border border-[rgba(163,230,53,0.2)] rounded-2xl p-5">
            <span className="text-[10px] font-black uppercase text-[#94a3b8]">
              {language === "bn" ? "কার্বোহাইড্রেট" : "CARBOHYDRATES"}
            </span>
            <div className="text-2xl font-black text-white font-mono mt-1">183 / 240</div>
            <span className="text-xs text-[#94a3b8] font-mono">
              {language === "bn" ? "গ্রাম" : "grams"}
            </span>
          </div>
          <div className="bg-[rgba(18,24,38,0.7)] border border-[rgba(163,230,53,0.2)] rounded-2xl p-5">
            <span className="text-[10px] font-black uppercase text-[#94a3b8]">
              {language === "bn" ? "স্বাস্থ্যকর ফ্যাট" : "HEALTHY FATS"}
            </span>
            <div className="text-2xl font-black text-white font-mono mt-1">36 / 65</div>
            <span className="text-xs text-[#94a3b8] font-mono">
              {language === "bn" ? "গ্রাম" : "grams"}
            </span>
          </div>
        </div>

        {/* Meal Logs */}
        <div className="bg-[rgba(18,24,38,0.7)] backdrop-blur-md border border-[rgba(163,230,53,0.2)] rounded-2xl p-6 shadow-xl">
          <h3 className="text-base font-black uppercase text-white mb-4">
            {language === "bn" ? "আজকের খাদ্যতালিকা" : "TODAY'S LOGGED MEALS"}
          </h3>
          <div className="space-y-3">
            {meals.map((meal) => (
              <div
                key={meal.id}
                className="p-4 rounded-xl bg-[#07090e]/80 border border-[rgba(163,230,53,0.15)] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <h4 className="text-sm font-black text-white uppercase">
                    {language === "bn" ? meal.nameBn : meal.nameEn}
                  </h4>
                  <div className="text-xs text-[#94a3b8] font-mono mt-0.5">
                    {meal.time}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="text-white font-bold">{meal.calories} kcal</span>
                  <span className="text-[#ccff00] font-bold">{meal.protein}g P</span>
                  <span className="text-[#94a3b8]">{meal.carbs}g C</span>
                  <span className="text-[#94a3b8]">{meal.fats}g F</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[rgba(163,230,53,0.12)] bg-[#07090e]/95 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-[#94a3b8]">
          &copy; 2026 IRON & HABIT Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
