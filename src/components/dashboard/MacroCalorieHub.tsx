"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import {
  NutritionLog,
  fetchTodayNutritionLogs,
  insertNutritionLog,
  deleteNutritionLog,
  fetchDailyMetrics,
  upsertDailyMetrics,
  getLocalBmiRecords,
} from "@/lib/db";
import { getTodayIsoDate, getStoredStreak } from "@/lib/storage";

interface BmiAssessment {
  bmi: number;
  weightKg: number;
  heightCm: number;
  category: "underweight" | "normal" | "overweight" | "obese";
}

interface MacroCalibration {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  tierLabelEn: string;
  tierLabelBn: string;
  badgeEn: string;
  badgeBn: string;
  adviceEn: string;
  adviceBn: string;
  color: string;
}

interface RecommendedMeal {
  id: string;
  meal_type: "breakfast" | "lunch" | "snack" | "dinner";
  timeLabel: string;
  titleEn: string;
  titleBn: string;
  ingredientsEn: string;
  ingredientsBn: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export default function MacroCalorieHub() {
  const { dict, language } = useLanguage();
  const { user } = useAuth();
  const [, startTransition] = useTransition();

  const [meals, setMeals] = useState<NutritionLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [bmiData, setBmiData] = useState<BmiAssessment>({
    bmi: 22.4,
    weightKg: 72,
    heightCm: 175,
    category: "normal",
  });

  // Modal Form State
  const [mealName, setMealName] = useState<string>("");
  const [calories, setCalories] = useState<string>("");
  const [protein, setProtein] = useState<string>("");
  const [carbs, setCarbs] = useState<string>("");
  const [fat, setFat] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Load BMI Data from localStorage / store on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Check 'user_bmi_data'
    try {
      const rawUserBmi = localStorage.getItem("user_bmi_data");
      if (rawUserBmi) {
        const parsed = JSON.parse(rawUserBmi);
        const bmiVal = parseFloat(parsed.bmi || parsed.bmiVal || parsed.value);
        if (!isNaN(bmiVal) && bmiVal > 0) {
          let cat: BmiAssessment["category"] = "normal";
          if (bmiVal < 18.5) cat = "underweight";
          else if (bmiVal <= 24.9) cat = "normal";
          else if (bmiVal <= 29.9) cat = "overweight";
          else cat = "obese";

          setBmiData({
            bmi: parseFloat(bmiVal.toFixed(1)),
            weightKg: parseFloat(parsed.weight || parsed.weightKg) || 72,
            heightCm: parseFloat(parsed.height || parsed.heightCm) || 175,
            category: cat,
          });
          return;
        }
      }
    } catch {
      // ignore
    }

    // 2. Check 'iron_bmi_records'
    try {
      const records = getLocalBmiRecords();
      if (records && records.length > 0) {
        const latest = records[0];
        const bmiVal = parseFloat(String(latest.bmi));
        if (!isNaN(bmiVal) && bmiVal > 0) {
          let cat: BmiAssessment["category"] = "normal";
          if (bmiVal < 18.5) cat = "underweight";
          else if (bmiVal <= 24.9) cat = "normal";
          else if (bmiVal <= 29.9) cat = "overweight";
          else cat = "obese";

          setBmiData({
            bmi: parseFloat(bmiVal.toFixed(1)),
            weightKg: latest.weight || 72,
            heightCm: latest.height || 175,
            category: cat,
          });
          return;
        }
      }
    } catch {
      // ignore
    }

    // 3. Check fitness goal preference
    try {
      const goal = localStorage.getItem("iron_selected_fitness_goal");
      if (goal === "gain") {
        setBmiData({ bmi: 17.8, weightKg: 55, heightCm: 175, category: "underweight" });
        return;
      } else if (goal === "lose") {
        setBmiData({ bmi: 27.5, weightKg: 86, heightCm: 175, category: "overweight" });
        return;
      }
    } catch {
      // ignore
    }
  }, []);

  // Load today's meals on mount & user change
  useEffect(() => {
    let mounted = true;

    fetchTodayNutritionLogs(user?.id)
      .then((data) => {
        if (mounted) {
          setMeals(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load today's meals:", err);
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [user]);

  // Sync calories with daily_metrics
  const syncDailyMetricsCalories = async (updatedMeals: NutritionLog[]) => {
    const totalCals = updatedMeals.reduce((acc, m) => acc + (m.calories || 0), 0);
    const today = getTodayIsoDate();
    const existingMetric = await fetchDailyMetrics(user?.id || null, today);
    const waterMl = existingMetric?.water_ml || 0;
    const streak = existingMetric?.streak_count ?? getStoredStreak();

    await upsertDailyMetrics(user?.id || null, {
      date: today,
      water_ml: waterMl,
      calories_consumed: totalCals,
      streak_count: streak,
    });
  };

  // BMI-Driven Macro Calibration
  const macroCalibration: MacroCalibration = (() => {
    switch (bmiData.category) {
      case "underweight":
        return {
          calories: 2750,
          protein: 185,
          carbs: 345,
          fat: 72,
          tierLabelEn: "Underweight (BMI < 18.5)",
          tierLabelBn: "কম ওজন (বিএমআই < ১৮.৫)",
          badgeEn: "CALORIC SURPLUS (+450 KCAL)",
          badgeBn: "ক্যালোরি উদ্বৃত্ত (+৪৫০ ক্যালরি)",
          adviceEn:
            "Clean calorie surplus rich in complex carbs and elevated protein to stimulate lean mass accretion and healthy weight gain.",
          adviceBn:
            "পেশি ও স্বাস্থ্যকর ওজন বৃদ্ধির জন্য উচ্চ প্রোটিন ও জটিল কার্বোহাইড্রেট সমৃদ্ধ ক্যালোরি উদ্বৃত্ত পুষ্টি পরিকল্পনা।",
          color: "#38bdf8",
        };
      case "overweight":
      case "obese":
        return {
          calories: 1950,
          protein: 190,
          carbs: 160,
          fat: 58,
          tierLabelEn: "Overweight / High Density (BMI ≥ 25.0)",
          tierLabelBn: "অতিরিক্ত ওজন (বিএমআই ≥ ২৫.০)",
          badgeEn: "MODERATE DEFICIT (-400 KCAL)",
          badgeBn: "পরিমিত ঘাটতি (-৪০০ ক্যালরি)",
          adviceEn:
            "Targeted moderate caloric deficit featuring high lean protein to spare muscle tissue, lower refined carbohydrates, and high fiber.",
          adviceBn:
            "চর্বি হ্রাস ও পেশি সুরক্ষার জন্য উচ্চ লিন প্রোটিন, কম রিফাইন্ড কার্বোহাইড্রেট ও উচ্চ ফাইবারযুক্ত পরিমিত ঘাটতি পরিকল্পনা।",
          color: "#f59e0b",
        };
      case "normal":
      default:
        return {
          calories: 2350,
          protein: 175,
          carbs: 255,
          fat: 65,
          tierLabelEn: "Normal / Athletic (BMI 18.5 - 24.9)",
          tierLabelBn: "স্বাভাবিক / অ্যাথলেটিক (বিএমআই ১৮.৫ - ২৪.৯)",
          badgeEn: "CLEAN MAINTENANCE",
          badgeBn: "ক্লিন মেইনটেন্যান্স",
          adviceEn:
            "Iso-caloric clean maintenance tuned for progressive athletic overload, strength gain, and optimal muscle protein synthesis.",
          adviceBn:
            "শক্তি বৃদ্ধি ও নিখুঁত শারীরিক রিকভারির জন্য সুষম প্রোটিন, মাঝারি কার্বোহাইড্রেট ও স্বাস্থ্যকর ফ্যাটের সমন্বয়।",
          color: "#ccff00",
        };
    }
  })();

  // BMI-Driven Recommended Daily Meal Plan
  const recommendedMealPlan: RecommendedMeal[] = (() => {
    if (bmiData.category === "underweight") {
      return [
        {
          id: "rec-uw-1",
          meal_type: "breakfast",
          timeLabel: "08:00 AM",
          titleEn: "Power Oatmeal with Whole Eggs & Banana",
          titleBn: "পাওয়ার ওটমিল, সিদ্ধ ডিম ও পাকা কলা",
          ingredientsEn: "100g Rolled Oats, 3 Whole Eggs + 2 Whites, 1 Large Banana, 1 tbsp Peanut Butter, 250ml Whole Milk",
          ingredientsBn: "১০০ গ্রাম রোল্ড ওটস, ৩টি গোটা ডিম + ২টি ডিমের সাদা অংশ, ১টি পাকা কলা, ১ চামচ পিনাট বাটার, ২৫০ মিলি দুধ",
          calories: 780,
          protein: 45,
          carbs: 98,
          fat: 24,
        },
        {
          id: "rec-uw-2",
          meal_type: "lunch",
          timeLabel: "01:00 PM",
          titleEn: "Grilled Chicken Breast with Jasmine Rice & Steamed Veggies",
          titleBn: "গ্রিলড চিকেন ব্রেস্ট, সুবাসিত চালের ভাত ও ভেজিটেবলস",
          ingredientsEn: "220g Grilled Chicken Breast, 1.5 cups Cooked Jasmine Rice, Steamed Broccoli & Carrots with 1 tbsp Extra Virgin Olive Oil",
          ingredientsBn: "২২০ গ্রাম গ্রিলড চিকেন ব্রেস্ট, দেড় কাপ ভাত, ব্রকলি ও গাজর, ১ চামচ এক্সট্রা ভার্জিন অলিভ অয়েল",
          calories: 820,
          protein: 60,
          carbs: 95,
          fat: 20,
        },
        {
          id: "rec-uw-3",
          meal_type: "snack",
          timeLabel: "04:30 PM",
          titleEn: "Greek Yogurt Bowl with Mixed Nuts & Honey",
          titleBn: "গ্রিক দই, মিশ্র বাদাম ও খাঁটি মধু",
          ingredientsEn: "220g Greek Yogurt, 40g Raw Almonds & Walnuts, Fresh Blueberries, 1 tbsp Pure Honey",
          ingredientsBn: "২২০ গ্রাম গ্রিক দই, ৪০ গ্রাম কাঠবাদাম ও আখরোট, তাজা ব্লুবেরি, ১ চামচ মধু",
          calories: 460,
          protein: 28,
          carbs: 42,
          fat: 18,
        },
        {
          id: "rec-uw-4",
          meal_type: "dinner",
          timeLabel: "08:30 PM",
          titleEn: "Baked Wild Salmon Fillet with Sweet Potato & Avocado Salad",
          titleBn: "বেকড স্যালমন/মাছ, মিষ্টি আলু ও অ্যাভোকাডো সালাদ",
          ingredientsEn: "200g Wild Salmon Fillet, 1 Large Roasted Sweet Potato, Mixed Greens with Avocado Slice & Lemon Dressing",
          ingredientsBn: "২০০ গ্রাম মাছ/স্যালমন, ১টি বড় রোস্টেড মিষ্টি আলু, অ্যাভোকাডো ও লেবুর সালাদ",
          calories: 690,
          protein: 52,
          carbs: 70,
          fat: 22,
        },
      ];
    }

    if (bmiData.category === "overweight" || bmiData.category === "obese") {
      return [
        {
          id: "rec-ow-1",
          meal_type: "breakfast",
          timeLabel: "08:00 AM",
          titleEn: "High-Protein Egg White Scramble with Spinach & Sourdough",
          titleBn: "হাই-প্রোটিন ডিমের স্ক্র্যাম্বল, পালংশাক ও লাল আটার টোস্ট",
          ingredientsEn: "4 Egg Whites + 1 Whole Egg, Baby Spinach, Cherry Tomatoes, 1 Slice Whole Grain Sourdough, Green Tea",
          ingredientsBn: "৪টি ডিমের সাদা অংশ + ১টি গোটা ডিম, পালংশাক, টমেটো, ১ স্লাইস লাল আটার টোস্ট, গ্রিন টি",
          calories: 390,
          protein: 38,
          carbs: 28,
          fat: 11,
        },
        {
          id: "rec-ow-2",
          meal_type: "lunch",
          timeLabel: "01:00 PM",
          titleEn: "Lean Herb Chicken Breast with Quinoa & Crunchy Garden Salad",
          titleBn: "হার্ব চিকেন ব্রেস্ট, কিনোয়া ও তাজা শসা-টমেটোর সালাদ",
          ingredientsEn: "230g Seasoned Chicken Breast, 1/2 cup Cooked Quinoa, Huge Cucumbers & Greens Bowl with Lemon Vinaigrette",
          ingredientsBn: "২৩০ গ্রাম বেকড চিকেন ব্রেস্ট, আধা কাপ কিনোয়া, প্রচুর শসা ও শাকসবজির লেবু সালাদ",
          calories: 540,
          protein: 62,
          carbs: 42,
          fat: 12,
        },
        {
          id: "rec-ow-3",
          meal_type: "snack",
          timeLabel: "04:30 PM",
          titleEn: "Low-Fat Cottage Cheese / Greek Yogurt with Chia Seeds",
          titleBn: "লো-ফ্যাট পনির / গ্রিক দই ও চিয়া সিডস",
          ingredientsEn: "200g Low-fat Greek Yogurt or Cottage Cheese, 1 tbsp Chia Seeds, Handful of Strawberries",
          ingredientsBn: "২০০ গ্রাম লো-ফ্যাট গ্রিক দই, ১ চামচ চিয়া সিডস, কয়েকটি স্ট্রবেরি",
          calories: 270,
          protein: 32,
          carbs: 22,
          fat: 6,
        },
        {
          id: "rec-ow-4",
          meal_type: "dinner",
          timeLabel: "08:00 PM",
          titleEn: "Baked White Fish with Roasted Broccoli & Cauliflower Mash",
          titleBn: "বেকড সাদা মাছ, রোস্টেড ব্রকলি ও ফুলকপির ম্যাশ",
          ingredientsEn: "220g Baked White Fish (Cod/Tilapia), Steamed Garlic Broccoli Florets, Roasted Cauliflower Puree",
          ingredientsBn: "২২০ গ্রাম বেকড সাদা মাছ, স্টিমড ব্রকলি, ফুলকপির স্বাস্থ্যকর ম্যাশ",
          calories: 490,
          protein: 58,
          carbs: 34,
          fat: 11,
        },
      ];
    }

    // Normal / Athletic (BMI 18.5 - 24.9)
    return [
      {
        id: "rec-norm-1",
        meal_type: "breakfast",
        timeLabel: "08:00 AM",
        titleEn: "Scrambled Farm Eggs, Whole Wheat Bread & Fresh Berries",
        titleBn: "ফার্ম ডিমের স্ক্র্যাম্বল, হোল-হুইট রুটি ও তাজা বেরি",
        ingredientsEn: "3 Fresh Eggs (2 Whole + 1 White), 2 Slices Whole Grain Toast, 1/2 Sliced Avocado, Handful Fresh Berries",
        ingredientsBn: "৩টি ডিম (২টি গোটা + ১টি সাদা), ২ স্লাইস হোল-হুইট রুটি, আধা অ্যাভোকাডো, তাজা ফল",
        calories: 560,
        protein: 34,
        carbs: 55,
        fat: 20,
      },
      {
        id: "rec-norm-2",
        meal_type: "lunch",
        timeLabel: "01:00 PM",
        titleEn: "Grilled Chicken Bowl with Brown Rice & Stir-Fried Greens",
        titleBn: "গ্রিলড চিকেন বাউল, ব্রাউন রাইস ও তাজা শাকসবজি",
        ingredientsEn: "200g Tender Chicken Breast, 1 cup Brown Rice, Bell Peppers, Asparagus, 1 tsp Extra Virgin Olive Oil",
        ingredientsBn: "২০০ গ্রাম গ্রিলড চিকেন ব্রেস্ট, ১ কাপ ব্রাউন রাইস, ক্যাপসিকাম, অ্যাসপারাগাস, ১ চামচ অলিভ অয়েল",
        calories: 700,
        protein: 56,
        carbs: 76,
        fat: 16,
      },
      {
        id: "rec-norm-3",
        meal_type: "snack",
        timeLabel: "04:30 PM",
        titleEn: "Protein Recovery Shake with Rolled Oats & Crisp Apple",
        titleBn: "প্রোটিন রিকভারি শেক, ওটস ও তাজা আপেল",
        ingredientsEn: "1 Scoop Whey/Plant Protein, 40g Blended Oats, 1 Crisp Apple, 250ml Unsweetened Almond Milk",
        ingredientsBn: "১ স্কুপ প্রোটিন, ৪০ গ্রাম ওটস, ১টি আপেল, ২৫০ মিলি অ্যালমন্ড মিল্ক",
        calories: 390,
        protein: 35,
        carbs: 52,
        fat: 6,
      },
      {
        id: "rec-norm-4",
        meal_type: "dinner",
        timeLabel: "08:30 PM",
        titleEn: "Grilled Salmon Fillet with Quinoa & Charred Asparagus",
        titleBn: "গ্রিলড স্যালমন/মাছ, কিনোয়া ও ভাজা অ্যাসপারাগাস",
        ingredientsEn: "200g Salmon Fillet / Lean Fish, 3/4 cup Steamed Quinoa, Garlic Zucchini, Roasted Asparagus",
        ingredientsBn: "২০০ গ্রাম মাছ/স্যালমন, পৌনে এক কাপ কিনোয়া, রসুন-ভাজা জুচিনি ও অ্যাসপারাগাস",
        calories: 620,
        protein: 55,
        carbs: 64,
        fat: 15,
      },
    ];
  })();

  // Calculate totals
  // If meals exist, use custom meals. If not, preview recommended meals totals
  const hasCustomMeals = meals.length > 0;

  const totalCalories = hasCustomMeals
    ? meals.reduce((sum, m) => sum + (m.calories || 0), 0)
    : recommendedMealPlan.reduce((sum, m) => sum + m.calories, 0);

  const totalProtein = hasCustomMeals
    ? meals.reduce((sum, m) => sum + (m.protein || 0), 0)
    : recommendedMealPlan.reduce((sum, m) => sum + m.protein, 0);

  const totalCarbs = hasCustomMeals
    ? meals.reduce((sum, m) => sum + (m.carbs || 0), 0)
    : recommendedMealPlan.reduce((sum, m) => sum + m.carbs, 0);

  const totalFat = hasCustomMeals
    ? meals.reduce((sum, m) => sum + (m.fat || 0), 0)
    : recommendedMealPlan.reduce((sum, m) => sum + m.fat, 0);

  const goalCalories = macroCalibration.calories;
  const goalProtein = macroCalibration.protein;
  const goalCarbs = macroCalibration.carbs;
  const goalFat = macroCalibration.fat;

  const proteinPct = Math.min(100, Math.round((totalProtein / goalProtein) * 100));
  const carbsPct = Math.min(100, Math.round((totalCarbs / goalCarbs) * 100));
  const fatPct = Math.min(100, Math.round((totalFat / goalFat) * 100));
  const caloriesPct = Math.min(100, Math.round((totalCalories / goalCalories) * 100));

  // Add Custom Meal
  const handleAddMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealName.trim()) return;

    setIsSubmitting(true);
    const calNum = Math.max(0, parseInt(calories, 10) || 0);
    const protNum = Math.max(0, parseInt(protein, 10) || 0);
    const carbNum = Math.max(0, parseInt(carbs, 10) || 0);
    const fatNum = Math.max(0, parseInt(fat, 10) || 0);

    try {
      const newMeal = await insertNutritionLog(user?.id || null, {
        meal_name: mealName.trim(),
        calories: calNum,
        protein: protNum,
        carbs: carbNum,
        fat: fatNum,
      });

      startTransition(() => {
        const nextMeals = [...meals, newMeal];
        setMeals(nextMeals);
        syncDailyMetricsCalories(nextMeals);
      });

      // Reset form & close modal
      setMealName("");
      setCalories("");
      setProtein("");
      setCarbs("");
      setFat("");
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error creating meal log:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick Log a Recommended Meal into User's Actual Logs
  const handleQuickLogRecommended = async (rec: RecommendedMeal) => {
    try {
      const newMeal = await insertNutritionLog(user?.id || null, {
        meal_name: language === "bn" ? rec.titleBn : rec.titleEn,
        calories: rec.calories,
        protein: rec.protein,
        carbs: rec.carbs,
        fat: rec.fat,
      });

      startTransition(() => {
        const nextMeals = [...meals, newMeal];
        setMeals(nextMeals);
        syncDailyMetricsCalories(nextMeals);
      });
    } catch (err) {
      console.error("Failed to log recommended meal:", err);
    }
  };

  // Quick Log Entire Recommended Day
  const handleLogFullRecommendedDay = async () => {
    try {
      const added: NutritionLog[] = [];
      for (const rec of recommendedMealPlan) {
        const item = await insertNutritionLog(user?.id || null, {
          meal_name: language === "bn" ? rec.titleBn : rec.titleEn,
          calories: rec.calories,
          protein: rec.protein,
          carbs: rec.carbs,
          fat: rec.fat,
        });
        added.push(item);
      }
      startTransition(() => {
        const nextMeals = [...meals, ...added];
        setMeals(nextMeals);
        syncDailyMetricsCalories(nextMeals);
      });
    } catch (err) {
      console.error("Failed to log full plan:", err);
    }
  };

  // Delete Meal
  const handleDeleteMeal = async (id: string | number) => {
    try {
      await deleteNutritionLog(user?.id || null, id);
      const nextMeals = meals.filter((m) => String(m.id) !== String(id));
      setMeals(nextMeals);
      syncDailyMetricsCalories(nextMeals);
    } catch (err) {
      console.error("Failed to delete meal log:", err);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* 1. Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-black uppercase tracking-widest text-[#ccff00] mb-1 flex items-center gap-2">
            <span>⚡</span>
            <span>{language === "bn" ? "অ্যানাবলিক পুষ্টি ও পুনরুদ্ধার" : "ANABOLIC FUEL & RECOVERY"}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
            {language === "bn" ? "ম্যাক্রো ও ক্যালরি হাব" : "MACRO & CALORIE HUB"}
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-[#ccff00] hover:bg-[#d8ff33] text-black font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(204,255,0,0.3)] transition-all cursor-pointer self-start sm:self-auto active:scale-95 flex items-center gap-2"
        >
          <div className="w-3.5 h-3.5 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="w-3.5 h-3.5 font-black"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <span>{language === "bn" ? "+ খাবার লগ করুন" : "+ LOG MEAL"}</span>
        </button>
      </div>

      {/* 2. BMI Intelligence Calibration Banner */}
      <div className="rounded-2xl bg-[rgba(18,24,38,0.7)] backdrop-blur-md border border-[rgba(163,230,53,0.3)] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.4)] relative overflow-hidden">
        <div className="pointer-events-none absolute -right-16 -top-16 w-56 h-56 bg-[#ccff00]/[0.05] rounded-full blur-[70px]" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#121826] border border-[#a3e635]/40 text-white">
                {language === "bn" ? "বিএমআই মূল্যায়ন" : "BMI ASSESSMENT"}
              </span>
              <span
                className="text-[11px] font-black uppercase tracking-wider px-3 py-0.5 rounded-md text-black font-mono shadow-sm"
                style={{ backgroundColor: macroCalibration.color }}
              >
                {language === "bn" ? macroCalibration.badgeBn : macroCalibration.badgeEn}
              </span>
              <span className="text-xs font-mono font-bold text-[#ccff00]">
                BMI {bmiData.bmi} • {bmiData.weightKg} kg
              </span>
            </div>

            <p className="text-xs text-[#94a3b8] max-w-3xl leading-relaxed">
              {language === "bn" ? macroCalibration.adviceBn : macroCalibration.adviceEn}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/dashboard/bmi"
              className="text-xs font-bold text-[#ccff00] hover:text-white px-3 py-1.5 rounded-lg border border-[rgba(163,230,53,0.3)] hover:border-[#ccff00] bg-[#07090e]/80 transition-colors inline-flex items-center gap-1.5"
            >
              <span>{language === "bn" ? "বিএমআই টেস্ট দেখুন" : "Recalculate BMI"}</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Macro Targets Grid (Energy, Protein, Carbs, Fat) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Energy */}
        <div className="bg-[rgba(18,24,38,0.7)] border border-[rgba(163,230,53,0.2)] rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-[#94a3b8]">
              {language === "bn" ? "শক্তি / ক্যালরি" : "ENERGY"}
            </span>
            <div className="w-4 h-4 flex items-center justify-center text-[#ccff00]">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <div className="text-2xl font-black text-white font-mono mt-1">
            {totalCalories.toLocaleString()} / {goalCalories.toLocaleString()}
          </div>
          <div className="w-full bg-[#07090e] h-1.5 rounded-full mt-2.5 overflow-hidden border border-[rgba(163,230,53,0.1)]">
            <div
              className="bg-[#ccff00] h-full rounded-full transition-all duration-500"
              style={{ width: `${caloriesPct}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-1.5 text-xs font-mono">
            <span className="text-[#ccff00]">
              {Math.max(0, goalCalories - totalCalories)} kcal {dict.remaining}
            </span>
            <span className="text-[#94a3b8]">{caloriesPct}%</span>
          </div>
        </div>

        {/* Protein */}
        <div className="bg-[rgba(18,24,38,0.7)] border border-[rgba(163,230,53,0.2)] rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-[#94a3b8]">
              {language === "bn" ? "প্রোটিন" : "PROTEIN"}
            </span>
            <span className="text-[10px] font-mono font-bold text-[#ccff00] bg-[#ccff00]/10 px-2 py-0.5 rounded">
              {language === "bn" ? "টার্গেট" : "TARGET"}
            </span>
          </div>
          <div className="text-2xl font-black text-[#ccff00] font-mono mt-1">
            {totalProtein} / {goalProtein}g
          </div>
          <div className="w-full bg-[#07090e] h-1.5 rounded-full mt-2.5 overflow-hidden border border-[rgba(163,230,53,0.1)]">
            <div
              className="bg-[#ccff00] h-full rounded-full transition-all duration-500"
              style={{ width: `${proteinPct}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-1.5 text-xs font-mono">
            <span className="text-[#ccff00]">
              {language === "bn" ? `অবশিষ্ট ${Math.max(0, goalProtein - totalProtein)} গ্রাম` : `${Math.max(0, goalProtein - totalProtein)}g to goal`}
            </span>
            <span className="text-[#94a3b8]">{proteinPct}%</span>
          </div>
        </div>

        {/* Carbohydrates */}
        <div className="bg-[rgba(18,24,38,0.7)] border border-[rgba(163,230,53,0.2)] rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-[#94a3b8]">
              {language === "bn" ? "কার্বোহাইড্রেট" : "CARBOHYDRATES"}
            </span>
            <span className="text-[10px] font-mono text-[#94a3b8]">
              {language === "bn" ? "জ্বালানি" : "ENERGY FUEL"}
            </span>
          </div>
          <div className="text-2xl font-black text-white font-mono mt-1">
            {totalCarbs} / {goalCarbs}g
          </div>
          <div className="w-full bg-[#07090e] h-1.5 rounded-full mt-2.5 overflow-hidden border border-[rgba(163,230,53,0.1)]">
            <div
              className="bg-[#a3e635] h-full rounded-full transition-all duration-500"
              style={{ width: `${carbsPct}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-1.5 text-xs font-mono">
            <span className="text-[#94a3b8]">
              {language === "bn" ? `অবশিষ্ট ${Math.max(0, goalCarbs - totalCarbs)} গ্রাম` : `${Math.max(0, goalCarbs - totalCarbs)}g left`}
            </span>
            <span className="text-[#94a3b8]">{carbsPct}%</span>
          </div>
        </div>

        {/* Healthy Fats */}
        <div className="bg-[rgba(18,24,38,0.7)] border border-[rgba(163,230,53,0.2)] rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-[#94a3b8]">
              {language === "bn" ? "স্বাস্থ্যকর ফ্যাট" : "HEALTHY FATS"}
            </span>
            <span className="text-[10px] font-mono text-[#94a3b8]">
              {language === "bn" ? "হরমোন ভারসাম্য" : "HORMONAL"}
            </span>
          </div>
          <div className="text-2xl font-black text-white font-mono mt-1">
            {totalFat} / {goalFat}g
          </div>
          <div className="w-full bg-[#07090e] h-1.5 rounded-full mt-2.5 overflow-hidden border border-[rgba(163,230,53,0.1)]">
            <div
              className="bg-amber-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${fatPct}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-1.5 text-xs font-mono">
            <span className="text-[#94a3b8]">
              {language === "bn" ? `অবশিষ্ট ${Math.max(0, goalFat - totalFat)} গ্রাম` : `${Math.max(0, goalFat - totalFat)}g left`}
            </span>
            <span className="text-[#94a3b8]">{fatPct}%</span>
          </div>
        </div>
      </div>

      {/* 4. Today's Meals Section */}
      <div className="bg-[rgba(18,24,38,0.7)] backdrop-blur-md border border-[rgba(163,230,53,0.2)] rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-[rgba(163,230,53,0.12)]">
          <div>
            <h3 className="text-base font-black uppercase text-white flex items-center gap-2">
              <span>{dict.todayLoggedMeals}</span>
              {!hasCustomMeals && (
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#ccff00]/15 border border-[#ccff00]/40 text-[#ccff00]">
                  {language === "bn" ? "বিএমআই প্রস্তাবিত পরিকল্পনা" : "BMI RECOMMENDED PLAN"}
                </span>
              )}
            </h3>
            <p className="text-xs text-[#94a3b8] mt-0.5">
              {hasCustomMeals
                ? language === "bn"
                  ? "আজকে আপনার রেকর্ডকৃত কাস্টম খাবার ও ম্যাক্রো সমূহ।"
                  : "Your active meal logs recorded for today."
                : language === "bn"
                  ? "আজ কোনো কাস্টম খাবার যোগ করা হয়নি। আপনার বিএমআই অনুযায়ী সুষম পুষ্টি পরিকল্পনা নিচে স্বয়ংক্রিয়ভাবে তৈরি করা হয়েছে।"
                  : "No custom meals logged today. Showing an authentic daily nutrition plan calibrated to your BMI tier."}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {!hasCustomMeals && (
              <button
                type="button"
                onClick={handleLogFullRecommendedDay}
                className="px-3.5 py-1.5 rounded-lg bg-[#121826] border border-[#ccff00]/50 hover:bg-[#ccff00] hover:text-black text-[#ccff00] text-xs font-bold transition-all cursor-pointer"
                title="Log all 4 meals to your permanent tracker"
              >
                {language === "bn" ? "✓ সব খাবার লগ করুন" : "✓ Log Full Plan"}
              </button>
            )}
            <span className="text-xs font-mono font-bold text-[#ccff00] bg-[#07090e] px-3 py-1 rounded-lg border border-[rgba(163,230,53,0.2)]">
              {hasCustomMeals ? meals.length : recommendedMealPlan.length} {language === "bn" ? "টি খাবার" : "meals"}
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-xs text-[#94a3b8] animate-pulse font-mono">
            {language === "bn" ? "খাবারের তথ্য লোড হচ্ছে..." : "Loading nutrition logs..."}
          </div>
        ) : hasCustomMeals ? (
          /* Custom Meals Display */
          <div className="space-y-3">
            {meals.map((meal) => {
              const formattedTime = meal.created_at
                ? new Date(meal.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Today";

              return (
                <div
                  key={meal.id}
                  className="p-4 rounded-xl bg-[#07090e]/80 border border-[rgba(163,230,53,0.15)] hover:border-[rgba(163,230,53,0.3)] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div>
                    <h4 className="text-sm font-black text-white uppercase">
                      {meal.meal_name}
                    </h4>
                    <div className="text-xs text-[#94a3b8] font-mono mt-0.5">
                      {formattedTime}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono justify-between sm:justify-end">
                    <span className="text-white font-bold">{meal.calories} kcal</span>
                    <span className="text-[#ccff00] font-bold">{meal.protein}g P</span>
                    <span className="text-[#94a3b8]">{meal.carbs}g C</span>
                    <span className="text-[#94a3b8]">{meal.fat}g F</span>

                    <button
                      type="button"
                      onClick={() => handleDeleteMeal(meal.id)}
                      className="text-[#94a3b8] hover:text-rose-400 p-1 rounded transition-colors ml-2 cursor-pointer"
                      title={dict.deleteMeal}
                    >
                      <div className="w-4 h-4 flex items-center justify-center">
                        <svg
                          viewBox="0 0 24 24"
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </div>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Automatic BMI-Driven Recommended Meals */
          <div className="space-y-3">
            {recommendedMealPlan.map((rec) => {
              const typeBadge =
                rec.meal_type === "breakfast"
                  ? language === "bn" ? "সকালের নাস্তা" : "BREAKFAST"
                  : rec.meal_type === "lunch"
                  ? language === "bn" ? "দুপুরের খাবার" : "LUNCH"
                  : rec.meal_type === "snack"
                  ? language === "bn" ? "স্ন্যাক" : "SNACK"
                  : language === "bn" ? "রাতের খাবার" : "DINNER";

              return (
                <div
                  key={rec.id}
                  className="p-4 rounded-xl bg-[#07090e]/80 border border-[rgba(163,230,53,0.18)] hover:border-[#ccff00]/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#121826] border border-[#a3e635]/30 text-[#ccff00]">
                        {typeBadge} • {rec.timeLabel}
                      </span>
                      <h4 className="text-sm font-black text-white uppercase">
                        {language === "bn" ? rec.titleBn : rec.titleEn}
                      </h4>
                    </div>

                    <p className="text-xs text-[#94a3b8] font-normal leading-relaxed pl-1">
                      {language === "bn" ? rec.ingredientsBn : rec.ingredientsEn}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono justify-between md:justify-end shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[rgba(163,230,53,0.08)]">
                    <span className="text-white font-bold text-sm">{rec.calories} kcal</span>
                    <span className="text-[#ccff00] font-bold">{rec.protein}g P</span>
                    <span className="text-[#94a3b8]">{rec.carbs}g C</span>
                    <span className="text-[#94a3b8]">{rec.fat}g F</span>

                    <button
                      type="button"
                      onClick={() => handleQuickLogRecommended(rec)}
                      className="px-3 py-1.5 rounded-lg bg-[#121826] hover:bg-[#ccff00] hover:text-black border border-[#a3e635]/40 text-[#ccff00] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ml-2"
                      title="Save this meal into your personal record"
                    >
                      <span>+</span>
                      <span>{language === "bn" ? "লগ করুন" : "Log Meal"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Add Custom Meal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-[#0c1017] border border-[rgba(163,230,53,0.35)] shadow-[0_0_40px_rgba(204,255,0,0.15)] p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(163,230,53,0.15)]">
              <div>
                <h3 className="text-lg font-black uppercase text-white tracking-tight">
                  {dict.logMealTitle}
                </h3>
                <p className="text-xs text-[#94a3b8] mt-0.5">
                  {dict.logMealDesc}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-[#94a3b8] hover:text-white p-1 rounded transition-colors text-lg font-mono cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddMeal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8] mb-1">
                  {dict.mealNameLabel}
                </label>
                <input
                  type="text"
                  required
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                  placeholder={dict.mealNamePlaceholder}
                  className="w-full bg-[#07090e] border border-[rgba(163,230,53,0.2)] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8] mb-1">
                    {dict.caloriesLabel}
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    placeholder="520"
                    className="w-full bg-[#07090e] border border-[rgba(163,230,53,0.2)] rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8] mb-1">
                    {dict.proteinLabel}
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={protein}
                    onChange={(e) => setProtein(e.target.value)}
                    placeholder="45"
                    className="w-full bg-[#07090e] border border-[rgba(163,230,53,0.2)] rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8] mb-1">
                    {dict.carbsLabel}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={carbs}
                    onChange={(e) => setCarbs(e.target.value)}
                    placeholder="60"
                    className="w-full bg-[#07090e] border border-[rgba(163,230,53,0.2)] rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8] mb-1">
                    {dict.fatLabel}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={fat}
                    onChange={(e) => setFat(e.target.value)}
                    placeholder="12"
                    className="w-full bg-[#07090e] border border-[rgba(163,230,53,0.2)] rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] transition-colors"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[rgba(163,230,53,0.2)] text-xs font-bold text-[#94a3b8] hover:text-white transition-colors cursor-pointer"
                >
                  {dict.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#ccff00] hover:bg-[#d8ff33] text-black font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(204,255,0,0.3)] transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? dict.savedToStorage : dict.saveMealBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
