"use client";

import React, { createContext, useContext, useSyncExternalStore } from "react";

export type Language = "en" | "bn";

export const translations = {
  en: {
    // Brand & Nav
    brand: "IRON & HABIT",
    home: "Home",
    workouts: "Workouts",
    nutrition: "Nutrition",
    progress: "Progress",
    dashboard: "Dashboard",
    bmi: "BMI & Body",
    overview: "Overview",
    login: "Log In",
    joinFree: "JOIN FREE",
    startJourney: "START YOUR JOURNEY",
    viewDemo: "VIEW LIVE DEMO",
    signOut: "Sign Out",

    // Landing Hero
    trainSmarter: "TRAIN SMARTER",
    strongerEveryDay: "STRONGER EVERY DAY",
    heroSubtitle:
      "Eliminate guesswork. Build relentless physical strength, dial in precision macronutrients, and cement unbreakable habits with the ultimate athletic conditioning platform.",
    workoutTracker: "Workout Tracker",
    nutritionPlans: "Nutrition Plans",
    dailyHabit: "Daily Habit",
    trackProgress: "Track Progress",
    peakHeartRate: "PEAK HEART RATE",
    caloriesBurned: "CALORIES BURNED",
    workoutsCompleted: "WORKOUTS COMPLETED",
    activeStreak: "ACTIVE STREAK 🔥",
    performanceSuite: "HIGH PERFORMANCE SUITE",
    engineeredSupremacy: "ENGINEERED FOR SUPREMACY",
    suiteSubtitle:
      "Four hyper-focused modules built to synchronize training, nutrition, hydration, and telemetry into one unbroken cycle.",
    exploreModule: "EXPLORE MODULE",

    // Dashboard
    dashboardTitle: "DASHBOARD",
    streak14Days: "14 DAYS 🔥",
    dailyCalories: "DAILY CALORIES",
    remaining: "remaining",
    target: "Target",
    workoutTime: "WORKOUT TIME",
    completed: "Completed",
    waterIntake: "WATER INTAKE",
    glasses: "Glasses",
    unbrokenStreak: "UNBROKEN STREAK",
    dailyDiscipline: "DAILY DISCIPLINE",
    ironHabitScore: "Iron Habit Score",
    habitExceptional:
      "Exceptional consistency! You are locked in for peak athletic output.",
    habitPending:
      "Complete remaining quests and water targets to secure today's streak.",
    hydrationProtocol: "HYDRATION PROTOCOL",
    clickGlass: "Click glass to log intake (250 ml / glass)",
    quickFillAll: "Quick Fill All",
    dailyQuests: "DAILY ATHLETIC QUESTS",
    questsSubtitle: "Check off targets to lock in your daily streak bonus",
    connectedModules: "CONNECTED MODULES & TELEMETRY",

    // BMI & Body
    bmiTelemetry: "BMI & BODY TELEMETRY",
    bmiTitle: "BMI & BODY COMPOSITION",
    bmiSubtitle:
      "Compute mass-to-height index and maintain precision records of your chest, waist, and arm circumference development.",
    calculateBmi: "CALCULATE BMI",
    calculateBmiSubtitle: "Enter height and body mass to evaluate body status.",
    heightFeet: "FEET (FT)",
    heightInches: "INCHES (IN)",
    bodyWeightKg: "BODY WEIGHT (KG)",
    recalculateBmi: "RECALCULATE BMI",
    sampleProfiles: "Sample Profiles:",
    classificationMeter: "BMI CLASSIFICATION METER",
    whoSpectrum: "World Health Organization metric spectrum",
    indexScore: "INDEX SCORE",
    underweight: "Underweight",
    normalWeight: "Normal",
    overweight: "Overweight",
    obese: "Obese",
    bodyCircumferenceLog: "BODY CIRCUMFERENCE LOG (CM)",
    circumferenceSubtitle:
      "Track actual lean hypertrophy and waist reduction beyond the scale.",
    chest: "CHEST (CM)",
    waist: "WAIST (CM)",
    biceps: "BICEPS (CM)",
    recordEntry: "+ RECORD ENTRY",
    recordDate: "RECORD DATE",
    trend: "TREND",
    latestLog: "Latest Log:",

    // 7-Day Cyclical Streak & 30-Day Progress Board
    streakPrefix: "Day",
    streakOutOfSeven: "/ 7 🔥",
    bmiPrereqNotice:
      "⚠️ To activate the 30-Day Progress Chart Board, please calculate & record your BMI and body metrics first",
    calcBmiBtn: "Measure BMI",
    chartBoardTitle: "30-DAY TELEMETRY & PROGRESS BOARD",
    chartBoardSubtitle:
      "Historical telemetry of daily calories burned, water hydration, and habit completion rate",
    metricCalories: "Calories Burned",
    metricWater: "Water Intake (ml)",
    metricCompletion: "Habits Completed (%)",
    chartHistoryLogs: "30-DAY RECORDED LOGS",
    avgCalories: "Avg Daily Calories",
    avgHydration: "Avg Hydration",
    consistencyRate: "Consistency Rate",
    bestCycle: "Best Streak Cycle",
    chartLocked: "CHART BOARD LOCKED",
    chartLockedDesc:
      "Calculate your BMI in the Body module to unlock full 30-day analytics and trend projections.",
    unlockNow: "UNLOCK NOW",
    statusCompleted: "Completed",
    statusPartial: "Partial",
    statusRest: "Rest / Pending",
    tableDate: "Date",
    tableCalories: "Calories",
    tableWater: "Water (ml)",
    tableHabits: "Habit Score",
    tableStatus: "Status",
    last7Days: "Last 7 Days (1 Week)",
    last30Days: "Last 30 Days (1 Month)",
    monthlyChartBoard: "Monthly Chart Board",
    questsStatus: "Quests Status",
    result: "Result",
    streak7DaysBadge: "7 Days 🔥",
    viewRange: "Time Range",
    performanceTrends: "Performance Trends",
  },
  bn: {
    // Brand & Nav
    brand: "আয়রন অ্যান্ড হ্যাবিট",
    home: "হোম",
    workouts: "ওয়ার্কআউট",
    nutrition: "পুষ্টি",
    progress: "অগ্রগতি",
    dashboard: "ড্যাশবোর্ড",
    bmi: "বিএমআই ও শরীর",
    overview: "ওভারভিউ",
    login: "লগইন",
    joinFree: "যুক্ত হোন",
    startJourney: "যাত্রা শুরু করুন",
    viewDemo: "লাইভ ডেমো",
    signOut: "লগআউট",

    // Landing Hero
    trainSmarter: "স্মার্ট অনুশীলন",
    strongerEveryDay: "প্রতিদিন আরও শক্তিশালী",
    heroSubtitle:
      "অনুমান বাদ দিন। গড়ে তুলুন অবিচল শারীরিক শক্তি, নিশ্চিত করুন সঠিক পুষ্টি এবং বজায় রাখুন অনন্য শৃঙ্খলা ও ধারাবাহিকতা।",
    workoutTracker: "ওয়ার্কআউট ট্র্যাকার",
    nutritionPlans: "পুষ্টি পরিকল্পনা",
    dailyHabit: "দৈনিক অভ্যাস",
    trackProgress: "অগ্রগতি ট্র্যাক",
    peakHeartRate: "শীর্ষ হার্ট রেট",
    caloriesBurned: "ক্যালরি খরচ",
    workoutsCompleted: "সম্পন্ন ওয়ার্কআউট",
    activeStreak: "সক্রিয় স্ট্রিক 🔥",
    performanceSuite: "উচ্চ পারফরম্যান্স স্যুট",
    engineeredSupremacy: "দক্ষতার জন্য তৈরি",
    suiteSubtitle:
      "ব্যায়াম, পুষ্টি, পর্যাপ্ত পানি এবং দৈহিক অগ্রগতি পর্যবেক্ষণ করার সমন্বিত আধুনিক প্ল্যাটফর্ম।",
    exploreModule: "মডিউল দেখুন",

    // Dashboard
    dashboardTitle: "ড্যাশবোর্ড",
    streak14Days: "১৪ দিন 🔥",
    dailyCalories: "দৈনিক ক্যালরি",
    remaining: "অবশিষ্ট",
    target: "লক্ষ্য",
    workoutTime: "ওয়ার্কআউটের সময়",
    completed: "সম্পন্ন",
    waterIntake: "পানি গ্রহণ",
    glasses: "গ্লাস",
    unbrokenStreak: "অবিচ্ছিন্ন ধারাবাহিকতা",
    dailyDiscipline: "দৈনিক শৃঙ্খলা",
    ironHabitScore: "আয়রন হ্যাবিট স্কোর",
    habitExceptional:
      "চমৎকার ধারাবাহিকতা! আপনার আজকের লক্ষ্য প্রায় পূর্ণ হয়েছে।",
    habitPending:
      "আজকের স্ট্রিক সুরক্ষিত করতে অবশিষ্ট টাস্ক ও পানির লক্ষ্য পূরণ করুন।",
    hydrationProtocol: "হাইড্রেশন প্রোটোকল",
    clickGlass: "পানির পরিমাণ যোগ করতে গ্লাসে ক্লিক করুন (২৫০ মিলি / গ্লাস)",
    quickFillAll: "সব পূর্ণ করুন",
    dailyQuests: "দৈনিক লক্ষ্য ও টাস্ক",
    questsSubtitle: "দৈনিক স্ট্রিক বজায় রাখতে লক্ষ্যগুলো সম্পন্ন করুন",
    connectedModules: "সংযুক্ত মডিউল ও ডেটা",

    // BMI & Body
    bmiTelemetry: "বিএমআই ও শারীরিক পরিমাপ",
    bmiTitle: "বিএমআই ও শরীর গঠন",
    bmiSubtitle:
      "উচ্চতা ও ওজনের অনুপাত নির্ণয় করুন এবং বুক, কোমর ও বাইসেপসের সঠিক বৃদ্ধি পর্যবেক্ষণ করুন।",
    calculateBmi: "বিএমআই হিসাব করুন",
    calculateBmiSubtitle:
      "শারীরিক অবস্থা মূল্যায়ন করতে উচ্চতা ও ওজন প্রবেশ করান।",
    heightFeet: "উচ্চতা: ফুট (FT)",
    heightInches: "ইঞ্চি (IN)",
    bodyWeightKg: "ওজন (কেজি)",
    recalculateBmi: "পুনরায় হিসাব করুন",
    sampleProfiles: "নমুনা প্রোফাইল:",
    classificationMeter: "বিএমআই পরিমাপক স্কেল",
    whoSpectrum: "বিশ্ব স্বাস্থ্য সংস্থা (WHO) মানদণ্ড",
    indexScore: "বিএমআই স্কোর",
    underweight: "কম ওজন",
    normalWeight: "স্বাভাবিক ওজন",
    overweight: "অতিরিক্ত ওজন",
    obese: "স্থূলতা",
    bodyCircumferenceLog: "শারীরিক পরিমাপ লগ (সেমি)",
    circumferenceSubtitle:
      "ওজন ছাড়াও পেশির সঠিক বৃদ্ধি এবং কোমরের পরিবর্তন ট্র্যাক করুন।",
    chest: "বুক (সেমি)",
    waist: "কোমর (সেমি)",
    biceps: "বাইসেপ (সেমি)",
    recordEntry: "+ তথ্য যোগ করুন",
    recordDate: "তারিখ",
    trend: "ট্রেন্ড",
    latestLog: "সর্বশেষ লগ:",

    // 7-Day Cyclical Streak & 30-Day Progress Board
    streakPrefix: "দিন",
    streakOutOfSeven: "/ ৭ 🔥",
    bmiPrereqNotice:
      "⚠️ চার্ট বোর্ড চালু করতে প্রথমে আপনার BMI ও শারীরিক পরিমাপ হিসাব করুন",
    calcBmiBtn: "BMI মাপুন",
    chartBoardTitle: "৩০ দিনের অগ্রগতি ও টেলিমেট্রি বোর্ড",
    chartBoardSubtitle:
      "গত ৩০ দিনের দৈনিক ক্যালরি খরচ, পানি গ্রহণ এবং অভ্যাসের ইতিহাস পর্যবেক্ষণ করুন",
    metricCalories: "ক্যালরি খরচ",
    metricWater: "পানি গ্রহণ (মিলি)",
    metricCompletion: "অভ্যাস সমাপ্তি (%)",
    chartHistoryLogs: "৩০ দিনের সংরক্ষিত ইতিহাস",
    avgCalories: "গড় দৈনিক ক্যালরি",
    avgHydration: "গড় পানি গ্রহণ",
    consistencyRate: "ধারাবাহিকতা রেটিং",
    bestCycle: "সেরা স্ট্রিক সাইকেল",
    chartLocked: "চার্ট বোর্ড লক করা",
    chartLockedDesc:
      "৩০ দিনের সম্পূর্ণ অ্যানালিটিক্স ও ট্রেন্ড আনলক করতে প্রথমে বডি মডিউলে গিয়ে আপনার BMI হিসাব করুন।",
    unlockNow: "এখনই আনলক করুন",
    statusCompleted: "সম্পূর্ণ",
    statusPartial: "আংশিক",
    statusRest: "বিশ্রাম / অসমাপ্ত",
    tableDate: "তারিখ",
    tableCalories: "ক্যালরি",
    tableWater: "পানি (মিলি)",
    tableHabits: "হ্যাবিট স্কোর",
    tableStatus: "অবস্থা",
    last7Days: "গত ৭ দিন (১ সপ্তাহ)",
    last30Days: "গত ৩০ দিন (১ মাস)",
    monthlyChartBoard: "মাসিক চার্ট বোর্ড",
    questsStatus: "লক্ষ্য",
    result: "ফলাফল",
    streak7DaysBadge: "৭ দিন 🔥",
    viewRange: "সময়কাল",
    performanceTrends: "পারফরম্যান্স ট্রেন্ড",
  },
};

export type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;
  dict: typeof translations.en;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

let currentLang: Language = "en";
const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function getSnapshot(): Language {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("iron_lang") as Language;
      if (saved === "en" || saved === "bn") return saved;
    } catch {
      // ignore
    }
  }
  return currentLang;
}

function getServerSnapshot(): Language {
  return "en";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const language = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function setLanguage(lang: Language) {
    currentLang = lang;
    try {
      localStorage.setItem("iron_lang", lang);
    } catch {
      // ignore
    }
    listeners.forEach((l) => l());
  }

  function toggleLanguage() {
    setLanguage(language === "en" ? "bn" : "en");
  }

  function t(key: TranslationKey): string {
    return translations[language][key] || translations.en[key] || key;
  }

  const dict = translations[language];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        dict,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
