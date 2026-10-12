// Iron & Habit - Workout Storage & Telemetry Engine
// Handles routine templates, multi-set exercise logging, volume calculations, and persistent localStorage sync

export interface WorkoutSet {
  id: string;
  setNumber: number;
  weight: number; // in current unit (kg or lbs)
  reps: number;
  completed: boolean;
}

export interface WorkoutExercise {
  id: string;
  nameEn: string;
  nameBn: string;
  targetMuscle: string; // "Chest" | "Back" | "Shoulders" | "Biceps" | "Triceps" | "Legs" | "Core" | "Full Body"
  sets: WorkoutSet[];
}

export interface WorkoutRoutine {
  id: string; // "push" | "pull" | "legs" | "fullbody" | "rest"
  nameEn: string;
  nameBn: string;
  category: "push" | "pull" | "legs" | "fullbody" | "rest";
  dayNameEn: string; // "Monday", etc.
  dayNameBn: string;
  exercises: WorkoutExercise[];
}

export const WORKOUT_STORAGE_KEYS = {
  ACTIVE_ROUTINE_ID: "iron_active_routine_id",
  ROUTINES_DATA: "iron_workout_routines_v1",
  WEIGHT_UNIT: "iron_weight_unit",
  REST_TIMER_PRESET: "iron_rest_timer_preset",
  SESSION_COMPLETED_DATE: "iron_workout_completed_date",
} as const;

