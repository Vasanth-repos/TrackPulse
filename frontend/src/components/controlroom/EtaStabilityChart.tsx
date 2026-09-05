import React from 'react';
import { TrendingUp, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';

interface EtaUpdateItem {
  timestamp: string;
  predictedArrival: string;
  lowerBound: string;
  upperBound: string;
  delayMin: number;
}

interface EtaStabilityChartProps {
  stabilityStatus?: 'STABLE' | 'CHANGING' | 'DETERIORATING';
  updates?: EtaUpdateItem[];
}

export const EtaStabilityChart: React.FC<EtaStabilityChartProps> = ({
  stabilityStatus = 'CHANGING',
  updates = [
    { timestamp: '14:10', predictedArrival: '14:35', lowerBound: '14:30', upperBound: '14:40', delayMin: 5 },
    { timestamp: '14:20', predictedArrival: '14:39', lowerBound: '14:33', upperBound: '14:45', delayMin: 9 },
    { timestamp: '14:30', predictedArrival: '14:42', lowerBound: '14:35', upperBound: '14:49', delayMin: 12 },
    { timestamp: '14:38', predictedArrival: '14:45', lowerBound: '14:35', upperBound: '14:52', delayMin: 15 },
  ],
}) => {
  let statusBadge = 'bg-emerald-50 text-emerald-800 border-emerald-300';
  let statusText = 'Stable';
  let statusIcon = CheckCircle2;

  if (stabilityStatus === 'CHANGING') {
    statusBadge = 'bg-amber-50 text-amber-900 border-amber-300';
    statusText = 'Changing (+6 min drift)';
    statusIcon = RefreshCw;
  } else if (stabilityStatus === 'DETERIORATING') {
    statusBadge = 'bg-red-50 text-red-900 border-red-300';
    statusText = 'Deteriorating (Rapid surge)';
    statusIcon = AlertCircle;
  }

  const StatusIconComponent = statusIcon;

  return (
    <div className="gov-card p-4 bg-white flex flex-col justify-between">
      {/* Header & Stability Status */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
        <div>
          <h3 className="text-xs font-bold text-gov-950 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-gov-700" />
            ETA Prediction History & Stability
          </h3>
          <p className="text-[11px] text-slate-500">
            Chronological arrival forecast revisions showing uncertainty ribbon
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Prediction Stability:</span>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold border ${statusBadge}`}>
            <StatusIconComponent className="w-3 h-3" />
            {statusText}
          </span>
        </div>
      </div>

      {/* Visual Chart / Timeline Ribbon */}
      <div className="space-y-2 py-2">
        {updates.map((item, idx) => {
          const isLatest = idx === updates.length - 1;

          return (
            <div
              key={item.timestamp}
              className={`p-2 rounded border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs transition-colors ${
                isLatest
                  ? 'bg-blue-50/70 border-blue-300 font-semibold'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-slate-500 text-[11px] w-12 font-bold">
                  {item.timestamp}
                </span>
                <span className="text-slate-400">→</span>
                <span className="font-mono font-bold text-gov-950 text-sm">
                  {item.predictedArrival}
                </span>
                {isLatest && (
                  <span className="text-[10px] bg-gov-900 text-white font-bold px-1.5 py-0.2 rounded uppercase">
                    Current Fix
                  </span>
                )}
              </div>

              {/* Shaded Interval Ribbon Indicator */}
              <div className="flex items-center gap-3 font-mono text-[11px]">
                <div className="flex items-center gap-1 text-slate-500">
                  <span>Range:</span>
                  <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-800 font-medium">
                    {item.lowerBound} – {item.upperBound}
                  </span>
                </div>
                <div className="text-amber-700 font-medium">
                  +{item.delayMin} min
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Operational Diagnostic Summary */}
      <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
        <span>Interval width: <strong>17 min (p10–p90)</strong></span>
        <span>Forecast variance: <strong className="text-amber-700">+2.4 min/hr</strong></span>
      </div>
    </div>
  );
};
