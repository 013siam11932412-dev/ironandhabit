"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import LanguageToggle from "@/components/LanguageToggle";
import Footer from "@/components/Footer";
import {
  CommunityMessage,
  fetchCommunityMessages,
  insertCommunityMessage,
  subscribeCommunityMessages,
} from "@/lib/db";
import { getStoredStreak, toBnDigits } from "@/lib/storage";

function formatMsgTime(isoStr?: string, lang: "en" | "bn" = "en"): string {
  if (!isoStr) return "";
  try {
    const d = new Date(isoStr);
    const hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHour = hours % 12 || 12;
    const timeStr = `${formattedHour}:${minutes} ${ampm}`;
    return lang === "bn" ? toBnDigits(timeStr) : timeStr;
  } catch {
    return "";
  }
}

export default function CommunityPage() {
  const pathname = usePathname();
  const router = useRouter();
  const { dict, language } = useLanguage();
  const { user, signOut } = useAuth();

  const [streakDay] = useState<number>(() => getStoredStreak());

  // Group membership state (stored in localStorage)
  const [isJoined, setIsJoined] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      try {
        return localStorage.getItem("iron_squad_chat_joined") === "true";
      } catch {
        return false;
      }
    }
    return false;
  });

  // Messages & Chat state
  const [messages, setMessages] = useState<CommunityMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isJoined) {
      chatScrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isJoined]);

  // Fetch initial messages and subscribe to Supabase Realtime
  useEffect(() => {
    let isMounted = true;

    fetchCommunityMessages(100).then((msgs) => {
      if (isMounted) {
        setMessages(msgs);
      }
    });

    const unsubscribe = subscribeCommunityMessages((newMsg) => {
      if (!isMounted) return;
      setMessages((prev) => {
        if (prev.some((m) => String(m.id) === String(newMsg.id))) {
          return prev;
        }
        return [...prev, newMsg];
      });
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  function handleJoinGroup() {
    setIsJoined(true);
    try {
      localStorage.setItem("iron_squad_chat_joined", "true");
    } catch {
      // ignore
    }
  }

  function handleLeaveGroup() {
    setIsJoined(false);
    try {
      localStorage.removeItem("iron_squad_chat_joined");
    } catch {
      // ignore
    }
  }

  async function handleSendMessage(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!messageInput.trim() || isSending) return;

    const senderName =
      user?.user_metadata?.full_name ||
      (user?.email ? user.email.split("@")[0] : null) ||
      (language === "bn" ? "অ্যাথলেট" : "Athlete");

    const content = messageInput.trim();
    setMessageInput("");
    setIsSending(true);

    try {
      const created = await insertCommunityMessage({
        user_id: user?.id,
        user_name: senderName,
        message: content,
        category: "general",
      });

      setMessages((prev) => {
        if (prev.some((m) => String(m.id) === String(created.id))) {
          return prev;
        }
        return [...prev, created];
      });
    } catch (err) {
      console.error("Failed to send community message:", err);
    } finally {
      setIsSending(false);
    }
  }

  const navTabs = [
    { name: dict.overview, href: "/dashboard" },
    { name: dict.bmi, href: "/dashboard/bmi" },
    { name: dict.workouts, href: "/dashboard/workouts" },
    { name: dict.nutrition, href: "/dashboard/nutrition" },
    { name: dict.aiAssistant, href: "/dashboard/assistant" },
    { name: dict.community, href: "/dashboard/community" },
  ];

  const currentUserName =
    user?.user_metadata?.full_name ||
    (user?.email ? user.email.split("@")[0] : null);

  return (
    <div className="relative min-h-screen bg-[#07090e] text-[#f9fafb] flex flex-col justify-between selection:bg-[#ccff00] selection:text-black">
      {/* Ambient Glows */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-10 right-1/4 w-[600px] h-[400px] bg-[#ccff00]/[0.04] blur-[170px] rounded-full" />
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
                    {dict.community}
                  </span>
                </div>
              </Link>
            </div>

            {/* Language Switcher, Streak & User controls */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <LanguageToggle />

              {/* 7-Day Streak Badge */}
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

      {/* Main Full-Width Content Container */}
      <main className="relative z-10 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 flex-1 flex flex-col">
        {!isJoined ? (
          /* ============================================================ */
          /* VIEW 1: NOT JOINED - Centered Sleek Open Group Invitation Card */
          /* ============================================================ */
          <div className="flex-1 flex items-center justify-center py-8">
            <div className="max-w-md w-full bg-[#0b0f19] border border-[#121826] rounded-3xl p-8 sm:p-10 text-center shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl relative overflow-hidden group">
              {/* Subtle card glow */}
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#ccff00]/10 rounded-full blur-3xl pointer-events-none group-hover:bg-[#ccff00]/20 transition-all" />

              {/* Group Icon Badge */}
              <div className="w-20 h-20 mx-auto rounded-3xl bg-[#121826] border border-[#a3e635]/40 flex items-center justify-center shadow-[0_0_25px_rgba(204,255,0,0.25)] mb-6">
                <svg
                  className="w-10 h-10 text-[#ccff00]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>

              {/* Open Group Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(204,255,0,0.1)] border border-[#a3e635]/30 text-[#ccff00] text-xs font-mono font-bold uppercase tracking-wider mb-4">
                <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
                <span>{language === "bn" ? "উন্মুক্ত গ্রুপ চ্যাট • নো অ্যাডমিন" : "Open Group • No Admin Required"}</span>
              </div>

              {/* Title & Subtitle */}
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide uppercase mb-3">
                {dict.squadChatTitle}
              </h2>
              <p className="text-sm text-[#94a3b8] leading-relaxed mb-6">
                {dict.squadChatSubtitle}
              </p>

              {/* Features Pill List */}
              <div className="space-y-2 mb-8 text-left bg-[#07090e]/80 border border-[#1e293b] rounded-2xl p-4 text-xs text-[#cbd5e1]">
                <div className="flex items-center gap-2.5">
                  <span className="text-[#ccff00]">⚡</span>
                  <span>
                    {language === "bn"
                      ? "সকল অ্যাথলেটের সাথে রিয়েল-টাইম লাইভ চ্যাট"
                      : "Realtime global chatroom with fellow athletes"}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-[#ccff00]">🔓</span>
                  <span>
                    {language === "bn"
                      ? "কোনো অ্যাডমিন অনুমোদনের প্রয়োজন নেই"
                      : "Instant join & leave anytime without restrictions"}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-[#ccff00]">💪</span>
                  <span>
                    {language === "bn"
                      ? "দৈনিক ব্যায়াম, অভ্যাস ও ডায়েটের অভিজ্ঞতা শেয়ার"
                      : "Share daily habits, workout wins & meal tips"}
                  </span>
                </div>
              </div>

              {/* Primary Glowing Neon Button */}
              <button
                type="button"
                onClick={handleJoinGroup}
                className="w-full py-3.5 px-6 rounded-xl bg-[#ccff00] text-black font-black uppercase text-sm tracking-wider hover:bg-[#b8e600] transition-all shadow-[0_0_25px_rgba(204,255,0,0.35)] hover:shadow-[0_0_35px_rgba(204,255,0,0.5)] flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <span>{dict.joinGroupBtn}</span>
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
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          /* ============================================================ */
          /* VIEW 2: JOINED - Full-Width Messenger-Style Community Chat  */
          /* ============================================================ */
          <div className="flex-1 flex flex-col bg-[#0b0f19] border border-[#121826] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.7)] backdrop-blur-md overflow-hidden min-h-[580px]">
            {/* Top Chat Header */}
            <div className="px-5 py-4 border-b border-[rgba(163,230,53,0.15)] bg-[#0e1422] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#121826] border border-[#a3e635]/40 flex items-center justify-center shadow-[0_0_12px_rgba(204,255,0,0.2)]">
                  <svg
                    className="w-5 h-5 text-[#ccff00]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-black uppercase tracking-wider text-white">
                      {dict.squadChatTitle}
                    </h2>
                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[rgba(204,255,0,0.12)] border border-[#a3e635]/30 text-[10px] font-mono font-bold text-[#ccff00]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00] animate-ping" />
                      <span>{dict.liveBadge}</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-[#94a3b8]">
                    {language === "bn"
                      ? "উন্মুক্ত গ্রুপ চ্যাটরুম • যেকোনো সময় সদস্য যোগদান"
                      : "Public Athlete Room • Instant peer connection"}
                  </p>
                </div>
              </div>

              {/* Leave Group Button */}
              <button
                type="button"
                onClick={handleLeaveGroup}
                className="px-3.5 py-1.5 rounded-lg border border-[rgba(248,113,113,0.3)] bg-[rgba(248,113,113,0.06)] hover:bg-[rgba(248,113,113,0.15)] text-[#f87171] hover:text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
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
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span>{dict.leaveGroupBtn}</span>
              </button>
            </div>

            {/* Chat Messages Container */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 max-h-[58vh] bg-[#07090e]/60">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16 text-[#64748b]">
                  <div className="w-14 h-14 rounded-2xl bg-[#0e1422] border border-[#1e293b] flex items-center justify-center text-[#94a3b8] mb-3">
                    <svg
                      className="w-7 h-7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm font-medium max-w-sm">
                    {dict.noMessagesInChat}
                  </p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMyMessage =
                    (msg.user_id && user?.id && msg.user_id === user.id) ||
                    (currentUserName && msg.user_name === currentUserName);

                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3 items-end ${
                        isMyMessage ? "justify-end" : "justify-start"
                      }`}
                    >
                      {/* Left Avatar for other members */}
                      {!isMyMessage && (
                        <div className="w-8 h-8 rounded-full bg-[#121826] border border-[#a3e635]/40 flex items-center justify-center text-xs font-black text-[#ccff00] shrink-0 mb-1 shadow-[0_0_8px_rgba(204,255,0,0.2)]">
                          {(msg.user_name?.[0] || "A").toUpperCase()}
                        </div>
                      )}

                      {/* Bubble */}
                      <div
                        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 shadow-md ${
                          isMyMessage
                            ? "bg-[#162032] border border-[#a3e635]/50 text-white rounded-br-xs shadow-[0_0_15px_rgba(204,255,0,0.12)]"
                            : "bg-[#0e1422] border border-[#1e293b] text-[#e2e8f0] rounded-bl-xs"
                        }`}
                      >
                        {/* Header info */}
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`text-[11px] font-black uppercase tracking-wider ${
                              isMyMessage ? "text-[#ccff00]" : "text-[#a3e635]"
                            }`}
                          >
                            {isMyMessage
                              ? language === "bn"
                                ? "আপনি"
                                : "You"
                              : msg.user_name}
                          </span>
                          <span className="text-[10px] text-[#64748b] font-mono">
                            {formatMsgTime(msg.created_at, language)}
                          </span>
                        </div>

                        {/* Message body */}
                        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                          {msg.message}
                        </p>
                      </div>

                      {/* Right Avatar for current user */}
                      {isMyMessage && (
                        <div className="w-8 h-8 rounded-full bg-[#ccff00] text-black flex items-center justify-center text-xs font-black shrink-0 mb-1 shadow-[0_0_8px_rgba(204,255,0,0.4)]">
                          {(currentUserName?.[0] || "Y").toUpperCase()}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
              <div ref={chatScrollRef} />
            </div>

            {/* Bottom Chat Input Bar */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 sm:p-4 bg-[#0e1422] border-t border-[rgba(163,230,53,0.12)] flex items-center gap-2 sm:gap-3"
            >
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder={dict.typeMessagePlaceholder}
                disabled={isSending}
                className="flex-1 bg-[#07090e] border border-[rgba(163,230,53,0.25)] focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] rounded-xl px-4 py-3 text-sm text-white placeholder-[#64748b] transition-all outline-none"
              />
              <button
                type="submit"
                disabled={isSending || !messageInput.trim()}
                className="px-5 py-3 rounded-xl bg-[#ccff00] text-black font-black uppercase text-xs tracking-wider flex items-center gap-2 hover:bg-[#b8e600] transition-all shadow-[0_0_20px_rgba(204,255,0,0.3)] disabled:opacity-50 disabled:pointer-events-none shrink-0 cursor-pointer active:scale-95"
              >
                <span>{language === "bn" ? "পাঠান" : "Send"}</span>
                {/* Paper Airplane Send Icon */}
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
                    d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                  />
                </svg>
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
