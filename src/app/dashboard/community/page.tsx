"use client";

import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import LanguageToggle from "@/components/LanguageToggle";
import {
  Friendship,
  CommunityMessage,
  fetchFriendships,
  addFriendship,
  deleteFriendship,
  fetchCommunityMessages,
  insertCommunityMessage,
  subscribeCommunityMessages,
} from "@/lib/db";
import { getStoredStreak, toBnDigits } from "@/lib/storage";

function formatMsgTime(isoStr?: string): string {
  if (!isoStr) return "Just now";
  try {
    const d = new Date(isoStr);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "Recent";
  }
}

export default function CommunityPage() {
  const pathname = usePathname();
  const { dict, language } = useLanguage();
  const { user } = useAuth();

  // Streak & Active Session Context
  const [streakDay] = useState<number>(() => getStoredStreak());

  // Squad / Friendships State
  const [friendships, setFriendships] = useState<Friendship[]>([]);
  const [friendPhone, setFriendPhone] = useState("");
  const [friendName, setFriendName] = useState("");
  const [isAddingFriend, setIsAddingFriend] = useState(false);
  const [friendError, setFriendError] = useState<string | null>(null);
  const [friendSuccess, setFriendSuccess] = useState<string | null>(null);

  // Social Share & Referral State
  const [copyToast, setCopyToast] = useState(false);
  const canNativeShare = useSyncExternalStore(
    () => () => {},
    () => typeof navigator !== "undefined" && typeof navigator.share === "function",
    () => false
  );

  // Community Chat State
  const [messages, setMessages] = useState<CommunityMessage[]>([]);
  const [chatCategory, setChatCategory] = useState<
    "general" | "workout_brag" | "nutrition_tip"
  >("general");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Load Initial Friendships & Community Messages
  useEffect(() => {
    let isMounted = true;

    fetchFriendships(user?.id).then((data) => {
      if (isMounted) setFriendships(data);
    });

    fetchCommunityMessages().then((data) => {
      if (isMounted) setMessages(data);
    });

    // Realtime Supabase Subscription
    const unsubscribe = subscribeCommunityMessages((newMsg) => {
      if (isMounted) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [user]);

  // Auto-scroll chat to latest
  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const navTabs = [
    { name: dict.overview, href: "/dashboard" },
    { name: dict.bmi, href: "/dashboard/bmi" },
    { name: dict.workouts, href: "/dashboard/workouts" },
    { name: dict.nutrition, href: "/dashboard/nutrition" },
    { name: dict.community, href: "/dashboard/community" },
  ];

  // Friend Phone Validation & Submit
  async function handleAddFriend(e: React.FormEvent) {
    e.preventDefault();
    setFriendError(null);
    setFriendSuccess(null);

    const cleanPhone = friendPhone.trim();
    const cleanName = friendName.trim();

    if (!cleanPhone || !cleanName) {
      setFriendError(
        language === "bn"
          ? "অনুগ্রহ করে ফোন নম্বর এবং বন্ধুর নাম উভয়ই লিখুন।"
          : "Please enter both friend's phone number and nickname."
      );
      return;
    }

    // Standard phone validation (10 to 15 digits, optional +)
    const phoneRegex = /^\+?[0-9\s-]{10,16}$/;
    if (!phoneRegex.test(cleanPhone)) {
      setFriendError(
        language === "bn"
          ? "সঠিক ফোন নম্বর ফরম্যাট লিখুন (যেমন: +880 1712 345678 বা 01712345678)।"
          : "Please enter a valid phone number format (e.g. +880 1712 345678)."
      );
      return;
    }

    setIsAddingFriend(true);
    try {
      const newFriend = await addFriendship(user?.id || null, {
        friend_phone: cleanPhone,
        friend_name: cleanName,
        status: "accepted",
        streak_count: Math.floor(Math.random() * 8) + 1, // simulated initial streak badge
      });

      setFriendships((prev) => [newFriend, ...prev]);
      setFriendPhone("");
      setFriendName("");
      setFriendSuccess(
        language === "bn"
          ? `সফলভাবে ${cleanName} কে আপনার স্কোয়াডে যুক্ত করা হয়েছে!`
          : `Successfully connected ${cleanName} to your squad!`
      );
      setTimeout(() => setFriendSuccess(null), 4000);
    } catch (err: unknown) {
      console.error("Failed to add friend:", err);
      setFriendError(
        language === "bn"
          ? "বন্ধু যুক্ত করতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।"
          : "Failed to add squad friend. Please try again."
      );
    } finally {
      setIsAddingFriend(false);
    }
  }

  // Remove Friend from squad
  async function handleRemoveFriend(id: string | number) {
    await deleteFriendship(user?.id || null, id);
    setFriendships((prev) => prev.filter((f) => f.id !== id));
  }

  // Social Sharing Actions
  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/signup?ref=${user?.id ? user.id.slice(0, 8) : "squad"}`;
    }
    return "https://ironandhabit.com";
  };

  const getShareText = () => {
    const streakStr = language === "bn" ? toBnDigits(streakDay) : streakDay;
    return language === "bn"
      ? `আমি আয়রন অ্যান্ড হ্যাবিট (Iron & Habit) এ ${streakStr} দিনের স্ট্রিকে আছি! আমার ফিটনেস স্কোয়াডে যোগ দিন:`
      : `I'm on a ${streakStr}-day streak on Iron & Habit! Join my fitness squad and train together:`;
  };

  function handleFacebookShare() {
    const url = getShareUrl();
    const text = getShareText();
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}&quote=${encodeURIComponent(text)}`;
    window.open(fbUrl, "_blank", "width=600,height=500,scrollbars=yes");
  }

  async function handleCopyInviteLink() {
    const url = getShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopyToast(true);
      setTimeout(() => setCopyToast(false), 3000);
    } catch {
      // fallback
    }
  }

  async function handleNativeShare() {
    if (canNativeShare) {
      try {
        await navigator.share({
          title: "Iron & Habit Fitness Squad",
          text: getShareText(),
          url: getShareUrl(),
        });
      } catch {
        // User cancelled or aborted
      }
    }
  }

  // Send Community Message
  async function handleSendMessage(customText?: string, categoryOverride?: "general" | "workout_brag" | "nutrition_tip") {
    const text = (customText || inputMessage).trim();
    if (!text || isSending) return;

    const cat = categoryOverride || chatCategory;
    const authorName =
      user?.user_metadata?.full_name ||
      user?.email?.split("@")[0] ||
      (language === "bn" ? "অ্যাথলেট" : "Athlete");

    setIsSending(true);
    setInputMessage("");

    try {
      const created = await insertCommunityMessage({
        user_id: user?.id,
        user_name: authorName,
        message: text,
        category: cat,
      });

      setMessages((prev) => {
        if (prev.some((m) => m.id === created.id)) return prev;
        return [...prev, created];
      });
    } catch (err: unknown) {
      console.error("Failed to post message:", err);
    } finally {
      setIsSending(false);
    }
  }

  // Filtered Messages
  const filteredMessages = messages.filter((m) => {
    if (filterCategory === "all") return true;
    return m.category === filterCategory;
  });

  return (
    <div className="relative min-h-screen bg-[#07090e] text-[#f9fafb] flex flex-col justify-between selection:bg-[#ccff00] selection:text-black">
      {/* Ambient Lighting */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-12 left-1/4 w-[600px] h-[400px] bg-[#ccff00]/[0.04] blur-[170px] rounded-full" />
        <div className="absolute bottom-12 right-12 w-[550px] h-[500px] bg-[#a3e635]/[0.03] blur-[160px] rounded-full" />
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
                    {dict.community}
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
                  {language === "bn"
                    ? `দিন ${toBnDigits(streakDay)} / ৭ 🔥`
                    : `Day ${streakDay} / 7 🔥`}
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

      {/* Main Workspace */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        {/* Module Header & Social Progress Share Suite */}
        <div className="bg-[rgba(18,24,38,0.7)] border border-[rgba(163,230,53,0.2)] rounded-2xl p-5 sm:p-6 backdrop-blur-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#ccff00] mb-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ccff00]" />
              <span>{dict.communitySubtitle}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
              {dict.community}
            </h1>
            <p className="text-xs text-[#94a3b8] mt-1 max-w-xl">
              {language === "bn"
                ? "আপনার বন্ধুদের ফোন নম্বর দিয়ে স্কোয়াডে আমন্ত্রণ জানান, ফেসবুকে আপনার অগ্রগতি শেয়ার করুন এবং লাইভ আলোচনায় অংশ নিন।"
                : "Connect with fitness partners via phone, broadcast your streaks on Facebook, and engage in real-time group discussions."}
            </p>
          </div>

          {/* Social Share Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Facebook Share Button */}
            <button
              type="button"
              onClick={handleFacebookShare}
              className="px-4 py-2.5 rounded-xl bg-[#1877f2] hover:bg-[#166fe5] text-white text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(24,119,242,0.4)] active:scale-95"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>{dict.shareOnFb}</span>
            </button>

            {/* Native Mobile Share Button (if supported) */}
            {canNativeShare && (
              <button
                type="button"
                onClick={handleNativeShare}
                className="px-4 py-2.5 rounded-xl bg-[#121826] border border-[#a3e635]/40 hover:border-[#ccff00] text-[#ccff00] text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(204,255,0,0.15)] active:scale-95"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                <span>{language === "bn" ? "শেয়ার" : "Share"}</span>
              </button>
            )}

            {/* Copy Referral / Invite Link Button */}
            <button
              type="button"
              onClick={handleCopyInviteLink}
              className="px-4 py-2.5 rounded-xl bg-[#ccff00] hover:bg-[#b8e600] text-black text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(204,255,0,0.3)] active:scale-95"
            >
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
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <span>{dict.copyReferralLink}</span>
            </button>
          </div>
        </div>

        {/* Copy Feedback Toast Notice */}
        {copyToast && (
          <div className="p-3 bg-[#ccff00]/15 border border-[#ccff00] text-[#ccff00] text-xs font-bold rounded-xl flex items-center gap-2 animate-in fade-in">
            <span>✓</span>
            <span>{dict.linkCopiedToast}</span>
          </div>
        )}

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Phone Squad Management (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Add Squad Member Card */}
            <div className="bg-[rgba(18,24,38,0.7)] border border-[rgba(163,230,53,0.2)] rounded-2xl p-5 sm:p-6 backdrop-blur-xl shadow-lg">
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ccff00]" />
                <h2 className="text-base font-black uppercase tracking-wider text-white">
                  {dict.squadTitle}
                </h2>
              </div>
              <p className="text-xs text-[#94a3b8] mb-5">
                {dict.squadSubtitle}
              </p>

              {/* Status Notices */}
              {friendError && (
                <div className="mb-4 p-3 bg-red-500/15 border border-red-500/40 text-red-400 text-xs font-bold rounded-xl flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{friendError}</span>
                </div>
              )}
              {friendSuccess && (
                <div className="mb-4 p-3 bg-[#ccff00]/15 border border-[#ccff00]/50 text-[#ccff00] text-xs font-bold rounded-xl flex items-center gap-2">
                  <span>✓</span>
                  <span>{friendSuccess}</span>
                </div>
              )}

              {/* Add Friend Form */}
              <form onSubmit={handleAddFriend} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-[#94a3b8] mb-1">
                    {language === "bn" ? "বন্ধুর ফোন নম্বর" : "Friend's Phone Number"}
                  </label>
                  <input
                    type="tel"
                    value={friendPhone}
                    onChange={(e) => setFriendPhone(e.target.value)}
                    placeholder={dict.friendPhonePlaceholder}
                    disabled={isAddingFriend}
                    className="w-full bg-[#07090e] border border-[rgba(163,230,53,0.25)] focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#64748b] transition-all outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-[#94a3b8] mb-1">
                    {language === "bn" ? "ডাকনাম বা নাম" : "Nickname or Full Name"}
                  </label>
                  <input
                    type="text"
                    value={friendName}
                    onChange={(e) => setFriendName(e.target.value)}
                    placeholder={dict.friendNamePlaceholder}
                    disabled={isAddingFriend}
                    className="w-full bg-[#07090e] border border-[rgba(163,230,53,0.25)] focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#64748b] transition-all outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isAddingFriend || !friendPhone.trim() || !friendName.trim()}
                  className="w-full py-3 rounded-xl bg-[#121826] border border-[#a3e635]/40 hover:border-[#ccff00] hover:bg-[#ccff00] hover:text-black text-[#ccff00] text-xs font-black uppercase tracking-wider transition-all duration-200 shadow-[0_0_15px_rgba(204,255,0,0.15)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                >
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
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                  <span>{dict.addFriendBtn}</span>
                </button>
              </form>
            </div>

            {/* Connected Squad List */}
            <div className="bg-[rgba(18,24,38,0.7)] border border-[rgba(163,230,53,0.2)] rounded-2xl p-5 sm:p-6 backdrop-blur-xl shadow-lg">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[rgba(163,230,53,0.1)]">
                <span className="text-xs font-black uppercase tracking-wider text-white">
                  {language === "bn" ? "সংযুক্ত অ্যাথলেটবৃন্দ" : "Connected Squad Members"}
                </span>
                <span className="text-xs font-mono font-bold text-[#ccff00]">
                  {language === "bn"
                    ? `${toBnDigits(friendships.length)} জন`
                    : `${friendships.length} Members`}
                </span>
              </div>

              {friendships.length === 0 ? (
                <div className="py-8 px-4 text-center">
                  <div className="w-10 h-10 mx-auto mb-2.5 rounded-xl bg-[#07090e] border border-[rgba(163,230,53,0.15)] flex items-center justify-center text-[#94a3b8]">
                    <svg
                      className="w-5 h-5 text-[#94a3b8]"
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
                  <p className="text-xs text-[#94a3b8] max-w-xs mx-auto leading-relaxed">
                    {dict.emptySquad}
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                  {friendships.map((friend) => (
                    <div
                      key={friend.id}
                      className="p-3.5 rounded-xl bg-[#07090e] border border-[rgba(163,230,53,0.15)] hover:border-[#a3e635]/40 transition-colors flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        {/* Member Avatar */}
                        <div className="w-10 h-10 rounded-xl bg-[#121826] border border-[#a3e635]/40 flex items-center justify-center font-black text-xs text-[#ccff00] shrink-0">
                          {friend.friend_name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white flex items-center gap-2">
                            <span>{friend.friend_name}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#121826] border border-[rgba(163,230,53,0.3)] text-[#ccff00] font-mono font-bold">
                              {language === "bn"
                                ? `🔥 ${toBnDigits(friend.streak_count || 1)} দিন`
                                : `🔥 ${friend.streak_count || 1}d streak`}
                            </span>
                          </div>
                          <div className="text-xs text-[#94a3b8] font-mono mt-0.5">
                            {friend.friend_phone}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveFriend(friend.id)}
                        className="p-1.5 rounded-lg text-[#94a3b8] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title={language === "bn" ? "মুছে ফেলুন" : "Remove"}
                        aria-label="Remove friend"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Real-time Group Chat / Feed (7 cols) */}
          <div className="lg:col-span-7 bg-[rgba(18,24,38,0.7)] border border-[rgba(163,230,53,0.2)] rounded-2xl p-5 sm:p-6 backdrop-blur-xl shadow-lg flex flex-col justify-between min-h-[640px]">
            {/* Chat Top Header & Category Filter */}
            <div className="space-y-3 pb-4 border-b border-[rgba(163,230,53,0.12)]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black uppercase tracking-wider text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ccff00] animate-pulse" />
                    <span>{dict.chatTitle}</span>
                  </h2>
                  <p className="text-xs text-[#94a3b8] mt-0.5">
                    {dict.chatSubtitle}
                  </p>
                </div>
                <div className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#121826] border border-[#a3e635]/40 text-[#ccff00]">
                  ● LIVE FEED
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  { id: "all", label: dict.filterAll },
                  { id: "workout_brag", label: dict.filterWorkouts },
                  { id: "nutrition_tip", label: dict.filterNutrition },
                  { id: "general", label: dict.filterGeneral },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFilterCategory(cat.id)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      filterCategory === cat.id
                        ? "bg-[#ccff00] text-black shadow-[0_0_12px_rgba(204,255,0,0.3)]"
                        : "bg-[#07090e] border border-[rgba(163,230,53,0.2)] text-[#94a3b8] hover:text-white"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Achievement Action Chips */}
            <div className="py-2.5 flex flex-wrap gap-1.5 border-b border-[rgba(163,230,53,0.08)]">
              <span className="text-[11px] font-bold text-[#94a3b8] mr-1 self-center">
                {language === "bn" ? "দ্রুত শেয়ার:" : "Quick Share:"}
              </span>
              <button
                type="button"
                onClick={() =>
                  handleSendMessage(
                    language === "bn"
                      ? "💪 আজকের ওয়ার্কআউট সফলভাবে সম্পন্ন করেছি! আয়রন শৃঙ্খলায় অটল।"
                      : "💪 Crushed today's workout! Locked into the Iron & Habit protocol.",
                    "workout_brag"
                  )
                }
                disabled={isSending}
                className="px-2.5 py-1 rounded-lg bg-[#07090e] border border-[#a3e635]/30 hover:border-[#ccff00] text-[11px] font-bold text-[#e2e8f0] hover:text-[#ccff00] transition-colors"
              >
                {dict.bragWorkoutPrompt}
              </button>
              <button
                type="button"
                onClick={() =>
                  handleSendMessage(
                    language === "bn"
                      ? `🔥 দিন ${toBnDigits(streakDay)} এর স্ট্রিক অক্ষুণ্ণ রেখেছি!`
                      : `🔥 Secured day ${streakDay} unbroken active streak!`,
                    "general"
                  )
                }
                disabled={isSending}
                className="px-2.5 py-1 rounded-lg bg-[#07090e] border border-[#a3e635]/30 hover:border-[#ccff00] text-[11px] font-bold text-[#e2e8f0] hover:text-[#ccff00] transition-colors"
              >
                {dict.bragStreakPrompt}
              </button>
              <button
                type="button"
                onClick={() =>
                  handleSendMessage(
                    language === "bn"
                      ? "🥗 আজকের সম্পূর্ণ প্রোটিন ও ম্যাক্রো টার্গেট পূরণ করেছি!"
                      : "🥗 Hit my complete daily protein and macro targets today!",
                    "nutrition_tip"
                  )
                }
                disabled={isSending}
                className="px-2.5 py-1 rounded-lg bg-[#07090e] border border-[#a3e635]/30 hover:border-[#ccff00] text-[11px] font-bold text-[#e2e8f0] hover:text-[#ccff00] transition-colors"
              >
                {dict.bragNutritionPrompt}
              </button>
            </div>

            {/* Message Feed Stream */}
            <div className="flex-1 my-3 overflow-y-auto max-h-[380px] space-y-3.5 pr-1">
              {filteredMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
                  <div className="w-10 h-10 rounded-xl bg-[#07090e] border border-[rgba(163,230,53,0.15)] flex items-center justify-center text-[#94a3b8] mb-2.5">
                    <svg
                      className="w-5 h-5 text-[#94a3b8]"
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
                  <p className="text-xs text-[#94a3b8] max-w-sm leading-relaxed">
                    {messages.length === 0
                      ? dict.emptyFeed
                      : language === "bn"
                      ? "এই ক্যাটাগরিতে এখনও কোনো পোস্ট নেই। প্রথম পোস্টটি আপনিই করুন!"
                      : "No posts in this category yet. Be the first to share an update!"}
                  </p>
                </div>
              ) : (
                filteredMessages.map((msg) => {
                  let badgeText = "General";
                  let badgeClass = "text-[#f59e0b] border-amber-500/40 bg-amber-500/10";
                  if (msg.category === "workout_brag") {
                    badgeText = "💪 PR / Workout";
                    badgeClass = "text-[#ccff00] border-[#ccff00]/40 bg-[#ccff00]/10";
                  } else if (msg.category === "nutrition_tip") {
                    badgeText = "🥗 Nutrition";
                    badgeClass = "text-[#38bdf8] border-sky-500/40 bg-sky-500/10";
                  }

                  const isMe = msg.user_id && msg.user_id === user?.id;

                  return (
                    <div
                      key={msg.id}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        isMe
                          ? "bg-[#141d2e] border-[#ccff00]/40 ml-4 sm:ml-8"
                          : "bg-[#07090e] border-[rgba(163,230,53,0.15)] mr-4 sm:mr-8"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-[#121826] border border-[#a3e635]/30 flex items-center justify-center text-[10px] font-black text-[#ccff00]">
                            {msg.user_name.slice(0, 1).toUpperCase()}
                          </div>
                          <span className="text-xs font-bold text-white">
                            {msg.user_name}
                          </span>
                          <span
                            className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${badgeClass}`}
                          >
                            {badgeText}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#64748b] font-mono">
                          {formatMsgTime(msg.created_at)}
                        </span>
                      </div>
                      <p className="text-xs text-[#e2e8f0] leading-relaxed pl-8">
                        {msg.message}
                      </p>
                    </div>
                  );
                })
              )}
              <div ref={chatScrollRef} />
            </div>

            {/* Input Bar */}
            <div className="pt-3 border-t border-[rgba(163,230,53,0.12)]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="space-y-2"
              >
                <div className="flex items-center gap-2">
                  <select
                    value={chatCategory}
                    onChange={(e) =>
                      setChatCategory(
                        e.target.value as "general" | "workout_brag" | "nutrition_tip"
                      )
                    }
                    className="bg-[#07090e] border border-[rgba(163,230,53,0.25)] rounded-xl px-3 py-2 text-xs font-bold text-[#ccff00] outline-none focus:border-[#ccff00]"
                  >
                    <option value="general">🔥 General / সাধারণ</option>
                    <option value="workout_brag">💪 Workout PR / ব্যায়াম</option>
                    <option value="nutrition_tip">🥗 Nutrition / পুষ্টি</option>
                  </select>
                  <span className="text-[10px] text-[#64748b]">
                    {language === "bn"
                      ? "সকলের সাথে আলোচনায় যুক্ত হোন"
                      : "Broadcast to community feed"}
                  </span>
                </div>

                <div className="flex gap-2 sm:gap-3">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={dict.postMessagePlaceholder}
                    disabled={isSending}
                    className="flex-1 bg-[#07090e] border border-[rgba(163,230,53,0.25)] focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] rounded-xl px-4 py-3 text-sm text-white placeholder-[#64748b] transition-all outline-none"
                  />
                  <button
                    type="submit"
                    disabled={isSending || !inputMessage.trim()}
                    className="px-5 py-3 rounded-xl bg-[#ccff00] hover:bg-[#b8e600] text-black font-black uppercase text-xs tracking-wider flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(204,255,0,0.3)] disabled:opacity-50 disabled:pointer-events-none shrink-0"
                  >
                    <span>{dict.sendMsgBtn}</span>
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
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[rgba(163,230,53,0.08)] py-4 text-center text-xs text-[#64748b]">
        IRON & HABIT • Community Squad & Social Hub
      </footer>
    </div>
  );
}
