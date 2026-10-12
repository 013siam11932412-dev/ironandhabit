"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import AuthForm from "./AuthForm";

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, activeAuthTab } = useAuth();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isAuthModalOpen) {
        closeAuthModal();
      }
    }
    if (isAuthModalOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          closeAuthModal();
        }
      }}
    >
      {/* Ambient Glows */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-[#ccff00]/[0.06] blur-[150px] rounded-full" />
      </div>

      {/* Modal Surface */}
      <div className="relative z-10 w-full max-w-md bg-[rgba(18,24,38,0.92)] backdrop-blur-2xl border border-[rgba(163,230,53,0.3)] rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9)] max-h-[90vh] overflow-y-auto">
        {/* Top Header: Brand & Close Button */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[rgba(163,230,53,0.15)]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#121826] border border-[#a3e635]/40 flex items-center justify-center shadow-[0_0_15px_rgba(204,255,0,0.2)]">
              <svg
                className="w-5 h-5 text-[#ccff00]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <span className="font-black text-lg tracking-wider text-white">
              IRON <span className="text-[#ccff00]">&</span> HABIT
            </span>
          </div>

          <button
            type="button"
            onClick={closeAuthModal}
            className="w-8 h-8 rounded-lg bg-[#07090e] border border-[rgba(163,230,53,0.2)] text-[#94a3b8] hover:text-white hover:border-[#ccff00] flex items-center justify-center transition-colors text-sm font-bold"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Auth Form */}
        <AuthForm
          initialTab={activeAuthTab}
          isModal={true}
          onSuccess={closeAuthModal}
        />
      </div>
    </div>
  );
}
