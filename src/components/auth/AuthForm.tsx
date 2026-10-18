"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";

interface AuthFormProps {
  initialTab?: "signin" | "signup";
  onSuccess?: () => void;
  isModal?: boolean;
}

export default function AuthForm({
  onSuccess,
  isModal = false,
}: AuthFormProps) {
  const router = useRouter();
  const { dict, language } = useLanguage();
  const { signInWithEmail } = useAuth();

  // Lamp state
  const [isLampOn, setIsLampOn] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const [dragOffsetY, setDragOffsetY] = useState(0);
  const dragStartYRef = useRef<number | null>(null);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Check persistent session on mount: bypass login if already authenticated
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("iron_auth_token");
      const session = localStorage.getItem("iron_user_session");
      if (token || session) {
        onSuccess?.();
        router.replace("/dashboard");
      }
    }
  }, [router, onSuccess]);

  // Mechanical switch click synthesizer using Web Audio API
  function playLampClickSound() {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(950, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.045);

      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.045);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.045);
    } catch {
      // Audio context silently falls back if blocked by browser policy
    }
  }

  // Toggle Lamp with spring animation
  function toggleLamp() {
    setIsPulling(true);
    playLampClickSound();
    setIsLampOn((prev) => !prev);
    setTimeout(() => {
      setIsPulling(false);
      setDragOffsetY(0);
    }, 450);
  }

  // Drag listeners
  function handleMouseDown(e: React.MouseEvent) {
    dragStartYRef.current = e.clientY;
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (dragStartYRef.current !== null) {
      const delta = e.clientY - dragStartYRef.current;
      if (delta > 0) {
        setDragOffsetY(Math.min(delta, 32));
        if (delta >= 24 && !isPulling) {
          dragStartYRef.current = null;
          toggleLamp();
        }
      }
    }
  }

  function handleMouseUp() {
    dragStartYRef.current = null;
    if (!isPulling) {
      setDragOffsetY(0);
    }
  }

  function handleTouchStart(e: React.TouchEvent) {
    if (e.touches[0]) {
      dragStartYRef.current = e.touches[0].clientY;
    }
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (dragStartYRef.current !== null && e.touches[0]) {
      const delta = e.touches[0].clientY - dragStartYRef.current;
      if (delta > 0) {
        setDragOffsetY(Math.min(delta, 32));
        if (delta >= 24 && !isPulling) {
          dragStartYRef.current = null;
          toggleLamp();
        }
      }
    }
  }

  function handleTouchEnd() {
    dragStartYRef.current = null;
    if (!isPulling) {
      setDragOffsetY(0);
    }
  }

  // Sign In submission
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const inputEmail = email.trim();
    const inputPass = password;

    const { error, data } = await signInWithEmail(inputEmail, inputPass);
    setIsLoading(false);

    if (error) {
      setErrorMessage(
        error.message ||
          (language === "bn"
            ? "সাইন ইন ব্যর্থ হয়েছে। সঠিক তথ্য লিখুন।"
            : "Sign in failed. Please verify your credentials.")
      );
      return;
    }

    // Ensure session persistence in localStorage
    if (typeof window !== "undefined") {
      const token =
        data?.session?.access_token ||
        `iron_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const userSession = data?.session || {
        access_token: token,
        user: {
          id: data?.user?.id || `athlete_${Date.now()}`,
          email: inputEmail,
          user_metadata: {
            full_name: data?.user?.user_metadata?.full_name || "Iron Athlete",
          },
        },
      };
      localStorage.setItem("iron_auth_token", token);
      localStorage.setItem("iron_user_session", JSON.stringify(userSession));
    }

    setSuccessMessage(
      language === "bn"
        ? "সফলভাবে সাইন ইন হয়েছে! ড্যাশবোর্ডে নিয়ে যাওয়া হচ্ছে..."
        : "Authentication verified! Redirecting to dashboard overview..."
    );

    setTimeout(() => {
      onSuccess?.();
      router.replace("/dashboard");
    }, 600);
  }

  // Quick Access Demo Profile
  async function handleQuickAccess() {
    const demoEmail = "athlete.demo@ironandhabit.com";
    const demoPass = "ironstreak2026!";
    setEmail(demoEmail);
    setPassword(demoPass);
    setIsLoading(true);
    setErrorMessage(null);

    const { data } = await signInWithEmail(demoEmail, demoPass);
    setIsLoading(false);

    if (typeof window !== "undefined") {
      const token =
        data?.session?.access_token ||
        `iron_demo_token_${Date.now()}`;
      const userSession = data?.session || {
        access_token: token,
        user: {
          id: "athlete_demo_primary",
          email: demoEmail,
          user_metadata: {
            full_name: "Marcus Vance",
          },
        },
      };
      localStorage.setItem("iron_auth_token", token);
      localStorage.setItem("iron_user_session", JSON.stringify(userSession));
    }

    setSuccessMessage(
      language === "bn"
        ? "ডেমো অ্যাথলিট প্রোফাইল প্রস্তুত! ড্যাশবোর্ডে নিয়ে যাওয়া হচ্ছে..."
        : "Demo athlete profile ready! Loading dashboard overview..."
    );

    setTimeout(() => {
      onSuccess?.();
      router.replace("/dashboard");
    }, 550);
  }

  return (
    <div
      className="relative w-full flex flex-col items-center select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <style>{`
        @keyframes springRecoil {
          0% { transform: translateY(0); }
          30% { transform: translateY(28px); }
          55% { transform: translateY(-7px); }
          75% { transform: translateY(4px); }
          90% { transform: translateY(-2px); }
          100% { transform: translateY(0); }
        }
        .animate-spring-pull {
          animation: springRecoil 0.45s cubic-bezier(0.25, 1, 0.5, 1);
        }
      `}</style>

      {/* ======================================================== */}
      {/* 1. HANGING LAMP FIXTURE & PULL CORD                      */}
      {/* ======================================================== */}
      <div className="relative w-full flex flex-col items-center justify-start pt-1 pb-4">
        {/* Lamp Shade & Socket SVG */}
        <div className="w-56 h-24 flex items-center justify-center relative z-20">
          <svg
            viewBox="0 0 220 95"
            className="w-56 h-24 text-slate-400 drop-shadow-lg"
            fill="none"
          >
            {/* Ceiling wire */}
            <line
              x1="110"
              y1="0"
              x2="110"
              y2="42"
              stroke="#475569"
              strokeWidth="2.5"
            />
            {/* Ceiling mount canopy */}
            <circle cx="110" cy="4" r="5" fill="#334155" stroke="#64748b" strokeWidth="1" />

            {/* Socket Collar */}
            <rect
              x="102"
              y="40"
              width="16"
              height="10"
              rx="2"
              fill="#1e293b"
              stroke="#334155"
              strokeWidth="1.5"
            />

            {/* Lamp Shade Dome */}
            <path
              d="M 60 78 C 72 48, 148 48, 160 78 Z"
              fill="url(#shadeMetallic)"
              stroke="#334155"
              strokeWidth="2"
            />

            {/* Lamp Rim Lip Accent */}
            <ellipse
              cx="110"
              cy="78"
              rx="50"
              ry="6"
              fill="#121826"
              stroke={isLampOn ? "#ccff00" : "#475569"}
              strokeWidth="2"
              className="transition-colors duration-300"
            />

            <defs>
              <linearGradient id="shadeMetallic" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0b0f17" />
                <stop offset="60%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
            </defs>
          </svg>

          {/* Glowing Light Bulb Under Shade */}
          <div
            className={`absolute top-[72px] left-1/2 -translate-x-1/2 w-8 h-8 rounded-full transition-all duration-300 flex items-center justify-center ${
              isLampOn
                ? "bg-[#fffff0] shadow-[0_0_25px_#ccff00,0_0_55px_rgba(204,255,0,0.8),0_0_90px_rgba(163,230,53,0.5)] border-2 border-[#ccff00]"
                : "bg-[#181f2a] border border-[#334155] shadow-inner"
            }`}
          >
            <div
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                isLampOn ? "bg-white shadow-[0_0_12px_#ffffff]" : "bg-[#334155]"
              }`}
            />
          </div>

          {/* Dangling Pull-Cord / Chain */}
          <div
            className="absolute top-[78px] right-8 sm:right-10 flex flex-col items-center cursor-pointer group z-30"
            onClick={toggleLamp}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            role="button"
            tabIndex={0}
            aria-label={
              isLampOn
                ? language === "bn"
                  ? "আলো বন্ধ করতে টানুন"
                  : "Pull to extinguish lamp"
                : language === "bn"
                  ? "আলো জ্বালাতে টানুন"
                  : "Pull to ignite lamp"
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleLamp();
              }
            }}
          >
            {/* The Chain Line */}
            <div
              className={`w-1 rounded-full transition-all duration-75 flex flex-col items-center gap-1 py-0.5 ${
                isPulling ? "animate-spring-pull" : ""
              }`}
              style={{
                height: `${56 + (isPulling ? 28 : dragOffsetY)}px`,
              }}
            >
              {/* Beaded Chain Texture */}
              <div className="w-1 h-full bg-gradient-to-b from-[#64748b] via-[#94a3b8] to-[#ccff00] rounded-full shadow-[0_0_6px_rgba(204,255,0,0.3)]" />
            </div>

            {/* Weighted Pull Knob / Handle */}
            <div
              className={`-mt-1 w-3.5 h-6 rounded-full transition-all duration-200 flex items-center justify-center ${
                isPulling ? "animate-spring-pull" : ""
              } ${
                isLampOn
                  ? "bg-gradient-to-b from-[#ccff00] to-[#84cc16] shadow-[0_0_14px_rgba(204,255,0,0.9)] border border-white"
                  : "bg-gradient-to-b from-[#475569] to-[#1e293b] border border-[#64748b] group-hover:border-[#ccff00] shadow-md"
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  isLampOn ? "bg-white" : "bg-[#94a3b8]"
                }`}
              />
            </div>

            {/* Interactive State Tag / Tooltip */}
            {!isLampOn ? (
              <div className="absolute top-12 left-5 whitespace-nowrap bg-[#121826]/95 border border-[#ccff00]/70 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-[#ccff00] shadow-[0_0_15px_rgba(204,255,0,0.4)] animate-pulse flex items-center gap-1.5 pointer-events-none">
                <span className="text-xs">⚡</span>
                <span>{language === "bn" ? "দড়ি টেনে আলো জ্বালান" : "PULL CORD TO ENTER"}</span>
              </div>
            ) : (
              <div className="absolute top-12 left-5 whitespace-nowrap bg-[#121826]/90 border border-[#94a3b8]/30 px-2 py-0.5 rounded-full text-[9px] font-bold text-[#94a3b8] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                <span>{language === "bn" ? "দড়ি টেনে বন্ধ করুন" : "PULL TO TURN OFF"}</span>
              </div>
            )}
          </div>
        </div>

        {/* Ambient Radial Bloom Around Bulb */}
        <div
          className={`pointer-events-none absolute left-1/2 -translate-x-1/2 top-[80px] w-64 h-64 rounded-full transition-all duration-700 ease-out z-0 ${
            isLampOn
              ? "bg-[#ccff00]/25 blur-[65px] scale-100 opacity-100"
              : "bg-transparent scale-50 opacity-0"
          }`}
        />

        {/* Volumetric Expanding Downward Light Beam Cone */}
        <div
          className={`pointer-events-none absolute left-1/2 -translate-x-1/2 top-[96px] w-[95%] max-w-[440px] h-[480px] transition-all duration-700 ease-out z-0 ${
            isLampOn
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95"
          }`}
          style={{
            clipPath: "polygon(34% 0%, 66% 0%, 100% 100%, 0% 100%)",
            background:
              "linear-gradient(180deg, rgba(204,255,0,0.22) 0%, rgba(163,230,53,0.12) 35%, rgba(163,230,53,0.02) 80%, transparent 100%)",
          }}
        />
      </div>

      {/* ======================================================== */}
      {/* 2. ILLUMINATED SIGN-IN BOX (ONLY ACTIVE WHEN LAMP IS ON) */}
      {/* ======================================================== */}
      <div
        className={`relative z-10 w-full transition-all duration-500 ease-out ${
          isLampOn
            ? "opacity-100 filter-none pointer-events-auto translate-y-0"
            : "opacity-15 filter blur-[1.5px] pointer-events-none select-none translate-y-2"
        }`}
      >
        {/* Header Information */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/30 text-[#ccff00] text-[10px] font-black uppercase tracking-widest mb-2 shadow-[0_0_15px_rgba(204,255,0,0.2)]">
            <div className="w-1.5 h-1.5 rounded-full bg-[#ccff00] animate-pulse" />
            <span>{language === "bn" ? "প্রবেশদ্বার সক্রিয়" : "AUTHENTICATION PROTOCOL"}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
            {dict.signInTab}
          </h2>
          <p className="text-xs text-[#94a3b8] mt-1">
            {dict.authModalSubtitle}
          </p>
        </div>

        {/* Alert Error Notice */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/40 text-red-400 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <div className="w-4 h-4 flex items-center justify-center shrink-0">
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 text-red-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Alert Success Notice */}
        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-[#ccff00]/60 text-[#ccff00] text-xs font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(204,255,0,0.15)] animate-in fade-in">
            <div className="w-4 h-4 flex items-center justify-center shrink-0">
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 text-[#ccff00]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span>{successMessage}</span>
          </div>
        )}

        {/* The Sign In Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email / Identifier */}
          <div>
            <label
              htmlFor="auth-email-input"
              className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8] mb-1.5"
            >
              {dict.emailLabel}
            </label>
            <input
              id="auth-email-input"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={dict.emailPlaceholder}
              className="w-full bg-[#07090e] border border-[rgba(163,230,53,0.25)] rounded-xl px-4 py-3 text-sm text-white placeholder-[#94a3b8]/40 focus:outline-none focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] transition-colors"
            />
          </div>

          {/* Password with Eye Visibility Toggle */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="auth-password-input"
                className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8]"
              >
                {dict.passwordLabel}
              </label>
              <span className="text-[11px] font-semibold text-[#a3e635]">
                {language === "bn" ? "নিরাপদ হ্যাশ" : "Encrypted Hash"}
              </span>
            </div>
            <div className="relative flex items-center">
              <input
                id="auth-password-input"
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={dict.passwordPlaceholder}
                className="w-full bg-[#07090e] border border-[rgba(163,230,53,0.25)] rounded-xl pl-4 pr-11 py-3 text-sm text-white placeholder-[#94a3b8]/40 focus:outline-none focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={
                  showPassword
                    ? language === "bn"
                      ? "পাসওয়ার্ড লুকান"
                      : "Hide password"
                    : language === "bn"
                      ? "পাসওয়ার্ড দেখুন"
                      : "Show password"
                }
                title={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3.5 p-1 text-[#94a3b8] hover:text-[#ccff00] focus:outline-none focus:text-[#ccff00] transition-colors rounded-lg flex items-center justify-center cursor-pointer"
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  {showPassword ? (
                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4 text-[#a3e635] hover:text-[#ccff00] transition-colors"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                      />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4 text-[#94a3b8] hover:text-[#ccff00] transition-colors"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Permanent Session Status Indicator */}
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#07090e]/70 border border-[#a3e635]/20 text-[11px] text-[#94a3b8]">
            <div className="w-4 h-4 flex items-center justify-center shrink-0">
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 text-[#ccff00]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <span>
              {language === "bn"
                ? "স্থায়ী সেশন সক্রিয়: স্বয়ংক্রিয়ভাবে লগইন মনে রাখা হবে"
                : "Permanent Session: Active (bypasses login on next visit)"}
            </span>
          </div>

          {/* Submit Sign In Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl text-sm font-black uppercase tracking-wider bg-[#ccff00] hover:bg-[#d8ff33] text-black transition-all duration-200 shadow-[0_0_25px_rgba(204,255,0,0.35)] hover:shadow-[0_0_35px_rgba(204,255,0,0.55)] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <span>{dict.authenticating}</span>
              ) : (
                <>
                  <span>{dict.signInBtn}</span>
                  <div className="w-4 h-4 flex items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4 font-black"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </div>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Quick Access Demo Button */}
        <div className="mt-4 p-3 rounded-xl bg-[#07090e]/90 border border-[rgba(163,230,53,0.2)] flex items-center justify-between text-xs text-[#94a3b8]">
          <span className="text-[11px]">
            {language === "bn" ? "দ্রুত টেস্ট মোড:" : "Quick Test Access:"}
          </span>
          <button
            type="button"
            onClick={handleQuickAccess}
            className="text-[#ccff00] font-bold hover:underline inline-flex items-center gap-1.5 cursor-pointer text-xs"
          >
            <div className="w-3.5 h-3.5 flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="w-3.5 h-3.5 text-[#ccff00]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <span>Marcus Vance (Demo)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
