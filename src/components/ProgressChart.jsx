import React, { useState } from 'react';
import { getWeeklyChartData } from '../utils/analyticsUtils';

export function ProgressChart({ sessionHistory = [], dailyGoalMinutes = 120 }) {
  const [hoveredDay, setHoveredDay] = useState(null);
  const data = getWeeklyChartData(sessionHistory);

  // Determine max value for vertical scaling
  const maxMinutes = Math.max(dailyGoalMinutes, ...data.map(d => d.minutes), 60);

  return (
    <div className="w-full p-6 rounded-3xl glass-card border border-white/10 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h4 className="text-sm font-bold text-white">7-Day Study Focus Distribution</h4>
          <p className="text-xs text-stone-400">Daily focus minutes over the past week</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-amber-400" />
            <span className="text-stone-300">Focus Minutes</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-sky-400 border border-sky-400" />
            <span className="text-stone-300">Goal ({dailyGoalMinutes}m)</span>
          </div>
        </div>
      </div>

      {/* SVG Bar Chart Area */}
      <div className="relative h-52 w-full pt-4">
        {/* Goal line benchmark */}
        <div 
          className="absolute left-0 right-0 border-b border-dashed border-sky-400/50 flex justify-end pr-2 text-[10px] text-sky-300"
          style={{ bottom: `${(dailyGoalMinutes / maxMinutes) * 100}%` }}
        >
          <span className="bg-stone-900/80 px-1 rounded -translate-y-2">Goal</span>
        </div>

        {/* 7 Days Columns */}
        <div className="flex items-end justify-between h-44 gap-2 sm:gap-4 px-2">
          {data.map((item, idx) => {
            const heightPercent = Math.min(100, Math.max(4, (item.minutes / maxMinutes) * 100));
            const isHovered = hoveredDay?.dateKey === item.dateKey;

            return (
              <div
                key={item.dateKey}
                onMouseEnter={() => setHoveredDay(item)}
                onMouseLeave={() => setHoveredDay(null)}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
              >
                {/* Tooltip on hover */}
                {isHovered && (
                  <div className="absolute -top-12 z-20 px-2.5 py-1 rounded-xl bg-stone-900 border border-white/20 text-white text-[11px] shadow-2xl pointer-events-none whitespace-nowrap animate-fadeIn">
                    <span className="font-bold text-amber-300 font-mono-numbers">{item.minutes} mins</span>
                    <span className="text-stone-400 ml-1">({item.sessionsCount} sessions)</span>
                  </div>
                )}

                {/* Animated Vertical Bar */}
                <div className="w-full max-w-[42px] bg-white/5 rounded-t-xl overflow-hidden flex items-end h-full">
                  <div
                    className={`w-full rounded-t-xl transition-all duration-500 ${
                      item.isToday
                        ? 'bg-gradient-to-t from-amber-600 to-amber-300 shadow-lg shadow-amber-500/20'
                        : 'bg-gradient-to-t from-amber-900/60 to-amber-500/80 group-hover:from-amber-600 group-hover:to-amber-400'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>

                {/* Day Label */}
                <div className="mt-2 text-center">
                  <span className={`text-[11px] font-semibold block ${
                    item.isToday ? 'text-amber-300 font-bold' : 'text-stone-400 group-hover:text-stone-200'
                  }`}>
                    {item.dayName}
                  </span>
                  <span className="text-[9px] text-stone-500 font-mono-numbers hidden sm:block">
                    {item.minutes}m
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
