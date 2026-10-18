"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

interface AthleteSlide {
  id: number;
  titleEn: string;
  titleBn: string;
  tagEn: string;
  tagBn: string;
  focusEn: string;
  focusBn: string;
  cueEn: string;
  cueBn: string;
  image: string;
  accentColor: string;
  glowGradient: string;
}

const ATHLETE_SLIDES: AthleteSlide[] = [
  {
    id: 1,
    titleEn: "3D Athletic Hero Stance",
    titleBn: "ফাউন্ডেশনাল রূপ",
    tagEn: "STATE 01 • STANCE",
    tagBn: "ধাপ ০১ • অ্যাথলেটিক রূপ",
    focusEn: "Foundational Posture & Midline Balance",
    focusBn: "মৌলিক ভারসাম্য ও অ্যাথলেটিক ভঙ্গিমা",
    cueEn: "STANCE • BALANCE",
    cueBn: "ভারসাম্য ও নিয়ন্ত্রণ",
    image:
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80",
    accentColor: "#ccff00",
    glowGradient: "from-[#ccff00]/30 via-[#a3e635]/15 to-transparent",
  },
  {
    id: 2,
    titleEn: "3D Barbell Strength & Squat",
    titleBn: "পাওয়ার ও স্ট্রেংথ",
    tagEn: "STATE 02 • SQUAT",
    tagBn: "ধাপ ০২ • বারবেল পাওয়ার",
    focusEn: "Deep Hip Drive & Barbell Load Output",
    focusBn: "ডিপ হিপ ড্রাইভ ও সর্বোচ্চ পাওয়ার আউটপুট",
    cueEn: "BARBELL • POWER",
    cueBn: "পাওয়ার ও শক্তি",
    image:
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
    accentColor: "#38bdf8",
    glowGradient: "from-[#38bdf8]/30 via-[#0284c7]/15 to-transparent",
  },
  {
    id: 3,
    titleEn: "3D Dumbbell Press & Upper Body",
    titleBn: "আপার বডি প্রেস",
    tagEn: "STATE 03 • UPPER BODY",
    tagBn: "ধাপ ০৩ • আপার বডি প্রেস",
    focusEn: "Symmetrical Hypertrophy & Chest/Shoulder Drive",
    focusBn: "আপার বডি প্রেস কন্ট্রোল ও শোল্ডার স্থায়িত্ব",
    cueEn: "DUMBBELL • CONTROL",
    cueBn: "ডাম্বেল ও কন্ট্রোল",
    image:
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80",
    accentColor: "#f59e0b",
    glowGradient: "from-[#f59e0b]/30 via-[#d97706]/15 to-transparent",
  },
  {
    id: 4,
    titleEn: "3D Calisthenics & Core Alignment",
    titleBn: "কোর ও বডিওয়েট",
    tagEn: "STATE 04 • CALISTHENICS",
    tagBn: "ধাপ ০৪ • কোর ও বডিওয়েট",
    focusEn: "Midline Stability & Rigid Bodyweight Tension",
    focusBn: "অবিচল মিডলাইন টান ও ক্যালিস্তেনিক্স নিয়ন্ত্রণ",
    cueEn: "CALISTHENICS • CORE",
    cueBn: "কোর ও স্থিতিস্থাপকতা",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
    accentColor: "#a3e635",
    glowGradient: "from-[#a3e635]/30 via-[#65a30d]/15 to-transparent",
  },
  {
    id: 5,
    titleEn: "3D High-Intensity Conditioning & Burpees",
    titleBn: "এক্সপ্লোসিভ এনার্জি",
    tagEn: "STATE 05 • CONDITIONING",
    tagBn: "ধাপ ০৫ • এক্সপ্লোসিভ এনার্জি",
    focusEn: "Explosive Ground-to-Air Velocity & Stamina",
    focusBn: "বিস্ফোরক মেটাবলিক আউটপুট ও কার্ডিও স্ট্যামিনা",
    cueEn: "PLYO • CONDITIONING",
    cueBn: "এক্সপ্লোসিভ গতি",
    image:
      "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?auto=format&fit=crop&w=800&q=80",
    accentColor: "#f43f5e",
    glowGradient: "from-[#f43f5e]/30 via-[#e11d48]/15 to-transparent",
  },
];

