"use client";

import { useState, useEffect } from "react";

export default function RestTimer() {
  const [seconds, setSeconds] = useState(60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
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
    <div className="w-full max-w-xs sm:max-w-sm bg-[#0d131f] border border-slate-800 rounded-3xl p-4 sm:p-5 flex flex-col items-center shadow-2xl text-slate-100">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-lg">⏱️</span>
        <h2 className="text-base font-bold text-slate-200">রেস্ট টাইমার</h2>
      </div>
      <p className="text-[11px] text-slate-400 mb-4 text-center">সেটের মাঝে পর্যাপ্ত রিকভারি নিশ্চিত করুন</p>

      {/* Strictly Sized Bounded Circular Ring */}
      <div className="relative w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center mb-4">
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
          <span className="text-3xl sm:text-4xl font-extrabold tracking-wider font-mono text-[#ccff00]">
            {formatTime(seconds)}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5">বাকি সময়</span>
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
