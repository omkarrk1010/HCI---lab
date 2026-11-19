import React, { useState, useRef, useEffect } from 'react';
import { useStudy } from '../context/StudyContext';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Clock,
  BarChart3,
  Compass,
  GraduationCap,
  Settings,
  Volume2,
  VolumeX,
  Sliders,
  Menu,
  X,
  Target,
  LogOut,
  User,
  Hourglass,
  Fingerprint,
  Moon,
  Sun
} from 'lucide-react';

export function Navbar({ onOpenAudioMixer }) {
  const {
    currentTab,
    setCurrentTab,
    currentEnvironment,
    activeSounds,
    isMuted,
    toggleMute,
    overlayOpacity,
    setOverlayOpacity,
    hciDemoState,
    appSettings,
    toggleDarkMode
  } = useStudy();

  const isDark = appSettings.theme === 'dark';

  const { user, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const drawerRef = useRef(null);

  // Close the drawer on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const getInitials = (name, email) => {
    if (name && typeof name === 'string' && name.trim()) {
      const parts = name.trim().split(/\s+/);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return parts[0].slice(0, 2).toUpperCase();
    }
    if (email && typeof email === 'string' && email.trim()) {
      return email.trim().slice(0, 2).toUpperCase();
    }
    return 'SS';
  };

  const formatName = (str) => {
    if (!str || typeof str !== 'string') return 'User';
    return str
      .trim()
      .split(/\s+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  };

  const rawName = user?.name || user?.email?.split('@')[0] || 'User';
  const displayName = formatName(rawName);

  const navItems = [
    { id: 'dashboard', label: 'Study Room', icon: Clock },
    { id: 'focus', label: 'Focus Sessions', icon: Target },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'procrastination', label: 'Procrastination AI', icon: Hourglass },
    { id: 'personality', label: 'Study Personality', icon: Fingerprint },
    { id: 'environments', label: 'Environments', icon: Compass },
    { id: 'hci', label: 'HCI Lab', icon: GraduationCap },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (tabId) => {
    setCurrentTab(tabId);
    setMenuOpen(false);
  };

  const isAudioActive = activeSounds.length > 0 && !isMuted;

  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-6 py-3">
      {/* Minimal Top Bar */}
      <div className="max-w-7xl mx-auto rounded-2xl glass-panel px-3 sm:px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {/* Hamburger Menu Trigger */}
          <button
            onClick={() => setMenuOpen(true)}
            className="p-2.5 rounded-xl bg-stone-900/5 text-stone-700 hover:text-stone-900 hover:bg-stone-900/10 transition-colors"
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Brand */}
          <button
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-2.5 group"
            aria-label="Go to Study Room"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-stone-50" />
            </div>
            <span className="font-extrabold text-base sm:text-lg tracking-tight text-stone-800 hidden sm:inline">
              StudyScape
            </span>
          </button>
        </div>

        {/* Right Quick Controls — kept minimal */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-xl bg-stone-900/5 text-stone-600 hover:bg-stone-900/10 hover:text-stone-900 transition-colors"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenAudioMixer}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              isAudioActive
                ? 'bg-amber-200/50 text-amber-700 border-amber-300/60'
                : 'bg-stone-900/5 text-stone-600 border-transparent hover:bg-stone-900/10'
            }`}
            title="Open Ambient Audio Mixer"
            aria-label="Ambient sound mixer"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-stone-400" />
            ) : (
              <Volume2 className={`w-4 h-4 ${isAudioActive ? 'text-amber-600' : 'text-stone-500'}`} />
            )}
            <span className="hidden sm:inline">
              {activeSounds.length > 0 ? `${activeSounds.length}` : ''}
            </span>
          </button>

          {user && (
            <button
              onClick={() => setMenuOpen(true)}
              className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-50 to-amber-100 border border-amber-300/50 text-amber-700 flex items-center justify-center font-bold text-xs shrink-0"
              title={`Account: ${displayName}`}
              aria-label="Open account menu"
            >
              {getInitials(user?.name, user?.email)}
            </button>
          )}
        </div>
      </div>

      {/* Scrim */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-stone-900/20 backdrop-blur-sm z-40 animate-fadeIn"
          aria-hidden="true"
        />
      )}

      {/* Slide-in Navigation Drawer */}
      <aside
        ref={drawerRef}
        className={`fixed top-0 left-0 h-full w-[85vw] max-w-[320px] z-50 glass-panel-light rounded-none sm:rounded-r-3xl flex flex-col transition-transform duration-300 ease-out ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-hidden={!menuOpen}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-900/6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4 text-stone-50" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-stone-800">StudyScape</span>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            className="p-2 rounded-xl bg-stone-900/5 text-stone-600 hover:bg-stone-900/10"
            aria-label="Close navigation menu"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* User Card */}
        {user && (
          <div className="p-4 pb-2">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-stone-900/4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-50 to-amber-100 border border-amber-300/50 text-amber-700 flex items-center justify-center font-bold text-xs shrink-0">
                {getInitials(user?.name, user?.email)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-stone-800 truncate">{displayName}</div>
                <div className="text-[11px] text-stone-500 truncate">{user?.email}</div>
              </div>
            </div>
          </div>
        )}

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            const isHighlighted = hciDemoState.highlightElementId === `nav-${item.id}`;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-3 transition-all ${
                  isActive
                    ? 'bg-amber-200/50 text-amber-800'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-900/5'
                } ${isHighlighted ? 'hci-highlight ring-2 ring-amber-400' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-amber-600' : 'text-stone-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Dark Mode Toggle */}
        <div className="px-4 pt-3">
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-stone-900/4 hover:bg-stone-900/8 transition-colors"
          >
            <span className="text-xs font-semibold text-stone-600 flex items-center gap-2.5">
              {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-stone-400" />}
              <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            </span>
            <span className={`w-10 h-6 rounded-full p-1 transition-colors ${isDark ? 'bg-amber-500' : 'bg-stone-300'}`}>
              <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${isDark ? 'translate-x-4' : 'translate-x-0'}`} />
            </span>
          </button>
        </div>

        {/* Atmosphere Dimmer */}
        <div className="px-4 py-3 border-t border-stone-900/6">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[11px] font-bold text-stone-500 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              Atmosphere
            </span>
            <span className="text-[11px] text-amber-600 font-mono-numbers">
              {Math.round((1 - overlayOpacity) * 100)}% Light
            </span>
          </div>
          <input
            type="range"
            min="0.1"
            max="0.85"
            step="0.05"
            value={overlayOpacity}
            onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
            aria-label="Adjust background overlay opacity"
          />
          <p className="text-[11px] text-stone-400 mt-1 truncate">{currentEnvironment.name}</p>
        </div>

        {/* Logout */}
        {user && (
          <div className="p-4 pt-2">
            <button
              onClick={() => {
                setMenuOpen(false);
                logout();
              }}
              className="w-full px-3 py-2.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-600 flex items-center gap-2.5 text-xs font-bold transition-all justify-center"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout of StudyScape</span>
            </button>
          </div>
        )}
      </aside>
    </header>
  );
}
