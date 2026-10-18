"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import InstallModal from "./InstallModal";

export default function InstallAppButton() {
  const { language } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#121826] border border-[#a3e635]/40 text-[#ccff00] hover:border-[#ccff00] hover:shadow-[0_0_15px_rgba(204,255,0,0.25)] transition-all cursor-pointer active:scale-95"
        title={language === "bn" ? "মোবাইল অ্যাপ ইনস্টল করুন" : "Install mobile app"}
      >
        <div className="w-3.5 h-3.5 flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <rect x="5" y="2" width="14" height="20" rx="3" />
            <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="3" />
          </svg>
        </div>
        <span>{language === "bn" ? "অ্যাপ ইনস্টল" : "Get App"}</span>
      </button>

      <InstallModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
