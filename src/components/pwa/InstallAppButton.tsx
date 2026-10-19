"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import InstallModal from "./InstallModal";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

declare global {
  interface Window {
    __ironDeferredPrompt?: BeforeInstallPromptEvent | null;
  }
}

export default function InstallAppButton() {
  const { language } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInstalledOrDownloaded, setIsInstalledOrDownloaded] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Check if running in standalone PWA mode
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as any).standalone === true;

    // 2. Check persistent downloaded/installed flag in localStorage
    let isDownloaded = false;
    try {
      isDownloaded = localStorage.getItem("iron_app_downloaded") === "true";
    } catch {
      // ignore storage access restrictions
    }

    if (isStandalone || isDownloaded) {
      setIsInstalledOrDownloaded(true);
    }

    // Capture beforeinstallprompt immediately on page load
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      window.__ironDeferredPrompt = promptEvent;
      setDeferredPrompt(promptEvent);
    };

    // If already captured globally
    if (window.__ironDeferredPrompt) {
      setDeferredPrompt(window.__ironDeferredPrompt);
    }

    // Listen for browser appinstalled event
    const handleAppInstalled = () => {
      try {
        localStorage.setItem("iron_app_downloaded", "true");
      } catch {
        // ignore
      }
      setIsInstalledOrDownloaded(true);
      window.__ironDeferredPrompt = null;
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleDownloadSuccess = () => {
    try {
      localStorage.setItem("iron_app_downloaded", "true");
    } catch {
      // ignore
    }
    setIsInstalledOrDownloaded(true);
  };

  const handleButtonClick = () => {
    const ua = typeof navigator !== "undefined" ? navigator.userAgent || "" : "";
    const isIOS =
      /iPad|iPhone|iPod/.test(ua) ||
      (typeof navigator !== "undefined" &&
        navigator.platform === "MacIntel" &&
        navigator.maxTouchPoints > 1);

    // If iOS: Immediately show the 2-step visual guide in modal
    if (isIOS) {
      setIsModalOpen(true);
      return;
    }

    // For Android/PWA: Directly trigger native prompt immediately if available
    const promptEvent =
      deferredPrompt || (typeof window !== "undefined" ? window.__ironDeferredPrompt : null);

    if (promptEvent) {
      try {
        localStorage.setItem("iron_app_downloaded", "true");
      } catch {
        // ignore
      }

      // Synchronous prompt trigger on immediate click event
      promptEvent.prompt();
      promptEvent.userChoice
        .then((choice) => {
          if (choice.outcome === "accepted") {
            setIsInstalledOrDownloaded(true);
          }
          if (typeof window !== "undefined") {
            window.__ironDeferredPrompt = null;
          }
          setDeferredPrompt(null);
        })
        .catch(() => {});
      return;
    }

    // If native prompt is unavailable, open install modal immediately
    setIsModalOpen(true);
  };

  // If running in standalone or already downloaded/installed, hide completely
  if (isInstalledOrDownloaded) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={handleButtonClick}
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
        onDownloadSuccess={handleDownloadSuccess}
        initialPrompt={deferredPrompt}
      />
    </>
  );
}
