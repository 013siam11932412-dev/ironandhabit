"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import LanguageToggle from "@/components/LanguageToggle";
import {
  NutritionLog,
  fetchTodayNutritionLogs,
  insertNutritionLog,
  deleteNutritionLog,
  fetchDailyMetrics,
  upsertDailyMetrics,
} from "@/lib/db";
import { getTodayIsoDate, getStoredStreak } from "@/lib/storage";

export default function NutritionPage() {
  const pathname = usePathname();
  const { dict, language } = useLanguage();
  const { user } = useAuth();
  const [, startTransition] = useTransition();

  const [meals, setMeals] = useState<NutritionLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Form State
  const [mealName, setMealName] = useState<string>("");
  const [calories, setCalories] = useState<string>("");
  const [protein, setProtein] = useState<string>("");
  const [carbs, setCarbs] = useState<string>("");
  const [fat, setFat] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Load today's meals on mount & user change
  useEffect(() => {
    let mounted = true;

    fetchTodayNutritionLogs(user?.id)
      .then((data) => {
        if (mounted) {
          setMeals(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load today's meals:", err);
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [user]);

  // Sync calories with daily_metrics
  const syncDailyMetricsCalories = async (updatedMeals: NutritionLog[]) => {
    const totalCals = updatedMeals.reduce((acc, m) => acc + (m.calories || 0), 0);
    const today = getTodayIsoDate();
    const existingMetric = await fetchDailyMetrics(user?.id || null, today);
    const waterMl = existingMetric?.water_ml || 0;
    const streak = existingMetric?.streak_count ?? getStoredStreak();

    await upsertDailyMetrics(user?.id || null, {
      date: today,
      water_ml: waterMl,
      calories_consumed: totalCals,
      streak_count: streak,
    });
  };

  const handleAddMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealName.trim()) return;

    setIsSubmitting(true);
    const calNum = Math.max(0, parseInt(calories, 10) || 0);
    const protNum = Math.max(0, parseInt(protein, 10) || 0);
    const carbNum = Math.max(0, parseInt(carbs, 10) || 0);
    const fatNum = Math.max(0, parseInt(fat, 10) || 0);

    try {
      const newMeal = await insertNutritionLog(user?.id || null, {
        meal_name: mealName.trim(),
        calories: calNum,
        protein: protNum,
        carbs: carbNum,
        fat: fatNum,
      });

      startTransition(() => {
        const nextMeals = [...meals, newMeal];
        setMeals(nextMeals);
        syncDailyMetricsCalories(nextMeals);
      });

      // Reset form & close modal
      setMealName("");
      setCalories("");
      setProtein("");
      setCarbs("");
      setFat("");
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error creating meal log:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMeal = async (id: string | number) => {
    try {
      await deleteNutritionLog(user?.id || null, id);
      const nextMeals = meals.filter((m) => String(m.id) !== String(id));
      setMeals(nextMeals);
      syncDailyMetricsCalories(nextMeals);
    } catch (err) {
      console.error("Failed to delete meal log:", err);
    }
  };

  // Macro Calculations
  const totalCalories = meals.reduce((sum, m) => sum + (m.calories || 0), 0);
  const totalProtein = meals.reduce((sum, m) => sum + (m.protein || 0), 0);
  const totalCarbs = meals.reduce((sum, m) => sum + (m.carbs || 0), 0);
  const totalFat = meals.reduce((sum, m) => sum + (m.fat || 0), 0);

  const goalCalories = 2400;
  const goalProtein = 190;
  const goalCarbs = 240;
  const goalFat = 65;

  const proteinPct = Math.min(100, Math.round((totalProtein / goalProtein) * 100));

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
              <div className="px-3 py-1.5 rounded-full bg-[rgba(18,24,38,0.85)] border border-[rgba(163,230,53,0.3)] text-xs font-black text-[#ccff00] font-mono">
                {language === "bn"
                  ? `লক্ষ্য: ২,৪০০ ক্যালরি`
                  : `GOAL: 2,400 KCAL`}
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
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-[#ccff00] hover:bg-[#d8ff33] text-black font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(204,255,0,0.3)] transition-all cursor-pointer self-start sm:self-auto active:scale-95"
          >
            {language === "bn" ? "+ খাবার লগ করুন" : "+ LOG MEAL"}
          </button>
        </div>

        {/* Macro Targets Grid (Dynamic Totals & Zero-States) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Energy */}
          <div className="bg-[rgba(18,24,38,0.7)] border border-[rgba(163,230,53,0.2)] rounded-2xl p-5 shadow-lg">
            <span className="text-[10px] font-black uppercase text-[#94a3b8]">
              {language === "bn" ? "শক্তি / ক্যালরি" : "ENERGY"}
            </span>
            <div className="text-2xl font-black text-white font-mono mt-1">
              {totalCalories.toLocaleString()} / {goalCalories.toLocaleString()}
            </div>
            <div className="w-full bg-[#07090e] h-1.5 rounded-full mt-2.5 overflow-hidden border border-[rgba(163,230,53,0.1)]">
              <div
                className="bg-[#ccff00] h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (totalCalories / goalCalories) * 100)}%` }}
              />
            </div>
            <span className="text-xs text-[#ccff00] font-mono mt-1 block">
              {Math.max(0, goalCalories - totalCalories)} kcal {dict.remaining}
            </span>
          </div>

          {/* Protein */}
          <div className="bg-[rgba(18,24,38,0.7)] border border-[rgba(163,230,53,0.2)] rounded-2xl p-5 shadow-lg">
            <span className="text-[10px] font-black uppercase text-[#94a3b8]">
              {language === "bn" ? "প্রোটিন" : "PROTEIN"}
            </span>
            <div className="text-2xl font-black text-[#ccff00] font-mono mt-1">
              {totalProtein} / {goalProtein}
            </div>
            <div className="w-full bg-[#07090e] h-1.5 rounded-full mt-2.5 overflow-hidden border border-[rgba(163,230,53,0.1)]">
              <div
                className="bg-[#ccff00] h-full rounded-full transition-all duration-500"
                style={{ width: `${proteinPct}%` }}
              />
            </div>
            <span className="text-xs text-[#ccff00] font-mono mt-1 block">
              {language === "bn" ? `গ্রাম (${proteinPct}%)` : `grams (${proteinPct}%)`}
            </span>
          </div>

          {/* Carbohydrates */}
          <div className="bg-[rgba(18,24,38,0.7)] border border-[rgba(163,230,53,0.2)] rounded-2xl p-5 shadow-lg">
            <span className="text-[10px] font-black uppercase text-[#94a3b8]">
              {language === "bn" ? "কার্বোহাইড্রেট" : "CARBOHYDRATES"}
            </span>
            <div className="text-2xl font-black text-white font-mono mt-1">
              {totalCarbs} / {goalCarbs}
            </div>
            <div className="w-full bg-[#07090e] h-1.5 rounded-full mt-2.5 overflow-hidden border border-[rgba(163,230,53,0.1)]">
              <div
                className="bg-[#a3e635] h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (totalCarbs / goalCarbs) * 100)}%` }}
              />
            </div>
            <span className="text-xs text-[#94a3b8] font-mono mt-1 block">
              {language === "bn" ? "গ্রাম" : "grams"}
            </span>
          </div>

          {/* Healthy Fats */}
          <div className="bg-[rgba(18,24,38,0.7)] border border-[rgba(163,230,53,0.2)] rounded-2xl p-5 shadow-lg">
            <span className="text-[10px] font-black uppercase text-[#94a3b8]">
              {language === "bn" ? "স্বাস্থ্যকর ফ্যাট" : "HEALTHY FATS"}
            </span>
            <div className="text-2xl font-black text-white font-mono mt-1">
              {totalFat} / {goalFat}
            </div>
            <div className="w-full bg-[#07090e] h-1.5 rounded-full mt-2.5 overflow-hidden border border-[rgba(163,230,53,0.1)]">
              <div
                className="bg-amber-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (totalFat / goalFat) * 100)}%` }}
              />
            </div>
            <span className="text-xs text-[#94a3b8] font-mono mt-1 block">
              {language === "bn" ? "গ্রাম" : "grams"}
            </span>
          </div>
        </div>

        {/* Meal Logs Card */}
        <div className="bg-[rgba(18,24,38,0.7)] backdrop-blur-md border border-[rgba(163,230,53,0.2)] rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-black uppercase text-white">
              {dict.todayLoggedMeals}
            </h3>
            <span className="text-xs font-mono font-bold text-[#ccff00] bg-[#07090e] px-3 py-1 rounded-lg border border-[rgba(163,230,53,0.2)]">
              {meals.length} {language === "bn" ? "টি খাবার" : "meals"}
            </span>
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-xs text-[#94a3b8] animate-pulse font-mono">
              {language === "bn" ? "খাবারের তথ্য লোড হচ্ছে..." : "Loading nutrition logs..."}
            </div>
          ) : meals.length === 0 ? (
            /* Authentic Zero-State */
            <div className="py-12 px-4 rounded-xl bg-[#07090e]/60 border border-[rgba(163,230,53,0.15)] flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#121826] border border-[#a3e635]/30 flex items-center justify-center text-2xl text-[#ccff00]">
                🥗
              </div>
              <div className="max-w-md">
                <p className="text-sm font-bold text-white mb-1">
                  {dict.noMealsLogged}
                </p>
                <p className="text-xs text-[#94a3b8]">
                  {language === "bn"
                    ? "আজকের ক্যালোরি এবং প্রোটিন পর্যবেক্ষণ করতে খাবার রেকর্ড করা শুরু করুন।"
                    : "Track your macronutrients with precision to fuel muscle recovery and optimal energy."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="mt-2 px-4 py-2 rounded-lg bg-[#ccff00] text-black font-black text-xs uppercase tracking-wider hover:bg-[#d8ff33] transition-colors cursor-pointer"
              >
                {language === "bn" ? "+ প্রথম খাবার যোগ করুন" : "+ LOG FIRST MEAL"}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {meals.map((meal) => {
                const formattedTime = meal.created_at
                  ? new Date(meal.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Today";

                return (
                  <div
                    key={meal.id}
                    className="p-4 rounded-xl bg-[#07090e]/80 border border-[rgba(163,230,53,0.15)] hover:border-[rgba(163,230,53,0.3)] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div>
                      <h4 className="text-sm font-black text-white uppercase">
                        {meal.meal_name}
                      </h4>
                      <div className="text-xs text-[#94a3b8] font-mono mt-0.5">
                        {formattedTime}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono justify-between sm:justify-end">
                      <span className="text-white font-bold">{meal.calories} kcal</span>
                      <span className="text-[#ccff00] font-bold">{meal.protein}g P</span>
                      <span className="text-[#94a3b8]">{meal.carbs}g C</span>
                      <span className="text-[#94a3b8]">{meal.fat}g F</span>

                      <button
                        type="button"
                        onClick={() => handleDeleteMeal(meal.id)}
                        className="text-[#94a3b8] hover:text-rose-400 p-1 rounded transition-colors ml-2"
                        title={dict.deleteMeal}
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

      {/* Add Meal Dark Neon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-[#0c1017] border border-[rgba(163,230,53,0.35)] shadow-[0_0_40px_rgba(204,255,0,0.15)] p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(163,230,53,0.15)]">
              <div>
                <h3 className="text-lg font-black uppercase text-white tracking-tight">
                  {dict.logMealTitle}
                </h3>
                <p className="text-xs text-[#94a3b8] mt-0.5">
                  {dict.logMealDesc}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-[#94a3b8] hover:text-white p-1 rounded transition-colors text-lg font-mono"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddMeal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8] mb-1">
                  {dict.mealNameLabel}
                </label>
                <input
                  type="text"
                  required
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                  placeholder={dict.mealNamePlaceholder}
                  className="w-full bg-[#07090e] border border-[rgba(163,230,53,0.2)] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8] mb-1">
                    {dict.caloriesLabel}
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    placeholder="520"
                    className="w-full bg-[#07090e] border border-[rgba(163,230,53,0.2)] rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8] mb-1">
                    {dict.proteinLabel}
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={protein}
                    onChange={(e) => setProtein(e.target.value)}
                    placeholder="45"
                    className="w-full bg-[#07090e] border border-[rgba(163,230,53,0.2)] rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8] mb-1">
                    {dict.carbsLabel}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={carbs}
                    onChange={(e) => setCarbs(e.target.value)}
                    placeholder="60"
                    className="w-full bg-[#07090e] border border-[rgba(163,230,53,0.2)] rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8] mb-1">
                    {dict.fatLabel}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={fat}
                    onChange={(e) => setFat(e.target.value)}
                    placeholder="12"
                    className="w-full bg-[#07090e] border border-[rgba(163,230,53,0.2)] rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] transition-colors"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[rgba(163,230,53,0.2)] text-xs font-bold text-[#94a3b8] hover:text-white transition-colors cursor-pointer"
                >
                  {dict.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#ccff00] hover:bg-[#d8ff33] text-black font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(204,255,0,0.3)] transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? dict.savedToStorage : dict.saveMealBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 border-t border-[rgba(163,230,53,0.12)] bg-[#07090e]/95 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-[#94a3b8]">
          &copy; 2026 IRON & HABIT Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
