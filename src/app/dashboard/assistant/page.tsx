"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import LanguageToggle from "@/components/LanguageToggle";
import Footer from "@/components/Footer";
import {
  BmiRecord,
  DailyMetric,
  WorkoutLog,
  NutritionLog,
  fetchBmiRecords,
  fetchDailyMetrics,
  fetchTodayWorkoutLogs,
  fetchTodayNutritionLogs,
} from "@/lib/db";
import { getStoredStreak, getTodayIsoDate, toBnDigits } from "@/lib/storage";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

// Custom Markdown Formatter for Neon Aesthetic
function renderFormattedText(text: string) {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`|\*.*?\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={idx} className="font-extrabold text-[#ccff00]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={idx}
          className="px-1.5 py-0.5 rounded bg-[#1e293b] text-[#a3e635] text-xs font-mono font-semibold"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={idx} className="italic text-[#e2e8f0]">
          {part.slice(1, -1)}
        </em>
      );
    }
    return <span key={idx}>{part}</span>;
  });
}

function MarkdownView({ content }: { content: string }) {
  const blocks = content.split(/\n\n+/);

  return (
    <div className="space-y-3 text-sm leading-relaxed text-[#cbd5e1]">
      {blocks.map((block, bIdx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Headings
        if (trimmed.startsWith("### ")) {
          return (
            <h3
              key={bIdx}
              className="text-base font-black uppercase tracking-wider text-[#ccff00] pt-2"
            >
              {renderFormattedText(trimmed.replace(/^###\s+/, ""))}
            </h3>
          );
        }

        if (trimmed.startsWith("## ")) {
          return (
            <h2
              key={bIdx}
              className="text-lg font-black uppercase tracking-wider text-[#a3e635] pt-2 border-b border-[rgba(163,230,53,0.15)] pb-1"
            >
              {renderFormattedText(trimmed.replace(/^##\s+/, ""))}
            </h2>
          );
        }

        if (trimmed.startsWith("# ")) {
          return (
            <h1
              key={bIdx}
              className="text-xl font-black uppercase tracking-wider text-white pt-2"
            >
              {renderFormattedText(trimmed.replace(/^#\s+/, ""))}
            </h1>
          );
        }

        // Callout Blockquote
        if (trimmed.startsWith("> ")) {
          return (
            <div
              key={bIdx}
              className="p-3 my-2 border-l-2 border-[#ccff00] bg-[rgba(204,255,0,0.05)] rounded-r-lg text-xs sm:text-sm text-[#f1f5f9] italic"
            >
              {renderFormattedText(trimmed.replace(/^>\s*/gm, ""))}
            </div>
          );
        }

        // Bullet Lists
        const lines = trimmed.split("\n");
        const isBulletList = lines.every((line) =>
          /^[-*•]\s+/.test(line.trim())
        );
        if (isBulletList) {
          return (
            <ul key={bIdx} className="space-y-1.5 my-2">
              {lines.map((line, lIdx) => (
                <li key={lIdx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00] mt-2 shrink-0 shadow-[0_0_8px_rgba(204,255,0,0.8)]" />
                  <span className="flex-1">
                    {renderFormattedText(line.trim().replace(/^[-*•]\s+/, ""))}
                  </span>
                </li>
              ))}
            </ul>
          );
        }

        // Numbered Lists
        const isNumberedList = lines.every((line) =>
          /^\d+\.\s+/.test(line.trim())
        );
        if (isNumberedList) {
          return (
            <ol key={bIdx} className="space-y-1.5 my-2">
              {lines.map((line, lIdx) => {
                const match = line.trim().match(/^(\d+)\.\s+(.*)$/);
                const num = match ? match[1] : `${lIdx + 1}`;
                const text = match ? match[2] : line;
                return (
                  <li key={lIdx} className="flex items-start gap-2">
                    <span className="text-xs font-mono font-bold text-[#ccff00] bg-[#121826] border border-[#a3e635]/30 rounded px-1.5 py-0.5 mt-0.5 shrink-0">
                      {num}
                    </span>
                    <span className="flex-1">{renderFormattedText(text)}</span>
                  </li>
                );
              })}
            </ol>
          );
        }

        // Standard Paragraph with Linebreaks
        return (
          <p key={bIdx} className="leading-relaxed">
            {lines.map((line, lIdx) => (
              <span key={lIdx}>
                {renderFormattedText(line)}
                {lIdx < lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

let messageSeqCounter = 0;
function createMsgId(prefix: string): string {
  messageSeqCounter += 1;
  return `${prefix}-${Date.now()}-${messageSeqCounter}`;
}

function getNowTimeStr(): string {
  const d = new Date();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export default function AssistantPage() {
  const pathname = usePathname();
  const router = useRouter();
  const { dict, language } = useLanguage();
  const { user, signOut } = useAuth();

  // Streak & Telemetry Context
  const [streakDay] = useState<number>(() => getStoredStreak());
  const [bmiRecord, setBmiRecord] = useState<BmiRecord | null>(null);
  const [dailyMetric, setDailyMetric] = useState<DailyMetric | null>(null);
  const [, setTodayWorkouts] = useState<WorkoutLog[]>([]);
  const [, setTodayNutrition] = useState<NutritionLog[]>([]);

  const welcomeContent =
    language === "bn"
      ? "স্বাগতম বন্ধু! আমি **Iron & Habit** এর সহানুভূতিশীল ফিটনেস মেন্টর।\n\nআপনি একদম প্রথমবার শুরু করতে যাচ্ছেন, নাকি নতুন করে রুটিনে ফিরতে চান—কোনো দ্বিধা বা অপরাধবোধ ছাড়াই আমাকে আপনার কথা বলুন। আমি কোনো দীর্ঘ ক্লান্তিকর চার্ট চাপিয়ে দেব না, বরং আপনার জীবনযাপনের সাথে মিলিয়ে ছোট ছোট অভ্যাসে আপনাকে এগিয়ে নেব।\n\nনিচের কুইক প্রম্পট বেছে নিতে পারেন অথবা আপনার মনের যেকোনো কথা লিখুন!"
      : "Welcome my friend! I am your **Iron & Habit** Socratic Fitness & Habit Mentor.\n\nWhether you're taking your very first step, feeling out of shape, or striving for daily consistency—I'm right here with you with zero judgment. No overwhelming routines or extreme crash diets, just wise, science-backed guidance built around your real life.\n\nPick one of the quick prompts below or tell me what's on your mind today!";

  // Chat State
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-system-init",
      role: "assistant",
      content: welcomeContent,
      timestamp: "Online",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load User Telemetry from DB / Local
  useEffect(() => {
    let isMounted = true;
    const today = getTodayIsoDate();

    // Fetch BMI
    fetchBmiRecords(user?.id).then((records) => {
      if (isMounted && records.length > 0) {
        setBmiRecord(records[0]);
      }
    });

    // Fetch Daily Metrics
    fetchDailyMetrics(today, user?.id).then((metric) => {
      if (isMounted && metric) {
        setDailyMetric(metric);
      }
    });

    // Fetch Workouts
    fetchTodayWorkoutLogs(user?.id).then((wLogs) => {
      if (isMounted) {
        setTodayWorkouts(wLogs);
      }
    });

    // Fetch Nutrition
    fetchTodayNutritionLogs(user?.id).then((nLogs) => {
      if (isMounted) {
        setTodayNutrition(nLogs);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [user]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const navTabs = [
    { name: dict.overview, href: "/dashboard" },
    { name: dict.bmi, href: "/dashboard/bmi" },
    { name: dict.workouts, href: "/dashboard/workouts" },
    { name: dict.nutrition, href: "/dashboard/nutrition" },
    { name: dict.aiAssistant, href: "/dashboard/assistant" },
    { name: dict.community, href: "/dashboard/community" },
  ];

  // Specific Quick Prompt Chips from requirement
  const quickPromptChips = [
    {
      queryText:
        language === "bn"
          ? "আমি একদম নতুন, কোথা থেকে শুরু করব? (I'm a total beginner)"
          : "I'm a total beginner, where should I start?",
      label:
        language === "bn"
          ? "🌱 আমি একদম নতুন, কোথা থেকে শুরু করব? (I'm a total beginner)"
          : "🌱 I'm a total beginner, where should I start?",
    },
    {
      queryText:
        language === "bn"
          ? "সহজে ঘরোয়া খাবার দিয়ে সুস্থ থাকার উপায় কী?"
          : "How can I stay healthy using simple home-cooked meals?",
      label:
        language === "bn"
          ? "🥗 সহজে ঘরোয়া খাবার দিয়ে সুস্থ থাকার উপায়"
          : "🥗 Healthy eating with simple home-cooked meals",
    },
    {
      queryText:
        language === "bn"
          ? "ব্যস্ত দিনে ১০ মিনিটের কার্যকর ব্যায়াম কী হতে পারে?"
          : "What is an effective 10-minute workout for busy days?",
      label:
        language === "bn"
          ? "⏱️ ব্যস্ত দিনে ১০ মিনিটের কার্যকর ব্যায়াম"
          : "⏱️ Effective 10-minute workout for busy days",
    },
    {
      queryText:
        language === "bn"
          ? "ব্যায়ামে আগ্রহ ও ধারাবাহিকতা ধরে রাখার রহস্য কী?"
          : "What is the secret to staying consistent and motivated in fitness?",
      label:
        language === "bn"
          ? "🔥 ব্যায়ামে আগ্রহ ধরে রাখার রহস্য কী?"
          : "🔥 The secret to staying consistent & motivated",
    },
  ];

  async function handleSendMessage(customText?: string) {
    const textToSend = customText !== undefined ? customText : inputValue;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: createMsgId("user"),
      role: "user",
      content: textToSend.trim(),
      timestamp: getNowTimeStr(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    if (customText === undefined) {
      setInputValue("");
    }
    setIsLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend.trim(),
          history: messages.map((m) => ({
            role: m.role,
            content: m.id === "welcome-system-init" ? welcomeContent : m.content,
          })),
          userContext: {
            language,
            bmi: bmiRecord?.bmi,
            weight: bmiRecord?.weight,
            height: bmiRecord?.height,
            goal: bmiRecord?.category,
            waterTarget: dailyMetric?.water_ml,
            caloriesTarget: dailyMetric?.calories_consumed,
          },
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      const replyContent =
        data?.reply ||
        (language === "bn"
          ? "উত্তর তৈরি করতে কিছুটা সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।"
          : "Encountered an issue generating response. Please try again.");

      const assistantMsg: Message = {
        id: createMsgId("assistant"),
        role: "assistant",
        content: replyContent,
        timestamp: getNowTimeStr(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: unknown) {
      console.error("Assistant chat error:", err);
      const fallbackErrorMsg: Message = {
        id: createMsgId("err"),
        role: "assistant",
        content:
          language === "bn"
            ? "⚠️ সার্ভারে সাময়িক চাপ রয়েছে। অনুগ্রহ করে ৫-১০ সেকেন্ড পর আবার চেষ্টা করুন।"
            : "⚠️ The AI server is experiencing high demand right now. Please try again in 5–10 seconds.",
        timestamp: getNowTimeStr(),
      };
      setMessages((prev) => [...prev, fallbackErrorMsg]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleResetChat() {
    setMessages([
      {
        id: createMsgId("welcome-reset"),
        role: "assistant",
        content:
          language === "bn"
            ? "নতুন আলোচনা শুরু করা হয়েছে। আপনার ফিটনেস, রুটিন বা মনের ভাবনা শেয়ার করুন!"
            : "Chat reset. How can I help guide your fitness and nutrition journey today?",
        timestamp: getNowTimeStr(),
      },
    ]);
  }

  return (
    <div className="relative min-h-screen bg-[#07090e] text-[#f9fafb] flex flex-col justify-between selection:bg-[#ccff00] selection:text-black">
      {/* Ambient Lighting & Neon Glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-10 right-1/4 w-[600px] h-[400px] bg-[#ccff00]/[0.05] blur-[170px] rounded-full" />
        <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-[#a3e635]/[0.03] blur-[160px] rounded-full" />
      </div>

      {/* Top Header */}
      <header className="relative z-30 w-full border-b border-[rgba(163,230,53,0.15)] bg-[#07090e]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-20 flex items-center justify-between">
            {/* Brand Logo */}
            <div className="flex items-center gap-3 sm:gap-4">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-xl bg-[#121826] border border-[#a3e635]/40 flex items-center justify-center shadow-[0_0_15px_rgba(204,255,0,0.2)] group-hover:border-[#ccff00] transition-colors">
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
                <div>
                  <span className="font-black text-lg tracking-wider text-white">
                    IRON <span className="text-[#ccff00]">&</span> HABIT
                  </span>
                  <span className="hidden sm:inline-block text-[10px] font-black tracking-widest text-[#94a3b8] ml-2 pl-2 border-l border-[rgba(163,230,53,0.2)]">
                    {dict.aiAssistant}
                  </span>
                </div>
              </Link>
            </div>

            {/* Language Toggle, Streak Badge & User controls */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <LanguageToggle />

              {/* 7-Day Cyclical Streak Tracker Badge */}
              <div
                title="7-Day Streak Tracker"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(18,24,38,0.85)] border border-[rgba(163,230,53,0.35)] shadow-[0_0_15px_rgba(204,255,0,0.2)]"
              >
                <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
                <span className="text-xs font-black uppercase text-[#ccff00] tracking-wider font-mono">
                  {language === "bn"
                    ? `দিন ${toBnDigits(streakDay)} / ৭ 🔥`
                    : `Day ${streakDay} / 7 🔥`}
                </span>
              </div>

              {/* User Avatar */}
              {user && (
                <div
                  title={user.email || "Athlete"}
                  className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[rgba(18,24,38,0.9)] border border-[#a3e635]/40 shadow-[0_0_15px_rgba(204,255,0,0.2)]"
                >
                  <div className="w-6 h-6 rounded-full bg-[#ccff00] text-black font-black text-xs flex items-center justify-center uppercase shadow-[0_0_8px_rgba(204,255,0,0.4)]">
                    {(
                      user.user_metadata?.full_name?.[0] ||
                      user.email?.[0] ||
                      "A"
                    ).toUpperCase()}
                  </div>
                  <span className="hidden md:inline-block text-xs font-bold text-white max-w-[100px] truncate">
                    {user.user_metadata?.full_name ||
                      user.email?.split("@")[0] ||
                      "Athlete"}
                  </span>
                </div>
              )}

              <button
                type="button"
                onClick={async () => {
                  await signOut();
                  router.push("/");
                }}
                className="text-xs font-bold text-[#94a3b8] hover:text-[#ccff00] px-2.5 py-1.5 rounded-lg border border-[rgba(163,230,53,0.15)] hover:border-[rgba(163,230,53,0.35)] transition-colors cursor-pointer uppercase tracking-wider"
              >
                {dict.signOut}
              </button>
            </div>
          </div>

          {/* Navigation Bar */}
          <nav className="flex space-x-1 sm:space-x-2 border-t border-[rgba(163,230,53,0.08)] py-2 overflow-x-auto">
            {navTabs.map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-[#ccff00] text-black shadow-[0_0_12px_rgba(204,255,0,0.4)] font-black"
                      : "text-[#94a3b8] hover:text-white hover:bg-[rgba(163,230,53,0.08)]"
                  }`}
                >
                  {tab.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Chat Interface */}
      <main className="relative z-10 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 flex-1 flex flex-col">
        {/* Title & Telemetry Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white flex items-center gap-2">
                <span className="text-[#ccff00]">⚡</span>
                {dict.aiAssistant}
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-widest bg-[rgba(204,255,0,0.15)] text-[#ccff00] border border-[#a3e635]/40">
                Socratic Coach
              </span>
            </div>
            <p className="text-xs text-[#94a3b8] mt-0.5">
              {dict.aiAssistantSubtitle}
            </p>
          </div>

          {/* Biometrics Synced Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#121826] border border-[#a3e635]/30 text-xs">
            <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-ping" />
            <span className="text-[#a3e635] font-mono font-bold">
              {dict.aiContextBadge}:
            </span>
            <span className="text-white font-mono">
              {bmiRecord ? `BMI ${bmiRecord.bmi.toFixed(1)}` : "Profile Ready"}
            </span>
            {bmiRecord?.weight && (
              <span className="text-[#94a3b8] font-mono text-[11px]">
                • {bmiRecord.weight}kg
              </span>
            )}
          </div>
        </div>

        {/* Quick Prompt Chips (Clickable in UI) */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#94a3b8] flex items-center gap-1.5">
              <span className="text-[#ccff00]">✨</span>
              {language === "bn" ? "দ্রুত প্রশ্ন করুন (Quick Prompts)" : "Suggested Quick Prompts"}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {quickPromptChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(chip.queryText)}
                disabled={isLoading}
                className="text-left px-3.5 py-2.5 rounded-xl bg-[#0e1422] hover:bg-[#151f33] border border-[#1e293b] hover:border-[#ccff00]/60 text-xs text-[#e2e8f0] hover:text-[#ccff00] transition-all flex items-center justify-between group disabled:opacity-50 disabled:pointer-events-none shadow-sm"
              >
                <span className="font-medium pr-2">{chip.label}</span>
                <span className="text-[#a3e635] opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  →
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Window Container */}
        <div className="flex-1 flex flex-col bg-[#0b0f19] border border-[#121826] rounded-2xl p-4 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.6)] backdrop-blur-md min-h-[460px]">
          {/* Scrollable Messages Area */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 sm:pr-2 max-h-[58vh]">
            {messages.map((msg) => {
              const isAssistant = msg.role === "assistant";
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 sm:gap-4 ${
                    isAssistant ? "justify-start" : "justify-end"
                  }`}
                >
                  {/* Assistant Avatar */}
                  {isAssistant && (
                    <div className="w-9 h-9 rounded-xl bg-[#07090e] border border-[#a3e635]/50 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(204,255,0,0.25)] mt-1">
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
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 sm:p-5 transition-all ${
                      isAssistant
                        ? "bg-[#0f172a] border border-[rgba(163,230,53,0.2)] shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
                        : "bg-[#162032] border border-[#a3e635]/40 text-white shadow-[0_0_15px_rgba(204,255,0,0.1)]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-2 pb-2 border-b border-[rgba(255,255,255,0.06)]">
                      <span className="text-xs font-black uppercase tracking-wider text-[#ccff00]">
                        {isAssistant
                          ? language === "bn"
                            ? "আইরন অ্যান্ড হ্যাবিট মেন্টর"
                            : "Iron & Habit Mentor"
                          : language === "bn"
                          ? "আপনি (অ্যাথলেট)"
                          : "You (Athlete)"}
                      </span>
                      <span className="text-[10px] text-[#64748b] font-mono">
                        {msg.timestamp}
                      </span>
                    </div>

                    {isAssistant ? (
                      <MarkdownView
                        content={
                          msg.id === "welcome-system-init"
                            ? welcomeContent
                            : msg.content
                        }
                      />
                    ) : (
                      <p className="text-sm text-white whitespace-pre-wrap leading-relaxed">
                        {msg.content}
                      </p>
                    )}
                  </div>

                  {/* User Avatar */}
                  {!isAssistant && (
                    <div className="w-9 h-9 rounded-xl bg-[#162032] border border-[#a3e635]/30 flex items-center justify-center shrink-0 mt-1 text-xs font-black text-white">
                      YOU
                    </div>
                  )}
                </div>
              );
            })}

            {/* Typing / Reflecting Indicator */}
            {isLoading && (
              <div className="flex gap-3 sm:gap-4 justify-start items-center">
                <div className="w-9 h-9 rounded-xl bg-[#07090e] border border-[#a3e635]/50 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(204,255,0,0.25)] animate-pulse">
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
                <div className="bg-[#0f172a] border border-[rgba(163,230,53,0.2)] rounded-2xl px-4 py-3 flex items-center gap-3">
                  <div className="flex gap-1.5 items-center">
                    <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-bounce [animation-delay:0.4s]" />
                  </div>
                  <span className="text-xs text-[#94a3b8] font-medium">
                    {dict.thinking}
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input & Control Bar */}
          <div className="pt-4 border-t border-[rgba(163,230,53,0.12)] mt-4">
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="text-[11px] text-[#64748b]">
                {language === "bn"
                  ? "সহানুভূতিশীল দৃষ্টিভঙ্গি • দৈনন্দিন সহজ রূপক • বিজ্ঞানভিত্তিক ও নিরাপদ"
                  : "Socratic Empathy • Everyday Analogies • Evidence-Based & Safe"}
              </span>
              <button
                type="button"
                onClick={handleResetChat}
                disabled={isLoading}
                className="text-[11px] font-bold text-[#94a3b8] hover:text-[#f87171] transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                <span>{dict.clearChat}</span>
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex gap-2 sm:gap-3"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={dict.askAssistantPlaceholder}
                disabled={isLoading}
                className="flex-1 bg-[#07090e] border border-[rgba(163,230,53,0.25)] focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] rounded-xl px-4 py-3 text-sm text-white placeholder-[#64748b] transition-all outline-none"
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="px-5 py-3 rounded-xl bg-[#ccff00] text-black font-black uppercase text-xs tracking-wider flex items-center gap-2 hover:bg-[#b8e600] transition-all shadow-[0_0_20px_rgba(204,255,0,0.3)] disabled:opacity-50 disabled:pointer-events-none shrink-0 cursor-pointer"
              >
                <span>{language === "bn" ? "পাঠান" : "Send"}</span>
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
                    d="M5 12h14M12 5l7 7-7 7"
                  />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
