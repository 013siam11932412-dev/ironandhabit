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
    getStarted: "GET STARTED",
    heroSubheadline:
      "A unified athletic tracker for progressive overload workouts, macronutrient nutrition, and daily hydration streaks.",
    viewDemo: "VIEW LIVE DEMO",
    signOut: "Sign Out",
    tryNow: "Try Now",
    explore: "Explore",

    // How It Works / 3-Step Onboarding Guide
    howItWorks: "HOW TO GET STARTED",
    howItWorksBadge: "3-STEP ONBOARDING PROTOCOL",
    howItWorksSubtitle:
      "Three simple steps to unlock your peak physical output, dial in nutrition, and cement unbroken streaks.",
    step1Title: "Create Your Profile",
    step1Desc:
      "Set up your account and calculate your baseline BMI and body telemetry index.",
    step2Title: "Log Daily Habits",
    step2Desc:
      "Log your exercises with sets and reps, track nutrition macros, and complete 250ml hydration glasses.",
    step3Title: "Level Up & Keep Streaks",
    step3Desc:
      "Earn XP, build consistent 7-day cyclical streaks, and monitor progressive overload over time.",

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

    // Auth & Modal
    signInTab: "Sign In",
    signUpTab: "Sign Up",
    authModalTitle: "ATHLETE PORTAL",
    authModalSubtitle: "Access your personalized training streak and telemetry",
    emailLabel: "EMAIL ADDRESS",
    emailPlaceholder: "athlete@ironandhabit.com",
    passwordLabel: "PASSWORD",
    passwordPlaceholder: "••••••••••••",
    fullNameLabel: "FULL NAME",
    fullNamePlaceholder: "Marcus Vance",
    signInBtn: "SIGN IN TO FORGE",
    signUpBtn: "CREATE ACCOUNT & START",
    authenticating: "AUTHENTICATING...",
    creatingAccount: "CREATING ACCOUNT...",
    alreadyHaveAccount: "Already have an active streak?",
    newToPlatform: "New to Iron & Habit?",
    forgotPassword: "Forgot?",
    logOut: "Log Out",
    welcomeUser: "Welcome",
    fillDemoUser: "Fill Demo",

    // Workout Planner
    workoutPlannerTitle: "WORKOUT PLANNER & LOG",
    workoutPlannerSubtitle:
      "Precision routine management, live set tracking, volume calculation, and rest pacing.",
    routineTemplates: "ROUTINE TEMPLATES",
    dailyRoutines: "DAILY ROUTINES",
    selectRoutine: "SELECT ROUTINE",
    pushDay: "Push (Chest / Shoulders / Triceps)",
    pullDay: "Pull (Back / Traps / Biceps)",
    legsDay: "Legs (Quads / Hamstrings / Calves)",
    fullBody: "Full Body (Compound Hypertrophy)",
    restDay: "Rest & Active Mobility",
    activeRoutine: "Active Routine",
    exercisesCount: "Exercises",
    setsCompleted: "Sets Completed",
    totalVolume: "Total Volume",
    workoutStreak: "Workout Streak",
    restTimer: "REST TIMER",
    restTimerDesc: "Interval recovery timer between heavy sets",
    startTimer: "START",
    pauseTimer: "PAUSE",
    resetTimer: "RESET",
    timerFinished: "REST PERIOD OVER! TIME FOR NEXT SET 🔥",
    addExerciseBtn: "+ ADD EXERCISE",
    addSetBtn: "+ ADD SET",
    removeExercise: "Remove",
    removeSet: "Remove",
    exerciseName: "Exercise Name",
    targetMuscle: "Target Muscle Group",
    chestMuscle: "Chest",
    backMuscle: "Back",
    shouldersMuscle: "Shoulders",
    bicepsMuscle: "Biceps",
    tricepsMuscle: "Triceps",
    legsMuscle: "Legs",
    coreMuscle: "Core / Abs",
    fullBodyMuscle: "Full Body",
    setNumber: "Set",
    weight: "Weight",
    reps: "Reps",
    unitKg: "KG",
    unitLbs: "LBS",
    markDone: "Done",
    customExerciseModalTitle: "ADD CUSTOM EXERCISE",
    customExerciseModalDesc:
      "Configure an exercise for your active training routine",
    cancel: "Cancel",
    saveExercise: "Save Exercise",
    savedToStorage: "Synced & Saved",
    finishWorkout: "COMPLETE WORKOUT SESSION",
    sessionSummary: "Session Summary",

    // Nutrition Tracking & Logs
    noMealsLogged: "No meals logged today. Click '+ Log Meal' to record your first meal.",
    logMealTitle: "LOG MEAL",
    logMealDesc: "Enter meal details to track your daily macronutrients and calories.",
    mealNameLabel: "MEAL NAME",
    mealNamePlaceholder: "e.g. Oats & Whey, Chicken Rice",
    caloriesLabel: "CALORIES (KCAL)",
    proteinLabel: "PROTEIN (G)",
    carbsLabel: "CARBS (G)",
    fatLabel: "FATS (G)",
    saveMealBtn: "SAVE MEAL",
    deleteMeal: "Delete meal",
    todayLoggedMeals: "TODAY'S LOGGED MEALS",
    noExercisesLogged: "No exercises logged today. Choose a routine or add an exercise below.",
    noBmiRecords: "No BMI records logged yet. Use the calculator above to record your first entry.",
    bmiHistoryTitle: "BMI & TELEMETRY HISTORY",
    bmiHistorySubtitle: "Historical log of your BMI calculations and body mass records.",
    deleteRecord: "Delete record",
    noWorkoutToday: "No workout logged today",

    // Smart Recommendations & Action Plans
    smartRecTitle: "SMART HEALTH & ACTION RECOMMENDATIONS",
    smartRecSubtitle: "Automated conditioning blueprint tailored to your biometric assessment and target physique.",
    goalGain: "Weight Gain & Muscle Building (Bulking)",
    goalGainShort: "Gain Weight",
    goalMaintain: "Stay Fit, Tone & Maintain (Maintenance)",
    goalMaintainShort: "Stay Fit",
    goalLose: "Sustainable Fat Loss & Conditioning (Deficit)",
    goalLoseShort: "Lose Weight",
    aiRecommendedBadge: "AI RECOMMENDED",
    actionPlanOverview: "ACTION PLAN OVERVIEW",
    nutritionTargetTitle: "DAILY NUTRITION TARGET",
    nutritionTargetDesc: "Calculated caloric and macronutrient distribution based on current body mass.",
    dailyCaloriesTarget: "Daily Calorie Target",
    proteinTarget: "Protein",
    carbsTarget: "Carbs",
    fatsTarget: "Healthy Fats",
    workoutProtocolTitle: "WORKOUT & TRAINING PROTOCOL",
    workoutProtocolDesc: "Optimized training split and weekly volume for targeted body composition.",
    routineSplit: "Routine Split",
    trainingFrequency: "Weekly Frequency",
    keyTrainingFocus: "Key Training Focus",
    openWorkoutPlanner: "Open Workout Planner",
    hydrationRecoveryTitle: "HYDRATION & RECOVERY BLUEPRINT",
    hydrationRecoveryDesc: "Metabolic hydration pacing and neural recovery standards.",
    recommendedWater: "Recommended Hydration",
    sleepTarget: "Deep Sleep Target",
    mobilityTarget: "Mobility & Rest",
    applyToDailyTargets: "Apply to Daily Targets",
    targetsAppliedSuccess: "Daily targets updated successfully! Synced with your dashboard.",
    targetCaloriesSynced: "Target Calories",
    targetWaterSynced: "Target Water",

    // AI Assistant
    aiAssistant: "AI Assistant",
    aiAssistantSubtitle: "Empathic Socratic Fitness & Nutrition Mentor",
    assistantWelcomeMsg: "Welcome friend! I am your Iron & Habit mentor. Whether you're taking your very first step or building unstoppable consistency, I'm here with you. What's on your mind today?",
    assistantPrompt1: "🌱 I'm a total beginner, where should I start?",
    assistantPrompt2: "🥗 Staying healthy with simple home-cooked meals",
    assistantPrompt3: "⏱️ Effective 10-minute workout for busy days",
    assistantPrompt4: "🔥 The secret to staying consistent & motivated",
    askAssistantPlaceholder: "Ask about workouts, home meals, habits, or starting out...",
    clearChat: "Clear Chat",
    thinking: "Reflecting on your journey and science...",
    aiContextBadge: "Biometrics Synced",

    // Community Hub
    community: "Community",
    communitySubtitle: "Squad Network & Live Athlete Board",
    squadTitle: "My Fitness Squad",
    squadSubtitle: "Connect with training partners via phone number",
    addFriendBtn: "Add to Squad",
    friendPhonePlaceholder: "+880 1712 345678",
    friendNamePlaceholder: "Friend's Nickname",
    shareProgressTitle: "Social Progress Sharing",
    shareProgressSubtitle: "Broadcast your streak & recruit squad members",
    shareOnFb: "Share on Facebook",
    copyReferralLink: "Copy Invite Link",
    linkCopiedToast: "Invite link copied to clipboard! 📋",
    chatTitle: "Squad Discussion & Shoutouts",
    chatSubtitle: "Live community feed • celebrate PRs and nutrition wins",
    postMessagePlaceholder: "Share a workout brag, tip, or ask a question...",
    sendMsgBtn: "Post",
    filterAll: "All Posts",
    filterWorkouts: "💪 Workout PRs",
    filterNutrition: "🥗 Nutrition Tips",
    filterGeneral: "🔥 General",
    bragWorkoutPrompt: "💪 Finished today's workout!",
    bragStreakPrompt: "🔥 Kept my 7-day streak!",
    bragNutritionPrompt: "🥗 Hit my protein goal today!",
    emptySquad: "No squad members yet. Add your friends using their phone number above!",
    emptyFeed: "No messages yet. Be the first to share your workout or tip with the squad!",
    squadChatTitle: "Iron & Habit Squad Chat",
    squadChatSubtitle: "Open community chatroom. Join anytime, leave anytime without admin restrictions.",
    joinGroupBtn: "Join Group",
    leaveGroupBtn: "Leave Group",
    typeMessagePlaceholder: "Type a message...",
    liveBadge: "Live",
    noMessagesInChat: "No messages in the chatroom yet. Say hello to the squad!",
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
    getStarted: "শুরু করুন",
    heroSubheadline:
      "ওয়ার্কআউট, প্রোগ্রেসিভ ওভারলোড, ম্যাক্রো পুষ্টি এবং দৈনিক হাইড্রেশন স্ট্রিকের একটি সমন্বিত আধুনিক প্ল্যাটফর্ম।",
    viewDemo: "লাইভ ডেমো",
    signOut: "লগআউট",
    tryNow: "এখনই দেখুন",
    explore: "এক্সপ্লোর",

    // How It Works / 3-Step Onboarding Guide
    howItWorks: "যেভাবে শুরু করবেন",
    howItWorksBadge: "৩-ধাপের কুইক গাইড",
    howItWorksSubtitle:
      "শারীরিক সক্ষমতা বৃদ্ধি, পুষ্টি নিয়ন্ত্রণ এবং অবিচল শৃঙ্খলা গড়ে তোলার ৩টি সহজ ধাপ।",
    step1Title: "প্রোফাইল তৈরি করুন",
    step1Desc:
      "আপনার অ্যাকাউন্ট সেট আপ করুন এবং বেসলাইন বিএমআই ও শারীরিক সূচক নির্ণয় করুন।",
    step2Title: "অভ্যাসগুলো ট্র্যাক করুন",
    step2Desc:
      "সেট ও রিপস সহ ব্যায়াম লগ করুন, ম্যাক্রো পুষ্টি পর্যবেক্ষণ করুন এবং ২৫০ মিলি পানির গ্লাস পূর্ণ করুন।",
    step3Title: "স্ট্রিক বজায় রাখুন",
    step3Desc:
      "এক্সপি (XP) অর্জন করুন, ৭-দিনের অবিচল সাইকেল স্ট্রিক গড়ে তুলুন এবং দীর্ঘমেয়াদী অগ্রগতি পর্যবেক্ষণ করুন।",

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

    // Auth & Modal
    signInTab: "সাইন ইন",
    signUpTab: "সাইন আপ",
    authModalTitle: "অ্যাথলিট পোর্টাল",
    authModalSubtitle: "আপনার ব্যক্তিগত স্ট্রিক ও টেলিমেট্রি দেখতে লগইন করুন",
    emailLabel: "ইমেইল এড্রেস",
    emailPlaceholder: "athlete@ironandhabit.com",
    passwordLabel: "পাসওয়ার্ড",
    passwordPlaceholder: "••••••••••••",
    fullNameLabel: "পূর্ণ নাম",
    fullNamePlaceholder: "আপনার নাম",
    signInBtn: "সাইন ইন করুন",
    signUpBtn: "একাউন্ট তৈরি করুন",
    authenticating: "যাচাই করা হচ্ছে...",
    creatingAccount: "একাউন্ট তৈরি হচ্ছে...",
    alreadyHaveAccount: "ইতিমধ্যে একাউন্ট আছে?",
    newToPlatform: "আয়রন অ্যান্ড হ্যাবিটে নতুন?",
    forgotPassword: "পাসওয়ার্ড ভুলে গেছেন?",
    logOut: "লগআউট",
    welcomeUser: "স্বাগতম",
    fillDemoUser: "ডেমো তথ্য",

    // Workout Planner
    workoutPlannerTitle: "ওয়ার্কআউট প্ল্যানার ও লগ",
    workoutPlannerSubtitle:
      "রুটিন পরিকল্পনা, লাইভ সেট ট্র্যাকিং, ভলিউম হিসাব এবং রেস্ট টাইমার।",
    routineTemplates: "রুটিন টেমপ্লেট",
    dailyRoutines: "দৈনিক রুটিন",
    selectRoutine: "রুটিন নির্বাচন করুন",
    pushDay: "পুশ (বুক / কাঁধ / ট্রাইসেপ)",
    pullDay: "পুল (পিঠ / ট্র্যাপস / বাইসেপ)",
    legsDay: "লেগস (কোয়াডস / হ্যামস্ট্রিং / কাফ)",
    fullBody: "ফুল বডি (কম্পাউন্ড হাইপারট্রফি)",
    restDay: "বিশ্রাম ও রিকভারি",
    activeRoutine: "সক্রিয় রুটিন",
    exercisesCount: "ব্যায়াম",
    setsCompleted: "সম্পন্ন সেট",
    totalVolume: "মোট ভলিউম",
    workoutStreak: "ওয়ার্কআউট স্ট্রিক",
    restTimer: "রেস্ট টাইমার",
    restTimerDesc: "ভারী সেটের মাঝে পর্যাপ্ত রিকভারি টাইমার",
    startTimer: "শুরু",
    pauseTimer: "বিরতি",
    resetTimer: "রিসেট",
    timerFinished: "বিশ্রাম শেষ! পরবর্তী সেট শুরু করুন 🔥",
    addExerciseBtn: "+ ব্যায়াম যোগ করুন",
    addSetBtn: "+ সেট যোগ করুন",
    removeExercise: "মুছুন",
    removeSet: "মুছুন",
    exerciseName: "ব্যায়ামের নাম",
    targetMuscle: "টার্গেট পেশী গ্রুপ",
    chestMuscle: "বুক (Chest)",
    backMuscle: "পিঠ (Back)",
    shouldersMuscle: "কাঁধ (Shoulders)",
    bicepsMuscle: "বাইসেপ (Biceps)",
    tricepsMuscle: "ট্রাইসেপ (Triceps)",
    legsMuscle: "পা (Legs)",
    coreMuscle: "অ্যাবস ও কোর (Core)",
    fullBodyMuscle: "ফুল বডি",
    setNumber: "সেট",
    weight: "ওজন",
    reps: "রিপস",
    unitKg: "কেজি",
    unitLbs: "পাউন্ড",
    markDone: "সম্পন্ন",
    customExerciseModalTitle: "নতুন ব্যায়াম যোগ করুন",
    customExerciseModalDesc:
      "আপনার ট্রেনিং রুটিনে নতুন ব্যায়াম কনফিগার করুন",
    cancel: "বাতিল",
    saveExercise: "সংরক্ষণ করুন",
    savedToStorage: "সংরক্ষিত হয়েছে",
    finishWorkout: "ওয়ার্কআউট সম্পন্ন করুন",
    sessionSummary: "সেশনের সংক্ষিপ্ত বিবরণ",

    // Nutrition Tracking & Logs
    noMealsLogged: "আজকে কোনো খাবার লগ করা হয়নি। আপনার প্রথম খাবার যোগ করতে '+ খাবার লগ করুন' এ ক্লিক করুন।",
    logMealTitle: "খাবার লগ করুন",
    logMealDesc: "দৈনিক ম্যাক্রো এবং ক্যালোরি পর্যবেক্ষণ করতে খাবারের বিবরণ দিন।",
    mealNameLabel: "খাবারের নাম",
    mealNamePlaceholder: "যেমন: ওটস ও প্রোটিন, ভাত ও চিকেন",
    caloriesLabel: "ক্যালরি (KCAL)",
    proteinLabel: "প্রোটিন (গ্রাম)",
    carbsLabel: "কার্বোহাইড্রেট (গ্রাম)",
    fatLabel: "ফ্যাট (গ্রাম)",
    saveMealBtn: "খাবার সংরক্ষণ করুন",
    deleteMeal: "মুছে ফেলুন",
    todayLoggedMeals: "আজকের খাদ্যতালিকা",
    noExercisesLogged: "আজকের কোনো ব্যায়াম লগ করা হয়নি। নিচে রুটিন নির্বাচন করুন বা ব্যায়াম যোগ করুন।",
    noBmiRecords: "এখনও কোনো বিএমআই রেকর্ড নেই। আপনার প্রথম রেকর্ড সংরক্ষণ করতে ক্যালকুলেটর ব্যবহার করুন।",
    bmiHistoryTitle: "বিএমআই হিস্ট্রি ও রেকর্ডস",
    bmiHistorySubtitle: "বিএমআই গণনা ও শরীরের ওজনের পূর্ববর্তী রেকর্ড তালিকা।",
    deleteRecord: "মুছে ফেলুন",
    noWorkoutToday: "আজকের কোনো ওয়ার্কআউট নেই",

    // Smart Recommendations & Action Plans
    smartRecTitle: "স্মার্ট স্বাস্থ্য ও অ্যাকশন পরামর্শ",
    smartRecSubtitle: "আপনার শারীরিক পরিমাপ ও লক্ষ্য অনুযায়ী স্বয়ংক্রিয় অ্যাথলেটিক ব্লুপ্রিন্ট।",
    goalGain: "ওজন ও পেশি বৃদ্ধি (বাল্কিং)",
    goalGainShort: "ওজন বাড়ানো",
    goalMaintain: "ফিট থাকা, টোন ও বজায় রাখা (মেইনটেন্যান্স)",
    goalMaintainShort: "ফিট থাকা",
    goalLose: "টেকসই মেদ হ্রাস ও কন্ডিশনিং (ডেফিসিট)",
    goalLoseShort: "ওজন কমানো",
    aiRecommendedBadge: "স্মার্ট প্রস্তাবিত",
    actionPlanOverview: "অ্যাকশন প্ল্যান ওভারভিউ",
    nutritionTargetTitle: "দৈনিক পুষ্টি ও ক্যালরি লক্ষ্য",
    nutritionTargetDesc: "বর্তমান শারীরিক ওজনের ভিত্তিতে নির্ধারিত ক্যালরি ও ম্যাক্রো পুষ্টি বণ্টন।",
    dailyCaloriesTarget: "দৈনিক ক্যালরি লক্ষ্য",
    proteinTarget: "প্রোটিন",
    carbsTarget: "কার্বোহাইড্রেট",
    fatsTarget: "স্বাস্থ্যকর ফ্যাট",
    workoutProtocolTitle: "ওয়ার্কআউট ও ট্রেনিং প্রোটোকল",
    workoutProtocolDesc: "কাঙ্ক্ষিত শরীর গঠনের জন্য নির্ধারিত ব্যায়ামের রুটিন ও সাপ্তাহিক ভলিউম।",
    routineSplit: "রুটিন স্প্লিট",
    trainingFrequency: "সাপ্তাহিক রুটিন",
    keyTrainingFocus: "মূল ফোকাস",
    openWorkoutPlanner: "ওয়ার্কআউট প্ল্যানারে যান",
    hydrationRecoveryTitle: "হাইড্রেশন ও রিকভারি ব্লুপ্রিন্ট",
    hydrationRecoveryDesc: "মেটাবলিক পানির ভারসাম্য এবং স্নায়বিক রিকভারি নির্দেশনা।",
    recommendedWater: "প্রস্তাবিত পানির পরিমাণ",
    sleepTarget: "পর্যাপ্ত ঘুম",
    mobilityTarget: "মোবিলিটি ও বিশ্রাম",
    applyToDailyTargets: "দৈনন্দিন লক্ষ্যে সেট করুন",
    targetsAppliedSuccess: "দৈনন্দিন লক্ষ্য সফলভাবে আপডেট করা হয়েছে! ড্যাশবোর্ডের সাথে সিঙ্ক হয়েছে।",
    targetCaloriesSynced: "লক্ষ্য ক্যালরি",
    targetWaterSynced: "লক্ষ্য পানি",

    // AI Assistant
    aiAssistant: "এআই সহকারী",
    aiAssistantSubtitle: "সহানুভূতিশীল ও বিজ্ঞানভিত্তিক ফিটনেস মেন্টর",
    assistantWelcomeMsg: "স্বাগতম বন্ধু! আমি আয়রন অ্যান্ড হ্যাবিট মেন্টর। আপনি একেবারে নতুন শুরু করতে চান কিংবা শরীরচর্চায় অনড় থাকতে চান—আমি আপনার পাশে আছি। আপনার ফিটনেস জার্নি নিয়ে আজ কী জানতে চান?",
    assistantPrompt1: "🌱 আমি একদম নতুন, কোথা থেকে শুরু করব? (I'm a total beginner)",
    assistantPrompt2: "🥗 সহজে ঘরোয়া খাবার দিয়ে সুস্থ থাকার উপায়",
    assistantPrompt3: "⏱️ ব্যস্ত দিনে ১০ মিনিটের কার্যকর ব্যায়াম",
    assistantPrompt4: "🔥 ব্যায়ামে আগ্রহ ধরে রাখার রহস্য কী?",
    askAssistantPlaceholder: "শরীরচর্চা, ঘরোয়া খাবার, নতুন অভ্যাস বা যেকোনো প্রশ্ন লিখুন...",
    clearChat: "নতুন চ্যাট",
    thinking: "আপনার ফিটনেস লক্ষ্য ও বিজ্ঞান বিশ্লেষণ করছে...",
    aiContextBadge: "শারীরিক ডেটা সিঙ্কড",

    // Community Hub
    community: "কমিউনিটি",
    communitySubtitle: "ফিটনেস স্কোয়াড ও লাইভ অ্যাথলেট বোর্ড",
    squadTitle: "আমার ফিটনেস স্কোয়াড",
    squadSubtitle: "ফোন নম্বরের মাধ্যমে পার্টনারদের সাথে যুক্ত হোন",
    addFriendBtn: "স্কোয়াডে যুক্ত করুন",
    friendPhonePlaceholder: "+৮৮০ ১৭১২ ৩৪৫৬৭৮",
    friendNamePlaceholder: "বন্ধুর নাম বা ডাকনাম",
    shareProgressTitle: "সোশ্যাল প্রগ্রেস শেয়ারিং",
    shareProgressSubtitle: "আপনার স্ট্রিক শেয়ার করুন এবং বন্ধুদের আমন্ত্রণ জানান",
    shareOnFb: "ফেসবুকে শেয়ার করুন",
    copyReferralLink: "ইনভাইট লিঙ্ক কপি করুন",
    linkCopiedToast: "আমন্ত্রণ লিঙ্ক ক্লিপবোর্ডে কপি হয়েছে! 📋",
    chatTitle: "স্কোয়াড আলোচনা ও সাফল্য",
    chatSubtitle: "লাইভ কমিউনিটি ফিড • নতুন রেকর্ড এবং ডায়েট জয়ের গল্প",
    postMessagePlaceholder: "ওয়ার্কআউট সাফল্য, ডায়েট টিপস বা যেকোনো প্রশ্ন লিখুন...",
    sendMsgBtn: "পোস্ট করুন",
    filterAll: "সকল পোস্ট",
    filterWorkouts: "💪 ওয়ার্কআউট পিআর",
    filterNutrition: "🥗 পুষ্টি ও ডায়েট",
    filterGeneral: "🔥 সাধারণ",
    bragWorkoutPrompt: "💪 আজকের ওয়ার্কআউট সম্পন্ন করেছি!",
    bragStreakPrompt: "🔥 ৭ দিনের স্ট্রিক অক্ষুণ্ণ রেখেছি!",
    bragNutritionPrompt: "🥗 আজকের প্রোটিন টার্গেট পূরণ করেছি!",
    emptySquad: "এখনও কোনো বন্ধু যুক্ত করা হয়নি। উপরে ফোন নম্বর দিয়ে বন্ধুদের যুক্ত করুন!",
    emptyFeed: "এখনও কোনো বার্তা নেই। আপনার ওয়ার্কআউট বা টিপ সবার সাথে শেয়ার করতে প্রথম মেসেজটি লিখুন!",
    squadChatTitle: "স্কোয়াড গ্রুপ চ্যাট",
    squadChatSubtitle: "উন্মুক্ত কমিউনিটি চ্যাটরুম। যেকোনো সময় অ্যাডমিন অনুমতি ছাড়াই যোগ দিন ও ত্যাগ করুন।",
    joinGroupBtn: "গ্রুপে যুক্ত হোন",
    leaveGroupBtn: "গ্রুপ ত্যাগ করুন",
    typeMessagePlaceholder: "মেসেজ লিখুন...",
    liveBadge: "লাইভ",
    noMessagesInChat: "গ্রুপে এখনও কোনো বার্তা নেই। প্রথম বার্তা পাঠিয়ে আলোচনা শুরু করুন!",
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
