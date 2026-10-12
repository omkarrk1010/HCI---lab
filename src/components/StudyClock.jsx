import React, { useState, useEffect } from 'react';
import { useStudy } from '../context/StudyContext';
import { formatClockTime } from '../utils/timerUtils';
import { Sun, Moon, Calendar, Eye, EyeOff } from 'lucide-react';

export function StudyClock() {
  const { appSettings, setAppSettings } = useStudy();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const { timeStr, period } = formatClockTime(
    currentTime,
    appSettings.clockIs24Hour,
    appSettings.showClockSeconds
  );

  const getGreeting = () => {
    const hours = currentTime.getHours();
    if (hours < 12) return { text: 'Good morning', icon: Sun };
    if (hours < 17) return { text: 'Good afternoon', icon: Sun };
    return { text: 'Good evening', icon: Moon };
  };

  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  const dateFormatted = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="flex flex-col items-center justify-center p-6 rounded-3xl glass-card border border-white/10 text-center relative group">
      {/* Greeting & Date Header */}
      <div className="flex items-center gap-2 text-stone-300 text-xs sm:text-sm font-medium mb-1">
        <GreetingIcon className="w-4 h-4 text-amber-400" />
        <span>{greeting.text}, ready to focus?</span>
      </div>

      <div className="flex items-center gap-2 text-stone-400 text-xs mb-4">
        <Calendar className="w-3.5 h-3.5 text-stone-400" />
        <span>{dateFormatted}</span>
      </div>

      {/* Main Digital Clock Display */}
      <div className="flex items-baseline justify-center gap-2 my-1">
        <span className="text-5xl sm:text-7xl font-bold tracking-tight text-white font-mono-numbers drop-shadow-md">
          {timeStr}
        </span>
        {period && (
          <span className="text-xl sm:text-2xl font-bold text-amber-400 tracking-wider">
            {period}
          </span>
        )}
      </div>

      {/* Clock Formatting Controls */}
      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/10 text-xs text-stone-400">
        <button
          onClick={() => setAppSettings(prev => ({ ...prev, clockIs24Hour: !prev.clockIs24Hour }))}
          className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 transition-colors font-medium"
          aria-label="Toggle 12 or 24 hour clock format"
        >
          {appSettings.clockIs24Hour ? '24-Hour' : '12-Hour'}
        </button>

        <button
          onClick={() => setAppSettings(prev => ({ ...prev, showClockSeconds: !prev.showClockSeconds }))}
          className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 transition-colors flex items-center gap-1.5 font-medium"
          aria-label="Toggle clock seconds display"
        >
          {appSettings.showClockSeconds ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>Seconds</span>
        </button>
      </div>
    </div>
  );
}
