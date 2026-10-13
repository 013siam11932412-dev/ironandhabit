"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import LanguageToggle from "@/components/LanguageToggle";
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
  return `${prefix}-${messageSeqCounter}`;
}

function getNowTimeStr(): string {
  const d = new Date();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export default function AssistantPage() {
  const pathname = usePathname();
  const { dict, language } = useLanguage();
  const { user } = useAuth();

  // Streak & Telemetry Context
  const [streakDay] = useState<number>(() => getStoredStreak());
  const [bmiRecord, setBmiRecord] = useState<BmiRecord | null>(null);
  const [dailyMetric, setDailyMetric] = useState<DailyMetric | null>(null);
  const [todayWorkouts, setTodayWorkouts] = useState<WorkoutLog[]>([]);
  const [todayNutrition, setTodayNutrition] = useState<NutritionLog[]>([]);

  // Chat State
  const [messages, setMessages] = useState<Message[]>([]);
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

  const quickPrompts = [
    {
      en: "What should my daily diet look like based on my goals?",
      bn: "আমার জন্য আজকের ডায়েট প্ল্যান কেমন হওয়া উচিত?",
      display: language === "bn" ? "আমার জন্য ডায়েট প্ল্যান" : "Today's Diet Plan",
    },
    {
      en: "Can you design a beginner-friendly workout routine for me?",
      bn: "নতুনদের জন্য সহজ একটি ওয়ার্কআউট রুটিন কীভাবে শুরু করব?",
      display: language === "bn" ? "নতুনদের জন্য সহজ রুটিন" : "Beginner Workout Routine",
    },
    {
      en: "Explain the science of muscle growth and calorie surplus.",
      bn: "ওজন ও পেশি বাড়ানোর বৈজ্ঞানিক নিয়ম কী?",
      display: language === "bn" ? "পেশি ও ওজন বৃদ্ধির বিজ্ঞান" : "Science of Muscle Gain",
    },
    {
      en: "What is the best home workout / calisthenics routine?",
      bn: "ঘরে কোনো ইকুইপমেন্ট ছাড়া সেরা হোম ওয়ার্কআউট কীভাবে করব?",
      display: language === "bn" ? "হোম ওয়ার্কআউট গাইড" : "Home Workout Guide",
    },
    {
      en: "Is spot-reduction real? How do I actually lose belly fat?",
      bn: "বেলি ফ্যাট শুধু পেটের ব্যায়াম দিয়ে কমানো সম্ভব কি? আসল বিজ্ঞান কী?",
      display: language === "bn" ? "বেলি ফ্যাট কমানোর সত্যিটা কী?" : "Can I Spot-Reduce Belly Fat?",
    },
    {
      en: "What are RPE and Progressive Overload in simple terms?",
      bn: "RPE এবং প্রোগ্রেসিভ ওভারলোড সহজ ভাষায় বুঝিয়ে বলুন।",
      display: language === "bn" ? "RPE ও প্রোগ্রেসিভ ওভারলোড" : "RPE & Progressive Overload",
    },
  ];

  const initialWelcomeMessage: Message = {
    id: "welcome-system-init",
    role: "assistant",
    content:
      language === "bn"
        ? "স্বাগতম অ্যাথলেট! আমি **Iron & Habit** এর এআই সহকারী — সার্টিফায়েড স্পোর্টস সায়েন্টিস্ট এবং ক্লিনিক্যাল ডায়েট কোচ।\n\nআপনার দৈনিক মেটাবলিক সূচক ও ওয়ার্কআউট ডেটা সিঙ্ক করা হয়েছে। প্রশিক্ষণ, ডায়েট, CICO, প্রোগ্রেসিভ ওভারলোড বা রিকভারি সম্পর্কে যেকোনো প্রশ্ন করুন, অথবা নিচের প্রম্পটগুলো ব্যবহার করুন!"
        : "Welcome Athlete! I am your **Iron & Habit** AI Assistant — Certified Sports Scientist (CSCS) & Clinical Sports Dietitian.\n\nYour biometrics and training logs are synchronized. Ask me anything about Progressive Overload, caloric balance, muscle protein synthesis, or recovery!",
    timestamp: "Online",
  };

  const allConversationMessages = [initialWelcomeMessage, ...messages];

  async function handleSendMessage(textToSend?: string) {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const timeStr = getNowTimeStr();
    const userMessage: Message = {
      id: createMsgId("user"),
      role: "user",
      content: text,
      timestamp: timeStr,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/assistant/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [initialWelcomeMessage, ...newMessages].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          userContext: {
            bmi: bmiRecord?.bmi || null,
            bmiCategory: bmiRecord?.category || "",
            weight: bmiRecord?.weight || "",
            height: bmiRecord?.height || "",
            calorieTarget: dailyMetric?.calories_consumed || 2200,
            workoutLogs: todayWorkouts,
            nutritionLogs: todayNutrition,
            language,
          },
        }),
      });

      const data = await response.json();
      const replyContent =
        data.reply ||
        (language === "bn"
          ? "দুঃখিত, এই মুহূর্তে উত্তর প্রক্রিয়া করা সম্ভব হচ্ছে না। অনুগ্রহ করে আবার চেষ্টা করুন।"
          : "Sorry, I could not process your query at this moment. Please try again.");

      const assistantMessage: Message = {
        id: createMsgId("assistant"),
        role: "assistant",
        content: replyContent,
        timestamp: getNowTimeStr(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: unknown) {
      console.error("Chat request failed:", err);
      const errorMessage: Message = {
        id: createMsgId("err"),
        role: "assistant",
        content:
          language === "bn"
            ? "⚠️ নেটওয়ার্ক ত্রুটি ঘটেছে। অনুগ্রহ করে আপনার ইন্টারনেট সংযোগ যাচাই করুন।"
            : "⚠️ Network connection error. Please check your internet connectivity.",
        timestamp: getNowTimeStr(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleResetChat() {
    setMessages([]);
  }

  return (
    <div className="relative min-h-screen bg-[#07090e] text-[#f9fafb] flex flex-col justify-between selection:bg-[#ccff00] selection:text-black">
      {/* Ambient Lighting */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-10 left-1/3 w-[600px] h-[400px] bg-[#ccff00]/[0.04] blur-[170px] rounded-full" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-[#a3e635]/[0.03] blur-[160px] rounded-full" />
      </div>

      {/* Top Header / Bar */}
      <header className="relative z-30 w-full border-b border-[rgba(163,230,53,0.15)] bg-[#07090e]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-20 flex items-center justify-between">
            {/* Brand Logo & Module Name */}
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

            {/* Language Toggle, Streak & Status Badge */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <LanguageToggle />
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(18,24,38,0.85)] border border-[rgba(163,230,53,0.3)] shadow-[0_0_15px_rgba(204,255,0,0.15)]">
                <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
                <span className="text-xs font-black uppercase text-[#ccff00] tracking-wider font-mono">
                  {language === "bn" ? `দিন ${streakDay} / ৭ 🔥` : `Day ${streakDay} / 7 🔥`}
                </span>
              </div>
              <Link
                href="/dashboard"
                className="text-xs font-bold text-[#94a3b8] hover:text-white px-2.5 py-1.5 rounded-lg border border-[rgba(163,230,53,0.15)] hover:border-[rgba(163,230,53,0.35)] transition-colors"
              >
                {dict.dashboard}
              </Link>
            </div>
          </div>

          {/* Navigation Tabs Bar */}
          <nav className="flex space-x-1 sm:space-x-2 border-t border-[rgba(163,230,53,0.08)] py-2 overflow-x-auto">
            {navTabs.map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-[#ccff00] text-black shadow-[0_0_20px_rgba(204,255,0,0.3)]"
                      : "text-[#94a3b8] hover:text-white hover:bg-[rgba(18,24,38,0.5)]"
                  }`}
                >
                  {tab.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Chat Workspace */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full flex flex-col gap-6">
        {/* Module Header & Live Telemetry Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[rgba(18,24,38,0.6)] border border-[rgba(163,230,53,0.15)] rounded-2xl p-4 sm:p-5 backdrop-blur-md">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#ccff00] mb-1">
              <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-ping" />
              <span>{dict.aiAssistant}</span>
              <span className="text-[#94a3b8]">•</span>
              <span className="text-[#94a3b8]">{dict.aiAssistantSubtitle}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight">
              {language === "bn" ? "বিজ্ঞানভিত্তিক এআই কোচ" : "AI Fitness & Nutrition Scientist"}
            </h1>
          </div>

          {/* Live Biometrics Synced Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="px-3 py-1.5 rounded-lg bg-[#07090e] border border-[rgba(163,230,53,0.25)] flex items-center gap-2 text-xs">
              <span className="text-[#94a3b8]">{language === "bn" ? "ওজন:" : "Weight:"}</span>
              <span className="font-mono font-bold text-white">
                {bmiRecord?.weight
                  ? language === "bn"
                    ? `${toBnDigits(bmiRecord.weight)} কেজি`
                    : `${bmiRecord.weight} kg`
                  : language === "bn"
                  ? "সেট নেই"
                  : "--"}
              </span>
            </div>

            <div className="px-3 py-1.5 rounded-lg bg-[#07090e] border border-[rgba(163,230,53,0.25)] flex items-center gap-2 text-xs">
              <span className="text-[#94a3b8]">BMI:</span>
              <span className="font-mono font-bold text-[#ccff00]">
                {bmiRecord?.bmi
                  ? language === "bn"
                    ? toBnDigits(bmiRecord.bmi)
                    : bmiRecord.bmi
                  : language === "bn"
                  ? "সেট নেই"
                  : "--"}
              </span>
              {bmiRecord?.category && (
                <span className="text-[10px] text-[#94a3b8] font-bold">
                  ({bmiRecord.category})
                </span>
              )}
            </div>

            <div className="px-3 py-1.5 rounded-lg bg-[#07090e] border border-[rgba(163,230,53,0.25)] flex items-center gap-2 text-xs">
              <span className="text-[#94a3b8]">{language === "bn" ? "আজকের সেট:" : "Today's Sets:"}</span>
              <span className="font-mono font-bold text-[#38bdf8]">
                {language === "bn"
                  ? `${toBnDigits(todayWorkouts.length)} টি`
                  : todayWorkouts.length}
              </span>
            </div>

            <div className="px-3 py-1.5 rounded-lg bg-[#07090e] border border-[#a3e635]/40 flex items-center gap-1.5 text-xs text-[#ccff00]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00]" />
              <span className="font-bold text-[11px] uppercase tracking-wider">
                {dict.aiContextBadge}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Prompt Chips */}
        <div className="flex flex-col gap-2">
          <div className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider">
            {language === "bn" ? "💡 দ্রুত প্রশ্ন বা আলোচনার বিষয়:" : "💡 Quick Science Prompts:"}
          </div>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(language === "bn" ? prompt.bn : prompt.en)}
                disabled={isLoading}
                className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#121826] border border-[rgba(163,230,53,0.2)] hover:border-[#ccff00] hover:text-[#ccff00] text-[#e2e8f0] transition-all hover:shadow-[0_0_12px_rgba(204,255,0,0.25)] disabled:opacity-50 disabled:pointer-events-none"
              >
                {prompt.display}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Stream Window */}
        <div className="flex-1 min-h-[460px] bg-[rgba(18,24,38,0.7)] border border-[rgba(163,230,53,0.18)] rounded-2xl p-4 sm:p-6 backdrop-blur-xl flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          {/* Messages Container */}
          <div className="space-y-6 overflow-y-auto max-h-[58vh] pr-2 sm:pr-4">
            {allConversationMessages.map((msg) => {
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
                    className={`max-w-[88%] sm:max-w-[78%] rounded-2xl p-4 sm:p-5 transition-all ${
                      isAssistant
                        ? "bg-[#0b0f19] border border-[rgba(163,230,53,0.2)] shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
                        : "bg-[#162032] border border-[#a3e635]/40 text-white shadow-[0_0_15px_rgba(204,255,0,0.1)]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-2 pb-2 border-b border-[rgba(255,255,255,0.06)]">
                      <span className="text-xs font-black uppercase tracking-wider text-[#ccff00]">
                        {isAssistant
                          ? language === "bn"
                            ? "আইরন অ্যান্ড হ্যাবিট কোচ"
                            : "Iron & Habit Coach (CSCS/RD)"
                          : language === "bn"
                          ? "আপনি (অ্যাথলেট)"
                          : "You (Athlete)"}
                      </span>
                      <span className="text-[10px] text-[#64748b] font-mono">
                        {msg.timestamp}
                      </span>
                    </div>

                    {isAssistant ? (
                      <MarkdownView content={msg.content} />
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

            {/* Typing / Analyzing Indicator */}
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
                <div className="bg-[#0b0f19] border border-[rgba(163,230,53,0.2)] rounded-2xl px-4 py-3 flex items-center gap-3">
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
                  ? "১০০% বিজ্ঞানসম্মত ও মেটাবলিক বিশ্লেষণ • ভ্রান্ত ধারণা ও স্ক্যাম বর্জিত"
                  : "100% Physiology & Evidence-Backed • Zero Gimmicks or Crash Diets"}
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
                className="flex-1 bg-[#0b0f19] border border-[rgba(163,230,53,0.25)] focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] rounded-xl px-4 py-3 text-sm text-white placeholder-[#64748b] transition-all outline-none"
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="px-5 py-3 rounded-xl bg-[#ccff00] text-black font-black uppercase text-xs tracking-wider flex items-center gap-2 hover:bg-[#b8e600] transition-all shadow-[0_0_20px_rgba(204,255,0,0.3)] disabled:opacity-50 disabled:pointer-events-none shrink-0"
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

      {/* Footer Note */}
      <footer className="relative z-10 border-t border-[rgba(163,230,53,0.08)] py-4 text-center text-xs text-[#64748b]">
        IRON & HABIT • Science-Backed Athletic Conditioning • Empowered by Google Gemini
      </footer>
    </div>
  );
}
