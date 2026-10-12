import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { soundEngine } from '../utils/audioEngine';
import { 
  Settings as SettingsIcon, 
  Clock, 
  Volume2, 
  Eye, 
  Sliders, 
  RotateCcw, 
  Check, 
  BellRing,
  Download,
  AlertTriangle,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export function Settings() {
  const { 
    pomodoroSettings, 
    setPomodoroSettings, 
    appSettings, 
    setAppSettings,
    visualEffectsEnabled,
    setVisualEffectsEnabled,
    overlayOpacity,
    setOverlayOpacity,
    masterVolume,
    handleMasterVolumeChange,
    dailyGoalMinutes,
    setDailyGoalMinutes,
    sessionHistory,
    tasks
  } = useStudy();

  const [savedNotice, setSavedNotice] = useState(false);

  const handlePomoChange = (key, val) => {
    const num = parseInt(val, 10);
    if (!isNaN(num) && num > 0) {
      setPomodoroSettings(prev => ({ ...prev, [key]: num }));
      triggerSaved();
    }
  };

  const triggerSaved = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleExportData = () => {
    const exportObject = {
      exportedAt: new Date().toISOString(),
      pomodoroSettings,
      appSettings,
      dailyGoalMinutes,
      tasks,
      sessionHistory
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportObject, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `studyscape_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all timer configurations and preferences to factory defaults?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Preferences & Ergonomics
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Application Settings
          </h1>
          <p className="text-xs text-stone-300">
            Customize timers, accessibility, visual atmospheric effects, and audio settings.
          </p>
        </div>

        {savedNotice && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold animate-fadeIn">
            <Check className="w-3.5 h-3.5" />
            <span>Saved</span>
          </div>
        )}
      </div>

      {/* 1. Pomodoro Timer Durations */}
      <section className="p-6 rounded-3xl glass-card border border-white/10 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-400" />
          <span>Pomodoro Session Timing</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">Focus Duration</span>
              <span className="text-[11px] text-stone-400">Minutes per focus block</span>
            </div>
            <input
              type="number"
              min="1"
              max="120"
              value={pomodoroSettings.focusMinutes}
              onChange={(e) => handlePomoChange('focusMinutes', e.target.value)}
              className="w-16 p-2 rounded-xl bg-stone-900 border border-white/15 text-white text-right font-mono-numbers text-xs"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">Short Break</span>
              <span className="text-[11px] text-stone-400">Minutes per short rest</span>
            </div>
            <input
              type="number"
              min="1"
              max="60"
              value={pomodoroSettings.shortBreakMinutes}
              onChange={(e) => handlePomoChange('shortBreakMinutes', e.target.value)}
              className="w-16 p-2 rounded-xl bg-stone-900 border border-white/15 text-white text-right font-mono-numbers text-xs"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">Long Break</span>
              <span className="text-[11px] text-stone-400">Minutes per extended recovery</span>
            </div>
            <input
              type="number"
              min="1"
              max="90"
              value={pomodoroSettings.longBreakMinutes}
              onChange={(e) => handlePomoChange('longBreakMinutes', e.target.value)}
              className="w-16 p-2 rounded-xl bg-stone-900 border border-white/15 text-white text-right font-mono-numbers text-xs"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">Long Break Cycle</span>
              <span className="text-[11px] text-stone-400">Sessions before long break</span>
            </div>
            <input
              type="number"
              min="1"
              max="12"
              value={pomodoroSettings.longBreakInterval}
              onChange={(e) => handlePomoChange('longBreakInterval', e.target.value)}
              className="w-16 p-2 rounded-xl bg-stone-900 border border-white/15 text-white text-right font-mono-numbers text-xs"
            />
          </div>
        </div>

        {/* Auto Start Breaks Toggle */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
          <div>
            <span className="text-xs font-bold text-white block">Auto-Start Breaks</span>
            <span className="text-[11px] text-stone-400">
              Immediately start break timer when focus block concludes
            </span>
          </div>
          <button
            onClick={() => {
              setPomodoroSettings(prev => ({ ...prev, autoStartBreaks: !prev.autoStartBreaks }));
              triggerSaved();
            }}
            className={`w-12 h-7 rounded-full p-1 transition-colors ${
              pomodoroSettings.autoStartBreaks ? 'bg-amber-500' : 'bg-stone-700'
            }`}
          >
            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
              pomodoroSettings.autoStartBreaks ? 'translate-x-5' : 'translate-x-0'
            }`} />
          </button>
        </div>
      </section>

      {/* 2. Clock & Display Formats */}
      <section className="p-6 rounded-3xl glass-card border border-white/10 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Eye className="w-4 h-4 text-amber-400" />
          <span>Clock & Accessibility</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/5">
            <div>
              <span className="text-xs font-bold text-white block">24-Hour Military Format</span>
              <span className="text-[11px] text-stone-400">Toggle between 12h AM/PM and 24h</span>
            </div>
            <button
              onClick={() => {
                setAppSettings(prev => ({ ...prev, clockIs24Hour: !prev.clockIs24Hour }));
                triggerSaved();
              }}
              className={`w-12 h-7 rounded-full p-1 transition-colors ${
                appSettings.clockIs24Hour ? 'bg-amber-500' : 'bg-stone-700'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                appSettings.clockIs24Hour ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/5">
            <div>
              <span className="text-xs font-bold text-white block">Reduced Motion</span>
              <span className="text-[11px] text-stone-400">Disable rain streaks and dynamic steam</span>
            </div>
            <button
              onClick={() => {
                setAppSettings(prev => ({ ...prev, reduceMotion: !prev.reduceMotion }));
                triggerSaved();
              }}
              className={`w-12 h-7 rounded-full p-1 transition-colors ${
                appSettings.reduceMotion ? 'bg-amber-500' : 'bg-stone-700'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                appSettings.reduceMotion ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </div>
      </section>

      {/* 3. Acoustic Test & Audio */}
      <section className="p-6 rounded-3xl glass-card border border-white/10 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-amber-400" />
          <span>Acoustic Engine & Sound Test</span>
        </h3>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
          <div>
            <span className="text-xs font-bold text-white block">Solfeggio Completion Bell</span>
            <span className="text-[11px] text-stone-400">
              528Hz pure sine wave chime used for interval completion
            </span>
          </div>

          <button
            onClick={() => soundEngine.playCompletionChime()}
            className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-2 transition-all self-start sm:self-center"
          >
            <BellRing className="w-4 h-4" />
            <span>Test Sound Chime</span>
          </button>
        </div>
      </section>

      {/* 4. Data Backup & Reset */}
      <section className="p-6 rounded-3xl glass-card border border-white/10 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Data Privacy & Storage</span>
        </h3>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-xs text-stone-400">
            StudyScape does not track you or send personal metrics to any remote server.
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportData}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white flex items-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export JSON</span>
            </button>

            <button
              onClick={handleResetDefaults}
              className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Defaults</span>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
