export function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function computeDailyStats(sessionHistory = [], tasks = []) {
  const todayKey = getTodayKey();
  
  // Filter sessions that occurred today
  const todaySessions = sessionHistory.filter(session => {
    if (!session.timestamp) return false;
    const sessionDate = new Date(session.timestamp);
    const key = `${sessionDate.getFullYear()}-${String(sessionDate.getMonth() + 1).padStart(2, '0')}-${String(sessionDate.getDate()).padStart(2, '0')}`;
    return key === todayKey;
  });

  const totalMinutes = todaySessions.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);
  const pomodoroCount = todaySessions.filter(s => s.type === 'pomodoro' && s.phase === 'focus').length;
  const completedTasksToday = tasks.filter(t => t.completed).length;

  return {
    todayMinutes: Math.round(totalMinutes),
    pomodoroCount,
    completedTasksCount: completedTasksToday,
    todaySessionsCount: todaySessions.length
  };
}

export function getWeeklyChartData(sessionHistory = []) {
  const days = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

    const daySessions = sessionHistory.filter(s => {
      if (!s.timestamp) return false;
      const sessionDate = new Date(s.timestamp);
      const sessionKey = `${sessionDate.getFullYear()}-${String(sessionDate.getMonth() + 1).padStart(2, '0')}-${String(sessionDate.getDate()).padStart(2, '0')}`;
      return sessionKey === key;
    });

    const dayMinutes = daySessions.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);

    days.push({
      dateKey: key,
      dayName,
      minutes: Math.round(dayMinutes),
      sessionsCount: daySessions.length,
      isToday: i === 0
    });
  }

  return days;
}

// --- AI Procrastination Analysis ---------------------------------------
// Rule-based heuristics over locally-stored tasks & sessions — no network
// calls, no external model — framed as "AI insights" for the dashboard.
export function computeProcrastinationInsights(tasks = [], sessionHistory = []) {
  const now = Date.now();
  const DAY = 24 * 60 * 60 * 1000;

  const pending = tasks.filter(t => !t.completed);
  const completed = tasks.filter(t => t.completed && t.completedAt);

  const pendingAges = pending.map(t => (now - (t.createdAt || now)) / DAY);
  const avgPendingAgeDays = pendingAges.length
    ? pendingAges.reduce((a, b) => a + b, 0) / pendingAges.length
    : 0;

  const staleTasks = pending
    .map(t => ({ ...t, ageDays: (now - (t.createdAt || now)) / DAY }))
    .filter(t => t.ageDays >= 1)
    .sort((a, b) => b.ageDays - a.ageDays);

  const lagDays = completed.map(t => (t.completedAt - t.createdAt) / DAY);
  const avgCompletionLagDays = lagDays.length
    ? lagDays.reduce((a, b) => a + b, 0) / lagDays.length
    : 0;

  const highPriorityPendingCount = pending.filter(t => t.priority === 'High').length;

  const lastSessionTs = sessionHistory.length
    ? Math.max(...sessionHistory.map(s => new Date(s.timestamp).getTime()))
    : null;
  const inactivityDays = lastSessionTs ? (now - lastSessionTs) / DAY : null;

  const totalTasks = tasks.length;
  const completionRatio = totalTasks ? completed.length / totalTasks : 0;

  // Last-7-days activity, used to spot "cram" clustering vs. steady pacing
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now - (6 - i) * DAY);
    const key = d.toISOString().slice(0, 10);
    const count = sessionHistory.filter(s => (s.timestamp || '').slice(0, 10) === key).length;
    return { key, label: d.toLocaleDateString('en-US', { weekday: 'short' }), count };
  });
  const activeDaysLast7 = last7.filter(d => d.count > 0).length;

  // Composite score 0-100, higher = stronger procrastination signal
  let score = 0;
  score += Math.min(35, avgPendingAgeDays * 5);
  score += Math.min(20, avgCompletionLagDays * 4);
  score += Math.min(20, highPriorityPendingCount * 7);
  score += Math.min(15, (inactivityDays || 0) * 5);
  score += Math.min(10, (1 - activeDaysLast7 / 7) * 10);
  score = Math.round(Math.min(100, score));

  const level = score < 30 ? 'Low' : score < 60 ? 'Moderate' : 'High';

  const insights = [];
  if (staleTasks.length > 0) {
    insights.push(`${staleTasks.length} task${staleTasks.length > 1 ? 's' : ''} have sat untouched for a day or more — the longest is "${staleTasks[0].title}" at ${Math.round(staleTasks[0].ageDays)}d old.`);
  }
  if (highPriorityPendingCount > 0) {
    insights.push(`${highPriorityPendingCount} high-priority task${highPriorityPendingCount > 1 ? 's are' : ' is'} still open — these are the most common source of last-minute cramming.`);
  }
  if (inactivityDays !== null && inactivityDays >= 1) {
    insights.push(`It's been ${Math.round(inactivityDays)} day${Math.round(inactivityDays) !== 1 ? 's' : ''} since your last recorded session — momentum tends to fade after a 2-day gap.`);
  }
  if (activeDaysLast7 <= 2 && sessionHistory.length > 0) {
    insights.push(`Only ${activeDaysLast7}/7 days had any focus activity this week, suggesting work is being pushed into short bursts.`);
  }
  if (avgCompletionLagDays > 2) {
    insights.push(`Completed tasks took an average of ${avgCompletionLagDays.toFixed(1)} days from creation to completion.`);
  }
  if (insights.length === 0) {
    insights.push('No strong procrastination signals detected — tasks are being started and finished close to when they were created.');
  }

  return {
    score,
    level,
    avgPendingAgeDays,
    avgCompletionLagDays,
    highPriorityPendingCount,
    inactivityDays,
    completionRatio,
    staleTasks: staleTasks.slice(0, 5),
    last7,
    activeDaysLast7,
    insights
  };
}

