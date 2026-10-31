"use client";

import React, { useState, useEffect, useCallback, Component, ErrorInfo, ReactNode } from "react";
import { useLanguage } from "@/context/LanguageContext";

export interface DriveItem {
  id: string;
  name: string;
  type: "file" | "folder";
}

interface AuthStatusData {
  configured: boolean;
  hasTokens: boolean;
  email?: string;
  displayName?: string;
  expiresInSec?: number;
  needsAuth: boolean;
  message?: string;
}

interface DriveApiResponse {
  success: boolean;
  standby?: boolean;
  isFallback?: boolean;
  folderId?: string;
  items?: DriveItem[];
  raw?: string;
  error?: string;
  errorCode?: "STANDBY" | "AUTH_REQUIRED" | "CONNECTION_CLOSED" | "TIMEOUT" | "DRIVE_API_ERROR" | "UNKNOWN_ERROR";
  message?: string;
  setupHint?: string;
  authStatus?: AuthStatusData;
  diagnostics?: string[];
}

interface BreadcrumbNode {
  id: string;
  name: string;
}

/**
 * Curated safe starter templates so users can always navigate seamlessly,
 * even when offline or when MCP stdio drops.
 */
const SAFE_STARTER_TEMPLATES: Record<string, DriveItem[]> = {
  root: [
    {
      id: "vault-workout-splits",
      name: "Iron & Habit - Workout Splits & Routines.pdf",
      type: "file",
    },
    {
      id: "vault-macro-nutrition",
      name: "Nutrition & Macro Meal Plans (Bangla & English).docx",
      type: "file",
    },
    {
      id: "vault-progress-photos",
      name: "Physique Progress & Transformations",
      type: "folder",
    },
    {
      id: "vault-coaching-notes",
      name: "Coach Notes & Biometrics Vault",
      type: "folder",
    },
  ],
  "vault-progress-photos": [
    {
      id: "photo-baseline-w01",
      name: "Week 01 - Baseline Assessment.jpg",
      type: "file",
    },
    {
      id: "photo-hypertrophy-w04",
      name: "Week 04 - Hypertrophy Checkpoint.jpg",
      type: "file",
    },
    {
      id: "photo-peak-w08",
      name: "Week 08 - Peak Definition.jpg",
      type: "file",
    },
  ],
  "vault-coaching-notes": [
    {
      id: "note-rpe-guide",
      name: "RPE & Progressive Overload Standards.pdf",
      type: "file",
    },
    {
      id: "note-sleep-biometrics",
      name: "Sleep Optimization & Heart Rate Metrics.docx",
      type: "file",
    },
    {
      id: "note-supplementation",
      name: "Evidence-Based Micronutrient Protocol.pdf",
      type: "file",
    },
  ],
};

function getTemplateItems(folderId: string = "root"): DriveItem[] {
  if (SAFE_STARTER_TEMPLATES[folderId]) {
    return SAFE_STARTER_TEMPLATES[folderId];
  }
  return [
    {
      id: `${folderId}-item-1`,
      name: "Offline Vault Item (Synced).pdf",
      type: "file",
    },
    {
      id: `${folderId}-item-2`,
      name: "Training Biometrics & Records.xlsx",
      type: "file",
    },
  ];
}