export const DEFAULT_ROUTINES: WorkoutRoutine[] = [
  {
    id: "push",
    nameEn: "Push Protocol (Chest / Shoulders / Triceps)",
    nameBn: "পুশ প্রটোকল (বুক / কাঁধ / ট্রাইসেপ)",
    category: "push",
    dayNameEn: "Monday / Thursday",
    dayNameBn: "সোমবার / বৃহস্পতিবার",
    exercises: [
      {
        id: "ex-push-1",
        nameEn: "Barbell Bench Press",
        nameBn: "বারবেল বেঞ্চ প্রেস",
        targetMuscle: "Chest",
        sets: [
          { id: "s-1-1", setNumber: 1, weight: 100, reps: 8, completed: false },
          { id: "s-1-2", setNumber: 2, weight: 100, reps: 8, completed: false },
          { id: "s-1-3", setNumber: 3, weight: 105, reps: 6, completed: false },
          { id: "s-1-4", setNumber: 4, weight: 105, reps: 6, completed: false },
        ],
      },
      {
        id: "ex-push-2",
        nameEn: "Incline Dumbbell Press",
        nameBn: "ইনক্লাইন ডাম্বেল প্রেস",
        targetMuscle: "Chest",
        sets: [
          { id: "s-2-1", setNumber: 1, weight: 36, reps: 10, completed: false },
          { id: "s-2-2", setNumber: 2, weight: 36, reps: 10, completed: false },
          { id: "s-2-3", setNumber: 3, weight: 40, reps: 8, completed: false },
        ],
      },
      {
        id: "ex-push-3",
        nameEn: "Overhead Military Press",
        nameBn: "ওভারহেড মিলিটারি প্রেস",
        targetMuscle: "Shoulders",
        sets: [
          { id: "s-3-1", setNumber: 1, weight: 60, reps: 8, completed: false },
          { id: "s-3-2", setNumber: 2, weight: 60, reps: 8, completed: false },
          { id: "s-3-3", setNumber: 3, weight: 65, reps: 6, completed: false },
        ],
      },
      {
        id: "ex-push-4",
        nameEn: "Weighted Tricep Dips",
        nameBn: "ওয়েটেড ট্রাইসেপ ডিপস",
        targetMuscle: "Triceps",
        sets: [
          { id: "s-4-1", setNumber: 1, weight: 20, reps: 10, completed: false },
          { id: "s-4-2", setNumber: 2, weight: 20, reps: 10, completed: false },
          { id: "s-4-3", setNumber: 3, weight: 20, reps: 8, completed: false },
        ],
      },
    ],
  },
  {
    id: "pull",
    nameEn: "Pull Protocol (Back / Traps / Biceps)",
    nameBn: "পুল প্রটোকল (পিঠ / ট্র্যাপস / বাইসেপ)",
    category: "pull",
    dayNameEn: "Tuesday / Friday",
    dayNameBn: "মঙ্গলবার / শুক্রবার",
    exercises: [
      {
        id: "ex-pull-1",
        nameEn: "Conventional Barbell Deadlift",
        nameBn: "বারবেল ডেডলিফট",
        targetMuscle: "Back",
        sets: [
          { id: "s-p1-1", setNumber: 1, weight: 140, reps: 5, completed: false },
          { id: "s-p1-2", setNumber: 2, weight: 150, reps: 5, completed: false },
          { id: "s-p1-3", setNumber: 3, weight: 160, reps: 3, completed: false },
        ],
      },
      {
        id: "ex-pull-2",
        nameEn: "Bent-Over Barbell Rows",
        nameBn: "বারবেল রো",
        targetMuscle: "Back",
        sets: [
          { id: "s-p2-1", setNumber: 1, weight: 80, reps: 8, completed: false },
          { id: "s-p2-2", setNumber: 2, weight: 80, reps: 8, completed: false },
          { id: "s-p2-3", setNumber: 3, weight: 85, reps: 8, completed: false },
        ],
      },
      {
        id: "ex-pull-3",
        nameEn: "Weighted Wide Pull-Ups",
        nameBn: "ওয়েটেড পুল-আপস",
        targetMuscle: "Back",
        sets: [
          { id: "s-p3-1", setNumber: 1, weight: 15, reps: 8, completed: false },
          { id: "s-p3-2", setNumber: 2, weight: 15, reps: 8, completed: false },
          { id: "s-p3-3", setNumber: 3, weight: 15, reps: 6, completed: false },
        ],
      },
      {
        id: "ex-pull-4",
        nameEn: "Barbell Bicep Curls",
        nameBn: "বারবেল বাইসেপ কার্ল",
        targetMuscle: "Biceps",
        sets: [
          { id: "s-p4-1", setNumber: 1, weight: 35, reps: 10, completed: false },
          { id: "s-p4-2", setNumber: 2, weight: 35, reps: 10, completed: false },
          { id: "s-p4-3", setNumber: 3, weight: 40, reps: 8, completed: false },
        ],
      },
    ],
  },
  {
    id: "legs",
    nameEn: "Legs Protocol (Quads / Hamstrings / Calves)",
    nameBn: "লেগস প্রটোকল (কোয়াডস / হ্যামস্ট্রিং / কাফ)",
    category: "legs",
    dayNameEn: "Wednesday / Saturday",
    dayNameBn: "বুধবার / শনিবার",
    exercises: [
      {
        id: "ex-leg-1",
        nameEn: "Barbell Back Squats",
        nameBn: "বারবেল ব্যাক স্কোয়াট",
        targetMuscle: "Legs",
        sets: [
          { id: "s-l1-1", setNumber: 1, weight: 120, reps: 6, completed: false },
          { id: "s-l1-2", setNumber: 2, weight: 130, reps: 6, completed: false },
          { id: "s-l1-3", setNumber: 3, weight: 135, reps: 5, completed: false },
          { id: "s-l1-4", setNumber: 4, weight: 140, reps: 4, completed: false },
        ],
      },
      {
        id: "ex-leg-2",
        nameEn: "Romanian Deadlift (RDL)",
        nameBn: "রোমানিয়ান ডেডলিফট",
        targetMuscle: "Legs",
        sets: [
          { id: "s-l2-1", setNumber: 1, weight: 90, reps: 8, completed: false },
          { id: "s-l2-2", setNumber: 2, weight: 90, reps: 8, completed: false },
          { id: "s-l2-3", setNumber: 3, weight: 95, reps: 8, completed: false },
        ],
      },
      {
        id: "ex-leg-3",
        nameEn: "Bulgarian Split Squats",
        nameBn: "বুলগেরিয়ান স্প্লিট স্কোয়াট",
        targetMuscle: "Legs",
        sets: [
          { id: "s-l3-1", setNumber: 1, weight: 24, reps: 10, completed: false },
          { id: "s-l3-2", setNumber: 2, weight: 24, reps: 10, completed: false },
          { id: "s-l3-3", setNumber: 3, weight: 24, reps: 10, completed: false },
        ],
      },
      {
        id: "ex-leg-4",
        nameEn: "Standing Calf Raises",
        nameBn: "স্ট্যান্ডিং কাফ রেইজ",
        targetMuscle: "Legs",
        sets: [
          { id: "s-l4-1", setNumber: 1, weight: 60, reps: 15, completed: false },
          { id: "s-l4-2", setNumber: 2, weight: 60, reps: 15, completed: false },
          { id: "s-l4-3", setNumber: 3, weight: 60, reps: 15, completed: false },
        ],
      },
    ],
  },
  {
    id: "fullbody",
    nameEn: "Full Body Compound Conditioning",
    nameBn: "ফুল বডি কম্পাউন্ড কন্ডিশনিং",
    category: "fullbody",
    dayNameEn: "Flexible Day",
    dayNameBn: "ফ্লেক্সিবল সেশন",
    exercises: [
      {
        id: "ex-fb-1",
        nameEn: "Clean & Push Press",
        nameBn: "ক্লিন অ্যান্ড পুশ প্রেস",
        targetMuscle: "Full Body",
        sets: [
          { id: "s-fb1-1", setNumber: 1, weight: 70, reps: 5, completed: false },
          { id: "s-fb1-2", setNumber: 2, weight: 70, reps: 5, completed: false },
          { id: "s-fb1-3", setNumber: 3, weight: 75, reps: 5, completed: false },
        ],
      },
      {
        id: "ex-fb-2",
        nameEn: "Front Squat",
        nameBn: "ফ্রন্ট স্কোয়াট",
        targetMuscle: "Legs",
        sets: [
          { id: "s-fb2-1", setNumber: 1, weight: 90, reps: 6, completed: false },
          { id: "s-fb2-2", setNumber: 2, weight: 90, reps: 6, completed: false },
          { id: "s-fb2-3", setNumber: 3, weight: 95, reps: 6, completed: false },
        ],
      },
      {
        id: "ex-fb-3",
        nameEn: "Weighted Chin-Ups",
        nameBn: "ওয়েটেড চিন-আপস",
        targetMuscle: "Back",
        sets: [
          { id: "s-fb3-1", setNumber: 1, weight: 15, reps: 8, completed: false },
          { id: "s-fb3-2", setNumber: 2, weight: 15, reps: 8, completed: false },
          { id: "s-fb3-3", setNumber: 3, weight: 20, reps: 6, completed: false },
        ],
      },
    ],
  },
  {
    id: "rest",
    nameEn: "Rest & Active Mobility Recovery",
    nameBn: "বিশ্রাম ও একটিভ মোবিলিটি রিকভারি",
    category: "rest",
    dayNameEn: "Sunday",
    dayNameBn: "রবিবার",
    exercises: [
      {
        id: "ex-r-1",
        nameEn: "Full Body Foam Rolling & Myofascial Release",
        nameBn: "ফোম রোলিং ও মায়োফ্যাসিয়াল রিলিজ",
        targetMuscle: "Full Body",
        sets: [
          { id: "s-r1-1", setNumber: 1, weight: 0, reps: 15, completed: false },
          { id: "s-r1-2", setNumber: 2, weight: 0, reps: 15, completed: false },
        ],
      },
      {
        id: "ex-r-2",
        nameEn: "90/90 Hip Flow & Hamstring Flossing",
        nameBn: "৯০/৯০ হিপ ফ্লো ও স্ট্রেচিং",
        targetMuscle: "Legs",
        sets: [
          { id: "s-r2-1", setNumber: 1, weight: 0, reps: 10, completed: false },
          { id: "s-r2-2", setNumber: 2, weight: 0, reps: 10, completed: false },
        ],
      },
      {
        id: "ex-r-3",
        nameEn: "Thoracic Spine Extensions & Deep Breathwork",
        nameBn: "থোরাসিক স্পাইন এক্সটেনশন ও ব্রিদিং",
        targetMuscle: "Core",
        sets: [
          { id: "s-r3-1", setNumber: 1, weight: 0, reps: 10, completed: false },
          { id: "s-r3-2", setNumber: 2, weight: 0, reps: 10, completed: false },
        ],
      },
    ],
  },
];

