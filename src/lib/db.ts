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

export interface Friendship {
  id: string | number;
  user_id?: string;
  friend_phone: string;
  friend_name: string;
  status: "pending" | "accepted";
  created_at?: string;
  streak_count?: number;
}

export interface CommunityMessage {
  id: string | number;
  user_id?: string;
  user_name: string;
  message: string;
  category: "general" | "workout_brag" | "nutrition_tip";
  created_at: string;
}

const LOCAL_KEYS = {
  NUTRITION: "iron_nutrition_logs",
  WORKOUT: "iron_workout_logs",
  DAILY_METRICS: "iron_daily_metrics_map",
  BMI: "iron_bmi_records",
  FRIENDSHIPS: "iron_friendships_list",
  COMMUNITY_MESSAGES: "iron_community_messages_list",
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

// ----------------------------------------------------
// FRIENDSHIPS (public.friendships)
// ----------------------------------------------------

export const DEFAULT_FRIENDSHIPS: Friendship[] = [
  {
    id: "init-friend-1",
    friend_phone: "+880 1711 234567",
    friend_name: "Tanvir Rahman",
    status: "accepted",
    streak_count: 12,
    created_at: "2026-10-10T12:00:00.000Z",
  },
  {
    id: "init-friend-2",
    friend_phone: "+880 1819 876543",
    friend_name: "Sabbir Hossain",
    status: "accepted",
    streak_count: 7,
    created_at: "2026-10-11T14:30:00.000Z",
  },
  {
    id: "init-friend-3",
    friend_phone: "+880 1912 345678",
    friend_name: "Ayesha Siddiqua",
    status: "pending",
    streak_count: 5,
    created_at: "2026-10-12T09:15:00.000Z",
  },
];

export function getLocalFriendships(): Friendship[] {
  if (typeof window === "undefined") return DEFAULT_FRIENDSHIPS;
  try {
    const raw = localStorage.getItem(LOCAL_KEYS.FRIENDSHIPS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    localStorage.setItem(LOCAL_KEYS.FRIENDSHIPS, JSON.stringify(DEFAULT_FRIENDSHIPS));
    return DEFAULT_FRIENDSHIPS;
  } catch {
    return DEFAULT_FRIENDSHIPS;
  }
}

export async function fetchFriendships(
  userId?: string | null
): Promise<Friendship[]> {
  if (userId) {
    try {
      const { data, error } = await supabase
        .from("friendships")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(LOCAL_KEYS.FRIENDSHIPS, JSON.stringify(data));
          } catch {
            // ignore
          }
        }
        return data as Friendship[];
      }
    } catch (err) {
      console.warn("Failed to fetch friendships from Supabase:", err);
    }
  }

  return getLocalFriendships();
}

export async function addFriendship(
  userId: string | null,
  friend: {
    friend_phone: string;
    friend_name: string;
    status?: "pending" | "accepted";
    streak_count?: number;
  }
): Promise<Friendship> {
  const timestamp = new Date().toISOString();
  let created: Friendship = {
    id: `local-friend-${Date.now()}`,
    user_id: userId || undefined,
    friend_phone: friend.friend_phone,
    friend_name: friend.friend_name,
    status: friend.status || "accepted",
    streak_count: friend.streak_count ?? 1,
    created_at: timestamp,
  };

  if (userId) {
    try {
      const { data, error } = await supabase
        .from("friendships")
        .insert({
          user_id: userId,
          friend_phone: friend.friend_phone,
          friend_name: friend.friend_name,
          status: friend.status || "accepted",
          created_at: timestamp,
        })
        .select()
        .single();

      if (!error && data) {
        created = {
          ...data,
          streak_count: friend.streak_count ?? 1,
        } as Friendship;
      }
    } catch (err) {
      console.warn("Failed to insert friendship to Supabase:", err);
    }
  }

  if (typeof window !== "undefined") {
    try {
      const current = getLocalFriendships();
      localStorage.setItem(
        LOCAL_KEYS.FRIENDSHIPS,
        JSON.stringify([created, ...current])
      );
    } catch {
      // ignore
    }
  }

  return created;
}

