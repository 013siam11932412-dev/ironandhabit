// Iron & Habit - Streak & History Storage Engine
// Handles 7-day cyclical streaks, 30-day telemetry retention, dynamic rolling weeks, and 00:00 midnight auto-reset.

export interface DailyRecord {
  id: string;
  date: string; // e.g. "11 Oct" or "১১ অক্টো"
  isoDate: string; // "YYYY-MM-DD"
  caloriesBurned: number;
  waterMl: number;
  habitsScore: number; // 0 - 100
  workoutVolumeKg?: number; // e.g. 8450 kg
  completedQuestsCount: number; // e.g. 4
  totalQuestsCount: number; // e.g. 5
  status: "completed" | "partial" | "rest";
}

export const STORAGE_KEYS = {
  STREAK: "iron_streak_day",
  LAST_DATE: "iron_last_active_date",
  HISTORY: "iron_30day_history",
  BMI: "iron_bmi_data",
  WATER: "iron_water_glasses",
  QUESTS: "iron_daily_quests",
} as const;

export const MONTH_NAMES_EN = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const MONTH_NAMES_BN = [
  "জানু",
  "ফেব",
  "মার্চ",
  "এপ্রিল",
  "মে",
  "জুন",
  "জুলাই",
  "আগস্ট",
  "সেপ্টে",
  "অক্টো",
  "নভে",
  "ডিসে",
];

export const DAY_NAMES_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const DAY_NAMES_BN = ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহঃ", "শুক্র", "শনি"];

// Helper to convert English digits to Bengali numerals
export function toBnDigits(num: number | string): string {
  const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(num).replace(/[0-9]/g, (d) => bnDigits[parseInt(d, 10)] || d);
}

