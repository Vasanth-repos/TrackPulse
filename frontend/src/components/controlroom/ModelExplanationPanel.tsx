import React from 'react';
import { HelpCircle, BarChart3, AlertCircle, Info } from 'lucide-react';
import { EvidenceResponse } from '../../types/api';

interface ModelExplanationPanelProps {
  evidence: EvidenceResponse | null;
}

export const ModelExplanationPanel: React.FC<ModelExplanationPanelProps> = ({ evidence }) => {
  // SHAP-style contribution features
  const contributions = [
    {
      feature: 'Recent delay trajectory trend',
      impactMinutes: 12,
      type: 'INCREASE_ETA',
      percentage: 75,
      barColor: 'bg-amber-600',
      description: 'Progressive delay accumulated over last 3 stations (+4 min/stn)',
    },
    {
      feature: 'Downstream section runtime variance',
      impactMinutes: 7,
      type: 'INCREASE_ETA',
      percentage: 45,
      barColor: 'bg-amber-500',
      description: 'Ongole–Vijayawada section running slower than median historical timetable',
    },
    {
      feature: 'Current baseline delay',
      impactMinutes: 5,
      type: 'INCREASE_ETA',
      percentage: 30,
      barColor: 'bg-amber-500',
      description: 'Carryover delay from previous junction clearance',
    },
    {
      feature: 'Historical section recovery buffer',
      impactMinutes: -3,
      type: 'DECREASE_ETA',
      percentage: 20,
      barColor: 'bg-emerald-600',
      description: 'Scheduled slack allowance on upcoming high-speed section',
    },
  ];

  return (
    <div className="gov-card p-4 bg-white flex flex-col justify-between">
      {/* Header */}
      <div className="border-b border-slate-200 pb-2 mb-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-gov-950 uppercase tracking-wider flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-gov-700" />
            Why did the ETA change? (Model Evidence)
          </h3>
          <span className="text-[10px] uppercase font-bold text-slate-500 px-1.5 py-0.5 bg-slate-100 rounded border border-slate-200">
            Prediction Explanation
          </span>
        </div>

        {/* Causal Disclaimer */}
        <div className="mt-2 p-2 rounded bg-slate-50 border border-slate-200 flex items-start gap-1.5 text-[11px] text-slate-600">
          <Info className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Model Evidence Notice:</strong> Visualized feature contributions reflect statistical model weights and correlation evidence, not physical railway causal root-cause analysis.
          </span>
        </div>
      </div>

      {/* SHAP-Style Horizontal Contribution Bars */}
      <div className="space-y-3 py-1">
        {contributions.map((c) => {
          const isPositive = c.impactMinutes > 0;

          return (
            <div key={c.feature} className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">{c.feature}</span>
                <span className={`font-mono font-bold ${isPositive ? 'text-amber-800' : 'text-emerald-700'}`}>
                  {isPositive ? `+${c.impactMinutes} min` : `${c.impactMinutes} min`}
                </span>
              </div>

              {/* Bar */}
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                <div
                  className={`h-full ${c.barColor} rounded-full transition-all`}
                  style={{ width: `${c.percentage}%` }}
                ></div>
              </div>

              <div className="text-[10px] text-slate-500">{c.description}</div>
            </div>
          );
        })}
      </div>

      {/* Narrative Synthesis */}
      <div className="mt-3 p-2.5 rounded bg-amber-50/70 border border-amber-200 text-xs text-amber-950 leading-relaxed">
        <strong>Synthesis:</strong> ETA increased primarily because the recent delay trajectory is increasing and the current section is behaving slower than its historical pattern, partially offset by scheduled recovery margin on the upcoming corridor.
      </div>
    </div>
  );
};
