"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownloadSuccess?: () => void;
}

export default function InstallModal({
  isOpen,
  onClose,
  onDownloadSuccess,
}: InstallModalProps) {
  const { language } = useLanguage();
  const [detectedPlatform, setDetectedPlatform] = useState<"ios" | "android" | "desktop">("desktop");
  const [activeTab, setActiveTab] = useState<"ios" | "android">("android");
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [pwaInstallSuccess, setPwaInstallSuccess] = useState(false);
  const [isDownloadingApk, setIsDownloadingApk] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Detect standalone mode
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as any).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
    }

    const ua = navigator.userAgent || "";
    const isIOS =
      /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const isAndroid = /Android/.test(ua);

    if (isIOS) {
      setDetectedPlatform("ios");
      setActiveTab("ios");
    } else if (isAndroid) {
      setDetectedPlatform("android");
      setActiveTab("android");
    } else {
      setDetectedPlatform("desktop");
      setActiveTab("android");
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setPwaInstallSuccess(true);
      setDeferredPrompt(null);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("iron_app_downloaded", "true");
        } catch {
          // ignore
        }
      }
      onDownloadSuccess?.();
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);

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
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [isOpen, onClose, onDownloadSuccess]);

  if (!isOpen) return null;

  async function handlePwaInstall() {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("iron_app_downloaded", "true");
      } catch {
        // ignore
      }
    }
    onDownloadSuccess?.();

    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === "accepted") {
          setPwaInstallSuccess(true);
        }
        setDeferredPrompt(null);
      } catch (err) {
        console.error("Install prompt error:", err);
      }
    } else {
      // Fallback hint for desktop or modern browsers
      alert(
        language === "bn"
          ? "ব্রাউজার মেনু থেকে 'Install Iron & Habit' বা 'Add to Home Screen' ক্লিক করুন।"
          : "Please use your browser's install icon in the URL address bar or menu to install Iron & Habit."
      );
    }
  }

  function handleApkDownload() {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("iron_app_downloaded", "true");
      } catch {
        // ignore
      }
    }
    onDownloadSuccess?.();
    setIsDownloadingApk(true);
    setTimeout(() => {
      setIsDownloadingApk(false);
    }, 2500);
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
      {/* Ambient Neon Lighting */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-[#ccff00]/[0.08] blur-[150px] rounded-full" />
      </div>

      {/* Modal Surface */}
      <div className="relative z-10 w-full max-w-lg bg-[rgba(12,16,23,0.95)] backdrop-blur-2xl border border-[rgba(163,230,53,0.35)] rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.95)] max-h-[90vh] overflow-y-auto">
        {/* Header: Brand & Close */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-[rgba(163,230,53,0.15)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#121826] border border-[#a3e635]/40 flex items-center justify-center shadow-[0_0_15px_rgba(204,255,0,0.25)] text-[#ccff00]">
              <div className="w-5 h-5 flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <rect x="5" y="2" width="14" height="20" rx="3" />
                  <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="3" />
                </svg>
              </div>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black uppercase text-white tracking-tight">
                {language === "bn" ? "অ্যাপ ইনস্টল করুন" : "INSTALL IRON & HABIT"}
              </h2>
              <p className="text-xs text-[#94a3b8]">
                {language === "bn"
                  ? "ফোনে ফুল-স্ক্রিন অ্যাথলিট অ্যাপ হিসেবে ব্যবহার করুন"
                  : "Standalone full-screen training app with offline tracking"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#07090e] border border-[rgba(163,230,53,0.2)] text-[#94a3b8] hover:text-white hover:border-[#ccff00] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close install modal"
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </button>
        </div>

        {/* Platform Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-[#07090e] border border-[rgba(163,230,53,0.25)] rounded-xl mb-6">
          <button
            type="button"
            onClick={() => setActiveTab("android")}
            className={`py-2 px-3 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "android"
                ? "bg-[#ccff00] text-black shadow-[0_0_15px_rgba(204,255,0,0.35)]"
                : "text-[#94a3b8] hover:text-white"
            }`}
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="4" y="4" width="16" height="16" rx="2" />
                <path d="M9 9h.01M15 9h.01M8 15h8" />
              </svg>
            </div>
            <span>Android / PC</span>
            {detectedPlatform === "android" && (
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-black/20 font-mono">
                {language === "bn" ? "সনাক্ত" : "DETECTED"}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("ios")}
            className={`py-2 px-3 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "ios"
                ? "bg-[#ccff00] text-black shadow-[0_0_15px_rgba(204,255,0,0.35)]"
                : "text-[#94a3b8] hover:text-white"
            }`}
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a4 4 0 0 0-4 4v1a4 4 0 0 0 8 0V6a4 4 0 0 0-4-4z" />
                <path d="M16 11c1.5 1 2 2.5 2 4.5 0 3-2 6.5-6 6.5s-6-3.5-6-6.5c0-2 .5-3.5 2-4.5" />
              </svg>
            </div>
            <span>iPhone / iOS</span>
            {detectedPlatform === "ios" && (
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-black/20 font-mono">
                {language === "bn" ? "সনাক্ত" : "DETECTED"}
              </span>
            )}
          </button>
        </div>

        {/* Success Banner if Installed */}
        {pwaInstallSuccess && (
          <div className="mb-5 p-3 rounded-xl bg-emerald-500/15 border border-[#ccff00]/60 text-[#ccff00] text-xs font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(204,255,0,0.15)] animate-in fade-in">
            <div className="w-4 h-4 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span>
              {language === "bn"
                ? "Iron & Habit সফলভাবে ইনস্টল হয়েছে! আপনার হোম স্ক্রিনে যুক্ত করা হয়েছে।"
                : "Iron & Habit installed successfully! You can now launch it from your home screen."}
            </span>
          </div>
        )}

        {/* TAB CONTENT: 1. ANDROID & DESKTOP */}
        {activeTab === "android" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Primary Action: Direct 1-Click PWA Install */}
            <div className="p-4 rounded-2xl bg-[#07090e]/90 border border-[rgba(163,230,53,0.3)] shadow-[0_0_20px_rgba(204,255,0,0.1)] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">⚡</span>
                  <span className="text-xs font-black uppercase text-white tracking-wider">
                    {language === "bn" ? "১-ক্লিক ওয়েব অ্যাপ (PWA)" : "1-CLICK DIRECT APP (PWA)"}
                  </span>
                </div>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/40">
                  {language === "bn" ? "সুপারিশকৃত" : "RECOMMENDED"}
                </span>
              </div>

              <p className="text-xs text-[#94a3b8] leading-relaxed">
                {language === "bn"
                  ? "ফোনে কোনো মেমরি অপচয় ছাড়াই তাৎক্ষণিক ইনস্টল করুন। সম্পূর্ণ অফলাইন সাপোর্ট ও স্বয়ংক্রিয় আপডেট সমৃদ্ধ।"
                  : "Installs instantly with zero storage bloat. Native performance, full offline habit & workout logging, and automatic background updates."}
              </p>

              <button
                type="button"
                onClick={handlePwaInstall}
                className="w-full py-3 px-4 rounded-xl bg-[#ccff00] hover:bg-[#d8ff33] text-black font-black text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(204,255,0,0.35)] hover:shadow-[0_0_35px_rgba(204,255,0,0.55)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
                <span>
                  {isInstalled
                    ? language === "bn" ? "ইতিমধ্যে ইনস্টল করা আছে" : "Already Installed"
                    : language === "bn" ? "সরাসরি ইনস্টল করুন (PWA)" : "Install Directly to Device"}
                </span>
              </button>
            </div>

            {/* Secondary Option: Direct Android APK */}
            <div className="p-4 rounded-2xl bg-[#07090e]/70 border border-[rgba(163,230,53,0.18)] hover:border-[rgba(163,230,53,0.35)] transition-all space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">🤖</span>
                  <span className="text-xs font-black uppercase text-white tracking-wider">
                    {language === "bn" ? "অ্যান্ড্রয়েড প্যাকেজ (.APK)" : "DIRECT ANDROID PACKAGE (.APK)"}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#94a3b8] bg-[#121826] px-2 py-0.5 rounded border border-[#a3e635]/20">
                  v1.0.4 • 4.2 MB
                </span>
              </div>

              <p className="text-xs text-[#94a3b8] leading-relaxed">
                {language === "bn"
                  ? "অ্যান্ড্রয়েড ডিভাইসের জন্য সরাসরি স্ট্যান্ডঅ্যালন প্যাকেজ ফাইল ডাউনলোড করে ইনস্টল করুন।"
                  : "Download the direct standalone APK package for manual sideloading or offline distribution on any Android phone."}
              </p>

              <a
                href="/downloads/IronAndHabit.apk"
                download="IronAndHabit.apk"
                onClick={handleApkDownload}
                className="w-full py-2.5 px-4 rounded-xl bg-[#121826] hover:bg-[#1a2337] border border-[#a3e635]/40 text-[#ccff00] hover:border-[#ccff00] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-[0_0_15px_rgba(204,255,0,0.12)]"
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  {isDownloadingApk ? (
                    <svg className="animate-spin w-4 h-4 text-[#ccff00]" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" />
                    </svg>
                  )}
                </div>
                <span>
                  {isDownloadingApk
                    ? language === "bn"
                      ? "ডাউনলোড শুরু হয়েছে..."
                      : "Downloading APK..."
                    : language === "bn"
                    ? "অ্যান্ড্রয়েড এপিকে ডাউনলোড (.APK)"
                    : "Download Android App (.APK)"}
                </span>
              </a>
            </div>
          </div>
        )}

        {/* TAB CONTENT: 2. IPHONE / IOS GUIDE */}
        {activeTab === "ios" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-3 rounded-xl bg-[#ccff00]/10 border border-[#ccff00]/30 text-xs text-[#ccff00] font-semibold leading-relaxed">
              {language === "bn"
                ? "আইফোনে অ্যাপ স্টোরের প্রয়োজন নেই! অ্যাপল সাফারি ব্রাউজার থেকে ২ ধাপে হোম স্ক্রিনে যুক্ত করুন:"
                : "No App Store required! Install directly on iPhone via Safari in 2 simple steps:"}
            </div>

            {/* Step 1 Card */}
            <div className="p-4 rounded-2xl bg-[#07090e]/90 border border-[rgba(163,230,53,0.25)] flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#121826] border border-[#a3e635]/40 flex items-center justify-center text-[#ccff00] shrink-0 shadow-[0_0_15px_rgba(204,255,0,0.15)]">
                <div className="w-5 h-5 flex items-center justify-center">
                  {/* Safari Share Icon */}
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 12v7a2 2 0 002 2h12a2 2 0 002-2v-7" />
                    <polyline points="16 6 12 2 8 6" />
                    <line x1="12" y1="2" x2="12" y2="15" />
                  </svg>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#ccff00] text-black">
                    {language === "bn" ? "ধাপ ১" : "STEP 1"}
                  </span>
                  <h3 className="text-sm font-black text-white uppercase">
                    {language === "bn" ? "সাফারি শেয়ার বাটনে ট্যাপ করুন" : "Tap the Safari Share Button"}
                  </h3>
                </div>
                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  {language === "bn"
                    ? "সাফারি ব্রাউজারের নিচের টুলবার থেকে 'Share' (শেয়ার) আইকনটিতে ট্যাপ করুন।"
                    : "Tap the Share icon at the bottom of your Safari browser toolbar."}
                </p>
              </div>
            </div>

            {/* Step 2 Card */}
            <div className="p-4 rounded-2xl bg-[#07090e]/90 border border-[rgba(163,230,53,0.25)] flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#121826] border border-[#a3e635]/40 flex items-center justify-center text-[#ccff00] shrink-0 shadow-[0_0_15px_rgba(204,255,0,0.15)]">
                <div className="w-5 h-5 flex items-center justify-center">
                  {/* Add to Home Screen Plus Icon */}
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="4" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                  </svg>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#ccff00] text-black">
                    {language === "bn" ? "ধাপ ২" : "STEP 2"}
                  </span>
                  <h3 className="text-sm font-black text-white uppercase">
                    {language === "bn" ? "'হোম স্ক্রিনে যোগ করুন' নির্বাচন করুন" : "Select 'Add to Home Screen'"}
                  </h3>
                </div>
                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  {language === "bn"
                    ? "মেনুটি নিচের দিকে স্ক্রোল করে 'Add to Home Screen' অপশনে চাপ দিন এবং উপরে ডানে 'Add' নির্বাচন করুন।"
                    : "Scroll down the menu list and tap 'Add to Home Screen', then confirm by tapping 'Add' in the top right."}
                </p>
              </div>
            </div>

            {/* iOS Standalone Features */}
            <div className="p-3 rounded-xl bg-[#07090e]/60 border border-[rgba(163,230,53,0.15)] text-[11px] text-[#94a3b8] flex items-center gap-2">
              <div className="w-4 h-4 flex items-center justify-center text-[#ccff00] shrink-0">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>
                {language === "bn"
                  ? "হোম স্ক্রিন থেকে ওপেন করলে এটি ফুল-স্ক্রিন মোডে এবং অফলাইনেও চলবে।"
                  : "Launches in dedicated full-screen mode with zero browser address bars and offline caching."}
              </span>
            </div>
          </div>
        )}

        {/* Modal Bottom Footer Notice */}
        <div className="mt-6 pt-4 border-t border-[rgba(163,230,53,0.12)] flex items-center justify-between text-[11px] text-[#94a3b8]">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00] animate-pulse" />
            <span>{language === "bn" ? "আয়রন অ্যান্ড হ্যাবিট মোবাইল সংস্করণ" : "Iron & Habit Mobile Suite"}</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-[#ccff00] hover:underline font-bold cursor-pointer"
          >
            {language === "bn" ? "বন্ধ করুন" : "Done / Close"}
          </button>
        </div>
      </div>
    </div>
  );
}
