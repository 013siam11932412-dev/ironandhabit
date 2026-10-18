"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import Footer from "@/components/Footer";
import MacroCalorieHub from "@/components/dashboard/MacroCalorieHub";

export default function NutritionPage() {
  const pathname = usePathname();
  const { dict } = useLanguage();

  const navTabs = [
    { name: dict.overview, href: "/dashboard" },
    { name: dict.bmi, href: "/dashboard/bmi" },
    { name: dict.workouts, href: "/dashboard/workouts" },
    { name: dict.nutrition, href: "/dashboard/nutrition" },
    { name: dict.aiAssistant, href: "/dashboard/assistant" },
    { name: dict.community, href: "/dashboard/community" },
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
        <MacroCalorieHub />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
