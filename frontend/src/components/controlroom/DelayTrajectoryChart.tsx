import React from 'react';
import { TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';
import { TrajectoryPoint } from '../../types/api';

interface DelayTrajectoryChartProps {
  points: TrajectoryPoint[];
  summaryTrend?: string;
}

export const DelayTrajectoryChart: React.FC<DelayTrajectoryChartProps> = ({
  points,
  summaryTrend = 'INCREASING',
}) => {
  if (!points || points.length === 0) return null;

  // Find max delay for scaling
  const maxDelay = Math.max(
    ...points.map((p) => Math.max(p.actual_delay_min || 0, p.predicted_delay_min || 0, 10))
  );

  let trendBadge = 'bg-amber-50 text-amber-900 border-amber-300';
  let TrendIcon = TrendingUp;
  let trendLabel = 'Increasing (+14 min trend)';

  if (summaryTrend === 'RECOVERING') {
    trendBadge = 'bg-emerald-50 text-emerald-900 border-emerald-300';
    TrendIcon = TrendingDown;
    trendLabel = 'Recovering (-6 min recovery)';
  } else if (summaryTrend === 'STABLE') {
    trendBadge = 'bg-slate-100 text-slate-800 border-slate-300';
    TrendIcon = Minus;
    trendLabel = 'Stable Trajectory';
  }

  return (
    <div className="gov-card p-4 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
        <div>
          <h3 className="text-xs font-bold text-gov-950 uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-gov-700" />
            Delay Trajectory & Cumulative Section Drift
          </h3>
          <p className="text-[11px] text-slate-500">
            Station-by-station delay evolution from origin to destination
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold border ${trendBadge}`}>
            <TrendIcon className="w-3 h-3" />
            {trendLabel}
          </span>
        </div>
      </div>

      {/* SVG Trajectory Visualization */}
      <div className="h-44 w-full relative pt-2">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 500 130" preserveAspectRatio="none">
          {/* Grid lines */}
          <line x1="0" y1="20" x2="500" y2="20" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="0" y1="65" x2="500" y2="65" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="0" y1="110" x2="500" y2="110" stroke="#E2E8F0" strokeWidth="1" />

          {/* Render historical delay polyline */}
          {points.length > 1 && (
            <polyline
              fill="none"
              stroke="#0B2545"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points
                .map((pt, i) => {
                  const x = (i / (points.length - 1)) * 480 + 10;
                  const delayVal = pt.actual_delay_min !== null && pt.actual_delay_min !== undefined ? pt.actual_delay_min : pt.predicted_delay_min;
                  const y = 110 - (Math.min(delayVal, maxDelay) / maxDelay) * 90;
                  return `${x},${y}`;
                })
                .join(' ')}
            />
          )}

          {/* Render points and station labels */}
          {points.map((pt, i) => {
            const x = (i / (points.length - 1)) * 480 + 10;
            const delayVal = pt.actual_delay_min !== null && pt.actual_delay_min !== undefined ? pt.actual_delay_min : pt.predicted_delay_min;
            const y = 110 - (Math.min(delayVal, maxDelay) / maxDelay) * 90;
            const isCurrent = pt.status === 'CURRENT';

            return (
              <g key={pt.station_code}>
                <circle
                  cx={x}
                  cy={y}
                  r={isCurrent ? 5 : 3.5}
                  fill={isCurrent ? '#2563EB' : pt.status === 'PASSED' ? '#15803D' : '#94A3B8'}
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                />
                {/* Station code below baseline */}
                {i % 2 === 0 || isCurrent ? (
                  <text
                    x={x}
                    y="124"
                    textAnchor="middle"
                    fontSize="8"
                    fontFamily="monospace"
                    fill={isCurrent ? '#1D4ED8' : '#64748B'}
                    fontWeight={isCurrent ? 'bold' : 'normal'}
                  >
                    {pt.station_code}
                  </text>
                ) : null}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Trajectory Breakdown Pills */}
      <div className="mt-2 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-600 gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Passed Stations
          </span>
          <span className="flex items-center gap-1 font-semibold text-blue-700">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span> Current Section
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-slate-400"></span> Predicted Stations
          </span>
        </div>
        <div className="font-mono font-medium text-slate-700">
          Peak Cumulative Delay: <strong>+{maxDelay} min</strong>
        </div>
      </div>
    </div>
  );
};
