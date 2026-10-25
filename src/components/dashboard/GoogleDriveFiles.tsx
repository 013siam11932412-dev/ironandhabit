"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/context/LanguageContext";

export interface DriveItem {
  id: string;
  name: string;
  type: "file" | "folder";
}

interface DriveApiResponse {
  success: boolean;
  folderId?: string;
  items?: DriveItem[];
  raw?: string;
  error?: string;
}

interface BreadcrumbNode {
  id: string;
  name: string;
}

export default function GoogleDriveFiles() {
  const { language } = useLanguage();

  const [items, setItems] = useState<DriveItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbNode[]>([
    { id: "root", name: language === "bn" ? "রুট ফোল্ডার" : "Root Vault" },
  ]);

  const currentFolder = breadcrumbs[breadcrumbs.length - 1];

  const fetchFiles = useCallback(async (folderId: string = "root") => {
    setIsLoading(true);
    setError(null);

    try {
      const url =
        folderId && folderId !== "root"
          ? `/api/drive?folderId=${encodeURIComponent(folderId)}`
          : `/api/drive`;

      const response = await fetch(url);
      const data: DriveApiResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to load Google Drive files");
      }

      setItems(data.items || []);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Could not establish connection with Google Drive MCP";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFiles(currentFolder.id);
  }, [fetchFiles, currentFolder.id]);

  const handleOpenFolder = (folder: DriveItem) => {
    setSearchQuery("");
    setBreadcrumbs((prev) => [...prev, { id: folder.id, name: folder.name }]);
  };

  const handleNavigateBreadcrumb = (index: number) => {
    setSearchQuery("");
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
          <div className="flex items-center gap-2.5 mb-1.5">
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
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[rgba(16,185,129,0.12)] border border-[rgba(16,185,129,0.35)] text-emerald-400 text-[10px] font-black uppercase tracking-widest font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              MCP STDIO
            </span>
          </div>
          <p className="text-xs text-[#94a3b8] leading-relaxed">
            {language === "bn"
              ? "মডেল কনটেক্সট প্রোটোকল (MCP) এর মাধ্যমে সংযুক্ত রিয়েল-টাইম ড্রাইভ অ্যাসেট ও ডকুমেন্ট।"
              : "Live workspace assets and training data synchronized via Model Context Protocol."}
          </p>
        </div>

        {/* Refresh button */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            type="button"
            onClick={() => fetchFiles(currentFolder.id)}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#07090e] border border-[rgba(163,230,53,0.3)] text-xs font-bold text-[#ccff00] hover:border-[#ccff00] hover:shadow-[0_0_15px_rgba(204,255,0,0.2)] transition-all cursor-pointer disabled:opacity-50"
            title={language === "bn" ? "রিফ্রেশ করুন" : "Refresh files"}
          >
            <div
              className={`w-3.5 h-3.5 flex items-center justify-center ${
                isLoading ? "animate-spin" : ""
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
                  ? "সিঙ্ক হচ্ছে..."
                  : "Syncing..."
                : language === "bn"
                ? "রিফ্রেশ"
                : "Refresh"}
            </span>
          </button>
        </div>
      </div>

      {/* Breadcrumbs and search toolbar */}
      <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-3 relative z-10">
        {/* Breadcrumbs */}
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
                  disabled={isLast || isLoading}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    isLast
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
        {/* Loading state */}
        {isLoading && (
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

        {/* Error state */}
        {!isLoading && error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-md bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                <svg
                  className="w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <p className="font-medium">{error}</p>
            </div>
            <button
              type="button"
              onClick={() => fetchFiles(currentFolder.id)}
              className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer self-start sm:self-auto"
            >
              {language === "bn" ? "পুনরায় চেষ্টা করুন" : "Retry"}
            </button>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && filteredItems.length === 0 && (
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
              {searchQuery
                ? language === "bn"
                  ? "কোনো ফাইল বা ফোল্ডার খুঁজে পাওয়া যায়নি"
                  : "No matching items found"
                : language === "bn"
                ? "এই ফোল্ডারটি খালি"
                : "This folder is empty"}
            </h4>
            <p className="text-xs text-[#94a3b8] max-w-sm mx-auto">
              {searchQuery
                ? language === "bn"
                  ? "অন্য কোনো অনুসন্ধানের শব্দ দিয়ে চেষ্টা করুন।"
                  : "Try a different search query."
                : language === "bn"
                ? "আপনার গুগল ড্রাইভে কোনো ফাইল নেই অথবা অ্যাক্সেস পারমিশন যাচাই করুন।"
                : "No files exist in this folder or check your Drive permissions."}
            </p>
          </div>
        )}

        {/* Files & Folders Grid */}
        {!isLoading && !error && filteredItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredItems.map((item) => {
              const isFolder = item.type === "folder";
              const isCopied = copiedId === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => (isFolder ? handleOpenFolder(item) : undefined)}
                  className={`group p-4 rounded-xl border transition-all duration-200 flex items-center justify-between gap-3 ${
                    isFolder
                      ? "bg-[#07090e]/80 border-emerald-500/25 hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] cursor-pointer"
                      : "bg-[#07090e]/60 border-[rgba(163,230,53,0.2)] hover:border-[#ccff00] hover:shadow-[0_0_20px_rgba(204,255,0,0.15)]"
                  }`}
                >
                  {/* Icon & File Details */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                        isFolder
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
                          className={`text-[9px] font-black uppercase tracking-wider font-mono px-1.5 py-0.5 rounded border ${
                            isFolder
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
                      className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${
                        isCopied
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
      {!isLoading && !error && items.length > 0 && (
        <div className="mt-4 pt-3 border-t border-[rgba(163,230,53,0.15)] flex items-center justify-between text-[11px] text-[#94a3b8] font-mono relative z-10">
          <span>
            {language === "bn"
              ? `মোট উপাদান: ${items.length}`
              : `Total items: ${items.length}`}
          </span>
          <span className="text-[#ccff00] font-bold">
            {language === "bn" ? "লাইভ সিঙ্ক চালু" : "Live Sync Active"}
          </span>
        </div>
      )}
    </div>
  );
}
