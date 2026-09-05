import React from 'react';
import {
  Bell,
  Sliders,
  HelpCircle,
  Clock,
  Layers,
  Sparkles,
  LayoutGrid
} from 'lucide-react';
import { Language, translations } from '../../utils/translations';

export type DashboardMode = 'control_room' | 'passenger' | 'station_board';

interface GlobalHeaderProps {
  currentMode: DashboardMode;
  onModeChange: (mode: DashboardMode) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenAccessibility: () => void;
  onOpenNotifications: () => void;
  onOpenHelp: () => void;
  onOpenComponentLibrary: () => void;
  currentTime: string;
  unreadAlertCount: number;
}

export const GlobalHeader: React.FC<GlobalHeaderProps> = ({
  currentMode,
  onModeChange,
  language,
  onLanguageChange,
  onOpenAccessibility,
  onOpenNotifications,
  onOpenHelp,
  onOpenComponentLibrary,
  currentTime,
  unreadAlertCount,
}) => {
  const t = translations[language];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Brand Identity & Government-Style Emblem */}
        <div className="flex items-center gap-3">
          {/* Neutral TrackPulse Geometric Railway Emblem */}
          <div className="w-10 h-10 rounded-md bg-gov-900 flex items-center justify-center text-white shadow-inner flex-shrink-0">
            <svg
              viewBox="0 0 32 32"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 text-blue-200"
            >
              {/* Concentric Outer Wheel */}
              <circle cx="16" cy="16" r="13" />
              {/* Dual Parallel Tracks */}
              <line x1="12" y1="3" x2="12" y2="29" />
              <line x1="20" y1="3" x2="20" y2="29" />
              {/* Sleepers */}
              <line x1="10" y1="8" x2="22" y2="8" />
              <line x1="8" y1="16" x2="24" y2="16" />
              <line x1="10" y1="24" x2="22" y2="24" />
              {/* Center Hub */}
              <circle cx="16" cy="16" r="2.5" fill="#60A5FA" />
            </svg>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-tight text-gov-900 leading-none">
                {t.appName}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-gov-50 text-gov-800 border border-gov-200 rounded">
                IR Ops v1.0
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium tracking-tight mt-0.5">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Center: Prominent Segmented Dashboard Switcher */}
        <div className="flex items-center bg-slate-200/80 p-1 rounded-lg border border-slate-300 order-3 md:order-2 shadow-inner">
          <button
            onClick={() => onModeChange('control_room')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-bold tracking-wide uppercase transition-all flex items-center gap-1.5 ${
              currentMode === 'control_room'
                ? 'gov-switcher-active'
                : 'gov-switcher-inactive'
            }`}
            id="btn-switch-control-room"
          >
            <Layers className="w-3.5 h-3.5" />
            {t.controlRoom}
          </button>

          <button
            onClick={() => onModeChange('passenger')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-bold tracking-wide uppercase transition-all flex items-center gap-1.5 ${
              currentMode === 'passenger'
                ? 'gov-switcher-active'
                : 'gov-switcher-inactive'
            }`}
            id="btn-switch-passenger"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            {t.passenger}
          </button>

          <button
            onClick={() => onModeChange('station_board')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-bold tracking-wide uppercase transition-all flex items-center gap-1.5 ${
              currentMode === 'station_board'
                ? 'gov-switcher-active'
                : 'gov-switcher-inactive'
            }`}
            id="btn-switch-station-board"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            {t.stationBoard}
          </button>
        </div>

        {/* Right: Operational Clock, Language & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 order-2 md:order-3">
          
          {/* Live System Time */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-mono font-medium text-slate-700">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="num-tabular font-bold">{currentTime}</span>
          </div>

          {/* Language Selector Segmented Buttons */}
          <div className="flex items-center bg-slate-100 rounded border border-slate-200 p-0.5 text-xs font-medium">
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-0.5 rounded ${language === 'en' ? 'bg-white font-bold text-gov-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              title="English"
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('ta')}
              className={`px-2 py-0.5 rounded ${language === 'ta' ? 'bg-white font-bold text-gov-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              title="தமிழ்"
            >
              தமிழ்
            </button>
            <button
              onClick={() => onLanguageChange('hi')}
              className={`px-2 py-0.5 rounded ${language === 'hi' ? 'bg-white font-bold text-gov-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              title="हिन्दी"
            >
              हिन्दी
            </button>
          </div>

          {/* Component Library Trigger */}
          <button
            onClick={onOpenComponentLibrary}
            className="p-1.5 text-slate-600 hover:text-gov-900 hover:bg-slate-100 rounded border border-slate-200 transition-colors"
            title="Design System & Component Library"
            aria-label="Component Library"
          >
            <Sparkles className="w-4 h-4 text-gov-700" />
          </button>

          {/* Accessibility Settings */}
          <button
            onClick={onOpenAccessibility}
            className="p-1.5 text-slate-600 hover:text-gov-900 hover:bg-slate-100 rounded border border-slate-200 transition-colors"
            title="Accessibility Options (Text Size & Contrast)"
            aria-label="Accessibility Settings"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Operational Alerts / Notification Center */}
          <button
            onClick={onOpenNotifications}
            className="relative p-1.5 text-slate-600 hover:text-gov-900 hover:bg-slate-100 rounded border border-slate-200 transition-colors"
            title="Operational Notifications"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-status-disrupted text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {unreadAlertCount}
              </span>
            )}
          </button>

          {/* Help & System Status */}
          <button
            onClick={onOpenHelp}
            className="p-1.5 text-slate-600 hover:text-gov-900 hover:bg-slate-100 rounded border border-slate-200 transition-colors"
            title="Help, System Diagnostics & FAQs"
            aria-label="Help"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
