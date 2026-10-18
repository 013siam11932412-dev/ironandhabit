"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

interface FooterProps {
  className?: string;
}

export default function Footer({ className = "" }: FooterProps) {
  const { language } = useLanguage();
  const isBn = language === "bn";

  return (
    <footer
      className={`relative z-10 border-t border-[rgba(163,230,53,0.15)] bg-[#07090e]/95 py-8 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand Identity */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ccff00]" />
            <Link
              href="/"
              className="font-black text-white hover:text-[#ccff00] transition-colors tracking-wider"
            >
              IRON & HABIT
            </Link>
            <span className="text-xs text-[#94a3b8]/70">
              &mdash; {isBn ? "প্রতিদিন আরও শক্তিশালী।" : "STRONGER EVERY DAY."}
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-6 text-xs font-semibold text-[#94a3b8]">
            <Link
              href="/about"
              className="hover:text-[#ccff00] transition-colors"
            >
              {isBn ? "আমাদের সম্পর্কে" : "About"}
            </Link>
            <Link
              href="/contact"
              className="hover:text-[#ccff00] transition-colors"
            >
              {isBn ? "যোগাযোগ" : "Contact"}
            </Link>
            <Link
              href="/privacy"
              className="hover:text-[#ccff00] transition-colors"
            >
              {isBn ? "গোপনীয়তা নীতি" : "Privacy Policy"}
            </Link>
          </nav>
        </div>

        {/* Disclaimer & Copyright Bar */}
        <div className="pt-4 border-t border-[rgba(163,230,53,0.08)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#94a3b8]/70">
          <p className="text-[11px] text-[#94a3b8]/80 text-center sm:text-left">
            <span className="text-[#ccff00]/90 font-medium">
              {isBn
                ? "সাধারণ নির্দেশিকা মাত্র, চিকিৎসা পরামর্শ নয়।"
                : "General guidance only, not medical advice."}
            </span>
          </p>
          <div className="text-[11px] text-center sm:text-right">
            &copy; 2026 IRON & HABIT. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
