import React from 'react';
import { X, HelpCircle, ShieldCheck, Activity, Database, Server, Info } from 'lucide-react';
import { Language, translations } from '../../utils/translations';

interface HelpSystemModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  currentTime: string;
}

export const HelpSystemModal: React.FC<HelpSystemModalProps> = ({
  isOpen,
  onClose,
  language,
  currentTime,
}) => {
  const t = translations[language];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="gov-card bg-white w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl border border-slate-300 flex flex-col">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-gov-900 text-white">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-200" />
            <div>
              <h2 className="font-bold text-sm">TrackPulse Help, System Diagnostics & FAQs</h2>
              <p className="text-[10px] text-blue-200">Adaptive ETA Reliability & Forecasting System for Indian Coaching Trains</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-300 hover:text-white rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          
          {/* 1. Core Innovation Summary */}
          <div className="p-3.5 rounded-lg bg-gov-50/70 border border-gov-200 space-y-1.5">
            <div className="font-bold text-gov-950 text-xs flex items-center gap-1.5">
              <Info className="w-4 h-4 text-gov-800" />
              <span>Core Innovation: Don't Just Predict the ETA. Predict How Reliable It Is.</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Standard railway displays produce static point estimates. TrackPulse introduces dynamic Section-Aware Quantile ML to output:
              (1) Predicted Arrival ETA, (2) 10th-to-90th percentile Uncertainty Interval [p10, p90], (3) 0–100 Calibrated Reliability Trust Score, and (4) Auditable Model Evidence.
            </p>
          </div>

          {/* 2. Live System Diagnostics Table */}
          <div className="space-y-2">
            <div className="font-bold text-slate-800 uppercase tracking-wide text-[11px]">
              System Health & Diagnostics
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase">FastAPI Backend</div>
                <div className="font-bold text-emerald-700 mt-0.5">ONLINE (8000)</div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase">Prediction Model</div>
                <div className="font-bold text-gov-900 mt-0.5">TrackPulse v1.0</div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase">Telemetry Loop</div>
                <div className="font-bold text-emerald-700 mt-0.5">Live (18s Fresh)</div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase">Active Trains</div>
                <div className="font-bold text-gov-900 mt-0.5">6 Primary Services</div>
              </div>
            </div>
          </div>

          {/* 3. Frequently Asked Questions */}
          <div className="space-y-3">
            <div className="font-bold text-slate-800 uppercase tracking-wide text-[11px]">
              Frequently Asked Questions (FAQ)
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
              <strong className="text-slate-900 block">Q: Why does the ETA show an Estimated Range?</strong>
              <p className="text-slate-600 text-[11px]">
                Railway tracks are shared multi-train networks subject to precedence clearings and block signaling. The Estimated Range (e.g. 14:35–14:52) represents the 80% confidence window derived from historical section variance.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
              <strong className="text-slate-900 block">Q: How does Connection Risk work?</strong>
              <p className="text-slate-600 text-[11px]">
                It evaluates whether your incoming train's upper arrival bound gives you enough time to make your connecting train transfer without rushing or missing it.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
              <strong className="text-slate-900 block">Q: How do non-smartphone users access TrackPulse?</strong>
              <p className="text-slate-600 text-[11px]">
                Users can send a simple SMS format (e.g. <code>ETA 12627 BZA</code>) or call the toll-free IVR system to hear spoken ETAs in English, Tamil, or Hindi.
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gov-900 text-white font-bold text-xs rounded"
          >
            Close Help & Diagnostics
          </button>
        </div>

      </div>
    </div>
  );
};
