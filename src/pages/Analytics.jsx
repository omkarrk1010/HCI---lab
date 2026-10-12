import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { FocusStats } from '../components/FocusStats';
import { ProgressChart } from '../components/ProgressChart';
import { 
  BarChart3, 
  Calendar, 
  Clock, 
  Flame, 
  Compass, 
  Filter, 
  Trash2, 
  Sparkles,
  TrendingUp,
  Download
} from 'lucide-react';

export function Analytics() {
  const { 
    sessionHistory, 
    setSessionHistory, 
    dailyGoalMinutes, 
    setDailyGoalMinutes, 
    recordSession,
    currentEnvironment 
  } = useStudy();

  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('all');

  const filteredHistory = sessionHistory.filter(s => {
    if (selectedSubjectFilter === 'all') return true;
    return s.subject === selectedSubjectFilter;
  });

  const subjects = ['all', ...Array.from(new Set(sessionHistory.map(s => s.subject || 'General')))];

  const handleAddSampleSession = () => {
    recordSession(25, 'pomodoro', 'focus');
  };

  const handleClearHistory = () => {
    if (window.confirm('Clear all session history records?')) {
      setSessionHistory([]);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Study Performance & Habit Tracking
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Study Analytics & History
          </h1>
          <p className="text-xs text-stone-300">
            Real session logging stored privately in your browser's local storage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAddSampleSession}
            className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all"
            title="Log a sample 25-minute completed session to inspect charts"
          >
            + Log 25m Focus Session
          </button>
          {sessionHistory.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-stone-400 hover:text-rose-400 transition-colors"
              title="Reset history"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Today's Metrics Summary */}
      <FocusStats />

      {/* Weekly Progress Bar Chart */}
      <ProgressChart 
        sessionHistory={sessionHistory} 
        dailyGoalMinutes={dailyGoalMinutes} 
      />

      {/* Session History Log Table */}
      <section className="p-6 rounded-3xl glass-card border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Session Log History</span>
              <span className="text-xs font-mono-numbers text-stone-400">
                ({filteredHistory.length} recorded)
              </span>
            </h3>
            <p className="text-xs text-stone-400">
              Chronological log of verified focus intervals and countdowns
            </p>
          </div>

          {/* Subject Filter */}
          {subjects.length > 1 && (
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-stone-400" />
              <select
                value={selectedSubjectFilter}
                onChange={(e) => setSelectedSubjectFilter(e.target.value)}
                className="bg-stone-900 border border-white/15 text-stone-200 text-xs rounded-xl px-2.5 py-1.5 cursor-pointer"
              >
                {subjects.map(s => (
                  <option key={s} value={s}>
                    {s === 'all' ? 'All Subjects' : s}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Empty State vs Table */}
        {filteredHistory.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-stone-400">
              <Clock className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-white">No Sessions Logged Yet</h4>
            <p className="text-xs text-stone-400 max-w-sm">
              Complete your first Pomodoro session or Countdown timer in the Study Room to generate authentic study statistics.
            </p>
            <button
              onClick={handleAddSampleSession}
              className="mt-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all"
            >
              Simulate A Completed Session
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-300">
              <thead>
                <tr className="border-b border-white/10 text-[11px] font-bold uppercase text-stone-400">
                  <th className="py-3 px-3">Date & Time</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Duration</th>
                  <th className="py-3 px-3">Task & Subject</th>
                  <th className="py-3 px-3">Environment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium">
                {filteredHistory.map((sess) => {
                  const dateObj = new Date(sess.timestamp);
                  const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  const timeStr = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

                  return (
                    <tr key={sess.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-3 font-mono-numbers">
                        <span className="text-white block">{dateStr}</span>
                        <span className="text-[10px] text-stone-500">{timeStr}</span>
                      </td>

                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          sess.type === 'pomodoro'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                        }`}>
                          {sess.type === 'pomodoro' ? 'Pomodoro' : 'Countdown'}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-bold text-white font-mono-numbers">
                          {sess.durationMinutes} min
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <span className="text-stone-200 block truncate max-w-xs">{sess.taskTitle}</span>
                        <span className="text-[10px] text-amber-400/80 uppercase font-semibold">
                          {sess.subject}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <span className="text-stone-300 flex items-center gap-1.5">
                          <Compass className="w-3.5 h-3.5 text-stone-400" />
                          <span>{sess.environmentName}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
