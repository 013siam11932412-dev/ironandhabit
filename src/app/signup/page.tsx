"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [goal, setGoal] = useState<"muscle" | "fatloss" | "endurance">("muscle");
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 600);
  }

  const goals = [
    {
      id: "muscle" as const,
      label: "Muscle Gain",
      desc: "Hypertrophy & raw volume",
      icon: "🏋️",
    },
    {
      id: "fatloss" as const,
      label: "Fat Loss",
      desc: "Caloric deficit & conditioning",
      icon: "🔥",
    },
    {
      id: "endurance" as const,
      label: "Endurance",
      desc: "VO2 max & stamina habit",
      icon: "⚡",
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#07090e] text-[#f9fafb] flex flex-col items-center justify-center p-4 selection:bg-[#ccff00] selection:text-black">
      {/* Ambient Neon Glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-[#ccff00]/[0.05] blur-[170px] rounded-full" />
        <div className="absolute bottom-10 -left-20 w-[400px] h-[400px] bg-[#a3e635]/[0.03] blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-lg my-8">
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
            START YOUR ATHLETIC PROTOCOL
          </p>
        </div>

        {/* Card Surface */}
        <div className="bg-[rgba(18,24,38,0.7)] backdrop-blur-md border border-[rgba(163,230,53,0.2)] rounded-2xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
          <div className="mb-6">
            <h1 className="text-2xl font-black uppercase tracking-tight text-white">
              CREATE YOUR ACCOUNT
            </h1>
            <p className="text-xs text-[#94a3b8] mt-1">
              Join elite athletes logging heavy lifts and building iron habits.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8] mb-1.5"
              >
                FULL NAME
              </label>
              <input
                id="name"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Marcus Vance"
                className="w-full bg-[#07090e] border border-[rgba(163,230,53,0.2)] rounded-xl px-4 py-3 text-sm text-white placeholder-[#94a3b8]/40 focus:outline-none focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="signup-email"
                className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8] mb-1.5"
              >
                EMAIL ADDRESS
              </label>
              <input
                id="signup-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="athlete@ironandhabit.com"
                className="w-full bg-[#07090e] border border-[rgba(163,230,53,0.2)] rounded-xl px-4 py-3 text-sm text-white placeholder-[#94a3b8]/40 focus:outline-none focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="signup-password"
                className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8] mb-1.5"
              >
                PASSWORD
              </label>
              <input
                id="signup-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full bg-[#07090e] border border-[rgba(163,230,53,0.2)] rounded-xl px-4 py-3 text-sm text-white placeholder-[#94a3b8]/40 focus:outline-none focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] transition-colors"
              />
            </div>

            {/* Goal Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8] mb-2">
                PRIMARY OBJECTIVE
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {goals.map((g) => {
                  const isSelected = goal === g.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setGoal(g.id)}
                      className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? "bg-[rgba(18,24,38,0.9)] border-[#ccff00] shadow-[0_0_15px_rgba(204,255,0,0.2)]"
                          : "bg-[#07090e]/60 border-[rgba(163,230,53,0.15)] hover:border-[rgba(163,230,53,0.35)]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-base">{g.icon}</span>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-[#ccff00]" />
                        )}
                      </div>
                      <div>
                        <div
                          className={`text-xs font-black uppercase ${
                            isSelected ? "text-[#ccff00]" : "text-white"
                          }`}
                        >
                          {g.label}
                        </div>
                        <div className="text-[10px] text-[#94a3b8] leading-tight mt-0.5">
                          {g.desc}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Neon Submit CTA */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-xl text-sm font-black uppercase tracking-wider bg-[#ccff00] hover:bg-[#d8ff33] text-black transition-all duration-200 shadow-[0_0_25px_rgba(204,255,0,0.35)] hover:shadow-[0_0_35px_rgba(204,255,0,0.55)] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span>INITIALIZING PROTOCOL...</span>
                ) : (
                  <>
                    <span>START YOUR STREAK</span>
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

          {/* Link to Login */}
          <div className="mt-6 pt-5 border-t border-[rgba(163,230,53,0.15)] text-center text-xs text-[#94a3b8]">
            Already have an active streak?{" "}
            <Link
              href="/login"
              className="text-[#ccff00] font-bold uppercase hover:underline ml-1"
            >
              SIGN IN
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