export default function HeroCarousel() {
  const { language } = useLanguage();
  const isBn = language === "bn";

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const currentSlide = ATHLETE_SLIDES[currentIndex];

  const handleNext = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % ATHLETE_SLIDES.length);
      setIsTransitioning(false);
    }, 150);
  }, []);

  const handlePrev = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(
        (prev) => (prev - 1 + ATHLETE_SLIDES.length) % ATHLETE_SLIDES.length
      );
      setIsTransitioning(false);
    }, 150);
  }, []);

  const handleSelect = useCallback(
    (index: number) => {
      if (index === currentIndex) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(index);
        setIsTransitioning(false);
      }, 150);
    },
    [currentIndex]
  );

  // Parallax 3D tilt calculation on cursor movement
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateY = (x / (rect.width / 2)) * 7;
    const rotateX = -(y / (rect.height / 2)) * 7;
    setTilt({ x: rotateX, y: rotateY });
  }

  function handleMouseLeave() {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  }

  // Keyboard navigation support
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* Dynamic 3D Radial Neon Glow Behind Carousel */}
      <div
        className={`absolute w-[360px] sm:w-[480px] h-[360px] sm:h-[480px] rounded-full bg-gradient-to-tr ${currentSlide.glowGradient} blur-[100px] pointer-events-none transition-all duration-700 -top-8`}
      />

      {/* 3D Perspective Card Viewport */}
      <div
        className="w-full max-w-[420px] aspect-[4/5] relative select-none"
        style={{ perspective: "1200px" }}
      >
        {/* Interactive 3D Card */}
        <div
          ref={cardRef}
          role="region"
          aria-label="Interactive 3D Male Athlete Hero Carousel"
          onClick={handleNext}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${
              isTransitioning ? "scale(0.97)" : "scale(1)"
            }`,
            transformStyle: "preserve-3d",
            transition: isHovered
              ? "transform 0.1s ease-out, box-shadow 0.3s ease"
              : "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.3s ease",
          }}
          className="relative w-full h-full rounded-3xl overflow-hidden border-2 border-[rgba(163,230,53,0.35)] shadow-[0_25px_65px_rgba(0,0,0,0.85)] cursor-pointer group bg-[#07090e]"
        >
          {/* Athlete Imagery */}
          <div
            className={`relative w-full h-full transition-all duration-500 ${
              isTransitioning
                ? "opacity-40 scale-105 blur-[2px]"
                : "opacity-100 scale-100 blur-0"
            }`}
          >
            <Image
              src={currentSlide.image}
              alt={isBn ? currentSlide.titleBn : currentSlide.titleEn}
              fill
              priority
              unoptimized={true}
              sizes="(max-width: 768px) 100vw, 420px"
              className="w-full h-full object-cover object-top filter contrast-110 brightness-95 group-hover:scale-105 transition-transform duration-700"
            />
          </div>

          {/* Cinematic Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-[#07090e]/30 to-black/35 opacity-90 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-transparent to-black/30 pointer-events-none" />

          {/* 3D Floating Top Chip (State & Badge) */}
          <div
            style={{ transform: "translateZ(35px)" }}
            className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-20"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#07090e]/85 backdrop-blur-md border border-[rgba(163,230,53,0.35)] shadow-[0_0_15px_rgba(204,255,0,0.15)]">
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: currentSlide.accentColor }}
              />
              <span
                className="text-[10px] font-black uppercase tracking-widest"
                style={{ color: currentSlide.accentColor }}
              >
                {isBn ? currentSlide.tagBn : currentSlide.tagEn}
              </span>
            </div>

            {/* 3D Indicator Pill */}
            <div className="px-2.5 py-1 rounded-full bg-[#07090e]/85 backdrop-blur-md border border-white/10 text-[10px] font-mono font-bold text-white/90">
              0{currentSlide.id} / 05
            </div>
          </div>

          {/* Glassmorphism Navigation Controls (Prev / Next) */}
          <div className="absolute inset-y-0 left-3 right-3 flex items-center justify-between z-30 pointer-events-none">
            {/* Prev Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              aria-label="Previous 3D Slide"
              className="pointer-events-auto w-9 h-9 rounded-full bg-[#07090e]/80 hover:bg-[#121826] border border-[rgba(163,230,53,0.3)] hover:border-[#ccff00] backdrop-blur-md flex items-center justify-center text-white hover:text-[#ccff00] transition-all duration-200 shadow-[0_4px_15px_rgba(0,0,0,0.5)] active:scale-90"
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
              </div>
            </button>

            {/* Next Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label="Next 3D Slide"
              className="pointer-events-auto w-9 h-9 rounded-full bg-[#07090e]/80 hover:bg-[#121826] border border-[rgba(163,230,53,0.3)] hover:border-[#ccff00] backdrop-blur-md flex items-center justify-center text-white hover:text-[#ccff00] transition-all duration-200 shadow-[0_4px_15px_rgba(0,0,0,0.5)] active:scale-90"
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </div>
            </button>
          </div>

          {/* 3D Floating Bottom Card Info */}
          <div
            style={{ transform: "translateZ(40px)" }}
            className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-[rgba(18,24,38,0.85)] backdrop-blur-xl border border-[rgba(163,230,53,0.3)] shadow-[0_12px_30px_rgba(0,0,0,0.7)] pointer-events-none z-20"
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <h3 className="text-sm sm:text-base font-black uppercase tracking-tight text-white group-hover:text-[#ccff00] transition-colors">
                {isBn ? currentSlide.titleBn : currentSlide.titleEn}
              </h3>
              <span
                className="text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase shrink-0"
                style={{
                  color: currentSlide.accentColor,
                  borderColor: `${currentSlide.accentColor}50`,
                  backgroundColor: `${currentSlide.accentColor}15`,
                }}
              >
                {isBn ? currentSlide.cueBn : currentSlide.cueEn}
              </span>
            </div>
            <p className="text-[11px] text-[#94a3b8] leading-tight">
              {isBn ? currentSlide.focusBn : currentSlide.focusEn}
            </p>
          </div>
        </div>
      </div>

      {/* 5 Interactive Thumbnail / Indicator Dots */}
      <div className="flex items-center justify-center gap-2 mt-5 z-20">
        {ATHLETE_SLIDES.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={slide.id}
              type="button"
              onClick={() => handleSelect(idx)}
              aria-label={`Jump to slide ${idx + 1}: ${
                isBn ? slide.titleBn : slide.titleEn
              }`}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                isActive
                  ? "w-8 shadow-[0_0_12px_rgba(204,255,0,0.5)]"
                  : "w-2.5 bg-[#94a3b8]/30 hover:bg-[#94a3b8]/60 hover:w-4"
              }`}
              style={{
                backgroundColor: isActive ? slide.accentColor : undefined,
              }}
            />
          );
        })}
      </div>

      {/* Interactive Helper Text */}
      <div className="mt-2 text-center text-[11px] font-medium text-[#94a3b8]/70 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00] animate-ping" />
        <span>
          {isBn
            ? "কার্ডে ক্লিক করে ৩ডি রূপ পরিবর্তন করুন"
            : "Click card or controls to cycle 3D athlete states"}
        </span>
      </div>
    </div>
  );
}
