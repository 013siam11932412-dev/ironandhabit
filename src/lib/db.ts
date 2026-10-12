import { supabase } from "./supabaseClient";
import { getTodayIsoDate } from "./storage";

export interface NutritionLog {
  id: string | number;
  user_id?: string;
  created_at?: string;
  meal_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface WorkoutLog {
  id: string | number;
  user_id?: string;
  created_at?: string;
  exercise_name: string;
  set_number: number;
  reps: number;
  weight: number;
  completed: boolean;
}

export interface DailyMetric {
  id?: string | number;
  user_id?: string;
  date: string; // YYYY-MM-DD
  water_ml: number;
  calories_consumed: number;
  streak_count: number;
}

export interface BmiRecord {
  id: string | number;
  user_id?: string;
  created_at?: string;
  height: number; // in cm
  weight: number; // in kg
  bmi: number;
  category: string;
}

const LOCAL_KEYS = {
  NUTRITION: "iron_nutrition_logs",
  WORKOUT: "iron_workout_logs",
  DAILY_METRICS: "iron_daily_metrics_map",
  BMI: "iron_bmi_records",
} as const;

// Helper to check if ISO timestamp matches today's local date
export function isToday(timestamp?: string): boolean {
  if (!timestamp) return true;
  const today = getTodayIsoDate();
  return timestamp.startsWith(today);
}

// ----------------------------------------------------
// NUTRITION LOGS (public.nutrition_logs)
// ----------------------------------------------------

export async function fetchTodayNutritionLogs(
  userId?: string | null
): Promise<NutritionLog[]> {
  const today = getTodayIsoDate();

  if (userId) {
    try {
      const { data, error } = await supabase
        .from("nutrition_logs")
        .select("*")
        .eq("user_id", userId)
        .gte("created_at", `${today}T00:00:00.000Z`)
        .order("created_at", { ascending: true });

      if (!error && Array.isArray(data)) {
        // Cache to localStorage
        if (typeof window !== "undefined") {
          try {
            const allLocal = getLocalNutritionLogs();
            const filtered = allLocal.filter((m) => !isToday(m.created_at));
            localStorage.setItem(
              LOCAL_KEYS.NUTRITION,
              JSON.stringify([...data, ...filtered])
            );
          } catch {
            // ignore
          }
        }
        return data as NutritionLog[];
      }
    } catch (err) {
      console.warn("Error fetching nutrition logs from Supabase:", err);
    }
  }

  // Guest / Offline fallback
  return getLocalNutritionLogs().filter((m) => isToday(m.created_at));
}

export function getLocalNutritionLogs(): NutritionLog[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_KEYS.NUTRITION);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function insertNutritionLog(
  userId: string | null,
  meal: {
    meal_name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }
): Promise<NutritionLog> {
  const timestamp = new Date().toISOString();
  let createdRecord: NutritionLog = {
    id: `local-${Date.now()}`,
    user_id: userId || undefined,
    created_at: timestamp,
    ...meal,
  };

  if (userId) {
    try {
      const { data, error } = await supabase
        .from("nutrition_logs")
        .insert({
          user_id: userId,
          meal_name: meal.meal_name,
          calories: meal.calories,
          protein: meal.protein,
          carbs: meal.carbs,
          fat: meal.fat,
          created_at: timestamp,
        })
        .select()
        .single();

      if (!error && data) {
        createdRecord = data as NutritionLog;
      }
    } catch (err) {
      console.warn("Failed to insert nutrition log to Supabase:", err);
    }
  }

  // Persist locally
  if (typeof window !== "undefined") {
    try {
      const current = getLocalNutritionLogs();
      localStorage.setItem(
        LOCAL_KEYS.NUTRITION,
        JSON.stringify([...current, createdRecord])
      );
    } catch {
      // ignore
    }
  }

  return createdRecord;
}

export async function deleteNutritionLog(
  userId: string | null,
  mealId: string | number
): Promise<void> {
  if (userId && typeof mealId !== "string") {
    try {
      await supabase.from("nutrition_logs").delete().eq("id", mealId);
    } catch (err) {
      console.warn("Failed to delete nutrition log from Supabase:", err);
    }
  } else if (userId && typeof mealId === "string" && !mealId.startsWith("local-")) {
    try {
      await supabase.from("nutrition_logs").delete().eq("id", mealId);
    } catch (err) {
      console.warn("Failed to delete nutrition log from Supabase:", err);
    }
  }

  if (typeof window !== "undefined") {
    try {
      const current = getLocalNutritionLogs();
      const updated = current.filter((m) => String(m.id) !== String(mealId));
      localStorage.setItem(LOCAL_KEYS.NUTRITION, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }
}

// ----------------------------------------------------
// WORKOUT LOGS (public.workout_logs)
// ----------------------------------------------------

export async function fetchTodayWorkoutLogs(
  userId?: string | null
): Promise<WorkoutLog[]> {
  const today = getTodayIsoDate();

  if (userId) {
    try {
      const { data, error } = await supabase
        .from("workout_logs")
        .select("*")
        .eq("user_id", userId)
        .gte("created_at", `${today}T00:00:00.000Z`)
        .order("created_at", { ascending: true });

      if (!error && Array.isArray(data)) {
        if (typeof window !== "undefined") {
          try {
            const allLocal = getLocalWorkoutLogs();
            const filtered = allLocal.filter((w) => !isToday(w.created_at));
            localStorage.setItem(
              LOCAL_KEYS.WORKOUT,
              JSON.stringify([...data, ...filtered])
            );
          } catch {
            // ignore
          }
        }
        return data as WorkoutLog[];
      }
    } catch (err) {
      console.warn("Error fetching workout logs from Supabase:", err);
    }
  }

  return getLocalWorkoutLogs().filter((w) => isToday(w.created_at));
}

export function getLocalWorkoutLogs(): WorkoutLog[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_KEYS.WORKOUT);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveWorkoutLog(
  userId: string | null,
  log: Omit<WorkoutLog, "id"> & { id?: string | number }
): Promise<WorkoutLog> {
  const timestamp = log.created_at || new Date().toISOString();
  let savedRecord: WorkoutLog = {
    id: log.id || `local-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    user_id: userId || undefined,
    created_at: timestamp,
    exercise_name: log.exercise_name,
    set_number: log.set_number,
    reps: log.reps,
    weight: log.weight,
    completed: log.completed,
  };

  const isRealDbId =
    log.id &&
    typeof log.id !== "string"
      ? true
      : typeof log.id === "string" && !log.id.startsWith("local-") && !log.id.startsWith("set-");

  if (userId) {
    try {
      if (isRealDbId) {
        const { data, error } = await supabase
          .from("workout_logs")
          .update({
            exercise_name: log.exercise_name,
            set_number: log.set_number,
            reps: log.reps,
            weight: log.weight,
            completed: log.completed,
          })
          .eq("id", log.id)
          .select()
          .single();

        if (!error && data) {
          savedRecord = data as WorkoutLog;
        }
      } else {
        const { data, error } = await supabase
          .from("workout_logs")
          .insert({
            user_id: userId,
            exercise_name: log.exercise_name,
            set_number: log.set_number,
            reps: log.reps,
            weight: log.weight,
            completed: log.completed,
            created_at: timestamp,
          })
          .select()
          .single();

        if (!error && data) {
          savedRecord = data as WorkoutLog;
        }
      }
    } catch (err) {
      console.warn("Failed to save workout log to Supabase:", err);
    }
  }

  // Persist locally
  if (typeof window !== "undefined") {
    try {
      const current = getLocalWorkoutLogs();
      const existingIdx = current.findIndex(
        (w) => String(w.id) === String(savedRecord.id)
      );
      if (existingIdx >= 0) {
        current[existingIdx] = savedRecord;
      } else {
        current.push(savedRecord);
      }
      localStorage.setItem(LOCAL_KEYS.WORKOUT, JSON.stringify(current));
    } catch {
      // ignore
    }
  }

  return savedRecord;
}

export async function deleteWorkoutLog(
  userId: string | null,
  logId: string | number
): Promise<void> {
  const isRealDbId =
    typeof logId !== "string" ||
    (!logId.startsWith("local-") && !logId.startsWith("set-"));

  if (userId && isRealDbId) {
    try {
      await supabase.from("workout_logs").delete().eq("id", logId);
    } catch (err) {
      console.warn("Failed to delete workout log from Supabase:", err);
    }
  }

  if (typeof window !== "undefined") {
    try {
      const current = getLocalWorkoutLogs();
      const updated = current.filter((w) => String(w.id) !== String(logId));
      localStorage.setItem(LOCAL_KEYS.WORKOUT, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }
}

// ----------------------------------------------------
// DAILY METRICS (public.daily_metrics)
// ----------------------------------------------------

export async function fetchDailyMetrics(
  userId: string | null,
  dateIso?: string
): Promise<DailyMetric | null> {
  const targetDate = dateIso || getTodayIsoDate();

  if (userId) {
    try {
      const { data, error } = await supabase
        .from("daily_metrics")
        .select("*")
        .eq("user_id", userId)
        .eq("date", targetDate)
        .maybeSingle();

      if (!error && data) {
        saveLocalDailyMetric(data as DailyMetric);
        return data as DailyMetric;
      }
    } catch (err) {
      console.warn("Failed to fetch daily metrics from Supabase:", err);
    }
  }

  return getLocalDailyMetric(targetDate);
}

export async function fetchAllDailyMetrics(
  userId: string | null
): Promise<DailyMetric[]> {
  if (userId) {
    try {
      const { data, error } = await supabase
        .from("daily_metrics")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: false })
        .limit(30);

      if (!error && Array.isArray(data)) {
        if (typeof window !== "undefined") {
          data.forEach((m) => saveLocalDailyMetric(m as DailyMetric));
        }
        return data as DailyMetric[];
      }
    } catch (err) {
      console.warn("Failed to fetch all daily metrics from Supabase:", err);
    }
  }

  return getAllLocalDailyMetrics();
}

export function getLocalDailyMetric(date: string): DailyMetric | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LOCAL_KEYS.DAILY_METRICS);
    if (!raw) return null;
    const map: Record<string, DailyMetric> = JSON.parse(raw);
    return map[date] || null;
  } catch {
    return null;
  }
}

export function getAllLocalDailyMetrics(): DailyMetric[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_KEYS.DAILY_METRICS);
    if (!raw) return [];
    const map: Record<string, DailyMetric> = JSON.parse(raw);
    return Object.values(map);
  } catch {
    return [];
  }
}

export function saveLocalDailyMetric(metric: DailyMetric): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(LOCAL_KEYS.DAILY_METRICS);
    const map: Record<string, DailyMetric> = raw ? JSON.parse(raw) : {};
    map[metric.date] = metric;
    localStorage.setItem(LOCAL_KEYS.DAILY_METRICS, JSON.stringify(map));
  } catch {
    // ignore
  }
}

export async function upsertDailyMetrics(
  userId: string | null,
  metric: {
    date: string;
    water_ml: number;
    calories_consumed: number;
    streak_count: number;
  }
): Promise<DailyMetric> {
  let result: DailyMetric = {
    user_id: userId || undefined,
    ...metric,
  };

  if (userId) {
    try {
      // 1. Check if row exists for user & date
      const { data: existing } = await supabase
        .from("daily_metrics")
        .select("id")
        .eq("user_id", userId)
        .eq("date", metric.date)
        .maybeSingle();

      if (existing?.id) {
        const { data, error } = await supabase
          .from("daily_metrics")
          .update({
            water_ml: metric.water_ml,
            calories_consumed: metric.calories_consumed,
            streak_count: metric.streak_count,
          })
          .eq("id", existing.id)
          .select()
          .single();

        if (!error && data) {
          result = data as DailyMetric;
        }
      } else {
        const { data, error } = await supabase
          .from("daily_metrics")
          .insert({
            user_id: userId,
            date: metric.date,
            water_ml: metric.water_ml,
            calories_consumed: metric.calories_consumed,
            streak_count: metric.streak_count,
          })
          .select()
          .single();

        if (!error && data) {
          result = data as DailyMetric;
        }
      }
    } catch (err) {
      console.warn("Failed to upsert daily metrics to Supabase:", err);
    }
  }

  saveLocalDailyMetric(result);
  return result;
}

// ----------------------------------------------------
// BMI RECORDS (public.bmi_records)
// ----------------------------------------------------

export async function fetchBmiRecords(
  userId?: string | null
): Promise<BmiRecord[]> {
  if (userId) {
    try {
      const { data, error } = await supabase
        .from("bmi_records")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (!error && Array.isArray(data)) {
        if (typeof window !== "undefined") {
          localStorage.setItem(LOCAL_KEYS.BMI, JSON.stringify(data));
        }
        return data as BmiRecord[];
      }
    } catch (err) {
      console.warn("Failed to fetch BMI records from Supabase:", err);
    }
  }

  return getLocalBmiRecords();
}

export function getLocalBmiRecords(): BmiRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_KEYS.BMI);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function insertBmiRecord(
  userId: string | null,
  record: {
    height: number;
    weight: number;
    bmi: number;
    category: string;
  }
): Promise<BmiRecord> {
  const timestamp = new Date().toISOString();
  let created: BmiRecord = {
    id: `local-${Date.now()}`,
    user_id: userId || undefined,
    created_at: timestamp,
    ...record,
  };

  if (userId) {
    try {
      const { data, error } = await supabase
        .from("bmi_records")
        .insert({
          user_id: userId,
          height: record.height,
          weight: record.weight,
          bmi: record.bmi,
          category: record.category,
          created_at: timestamp,
        })
        .select()
        .single();

      if (!error && data) {
        created = data as BmiRecord;
      }
    } catch (err) {
      console.warn("Failed to insert BMI record to Supabase:", err);
    }
  }

  if (typeof window !== "undefined") {
    try {
      const current = getLocalBmiRecords();
      localStorage.setItem(LOCAL_KEYS.BMI, JSON.stringify([created, ...current]));
    } catch {
      // ignore
    }
  }

  return created;
}

export async function deleteBmiRecord(
  userId: string | null,
  recordId: string | number
): Promise<void> {
  const isRealDbId =
    typeof recordId !== "string" || !recordId.startsWith("local-");

  if (userId && isRealDbId) {
    try {
      await supabase.from("bmi_records").delete().eq("id", recordId);
    } catch (err) {
      console.warn("Failed to delete BMI record from Supabase:", err);
    }
  }

  if (typeof window !== "undefined") {
    try {
      const current = getLocalBmiRecords();
      const updated = current.filter((r) => String(r.id) !== String(recordId));
      localStorage.setItem(LOCAL_KEYS.BMI, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }
}
