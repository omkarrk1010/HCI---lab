import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { computeDailyStats } from '../utils/analyticsUtils';
import { Clock, CheckCircle2, Flame, Target, TrendingUp, Sliders } from 'lucide-react';

export function FocusStats() {
  const { sessionHistory, tasks, dailyGoalMinutes, setDailyGoalMinutes } = useStudy();
  const [showGoalEditor, setShowGoalEditor] = useState(false);

  const stats = computeDailyStats(sessionHistory, tasks);
  const goalProgress = Math.min(100, Math.round((stats.todayMinutes / (dailyGoalMinutes || 1)) * 100));

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {/* 1. Today's Minutes */}
      <div className="p-4 rounded-3xl glass-card border border-stone-900/10 flex flex-col justify-between">
        <div className="flex items-center justify-between text-stone-400 mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Focus Time</span>
          <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
            <Clock className="w-3.5 h-3.5" />
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-stone-800 font-mono-numbers">
              {stats.todayMinutes}
            </span>
            <span className="text-xs text-stone-400 font-medium">min</span>
          </div>
          <span className="text-[10px] text-stone-400">Total today</span>
        </div>
      </div>

      {/* 2. Pomodoro Sessions */}
      <div className="p-4 rounded-3xl glass-card border border-stone-900/10 flex flex-col justify-between">
        <div className="flex items-center justify-between text-stone-400 mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Pomodoros</span>
          <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
            <Flame className="w-3.5 h-3.5" />
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-stone-800 font-mono-numbers">
              {stats.pomodoroCount}
            </span>
            <span className="text-xs text-stone-400 font-medium">cycles</span>
          </div>
          <span className="text-[10px] text-stone-400">Completed</span>
        </div>
      </div>

      {/* 3. Tasks Done */}
      <div className="p-4 rounded-3xl glass-card border border-stone-900/10 flex flex-col justify-between">
        <div className="flex items-center justify-between text-stone-400 mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Tasks Done</span>
          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-stone-800 font-mono-numbers">
              {stats.completedTasksCount}
            </span>
            <span className="text-xs text-stone-400 font-medium">done</span>
          </div>
          <span className="text-[10px] text-stone-400">Total completed</span>
        </div>
      </div>

      {/* 4. Daily Goal Ring */}
      <div className="p-4 rounded-3xl glass-card border border-stone-900/10 flex flex-col justify-between relative group">
        <div className="flex items-center justify-between text-stone-400 mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Daily Goal</span>
          <button
            onClick={() => setShowGoalEditor(!showGoalEditor)}
            className="w-7 h-7 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center hover:bg-sky-200 transition-colors"
            title="Edit daily goal minutes"
          >
            <Target className="w-3.5 h-3.5" />
          </button>
        </div>
        <div>
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-stone-800 font-mono-numbers">
                {goalProgress}%
              </span>
            </div>
            <span className="text-[10px] text-stone-400">
              {stats.todayMinutes}/{dailyGoalMinutes}m
            </span>
          </div>
          {/* Mini progress bar */}
          <div className="w-full bg-stone-900/8 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-400 to-amber-400 transition-all duration-500 rounded-full"
              style={{ width: `${goalProgress}%` }}
            />
          </div>
        </div>

        {/* Quick Goal Editor Popover */}
        {showGoalEditor && (
          <div className="absolute inset-0 glass-panel-light rounded-3xl p-3 flex flex-col justify-between z-20 animate-fadeIn">
            <div className="flex justify-between items-center text-xs font-bold text-stone-800">
              <span>Target Minutes</span>
              <button onClick={() => setShowGoalEditor(false)} className="text-stone-400 hover:text-stone-800">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-1.5 my-1">
              {[60, 120, 180, 240].map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setDailyGoalMinutes(m);
                    setShowGoalEditor(false);
                  }}
                  className={`py-1 text-xs rounded-lg font-mono-numbers ${
                    dailyGoalMinutes === m ? 'bg-amber-500 text-stone-950 font-bold' : 'bg-stone-900/5 text-stone-600 hover:bg-stone-900/10'
                  }`}
                >
                  {m}m
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
