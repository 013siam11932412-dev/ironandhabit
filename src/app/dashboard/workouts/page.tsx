"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import LanguageToggle from "@/components/LanguageToggle";
import RestTimer from "@/components/workout/RestTimer";
import CustomExerciseModal from "@/components/workout/CustomExerciseModal";
import {
  WorkoutRoutine,
  WorkoutExercise,
  DEFAULT_ROUTINES,
  getStoredRoutines,
  saveStoredRoutines,
  getStoredActiveRoutineId,
  saveStoredActiveRoutineId,
  getStoredWeightUnit,
  saveStoredWeightUnit,
  calculateRoutineVolume,
  calculateCompletedSetsCount,
} from "@/lib/workoutStorage";
import { getStoredStreak, saveStoredStreak } from "@/lib/storage";

export default function WorkoutPlannerPage() {
  const pathname = usePathname();
  const router = useRouter();
  const { dict, language } = useLanguage();
  const { user, signOut } = useAuth();

  // Routines state
  const [routines, setRoutines] = useState<WorkoutRoutine[]>(() =>
    getStoredRoutines()
  );
  const [activeRoutineId, setActiveRoutineId] = useState<string>(() =>
    getStoredActiveRoutineId()
  );
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">(() =>
    getStoredWeightUnit()
  );
  const [streakDay, setStreakDay] = useState<number>(() => getStoredStreak());

  // Modal & feedback state
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [completedNotice, setCompletedNotice] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    saveStoredRoutines(routines);
  }, [routines]);

  useEffect(() => {
    saveStoredActiveRoutineId(activeRoutineId);
  }, [activeRoutineId]);

  useEffect(() => {
    saveStoredWeightUnit(weightUnit);
  }, [weightUnit]);

  // Current active routine
  const currentRoutine =
    routines.find((r) => r.id === activeRoutineId) || routines[0] || DEFAULT_ROUTINES[0];

  // Telemetry aggregates
  const { completed: completedSets, total: totalSets } =
    calculateCompletedSetsCount(currentRoutine);
  const totalVolume = calculateRoutineVolume(currentRoutine);
  const completionPercentage =
    totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;
  const estimatedCalories = Math.round(completedSets * 35 + totalVolume * 0.02);

  // Toggle set completed
  function handleToggleSet(exerciseId: string, setId: string) {
    setRoutines((prev) =>
      prev.map((routine) => {
        if (routine.id !== activeRoutineId) return routine;
        return {
          ...routine,
          exercises: routine.exercises.map((ex) => {
            if (ex.id !== exerciseId) return ex;
            return {
              ...ex,
              sets: ex.sets.map((s) => {
                if (s.id !== setId) return s;
                return { ...s, completed: !s.completed };
              }),
            };
          }),
        };
      })
    );
  }

  // Update set weight or reps
  function handleUpdateSet(
    exerciseId: string,
    setId: string,
    field: "weight" | "reps",
    value: number
  ) {
    setRoutines((prev) =>
      prev.map((routine) => {
        if (routine.id !== activeRoutineId) return routine;
        return {
          ...routine,
          exercises: routine.exercises.map((ex) => {
            if (ex.id !== exerciseId) return ex;
            return {
              ...ex,
              sets: ex.sets.map((s) => {
                if (s.id !== setId) return s;
                return { ...s, [field]: Math.max(0, value) };
              }),
            };
          }),
        };
      })
    );
  }

  // Add new set to exercise
  function handleAddSet(exerciseId: string) {
    setRoutines((prev) =>
      prev.map((routine) => {
        if (routine.id !== activeRoutineId) return routine;
        return {
          ...routine,
          exercises: routine.exercises.map((ex) => {
            if (ex.id !== exerciseId) return ex;
            const lastSet = ex.sets[ex.sets.length - 1];
            const newSet = {
              id: `set-${Date.now()}`,
              setNumber: ex.sets.length + 1,
              weight: lastSet ? lastSet.weight : 50,
              reps: lastSet ? lastSet.reps : 10,
              completed: false,
            };
            return {
              ...ex,
              sets: [...ex.sets, newSet],
            };
          }),
        };
      })
    );
  }

  // Remove set from exercise
  function handleRemoveSet(exerciseId: string, setId: string) {
    setRoutines((prev) =>
      prev.map((routine) => {
        if (routine.id !== activeRoutineId) return routine;
        return {
          ...routine,
          exercises: routine.exercises.map((ex) => {
            if (ex.id !== exerciseId) return ex;
            const filtered = ex.sets.filter((s) => s.id !== setId);
            const reindexed = filtered.map((s, idx) => ({
              ...s,
              setNumber: idx + 1,
            }));
            return {
              ...ex,
              sets: reindexed,
            };
          }),
        };
      })
    );
  }

  // Remove exercise from routine
  function handleRemoveExercise(exerciseId: string) {
    setRoutines((prev) =>
      prev.map((routine) => {
        if (routine.id !== activeRoutineId) return routine;
        return {
          ...routine,
          exercises: routine.exercises.filter((ex) => ex.id !== exerciseId),
        };
      })
    );
  }

  // Add custom exercise to routine
  function handleAddCustomExercise(exercise: WorkoutExercise) {
    setRoutines((prev) =>
      prev.map((routine) => {
        if (routine.id !== activeRoutineId) return routine;
        return {
          ...routine,
          exercises: [...routine.exercises, exercise],
        };
      })
    );
  }

  // Finish workout session
  function handleFinishWorkout() {
    // Mark all sets completed
    setRoutines((prev) =>
      prev.map((routine) => {
        if (routine.id !== activeRoutineId) return routine;
        return {
          ...routine,
          exercises: routine.exercises.map((ex) => ({
            ...ex,
            sets: ex.sets.map((s) => ({ ...s, completed: true })),
          })),
        };
      })
    );

    // Increment streak if not at max
    setStreakDay((prev) => {
      const next = prev >= 7 ? 1 : prev + 1;
      saveStoredStreak(next);
      return next;
    });

    setCompletedNotice(
      language === "bn"
        ? "অভিনন্দন! আজকের ওয়ার্কআউট সফলভাবে সম্পন্ন হয়েছে এবং স্ট্রিক সংরক্ষিত হয়েছে! 🔥"
        : "Session completed! Volume recorded and streak bonus locked in! 🔥"
    );
    setTimeout(() => setCompletedNotice(null), 6000);
  }

  const navTabs = [
    { name: dict.overview, href: "/dashboard" },
    { name: dict.bmi, href: "/dashboard/bmi" },
    { name: dict.workouts, href: "/dashboard/workouts" },
    { name: dict.nutrition, href: "/dashboard/nutrition" },
  ];

  const daysOfWeek = [
    { id: "push", labelEn: "MON", labelBn: "সোম", routineId: "push" },
    { id: "pull", labelEn: "TUE", labelBn: "মঙ্গল", routineId: "pull" },
    { id: "legs", labelEn: "WED", labelBn: "বুধ", routineId: "legs" },
    { id: "push2", labelEn: "THU", labelBn: "বৃহ", routineId: "push" },
    { id: "pull2", labelEn: "FRI", labelBn: "শুক্র", routineId: "pull" },
    { id: "legs2", labelEn: "SAT", labelBn: "শনি", routineId: "legs" },
    { id: "rest", labelEn: "SUN", labelBn: "রবি", routineId: "rest" },
  ];

  return (
    <div className="relative min-h-screen bg-[#07090e] text-[#f9fafb] flex flex-col justify-between selection:bg-[#ccff00] selection:text-black">
      {/* Ambient Lighting */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 right-1/4 w-[650px] h-[400px] bg-[#ccff00]/[0.04] blur-[170px] rounded-full" />
        <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-[#a3e635]/[0.03] blur-[160px] rounded-full" />
      </div>

      {/* Top Header */}
      <header className="relative z-30 w-full border-b border-[rgba(163,230,53,0.15)] bg-[#07090e]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-[#121826] border border-[#a3e635]/40 flex items-center justify-center text-[#ccff00] shadow-[0_0_15px_rgba(204,255,0,0.2)] group-hover:border-[#ccff00] transition-colors">
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

            <div className="flex items-center gap-2.5 sm:gap-3">
              <LanguageToggle />

              {/* 7-Day Streak Badge */}
              <div
                title="7-Day Cyclical Streak Tracker"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(18,24,38,0.85)] border border-[rgba(163,230,53,0.35)] shadow-[0_0_15px_rgba(204,255,0,0.2)]"
              >
                <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
                <span className="text-xs font-black uppercase text-[#ccff00] tracking-wider font-mono">
                  {language === "bn"
                    ? `দিন ${streakDay} / ৭ 🔥`
                    : `Day ${streakDay} / 7 🔥`}
                </span>
              </div>

              {/* User Avatar Badge if logged in */}
              {user && (
                <div
                  title={user.email || "Athlete"}
                  className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[rgba(18,24,38,0.9)] border border-[#a3e635]/40 shadow-[0_0_15px_rgba(204,255,0,0.2)]"
                >
                  <div className="w-6 h-6 rounded-full bg-[#ccff00] text-black font-black text-xs flex items-center justify-center uppercase shadow-[0_0_8px_rgba(204,255,0,0.4)]">
                    {(
                      user.user_metadata?.full_name?.[0] ||
                      user.email?.[0] ||
                      "A"
                    ).toUpperCase()}
                  </div>
                  <span className="hidden md:inline-block text-xs font-bold text-white max-w-[100px] truncate">
                    {user.user_metadata?.full_name ||
                      user.email?.split("@")[0] ||
                      "Athlete"}
                  </span>
                </div>
              )}

              <button
                type="button"
                onClick={async () => {
                  await signOut();
                  router.push("/");
                }}
                className="text-xs font-bold text-[#94a3b8] hover:text-[#ccff00] px-2.5 py-1.5 rounded-lg border border-[rgba(163,230,53,0.15)] hover:border-[rgba(163,230,53,0.35)] transition-colors cursor-pointer uppercase tracking-wider"
              >
                {dict.signOut}
              </button>
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

      {/* Main Workspace */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* Completion Toast Banner */}
        {completedNotice && (
          <div className="p-4 rounded-2xl bg-emerald-500/15 border border-[#ccff00] text-sm font-bold text-[#ccff00] flex items-center justify-between shadow-[0_0_25px_rgba(204,255,0,0.25)] animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">🏆</span>
              <span>{completedNotice}</span>
            </div>
            <span className="font-mono text-xs text-white uppercase bg-[#121826] px-2.5 py-1 rounded-md border border-[#ccff00]/30">
              LOGGED
            </span>
          </div>
        )}

        {/* 1. Top Section: Title & Routine Day Selector */}
        <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2 border-b border-[rgba(163,230,53,0.12)]">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#ccff00] mb-1">
              <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
              <span>{dict.activeRoutine}</span>
              <span className="text-[#94a3b8] font-mono">
                • {language === "bn" ? currentRoutine.dayNameBn : currentRoutine.dayNameEn}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
              {language === "bn" ? currentRoutine.nameBn : currentRoutine.nameEn}
            </h1>
            <p className="text-xs text-[#94a3b8] mt-1 max-w-2xl">
              {dict.workoutPlannerSubtitle}
            </p>
          </div>

          {/* Routine Switcher Tabs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Unit Switcher: KG vs LBS */}
            <div className="inline-flex items-center p-1 rounded-xl bg-[#07090e] border border-[rgba(163,230,53,0.25)]">
              <button
                type="button"
                onClick={() => setWeightUnit("kg")}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-black uppercase transition-all ${
                  weightUnit === "kg"
                    ? "bg-[#ccff00] text-black shadow-[0_0_12px_rgba(204,255,0,0.3)]"
                    : "text-[#94a3b8] hover:text-white"
                }`}
              >
                {dict.unitKg}
              </button>
              <button
                type="button"
                onClick={() => setWeightUnit("lbs")}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-black uppercase transition-all ${
                  weightUnit === "lbs"
                    ? "bg-[#ccff00] text-black shadow-[0_0_12px_rgba(204,255,0,0.3)]"
                    : "text-[#94a3b8] hover:text-white"
                }`}
              >
                {dict.unitLbs}
              </button>
            </div>

            {/* Add Exercise Modal Trigger */}
            <button
              type="button"
              onClick={() => setIsCustomModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-[#ccff00] hover:bg-[#d8ff33] text-black font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(204,255,0,0.35)] active:scale-95 transition-all whitespace-nowrap"
            >
              {dict.addExerciseBtn}
            </button>
          </div>
        </section>

        {/* 2. Daily Routine Template Pills & Day of Week Selector */}
        <section className="space-y-3">
          {/* Day of Week Quick Switcher */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#94a3b8] whitespace-nowrap mr-1">
              {dict.dailyRoutines}:
            </span>
            {daysOfWeek.map((day) => {
              const isSelected = activeRoutineId === day.routineId;
              return (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => setActiveRoutineId(day.routineId)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all whitespace-nowrap border ${
                    isSelected
                      ? "bg-[#ccff00] text-black border-[#ccff00] shadow-[0_0_12px_rgba(204,255,0,0.25)]"
                      : "bg-[#07090e] border-[rgba(163,230,53,0.15)] text-[#94a3b8] hover:text-white"
                  }`}
                >
                  {language === "bn" ? day.labelBn : day.labelEn}
                </button>
              );
            })}
          </div>

          {/* Routine Templates Selector Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {routines.map((routine) => {
              const isSelected = activeRoutineId === routine.id;
              return (
                <button
                  key={routine.id}
                  type="button"
                  onClick={() => setActiveRoutineId(routine.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "bg-[rgba(18,24,38,0.9)] border-[#ccff00] shadow-[0_0_15px_rgba(204,255,0,0.2)]"
                      : "bg-[#07090e]/70 border-[rgba(163,230,53,0.15)] hover:border-[rgba(163,230,53,0.35)]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs font-black uppercase ${
                        isSelected ? "text-[#ccff00]" : "text-white"
                      }`}
                    >
                      {routine.category.toUpperCase()}
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
                    )}
                  </div>
                  <div className="text-[10px] text-[#94a3b8] truncate">
                    {routine.exercises.length} {dict.exercisesCount}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* 3. Stats & Summary Widget + Rest Timer Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (7 cols): Telemetry Stats Cards */}
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Stat 1: Sets Completed */}
              <div className="bg-[rgba(18,24,38,0.7)] backdrop-blur-md border border-[rgba(163,230,53,0.2)] rounded-2xl p-4 shadow-md">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#94a3b8] block">
                  {dict.setsCompleted}
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black text-[#ccff00] font-mono">
                    {completedSets}
                  </span>
                  <span className="text-xs text-[#94a3b8] font-mono">
                    / {totalSets}
                  </span>
                </div>
                <div className="w-full bg-[#07090e] h-1.5 rounded-full overflow-hidden mt-2">
                  <div
                    className="bg-[#ccff00] h-full rounded-full transition-all duration-300"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>

              {/* Stat 2: Total Volume */}
              <div className="bg-[rgba(18,24,38,0.7)] backdrop-blur-md border border-[rgba(163,230,53,0.2)] rounded-2xl p-4 shadow-md">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#94a3b8] block">
                  {dict.totalVolume}
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black text-white font-mono">
                    {totalVolume.toLocaleString()}
                  </span>
                  <span className="text-xs text-[#ccff00] font-mono uppercase">
                    {weightUnit}
                  </span>
                </div>
                <span className="text-[10px] text-[#94a3b8] font-mono mt-1 block">
                  {completedSets > 0 ? "Active Load" : "Pending Sets"}
                </span>
              </div>

              {/* Stat 3: Completion Streak */}
              <div className="bg-[rgba(18,24,38,0.7)] backdrop-blur-md border border-[rgba(163,230,53,0.2)] rounded-2xl p-4 shadow-md">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#94a3b8] block">
                  {dict.workoutStreak}
                </span>
                <div className="text-2xl font-black text-[#ccff00] font-mono mt-1">
                  {language === "bn" ? `দিন ${streakDay}` : `Day ${streakDay}`}
                </div>
                <span className="text-[10px] text-[#94a3b8] font-mono mt-1 block">
                  {streakDay >= 7 ? "Cycle Ready 🔥" : "7-Day Peak"}
                </span>
              </div>

              {/* Stat 4: Estimated Calories */}
              <div className="bg-[rgba(18,24,38,0.7)] backdrop-blur-md border border-[rgba(163,230,53,0.2)] rounded-2xl p-4 shadow-md">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#94a3b8] block">
                  {dict.dailyCalories}
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black text-white font-mono">
                    {estimatedCalories}
                  </span>
                  <span className="text-xs text-[#94a3b8] font-mono">kcal</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono mt-1 block">
                  Burn Rate: Live
                </span>
              </div>
            </div>

            {/* Quick Finish Session CTA */}
            <div className="p-4 rounded-2xl bg-[rgba(18,24,38,0.6)] border border-[rgba(163,230,53,0.18)] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-black uppercase text-white">
                  {dict.sessionSummary}
                </h4>
                <p className="text-xs text-[#94a3b8] mt-0.5">
                  {completedSets === totalSets && totalSets > 0
                    ? language === "bn"
                      ? "সবগুলো সেট সম্পন্ন হয়েছে! অধিবেশনটি সংরক্ষণ করুন।"
                      : "All sets crushed! Lock in this session to boost your streak."
                    : `${totalSets - completedSets} ${
                        language === "bn" ? "সেট বাকি রয়েছে" : "sets remaining"
                      }`}
                </p>
              </div>
              <button
                type="button"
                onClick={handleFinishWorkout}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#a3e635] to-[#ccff00] hover:brightness-110 text-black font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(204,255,0,0.35)] active:scale-95 transition-all whitespace-nowrap"
              >
                {dict.finishWorkout} &rarr;
              </button>
            </div>
          </div>

          {/* Right Column (5 cols): Built-In Rest Timer */}
          <div className="lg:col-span-5">
            <RestTimer />
          </div>
        </section>

        {/* 4. Main Exercise Logging Board */}
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-2">
            <h2 className="text-lg font-black uppercase text-white tracking-tight">
              {language === "bn" ? "আজকের অনুশীলন তালিকা" : "EXERCISE PROTOCOLS"}
            </h2>
            <span className="text-xs font-mono text-[#ccff00] bg-[#07090e] px-3 py-1 rounded-lg border border-[rgba(163,230,53,0.2)]">
              {currentRoutine.exercises.length} {dict.exercisesCount}
            </span>
          </div>

          {currentRoutine.exercises.length === 0 ? (
            <div className="p-10 rounded-2xl bg-[rgba(18,24,38,0.5)] border border-dashed border-[rgba(163,230,53,0.2)] text-center">
              <span className="text-3xl block mb-2">🏋️</span>
              <p className="text-sm text-[#94a3b8]">
                {language === "bn"
                  ? "এই রুটিনে এখনও কোনো ব্যায়াম যুক্ত করা হয়নি।"
                  : "No exercises in this routine yet. Add your first exercise!"}
              </p>
              <button
                type="button"
                onClick={() => setIsCustomModalOpen(true)}
                className="mt-4 px-5 py-2.5 rounded-xl bg-[#ccff00] text-black font-black text-xs uppercase"
              >
                {dict.addExerciseBtn}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {currentRoutine.exercises.map((exercise) => {
                const isAllCompleted =
                  exercise.sets.length > 0 &&
                  exercise.sets.every((s) => s.completed);
                const isPartiallyCompleted =
                  exercise.sets.some((s) => s.completed) && !isAllCompleted;

                return (
                  <div
                    key={exercise.id}
                    className="bg-[rgba(18,24,38,0.7)] backdrop-blur-md border border-[rgba(163,230,53,0.2)] rounded-2xl p-5 sm:p-6 shadow-xl transition-all"
                  >
                    {/* Exercise Card Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-[rgba(163,230,53,0.12)]">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <h3 className="text-base font-black text-white uppercase tracking-tight">
                            {language === "bn"
                              ? exercise.nameBn
                              : exercise.nameEn}
                          </h3>
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-[#07090e] border border-[rgba(163,230,53,0.25)] text-[#ccff00]">
                            {exercise.targetMuscle}
                          </span>
                        </div>
                        <span className="text-xs text-[#94a3b8] font-mono mt-1 block">
                          {exercise.sets.length} {dict.setNumber}s •{" "}
                          {exercise.sets.filter((s) => s.completed).length}{" "}
                          {dict.completed}
                        </span>
                      </div>

                      {/* Header Controls */}
                      <div className="flex items-center gap-2.5 self-start sm:self-auto">
                        <span
                          className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
                            isAllCompleted
                              ? "text-[#ccff00] border-[#ccff00]/40 bg-[#ccff00]/10"
                              : isPartiallyCompleted
                              ? "text-amber-400 border-amber-400/40 bg-amber-400/10"
                              : "text-[#94a3b8] border-[#94a3b8]/20 bg-[#07090e]"
                          }`}
                        >
                          {isAllCompleted
                            ? dict.statusCompleted
                            : isPartiallyCompleted
                            ? dict.statusPartial
                            : dict.statusRest}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleAddSet(exercise.id)}
                          className="px-3 py-1.5 rounded-lg bg-[#07090e] border border-[rgba(163,230,53,0.25)] hover:border-[#ccff00] text-xs font-bold uppercase text-[#ccff00] transition-colors"
                        >
                          {dict.addSetBtn}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemoveExercise(exercise.id)}
                          className="w-7 h-7 rounded-lg bg-[#07090e] border border-red-500/20 text-red-400 hover:border-red-500 flex items-center justify-center text-xs transition-colors"
                          title="Remove Exercise"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    {/* Sets Logging Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-mono">
                        <thead>
                          <tr className="text-[#94a3b8] border-b border-[rgba(163,230,53,0.1)]">
                            <th className="py-2.5 px-3 w-16 uppercase">
                              {dict.setNumber}
                            </th>
                            <th className="py-2.5 px-3 uppercase">
                              {dict.weight} ({weightUnit.toUpperCase()})
                            </th>
                            <th className="py-2.5 px-3 uppercase">
                              {dict.reps}
                            </th>
                            <th className="py-2.5 px-3 text-center w-28 uppercase">
                              {dict.markDone}
                            </th>
                            <th className="py-2.5 px-3 text-right w-12"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[rgba(163,230,53,0.06)]">
                          {exercise.sets.map((set) => (
                            <tr
                              key={set.id}
                              className={`transition-colors ${
                                set.completed
                                  ? "bg-[rgba(163,230,53,0.06)]"
                                  : "hover:bg-[rgba(18,24,38,0.5)]"
                              }`}
                            >
                              {/* Set # */}
                              <td className="py-3 px-3 font-bold text-white">
                                #{set.setNumber}
                              </td>

                              {/* Weight Input */}
                              <td className="py-3 px-3">
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="number"
                                    min={0}
                                    step={0.5}
                                    value={set.weight}
                                    onChange={(e) =>
                                      handleUpdateSet(
                                        exercise.id,
                                        set.id,
                                        "weight",
                                        Number(e.target.value)
                                      )
                                    }
                                    className="w-20 bg-[#07090e] border border-[rgba(163,230,53,0.2)] rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-[#ccff00]"
                                  />
                                  <span className="text-[10px] text-[#94a3b8] uppercase">
                                    {weightUnit}
                                  </span>
                                </div>
                              </td>

                              {/* Reps Input */}
                              <td className="py-3 px-3">
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="number"
                                    min={1}
                                    max={100}
                                    value={set.reps}
                                    onChange={(e) =>
                                      handleUpdateSet(
                                        exercise.id,
                                        set.id,
                                        "reps",
                                        Number(e.target.value)
                                      )
                                    }
                                    className="w-16 bg-[#07090e] border border-[rgba(163,230,53,0.2)] rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-[#ccff00]"
                                  />
                                  <span className="text-[10px] text-[#94a3b8]">
                                    reps
                                  </span>
                                </div>
                              </td>

                              {/* Completed Checkbox */}
                              <td className="py-3 px-3 text-center">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleToggleSet(exercise.id, set.id)
                                  }
                                  className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase transition-all duration-200 inline-flex items-center gap-1.5 ${
                                    set.completed
                                      ? "bg-[#ccff00] text-black shadow-[0_0_12px_rgba(204,255,0,0.4)]"
                                      : "bg-[#07090e] border border-[rgba(163,230,53,0.25)] text-[#94a3b8] hover:border-[#ccff00] hover:text-white"
                                  }`}
                                >
                                  {set.completed ? "✓ DONE" : "CHECK"}
                                </button>
                              </td>

                              {/* Remove Set Button */}
                              <td className="py-3 px-3 text-right">
                                {exercise.sets.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRemoveSet(exercise.id, set.id)
                                    }
                                    className="text-xs text-[#94a3b8] hover:text-red-400 px-1.5 py-1 transition-colors"
                                    title="Delete set"
                                  >
                                    ✕
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Custom Exercise Adder Modal */}
      <CustomExerciseModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onAddExercise={handleAddCustomExercise}
        weightUnit={weightUnit}
      />

      {/* Footer */}
      <footer className="relative z-10 border-t border-[rgba(163,230,53,0.12)] bg-[#07090e]/95 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-[#94a3b8]">
          &copy; 2026 IRON & HABIT Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