// Helper to get formatted ISO date (YYYY-MM-DD)
export function getTodayIsoDate(referenceDate?: Date): string {
  const now = referenceDate || (typeof window !== "undefined" ? new Date() : new Date(2026, 9, 11));
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Helper to format Date into localized "DD Mon" (e.g. "11 Oct" / "১১ অক্টো")
export function formatDayLabel(d: Date, lang: "en" | "bn" = "en"): string {
  const dayNum = d.getDate();
  const month = lang === "bn" ? MONTH_NAMES_BN[d.getMonth()] : MONTH_NAMES_EN[d.getMonth()];
  const formattedDay = lang === "bn" ? toBnDigits(dayNum) : String(dayNum);
  return `${formattedDay} ${month}`;
}

// Helper to format Day into localized weekday (e.g. "Sun" / "রবি")
export function formatWeekday(d: Date, lang: "en" | "bn" = "en"): string {
  return lang === "bn" ? DAY_NAMES_BN[d.getDay()] : DAY_NAMES_EN[d.getDay()];
}

// Generate default 30-day telemetry seed based on dynamic or deterministic date
export function generateSeedHistory(referenceDate?: Date): DailyRecord[] {
  const records: DailyRecord[] = [];
  const base = referenceDate || (typeof window !== "undefined" ? new Date() : new Date(2026, 9, 11));

  for (let i = 29; i >= 0; i--) {
    const d = new Date(base);
    d.setDate(d.getDate() - i);
    const dayNum = d.getDate();
    const month = MONTH_NAMES_EN[d.getMonth()];
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(dayNum).padStart(2, "0")}`;

    const isRest = i % 7 === 0;
    const isPartial = i % 5 === 0 && !isRest;
    const calories = isRest
      ? 1820 + ((i * 13) % 250)
      : 2280 + ((i * 47) % 620);
    const water = isRest ? 1500 : Math.min(2500, 1750 + ((i * 125) % 750));
    const habitsScore = isRest ? 60 : isPartial ? 80 : 100;
    const completedQuests = isRest ? 3 : isPartial ? 4 : 5;
    const status: DailyRecord["status"] = isRest
      ? "rest"
      : isPartial
      ? "partial"
      : "completed";

    records.push({
      id: `seed-day-${i}`,
      date: `${dayNum} ${month}`,
      isoDate: iso,
      caloriesBurned: calories,
      waterMl: water,
      habitsScore,
      workoutVolumeKg: isRest ? 0 : 7200 + ((i * 350) % 3500),
      completedQuestsCount: completedQuests,
      totalQuestsCount: 5,
      status,
    });
  }

  return records;
}

// Retrieve 30-day history from localStorage
export function getStoredHistory(): DailyRecord[] {
  if (typeof window === "undefined") {
    return generateSeedHistory();
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (stored) {
      const parsed: DailyRecord[] = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.slice(0, 30);
      }
    }
  } catch {
    // ignore json error
  }
  const seed = generateSeedHistory();
  try {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(seed));
  } catch {
    // ignore
  }
  return seed;
}

// Persist 30-day history to localStorage (capped at 30 entries)
export function saveHistory(records: DailyRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    const capped = records.slice(0, 30);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(capped));
  } catch {
    // ignore
  }
}

// Retrieve streak day (1 to 7)
export function getStoredStreak(): number {
  if (typeof window === "undefined") return 5;
  try {
    const val = localStorage.getItem(STORAGE_KEYS.STREAK);
    if (val) {
      const parsed = parseInt(val, 10);
      if (parsed >= 1 && parsed <= 7) return parsed;
    }
  } catch {
    // ignore
  }
  return 5;
}

// Persist streak day (1 to 7 cycle)
export function saveStoredStreak(day: number): void {
  if (typeof window === "undefined") return;
  try {
    const validDay = day > 7 ? 1 : day < 1 ? 1 : day;
    localStorage.setItem(STORAGE_KEYS.STREAK, String(validDay));
  } catch {
    // ignore
  }
}

// Check BMI calculation status
export function hasCalculatedBmi(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return !!localStorage.getItem(STORAGE_KEYS.BMI);
  } catch {
    return false;
  }
}

// Midnight Date Detection & Reset Engine
export function checkAndRunMidnightReset(params?: {
  glassesCount?: number;
  completedQuests?: number;
  totalQuests?: number;
}): { didReset: boolean; updatedHistory: DailyRecord[] } {
  if (typeof window === "undefined") {
    return { didReset: false, updatedHistory: generateSeedHistory() };
  }

  try {
    const today = getTodayIsoDate();
    const lastActive = localStorage.getItem(STORAGE_KEYS.LAST_DATE);
    const history = getStoredHistory();

    // First time initializing
    if (!lastActive) {
      localStorage.setItem(STORAGE_KEYS.LAST_DATE, today);
      return { didReset: false, updatedHistory: history };
    }

    // Midnight rolled over (date changed)
    if (lastActive < today) {
      const glassesCount = params?.glassesCount ?? 8;
      const completedQuests = params?.completedQuests ?? 5;
      const totalQuests = params?.totalQuests ?? 5;
      const score = Math.round(
        ((completedQuests + glassesCount / 8) / (totalQuests + 1)) * 100
      );

      const [prevYear, prevMonth, prevDay] = lastActive.split("-").map(Number);
      const prevDateObj = new Date(
        prevYear || 2026,
        (prevMonth || 10) - 1,
        prevDay || 10
      );

      const archivedEntry: DailyRecord = {
        id: `archive-${lastActive}-${Date.now()}`,
        date: formatDayLabel(prevDateObj, "en"),
        isoDate: lastActive,
        caloriesBurned: 2420,
        waterMl: glassesCount * 250,
        habitsScore: score,
        workoutVolumeKg: 8250,
        completedQuestsCount: completedQuests,
        totalQuestsCount: totalQuests,
        status: score >= 80 ? "completed" : score >= 50 ? "partial" : "rest",
      };

      const newHistory = [archivedEntry, ...history.slice(0, 29)];
      saveHistory(newHistory);
      localStorage.setItem(STORAGE_KEYS.LAST_DATE, today);

      return { didReset: true, updatedHistory: newHistory };
    }
  } catch {
    // ignore
  }

  return { didReset: false, updatedHistory: getStoredHistory() };
}

// Manual trigger for testing/simulating midnight reset (00:00)
export function forceMidnightReset(params: {
  glassesCount: number;
  completedQuests: number;
  totalQuests: number;
}): { updatedHistory: DailyRecord[] } {
  const history = getStoredHistory();
  const glassesCount = params.glassesCount;
  const completedQuests = params.completedQuests;
  const totalQuests = params.totalQuests;
  const score = Math.round(
    ((completedQuests + glassesCount / 8) / (totalQuests + 1)) * 100
  );

  const today = getTodayIsoDate();
  const now = new Date();

  const archivedEntry: DailyRecord = {
    id: `archive-manual-${Date.now()}`,
    date: formatDayLabel(now, "en"),
    isoDate: today,
    caloriesBurned: 2450,
    waterMl: glassesCount * 250,
    habitsScore: score,
    workoutVolumeKg: 8400,
    completedQuestsCount: completedQuests,
    totalQuestsCount: totalQuests,
    status: score >= 80 ? "completed" : score >= 50 ? "partial" : "rest",
  };

  const newHistory = [archivedEntry, ...history.slice(0, 29)];
  saveHistory(newHistory);
  return { updatedHistory: newHistory };
}

// Build Dynamic Rolling 7-Day Performance Window
// Chronological: Oldest (6 days ago) on Left -> Today on Far Right
export function buildDynamicRolling7Days(
  referenceDate: Date,
  storedHistory: DailyRecord[],
  todayMetrics?: {
    caloriesBurned: number;
    waterMl: number;
    habitsScore: number;
    completedQuestsCount: number;
    totalQuestsCount: number;
  },
  lang: "en" | "bn" = "en"
): (DailyRecord & { weekday: string; isToday: boolean })[] {
  const result: (DailyRecord & { weekday: string; isToday: boolean })[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(referenceDate);
    d.setDate(d.getDate() - i);
    const dayNum = d.getDate();
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
    const isToday = i === 0;

    if (isToday && todayMetrics) {
      result.push({
        id: `rolling-today-${iso}`,
        date: formatDayLabel(d, lang),
        isoDate: iso,
        caloriesBurned: todayMetrics.caloriesBurned,
        waterMl: todayMetrics.waterMl,
        habitsScore: todayMetrics.habitsScore,
        completedQuestsCount: todayMetrics.completedQuestsCount,
        totalQuestsCount: todayMetrics.totalQuestsCount,
        status:
          todayMetrics.habitsScore >= 80
            ? "completed"
            : todayMetrics.habitsScore >= 50
            ? "partial"
            : "rest",
        weekday: formatWeekday(d, lang),
        isToday: true,
      });
    } else {
      const match = storedHistory.find((entry) => entry.isoDate === iso);
      if (match) {
        result.push({
          ...match,
          date: formatDayLabel(d, lang),
          weekday: formatWeekday(d, lang),
          isToday,
        });
      } else {
        // Sensible placeholder baseline bar for dynamic calendar day
        const isRest = i % 7 === 0;
        const isPartial = i % 5 === 0 && !isRest;
        const calories = isRest ? 1850 : 2250 + ((i * 45) % 450);
        const water = isRest ? 1500 : Math.min(2500, 1750 + ((i * 125) % 650));
        const habitsScore = isRest ? 60 : isPartial ? 80 : 100;
        result.push({
          id: `rolling-fallback-${iso}`,
          date: formatDayLabel(d, lang),
          isoDate: iso,
          caloriesBurned: calories,
          waterMl: water,
          habitsScore,
          completedQuestsCount: isRest ? 3 : isPartial ? 4 : 5,
          totalQuestsCount: 5,
          status: isRest ? "rest" : isPartial ? "partial" : "completed",
          weekday: formatWeekday(d, lang),
          isToday,
        });
      }
    }
  }

  return result;
}

// Build Dynamic Rolling 30-Day Window (30 consecutive days up to today)
export function buildDynamicRolling30Days(
  referenceDate: Date,
  storedHistory: DailyRecord[],
  todayMetrics?: {
    caloriesBurned: number;
    waterMl: number;
    habitsScore: number;
    completedQuestsCount: number;
    totalQuestsCount: number;
  },
  lang: "en" | "bn" = "en"
): (DailyRecord & { weekday: string; isToday: boolean })[] {
  const result: (DailyRecord & { weekday: string; isToday: boolean })[] = [];

  for (let i = 29; i >= 0; i--) {
    const d = new Date(referenceDate);
    d.setDate(d.getDate() - i);
    const dayNum = d.getDate();
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
    const isToday = i === 0;

    if (isToday && todayMetrics) {
      result.push({
        id: `rolling-today-${iso}`,
        date: formatDayLabel(d, lang),
        isoDate: iso,
        caloriesBurned: todayMetrics.caloriesBurned,
        waterMl: todayMetrics.waterMl,
        habitsScore: todayMetrics.habitsScore,
        completedQuestsCount: todayMetrics.completedQuestsCount,
        totalQuestsCount: todayMetrics.totalQuestsCount,
        status:
          todayMetrics.habitsScore >= 80
            ? "completed"
            : todayMetrics.habitsScore >= 50
            ? "partial"
            : "rest",
        weekday: formatWeekday(d, lang),
        isToday: true,
      });
    } else {
      const match = storedHistory.find((entry) => entry.isoDate === iso);
      if (match) {
        result.push({
          ...match,
          date: formatDayLabel(d, lang),
          weekday: formatWeekday(d, lang),
          isToday,
        });
      } else {
        const isRest = i % 7 === 0;
        const isPartial = i % 5 === 0 && !isRest;
        const calories = isRest ? 1820 + ((i * 13) % 250) : 2280 + ((i * 47) % 620);
        const water = isRest ? 1500 : Math.min(2500, 1750 + ((i * 125) % 750));
        const habitsScore = isRest ? 60 : isPartial ? 80 : 100;
        result.push({
          id: `rolling-fallback-${iso}`,
          date: formatDayLabel(d, lang),
          isoDate: iso,
          caloriesBurned: calories,
          waterMl: water,
          habitsScore,
          completedQuestsCount: isRest ? 3 : isPartial ? 4 : 5,
          totalQuestsCount: 5,
          status: isRest ? "rest" : isPartial ? "partial" : "completed",
          weekday: formatWeekday(d, lang),
          isToday,
        });
      }
    }
  }

  return result;
}
