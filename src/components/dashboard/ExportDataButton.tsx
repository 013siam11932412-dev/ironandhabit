"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { getStoredHistory, getStoredStreak } from "@/lib/storage";
import { getStoredRoutines, getStoredWeightUnit } from "@/lib/workoutStorage";
import {
  getLocalNutritionLogs,
  getLocalWorkoutLogs,
  getAllLocalDailyMetrics,
  getLocalBmiRecords,
  fetchAllDailyMetrics,
  fetchBmiRecords,
  fetchTodayNutritionLogs,
  fetchTodayWorkoutLogs,
} from "@/lib/db";

export default function ExportDataButton() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [isExporting, setIsExporting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleExport() {
    if (isExporting) return;
    setIsExporting(true);

    try {
      // 1. Gather localStorage data safely
      const streakDay = getStoredStreak();
      const history30Days = getStoredHistory();
      const routines = getStoredRoutines();
      const weightUnit = getStoredWeightUnit();
      const localNutrition = getLocalNutritionLogs();
      const localWorkouts = getLocalWorkoutLogs();
      const localMetrics = getAllLocalDailyMetrics();
      const localBmi = getLocalBmiRecords();

      let customCalorieTarget: number | null = null;
      let waterGlasses: boolean[] = [];
      let dailyQuests: unknown[] = [];
      let activeRoutineId: string | null = null;

      if (typeof window !== "undefined") {
        try {
          const calTargetStr = localStorage.getItem("iron_custom_calorie_target");
          if (calTargetStr) customCalorieTarget = parseInt(calTargetStr, 10);
        } catch {}

        try {
          const glassesStr = localStorage.getItem("iron_water_glasses");
          if (glassesStr) waterGlasses = JSON.parse(glassesStr);
        } catch {}

        try {
          const questsStr = localStorage.getItem("iron_daily_quests");
          if (questsStr) dailyQuests = JSON.parse(questsStr);
        } catch {}

        try {
          activeRoutineId = localStorage.getItem("iron_active_routine_id");
        } catch {}
      }

      // 2. Fetch cloud-synced data if user is logged in
      let remoteDailyMetrics: unknown[] = [];
      let remoteBmiRecords: unknown[] = [];
      let remoteTodayNutrition: unknown[] = [];
      let remoteTodayWorkouts: unknown[] = [];

      if (user?.id) {
        try {
          const [metrics, bmi, nut, wkt] = await Promise.allSettled([
            fetchAllDailyMetrics(user.id),
            fetchBmiRecords(user.id),
            fetchTodayNutritionLogs(user.id),
            fetchTodayWorkoutLogs(user.id),
          ]);

          if (metrics.status === "fulfilled") remoteDailyMetrics = metrics.value;
          if (bmi.status === "fulfilled") remoteBmiRecords = bmi.value;
          if (nut.status === "fulfilled") remoteTodayNutrition = nut.value;
          if (wkt.status === "fulfilled") remoteTodayWorkouts = wkt.value;
        } catch (err) {
          console.warn("Could not fetch remote user data for export:", err);
        }
      }

      // 3. Compile full user data payload
      const exportPayload = {
        metadata: {
          application: "Iron & Habit",
          version: "1.0",
          exportDate: new Date().toISOString(),
          platform: typeof window !== "undefined" ? window.navigator.userAgent : "Web",
        },
        userProfile: user
          ? {
              id: user.id,
              email: user.email,
              name: user.user_metadata?.full_name || null,
              createdAt: user.created_at,
            }
          : {
              type: "guest",
            },
        telemetry: {
          streakDay,
          customCalorieTarget: customCalorieTarget || 2400,
          todayWaterGlasses: waterGlasses,
          todayQuests: dailyQuests,
          history30Days,
          dailyMetrics: {
            local: localMetrics,
            synced: remoteDailyMetrics,
          },
        },
        workouts: {
          preferredWeightUnit: weightUnit,
          activeRoutineId,
          routines,
          logs: {
            local: localWorkouts,
            synced: remoteTodayWorkouts,
          },
        },
        nutrition: {
          logs: {
            local: localNutrition,
            synced: remoteTodayNutrition,
          },
        },
        bodyComposition: {
          bmiRecords: {
            local: localBmi,
            synced: remoteBmiRecords,
          },
        },
      };

      // 4. Create and trigger download
      const jsonString = JSON.stringify(exportPayload, null, 2);
      const blob = new Blob([jsonString], { type: "application/json;charset=utf-8" });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const dateStr = new Date().toISOString().slice(0, 10);
      link.href = downloadUrl;
      link.download = `iron-and-habit-data-${dateStr}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2500);
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={isExporting}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer active:scale-95 ${
        isSuccess
          ? "bg-emerald-500/20 border border-emerald-400 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
          : "bg-[#121826] border border-[#a3e635]/40 text-[#ccff00] hover:border-[#ccff00] hover:shadow-[0_0_15px_rgba(204,255,0,0.25)]"
      }`}
      title={
        language === "bn"
          ? "আপনার সমস্ত ওয়ার্কআউট ও ট্র্যাকিং ডাটা JSON ফাইল হিসেবে ডাউনলোড করুন"
          : "Export all your workouts, nutrition, and telemetry data as JSON"
      }
    >
      <div className="w-3.5 h-3.5 flex items-center justify-center">
        {isSuccess ? (
          <svg
            viewBox="0 0 24 24"
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            className={`w-3.5 h-3.5 ${isExporting ? "animate-bounce" : ""}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
        )}
      </div>
      <span>
        {isSuccess
          ? language === "bn"
            ? "ডাউনলোড সম্পন্ন"
            : "Exported!"
          : isExporting
          ? language === "bn"
            ? "রপ্তানি হচ্ছে..."
            : "Exporting..."
          : language === "bn"
          ? "ডাটা এক্সপোর্ট"
          : "Export My Data"}
      </span>
    </button>
  );
}
