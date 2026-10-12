"use client";

import { useState, useSyncExternalStore } from "react";
import { useLanguage } from "@/context/LanguageContext";
import {
  DailyRecord,
  buildDynamicRolling7Days,
  buildDynamicRolling30Days,
} from "@/lib/storage";

export interface TodayMetrics {
  caloriesBurned: number;
  waterMl: number;
  habitsScore: number;
  completedQuestsCount: number;
  totalQuestsCount: number;
}

interface ProgressChartBoardProps {
  history: DailyRecord[];
  todayMetrics?: TodayMetrics;
}

export default function ProgressChartBoard({
  history,
  todayMetrics,
}: ProgressChartBoardProps) {
  const { dict, language } = useLanguage();
  const [timeRange, setTimeRange] = useState<"7d" | "30d">("7d");
  const [activeMetric, setActiveMetric] = useState<"calories" | "habits" | "water">(
    "calories"
  );
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Dynamic client date computation via useSyncExternalStore to prevent SSR hydration mismatch
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const clientDate = isClient ? new Date() : new Date(2026, 9, 11);

  // Compute dynamic performance window based on real-time client date
  // Chronological order: Oldest on far left -> Today on far right
  const displayHistory = (
    timeRange === "7d"
      ? buildDynamicRolling7Days(clientDate, history, todayMetrics, language)
      : buildDynamicRolling30Days(clientDate, history, todayMetrics, language)
  );

  // 30-day table list ordered most recent first (Today at the top)
  const monthlyTableRecords = buildDynamicRolling30Days(
    clientDate,
    history,
    todayMetrics,
    language
  )
    .slice()
    .reverse();

  // Telemetry aggregates based on active performance window
  const totalDays = displayHistory.length || 1;
  const avgCalories = Math.round(
    displayHistory.reduce((acc, curr) => acc + curr.caloriesBurned, 0) / totalDays
  );
  const avgWater = Math.round(
    displayHistory.reduce((acc, curr) => acc + curr.waterMl, 0) / totalDays
  );
  const completedDays = displayHistory.filter((d) => d.status === "completed").length;
  const consistencyPercent = Math.round((completedDays / totalDays) * 100);

  // Maximum value for scaling
  const maxVal =
    activeMetric === "calories"
      ? 3000
      : activeMetric === "water"
      ? 2500
      : 100;

  const unit =
    activeMetric === "calories"
      ? "kcal"
      : activeMetric === "water"
      ? "ml"
      : "%";

  const chartHeight = 170;
  const chartWidth = 720;
  const barCount = displayHistory.length;
  const isSevenDay = timeRange === "7d";
  const barWidth = isSevenDay ? 48 : 14;
  const availableSpace = chartWidth - barCount * barWidth;
  const gap = barCount > 1 ? availableSpace / (barCount - 1) : 0;

  return (
    <div className="space-y-6">
      {/* 1. Overview Page Dynamic Graph Chart Card */}
      <div className="bg-[rgba(18,24,38,0.7)] backdrop-blur-md border border-[rgba(163,230,53,0.25)] rounded-2xl p-5 sm:p-7 shadow-2xl space-y-6">
        {/* Top Controls: Header, Range Switcher, Metric Switcher */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[rgba(163,230,53,0.15)]">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#ccff00] mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00] animate-pulse" />
              <span>{dict.performanceTrends}</span>
              {isClient && (
                <span className="text-[10px] text-[#a3e635] bg-[#ccff00]/10 px-2 py-0.5 rounded border border-[#ccff00]/25 font-mono">
                  {language === "bn" ? "লাইভ ক্যালেন্ডার" : "LIVE CALENDAR"}
                </span>
              )}
            </div>
            <h3 className="text-xl font-black uppercase text-white tracking-tight">
              {language === "bn"
                ? "৭-দিনের পারফরম্যান্স গ্রাফ ও প্রগ্রেস চার্ট"
                : "7-Day Performance Graph & Telemetry"}
            </h3>
            <p className="text-xs text-[#94a3b8] mt-0.5">
              {language === "bn"
                ? "বর্তমান সক্রিয় সপ্তাহের ক্যালরি, পানি ও হ্যাবিট লক্ষ্যের রিয়েল-টাইম ট্রেন্ড"
                : "Real-time trends for current active week: calories, hydration, and habit quests"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Time Range Switcher: 7 Days vs 30 Days */}
            <div className="inline-flex items-center p-1 rounded-xl bg-[#07090e] border border-[rgba(163,230,53,0.25)] shadow-inner">
              <button
                type="button"
                onClick={() => {
                  setTimeRange("7d");
                  setHoveredIndex(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                  timeRange === "7d"
                    ? "bg-[#ccff00] text-black shadow-[0_0_15px_rgba(204,255,0,0.4)]"
                    : "text-[#94a3b8] hover:text-white"
                }`}
              >
                {dict.last7Days}
              </button>
              <button
                type="button"
                onClick={() => {
                  setTimeRange("30d");
                  setHoveredIndex(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                  timeRange === "30d"
                    ? "bg-[#ccff00] text-black shadow-[0_0_15px_rgba(204,255,0,0.4)]"
                    : "text-[#94a3b8] hover:text-white"
                }`}
              >
                {dict.last30Days}
              </button>
            </div>

            {/* Metric Selector Tabs */}
            <div className="inline-flex items-center p-1 rounded-xl bg-[#07090e] border border-[rgba(163,230,53,0.2)]">
              <button
                type="button"
                onClick={() => setActiveMetric("calories")}
                className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                  activeMetric === "calories"
                    ? "bg-[#10b981] text-black font-extrabold shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                    : "text-[#94a3b8] hover:text-white"
                }`}
              >
                🔥 {dict.metricCalories}
              </button>
              <button
                type="button"
                onClick={() => setActiveMetric("habits")}
                className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                  activeMetric === "habits"
                    ? "bg-[#ccff00] text-black font-extrabold shadow-[0_0_15px_rgba(204,255,0,0.4)]"
                    : "text-[#94a3b8] hover:text-white"
                }`}
              >
                ⚡ {dict.metricCompletion}
              </button>
              <button
                type="button"
                onClick={() => setActiveMetric("water")}
                className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                  activeMetric === "water"
                    ? "bg-[#38bdf8] text-black font-extrabold shadow-[0_0_15px_rgba(56,189,248,0.4)]"
                    : "text-[#94a3b8] hover:text-white"
                }`}
              >
                💧 {dict.metricWater}
              </button>
            </div>
          </div>
        </div>

        {/* 4 Summary Telemetry Badges */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-[#07090e]/80 border border-[rgba(163,230,53,0.15)] rounded-xl p-3.5 shadow-sm">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#94a3b8] block">
              {dict.avgCalories}
            </span>
            <div className="text-xl font-black text-white font-mono mt-1">
              {avgCalories}{" "}
              <span className="text-xs text-[#10b981] font-semibold">kcal/day</span>
            </div>
          </div>

          <div className="bg-[#07090e]/80 border border-[rgba(163,230,53,0.15)] rounded-xl p-3.5 shadow-sm">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#94a3b8] block">
              {dict.avgHydration}
            </span>
            <div className="text-xl font-black text-[#ccff00] font-mono mt-1">
              {avgWater}{" "}
              <span className="text-xs text-[#94a3b8] font-normal">ml/day</span>
            </div>
          </div>

          <div className="bg-[#07090e]/80 border border-[rgba(163,230,53,0.15)] rounded-xl p-3.5 shadow-sm">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#94a3b8] block">
              {dict.consistencyRate}
            </span>
            <div className="text-xl font-black text-white font-mono mt-1">
              {consistencyPercent}%{" "}
              <span className="text-xs text-[#ccff00] font-normal">
                ({completedDays}/{totalDays})
              </span>
            </div>
          </div>

          <div className="bg-[#07090e]/80 border border-[rgba(163,230,53,0.15)] rounded-xl p-3.5 shadow-sm">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#94a3b8] block">
              {language === "bn" ? "স্ট্রিক সাইকেল" : "Active Cycle"}
            </span>
            <div className="text-xl font-black text-[#ccff00] font-mono mt-1">
              {dict.streak7DaysBadge}{" "}
              <span className="text-xs text-[#94a3b8] font-normal">
                {language === "bn" ? "সাইক্লিক্যাল" : "Cyclical"}
              </span>
            </div>
          </div>
        </div>

        {/* Visual SVG Neon Bar & Trend Chart */}
        <div className="bg-[#07090e]/90 border border-[rgba(163,230,53,0.2)] rounded-xl p-4 sm:p-6 overflow-hidden relative">
          {/* Tooltip Hover Overlay */}
          {hoveredIndex !== null && displayHistory[hoveredIndex] && (
            <div className="absolute top-3 right-4 sm:right-6 bg-[rgba(18,24,38,0.96)] border border-[#ccff00] px-4 py-2 rounded-xl shadow-[0_0_20px_rgba(204,255,0,0.35)] pointer-events-none text-xs font-mono z-30 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-white font-bold">
                  {displayHistory[hoveredIndex].weekday},{" "}
                  {displayHistory[hoveredIndex].date}
                </span>
                {displayHistory[hoveredIndex].isToday && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-[#ccff00] text-black animate-pulse">
                    {language === "bn" ? "আজ / লাইভ" : "TODAY"}
                  </span>
                )}
              </div>
              <span className="text-[#ccff00] font-black">
                {activeMetric === "calories"
                  ? `${displayHistory[hoveredIndex].caloriesBurned} kcal`
                  : activeMetric === "water"
                  ? `${displayHistory[hoveredIndex].waterMl} ml`
                  : `${displayHistory[hoveredIndex].habitsScore}%`}
              </span>
              <span className="text-[10px] text-[#94a3b8]">
                {dict.questsStatus}:{" "}
                {displayHistory[hoveredIndex].completedQuestsCount ?? 5}/
                {displayHistory[hoveredIndex].totalQuestsCount ?? 5}
              </span>
              <span
                className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                  displayHistory[hoveredIndex].status === "completed"
                    ? "bg-[#ccff00]/20 text-[#ccff00]"
                    : displayHistory[hoveredIndex].status === "partial"
                    ? "bg-amber-400/20 text-amber-400"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {displayHistory[hoveredIndex].status === "completed"
                  ? dict.statusCompleted
                  : displayHistory[hoveredIndex].status === "partial"
                  ? dict.statusPartial
                  : dict.statusRest}
              </span>
            </div>
          )}

          <div className="overflow-x-auto">
            <div className="min-w-[660px]">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight + 52}`}
                className="w-full h-56 sm:h-68 select-none"
              >
                <defs>
                  {/* Neon Lime Gradient */}
                  <linearGradient id="neonLimeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ccff00" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.3" />
                  </linearGradient>
                  {/* Neon Emerald Gradient */}
                  <linearGradient id="neonEmeraldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#047857" stopOpacity="0.25" />
                  </linearGradient>
                  {/* Neon Cyan Gradient */}
                  <linearGradient id="neonCyanGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#0284c7" stopOpacity="0.2" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line
                  x1="0"
                  y1={chartHeight * 0.25}
                  x2={chartWidth}
                  y2={chartHeight * 0.25}
                  stroke="rgba(163,230,53,0.08)"
                  strokeDasharray="4 4"
                />
                <line
                  x1="0"
                  y1={chartHeight * 0.5}
                  x2={chartWidth}
                  y2={chartHeight * 0.5}
                  stroke="rgba(163,230,53,0.08)"
                  strokeDasharray="4 4"
                />
                <line
                  x1="0"
                  y1={chartHeight * 0.75}
                  x2={chartWidth}
                  y2={chartHeight * 0.75}
                  stroke="rgba(163,230,53,0.08)"
                  strokeDasharray="4 4"
                />
                <line
                  x1="0"
                  y1={chartHeight}
                  x2={chartWidth}
                  y2={chartHeight}
                  stroke="rgba(163,230,53,0.25)"
                />

                {/* Bars - Chronological: Oldest on Left -> Today on Far Right */}
                {displayHistory.map((day, idx) => {
                  const val =
                    activeMetric === "calories"
                      ? day.caloriesBurned
                      : activeMetric === "water"
                      ? day.waterMl
                      : day.habitsScore;

                  const ratio = Math.min(1, Math.max(0.06, val / maxVal));
                  const barH = ratio * chartHeight;
                  const x = idx * (barWidth + gap);
                  const y = chartHeight - barH;
                  const isHovered = hoveredIndex === idx;
                  const isToday = !!day.isToday;

                  const fillGrad =
                    activeMetric === "calories"
                      ? "url(#neonEmeraldGrad)"
                      : activeMetric === "water"
                      ? "url(#neonCyanGrad)"
                      : "url(#neonLimeGrad)";

                  return (
                    <g
                      key={day.id || idx}
                      className="cursor-pointer transition-all duration-200"
                      onMouseEnter={() => setHoveredIndex(idx)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      {/* Ambient Glow for hovered or today's active bar */}
                      {(isHovered || isToday) && (
                        <rect
                          x={x - 3}
                          y={y - 3}
                          width={barWidth + 6}
                          height={barH + 6}
                          rx={isSevenDay ? 7 : 4}
                          fill="#ccff00"
                          opacity={isHovered ? 0.35 : 0.18}
                          className="blur-[5px]"
                        />
                      )}

                      {/* Main Bar */}
                      <rect
                        x={x}
                        y={y}
                        width={barWidth}
                        height={barH}
                        rx={isSevenDay ? 6 : 3}
                        fill={fillGrad}
                        stroke={
                          isToday
                            ? "#ccff00"
                            : isHovered
                            ? "#ccff00"
                            : "rgba(163,230,53,0.4)"
                        }
                        strokeWidth={isToday ? 2 : isHovered ? 1.5 : 0.75}
                        className="transition-all duration-150"
                      />

                      {/* Top Accent Dot on Bar */}
                      <circle
                        cx={x + barWidth / 2}
                        cy={y}
                        r={isSevenDay ? 3.5 : 1.5}
                        fill={isToday || isHovered ? "#ffffff" : "#ccff00"}
                      />

                      {/* Value label on top for 7-day mode */}
                      {isSevenDay && (
                        <text
                          x={x + barWidth / 2}
                          y={y - 8}
                          textAnchor="middle"
                          fill={isToday || isHovered ? "#ffffff" : "#ccff00"}
                          fontSize="10"
                          fontWeight="bold"
                          fontFamily="monospace"
                        >
                          {activeMetric === "calories"
                            ? `${Math.round(val)}`
                            : activeMetric === "water"
                            ? `${val}`
                            : `${val}%`}
                        </text>
                      )}

                      {/* Today Badge on Top */}
                      {isSevenDay && isToday && (
                        <g>
                          <rect
                            x={x + barWidth / 2 - 16}
                            y={y - 23}
                            width="32"
                            height="12"
                            rx="3"
                            fill="#ccff00"
                          />
                          <text
                            x={x + barWidth / 2}
                            y={y - 14}
                            textAnchor="middle"
                            fill="#000000"
                            fontSize="8"
                            fontWeight="900"
                            fontFamily="monospace"
                          >
                            {language === "bn" ? "আজ" : "NOW"}
                          </text>
                        </g>
                      )}

                      {/* X-axis Day Name Label (Mon, Tue... / সোম, মঙ্গল...) */}
                      <text
                        x={x + barWidth / 2}
                        y={chartHeight + 17}
                        textAnchor="middle"
                        fill={isToday ? "#ccff00" : isHovered ? "#ffffff" : "#94a3b8"}
                        fontSize={isSevenDay ? "11" : "9"}
                        fontWeight={isToday || isHovered ? "bold" : "normal"}
                        fontFamily="monospace"
                      >
                        {isSevenDay
                          ? day.weekday
                          : idx % 3 === 0
                          ? day.date.split(" ")[0]
                          : ""}
                      </text>

                      {/* X-axis Calendar Date Label (e.g. 11 Oct / ১১ অক্টো) */}
                      {isSevenDay && (
                        <text
                          x={x + barWidth / 2}
                          y={chartHeight + 31}
                          textAnchor="middle"
                          fill={isToday ? "#a3e635" : "#64748b"}
                          fontSize="9"
                          fontWeight={isToday ? "bold" : "normal"}
                          fontFamily="monospace"
                        >
                          {day.date}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Legend and Scale Footer */}
          <div className="flex flex-wrap items-center justify-between text-[11px] text-[#94a3b8] pt-3 border-t border-[rgba(163,230,53,0.12)]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#10b981]" />
                <span>{dict.statusCompleted}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-400" />
                <span>{dict.statusPartial}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-600" />
                <span>{dict.statusRest}</span>
              </span>
              <span className="flex items-center gap-1.5 text-[#ccff00]">
                <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
                <span>{language === "bn" ? "আজকের রিয়েল-টাইম বার" : "Today's Live Bar"}</span>
              </span>
            </div>
            <span className="font-mono text-[10px] text-[#ccff00]">
              Scale: 0 &mdash; {maxVal} {unit}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Dedicated 1-Month History Chart Board Section Card */}
      <div className="bg-[rgba(18,24,38,0.7)] backdrop-blur-md border border-[rgba(163,230,53,0.25)] rounded-2xl p-5 sm:p-7 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[rgba(163,230,53,0.15)]">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#ccff00] mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00]" />
              <span>{dict.monthlyChartBoard}</span>
            </div>
            <h3 className="text-lg font-black uppercase text-white tracking-tight">
              {language === "bn"
                ? "৩০ দিনের দৈনিক ট্র্যাকিং হিস্টোরি"
                : "30-Day Daily Telemetry History Board"}
            </h3>
            <p className="text-xs text-[#94a3b8] mt-0.5">
              {dict.chartBoardSubtitle}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs font-mono font-bold text-[#ccff00] block">
              {monthlyTableRecords.length}{" "}
              {language === "bn" ? "দিনের রেকর্ড" : "Daily Entries"}
            </span>
            <span className="text-[10px] text-[#94a3b8] font-mono">
              {language === "bn" ? "১ মাস সংরক্ষিত" : "Retained in Storage"}
            </span>
          </div>
        </div>

        {/* 30-Day Table with Required Columns:
            Date (তারিখ), Calories (ক্যালরি), Hydration (পানি), Quests Status (লক্ষ্য), Result (সম্পূর্ণ/অসম্পূর্ণ) */}
        <div className="max-h-72 overflow-y-auto rounded-xl border border-[rgba(163,230,53,0.15)] bg-[#07090e]/80">
          <table className="w-full text-left text-xs font-mono">
            <thead className="sticky top-0 bg-[rgba(18,24,38,0.95)] backdrop-blur-md border-b border-[rgba(163,230,53,0.25)] text-[#94a3b8]">
              <tr>
                <th className="py-3 px-4">{dict.tableDate}</th>
                <th className="py-3 px-4">{dict.tableCalories}</th>
                <th className="py-3 px-4">{dict.tableWater}</th>
                <th className="py-3 px-4">{dict.questsStatus}</th>
                <th className="py-3 px-4 text-right">{dict.result}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(163,230,53,0.08)]">
              {monthlyTableRecords.map((record) => (
                <tr
                  key={record.id}
                  className={`hover:bg-[rgba(18,24,38,0.6)] transition-colors group ${
                    record.isToday ? "bg-[rgba(163,230,53,0.04)]" : ""
                  }`}
                >
                  {/* Date Column */}
                  <td className="py-3 px-4 text-white font-bold whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span>
                        {record.weekday ? `${record.weekday}, ` : ""}
                        {record.date}
                      </span>
                      {record.isToday && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-[#ccff00] text-black">
                          {language === "bn" ? "আজ" : "TODAY"}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Calories Column */}
                  <td className="py-3 px-4 text-[#ccff00] font-black whitespace-nowrap">
                    {record.caloriesBurned} kcal
                  </td>

                  {/* Hydration Column */}
                  <td className="py-3 px-4 text-white whitespace-nowrap">
                    {record.waterMl} ml
                  </td>

                  {/* Quests Status Column */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 text-[#94a3b8] group-hover:text-white">
                      <span className="font-bold text-[#ccff00]">
                        {record.completedQuestsCount ?? 5}/
                        {record.totalQuestsCount ?? 5}
                      </span>
                      <span className="text-[10px]">
                        ({record.habitsScore}%)
                      </span>
                    </span>
                  </td>

                  {/* Result Column with Color-Coded Neon Badges */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <span
                      className={`inline-block text-[10px] uppercase font-black px-2.5 py-1 rounded-md transition-all ${
                        record.status === "completed"
                          ? "bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/40 shadow-[0_0_10px_rgba(204,255,0,0.2)]"
                          : record.status === "partial"
                          ? "bg-amber-400/15 text-amber-400 border border-amber-400/40"
                          : "bg-slate-800 text-slate-400 border border-slate-700"
                      }`}
                    >
                      {record.status === "completed"
                        ? dict.statusCompleted
                        : record.status === "partial"
                        ? dict.statusPartial
                        : dict.statusRest}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
