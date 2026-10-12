"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="inline-flex items-center p-0.5 rounded-lg bg-[#07090e] border border-[rgba(163,230,53,0.25)] shadow-inner">
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`px-2.5 py-1 rounded-md text-[11px] font-black tracking-wider uppercase transition-all duration-200 ${
          language === "en"
            ? "bg-[rgba(18,24,38,0.9)] text-[#ccff00] border border-[#ccff00]/50 shadow-[0_0_12px_rgba(204,255,0,0.35)]"
            : "text-[#94a3b8] hover:text-white"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage("bn")}
        className={`px-2.5 py-1 rounded-md text-[11px] font-black tracking-wider transition-all duration-200 ${
          language === "bn"
            ? "bg-[rgba(18,24,38,0.9)] text-[#ccff00] border border-[#ccff00]/50 shadow-[0_0_12px_rgba(204,255,0,0.35)]"
            : "text-[#94a3b8] hover:text-white"
        }`}
      >
        বাংলা
      </button>
    </div>
  );
}
