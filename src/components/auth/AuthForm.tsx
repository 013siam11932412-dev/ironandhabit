"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";

interface AuthFormProps {
  initialTab?: "signin" | "signup";
  onSuccess?: () => void;
  isModal?: boolean;
}

export default function AuthForm({
  initialTab = "signin",
  onSuccess,
  isModal = false,
}: AuthFormProps) {
  const router = useRouter();
  const { dict, language } = useLanguage();
  const { signInWithEmail, signUpWithEmail, activeAuthTab, setAuthTab } = useAuth();

  const [tab, setLocalTab] = useState<"signin" | "signup">(
    isModal ? activeAuthTab : initialTab
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Keep in sync with AuthContext active tab if inside modal
  const currentTab = isModal ? activeAuthTab : tab;

  function switchTab(newTab: "signin" | "signup") {
    setErrorMessage(null);
    setSuccessMessage(null);
    setShowPassword(false);
    if (isModal) {
      setAuthTab(newTab);
    } else {
      setLocalTab(newTab);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    if (currentTab === "signin") {
      const { error } = await signInWithEmail(email, password);
      setIsLoading(false);

      if (error) {
        setErrorMessage(
          error.message ||
            (language === "bn"
              ? "সাইন ইন ব্যর্থ হয়েছে। অনুগ্রহ করে তথ্য পুনরায় পরীক্ষা করুন।"
              : "Sign in failed. Please check your credentials.")
        );
      } else {
        setSuccessMessage(
          language === "bn"
            ? "সফলভাবে সাইন ইন হয়েছে! ড্যাশবোর্ডে নিয়ে যাওয়া হচ্ছে..."
            : "Signed in successfully! Redirecting to dashboard..."
        );
        setTimeout(() => {
          onSuccess?.();
          router.push("/dashboard");
        }, 600);
      }
    } else {
      // Sign Up
      const { error, data } = await signUpWithEmail(email, password, fullName);
      setIsLoading(false);

      if (error) {
        setErrorMessage(
          error.message ||
            (language === "bn"
              ? "একাউন্ট তৈরি করা যায়নি। অনুগ্রহ করে পুনরায় চেষ্টা করুন।"
              : "Account creation failed. Please try again.")
        );
      } else {
        const needsConfirmation =
          data?.user && !data.session && data.user.identities?.length !== 0;

        if (needsConfirmation) {
          setSuccessMessage(
            language === "bn"
              ? "একাউন্ট তৈরি হয়েছে! আপনার ইমেইল ইনবক্স চেক করে ভেরিফাই করুন।"
              : "Account created! Please check your email inbox to confirm your account."
          );
        } else {
          setSuccessMessage(
            language === "bn"
              ? "স্বাগতম! একাউন্ট সফলভাবে সক্রিয় হয়েছে।"
              : "Welcome! Your account has been activated."
          );
          setTimeout(() => {
            onSuccess?.();
            router.push("/dashboard");
          }, 800);
        }
      }
    }
  }

  function handleFillDemo() {
    setEmail("athlete.demo@ironandhabit.com");
    setPassword("ironstreak2026!");
    if (currentTab === "signup") {
      setFullName("Marcus Vance");
    }
    setErrorMessage(null);
  }

  return (
    <div className="w-full">
      {/* Tab Switcher */}
      <div className="grid grid-cols-2 gap-1 p-1 bg-[#07090e] border border-[rgba(163,230,53,0.25)] rounded-xl mb-6 shadow-inner">
        <button
          type="button"
          onClick={() => switchTab("signin")}
          className={`py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-200 ${
            currentTab === "signin"
              ? "bg-[#ccff00] text-black shadow-[0_0_20px_rgba(204,255,0,0.35)]"
              : "text-[#94a3b8] hover:text-white"
          }`}
        >
          {dict.signInTab}
        </button>
        <button
          type="button"
          onClick={() => switchTab("signup")}
          className={`py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-200 ${
            currentTab === "signup"
              ? "bg-[#ccff00] text-black shadow-[0_0_20px_rgba(204,255,0,0.35)]"
              : "text-[#94a3b8] hover:text-white"
          }`}
        >
          {dict.signUpTab}
        </button>
      </div>

      {/* Header Info */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
          {currentTab === "signin" ? dict.signInTab : dict.signUpTab}
        </h2>
        <p className="text-xs text-[#94a3b8] mt-1">
          {dict.authModalSubtitle}
        </p>
      </div>

      {/* Alert Notices */}
      {errorMessage && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/40 text-red-400 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <span>⚠️</span>
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-[#ccff00]/60 text-[#ccff00] text-xs font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(204,255,0,0.15)] animate-in fade-in">
          <span>✓</span>
          <span>{successMessage}</span>
        </div>
      )}

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {currentTab === "signup" && (
          <div>
            <label
              htmlFor="auth-fullname"
              className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8] mb-1.5"
            >
              {dict.fullNameLabel}
            </label>
            <input
              id="auth-fullname"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={dict.fullNamePlaceholder}
              className="w-full bg-[#07090e] border border-[rgba(163,230,53,0.2)] rounded-xl px-4 py-3 text-sm text-white placeholder-[#94a3b8]/40 focus:outline-none focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] transition-colors"
            />
          </div>
        )}

        <div>
          <label
            htmlFor="auth-email"
            className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8] mb-1.5"
          >
            {dict.emailLabel}
          </label>
          <input
            id="auth-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={dict.emailPlaceholder}
            className="w-full bg-[#07090e] border border-[rgba(163,230,53,0.2)] rounded-xl px-4 py-3 text-sm text-white placeholder-[#94a3b8]/40 focus:outline-none focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] transition-colors"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="auth-password"
              className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8]"
            >
              {dict.passwordLabel}
            </label>
            {currentTab === "signin" && (
              <span className="text-[11px] font-semibold text-[#94a3b8]">
                {language === "bn" ? "নিরাপদ হ্যাশ" : "Secure Auth"}
              </span>
            )}
          </div>
          <div className="relative flex items-center">
            <input
              id="auth-password"
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={dict.passwordPlaceholder}
              className="w-full bg-[#07090e] border border-[rgba(163,230,53,0.2)] rounded-xl pl-4 pr-11 py-3 text-sm text-white placeholder-[#94a3b8]/40 focus:outline-none focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] transition-colors"
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
              className="absolute right-3.5 p-1 text-[#94a3b8] hover:text-[#ccff00] focus:outline-none focus:text-[#ccff00] transition-colors rounded-lg flex items-center justify-center"
            >
              {showPassword ? (
                <svg
                  className="w-4 h-4 text-[#a3e635] hover:text-[#ccff00] transition-colors"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4 text-[#94a3b8] hover:text-[#ccff00] transition-colors"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
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
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl text-sm font-black uppercase tracking-wider bg-[#ccff00] hover:bg-[#d8ff33] text-black transition-all duration-200 shadow-[0_0_25px_rgba(204,255,0,0.35)] hover:shadow-[0_0_35px_rgba(204,255,0,0.55)] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span>
                {currentTab === "signin"
                  ? dict.authenticating
                  : dict.creatingAccount}
              </span>
            ) : (
              <>
                <span>
                  {currentTab === "signin" ? dict.signInBtn : dict.signUpBtn}
                </span>
                <svg
                  className="w-4 h-4 font-black"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Demo Credentials Quick Fill */}
      <div className="mt-5 p-3 rounded-xl bg-[#07090e]/80 border border-[rgba(163,230,53,0.15)] flex items-center justify-between text-xs text-[#94a3b8]">
        <span>
          {language === "bn"
            ? "দ্রুত টেস্ট করতে চান?"
            : "Quick test mode?"}
        </span>
        <button
          type="button"
          onClick={handleFillDemo}
          className="text-[#ccff00] font-bold hover:underline"
        >
          {dict.fillDemoUser}
        </button>
      </div>

      {/* Bottom Switch Link */}
      <div className="mt-5 pt-4 border-t border-[rgba(163,230,53,0.15)] text-center text-xs text-[#94a3b8]">
        {currentTab === "signin" ? (
          <>
            {dict.newToPlatform}{" "}
            <button
              type="button"
              onClick={() => switchTab("signup")}
              className="text-[#ccff00] font-bold uppercase hover:underline ml-1"
            >
              {dict.signUpTab}
            </button>
          </>
        ) : (
          <>
            {dict.alreadyHaveAccount}{" "}
            <button
              type="button"
              onClick={() => switchTab("signin")}
              className="text-[#ccff00] font-bold uppercase hover:underline ml-1"
            >
              {dict.signInTab}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
