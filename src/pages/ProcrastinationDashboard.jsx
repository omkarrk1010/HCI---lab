import React from 'react';
import { useStudy } from '../context/StudyContext';
import { computeProcrastinationInsights } from '../utils/analyticsUtils';
import { Hourglass, Sparkles, AlertTriangle, Clock, Flame, CalendarDays } from 'lucide-react';

const LEVEL_STYLES = {
  Low: { ring: 'from-emerald-400 to-emerald-300', chip: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  Moderate: { ring: 'from-amber-400 to-amber-300', chip: 'bg-amber-100 text-amber-700 border-amber-200' },
  High: { ring: 'from-rose-400 to-rose-300', chip: 'bg-rose-100 text-rose-700 border-rose-200' }
};

export function ProcrastinationDashboard() {
  const { tasks, sessionHistory } = useStudy();
  const data = computeProcrastinationInsights(tasks, sessionHistory);
  const styles = LEVEL_STYLES[data.level];

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fadeIn pb-16">
      {/* Header */}
      <div className="p-5 rounded-3xl glass-panel-light">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
            AI Procrastination Dashboard
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-800">
          Where is your time actually going?
        </h1>
        <p className="text-xs text-stone-500 max-w-xl">
          Pattern-based insights, computed privately from your own task and session history.
        </p>
      </div>

      {/* Score Hero */}
      <section className="p-6 rounded-3xl glass-panel flex flex-col sm:flex-row items-center gap-6">
        <div className="relative w-28 h-28 shrink-0">
          <svg viewBox="0 0 100 100" className="w-28 h-28 -rotate-90">
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(42,37,35,0.08)" strokeWidth="10" />
            <circle
              cx="50" cy="50" r="42" fill="none" strokeWidth="10" strokeLinecap="round"
              stroke="url(#procGradient)"
              strokeDasharray={`${(data.score / 100) * 263.9} 263.9`}
            />
            <defs>
              <linearGradient id="procGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e59163" />
                <stop offset="100%" stopColor="#dd6f93" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-stone-800 font-mono-numbers">{data.score}</span>
            <span className="text-[10px] text-stone-400 uppercase">/ 100</span>
          </div>
        </div>

        <div className="flex-1 space-y-1.5 text-center sm:text-left">
          <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold border ${styles.chip}`}>
            {data.level} Procrastination Signal
          </span>
          <h3 className="text-base font-bold text-stone-800 flex items-center gap-2 justify-center sm:justify-start">
            <Sparkles className="w-4 h-4 text-amber-500" />
            AI Summary
          </h3>
          <p className="text-xs text-stone-500 max-w-md">
            Based on how long tasks sit untouched, how active you've been this week, and how much high-priority
            work is still open.
          </p>
        </div>
      </section>

      {/* Metric Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricTile
          icon={Clock}
          color="amber"
          label="Avg. Task Age"
          value={`${data.avgPendingAgeDays.toFixed(1)}d`}
          sub="Pending tasks"
        />
        <MetricTile
          icon={Flame}
          color="rose"
          label="High-Priority Open"
          value={data.highPriorityPendingCount}
          sub="Still untouched"
        />
        <MetricTile
          icon={CalendarDays}
          color="sky"
          label="Active Days"
          value={`${data.activeDaysLast7}/7`}
          sub="Last 7 days"
        />
        <MetricTile
          icon={Hourglass}
          color="emerald"
          label="Completion Lag"
          value={`${data.avgCompletionLagDays.toFixed(1)}d`}
          sub="Create → finish"
        />
      </div>

      {/* 7-day activity strip */}
      <section className="p-5 rounded-3xl glass-card space-y-3">
        <h3 className="text-sm font-bold text-stone-800">7-Day Activity Pulse</h3>
        <div className="flex items-end justify-between gap-2 h-20">
          {data.last7.map((d) => {
            const h = Math.min(100, Math.max(8, d.count * 35));
            return (
              <div key={d.key} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div className="w-full max-w-[32px] bg-stone-900/5 rounded-t-lg overflow-hidden flex items-end h-full">
                  <div
                    className={`w-full rounded-t-lg transition-all ${d.count > 0 ? 'bg-gradient-to-t from-amber-500 to-amber-300' : 'bg-stone-900/5'}`}
                    style={{ height: `${d.count > 0 ? h : 6}%` }}
                  />
                </div>
                <span className="text-[10px] text-stone-400 font-semibold">{d.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Insights */}
      <section className="p-5 rounded-3xl glass-card space-y-3">
        <h3 className="text-sm font-bold text-stone-800 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          Pattern Insights
        </h3>
        <ul className="space-y-2">
          {data.insights.map((text, i) => (
            <li key={i} className="text-xs text-stone-600 bg-stone-900/4 rounded-xl p-3 leading-relaxed">
              {text}
            </li>
          ))}
        </ul>
      </section>

      {/* Stale tasks list */}
      {data.staleTasks.length > 0 && (
        <section className="p-5 rounded-3xl glass-card space-y-3">
          <h3 className="text-sm font-bold text-stone-800">Tasks Most Likely Being Avoided</h3>
          <div className="space-y-2">
            {data.staleTasks.map((t) => (
              <div key={t.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-stone-900/4">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-stone-700 truncate">{t.title}</p>
                  <p className="text-[10px] text-stone-400">{t.subject} • {t.priority} priority</p>
                </div>
                <span className="text-[11px] font-bold text-rose-500 font-mono-numbers shrink-0">
                  {Math.round(t.ageDays)}d old
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function MetricTile({ icon: Icon, color, label, value, sub }) {
  const colorMap = {
    amber: 'bg-amber-100 text-amber-600',
    rose: 'bg-rose-100 text-rose-600',
    sky: 'bg-sky-100 text-sky-600',
    emerald: 'bg-emerald-100 text-emerald-600'
  };
  return (
    <div className="p-4 rounded-3xl glass-card flex flex-col justify-between">
      <div className="flex items-center justify-between text-stone-400 mb-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider">{label}</span>
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
          <Icon className="w-3.5 h-3.5" />
        </div>
      </div>
      <div>
        <span className="text-xl sm:text-2xl font-extrabold text-stone-800 font-mono-numbers">{value}</span>
        <span className="block text-[10px] text-stone-400 mt-0.5">{sub}</span>
      </div>
    </div>
  );
}
