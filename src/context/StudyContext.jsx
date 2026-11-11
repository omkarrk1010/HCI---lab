import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { ENVIRONMENTS, DEFAULT_ENVIRONMENT_ID } from '../data/environments';
import { SOUND_TRACKS } from '../data/sounds';
import { soundEngine } from '../utils/audioEngine';
import { createSessionRecord } from '../utils/analyticsUtils';
import { useAuth } from './AuthContext';
import confetti from 'canvas-confetti';

const StudyContext = createContext(null);

const STORAGE_KEYS = {
  ENVIRONMENT: 'studyscape_env_id',
  OVERLAY: 'studyscape_overlay_opacity',
  FAVORITES: 'studyscape_favorites',
  EFFECTS: 'studyscape_effects_enabled',
  POMODORO_SETTINGS: 'studyscape_pomodoro_settings',
  DAILY_GOAL: 'studyscape_daily_goal',
  TASKS: 'studyscape_tasks',
  SESSIONS: 'studyscape_sessions',
  APP_SETTINGS: 'studyscape_app_settings',
};

export function StudyProvider({ children }) {
  const { user } = useAuth();
  const isLoadedRef = useRef(false);

  const getScopedKey = useCallback((baseKey) => {
    return user?.id ? `${baseKey}_${user.id}` : `${baseKey}_guest`;
  }, [user?.id]);

  // --- Environment & Visual Atmosphere ---
  const [currentEnvId, setCurrentEnvId] = useState(DEFAULT_ENVIRONMENT_ID);
  const [overlayOpacity, setOverlayOpacity] = useState(0.45);
  const [visualEffectsEnabled, setVisualEffectsEnabled] = useState(true);
  const [favorites, setFavorites] = useState(['cozy-cafe', 'rainy-window']);

  const currentEnvironment = ENVIRONMENTS.find(e => e.id === currentEnvId) || ENVIRONMENTS[0];

  const toggleFavorite = (envId) => {
    setFavorites(prev => 
      prev.includes(envId) ? prev.filter(id => id !== envId) : [...prev, envId]
    );
  };

  // --- App Settings ---
  const [appSettings, setAppSettings] = useState({
    clockIs24Hour: false,
    showClockSeconds: true,
    reduceMotion: false,
    theme: 'dark'
  });

  // --- Tasks State ---
  const [tasks, setTasks] = useState([]);
  const [activeTaskId, setActiveTaskId] = useState(null);

  // --- Session History & Analytics ---
  const [sessionHistory, setSessionHistory] = useState([]);
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(120);

  // --- Pomodoro Settings ---
  const [pomodoroSettings, setPomodoroSettings] = useState({
    focusMinutes: 25,
    shortBreakMinutes: 5,
    longBreakMinutes: 15,
    longBreakInterval: 4,
    autoStartBreaks: false
  });

  // Reload and isolate data per authenticated user ID
  useEffect(() => {
    const uid = user?.id;

    // Load Tasks
    const tasksKey = getScopedKey(STORAGE_KEYS.TASKS);
    const storedTasks = localStorage.getItem(tasksKey);
    if (storedTasks) {
      try {
        const parsed = JSON.parse(storedTasks);
        setTasks(parsed);
        if (parsed.length > 0) setActiveTaskId(parsed[0].id);
      } catch {
        setTasks([]);
      }
    } else {
      const defaultTasks = [
        { id: 't1_' + Date.now(), title: `Explore StudyScape focus tools (${user?.name || 'Student'})`, subject: 'General', priority: 'High', completed: false, createdAt: Date.now() },
        { id: 't2_' + Date.now(), title: 'Complete your first Pomodoro study block', subject: 'Focus', priority: 'High', completed: false, createdAt: Date.now() },
        { id: 't3_' + Date.now(), title: 'Check your study streak in Analytics', subject: 'HCI', priority: 'Medium', completed: false, createdAt: Date.now() }
      ];
      setTasks(defaultTasks);
      setActiveTaskId(defaultTasks[0].id);
      localStorage.setItem(tasksKey, JSON.stringify(defaultTasks));
    }

    // Load Sessions
    const sessionsKey = getScopedKey(STORAGE_KEYS.SESSIONS);
    const storedSessions = localStorage.getItem(sessionsKey);
    setSessionHistory(storedSessions ? JSON.parse(storedSessions) : []);

    // Load Goal
    const goalKey = getScopedKey(STORAGE_KEYS.DAILY_GOAL);
    const storedGoal = localStorage.getItem(goalKey);
    setDailyGoalMinutes(storedGoal ? parseInt(storedGoal, 10) : 120);

    // Load Pomodoro Settings
    const pomoKey = getScopedKey(STORAGE_KEYS.POMODORO_SETTINGS);
    const storedPomo = localStorage.getItem(pomoKey);
    if (storedPomo) {
      try { setPomodoroSettings(JSON.parse(storedPomo)); } catch {}
    } else {
      setPomodoroSettings({
        focusMinutes: 25,
        shortBreakMinutes: 5,
        longBreakMinutes: 15,
        longBreakInterval: 4,
        autoStartBreaks: false
      });
    }

    // Load Environment
    const envKey = getScopedKey(STORAGE_KEYS.ENVIRONMENT);
    const storedEnv = localStorage.getItem(envKey);
    if (storedEnv) setCurrentEnvId(storedEnv);

    // Load Overlay Opacity
    const overlayKey = getScopedKey(STORAGE_KEYS.OVERLAY);
    const storedOverlay = localStorage.getItem(overlayKey);
    if (storedOverlay !== null) setOverlayOpacity(parseFloat(storedOverlay));

    // Load Favorites
    const favKey = getScopedKey(STORAGE_KEYS.FAVORITES);
    const storedFavs = localStorage.getItem(favKey);
    if (storedFavs) {
      try { setFavorites(JSON.parse(storedFavs)); } catch {}
    }

    // Load App Settings
    const appKey = getScopedKey(STORAGE_KEYS.APP_SETTINGS);
    const storedApp = localStorage.getItem(appKey);
    if (storedApp) {
      try { setAppSettings(JSON.parse(storedApp)); } catch {}
    }

    isLoadedRef.current = true;
  }, [user?.id]);

  // Persist user-specific changes
  useEffect(() => {
    if (!isLoadedRef.current) return;
    localStorage.setItem(getScopedKey(STORAGE_KEYS.ENVIRONMENT), currentEnvId);
  }, [currentEnvId, user?.id]);

  useEffect(() => {
    if (!isLoadedRef.current) return;
    localStorage.setItem(getScopedKey(STORAGE_KEYS.OVERLAY), String(overlayOpacity));
  }, [overlayOpacity, user?.id]);

  useEffect(() => {
    if (!isLoadedRef.current) return;
    localStorage.setItem(getScopedKey(STORAGE_KEYS.EFFECTS), JSON.stringify(visualEffectsEnabled));
  }, [visualEffectsEnabled, user?.id]);

  useEffect(() => {
    if (!isLoadedRef.current) return;
    localStorage.setItem(getScopedKey(STORAGE_KEYS.FAVORITES), JSON.stringify(favorites));
  }, [favorites, user?.id]);

  useEffect(() => {
    if (!isLoadedRef.current) return;
    localStorage.setItem(getScopedKey(STORAGE_KEYS.APP_SETTINGS), JSON.stringify(appSettings));
  }, [appSettings, user?.id]);

  useEffect(() => {
    if (!isLoadedRef.current) return;
    localStorage.setItem(getScopedKey(STORAGE_KEYS.TASKS), JSON.stringify(tasks));
  }, [tasks, user?.id]);

  useEffect(() => {
    if (!isLoadedRef.current) return;
    localStorage.setItem(getScopedKey(STORAGE_KEYS.SESSIONS), JSON.stringify(sessionHistory));
  }, [sessionHistory, user?.id]);

  useEffect(() => {
    if (!isLoadedRef.current) return;
    localStorage.setItem(getScopedKey(STORAGE_KEYS.DAILY_GOAL), String(dailyGoalMinutes));
  }, [dailyGoalMinutes, user?.id]);

  useEffect(() => {
    if (!isLoadedRef.current) return;
    localStorage.setItem(getScopedKey(STORAGE_KEYS.POMODORO_SETTINGS), JSON.stringify(pomodoroSettings));
  }, [pomodoroSettings, user?.id]);

  const activeTask = tasks.find(t => t.id === activeTaskId) || null;

  const addTask = (title, subject = 'General', priority = 'Medium') => {
    if (!title.trim()) return;
    const newTask = {
      id: 'task_' + Date.now(),
      title: title.trim(),
      subject,
      priority,
      completed: false,
      createdAt: Date.now()
    };
    setTasks(prev => [newTask, ...prev]);
    if (!activeTaskId) setActiveTaskId(newTask.id);
  };

  const toggleTaskCompletion = (taskId) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const nextState = !t.completed;
        if (nextState) {
          try {
            confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
          } catch {}
        }
        return { ...t, completed: nextState };
      }
      return t;
    }));
  };

  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    if (activeTaskId === taskId) {
      setActiveTaskId(null);
    }
  };

  const editTask = (taskId, newTitle, newSubject, newPriority) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          title: newTitle || t.title,
          subject: newSubject || t.subject,
          priority: newPriority || t.priority
        };
      }
      return t;
    }));
  };

  const recordSession = (durationMinutes, type = 'pomodoro', phase = 'focus') => {
    const newRecord = createSessionRecord({
      type,
      phase,
      durationMinutes,
      environmentId: currentEnvId,
      environmentName: currentEnvironment.name,
      taskTitle: activeTask ? activeTask.title : 'General Study',
      subject: activeTask ? activeTask.subject : 'General'
    });

    setSessionHistory(prev => [newRecord, ...prev]);

    // Celebration feedback
    soundEngine.playCompletionChime();
    try {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {}

    return newRecord;
  };

  // --- Pomodoro Timer Engine ---
  const [pomoPhase, setPomoPhase] = useState('focus'); // 'focus' | 'shortBreak' | 'longBreak'
  const [pomoIsRunning, setPomoIsRunning] = useState(false);
  const [pomoCycleCount, setPomoCycleCount] = useState(0); // 0 to 4
  const [pomoRemainingSeconds, setPomoRemainingSeconds] = useState(2 * 60);
  const [pomoTotalSeconds, setPomoTotalSeconds] = useState(2 * 60);
  const [pomoSessionCompletionNotice, setPomoSessionCompletionNotice] = useState(null);

  // Timestamp-based accurate interval ref
  const pomoTimerRef = useRef(null);
  const pomoEndTimeRef = useRef(null);

  // Update total seconds if duration settings change and timer is not currently running
  useEffect(() => {
    if (!pomoIsRunning) {
      let duration = pomodoroSettings.focusMinutes;
      if (pomoPhase === 'shortBreak') duration = pomodoroSettings.shortBreakMinutes;
      if (pomoPhase === 'longBreak') duration = pomodoroSettings.longBreakMinutes;
      const sec = duration * 60;
      setPomoRemainingSeconds(sec);
      setPomoTotalSeconds(sec);
    }
  }, [pomodoroSettings, pomoPhase]);

  // Main Pomodoro accurate clock ticker
  useEffect(() => {
    if (pomoIsRunning) {
      pomoEndTimeRef.current = Date.now() + pomoRemainingSeconds * 1000;

      pomoTimerRef.current = setInterval(() => {
        const now = Date.now();
        const diff = Math.max(0, Math.round((pomoEndTimeRef.current - now) / 1000));
        setPomoRemainingSeconds(diff);

        if (diff <= 0) {
          clearInterval(pomoTimerRef.current);
          setPomoIsRunning(false);
          handlePomodoroCompletion();
        }
      }, 250);
    } else {
      if (pomoTimerRef.current) clearInterval(pomoTimerRef.current);
    }

    return () => {
      if (pomoTimerRef.current) clearInterval(pomoTimerRef.current);
    };
  }, [pomoIsRunning]);

  const handlePomodoroCompletion = () => {
    if (pomoPhase === 'focus') {
      const nextCycle = pomoCycleCount + 1;
      const isLong = nextCycle >= pomodoroSettings.longBreakInterval;
      const nextPhase = isLong ? 'longBreak' : 'shortBreak';
      const durationCompleted = pomodoroSettings.focusMinutes;

      recordSession(durationCompleted, 'pomodoro', 'focus');

      setPomoCycleCount(isLong ? 0 : nextCycle);
      setPomoPhase(nextPhase);

      const nextDuration = (isLong ? pomodoroSettings.longBreakMinutes : pomodoroSettings.shortBreakMinutes) * 60;
      setPomoRemainingSeconds(nextDuration);
      setPomoTotalSeconds(nextDuration);

      setPomoSessionCompletionNotice({
        title: 'Focus Session Completed!',
        message: isLong 
          ? `Outstanding! You completed 4 focus cycles. Enjoy an extended ${pomodoroSettings.longBreakMinutes}-minute long break.`
          : `Great work! Time for a well-deserved ${pomodoroSettings.shortBreakMinutes}-minute rest.`,
        nextPhase
      });

      if (pomodoroSettings.autoStartBreaks) {
        setPomoIsRunning(true);
      }
    } else {
      // Completed break
      soundEngine.playCompletionChime();
      setPomoPhase('focus');
      const focusSec = pomodoroSettings.focusMinutes * 60;
      setPomoRemainingSeconds(focusSec);
      setPomoTotalSeconds(focusSec);

      setPomoSessionCompletionNotice({
        title: 'Break Over!',
        message: 'Recharged and ready? Time to dive into your next focus block.',
        nextPhase: 'focus'
      });
    }
  };

  const startPomo = () => {
    soundEngine.playClick();
    setPomoIsRunning(true);
  };

  const pausePomo = () => {
    soundEngine.playClick();
    setPomoIsRunning(false);
  };

  const resetPomo = () => {
    soundEngine.playClick();
    setPomoIsRunning(false);
    let duration = pomodoroSettings.focusMinutes;
    if (pomoPhase === 'shortBreak') duration = pomodoroSettings.shortBreakMinutes;
    if (pomoPhase === 'longBreak') duration = pomodoroSettings.longBreakMinutes;
    const sec = duration * 60;
    setPomoRemainingSeconds(sec);
    setPomoTotalSeconds(sec);
  };

  const skipPomoPhase = () => {
    soundEngine.playClick();
    setPomoIsRunning(false);
    if (pomoPhase === 'focus') {
      const nextCycle = (pomoCycleCount + 1) % pomodoroSettings.longBreakInterval;
      const nextPhase = nextCycle === 0 ? 'longBreak' : 'shortBreak';
      setPomoCycleCount(nextCycle);
      setPomoPhase(nextPhase);
      const sec = (nextPhase === 'longBreak' ? pomodoroSettings.longBreakMinutes : pomodoroSettings.shortBreakMinutes) * 60;
      setPomoRemainingSeconds(sec);
      setPomoTotalSeconds(sec);
    } else {
      setPomoPhase('focus');
      const sec = pomodoroSettings.focusMinutes * 60;
      setPomoRemainingSeconds(sec);
      setPomoTotalSeconds(sec);
    }
  };

  // Update dynamic document title with running countdown
  useEffect(() => {
    if (pomoIsRunning) {
      const mins = Math.floor(pomoRemainingSeconds / 60);
      const secs = String(pomoRemainingSeconds % 60).padStart(2, '0');
      document.title = `${mins}:${secs} • StudyScape`;
    } else {
      document.title = 'StudyScape — Find your space. Find your focus.';
    }
  }, [pomoIsRunning, pomoRemainingSeconds]);

  // --- Countdown Timer Engine ---
  const [countdownConfig, setCountdownConfig] = useState({ hours: 0, minutes: 2, seconds: 0 });
  const [countdownRemaining, setCountdownRemaining] = useState(2 * 60);
  const [countdownTotal, setCountdownTotal] = useState(2 * 60);
  const [countdownIsRunning, setCountdownIsRunning] = useState(false);
  const countdownTimerRef = useRef(null);
  const countdownEndTimeRef = useRef(null);

  useEffect(() => {
    if (countdownIsRunning) {
      countdownEndTimeRef.current = Date.now() + countdownRemaining * 1000;
      countdownTimerRef.current = setInterval(() => {
        const now = Date.now();
        const diff = Math.max(0, Math.round((countdownEndTimeRef.current - now) / 1000));
        setCountdownRemaining(diff);

        if (diff <= 0) {
          clearInterval(countdownTimerRef.current);
          setCountdownIsRunning(false);
          soundEngine.playCompletionChime();
          const mins = Math.round(countdownTotal / 60);
          recordSession(mins, 'countdown', 'focus');
          try {
            confetti({ particleCount: 70, spread: 70 });
          } catch {}
        }
      }, 250);
    } else {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    }

    return () => {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, [countdownIsRunning]);

  const startCountdown = () => {
    soundEngine.playClick();
    setCountdownIsRunning(true);
  };
  const pauseCountdown = () => {
    soundEngine.playClick();
    setCountdownIsRunning(false);
  };
  const resetCountdown = () => {
    soundEngine.playClick();
    setCountdownIsRunning(false);
    setCountdownRemaining(countdownTotal);
  };
  const setCountdownTime = (h, m, s) => {
    const totalSec = h * 3600 + m * 60 + s;
    if (totalSec <= 0) return false;
    setCountdownConfig({ hours: h, minutes: m, seconds: s });
    setCountdownTotal(totalSec);
    setCountdownRemaining(totalSec);
    setCountdownIsRunning(false);
    return true;
  };

  // --- Audio Mixer State ---
  const [activeSounds, setActiveSounds] = useState([]);
  const [masterVolume, setMasterVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [trackVolumes, setTrackVolumes] = useState(() => {
    const map = {};
    SOUND_TRACKS.forEach(t => { map[t.id] = t.defaultVolume; });
    return map;
  });

  const toggleSound = (soundId) => {
    soundEngine.playClick();
    const isActive = activeSounds.includes(soundId);
    if (isActive) {
      soundEngine.stopTrack(soundId);
      setActiveSounds(prev => prev.filter(id => id !== soundId));
    } else {
      soundEngine.startTrack(soundId);
      setActiveSounds(prev => [...prev, soundId]);
    }
  };

  const handleMasterVolumeChange = (vol) => {
    setMasterVolume(vol);
    soundEngine.setMasterVolume(vol);
    if (isMuted && vol > 0) {
      setIsMuted(false);
      soundEngine.setMute(false);
    }
  };

  const handleTrackVolumeChange = (trackId, vol) => {
    setTrackVolumes(prev => ({ ...prev, [trackId]: vol }));
    soundEngine.setTrackVolume(trackId, vol);
  };

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundEngine.setMute(next);
  };

  // --- Active Navigation Tab ---
  const [currentTab, setCurrentTab] = useState('dashboard'); // 'dashboard' | 'focus' | 'analytics' | 'environments' | 'hci' | 'settings'

  // --- HCI Interactive Demonstration Mode Highlight Tracker ---
  const [hciDemoState, setHciDemoState] = useState({
    activePrincipleId: null,
    highlightElementId: null,
    stepIndex: 0,
    explanatoryCallout: null
  });

  return (
    <StudyContext.Provider value={{
      // Environment
      environments: ENVIRONMENTS,
      currentEnvironment,
      currentEnvId,
      setCurrentEnvId,
      overlayOpacity,
      setOverlayOpacity,
      visualEffectsEnabled,
      setVisualEffectsEnabled,
      favorites,
      toggleFavorite,

      // App Settings
      appSettings,
      setAppSettings,

      // Navigation
      currentTab,
      setCurrentTab,

      // Tasks
      tasks,
      activeTaskId,
      activeTask,
      setActiveTaskId,
      addTask,
      toggleTaskCompletion,
      deleteTask,
      editTask,

      // Analytics & Sessions
      sessionHistory,
      setSessionHistory,
      dailyGoalMinutes,
      setDailyGoalMinutes,
      recordSession,

      // Pomodoro Timer
      pomoPhase,
      setPomoPhase,
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

      // Countdown Timer
      countdownConfig,
      countdownRemaining,
      countdownTotal,
      countdownIsRunning,
      startCountdown,
      pauseCountdown,
      resetCountdown,
      setCountdownTime,

      // Audio
      soundTracks: SOUND_TRACKS,
      activeSounds,
      masterVolume,
      isMuted,
      trackVolumes,
      toggleSound,
      handleMasterVolumeChange,
      handleTrackVolumeChange,
      toggleMute,

      // HCI Demo
      hciDemoState,
      setHciDemoState
    }}>
      {children}
    </StudyContext.Provider>
  );
}

export function useStudy() {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error('useStudy must be used within a StudyProvider');
  }
  return context;
}
