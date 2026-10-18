"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const { language } = useLanguage();
  const isBn = language === "bn";

  return (
    <div className="relative min-h-screen bg-[#07090e] text-[#f9fafb] flex flex-col justify-between overflow-x-hidden selection:bg-[#ccff00] selection:text-black">
      {/* Ambient Lighting Background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-[#ccff00]/[0.04] blur-[180px] rounded-full" />
      </div>

      {/* Header / Navbar */}
      <header className="relative z-30 w-full border-b border-[rgba(163,230,53,0.12)] bg-[#07090e]/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#121826] border border-[#a3e635]/40 flex items-center justify-center shadow-[0_0_20px_rgba(204,255,0,0.2)] group-hover:border-[#ccff00] transition-all">
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
            <span className="font-black text-xl tracking-wider text-white">
              IRON <span className="text-[#ccff00]">&</span> HABIT
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs font-bold text-[#94a3b8] hover:text-[#ccff00] uppercase tracking-wider transition-colors"
            >
              ← {isBn ? "হোমপেজ" : "Home"}
            </Link>
            <LanguageToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 w-full flex-1 flex flex-col justify-center">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[rgba(18,24,38,0.85)] border border-[rgba(163,230,53,0.3)] shadow-[0_0_15px_rgba(204,255,0,0.1)] mb-6">
            <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest text-[#ccff00]">
              {isBn ? "যোগাযোগ" : "Get in Touch"}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white mb-4">
            {isBn ? "সরাসরি যোগাযোগ" : "Contact Us"}
          </h1>
          <p className="text-base text-[#94a3b8] leading-relaxed max-w-xl mx-auto">
            {isBn
              ? "যেকোনো প্রশ্ন, মতামত, বা একাউন্ট সংক্রান্ত সহায়তার জন্য নিচে দেওয়া অফিসিয়াল ইমেইলে যোগাযোগ করুন।"
              : "For questions, feedback, or account assistance, please contact us directly via email."}
          </p>
        </div>

        {/* Contact Card */}
        <div className="card-neon-glass p-8 sm:p-12 rounded-3xl text-center border border-[rgba(163,230,53,0.3)] shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          <div className="w-16 h-16 rounded-2xl bg-[#07090e] border border-[#a3e635]/40 flex items-center justify-center text-[#ccff00] mx-auto mb-6 shadow-[0_0_25px_rgba(204,255,0,0.2)]">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          <div className="text-xs font-black uppercase tracking-widest text-[#94a3b8] mb-2">
            {isBn ? "অফিসিয়াল ইমেইল" : "Direct Email"}
          </div>

          <a
            href="mailto:khansiam01608@gmail.com"
            className="text-xl sm:text-2xl md:text-3xl font-mono font-black text-[#ccff00] hover:text-[#d8ff33] hover:underline transition-all block break-all mb-6"
          >
            khansiam01608@gmail.com
          </a>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[rgba(7,9,14,0.7)] border border-[rgba(163,230,53,0.2)] text-xs text-[#94a3b8]">
            <span>{isBn ? "উত্তর প্রদানের সময়:" : "Expected Reply Time:"}</span>
            <span className="text-white font-mono font-semibold">
              [PLACEHOLDER — I will decide]
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
