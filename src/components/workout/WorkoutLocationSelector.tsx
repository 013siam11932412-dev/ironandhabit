"use client";

import { useState } from "react";

export type WorkoutLocation = "home" | "gym";

interface WorkoutLocationSelectorProps {
  onSelect?: (location: WorkoutLocation) => void;
  initialLocation?: WorkoutLocation;
}

export default function WorkoutLocationSelector({
  onSelect,
  initialLocation = "home",
}: WorkoutLocationSelectorProps) {
  const [selected, setSelected] = useState<WorkoutLocation>(initialLocation);

  const handleSelect = (loc: WorkoutLocation) => {
    setSelected(loc);
    if (onSelect) {
      onSelect(loc);
    }
  };

  return (
    <div className="w-full max-w-sm sm:max-w-md bg-[#0d131f] border border-slate-800 rounded-3xl p-6 flex flex-col items-center shadow-2xl text-slate-100">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">📍</span>
        <h2 className="text-lg font-bold text-slate-200">
          আপনি কোথায় ব্যায়াম করতে চান?
        </h2>
      </div>
      <p className="text-xs text-slate-400 mb-6 text-center">
        আপনার সুবিধা অনুযায়ী সঠিক ওয়ার্কআউট প্ল্যান নির্বাচন করুন
      </p>

      {/* Selection Cards */}
      <div className="grid grid-cols-2 gap-3 w-full mb-4">
        {/* Home Option */}
        <button
          type="button"
          onClick={() => handleSelect("home")}
          className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all text-center group cursor-pointer ${
            selected === "home"
              ? "border-[#ccff00] bg-[rgba(204,255,0,0.08)] shadow-[0_0_20px_rgba(204,255,0,0.18)]"
              : "border-slate-800 bg-[#121826]/70 hover:border-slate-700 hover:bg-[#121826]"
          }`}
        >
          <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">
            🏠
          </span>
          <span
            className={`text-base font-bold mb-1 ${
              selected === "home" ? "text-[#ccff00]" : "text-white"
            }`}
          >
            বাসায়
          </span>
          <span className="text-[11px] text-slate-400">
            বডিওয়েট ও সহজ সেটআপ
          </span>
          {selected === "home" && (
            <span className="mt-2 text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-[#ccff00] text-black font-bold">
              নির্বাচিত
            </span>
          )}
        </button>

        {/* Gym Option */}
        <button
          type="button"
          onClick={() => handleSelect("gym")}
          className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all text-center group cursor-pointer ${
            selected === "gym"
              ? "border-[#ccff00] bg-[rgba(204,255,0,0.08)] shadow-[0_0_20px_rgba(204,255,0,0.18)]"
              : "border-slate-800 bg-[#121826]/70 hover:border-slate-700 hover:bg-[#121826]"
          }`}
        >
          <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">
            🏋️
          </span>
          <span
            className={`text-base font-bold mb-1 ${
              selected === "gym" ? "text-[#ccff00]" : "text-white"
            }`}
          >
            জিম
          </span>
          <span className="text-[11px] text-slate-400">
            হেভি ওয়েটস ও মেশিন
          </span>
          {selected === "gym" && (
            <span className="mt-2 text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-[#ccff00] text-black font-bold">
              নির্বাচিত
            </span>
          )}
        </button>
      </div>

      <div className="w-full text-center">
        <p className="text-[11px] font-mono text-slate-500">
          বর্তমান মোড:{" "}
          <span className="text-[#ccff00] font-bold">
            {selected === "home" ? "হোম ওয়ার্কআউট" : "জিম ওয়ার্কআউট"}
          </span>
        </p>
      </div>
    </div>
  );
}