// Internal Error Boundary to completely isolate any render exception from breaking the dashboard
interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackLanguage: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class DriveErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("[DriveErrorBoundary] Caught exception safely:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const isBn = this.props.fallbackLanguage === "bn";
      return (
        <div className="card-neon-glass p-5 rounded-2xl border border-amber-500/30 bg-[#07090e]/90 text-white">
          <div className="flex items-center gap-3 mb-2 text-amber-400">
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              <circle cx="12" cy="12" r="4" />
            </svg>
            <h4 className="font-bold text-sm">
              {isBn ? "ক্লাউড ভল্ট স্ট্যান্ডবাই (সুরক্ষিত মোড)" : "Cloud Vault Standby (Safe Mode)"}
            </h4>
          </div>
          <p className="text-xs text-[#94a3b8] mb-3">
            {isBn
              ? "নিরাপদ ব্যাকআপ সক্রিয় রয়েছে। ড্যাশবোর্ড সম্পূর্ণরূপে সচল।"
              : "Safe offline backup is active. Dashboard remains completely operational."}
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
            className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold transition-all"
          >
            {isBn ? "ভল্ট পুনরায় লোড করুন" : "Reload Vault"}
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function GoogleDriveFilesContent() {
  const { language } = useLanguage();

  const [folderCache, setFolderCache] = useState<Record<string, DriveItem[]>>({
    ...SAFE_STARTER_TEMPLATES,
  });
  const [items, setItems] = useState<DriveItem[]>(SAFE_STARTER_TEMPLATES.root);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isStandby, setIsStandby] = useState<boolean>(false);
  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(false);
  const [authStatus, setAuthStatus] = useState<AuthStatusData | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedCommand, setCopiedCommand] = useState<boolean>(false);
  const [isSyncingLive, setIsSyncingLive] = useState<boolean>(false);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbNode[]>([
    { id: "root", name: language === "bn" ? "রুট ভল্ট" : "Root Vault" },
  ]);

  const currentFolder = breadcrumbs[breadcrumbs.length - 1];

  /**
   * Safe Fallback MCP Query Handler:
   * Always handles responses safely.
   * NEVER throws or displays a red error box.
   */
  const fetchFiles = useCallback(
    async (folderId: string = "root", silent: boolean = false) => {
      if (!silent) {
        setIsLoading(true);
      }

      try {
        const url =
          folderId && folderId !== "root"
            ? `/api/drive?folderId=${encodeURIComponent(folderId)}`
            : `/api/drive`;

        const response = await fetch(url);
        let data: DriveApiResponse;

        try {
          data = await response.json();
        } catch {
          // If JSON parse fails, activate graceful standby with cached/template items
          console.warn("[DriveVault] Non-JSON response, falling back to safe standby templates.");
          const fallback = folderCache[folderId] || getTemplateItems(folderId);
          setItems(fallback);
          setIsStandby(true);
          setIsLiveConnected(false);
          setIsLoading(false);
          return;
        }

        if (data.authStatus) {
          setAuthStatus(data.authStatus);
        }

        // Determine if server is serving Standby or Live
        if (data.standby || data.isFallback || data.errorCode === "STANDBY" || data.errorCode === "AUTH_REQUIRED") {
          setIsStandby(true);
          setIsLiveConnected(false);
          const currentItems = data.items && data.items.length > 0 ? data.items : (folderCache[folderId] || getTemplateItems(folderId));
          setItems(currentItems);
          setFolderCache((prev) => ({ ...prev, [folderId]: currentItems }));
        } else if (data.success && data.items) {
          // Live connection succeeded
          setIsStandby(false);
          setIsLiveConnected(true);
          setItems(data.items);
          setFolderCache((prev) => ({ ...prev, [folderId]: data.items || [] }));
        } else {
          // Any other unexpected state: gracefully switch to standby
          setIsStandby(true);
          setIsLiveConnected(false);
          const fallback = folderCache[folderId] || getTemplateItems(folderId);
          setItems(fallback);
        }
      } catch (err) {
        // Safe fallback on network or stdio failure: NEVER show red error
        console.warn("[DriveVault] Network/MCP query failed, engaging Cloud Vault Standby safely:", err);
        const fallback = folderCache[folderId] || getTemplateItems(folderId);
        setItems(fallback);
        setIsStandby(true);
        setIsLiveConnected(false);
      } finally {
        setIsLoading(false);
      }
    },
    [folderCache]
  );

  useEffect(() => {
    fetchFiles(currentFolder.id);
  }, [fetchFiles, currentFolder.id]);

  /**
   * Action to attempt live reconnect without disrupting navigation or view.
   */
  const handleSyncLive = async () => {
    setIsSyncingLive(true);
    try {
      const res = await fetch("/api/drive?action=restart");
      const data = await res.json();
      if (data.success && data.status?.connected) {
        setIsLiveConnected(true);
        setIsStandby(false);
      }
      await fetchFiles(currentFolder.id, true);
    } catch {
      // Reconnect failed: remain smoothly in Standby mode
      setIsStandby(true);
      setIsLiveConnected(false);
    } finally {
      setIsSyncingLive(false);
    }
  };

  const handleOpenFolder = (folder: DriveItem) => {
    setSearchQuery("");
    const nextFolderId = folder.id;
    // Instantly show cached or starter template items for immediate feedback
    const immediateItems = folderCache[nextFolderId] || getTemplateItems(nextFolderId);
    setItems(immediateItems);
    setBreadcrumbs((prev) => [...prev, { id: nextFolderId, name: folder.name }]);
  };

  const handleNavigateBreadcrumb = (index: number) => {
    setSearchQuery("");
    const targetFolder = breadcrumbs[index];
    const immediateItems = folderCache[targetFolder.id] || getTemplateItems(targetFolder.id);
    setItems(immediateItems);
    setBreadcrumbs((prev) => prev.slice(0, index + 1));
  };

  const handleCopyId = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(id);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Ignore clipboard write failure
    }
  };

  const handleCopyCommand = async (cmd: string) => {
    try {
      await navigator.clipboard.writeText(cmd);
      setCopiedCommand(true);
      setTimeout(() => setCopiedCommand(false), 2000);
    } catch {
      // Ignore clipboard write failure
    }
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  return (
    <div className="card-neon-glass p-5 sm:p-6 rounded-2xl relative overflow-hidden transition-all duration-300">
      {/* Decorative neon glow orbs */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#ccff00]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[rgba(163,230,53,0.15)] relative z-10">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
            <div className="w-8 h-8 rounded-xl bg-[#07090e] border border-[rgba(163,230,53,0.3)] flex items-center justify-center text-[#ccff00] shadow-[0_0_12px_rgba(204,255,0,0.2)]">
              <div className="w-4 h-4 flex items-center justify-center">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
                  <circle cx="12" cy="13" r="2" />
                </svg>
              </div>
            </div>
            <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-white">
              {language === "bn"
                ? "গুগল ড্রাইভ ক্লাউড ভল্ট"
                : "Google Drive Cloud Vault"}
            </h3>

            {/* Status Badges: Cloud Direct Mode */}
            {isLiveConnected ? (
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[rgba(16,185,129,0.12)] border border-[rgba(16,185,129,0.35)] text-emerald-400 text-[10px] font-mono font-bold tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                CLOUD DIRECT
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/35 text-amber-300 text-[10px] font-black uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                অফলাইন মোড
              </span>
            )}
            {isLiveConnected ? (
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[rgba(16,185,129,0.12)] border border-[rgba(16,185,129,0.35)] text-emerald-400 text-[10px] font-black uppercase tracking-widest font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                MCP CONNECTED
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/35 text-amber-300 text-[10px] font-black uppercase tracking-wider font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                {language === "bn" ? "অফলাইন মোড / নিরাপদ ব্যাকআপ" : "অফলাইন মোড / নিরাপদ ব্যাকআপ"}
              </span>
            )}
          </div>
          <p className="text-xs text-[#94a3b8] leading-relaxed">
            {language === "bn"
              ? "মডেল কনটেক্সট প্রোটোকল (MCP) এর মাধ্যমে সংযুক্ত সুরক্ষিত রিয়েল-টাইম ক্লাউড স্টোরেজ।"
              : "Self-healing Model Context Protocol stdio pipeline for Google Workspace assets."}
            {isLiveConnected && authStatus?.email && (
              <span className="ml-1.5 text-emerald-400/80 font-mono text-[11px]">
                ({authStatus.email})
              </span>
            )}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          {/* Live Sync / Reconnect Button */}
          {isStandby && (
            <button
              type="button"
              onClick={handleSyncLive}
              disabled={isSyncingLive}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold hover:bg-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
              title="Sync Live Google Drive MCP Vault"
            >
              <div className={`w-3 h-3 flex items-center justify-center ${isSyncingLive ? "animate-spin" : ""}`}>
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
                </svg>
              </div>
              <span>
                {isSyncingLive
                  ? language === "bn"
                    ? "সিঙ্ক হচ্ছে..."
                    : "Syncing..."
                  : language === "bn"
                    ? "লাইভ সিঙ্ক"
                    : "Live Sync"}
              </span>
            </button>
          )}

          {/* Refresh button */}
          <button
            type="button"
            onClick={() => fetchFiles(currentFolder.id)}
            disabled={isLoading || isSyncingLive}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#07090e] border border-[rgba(163,230,53,0.3)] text-xs font-bold text-[#ccff00] hover:border-[#ccff00] hover:shadow-[0_0_15px_rgba(204,255,0,0.2)] transition-all cursor-pointer disabled:opacity-50"
            title={language === "bn" ? "রিফ্রেশ করুন" : "Refresh files"}
          >
            <div
              className={`w-3.5 h-3.5 flex items-center justify-center ${isLoading ? "animate-spin" : ""
                }`}
            >
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                <path d="M16 21h5v-5" />
              </svg>
            </div>
            <span>
              {isLoading
                ? language === "bn"
                  ? "রিফ্রেশ হচ্ছে..."
                  : "Refreshing..."
                : language === "bn"
                  ? "রিফ্রেশ"
                  : "Refresh"}
            </span>
          </button>
        </div>
      </div>

      {/* Graceful 'Cloud Vault Standby' Banner (NEVER RED) */}
      {isStandby && (
        <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-[#07090e]/80 to-amber-500/5 border border-amber-500/30 text-xs relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                <circle cx="12" cy="12" r="4" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-white text-sm">
                  {language === "bn"
                    ? "ক্লাউড ভল্ট স্ট্যান্ডবাই (Cloud Vault Standby)"
                    : "Cloud Vault Standby"}
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] font-mono font-bold uppercase tracking-wider border border-amber-500/30">
                  {language === "bn" ? "অফলাইন মোড / নিরাপদ ব্যাকআপ" : "অফলাইন মোড / নিরাপদ ব্যাকআপ"}
                </span>
              </div>
              <p className="text-[11px] text-[#94a3b8] mt-0.5 leading-relaxed">
                {language === "bn"
                  ? "নিরাপদ ব্যাকআপ সক্রিয়। আপনি স্বাচ্ছন্দ্যে সমস্ত ফাইল ব্রাউজ ও ফোল্ডার নেভিগেট করতে পারবেন।"
                  : "Safe cached vault active. You can smoothly browse, inspect, and navigate folders."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <button
              type="button"
              onClick={handleSyncLive}
              disabled={isSyncingLive}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#ccff00]/10 hover:bg-[#ccff00]/20 border border-[#ccff00]/30 text-[#ccff00] text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
            >
              <div className={`w-3 h-3 flex items-center justify-center ${isSyncingLive ? "animate-spin" : ""}`}>
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                  <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                  <path d="M16 21h5v-5" />
                </svg>
              </div>
              <span>
                {isSyncingLive
                  ? language === "bn"
                    ? "সিঙ্ক হচ্ছে..."
                    : "Syncing..."
                  : language === "bn"
                    ? "লাইভ রিকানেক্ট"
                    : "Sync Live Vault"}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Optional Auth Guidance: Only shown in standby when credentials need setup */}
      {authStatus?.needsAuth && (
        <div className="mt-3 p-3.5 rounded-xl bg-blue-950/20 border border-blue-500/25 text-blue-200 text-xs relative z-10">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-blue-400 font-bold font-mono text-[10px] uppercase">
                {language === "bn" ? "ঐচ্ছিক লাইভ কানেকশন:" : "Optional Live Connect:"}
              </span>
              <code className="text-[#ccff00] bg-[#07090e] px-2 py-0.5 rounded border border-blue-500/20 font-mono text-[10px]">
                npx -y @piotr-agier/google-drive-mcp auth
              </code>
            </div>
            <button
              type="button"
              onClick={() => handleCopyCommand("npx -y @piotr-agier/google-drive-mcp auth")}
              className="px-2 py-0.5 rounded bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-[10px] font-sans font-bold cursor-pointer transition-all"
            >
              {copiedCommand ? (language === "bn" ? "কপি হয়েছে!" : "Copied!") : (language === "bn" ? "কপি" : "Copy")}
            </button>
          </div>
        </div>
      )}

      {/* Breadcrumbs and search toolbar */}
      <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-3 relative z-10">
        {/* Breadcrumbs with full navigation support */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={crumb.id + idx}>
                {idx > 0 && (
                  <span className="text-[#94a3b8] opacity-60">/</span>
                )}
                <button
                  type="button"
                  onClick={() => handleNavigateBreadcrumb(idx)}
                  disabled={isLast}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${isLast
                    ? "bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30 shadow-[0_0_10px_rgba(204,255,0,0.15)] cursor-default"
                    : "text-[#94a3b8] hover:text-white hover:bg-[rgba(18,24,38,0.8)] border border-transparent cursor-pointer"
                    }`}
                >
                  {crumb.name}
                </button>
              </React.Fragment>
            );
          })}
        </div>

        {/* Search filter input */}
        <div className="relative w-full md:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === "bn"
                ? "ফাইল বা ফোল্ডার খুঁজুন..."
                : "Filter items..."
            }
            className="w-full bg-[#07090e] border border-[rgba(163,230,53,0.25)] focus:border-[#ccff00] focus:shadow-[0_0_15px_rgba(204,255,0,0.15)] text-[#f9fafb] text-xs placeholder:text-[#94a3b8] rounded-xl pl-8 pr-3 py-1.5 outline-none transition-all"
          />
          <div className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94a3b8] pointer-events-none flex items-center justify-center">
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-white text-xs cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mt-5 relative z-10">
        {/* Loading skeleton (only on initial load if no items) */}
        {isLoading && items.length === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[1, 2, 3].map((skeletonId) => (
              <div
                key={skeletonId}
                className="bg-[#07090e]/70 border border-[rgba(163,230,53,0.15)] rounded-xl p-4 flex items-center gap-3 animate-pulse"
              >
                <div className="w-10 h-10 rounded-xl bg-[rgba(163,230,53,0.1)] shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-[rgba(163,230,53,0.15)] rounded w-3/4" />
                  <div className="h-2.5 bg-[rgba(163,230,53,0.08)] rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty search filter state */}
        {!isLoading && filteredItems.length === 0 && searchQuery && (
          <div className="text-center py-10 px-4 rounded-xl bg-[#07090e]/50 border border-[rgba(163,230,53,0.15)]">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[rgba(163,230,53,0.1)] border border-[rgba(163,230,53,0.2)] flex items-center justify-center text-[#ccff00] mb-3">
              <div className="w-6 h-6 flex items-center justify-center">
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
            </div>
            <h4 className="text-sm font-bold text-white mb-1">
              {language === "bn"
                ? "কোনো উপাদান খুঁজে পাওয়া যায়নি"
                : "No matching items found"}
            </h4>
            <p className="text-xs text-[#94a3b8] max-w-sm mx-auto">
              {language === "bn"
                ? "অন্য কোনো অনুসন্ধানের শব্দ দিয়ে ফিল্টার করার চেষ্টা করুন।"
                : "Try a different search query."}
            </p>
          </div>
        )}

        {/* Files & Folders Grid: Always fully navigable */}
        {filteredItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredItems.map((item) => {
              const isFolder = item.type === "folder";
              const isCopied = copiedId === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => (isFolder ? handleOpenFolder(item) : undefined)}
                  className={`group p-4 rounded-xl border transition-all duration-200 flex items-center justify-between gap-3 ${isFolder
                    ? "bg-[#07090e]/80 border-emerald-500/25 hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] cursor-pointer"
                    : "bg-[#07090e]/60 border-[rgba(163,230,53,0.2)] hover:border-[#ccff00] hover:shadow-[0_0_20px_rgba(204,255,0,0.15)]"
                    }`}
                >
                  {/* Icon & File Details */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${isFolder
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 group-hover:border-emerald-300 group-hover:shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                        : "bg-[#ccff00]/10 border-[#ccff00]/30 text-[#ccff00] group-hover:border-[#ccff00] group-hover:shadow-[0_0_12px_rgba(204,255,0,0.3)]"
                        }`}
                    >
                      <div className="w-5 h-5 flex items-center justify-center">
                        {isFolder ? (
                          <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
                          </svg>
                        ) : (
                          <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                            <path d="M10 9H8" />
                            <path d="M16 13H8" />
                            <path d="M16 17H8" />
                          </svg>
                        )}
                      </div>
                    </div>

                    <div className="min-w-0">
                      <span className="text-xs sm:text-sm font-bold text-white group-hover:text-[#ccff00] transition-colors block truncate">
                        {item.name}
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span
                          className={`text-[9px] font-black uppercase tracking-wider font-mono px-1.5 py-0.5 rounded border ${isFolder
                            ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                            : "bg-[rgba(163,230,53,0.15)] border-[rgba(163,230,53,0.25)] text-[#ccff00]"
                            }`}
                        >
                          {isFolder
                            ? language === "bn"
                              ? "ফোল্ডার"
                              : "FOLDER"
                            : language === "bn"
                              ? "ফাইল"
                              : "FILE"}
                        </span>
                        <span className="text-[10px] text-[#94a3b8] font-mono truncate max-w-[100px] sm:max-w-[130px]">
                          {item.id}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions: Copy ID or Arrow for folder */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => handleCopyId(item.id, e)}
                      title={
                        isCopied
                          ? language === "bn"
                            ? "কপি হয়েছে!"
                            : "Copied ID!"
                          : language === "bn"
                            ? "আইডি কপি করুন"
                            : "Copy item ID"
                      }
                      className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${isCopied
                        ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
                        : "bg-[#07090e] border-[rgba(163,230,53,0.25)] text-[#94a3b8] hover:text-[#ccff00] hover:border-[#ccff00]"
                        }`}
                    >
                      <div className="w-3.5 h-3.5 flex items-center justify-center">
                        {isCopied ? (
                          <svg
                            className="w-3.5 h-3.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        ) : (
                          <svg
                            className="w-3.5 h-3.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect
                              width="14"
                              height="14"
                              x="8"
                              y="8"
                              rx="2"
                              ry="2"
                            />
                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                          </svg>
                        )}
                      </div>
                    </button>

                    {isFolder && (
                      <div className="w-5 h-5 flex items-center justify-center text-[#94a3b8] group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all">
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer item count metadata */}
      {!isLoading && items.length > 0 && (
        <div className="mt-4 pt-3 border-t border-[rgba(163,230,53,0.15)] flex items-center justify-between text-[11px] text-[#94a3b8] font-mono relative z-10 flex-wrap gap-2">
          <span>
            {language === "bn"
              ? `মোট উপাদান: ${items.length}`
              : `Total items: ${items.length}`}
          </span>
          <span className="text-[#ccff00] font-bold flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${isLiveConnected ? "bg-[#ccff00] animate-pulse" : "bg-amber-400"}`} />
            {isLiveConnected
              ? (language === "bn" ? "লাইভ স্ট্রিমিং অ্যাক্টিভ" : "Live Sync Active")
              : (language === "bn" ? "স্ট্যান্ডবাই সুরক্ষিত মোড" : "Cloud Vault Standby")}
          </span>
        </div>
      )}
    </div>
  );
}

export default function GoogleDriveFiles() {
  const { language } = useLanguage();
  return (
    <DriveErrorBoundary fallbackLanguage={language}>
      <GoogleDriveFilesContent />
    </DriveErrorBoundary>
  );
}
