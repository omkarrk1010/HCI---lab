import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { formatSeconds, calculateProgressPercentage } from '../utils/timerUtils';
import { Play, Pause, RotateCcw, XCircle, SlidersHorizontal, AlertCircle } from 'lucide-react';

export function CountdownTimer() {
  const {
    countdownConfig,
    countdownRemaining,
    countdownTotal,
    countdownIsRunning,
    startCountdown,
    pauseCountdown,
    resetCountdown,
    setCountdownTime,
    hciDemoState
  } = useStudy();

  const [isConfiguring, setIsConfiguring] = useState(false);
  const [hoursInput, setHoursInput] = useState(countdownConfig.hours);
  const [minsInput, setMinsInput] = useState(countdownConfig.minutes);
  const [secsInput, setSecsInput] = useState(countdownConfig.seconds);
  const [errorMsg, setErrorMsg] = useState('');

  const progressPercent = calculateProgressPercentage(countdownRemaining, countdownTotal);
  const radius = 120;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const handleApplyConfig = (e) => {
    e.preventDefault();
    const h = parseInt(hoursInput, 10) || 0;
    const m = parseInt(minsInput, 10) || 0;
    const s = parseInt(secsInput, 10) || 0;

    if (h < 0 || m < 0 || s < 0) {
      setErrorMsg('Duration values cannot be negative.');
      return;
    }
    if (h === 0 && m === 0 && s === 0) {
      setErrorMsg('Please specify a duration greater than 0 seconds.');
      return;
    }
    if (h > 24) {
      setErrorMsg('Hours cannot exceed 24.');
      return;
    }
    if (m > 59 || s > 59) {
      setErrorMsg('Minutes and seconds must be less than 60.');
      return;
    }

    setErrorMsg('');
    setCountdownTime(h, m, s);
    setIsConfiguring(false);
  };

  const isHighlighted = hciDemoState.highlightElementId === 'countdown-timer';

  return (
    <div className={`relative flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 shadow-2xl transition-all ${
      isHighlighted ? 'hci-highlight ring-4 ring-amber-400' : ''
    }`}>
      {/* Configuration Header Toggle */}
      <div className="flex items-center justify-between w-full max-w-sm mb-3">
        <span className="text-xs font-bold text-stone-300 uppercase tracking-wider">
          Custom Countdown
        </span>
        <button
          onClick={() => setIsConfiguring(!isConfiguring)}
          className="flex items-center gap-1 text-xs text-amber-300 hover:text-white transition-colors"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>{isConfiguring ? 'Close Editor' : 'Edit Time'}</span>
        </button>
      </div>

      {/* Main Countdown Progress & Digital Clock */}
      <div className="relative flex items-center justify-center my-3">
        <svg
          width={radius * 2 + strokeWidth * 2}
          height={radius * 2 + strokeWidth * 2}
          className="transform -rotate-90 drop-shadow-2xl"
        >
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            stroke="#38bdf8"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-300 ease-linear"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
          <span className="text-4xl sm:text-5xl font-black text-white font-mono-numbers drop-shadow-lg">
            {formatSeconds(countdownRemaining, true)}
          </span>
          <span className="text-xs font-semibold text-stone-400 mt-1 uppercase">
            {countdownIsRunning ? 'Remaining' : 'Preset'}
          </span>
        </div>
      </div>

      {/* Quick Countdown Presets */}
      <div className="flex items-center gap-1.5 my-2">
        {[2, 5, 15, 25].map((mins) => (
          <button
            key={mins}
            onClick={() => {
              if (!countdownIsRunning) {
                setCountdownTime(0, mins, 0);
              }
            }}
            disabled={countdownIsRunning}
            className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all ${
              countdownTotal === mins * 60
                ? 'bg-sky-400 text-stone-950 shadow-md scale-105'
                : 'bg-white/5 text-stone-300 hover:text-white hover:bg-white/10'
            } ${countdownIsRunning ? 'opacity-40 cursor-not-allowed' : ''}`}
            title={`Set countdown to ${mins} minutes`}
          >
            {mins === 2 ? '⚡ 2m Timer' : `${mins}m`}
          </button>
        ))}
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-4 mt-4">
        <button
          onClick={resetCountdown}
          className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white border border-white/10 transition-all hover:scale-105 active:scale-95"
          title="Reset Countdown"
          aria-label="Reset countdown timer"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={countdownIsRunning ? pauseCountdown : startCountdown}
          className={`w-16 h-16 sm:w-18 sm:h-18 rounded-3xl flex items-center justify-center text-stone-950 font-bold shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95 ${
            countdownIsRunning
              ? 'bg-sky-400 hover:bg-sky-300 shadow-sky-400/30'
              : 'bg-white hover:bg-sky-200 shadow-white/20'
          }`}
          aria-label={countdownIsRunning ? 'Pause countdown' : 'Start countdown'}
        >
          {countdownIsRunning ? (
            <Pause className="w-7 h-7 fill-stone-950" />
          ) : (
            <Play className="w-7 h-7 fill-stone-950 translate-x-0.5" />
          )}
        </button>

        <button
          onClick={() => {
            pauseCountdown();
            setCountdownRemaining(countdownTotal);
          }}
          className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white border border-white/10 transition-all hover:scale-105 active:scale-95"
          title="Cancel Session"
          aria-label="Cancel countdown"
        >
          <XCircle className="w-5 h-5" />
        </button>
      </div>

      {/* Configuration Form Modal */}
      {isConfiguring && (
        <div className="absolute inset-0 bg-stone-950/95 backdrop-blur-md rounded-3xl p-6 flex flex-col justify-between z-30 animate-fadeIn border border-white/20">
          <div>
            <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-sky-400" />
              <span>Configure Countdown</span>
            </h4>
            <p className="text-xs text-stone-400 mb-4">
              Enter target study duration hours, minutes, and seconds.
            </p>

            {errorMsg && (
              <div className="flex items-center gap-2 p-2 mb-3 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-200 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleApplyConfig} className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] text-stone-300 block mb-1">Hours</label>
                  <input
                    type="number"
                    min="0"
                    max="24"
                    value={hoursInput}
                    onChange={(e) => setHoursInput(e.target.value)}
                    className="w-full p-2 rounded-xl bg-white/10 border border-white/20 text-white text-center font-mono-numbers"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-stone-300 block mb-1">Minutes</label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={minsInput}
                    onChange={(e) => setMinsInput(e.target.value)}
                    className="w-full p-2 rounded-xl bg-white/10 border border-white/20 text-white text-center font-mono-numbers"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-stone-300 block mb-1">Seconds</label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={secsInput}
                    onChange={(e) => setSecsInput(e.target.value)}
                    className="w-full p-2 rounded-xl bg-white/10 border border-white/20 text-white text-center font-mono-numbers"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsConfiguring(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-stone-950 font-bold text-xs shadow-lg shadow-sky-500/20 transition-colors"
                >
                  Set Duration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