export async function deleteFriendship(
  userId: string | null,
  friendshipId: string | number
): Promise<void> {
  const isRealDbId =
    typeof friendshipId !== "string" || !friendshipId.startsWith("local-");

  if (userId && isRealDbId) {
    try {
      await supabase.from("friendships").delete().eq("id", friendshipId);
    } catch (err) {
      console.warn("Failed to delete friendship from Supabase:", err);
    }
  }

  if (typeof window !== "undefined") {
    try {
      const current = getLocalFriendships();
      const updated = current.filter((f) => String(f.id) !== String(friendshipId));
      localStorage.setItem(LOCAL_KEYS.FRIENDSHIPS, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }
}

// ----------------------------------------------------
// COMMUNITY MESSAGES (public.community_messages)
// ----------------------------------------------------

export const DEFAULT_COMMUNITY_MESSAGES: CommunityMessage[] = [
  {
    id: "init-msg-1",
    user_name: "Tanvir Rahman",
    message: "Just crushed a 105kg Bench Press session today! Day 12 unbroken streak 🔥",
    category: "workout_brag",
    created_at: "2026-10-13T10:15:00.000Z",
  },
  {
    id: "init-msg-2",
    user_name: "Sabbir Hossain",
    message: "Hit 180g protein target today with local eggs, lentils and grilled chicken breast. Fueling clean!",
    category: "nutrition_tip",
    created_at: "2026-10-13T11:45:00.000Z",
  },
  {
    id: "init-msg-3",
    user_name: "Ayesha Siddiqua",
    message: "Morning 5K run completed + completed all 8 hydration glasses. Consistency beats motivation every single day 💪",
    category: "general",
    created_at: "2026-10-13T14:20:00.000Z",
  },
];

export function getLocalCommunityMessages(): CommunityMessage[] {
  if (typeof window === "undefined") return DEFAULT_COMMUNITY_MESSAGES;
  try {
    const raw = localStorage.getItem(LOCAL_KEYS.COMMUNITY_MESSAGES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    localStorage.setItem(
      LOCAL_KEYS.COMMUNITY_MESSAGES,
      JSON.stringify(DEFAULT_COMMUNITY_MESSAGES)
    );
    return DEFAULT_COMMUNITY_MESSAGES;
  } catch {
    return DEFAULT_COMMUNITY_MESSAGES;
  }
}

export async function fetchCommunityMessages(
  limit = 50
): Promise<CommunityMessage[]> {
  try {
    const { data, error } = await supabase
      .from("community_messages")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(limit);

    if (!error && Array.isArray(data) && data.length > 0) {
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(
            LOCAL_KEYS.COMMUNITY_MESSAGES,
            JSON.stringify(data)
          );
        } catch {
          // ignore
        }
      }
      return data as CommunityMessage[];
    }
  } catch (err) {
    console.warn("Failed to fetch community messages from Supabase:", err);
  }

  return getLocalCommunityMessages();
}

export async function insertCommunityMessage(msg: {
  user_id?: string;
  user_name: string;
  message: string;
  category: "general" | "workout_brag" | "nutrition_tip";
}): Promise<CommunityMessage> {
  const timestamp = new Date().toISOString();
  let created: CommunityMessage = {
    id: `local-msg-${Date.now()}`,
    user_id: msg.user_id,
    user_name: msg.user_name,
    message: msg.message,
    category: msg.category,
    created_at: timestamp,
  };

  try {
    const { data, error } = await supabase
      .from("community_messages")
      .insert({
        user_id: msg.user_id,
        user_name: msg.user_name,
        message: msg.message,
        category: msg.category,
        created_at: timestamp,
      })
      .select()
      .single();

    if (!error && data) {
      created = data as CommunityMessage;
    }
  } catch (err) {
    console.warn("Failed to insert community message to Supabase:", err);
  }

  if (typeof window !== "undefined") {
    try {
      const current = getLocalCommunityMessages();
      localStorage.setItem(
        LOCAL_KEYS.COMMUNITY_MESSAGES,
        JSON.stringify([...current, created])
      );
    } catch {
      // ignore
    }
  }

  return created;
}

export function subscribeCommunityMessages(
  onNewMessage: (msg: CommunityMessage) => void
): () => void {
  try {
    const channel = supabase
      .channel("public:community_messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "community_messages",
        },
        (payload) => {
          if (payload.new) {
            onNewMessage(payload.new as CommunityMessage);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (err) {
    console.warn("Realtime subscription failed:", err);
    return () => {};
  }
}
