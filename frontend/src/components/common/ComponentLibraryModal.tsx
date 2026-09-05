import React, { useState } from 'react';
import { X, Sparkles, Layers, CheckCircle2, AlertTriangle, AlertOctagon, ShieldCheck, ArrowRight, Activity, Search } from 'lucide-react';

interface ComponentLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ComponentLibraryModal: React.FC<ComponentLibraryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeCategory, setActiveCategory] = useState<'BUTTONS' | 'BADGES' | 'CARDS' | 'TABLES' | 'CHARTS' | 'FEEDBACK'>('BUTTONS');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="gov-card bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl border border-slate-300 flex flex-col">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-gov-900 text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-200" />
            <div>
              <h2 className="font-bold text-sm">TrackPulse Official Government Component System</h2>
              <p className="text-[10px] text-blue-200">High-fidelity, accessible, public-service design token reference</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-300 hover:text-white rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="p-2 border-b border-slate-200 bg-slate-50 flex items-center gap-1 overflow-x-auto text-xs font-bold">
          {(['BUTTONS', 'BADGES', 'CARDS', 'TABLES', 'CHARTS', 'FEEDBACK'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded transition-colors ${
                activeCategory === cat
                  ? 'bg-gov-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Showcase Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          
          {/* 1. BUTTONS & INPUTS */}
          {activeCategory === 'BUTTONS' && (
            <div className="space-y-4">
              <div className="font-bold text-gov-950 uppercase tracking-wide border-b pb-1">
                Official Action Buttons & Input Fields
              </div>
              <div className="flex flex-wrap gap-3">
                <button className="px-4 py-2 bg-gov-900 hover:bg-gov-950 text-white font-bold rounded text-xs uppercase tracking-wider">
                  Primary Button
                </button>
                <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded text-xs border border-slate-300">
                  Secondary Button
                </button>
                <button className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded text-xs">
                  Danger Action
                </button>
                <button className="px-4 py-2 text-gov-800 hover:underline font-bold text-xs">
                  Text Link Button →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Train Number Input</label>
                  <input type="text" defaultValue="12627" className="w-full px-3 py-2 bg-slate-50 border rounded font-mono font-bold" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Station Code Input</label>
                  <input type="text" defaultValue="BZA" className="w-full px-3 py-2 bg-slate-50 border rounded font-mono font-bold text-center" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Search Input</label>
                  <input type="text" placeholder="Search corridors..." className="w-full px-3 py-2 bg-slate-50 border rounded" />
                </div>
              </div>
            </div>
          )}

          {/* 2. STATUS & RELIABILITY BADGES */}
          {activeCategory === 'BADGES' && (
            <div className="space-y-4">
              <div className="font-bold text-gov-950 uppercase tracking-wide border-b pb-1">
                Operational Status & Reliability Badges
              </div>
              
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-500">REGIME & DISRUPTION STATUS:</span>
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-50 text-emerald-900 border border-emerald-300 font-bold text-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    ON TIME / NORMAL
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-amber-50 text-amber-900 border border-amber-300 font-bold text-xs">
                    <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                    DELAYED (+18 min)
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-red-50 text-red-900 border border-red-300 font-bold text-xs">
                    <span className="w-2 h-2 rounded-full bg-red-600"></span>
                    DISRUPTED (Section Alert)
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-bold text-slate-500">CALIBRATED RELIABILITY BADGES:</span>
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-xs">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    HIGH (94/100)
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    MEDIUM (76/100)
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded bg-red-100 text-red-900 border border-red-300 font-bold text-xs">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    LOW (38/100)
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 3. CARDS */}
          {activeCategory === 'CARDS' && (
            <div className="space-y-4">
              <div className="font-bold text-gov-950 uppercase tracking-wide border-b pb-1">
                Standard Government Information Cards
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="gov-card p-4 space-y-1">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">ETA Display Card</div>
                  <div className="text-3xl font-mono font-black text-gov-950">14:42</div>
                  <div className="text-xs text-slate-600">Range: 14:35 – 14:52 (p10–p90)</div>
                </div>
                <div className="gov-card p-4 space-y-1 bg-amber-50/50 border-amber-200">
                  <div className="text-[10px] font-bold text-amber-800 uppercase">Transfer Risk Card</div>
                  <div className="font-bold text-sm text-amber-900">AT RISK (8 min buffer)</div>
                  <div className="text-[11px] text-slate-600">Connecting train departure: 15:00</div>
                </div>
              </div>
            </div>
          )}

          {/* 4. CHARTS & SHAP */}
          {activeCategory === 'CHARTS' && (
            <div className="space-y-4">
              <div className="font-bold text-gov-950 uppercase tracking-wide border-b pb-1">
                SHAP-Style Model Evidence & Uncertainty Visualization
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border space-y-2">
                <div className="text-xs font-bold text-slate-800">Model Feature Attribution (Minutes of Impact)</div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px]">
                    <span>Delay Trend (+4 min/stn)</span>
                    <span className="font-mono font-bold text-amber-700">+12 min</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-600 w-3/4 rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px]">
                    <span>Section Runtime Deceleration</span>
                    <span className="font-mono font-bold text-amber-700">+7 min</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 w-1/2 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. FEEDBACK & ERROR STATES */}
          {activeCategory === 'FEEDBACK' && (
            <div className="space-y-3">
              <div className="font-bold text-gov-950 uppercase tracking-wide border-b pb-1">
                System Alerts, Warnings & Fallbacks
              </div>
              
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded text-emerald-950 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-xs">Operational Baseline Normal</strong>
                  <span className="text-[11px]">Telemetry data stream is live and verified across 6 active trunk corridors.</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-300 rounded text-amber-950 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-xs">Stale Telemetry Fallback Warning</strong>
                  <span className="text-[11px]">Data delayed by 4 minutes. Showing last confirmed fix with reduced reliability score.</span>
                </div>
              </div>

              <div className="p-3 bg-red-50 border border-red-300 rounded text-red-950 flex items-start gap-2">
                <AlertOctagon className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-xs">Model Unavailable Fallback</strong>
                  <span className="text-[11px]">ETA estimation engine offline. System fallback displays official published timetable schedule (14:30).</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gov-900 text-white font-bold text-xs rounded"
          >
            Close Component Reference
          </button>
        </div>

      </div>
    </div>
  );
};
