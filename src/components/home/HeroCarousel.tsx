"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

interface AthleteFrame {
  id: number;
  name: string;
  image: string;
}

const ATHLETE_FRAMES: AthleteFrame[] = [
  {
    id: 1,
    name: "3D Athletic Hero Stance",
    image:
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: "3D Barbell Squat Rack",
    image:
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    name: "3D Flat Dumbbell Bench Press",
    image:
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    name: "3D Pull-up / Calisthenics Bar",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    name: "3D Ground Burpee & Airborne Jump",
    image:
      "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?auto=format&fit=crop&w=800&q=80",
  },
];

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const currentFrame = ATHLETE_FRAMES[currentIndex];

  const handleNext = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % ATHLETE_FRAMES.length);
      setIsTransitioning(false);
    }, 150);
  }, []);

  const handlePrev = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(
        (prev) => (prev - 1 + ATHLETE_FRAMES.length) % ATHLETE_FRAMES.length
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
      {/* Dark Emerald Ambient Glow Behind Card */}
      <div className="absolute w-[360px] sm:w-[480px] h-[360px] sm:h-[480px] rounded-full bg-gradient-to-tr from-[#ccff00]/25 via-[#a3e635]/15 to-transparent blur-[100px] pointer-events-none transition-all duration-700 -top-8" />

      {/* 3D Perspective Card Viewport */}
      <div
        className="w-full max-w-[420px] aspect-[4/5] relative select-none"
        style={{ perspective: "1200px" }}
      >
        {/* Pure 3D Frame (No Text Overlays, No Badges) */}
        <div
          ref={cardRef}
          role="region"
          aria-label={`3D Athlete Showcase - ${currentFrame.name}`}
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
              src={currentFrame.image}
              alt={currentFrame.name}
              fill
              priority
              unoptimized={true}
              sizes="(max-width: 768px) 100vw, 420px"
              className="w-full h-full object-cover object-top filter contrast-110 brightness-95 group-hover:scale-105 transition-transform duration-700"
            />
          </div>

          {/* Cinematic Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#07090e]/60 via-transparent to-black/20 opacity-80 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/20 pointer-events-none" />
        </div>
      </div>

      {/* Navigation Controls: Subtle Prev/Next with 5 Dot Indicators at Bottom */}
      <div className="flex items-center justify-center gap-3 mt-6 z-20">
        {/* Previous Button */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous 3D athlete frame"
          className="w-8 h-8 rounded-full bg-[#121826]/80 hover:bg-[#121826] border border-[rgba(163,230,53,0.25)] hover:border-[#ccff00] backdrop-blur-md flex items-center justify-center text-white hover:text-[#ccff00] transition-all duration-200 shadow-[0_4px_15px_rgba(0,0,0,0.5)] active:scale-90 cursor-pointer"
        >
          <div className="w-3.5 h-3.5 flex items-center justify-center">
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
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </div>
        </button>

        {/* 5 Interactive Indicator Dots */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#121826]/70 border border-[rgba(163,230,53,0.2)] backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
          {ATHLETE_FRAMES.map((frame, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={frame.id}
                type="button"
                onClick={() => handleSelect(idx)}
                aria-label={`Jump to frame ${idx + 1}: ${frame.name}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "w-7 bg-[#ccff00] shadow-[0_0_12px_rgba(204,255,0,0.6)]"
                    : "w-2 bg-[#94a3b8]/35 hover:bg-[#94a3b8]/70 hover:w-3.5"
                }`}
              />
            );
          })}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next 3D athlete frame"
          className="w-8 h-8 rounded-full bg-[#121826]/80 hover:bg-[#121826] border border-[rgba(163,230,53,0.25)] hover:border-[#ccff00] backdrop-blur-md flex items-center justify-center text-white hover:text-[#ccff00] transition-all duration-200 shadow-[0_4px_15px_rgba(0,0,0,0.5)] active:scale-90 cursor-pointer"
        >
          <div className="w-3.5 h-3.5 flex items-center justify-center">
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
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
}