export function getStoredRoutines(): WorkoutRoutine[] {
  if (typeof window === "undefined") return DEFAULT_ROUTINES;
  try {
    const raw = localStorage.getItem(WORKOUT_STORAGE_KEYS.ROUTINES_DATA);
    if (!raw) return DEFAULT_ROUTINES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_ROUTINES;
  } catch {
    return DEFAULT_ROUTINES;
  }
}

export function saveStoredRoutines(routines: WorkoutRoutine[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      WORKOUT_STORAGE_KEYS.ROUTINES_DATA,
      JSON.stringify(routines)
    );
  } catch (err) {
    console.error("Failed to save routines:", err);
  }
}

export function getStoredActiveRoutineId(): string {
  if (typeof window === "undefined") return "push";
  try {
    return (
      localStorage.getItem(WORKOUT_STORAGE_KEYS.ACTIVE_ROUTINE_ID) || "push"
    );
  } catch {
    return "push";
  }
}

export function saveStoredActiveRoutineId(id: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(WORKOUT_STORAGE_KEYS.ACTIVE_ROUTINE_ID, id);
  } catch (err) {
    console.error("Failed to save active routine id:", err);
  }
}

export function getStoredWeightUnit(): "kg" | "lbs" {
  if (typeof window === "undefined") return "kg";
  try {
    const saved = localStorage.getItem(WORKOUT_STORAGE_KEYS.WEIGHT_UNIT);
    return saved === "lbs" ? "lbs" : "kg";
  } catch {
    return "kg";
  }
}

export function saveStoredWeightUnit(unit: "kg" | "lbs"): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(WORKOUT_STORAGE_KEYS.WEIGHT_UNIT, unit);
  } catch (err) {
    console.error("Failed to save weight unit:", err);
  }
}

export function calculateRoutineVolume(routine: WorkoutRoutine): number {
  let total = 0;
  routine.exercises.forEach((ex) => {
    ex.sets.forEach((set) => {
      if (set.completed) {
        total += (set.weight || 0) * (set.reps || 0);
      }
    });
  });
  return Math.round(total);
}

export function calculateCompletedSetsCount(routine: WorkoutRoutine): {
  completed: number;
  total: number;
} {
  let completed = 0;
  let total = 0;
  routine.exercises.forEach((ex) => {
    ex.sets.forEach((set) => {
      total += 1;
      if (set.completed) completed += 1;
    });
  });
  return { completed, total };
}