// --- AI Study Personality Analysis --------------------------------------
export function computeStudyPersonality(sessionHistory = [], tasks = []) {
  const focusSessions = sessionHistory.filter(s => s.phase === 'focus' || s.type === 'countdown');

  if (focusSessions.length === 0) {
    return {
      ready: false,
      archetype: 'The Blank Canvas',
      tagline: 'Complete a few focus sessions to unlock your personality profile.',
      traits: { consistency: 0, depth: 0, variety: 0, discipline: 0, nightOwl: 50 },
      summary: []
    };
  }

  const hours = focusSessions.map(s => new Date(s.timestamp).getHours());
  const avgHour = hours.reduce((a, b) => a + b, 0) / hours.length;
  const nightOwl = Math.round(Math.min(100, Math.max(0, ((avgHour - 6) / 18) * 100)));

  const durations = focusSessions.map(s => s.durationMinutes || 0);
  const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
  const depth = Math.round(Math.min(100, (avgDuration / 50) * 100));

  const days = new Set(focusSessions.map(s => (s.timestamp || '').slice(0, 10)));
  const span = Math.max(1, (Date.now() - new Date(focusSessions[focusSessions.length - 1].timestamp).getTime()) / (24 * 60 * 60 * 1000));
  const consistency = Math.round(Math.min(100, (days.size / Math.min(14, Math.ceil(span) + 1)) * 100));

  const environments = new Set(focusSessions.map(s => s.environmentId));
  const variety = Math.round(Math.min(100, (environments.size / 4) * 100));

  const completedTasks = tasks.filter(t => t.completed).length;
  const discipline = Math.round(Math.min(100, tasks.length ? (completedTasks / tasks.length) * 100 : 0));

  const isNight = nightOwl >= 55;
  const isDeep = depth >= 55;
  const isConsistent = consistency >= 55;

  let archetype, tagline;
  if (isNight && isDeep) {
    archetype = 'The Night Owl Deep-Diver';
    tagline = 'You come alive after dark and lock into long, uninterrupted focus blocks.';
  } else if (isNight && !isDeep) {
    archetype = 'The Midnight Sprinter';
    tagline = 'Short, sharp bursts of focus late in the day keep you moving.';
  } else if (!isNight && isDeep) {
    archetype = 'The Early Bird Marathoner';
    tagline = 'You front-load your day with deep, sustained study sessions.';
  } else {
    archetype = 'The Daylight Sprinter';
    tagline = 'Quick, frequent sessions earlier in the day are your rhythm.';
  }
  if (isConsistent && !isDeep && !isNight) {
    archetype = 'The Steady Riser';
    tagline = 'Short daytime sessions, done consistently — slow and steady wins.';
  }

  const summary = [
    `Average session time: ${avgHour < 12 ? `${Math.round(avgHour)}am` : `${Math.round(avgHour) - 12 || 12}pm`} — you lean ${nightOwl >= 55 ? 'night owl' : 'early bird'}.`,
    `Typical focus block: ${Math.round(avgDuration)} minutes.`,
    `Active on ${days.size} distinct day${days.size !== 1 ? 's' : ''} recently.`,
    `Studied in ${environments.size} different environment${environments.size !== 1 ? 's' : ''}.`
  ];

  return {
    ready: true,
    archetype,
    tagline,
    traits: { consistency, depth, variety, discipline, nightOwl },
    summary
  };
}

export function createSessionRecord({
  type = 'pomodoro',
  phase = 'focus',
  durationMinutes = 25,
  environmentId = 'cozy-cafe',
  environmentName = 'Cozy Café',
  taskTitle = null,
  subject = 'General'
}) {
  return {
    id: 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
    timestamp: new Date().toISOString(),
    type,
    phase,
    durationMinutes: Math.max(1, Math.round(durationMinutes)),
    environmentId,
    environmentName,
    taskTitle: taskTitle || 'Independent Focus Session',
    subject: subject || 'General'
  };
}
