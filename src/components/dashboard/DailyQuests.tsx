"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export interface QuestItem {
  id: string | number;
  titleEn: string;
  titleBn: string;
  categoryEn: string;
  categoryBn: string;
  completed: boolean;
  points: string;
  isCustom?: boolean;
}

export const DEFAULT_CORE_HABITS: QuestItem[] = [
  {
    id: 1,
    titleEn: "5 Daily Prayers (Salah)",
    titleBn: "সালাত ৫ ওয়াক্ত",
    categoryEn: "SPIRITUAL / DISCIPLINE",
    categoryBn: "SPIRITUAL / DISCIPLINE",
    completed: false,
    points: "+100 XP",
  },
  {
    id: 2,
    titleEn: "Daily Workout Session",
    titleBn: "workout করা",
    categoryEn: "TRAINING",
    categoryBn: "TRAINING",
    completed: false,
    points: "+150 XP",
  },
  {
    id: 3,
    titleEn: "Nutritious Food Intake",
    titleBn: "পুষ্টিকর খাবার",
    categoryEn: "NUTRITION",
    categoryBn: "NUTRITION",
    completed: false,
    points: "+100 XP",
  },
  {
    id: 4,
    titleEn: "Strive for Mental Wellness",
    titleBn: "মানসিক সুস্থ থাকার চেষ্টা করা",
    categoryEn: "MENTAL HEALTH / WELLNESS",
    categoryBn: "MENTAL HEALTH / WELLNESS",
    completed: false,
    points: "+80 XP",
  },
  {
    id: 5,
    titleEn: "Control Unnecessary Phone Usage",
    titleBn: "অপ্রয়োজনীয় ফোন ব্যবহার নিয়ন্ত্রণ",
    categoryEn: "FOCUS / DISCIPLINE",
    categoryBn: "FOCUS / DISCIPLINE",
    completed: false,
    points: "+70 XP",
  },
  {
    id: 6,
    titleEn: "Learn Something New (30 Mins)",
    titleBn: "৩০ মিনিট নতুন কিছু শেখা",
    categoryEn: "GROWTH / LEARNING",
    categoryBn: "GROWTH / LEARNING",
    completed: false,
    points: "+90 XP",
  },
];

export function getInitialHabits(): QuestItem[] {
  if (typeof window === "undefined") {
    return DEFAULT_CORE_HABITS;
  }

  let customHabits: any[] = [];
  try {
    const customSaved = localStorage.getItem("user_custom_habits");
    if (customSaved) {
      const parsed = JSON.parse(customSaved);
      if (Array.isArray(parsed)) {
        customHabits = parsed;
      }
    }
  } catch {
    // ignore json parsing error
  }

  const combinedHabits: QuestItem[] = [
    ...DEFAULT_CORE_HABITS.map((item) => ({ ...item })),
    ...customHabits.map((item: any) => ({
      id: item.id || `custom-${item.createdAt || Date.now()}`,
      titleEn: item.title || item.titleEn || "Custom Habit",
      titleBn: item.title || item.titleBn || "কাস্টম অভ্যাস",
      categoryEn: item.categoryEn || "CUSTOM / DISCIPLINE",
      categoryBn: item.categoryBn || "কাস্টম / ডিসিপ্লিন",
      completed: false,
      points: item.points || "+50 XP",
      isCustom: true,
    })),
  ];

  try {
    const saved = localStorage.getItem("iron_daily_quests");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        // Discard legacy athletic 5-quest cache
        const isLegacy5Quests =
          parsed.length === 5 &&
          parsed.some((q: any) =>
            typeof q.titleEn === "string" && q.titleEn.includes("Chest & Triceps")
          );

        if (!isLegacy5Quests) {
          const completionMap = new Map<string | number, boolean>();
          parsed.forEach((item: any) => {
            if (item && item.id !== undefined) {
              completionMap.set(item.id, Boolean(item.completed));
            }
          });

          return combinedHabits.map((habit) => ({
            ...habit,
            completed: completionMap.get(habit.id) ?? false,
          }));
        }
      }
    }
  } catch {
    // ignore
  }

  return combinedHabits;
}

interface DailyQuestsProps {
  quests: QuestItem[];
  onToggleQuest: (id: string | number) => void;
  onAddCustomHabit: (title: string) => void;
  onRemoveCustomHabit?: (id: string | number) => void;
  streakDay: number;
  onMidnightReset: () => void;
}

