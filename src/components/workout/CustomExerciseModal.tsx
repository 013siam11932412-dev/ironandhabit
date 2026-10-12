"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { WorkoutExercise } from "@/lib/workoutStorage";

interface CustomExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExercise: (exercise: WorkoutExercise) => void;
  weightUnit: "kg" | "lbs";
}

export default function CustomExerciseModal({
  isOpen,
  onClose,
  onAddExercise,
  weightUnit,
}: CustomExerciseModalProps) {
  const { dict, language } = useLanguage();

  const [name, setName] = useState("");
  const [muscle, setMuscle] = useState("Chest");
  const [setsCount, setSetsCount] = useState<number>(3);
  const [initialWeight, setInitialWeight] = useState<number>(50);
  const [initialReps, setInitialReps] = useState<number>(10);

  const muscleOptions = [
    { id: "Chest", label: dict.chestMuscle },
    { id: "Back", label: dict.backMuscle },
    { id: "Shoulders", label: dict.shouldersMuscle },
    { id: "Biceps", label: dict.bicepsMuscle },
    { id: "Triceps", label: dict.tricepsMuscle },
    { id: "Legs", label: dict.legsMuscle },
    { id: "Core", label: dict.coreMuscle },
    { id: "Full Body", label: dict.fullBodyMuscle },
  ];

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    const sets = Array.from({ length: setsCount }, (_, i) => ({
      id: `set-${Date.now()}-${i + 1}`,
      setNumber: i + 1,
      weight: initialWeight,
      reps: initialReps,
      completed: false,
    }));

    const newExercise: WorkoutExercise = {
      id: `ex-custom-${Date.now()}`,
      nameEn: name.trim(),
      nameBn: name.trim(),
      targetMuscle: muscle,
      sets,
    };

    onAddExercise(newExercise);
    setName("");
    onClose();
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative z-10 w-full max-w-md bg-[rgba(18,24,38,0.95)] backdrop-blur-2xl border border-[rgba(163,230,53,0.3)] rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9)] max-h-[90vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-[rgba(163,230,53,0.15)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#121826] border border-[#a3e635]/40 flex items-center justify-center text-sm text-[#ccff00]">
              🏋️
            </div>
            <div>
              <h3 className="text-base font-black uppercase text-white tracking-tight">
                {dict.customExerciseModalTitle}
              </h3>
              <p className="text-[10px] text-[#94a3b8]">
                {dict.customExerciseModalDesc}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-[#07090e] border border-[rgba(163,230,53,0.2)] text-[#94a3b8] hover:text-white flex items-center justify-center text-xs"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Exercise Name */}
          <div>
            <label
              htmlFor="exercise-name"
              className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8] mb-1.5"
            >
              {dict.exerciseName}
            </label>
            <input
              id="exercise-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={
                language === "bn"
                  ? "উদা: ডাম্বেল চেস্ট প্রেস"
                  : "e.g. Incline Cable Flyes"
              }
              className="w-full bg-[#07090e] border border-[rgba(163,230,53,0.2)] rounded-xl px-4 py-3 text-sm text-white placeholder-[#94a3b8]/40 focus:outline-none focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] transition-colors"
            />
          </div>

          {/* Muscle Group Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8] mb-1.5">
              {dict.targetMuscle}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {muscleOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setMuscle(opt.id)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold uppercase text-center border transition-all ${
                    muscle === opt.id
                      ? "bg-[#ccff00] text-black border-[#ccff00] shadow-[0_0_12px_rgba(204,255,0,0.3)]"
                      : "bg-[#07090e] border-[rgba(163,230,53,0.15)] text-[#94a3b8] hover:text-white"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sets, Weight, Reps grid */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div>
              <label
                htmlFor="sets-count"
                className="block text-[11px] font-bold uppercase text-[#94a3b8] mb-1"
              >
                {dict.setNumber}s
              </label>
              <input
                id="sets-count"
                type="number"
                min={1}
                max={10}
                value={setsCount}
                onChange={(e) => setSetsCount(Number(e.target.value))}
                className="w-full bg-[#07090e] border border-[rgba(163,230,53,0.2)] rounded-xl px-3 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-[#ccff00]"
              />
            </div>

            <div>
              <label
                htmlFor="initial-weight"
                className="block text-[11px] font-bold uppercase text-[#94a3b8] mb-1"
              >
                {dict.weight} ({weightUnit.toUpperCase()})
              </label>
              <input
                id="initial-weight"
                type="number"
                min={0}
                step={0.5}
                value={initialWeight}
                onChange={(e) => setInitialWeight(Number(e.target.value))}
                className="w-full bg-[#07090e] border border-[rgba(163,230,53,0.2)] rounded-xl px-3 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-[#ccff00]"
              />
            </div>

            <div>
              <label
                htmlFor="initial-reps"
                className="block text-[11px] font-bold uppercase text-[#94a3b8] mb-1"
              >
                {dict.reps}
              </label>
              <input
                id="initial-reps"
                type="number"
                min={1}
                max={100}
                value={initialReps}
                onChange={(e) => setInitialReps(Number(e.target.value))}
                className="w-full bg-[#07090e] border border-[rgba(163,230,53,0.2)] rounded-xl px-3 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-[#ccff00]"
              />
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-[rgba(163,230,53,0.12)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase text-[#94a3b8] hover:text-white transition-colors"
            >
              {dict.cancel}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-[#ccff00] hover:bg-[#d8ff33] text-black shadow-[0_0_20px_rgba(204,255,0,0.35)] transition-all active:scale-95"
            >
              {dict.saveExercise}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
