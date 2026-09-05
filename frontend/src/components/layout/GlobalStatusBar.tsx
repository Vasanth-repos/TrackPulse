import React from 'react';
import { Activity, ShieldCheck, Database, Server } from 'lucide-react';
import { Language, translations } from '../../utils/translations';

interface GlobalStatusBarProps {
  language: Language;
  currentTime: string;
  systemFreshnessSec?: number;
}

export const GlobalStatusBar: React.FC<GlobalStatusBarProps> = ({
  language,
  currentTime,
  systemFreshnessSec = 18,
}) => {
  const t = translations[language];

  return (
    <div className="bg-slate-100 border-b border-slate-200 px-4 sm:px-6 py-1.5 text-xs text-slate-700 select-none">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-1.5 gap-x-4">
        
        {/* Left: Operational Engine & Pipeline Status Indicators */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {/* Data Status */}
          <div className="flex items-center gap-1.5 font-medium">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {t.dataStatus}:
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {t.liveReplay}
            </span>
          </div>

          {/* Last Railway Update */}
          <div className="hidden sm:flex items-center gap-1.5 text-slate-600">
            <Database className="w-3 h-3 text-slate-400" />
            <span>{t.lastUpdate}:</span>
            <span className="font-mono font-semibold text-slate-800">{currentTime}</span>
            <span className="text-[11px] text-slate-400">({systemFreshnessSec}s ago)</span>
          </div>

          {/* Prediction Engine Status */}
          <div className="hidden md:flex items-center gap-1.5 text-slate-600">
            <Activity className="w-3 h-3 text-emerald-600" />
            <span>{t.engineStatus}</span>
          </div>

          {/* API Status */}
          <div className="hidden lg:flex items-center gap-1.5 text-slate-600">
            <Server className="w-3 h-3 text-gov-600" />
            <span>{t.apiStatus}</span>
          </div>

          {/* Model Version */}
          <div className="hidden xl:flex items-center gap-1.5 text-slate-500 text-[11px] font-mono">
            <span>{t.modelVersion}</span>
          </div>
        </div>

        {/* Right: Mandatory Demo Notice Badge */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 border border-amber-300 text-amber-900 text-[11px] font-bold tracking-tight">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
            <span>{t.demoNotice}</span>
          </div>
        </div>

      </div>
    </div>
  );
};
