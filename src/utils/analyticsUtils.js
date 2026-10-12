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
