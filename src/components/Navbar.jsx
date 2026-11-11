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
  ShieldCheck,
  ChevronDown
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
    hciDemoState
  } = useStudy();

  const { user, logout, authProviderType } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBrightnessPopover, setShowBrightnessPopover] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  // Close user profile dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

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
    { id: 'environments', label: 'Environments', icon: Compass },
    { id: 'hci', label: 'HCI Lab', icon: GraduationCap },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (tabId) => {
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
  };

  const isAudioActive = activeSounds.length > 0 && !isMuted;

  return (
    <header className="sticky top-0 z-40 w-full px-4 sm:px-6 py-3 transition-all">
      <div className="max-w-7xl mx-auto rounded-2xl glass-panel px-4 sm:px-6 py-2.5 flex items-center justify-between border border-white/10 shadow-xl">
        {/* Brand Logo & Tagline */}
        <div
          onClick={() => handleNavClick('dashboard')}
          className="flex items-center gap-3 cursor-pointer group"
          role="button"
          tabIndex={0}
          aria-label="Go to Study Room"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-stone-900" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white group-hover:text-amber-200 transition-colors">
              StudyScape
            </span>

          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1.5" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            const isHighlighted = hciDemoState.highlightElementId === `nav-${item.id}`;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all duration-200 ${isActive
                  ? 'bg-white/15 text-white shadow-inner border border-white/15'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
                  } ${isHighlighted ? 'hci-highlight ring-2 ring-amber-400' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-stone-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.2 text-[9px] font-bold uppercase rounded bg-amber-500/25 text-amber-300">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Quick Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active Environment Pill */}
          <button
            onClick={() => handleNavClick('environments')}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-900/60 hover:bg-stone-800/80 border border-white/10 text-xs font-medium text-stone-200 transition-all hover:scale-102"
            title="Switch Study Environment"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="truncate max-w-[110px]">{currentEnvironment.name}</span>
          </button>

          {/* Quick Overlay Brightness Slider Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowBrightnessPopover(!showBrightnessPopover)}
              className={`p-2 rounded-xl border transition-all ${showBrightnessPopover
                ? 'bg-white/20 text-white border-white/30'
                : 'bg-stone-900/60 text-stone-300 border-white/10 hover:text-white hover:bg-stone-800'
                }`}
              title="Adjust Room Dimming / Brightness"
              aria-label="Room overlay dimming"
            >
              <Sliders className="w-4 h-4" />
            </button>

            {showBrightnessPopover && (
              <div className="absolute right-0 mt-2 w-56 p-3 rounded-2xl glass-panel shadow-2xl z-50 border border-white/15 animate-fadeIn">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-stone-200">Atmosphere Dimmer</span>
                  <span className="text-xs text-amber-300 font-mono-numbers">
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
                <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                  <span>Bright</span>
                  <span>Cozy Dark</span>
                </div>
              </div>
            )}
          </div>

          {/* Audio Quick Button */}
          <button
            onClick={onOpenAudioMixer}
            className={`flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${isAudioActive
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-lg shadow-amber-500/10'
              : 'bg-stone-900/60 text-stone-300 border-white/10 hover:text-white hover:bg-stone-800'
              }`}
            title="Open Ambient Audio Mixer"
            aria-label="Ambient sound mixer"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-stone-400" />
            ) : (
              <Volume2 className={`w-4 h-4 ${isAudioActive ? 'text-amber-400' : 'text-stone-300'}`} />
            )}
            <span className="hidden sm:inline">
              {activeSounds.length > 0 ? `${activeSounds.length} Sound${activeSounds.length > 1 ? 's' : ''}` : 'Ambience'}
            </span>
          </button>

          {/* User Profile Pill & Dropdown */}
          {user && (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-2xl border transition-all duration-200 select-none ${showUserMenu
                  ? 'bg-amber-500/20 border-amber-500/40 text-white ring-2 ring-amber-400/20 shadow-lg shadow-amber-500/10'
                  : 'bg-stone-900/70 border-white/10 text-stone-200 hover:text-white hover:bg-stone-800/80 hover:border-white/20 shadow-md'
                  }`}
                title={`Account: ${displayName} (${user?.email})`}
                aria-label="User profile and account menu"
                aria-expanded={showUserMenu}
              >
                {/* Proper Profile Avatar Circle */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-stone-800 to-stone-900 border border-amber-400/40 text-amber-300 flex items-center justify-center font-bold text-xs tracking-wider shadow-inner ring-1 ring-white/10 shrink-0">
                  {getInitials(user?.name, user?.email)}
                </div>

                {/* Name Beside Avatar (Title Cased) */}
                <span className="text-xs font-bold text-white max-w-[120px] sm:max-w-[140px] truncate leading-tight">
                  {displayName}
                </span>

                <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 ${showUserMenu ? 'rotate-180 text-amber-300' : ''}`} />
              </button>

              {/* Small Dropdown Menu with Profile, Settings, and Logout */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 p-3 rounded-2xl glass-panel shadow-2xl z-50 border border-white/15 animate-fadeIn">
                  {/* User Profile Info Header */}
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-stone-800 to-stone-900 border border-amber-400/40 text-amber-300 flex items-center justify-center font-black text-xs shadow-md shrink-0">
                      {getInitials(user?.name, user?.email)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-white truncate">{displayName}</div>
                      <div className="text-[11px] text-stone-400 truncate">{user?.email}</div>
                    </div>
                  </div>

                  {/* Dropdown Options: Profile, Settings, Logout */}
                  <div className="space-y-1 text-xs">
                    {/* 1. Profile Option */}
                    <button
                      onClick={() => {
                        setCurrentTab('settings');
                        setShowUserMenu(false);
                      }}
                      className="w-full px-3 py-2 rounded-xl hover:bg-white/10 text-stone-200 hover:text-white flex items-center gap-2.5 text-left font-medium transition-colors"
                    >
                      <User className="w-4 h-4 text-amber-400" />
                      <div className="flex-1">
                        <span className="block font-semibold">Profile</span>
                        <span className="block text-[10px] text-stone-400">View account & storage key</span>
                      </div>
                    </button>

                    {/* 2. Settings Option */}
                    <button
                      onClick={() => {
                        setCurrentTab('settings');
                        setShowUserMenu(false);
                      }}
                      className="w-full px-3 py-2 rounded-xl hover:bg-white/10 text-stone-200 hover:text-white flex items-center gap-2.5 text-left font-medium transition-colors"
                    >
                      <Settings className="w-4 h-4 text-amber-400" />
                      <div className="flex-1">
                        <span className="block font-semibold">Settings</span>
                        <span className="block text-[10px] text-stone-400">Timers & ergonomic preferences</span>
                      </div>
                    </button>
                  </div>

                  {/* 3. Logout Option */}
                  <div className="pt-2 mt-2 border-t border-white/10">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 hover:text-rose-200 border border-rose-500/30 flex items-center gap-2.5 text-xs font-bold transition-all justify-center"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout of StudyScape</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-stone-900/60 text-stone-200 border border-white/10"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 p-4 rounded-2xl glass-panel border border-white/15 shadow-2xl animate-fadeIn space-y-3">
          {user && (
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-stone-800 to-stone-900 border border-amber-400/40 text-amber-300 flex items-center justify-center font-bold text-xs shadow-md shrink-0">
                  {getInitials(user?.name, user?.email)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white truncate">{displayName}</div>
                  <div className="text-[10px] text-stone-400 truncate">{user?.email}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                <button
                  onClick={() => {
                    setCurrentTab('settings');
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-200 text-xs font-semibold flex items-center gap-2 justify-center"
                >
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-2 justify-center"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`p-3 rounded-xl text-left text-xs font-bold flex items-center gap-2.5 transition-all ${isActive
                    ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40'
                    : 'bg-white/5 text-stone-300 hover:bg-white/10 hover:text-white'
                    }`}
                >
                  <Icon className="w-4 h-4 text-amber-400" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
