import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { StudyClock } from '../components/StudyClock';
import { PomodoroTimer } from '../components/PomodoroTimer';
import { CountdownTimer } from '../components/CountdownTimer';
import { TaskPanel } from '../components/TaskPanel';
import { FocusStats } from '../components/FocusStats';
import { 
  Compass, 
  Sparkles, 
  Flame, 
  Clock, 
  Star, 
  Volume2, 
  Play, 
  CheckCircle2,
  ChevronRight,
  Maximize2
} from 'lucide-react';

export function Dashboard({ onOpenAudioMixer }) {
  const { 
    environments, 
    currentEnvironment, 
    currentEnvId, 
    setCurrentEnvId, 
    favorites, 
    toggleFavorite,
    pomoIsRunning,
    startPomo,
    activeTask,
    setCurrentTab
  } = useStudy();

  const [timerMode, setTimerMode] = useState('pomodoro'); // 'pomodoro' | 'countdown' | 'clock'

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-6 animate-fadeIn pb-16">
      {/* Hero Welcome & Quick Environment Selector */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-3xl glass-panel border border-white/10 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              {currentEnvironment.name} Atmosphere
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {currentEnvironment.tagline}
          </h1>
          <p className="text-xs text-stone-300 max-w-xl">
            {currentEnvironment.description}
          </p>
        </div>

        {/* Horizontal Quick Environment Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full lg:max-w-md">
          {environments.map((env) => {
            const isSelected = env.id === currentEnvId;
            const isFav = favorites.includes(env.id);

            return (
              <button
                key={env.id}
                onClick={() => setCurrentEnvId(env.id)}
                className={`relative group shrink-0 w-24 h-16 rounded-2xl overflow-hidden border transition-all text-left ${
                  isSelected
                    ? 'border-amber-400 ring-2 ring-amber-400/50 scale-102 shadow-lg shadow-amber-500/20'
                    : 'border-white/10 opacity-70 hover:opacity-100 hover:scale-102'
                }`}
                title={env.name}
              >
                <img
                  src={env.imageUrl}
                  alt={env.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/30 to-transparent p-1.5 flex flex-col justify-between">
                  <div className="flex justify-end">
                    {isFav && (
                      <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-white truncate">
                    {env.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Grid: Timer on Left, Clock & Tasks on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Timer & Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Mode Switcher Tabs */}
          <div className="flex items-center justify-between p-1.5 rounded-2xl glass-card border border-white/10 max-w-md mx-auto sm:mx-0">
            <div className="flex items-center gap-1 w-full">
              <button
                onClick={() => setTimerMode('pomodoro')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  timerMode === 'pomodoro'
                    ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                    : 'text-stone-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Pomodoro</span>
              </button>

              <button
                onClick={() => setTimerMode('countdown')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  timerMode === 'countdown'
                    ? 'bg-sky-400 text-stone-950 shadow-md shadow-sky-400/20'
                    : 'text-stone-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Countdown</span>
              </button>

              <button
                onClick={() => setTimerMode('clock')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  timerMode === 'clock'
                    ? 'bg-white text-stone-950 shadow-md'
                    : 'text-stone-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Clock View</span>
              </button>
            </div>
          </div>

          {/* Active Timer Component */}
          {timerMode === 'pomodoro' && <PomodoroTimer size="large" />}
          {timerMode === 'countdown' && <CountdownTimer />}
          {timerMode === 'clock' && <StudyClock />}

          {/* Today's Study Stats Summary */}
          <FocusStats />
        </div>

        {/* Right Column: Clock & Study Tasks (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Digital Clock widget (if not in Clock view mode) */}
          {timerMode !== 'clock' && <StudyClock />}

          {/* Task Management Panel */}
          <TaskPanel isCollapsible={false} />

          {/* Quick Audio & Full Focus Callout Card */}
          <div className="p-5 rounded-3xl glass-card border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Suggested Ambience</h4>
                <p className="text-[11px] text-stone-400">
                  {currentEnvironment.suggestedSounds.join(' • ')}
                </p>
              </div>
            </div>

            <button
              onClick={onOpenAudioMixer}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-all flex items-center gap-1.5"
            >
              <span>Mix Sounds</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
