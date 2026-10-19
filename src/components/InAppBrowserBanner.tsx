"use client";

import { useEffect, useState } from "react";

export default function InAppBrowserBanner() {
  const [isInApp, setIsInApp] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !navigator?.userAgent) return;

    // Check if dismissed in this session
    try {
      if (sessionStorage.getItem("iron_in_app_banner_dismissed")) {
        return;
      }
    } catch {
      // ignore storage access issues
    }

    const ua = navigator.userAgent || navigator.vendor || "";
    // Detect Facebook, Messenger, Instagram, WhatsApp, or other common in-app WebViews
    const isFacebook = /FBAN|FBAV|FB_IAB/i.test(ua);
    const isInstagram = /Instagram/i.test(ua);
    const isMessenger = /Messenger/i.test(ua);
    const isWhatsApp = /WhatsApp/i.test(ua);

    if (isFacebook || isInstagram || isMessenger || isWhatsApp) {
      setIsInApp(true);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem("iron_in_app_banner_dismissed", "1");
    } catch {
      // ignore
    }
  };

  if (!isInApp || dismissed) return null;

  return (
    <div className="relative z-50 bg-[#0c121e] border-b border-[rgba(163,230,53,0.35)] shadow-[0_4px_15px_rgba(204,255,0,0.08)] px-4 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-5 h-5 rounded-md bg-[#07090e] border border-[rgba(163,230,53,0.3)] flex items-center justify-center shrink-0 text-[#ccff00]">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
          </div>
          <p className="text-[11px] sm:text-xs font-medium text-white/90 leading-snug">
            অ্যাপটি সেরা অভিজ্ঞতায় চালাতে উপরে ডানে ⋮ চেপে &apos;Open in Chrome/Safari&apos; বেছে নিন।
          </p>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss banner"
          className="w-6 h-6 rounded-md flex items-center justify-center text-[#94a3b8] hover:text-white hover:bg-white/5 transition-colors shrink-0"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
