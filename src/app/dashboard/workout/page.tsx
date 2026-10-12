"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

export default function WorkoutPage() {
  const pathname = usePathname();
  const { dict, language } = useLanguage();

  const [exercises, setExercises] = useState([
    {
      id: 1,
      nameEn: "Barbell Bench Press",
      nameBn: "বারবেল বেঞ্চ প্রেস",
      targetSets: "4 Sets",
      completedSets: 4,
      lastWeight: "225 lbs",
      rpe: "8.5",
      status: "COMPLETED",
    },
    {
      id: 2,
      nameEn: "Incline Dumbbell Press",
      nameBn: "ইনক্লাইন ডাম্বেল প্রেস",
      targetSets: "3 Sets",
      completedSets: 3,
      lastWeight: "85 lbs / hand",
      rpe: "9.0",
      status: "COMPLETED",
    },
    {
      id: 3,
      nameEn: "Dips (Weighted)",
      nameBn: "ডিপস (ওয়েটেড)",
      targetSets: "3 Sets",
      completedSets: 2,
      lastWeight: "+45 lbs plate",
      rpe: "8.0",
      status: "IN PROGRESS",
    },
    {
      id: 4,
      nameEn: "Cable Overhead Triceps Extension",
      nameBn: "ওভারহেড ট্রাইসেপ এক্সটেনশন",
      targetSets: "4 Sets",
      completedSets: 0,
      lastWeight: "70 lbs",
      rpe: "-",
      status: "PENDING",
    },
  ]);

  const navTabs = [
    { name: dict.overview, href: "/dashboard" },
    { name: dict.bmi, href: "/dashboard/bmi" },
    { name: dict.workouts, href: "/dashboard/workout" },
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
                ⚡
              </div>
              <div>
                <span className="font-black text-lg tracking-wider text-white">
                  IRON <span className="text-[#ccff00]">&</span> HABIT
                </span>
                <span className="hidden sm:inline-block text-[10px] font-black tracking-widest text-[#94a3b8] ml-2 pl-2 border-l border-[rgba(163,230,53,0.2)]">
                  {dict.workoutTracker}
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <LanguageToggle />
              <div className="px-3 py-1.5 rounded-full bg-[rgba(18,24,38,0.85)] border border-[rgba(163,230,53,0.3)] text-xs font-black text-[#ccff00]">
                {language === "bn" ? "বুক ও ট্রাইসেপ সেশন" : "SESSION: CHEST & ARMS"}
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

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-[#ccff00] mb-1">
              {language === "bn" ? "হাইপারট্রফি ও ভলিউম" : "HYPERTROPHY & RAW VOLUME"}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
              {language === "bn" ? "ওয়ার্কআউট লগ" : "ACTIVE WORKOUT LOG"}
            </h1>
          </div>
          <button
            type="button"
            className="px-5 py-2.5 rounded-xl bg-[#ccff00] text-black font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(204,255,0,0.3)] self-start sm:self-auto"
          >
            {language === "bn" ? "+ ব্যায়াম যোগ করুন" : "+ ADD EXERCISE"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[rgba(18,24,38,0.7)] border border-[rgba(163,230,53,0.2)] rounded-2xl p-5">
            <span className="text-[10px] font-black uppercase text-[#94a3b8]">
              {language === "bn" ? "মোট ভলিউম" : "TOTAL VOLUME"}
            </span>
            <div className="text-2xl font-black text-white font-mono mt-1">16,420 LBS</div>
          </div>
          <div className="bg-[rgba(18,24,38,0.7)] border border-[rgba(163,230,53,0.2)] rounded-2xl p-5">
            <span className="text-[10px] font-black uppercase text-[#94a3b8]">
              {language === "bn" ? "সম্পন্ন সেট" : "SETS COMPLETED"}
            </span>
            <div className="text-2xl font-black text-[#ccff00] font-mono mt-1">9 / 14 SETS</div>
          </div>
          <div className="bg-[rgba(18,24,38,0.7)] border border-[rgba(163,230,53,0.2)] rounded-2xl p-5">
            <span className="text-[10px] font-black uppercase text-[#94a3b8]">
              {language === "bn" ? "সময়" : "ELAPSED TIME"}
            </span>
            <div className="text-2xl font-black text-white font-mono mt-1">58 MINS</div>
          </div>
          <div className="bg-[rgba(18,24,38,0.7)] border border-[rgba(163,230,53,0.2)] rounded-2xl p-5">
            <span className="text-[10px] font-black uppercase text-[#94a3b8]">
              {language === "bn" ? "গড় আরপিই" : "AVG RPE"}
            </span>
            <div className="text-2xl font-black text-[#ccff00] font-mono mt-1">8.5 RPE</div>
          </div>
        </div>

        <div className="bg-[rgba(18,24,38,0.7)] backdrop-blur-md border border-[rgba(163,230,53,0.2)] rounded-2xl p-6 shadow-xl">
          <h3 className="text-base font-black uppercase text-white mb-4">
            {language === "bn" ? "আজকের অনুশীলন তালিকা" : "TODAY'S EXERCISES"}
          </h3>
          <div className="space-y-3">
            {exercises.map((ex) => (
              <div
                key={ex.id}
                className="p-4 rounded-xl bg-[#07090e]/80 border border-[rgba(163,230,53,0.15)] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <h4 className="text-sm font-black text-white uppercase">
                    {language === "bn" ? ex.nameBn : ex.nameEn}
                  </h4>
                  <div className="text-xs text-[#94a3b8] font-mono mt-0.5">
                    {ex.targetSets} • Last Weight: {ex.lastWeight} • RPE: {ex.rpe}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
                    ex.status === "COMPLETED"
                      ? "text-[#ccff00] border-[#ccff00]/40 bg-[#ccff00]/10"
                      : ex.status === "IN PROGRESS"
                      ? "text-amber-400 border-amber-400/40 bg-amber-400/10"
                      : "text-[#94a3b8] border-[#94a3b8]/20 bg-[#07090e]"
                  }`}>
                    {ex.status}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setExercises((prev) =>
                        prev.map((item) =>
                          item.id === ex.id ? { ...item, status: "COMPLETED" } : item
                        )
                      );
                    }}
                    className="text-xs font-bold text-black bg-[#ccff00] hover:bg-[#d8ff33] px-3 py-1.5 rounded-lg uppercase"
                  >
                    {language === "bn" ? "সেট লগ করুন" : "Log Set"}
                  </button>
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
