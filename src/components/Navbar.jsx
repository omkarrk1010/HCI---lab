import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
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
  Target
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

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBrightnessPopover, setShowBrightnessPopover] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Study Room', icon: Clock },
    { id: 'focus', label: 'Focus Sessions', icon: Target },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'environments', label: 'Environments', icon: Compass },
    { id: 'hci', label: 'HCI Lab', icon: GraduationCap, badge: 'Academic' },
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
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white group-hover:text-amber-200 transition-colors">
                StudyScape
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                HCI Edition
              </span>
            </div>
            <span className="text-[11px] text-stone-400 hidden md:block">
              Find your space. Find your focus.
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
                className={`relative px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all duration-200 ${
                  isActive
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
              className={`p-2 rounded-xl border transition-all ${
                showBrightnessPopover
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
            className={`flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              isAudioActive
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
        <div className="lg:hidden mt-2 p-4 rounded-2xl glass-panel border border-white/15 shadow-2xl animate-fadeIn">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`p-3 rounded-xl text-left text-xs font-bold flex items-center gap-2.5 transition-all ${
                    isActive
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
