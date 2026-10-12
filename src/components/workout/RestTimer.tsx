"use client";

import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface RestTimerProps {
  onTimerComplete?: () => void;
}

export default function RestTimer({ onTimerComplete }: RestTimerProps) {
  const { dict, language } = useLanguage();

  const presets = [30, 60, 90, 120];
  const [selectedDuration, setSelectedDuration] = useState<number>(60);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [showFinishedNotice, setShowFinishedNotice] = useState<boolean>(false);

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play synthetic pleasant beep using browser Web Audio API
  function playBeep() {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      // First beep
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(880, ctx.currentTime); // A5
      gain1.gain.setValueAtTime(0.15, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.3);

      // Second higher chime after 150ms
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(1320, ctx.currentTime); // E6
        gain2.gain.setValueAtTime(0.2, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start();
        osc2.stop(ctx.currentTime + 0.4);
      }, 150);
    } catch {
      // Audio context might fail silently if user hasn't interacted
    }
  }

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          setShowFinishedNotice(true);
          playBeep();
          onTimerComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [isRunning, onTimerComplete]);

  useEffect(() => {
    if (!showFinishedNotice) return;
    const timer = setTimeout(() => {
      setShowFinishedNotice(false);
    }, 6000);
    return () => clearTimeout(timer);
  }, [showFinishedNotice]);

  function handleSelectPreset(seconds: number) {
    setSelectedDuration(seconds);
    setTimeLeft(seconds);
    setIsRunning(false);
    setShowFinishedNotice(false);
  }

  function handleTogglePlay() {
    if (timeLeft === 0) {
      setTimeLeft(selectedDuration);
    }
    setIsRunning((prev) => !prev);
    setShowFinishedNotice(false);
  }

  function handleReset() {
    setIsRunning(false);
    setTimeLeft(selectedDuration);
    setShowFinishedNotice(false);
  }

  function handleAdjustTime(deltaSeconds: number) {
    setTimeLeft((prev) => {
      const updated = Math.max(5, prev + deltaSeconds);
      if (!isRunning) setSelectedDuration(updated);
      return updated;
    });
  }

  // Circular SVG progress math
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = selectedDuration > 0 ? timeLeft / selectedDuration : 0;
  const strokeDashoffset = circumference - progressRatio * circumference;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;

  return (
    <div className="bg-[rgba(18,24,38,0.7)] backdrop-blur-md border border-[rgba(163,230,53,0.25)] rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Glow highlight */}
      <div className="pointer-events-none absolute -top-12 -right-12 w-36 h-36 bg-[#ccff00]/[0.08] blur-[50px] rounded-full" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[rgba(163,230,53,0.12)]">
        <div className="flex items-center gap-2">
          <span className="text-base">⏱️</span>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-white">
              {dict.restTimer}
            </h3>
            <p className="text-[10px] text-[#94a3b8]">
              {dict.restTimerDesc}
            </p>
          </div>
        </div>

        {isRunning && (
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/30 text-[9px] font-mono text-[#ccff00] uppercase font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00] animate-ping" />
            Active
          </span>
        )}
      </div>

      {/* Finished Banner Notice */}
      {showFinishedNotice && (
        <div className="mb-4 p-3 rounded-xl bg-[#ccff00]/15 border border-[#ccff00] text-black bg-[#ccff00] font-black text-xs text-center shadow-[0_0_20px_rgba(204,255,0,0.4)] animate-bounce">
          {dict.timerFinished}
        </div>
      )}

      {/* Main Timer Display & Circle */}
      <div className="flex flex-col sm:flex-row items-center justify-around gap-6 my-2">
        {/* SVG Circular Ring */}
        <div className="relative w-32 h-32 flex-shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            {/* Background Track */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              stroke="rgba(163, 230, 53, 0.12)"
              strokeWidth="8"
              fill="transparent"
            />
            {/* Animated Progress Ring */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              stroke="#ccff00"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-300 ease-linear"
              style={{
                filter: "drop-shadow(0 0 8px rgba(204, 255, 0, 0.5))",
              }}
            />
          </svg>

          {/* Time text centered */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-white font-mono tracking-tight">
              {formattedTime}
            </span>
            <span className="text-[9px] font-mono uppercase text-[#94a3b8]">
              {language === "bn" ? "বাকি সময়" : "REMAINING"}
            </span>
          </div>
        </div>

        {/* Controls & Quick Adjust */}
        <div className="flex flex-col items-center sm:items-start gap-3 w-full sm:w-auto">
          {/* Preset Buttons */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#07090e] border border-[rgba(163,230,53,0.2)]">
            {presets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  selectedDuration === preset && !isRunning
                    ? "bg-[#ccff00] text-black shadow-[0_0_10px_rgba(204,255,0,0.3)]"
                    : "text-[#94a3b8] hover:text-white"
                }`}
              >
                {preset}s
              </button>
            ))}
          </div>

          {/* +/- 15s Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleAdjustTime(-15)}
              className="px-2.5 py-1 rounded-lg bg-[#07090e] border border-[rgba(163,230,53,0.2)] text-[11px] font-mono text-[#94a3b8] hover:text-[#ccff00] hover:border-[#ccff00] transition-colors"
            >
              -15s
            </button>
            <button
              type="button"
              onClick={() => handleAdjustTime(15)}
              className="px-2.5 py-1 rounded-lg bg-[#07090e] border border-[rgba(163,230,53,0.2)] text-[11px] font-mono text-[#94a3b8] hover:text-[#ccff00] hover:border-[#ccff00] transition-colors"
            >
              +15s
            </button>
          </div>

          {/* Action Buttons: START / PAUSE and RESET */}
          <div className="flex items-center gap-2 w-full mt-1">
            <button
              type="button"
              onClick={handleTogglePlay}
              className={`flex-1 py-2 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 shadow-md ${
                isRunning
                  ? "bg-amber-400 text-black hover:bg-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.3)]"
                  : "bg-[#ccff00] text-black hover:bg-[#d8ff33] shadow-[0_0_15px_rgba(204,255,0,0.35)]"
              }`}
            >
              {isRunning ? dict.pauseTimer : dict.startTimer}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="py-2 px-3 rounded-xl bg-[#07090e] border border-[rgba(163,230,53,0.25)] text-[#94a3b8] hover:text-white text-xs font-bold uppercase transition-colors"
            >
              {dict.resetTimer}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
