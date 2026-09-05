import React from 'react';
import { ShieldCheck, Info, HelpCircle, Activity } from 'lucide-react';
import { Language, translations } from '../../utils/translations';

interface GlobalFooterProps {
  language: Language;
  onOpenHelp: () => void;
  onOpenAccessibility: () => void;
  onOpenComponentLibrary: () => void;
}

export const GlobalFooter: React.FC<GlobalFooterProps> = ({
  language,
  onOpenHelp,
  onOpenAccessibility,
  onOpenComponentLibrary,
}) => {
  const t = translations[language];

  return (
    <footer className="bg-white border-t border-slate-200 py-6 px-4 sm:px-6 text-xs text-slate-600 mt-auto">
      <div className="max-w-7xl mx-auto space-y-4">
        
        {/* Top summary row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gov-900 text-sm">{t.appName}</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-600 font-medium">{t.appSubtitle}</span>
            </div>
            <p className="text-[11px] text-slate-500 max-w-2xl">
              {t.disclaimerText}
            </p>
          </div>

          {/* Public Service Links */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-gov-700">
            <button
              onClick={onOpenHelp}
              className="hover:text-gov-900 underline underline-offset-2 flex items-center gap-1"
            >
              <Info className="w-3.5 h-3.5" />
              About TrackPulse
            </button>
            <button
              onClick={onOpenAccessibility}
              className="hover:text-gov-900 underline underline-offset-2 flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Accessibility Policy
            </button>
            <button
              onClick={onOpenComponentLibrary}
              className="hover:text-gov-900 underline underline-offset-2 flex items-center gap-1"
            >
              <Activity className="w-3.5 h-3.5" />
              Design System & Components
            </button>
            <button
              onClick={onOpenHelp}
              className="hover:text-gov-900 underline underline-offset-2 flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              System Diagnostics
            </button>
          </div>
        </div>

        {/* Bottom meta row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-slate-500">
          <div>
            Data Source: <strong className="text-slate-700">Railway Section Operational Telemetry & Historical Replay</strong> | Prediction Method: <strong className="text-slate-700">Quantile Gradient Boosting & Regime Detection</strong>
          </div>
          <div>
            National Hackathon Prototype Solution • <span className="font-mono font-semibold text-slate-700">SIH 2026</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
