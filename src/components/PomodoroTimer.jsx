import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { formatSeconds, calculateProgressPercentage } from '../utils/timerUtils';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  Settings2, 
  AlertTriangle, 
  CheckCircle2, 
  Coffee, 
  Flame, 
  Target,
  Sparkles
} from 'lucide-react';

export function PomodoroTimer({ size = 'large' }) {
  const {
    pomoPhase,
    pomoIsRunning,
    pomoCycleCount,
    pomoRemainingSeconds,
    pomoTotalSeconds,
    pomodoroSettings,
    setPomodoroSettings,
    pomoSessionCompletionNotice,
    setPomoSessionCompletionNotice,
    startPomo,
    pausePomo,
    resetPomo,
    skipPomoPhase,
    activeTask,
    tasks,
    setActiveTaskId,
    hciDemoState
  } = useStudy();

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showCustomSettings, setShowCustomSettings] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [tempSettings, setTempSettings] = useState({
    focusMinutes: pomodoroSettings.focusMinutes,
    shortBreakMinutes: pomodoroSettings.shortBreakMinutes,
    longBreakMinutes: pomodoroSettings.longBreakMinutes,
    longBreakInterval: pomodoroSettings.longBreakInterval,
  });

  const progressPercent = calculateProgressPercentage(pomoRemainingSeconds, pomoTotalSeconds);

  // SVG circular dimensions
  const radius = size === 'large' ? 140 : 100;
  const strokeWidth = size === 'large' ? 10 : 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const phaseConfig = {
    focus: {
      label: 'Focus Session',
      color: '#d97706',
      icon: Flame,
      badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    },
    shortBreak: {
      label: 'Short Break',
      color: '#10b981',
      icon: Coffee,
      badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    },
    longBreak: {
      label: 'Long Rest',
      color: '#38bdf8',
      icon: Sparkles,
      badgeClass: 'bg-sky-500/20 text-sky-300 border-sky-500/30'
    }
  };

  const currentPhaseDetails = phaseConfig[pomoPhase] || phaseConfig.focus;
  const PhaseIcon = currentPhaseDetails.icon;

  const handleResetRequest = () => {
    // Shneiderman Error Prevention: Protect users from accidental resets if session is ongoing
    if (pomoIsRunning && pomoRemainingSeconds < pomoTotalSeconds - 60) {
      setShowResetConfirm(true);
    } else {
      resetPomo();
    }
  };

  const confirmReset = () => {
    resetPomo();
    setShowResetConfirm(false);
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    const f = Number(tempSettings.focusMinutes);
    const s = Number(tempSettings.shortBreakMinutes);
    const l = Number(tempSettings.longBreakMinutes);
    const interval = Number(tempSettings.longBreakInterval);

    // Validation
    if (isNaN(f) || f < 1 || f > 120) {
      setValidationError('Focus duration must be between 1 and 120 minutes.');
      return;
    }
    if (isNaN(s) || s < 1 || s > 60) {
      setValidationError('Short break must be between 1 and 60 minutes.');
      return;
    }
    if (isNaN(l) || l < 1 || l > 90) {
      setValidationError('Long break must be between 1 and 90 minutes.');
      return;
    }
    if (isNaN(interval) || interval < 1 || interval > 12) {
      setValidationError('Long break cycle interval must be between 1 and 12.');
      return;
    }

    setValidationError('');
    setPomodoroSettings(prev => ({
      ...prev,
      focusMinutes: f,
      shortBreakMinutes: s,
      longBreakMinutes: l,
      longBreakInterval: interval
    }));
    setShowCustomSettings(false);
  };

  const isHighlighted = hciDemoState.highlightElementId === 'pomo-timer';

  return (
    <div 
      id="pomodoro-timer-container"
      className={`relative flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 shadow-2xl transition-all duration-300 ${
        isHighlighted ? 'hci-highlight ring-4 ring-amber-400' : ''
      }`}
    >
      {/* Top Phase Header & Cycle Indicator */}
      <div className="flex items-center justify-between w-full max-w-sm mb-4">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${currentPhaseDetails.badgeClass}`}>
          <PhaseIcon className="w-3.5 h-3.5" />
          <span>{currentPhaseDetails.label}</span>
        </div>

        {/* 4-Cycle Pomodoro Progress Dots (Conceptual Model) */}
        <div className="flex items-center gap-1.5" title={`${pomoCycleCount} of ${pomodoroSettings.longBreakInterval} sessions completed before long break`}>
          {[...Array(pomodoroSettings.longBreakInterval)].map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i < pomoCycleCount
                  ? 'bg-amber-400 scale-110 shadow-sm shadow-amber-400/50'
                  : 'bg-white/20'
              }`}
            />
          ))}
          <span className="text-[11px] text-stone-400 font-mono-numbers ml-1">
            {pomoCycleCount}/{pomodoroSettings.longBreakInterval}
          </span>
        </div>
      </div>

      {/* Circular Progress Ring & Large Remaining Time */}
      <div className="relative flex items-center justify-center my-4 group">
        <svg
          width={radius * 2 + strokeWidth * 2}
          height={radius * 2 + strokeWidth * 2}
          className="transform -rotate-90 drop-shadow-2xl"
        >
          {/* Background Track */}
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated Dynamic Progress Ring (Feedback) */}
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            stroke={currentPhaseDetails.color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-300 ease-linear"
          />
        </svg>

        {/* Center Time Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
          <span className="text-5xl sm:text-6xl font-black tracking-tight text-white font-mono-numbers drop-shadow-lg">
            {formatSeconds(pomoRemainingSeconds)}
          </span>
          <span className="text-xs sm:text-sm font-semibold tracking-wide text-stone-300 mt-1 uppercase">
            {pomoIsRunning ? 'Time Remaining' : 'Ready'}
          </span>
        </div>
      </div>

      {/* Quick Session Presets (2m Quick Timer, 5m, 15m, 25m Standard) */}
      <div className="flex items-center gap-1.5 my-2">
        {[2, 5, 15, 25].map((mins) => (
          <button
            key={mins}
            onClick={() => {
              if (!pomoIsRunning) {
                setPomodoroSettings(prev => ({ ...prev, focusMinutes: mins }));
              }
            }}
            disabled={pomoIsRunning}
            className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all ${
              pomodoroSettings.focusMinutes === mins
                ? 'bg-amber-400 text-stone-950 shadow-md scale-105'
                : 'bg-white/5 text-stone-300 hover:text-white hover:bg-white/10'
            } ${pomoIsRunning ? 'opacity-40 cursor-not-allowed' : ''}`}
            title={`Set focus duration to ${mins} minutes`}
          >
            {mins === 2 ? '⚡ 2m Timer' : `${mins}m`}
          </button>
        ))}
      </div>

      {/* Primary & Secondary Action Controls (Fitts's Law: Giant 72px center button) */}
      <div className="flex items-center gap-4 sm:gap-6 mt-4">
        {/* Reset Button with Error Prevention */}
        <button
          onClick={handleResetRequest}
          className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white border border-white/10 transition-all hover:scale-105 active:scale-95"
          title="Reset current timer session"
          aria-label="Reset timer"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        {/* Primary Giant Start / Pause Button */}
        <button
          id="pomo-main-btn"
          onClick={pomoIsRunning ? pausePomo : startPomo}
          className={`w-18 h-18 sm:w-20 sm:h-20 rounded-3xl flex items-center justify-center text-stone-950 font-bold shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95 ${
            pomoIsRunning
              ? 'bg-amber-400 hover:bg-amber-300 shadow-amber-400/30'
              : 'bg-white hover:bg-amber-200 shadow-white/20'
          }`}
          aria-label={pomoIsRunning ? 'Pause Timer' : 'Start Focus Session'}
        >
          {pomoIsRunning ? (
            <Pause className="w-8 h-8 fill-stone-950" />
          ) : (
            <Play className="w-8 h-8 fill-stone-950 translate-x-0.5" />
          )}
        </button>

        {/* Skip to Next Phase */}
        <button
          onClick={skipPomoPhase}
          className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white border border-white/10 transition-all hover:scale-105 active:scale-95"
          title="Skip to next phase"
          aria-label="Skip phase"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>

      {/* Pinned Active Focus Task (Reduces Short-Term Memory Load) */}
      <div className="w-full max-w-sm mt-6 pt-5 border-t border-white/10 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-stone-400">
          <span className="flex items-center gap-1.5 font-medium">
            <Target className="w-3.5 h-3.5 text-amber-400" />
            <span>Target Task</span>
          </span>
          <button
            onClick={() => setShowCustomSettings(true)}
            className="flex items-center gap-1 hover:text-white transition-colors"
            title="Configure Pomodoro custom durations"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>Durations</span>
          </button>
        </div>

        {activeTask ? (
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs">
            <div className="flex items-center gap-2 truncate">
              <span className={`w-2 h-2 rounded-full ${
                activeTask.priority === 'High' ? 'bg-rose-400' : activeTask.priority === 'Medium' ? 'bg-amber-400' : 'bg-emerald-400'
              }`} />
              <span className="text-stone-200 font-medium truncate">{activeTask.title}</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] bg-white/10 text-stone-300 font-semibold uppercase">
              {activeTask.subject}
            </span>
          </div>
        ) : (
          <div className="p-2.5 rounded-xl bg-white/5 border border-dashed border-white/15 text-xs text-stone-400 flex items-center justify-between">
            <span>No task selected for this focus session</span>
            {tasks.length > 0 && (
              <select
                onChange={(e) => setActiveTaskId(e.target.value)}
                className="bg-stone-800 text-stone-200 rounded px-2 py-1 text-xs border border-white/10 cursor-pointer"
                defaultValue=""
              >
                <option value="" disabled>Select task...</option>
                {tasks.map(t => (
                  <option key={t.id} value={t.id}>{t.title}</option>
                ))}
              </select>
            )}
          </div>
        )}
      </div>

      {/* --- Error Prevention Confirmation Modal --- */}
      {showResetConfirm && (
        <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-md rounded-3xl p-6 flex flex-col items-center justify-center text-center z-30 animate-fadeIn border border-amber-500/30">
          <AlertTriangle className="w-12 h-12 text-amber-400 mb-2" />
          <h4 className="text-base font-bold text-white mb-1">Reset Active Session?</h4>
          <p className="text-xs text-stone-300 mb-4 max-w-xs">
            You still have {formatSeconds(pomoRemainingSeconds)} remaining. Resetting will cancel your progress.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowResetConfirm(false)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-all"
            >
              Keep Going
            </button>
            <button
              onClick={confirmReset}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white shadow-lg shadow-rose-600/30 transition-all"
            >
              Reset Session
            </button>
          </div>
        </div>
      )}

      {/* --- Custom Duration Settings Modal --- */}
      {showCustomSettings && (
        <div className="absolute inset-0 bg-stone-950/90 backdrop-blur-md rounded-3xl p-6 flex flex-col justify-between z-30 animate-fadeIn border border-white/20">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-amber-400" />
                <span>Custom Interval Durations</span>
              </h4>
              <button
                onClick={() => setShowCustomSettings(false)}
                className="text-stone-400 hover:text-white text-xs"
              >
                Cancel
              </button>
            </div>

            {validationError && (
              <div className="p-2 mb-3 rounded-lg bg-rose-500/20 border border-rose-500/40 text-[11px] text-rose-200">
                {validationError}
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <label className="text-stone-300">Focus Duration (min):</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={tempSettings.focusMinutes}
                  onChange={(e) => setTempSettings({ ...tempSettings, focusMinutes: e.target.value })}
                  className="w-16 p-1.5 rounded-lg bg-white/10 border border-white/20 text-white text-right font-mono-numbers"
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="text-stone-300">Short Break (min):</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={tempSettings.shortBreakMinutes}
                  onChange={(e) => setTempSettings({ ...tempSettings, shortBreakMinutes: e.target.value })}
                  className="w-16 p-1.5 rounded-lg bg-white/10 border border-white/20 text-white text-right font-mono-numbers"
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="text-stone-300">Long Break (min):</label>
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={tempSettings.longBreakMinutes}
                  onChange={(e) => setTempSettings({ ...tempSettings, longBreakMinutes: e.target.value })}
                  className="w-16 p-1.5 rounded-lg bg-white/10 border border-white/20 text-white text-right font-mono-numbers"
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="text-stone-300">Long Break Interval:</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={tempSettings.longBreakInterval}
                  onChange={(e) => setTempSettings({ ...tempSettings, longBreakInterval: e.target.value })}
                  className="w-16 p-1.5 rounded-lg bg-white/10 border border-white/20 text-white text-right font-mono-numbers"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all"
              >
                Apply Durations
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- Session Closure Dialog (Shneiderman Rule 4: Yield Closure) --- */}
      {pomoSessionCompletionNotice && (
        <div className="absolute inset-0 bg-stone-950/90 backdrop-blur-lg rounded-3xl p-6 flex flex-col items-center justify-center text-center z-40 animate-fadeIn border border-amber-400/40">
          <div className="w-12 h-12 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-400 mb-3 shadow-lg shadow-amber-400/20">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-extrabold text-white mb-1">
            {pomoSessionCompletionNotice.title}
          </h3>
          <p className="text-xs text-stone-300 max-w-xs mb-5">
            {pomoSessionCompletionNotice.message}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPomoSessionCompletionNotice(null)}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-lg shadow-amber-500/25 transition-all"
            >
              Continue to {pomoSessionCompletionNotice.nextPhase === 'focus' ? 'Focus Block' : 'Break'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