export default function DailyQuests({
  quests,
  onToggleQuest,
  onAddCustomHabit,
  onRemoveCustomHabit,
  streakDay,
  onMidnightReset,
}: DailyQuestsProps) {
  const { dict, language } = useLanguage();
  const [isAdding, setIsAdding] = useState(false);
  const [newHabitTitle, setNewHabitTitle] = useState("");

  const completedQuestsCount = quests.filter((q) => q.completed).length;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newHabitTitle.trim();
    if (!trimmed) return;
    onAddCustomHabit(trimmed);
    setNewHabitTitle("");
    setIsAdding(false);
  };

  return (
    <div className="lg:col-span-7 bg-[rgba(18,24,38,0.7)] backdrop-blur-md border border-[rgba(163,230,53,0.2)] rounded-2xl p-6 shadow-xl flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[rgba(163,230,53,0.12)]">
          <div>
            <h3 className="text-lg font-black uppercase tracking-tight text-white">
              {dict.dailyQuests}
            </h3>
            <p className="text-xs text-[#94a3b8]">
              {dict.questsSubtitle}
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-[#ccff00] bg-[#07090e] px-3 py-1.5 rounded-lg border border-[rgba(163,230,53,0.2)] shadow-[0_0_10px_rgba(204,255,0,0.1)]">
            {completedQuestsCount} / {quests.length} {dict.completed}
          </span>
        </div>

        {/* Quests List */}
        <div className="space-y-3">
          {quests.map((quest) => (
            <div
              key={quest.id}
              onClick={() => onToggleQuest(quest.id)}
              className={`group/item p-3.5 rounded-xl border flex items-center justify-between gap-4 cursor-pointer transition-all duration-200 select-none ${
                quest.completed
                  ? "bg-[rgba(18,24,38,0.95)] border-[rgba(163,230,53,0.35)] shadow-[0_0_15px_rgba(204,255,0,0.08)]"
                  : "bg-[#07090e]/80 border-[rgba(163,230,53,0.12)] hover:border-[rgba(163,230,53,0.3)]"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Checkbox */}
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all shrink-0 ${
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

                {/* Habit details */}
                <div className="min-w-0">
                  <span
                    className={`text-xs sm:text-sm font-bold block transition-colors truncate ${
                      quest.completed
                        ? "text-white line-through opacity-70"
                        : "text-[#f9fafb]"
                    }`}
                  >
                    {language === "bn" ? quest.titleBn : quest.titleEn}
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#94a3b8]">
                      {language === "bn" ? quest.categoryBn : quest.categoryEn}
                    </span>
                    {quest.isCustom && (
                      <span className="text-[9px] font-mono font-bold text-[#ccff00] bg-[rgba(163,230,53,0.15)] px-1.5 py-0.2 rounded border border-[rgba(163,230,53,0.25)]">
                        {language === "bn" ? "কাস্টম" : "CUSTOM"}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: XP Badge & optional remove for custom habits */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-mono font-bold text-[#ccff00] whitespace-nowrap">
                  {quest.points}
                </span>
                {quest.isCustom && onRemoveCustomHabit && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveCustomHabit(quest.id);
                    }}
                    title={language === "bn" ? "অভ্যাসটি মুছুন" : "Delete habit"}
                    className="w-6 h-6 rounded-md flex items-center justify-center text-[#94a3b8] hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/30 transition-all"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Custom Habit Section */}
        <div className="mt-4">
          {!isAdding ? (
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className="w-full py-3 px-4 rounded-xl border border-dashed border-[rgba(163,230,53,0.28)] hover:border-[#ccff00] bg-[rgba(163,230,53,0.03)] hover:bg-[rgba(163,230,53,0.08)] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 group shadow-sm"
            >
              <div className="w-5 h-5 rounded-md bg-[#07090e] border border-[rgba(163,230,53,0.3)] group-hover:border-[#ccff00] flex items-center justify-center text-[#ccff00] transition-colors">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </div>
              <span className="text-[#f9fafb] group-hover:text-[#ccff00] transition-colors">
                {language === "bn"
                  ? "+ নিজের আরো অভ্যাস যোগ করুন"
                  : "+ Add Custom Habit"}
              </span>
            </button>
          ) : (
            <form
              onSubmit={handleAddSubmit}
              className="p-4 rounded-xl border border-[rgba(163,230,53,0.4)] bg-[#07090e] shadow-[0_0_20px_rgba(204,255,0,0.1)] space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-[#ccff00]">
                  {language === "bn"
                    ? "নিজের আরো অভ্যাস যোগ করুন"
                    : "Add Custom Habit"}
                </span>
                <span className="text-[10px] font-mono text-[#94a3b8]">
                  +50 XP
                </span>
              </div>
              <div>
                <input
                  type="text"
                  autoFocus
                  value={newHabitTitle}
                  onChange={(e) => setNewHabitTitle(e.target.value)}
                  placeholder={
                    language === "bn"
                      ? "অভ্যাসের নাম লিখুন (যেমন: ২০ মিনিট বই পড়া)"
                      : "Enter habit title (e.g. Read 20 mins)"
                  }
                  className="w-full bg-[#121826] border border-[rgba(163,230,53,0.25)] focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-[#94a3b8]/40 outline-none transition-all"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setNewHabitTitle("");
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#94a3b8] hover:text-white transition-colors"
                >
                  {language === "bn" ? "বাতিল" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={!newHabitTitle.trim()}
                  className="px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider bg-[#ccff00] hover:bg-[#b8e600] text-black disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_12px_rgba(204,255,0,0.3)] transition-all"
                >
                  {language === "bn" ? "অভ্যাস যোগ করুন" : "Save Habit"}
                </button>
              </div>
            </form>
          )}
        </div>
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
          onClick={onMidnightReset}
          className="text-[10px] font-mono text-[#94a3b8] hover:text-[#ccff00] border border-[rgba(163,230,53,0.2)] hover:border-[#ccff00] px-2.5 py-1 rounded-md transition-colors"
          title="Simulate 12:00 AM Midnight tracker reset"
        >
          🌙 {language === "bn" ? "মধ্যরাত রিসেট টেস্ট" : "Test 00:00 Reset"}
        </button>
      </div>
    </div>
  );
}
