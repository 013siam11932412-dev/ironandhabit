"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import LanguageToggle from "@/components/LanguageToggle";
import RestTimer from "@/components/workout/RestTimer";
import WorkoutLocationSelector from "@/components/workout/WorkoutLocationSelector";
import {
  WorkoutRoutine,
  WorkoutExercise,
  WorkoutSet,
  DEFAULT_ROUTINES,
  getStoredRoutines,
  saveStoredRoutines,
  getStoredActiveRoutineId,
  saveStoredActiveRoutineId,
  getStoredWeightUnit,
  saveStoredWeightUnit,
} from "@/lib/workoutStorage";
import { getStoredStreak, saveStoredStreak, getTodayIsoDate } from "@/lib/storage";
import {
  fetchTodayWorkoutLogs,
  saveWorkoutLog,
  deleteWorkoutLog,
  fetchDailyMetrics,
  upsertDailyMetrics,
} from "@/lib/db";

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

  // Load today's workout logs from Supabase / localStorage on mount and user change
  useEffect(() => {
    let mounted = true;
    fetchTodayWorkoutLogs(user?.id).then((logs) => {
      if (!mounted || !logs || logs.length === 0) return;

      setRoutines((prev) =>
        prev.map((routine) => ({
          ...routine,
          exercises: routine.exercises.map((ex) => {
            const matchingLogs = logs.filter(
              (l) => l.exercise_name.toLowerCase() === ex.nameEn.toLowerCase()
            );
            if (matchingLogs.length === 0) return ex;

            // Merge logged sets into routine exercise
            const updatedSets = ex.sets.map((s) => {
              const matchedLog = matchingLogs.find((l) => l.set_number === s.setNumber);
              if (matchedLog) {
                return {
                  ...s,
                  id: String(matchedLog.id),
                  weight: matchedLog.weight,
                  reps: matchedLog.reps,
                  completed: matchedLog.completed,
                };
              }
              return s;
            });
            return { ...ex, sets: updatedSets };
          }),
        }))
      );
    });

    return () => {
      mounted = false;
    };
  }, [user]);

  // Current active routine
  const currentRoutine =
    routines.find((r) => r.id === activeRoutineId) || routines[0] || DEFAULT_ROUTINES[0];


  // Toggle set completed (writes to public.workout_logs)
  function handleToggleSet(exerciseId: string, setId: string) {
    let targetEx: WorkoutExercise | undefined;
    let targetSet: WorkoutSet | undefined;

    setRoutines((prev) =>
      prev.map((routine) => {
        if (routine.id !== activeRoutineId) return routine;
        return {
          ...routine,
          exercises: routine.exercises.map((ex) => {
            if (ex.id !== exerciseId) return ex;
            targetEx = ex;
            return {
              ...ex,
              sets: ex.sets.map((s) => {
                if (s.id !== setId) return s;
                targetSet = { ...s, completed: !s.completed };
                return targetSet;
              }),
            };
          }),
        };
      })
    );

    if (targetEx && targetSet) {
      saveWorkoutLog(user?.id || null, {
        id: targetSet.id,
        exercise_name: targetEx.nameEn,
        set_number: targetSet.setNumber,
        weight: targetSet.weight,
        reps: targetSet.reps,
        completed: targetSet.completed,
      });
    }
  }

  // Update set weight or reps (writes to public.workout_logs)
  function handleUpdateSet(
    exerciseId: string,
    setId: string,
    field: "weight" | "reps",
    value: number
  ) {
    let targetEx: WorkoutExercise | undefined;
    let targetSet: WorkoutSet | undefined;

    setRoutines((prev) =>
      prev.map((routine) => {
        if (routine.id !== activeRoutineId) return routine;
        return {
          ...routine,
          exercises: routine.exercises.map((ex) => {
            if (ex.id !== exerciseId) return ex;
            targetEx = ex;
            return {
              ...ex,
              sets: ex.sets.map((s) => {
                if (s.id !== setId) return s;
                targetSet = { ...s, [field]: Math.max(0, value) };
                return targetSet;
              }),
            };
          }),
        };
      })
    );

    if (targetEx && targetSet) {
      saveWorkoutLog(user?.id || null, {
        id: targetSet.id,
        exercise_name: targetEx.nameEn,
        set_number: targetSet.setNumber,
        weight: targetSet.weight,
        reps: targetSet.reps,
        completed: targetSet.completed,
      });
    }
  }

  // Add new set to exercise (inserts into public.workout_logs)
  async function handleAddSet(exerciseId: string) {
    const ex = currentRoutine.exercises.find((e) => e.id === exerciseId);
    if (!ex) return;
    const lastSet = ex.sets[ex.sets.length - 1];
    const newSetNumber = ex.sets.length + 1;
    const newWeight = lastSet ? lastSet.weight : 50;
    const newReps = lastSet ? lastSet.reps : 10;

    const saved = await saveWorkoutLog(user?.id || null, {
      exercise_name: ex.nameEn,
      set_number: newSetNumber,
      weight: newWeight,
      reps: newReps,
      completed: false,
    });

    const newSet: WorkoutSet = {
      id: String(saved.id),
      setNumber: newSetNumber,
      weight: newWeight,
      reps: newReps,
      completed: false,
    };

    setRoutines((prev) =>
      prev.map((routine) => {
        if (routine.id !== activeRoutineId) return routine;
        return {
          ...routine,
          exercises: routine.exercises.map((e) => {
            if (e.id !== exerciseId) return e;
            return {
              ...e,
              sets: [...e.sets, newSet],
            };
          }),
        };
      })
    );
  }

  // Remove set from exercise (deletes from public.workout_logs)
  function handleRemoveSet(exerciseId: string, setId: string) {
    deleteWorkoutLog(user?.id || null, setId);
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

  // Finish workout session (locks in all sets, updates streak and daily_metrics)
  async function handleFinishWorkout() {
    // Mark all sets completed and persist each to workout_logs
    setRoutines((prev) =>
      prev.map((routine) => {
        if (routine.id !== activeRoutineId) return routine;
        return {
          ...routine,
          exercises: routine.exercises.map((ex) => ({
            ...ex,
            sets: ex.sets.map((s) => {
              saveWorkoutLog(user?.id || null, {
                id: s.id,
                exercise_name: ex.nameEn,
                set_number: s.setNumber,
                weight: s.weight,
                reps: s.reps,
                completed: true,
              });
              return { ...s, completed: true };
            }),
          })),
        };
      })
    );

    // Increment streak if not at max
    const nextStreak = streakDay >= 7 ? 1 : streakDay + 1;
    setStreakDay(nextStreak);
    saveStoredStreak(nextStreak);

    // Sync with daily_metrics
    const today = getTodayIsoDate();
    const existing = await fetchDailyMetrics(user?.id || null, today);
    await upsertDailyMetrics(user?.id || null, {
      date: today,
      water_ml: existing?.water_ml || 0,
      calories_consumed: existing?.calories_consumed || 0,
      streak_count: nextStreak,
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
    { name: dict.aiAssistant, href: "/dashboard/assistant" },
    { name: dict.community, href: "/dashboard/community" },
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



        {/* 3. Built-In Rest Timer & Location Selector */}
        <section className="flex flex-col items-center justify-center gap-6">
          <RestTimer />
          <WorkoutLocationSelector />
        </section>

      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[rgba(163,230,53,0.12)] bg-[#07090e]/95 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-[#94a3b8]">
          &copy; 2026 IRON & HABIT Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
