import React from 'react';
import { ReliabilityBreakdown } from '../../types/api';
import { ShieldCheck, AlertCircle, Info } from 'lucide-react';

interface ReliabilityGaugeProps {
  breakdown: ReliabilityBreakdown | null;
}

export const ReliabilityGauge: React.FC<ReliabilityGaugeProps> = ({ breakdown }) => {
  if (!breakdown) return null;

  return (
    <div className="bg-rail-900 border border-rail-800 rounded-xl p-4 shadow-xl">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-rail-800 pb-3 mb-3">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-signal-cyan" />
          <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
            ETA Reliability Index & Factor Decomposition
          </h3>
        </div>
        <div className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
          breakdown.category === 'HIGH' ? 'bg-signal-green/20 text-signal-green border border-signal-green/30' :
          breakdown.category === 'MEDIUM' ? 'bg-signal-amber/20 text-signal-amber border border-signal-amber/30' :
          'bg-signal-red/20 text-signal-red border border-signal-red/30'
        }`}>
          {breakdown.category} TRUST
        </div>
      </div>

      {/* Main Score Bar Meter */}
      <div className="bg-rail-950 p-3.5 rounded-lg border border-rail-800 mb-4">
        <div className="flex items-end justify-between mb-1.5">
          <div>
            <div className="text-[11px] text-rail-400 font-mono">Calibrated Composite Score</div>
            <div className="text-3xl font-black text-white font-mono flex items-baseline space-x-1">
              <span>{breakdown.overall_score}</span>
              <span className="text-xs text-rail-500 font-normal">/ 100</span>
            </div>
          </div>
          <div className="text-right text-xs text-rail-300 font-sans max-w-xs leading-tight">
            {breakdown.interpretation}
          </div>
        </div>

        {/* Segmented Meter */}
        <div className="w-full bg-rail-900 h-2.5 rounded-full overflow-hidden border border-rail-750 flex">
          <div
            className={`h-full transition-all duration-700 ${
              breakdown.overall_score >= 70 ? 'bg-signal-green glow-signal-green' :
              breakdown.overall_score >= 40 ? 'bg-signal-amber glow-signal-amber' :
              'bg-signal-red glow-signal-red'
            }`}
            style={{ width: `${breakdown.overall_score}%` }}
          />
        </div>
      </div>

      {/* 5 Auditable Factors Breakdown */}
      <div className="space-y-2.5">
        <div className="text-xs text-rail-400 font-mono uppercase tracking-wider">
          Auditable Contributing Signals
        </div>

        {breakdown.factors.map((f, idx) => (
          <div key={idx} className="bg-rail-850 border border-rail-750 p-2.5 rounded-lg text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-white font-medium">{f.name}</span>
              <div className="flex items-center space-x-2">
                <span className="text-rail-400 font-mono text-[11px]">wt: {Math.round(f.weight * 100)}%</span>
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                  f.status === 'OPTIMAL' ? 'text-signal-green bg-signal-green/10' :
                  f.status === 'ACCEPTABLE' ? 'text-signal-amber bg-signal-amber/10' :
                  'text-signal-red bg-signal-red/10'
                }`}>
                  {f.score}/100
                </span>
              </div>
            </div>

            <div className="w-full bg-rail-950 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  f.score >= 75 ? 'bg-signal-green' :
                  f.score >= 45 ? 'bg-signal-amber' : 'bg-signal-red'
                }`}
                style={{ width: `${f.score}%` }}
              />
            </div>

            <p className="text-[10px] text-rail-400 mt-1 font-sans">
              {f.description}
            </p>
          </div>
        ))}
      </div>

      {/* Technical Distinction Alert */}
      <div className="mt-4 p-2.5 bg-rail-950/80 rounded border border-rail-800 text-[10px] text-rail-400 flex items-start space-x-2 font-mono">
        <Info className="w-3.5 h-3.5 text-signal-cyan flex-shrink-0 mt-0.5" />
        <span>
          Note: Reliability score quantifies forecast trust under current conditions, distinct from point probability. Evaluated offline via prediction interval calibration.
        </span>
      </div>
    </div>
  );
};
