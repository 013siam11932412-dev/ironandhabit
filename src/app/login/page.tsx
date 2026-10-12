"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 600);
  }

  return (
    <div className="relative min-h-screen bg-[#07090e] text-[#f9fafb] flex flex-col items-center justify-center p-4 selection:bg-[#ccff00] selection:text-black">
      {/* Ambient Neon Lighting */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#ccff00]/[0.05] blur-[160px] rounded-full" />
        <div className="absolute bottom-10 -right-20 w-[400px] h-[400px] bg-[#a3e635]/[0.03] blur-[150px] rounded-full" />
      </div>

      {/* Main Centered Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-[#121826] border border-[#a3e635]/40 flex items-center justify-center shadow-[0_0_20px_rgba(204,255,0,0.2)] group-hover:border-[#ccff00] group-hover:shadow-[0_0_25px_rgba(204,255,0,0.4)] transition-all">
              <svg
                className="w-6 h-6 text-[#ccff00]"
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
            <span className="font-black text-2xl tracking-wider text-white">
              IRON <span className="text-[#ccff00]">&</span> HABIT
            </span>
          </Link>
          <p className="text-xs uppercase tracking-[0.2em] text-[#94a3b8] font-bold mt-2">
            ATHLETIC DISCIPLINE PORTAL
          </p>
        </div>

        {/* Card Surface */}
        <div className="bg-[rgba(18,24,38,0.7)] backdrop-blur-md border border-[rgba(163,230,53,0.2)] rounded-2xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
          <div className="mb-6">
            <h1 className="text-2xl font-black uppercase tracking-tight text-white">
              WELCOME BACK
            </h1>
            <p className="text-xs text-[#94a3b8] mt-1">
              Resume your streak and access your training telemetry.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8] mb-1.5"
              >
                EMAIL ADDRESS
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="athlete@ironandhabit.com"
                className="w-full bg-[#07090e] border border-[rgba(163,230,53,0.2)] rounded-xl px-4 py-3 text-sm text-white placeholder-[#94a3b8]/40 focus:outline-none focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8]"
                >
                  PASSWORD
                </label>
                <a
                  href="#forgot"
                  className="text-[11px] font-semibold text-[#ccff00] hover:underline"
                >
                  Forgot?
                </a>
              </div>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#07090e] border border-[rgba(163,230,53,0.2)] rounded-xl px-4 py-3 text-sm text-white placeholder-[#94a3b8]/40 focus:outline-none focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] transition-colors"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-xl text-sm font-black uppercase tracking-wider bg-[#ccff00] hover:bg-[#d8ff33] text-black transition-all duration-200 shadow-[0_0_25px_rgba(204,255,0,0.35)] hover:shadow-[0_0_35px_rgba(204,255,0,0.55)] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span>AUTHENTICATING...</span>
                ) : (
                  <>
                    <span>SIGN IN TO FORGE</span>
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

          {/* Quick Demo Credentials Tip */}
          <div className="mt-6 p-3 rounded-xl bg-[#07090e]/80 border border-[rgba(163,230,53,0.15)] flex items-center justify-between text-xs text-[#94a3b8]">
            <span>Quick test? Any email / password works.</span>
            <button
              type="button"
              onClick={() => {
                setEmail("demo@ironandhabit.com");
                setPassword("ironstreak2026");
              }}
              className="text-[#ccff00] font-bold hover:underline"
            >
              Fill Demo
            </button>
          </div>

          {/* Link to Signup */}
          <div className="mt-6 pt-5 border-t border-[rgba(163,230,53,0.15)] text-center text-xs text-[#94a3b8]">
            New to Iron & Habit?{" "}
            <Link
              href="/signup"
              className="text-[#ccff00] font-bold uppercase hover:underline ml-1"
            >
              CREATE AN ACCOUNT
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-[#94a3b8]/60">
          &copy; 2026 IRON & HABIT Inc. All rights reserved.
        </div>
      </div>
    </div>
  );
}
