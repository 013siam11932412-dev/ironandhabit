"use client";

import { useState, useEffect } from "react";

export default function RestTimer() {
  const [seconds, setSeconds] = useState(60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds]);

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = time % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePreset = (sec: number) => {
    setIsActive(false);
    setSeconds(sec);
  };

  const adjustTime = (sec: number) => {
    setSeconds((prev) => Math.max(0, prev + sec));
  };

  const resetTimer = () => {
    setIsActive(false);
    setSeconds(60);
  };

  return (
    <div className="w-full max-w-sm sm:max-w-md bg-[#0d131f] border border-slate-800 rounded-3xl p-6 flex flex-col items-center shadow-2xl text-slate-100">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">⏱️</span>
        <h2 className="text-lg font-bold text-slate-200">রেস্ট টাইমার</h2>
      </div>
      <p className="text-xs text-slate-400 mb-6">সেটের মাঝে পর্যাপ্ত রিকভারি নিশ্চিত করুন</p>

      {/* Strictly Sized Bounded Circular Ring */}
      <div className="relative w-56 h-56 sm:w-60 sm:h-60 flex items-center justify-center mb-6">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="44"
            className="stroke-slate-800"
            strokeWidth="6"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r="44"
            className="stroke-[#ccff00] transition-all duration-300"
            strokeWidth="6"
            strokeDasharray={276}
            strokeDashoffset={276 - (276 * seconds) / 60}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-4xl font-extrabold tracking-wider font-mono text-[#ccff00]">
            {formatTime(seconds)}
          </span>
          <span className="text-xs text-slate-400 mt-1">বাকি সময়</span>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="grid grid-cols-4 gap-2 w-full mb-3">
        {[30, 60, 90, 120].map((t) => (
          <button
            key={t}
            onClick={() => handlePreset(t)}
            className={`py-1.5 rounded-lg text-xs font-semibold transition ${
              seconds === t
                ? "bg-[#ccff00] text-black"
                : "bg-slate-800/80 hover:bg-slate-700 text-slate-300"
            }`}
          >
            {t}s
          </button>
        ))}
      </div>

      {/* Adjust Buttons */}
      <div className="flex gap-2 w-full mb-6">
        <button
          onClick={() => adjustTime(-15)}
          className="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-slate-800/60 hover:bg-slate-700 text-slate-300 transition border border-slate-700"
        >
          -15s
        </button>
        <button
          onClick={() => adjustTime(15)}
          className="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-slate-800/60 hover:bg-slate-700 text-slate-300 transition border border-slate-700"
        >
          +15s
        </button>
      </div>

      {/* Action Controls */}
      <div className="flex gap-3 w-full">
        <button
          onClick={() => setIsActive(!isActive)}
          className="flex-1 py-3 rounded-xl font-bold bg-[#ccff00] text-black hover:opacity-90 transition active:scale-95"
        >
          {isActive ? "পজ" : "শুরু"}
        </button>
        <button
          onClick={resetTimer}
          className="px-5 py-3 rounded-xl font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition active:scale-95 border border-slate-700"
        >
          রিসেট
        </button>
      </div>
    </div>
  );
}
