import React, { useState } from 'react';
import { TrajectoryPoint } from '../../types/api';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';

interface DelayTrajectoryChartProps {
  points: TrajectoryPoint[];
  summaryTrend: 'INCREASING' | 'STABLE' | 'RECOVERING';
}

export const DelayTrajectoryChart: React.FC<DelayTrajectoryChartProps> = ({
  points,
  summaryTrend
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!points || points.length === 0) return null;

  // Compute chart coordinates
  const maxDelay = Math.max(...points.map((p) => p.predicted_delay_min), 30) + 10;
  const height = 180;
  const width = 800;
  const paddingX = 40;
  const paddingY = 25;

  const getX = (idx: number) => paddingX + (idx / (points.length - 1)) * (width - paddingX * 2);
  const getY = (delayMin: number) => height - paddingY - (delayMin / maxDelay) * (height - paddingY * 2);

  // Build SVG path
  const linePath = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx)} ${getY(p.predicted_delay_min)}`).join(' ');

  // Build Uncertainty polygon
  const upperPath = points.map((p, idx) => {
    const upDelay = p.predicted_delay_min + Math.floor(p.interval_width_min / 2);
    return `${idx === 0 ? 'M' : 'L'} ${getX(idx)} ${getY(upDelay)}`;
  }).join(' ');

  const lowerPath = [...points].reverse().map((p, idx) => {
    const realIdx = points.length - 1 - idx;
    const lowDelay = Math.max(0, p.predicted_delay_min - Math.floor(p.interval_width_min / 2));
    return `L ${getX(realIdx)} ${getY(lowDelay)}`;
  }).join(' ');

  const uncertaintyArea = `${upperPath} ${lowerPath} Z`;

  return (
    <div className="bg-rail-900 border border-rail-800 rounded-xl p-4 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center space-x-2">
            <span>Station-by-Station Delay Trajectory & Recovery Forecast</span>
          </h3>
          <p className="text-[11px] text-rail-400">
            Uncertainty envelope expands over longer horizons and during disrupted regimes.
          </p>
        </div>

        {/* Trend Pill */}
        <div className="flex items-center space-x-1.5">
          <span className="text-xs text-rail-400 font-mono">Trajectory Trend:</span>
          <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold flex items-center space-x-1 ${
            summaryTrend === 'RECOVERING' ? 'bg-signal-green/20 text-signal-green border border-signal-green/30' :
            summaryTrend === 'STABLE' ? 'bg-signal-cyan/20 text-signal-cyan border border-signal-cyan/30' :
            'bg-signal-amber/20 text-signal-amber border border-signal-amber/30'
          }`}>
            {summaryTrend === 'RECOVERING' ? <TrendingDown className="w-3.5 h-3.5" /> :
             summaryTrend === 'STABLE' ? <Minus className="w-3.5 h-3.5" /> :
             <TrendingUp className="w-3.5 h-3.5" />}
            <span>{summaryTrend}</span>
          </span>
        </div>
      </div>

      {/* SVG Chart Container */}
      <div className="relative overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-44 sm:h-48 overflow-visible"
        >
          {/* Grid lines */}
          {[0, maxDelay / 2, maxDelay].map((dVal, idx) => {
            const y = getY(dVal);
            return (
              <g key={idx}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#1D2840"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 8}
                  y={y + 4}
                  fill="#566D9B"
                  fontSize="10"
                  fontFamily="JetBrains Mono"
                  textAnchor="end"
                >
                  +{Math.round(dVal)}m
                </text>
              </g>
            );
          })}

          {/* Uncertainty Envelope Polygon */}
          <path
            d={uncertaintyArea}
            fill="rgba(6, 182, 212, 0.12)"
            stroke="rgba(6, 182, 212, 0.3)"
            strokeDasharray="2 2"
          />

          {/* Primary Predicted Delay Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#06B6D4"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Station Point Nodes */}
          {points.map((p, idx) => {
            const x = getX(idx);
            const y = getY(p.predicted_delay_min);
            const isHovered = hoveredIndex === idx;
            const isCurrent = p.status === 'CURRENT';

            return (
              <g
                key={idx}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer"
              >
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 7 : isCurrent ? 5.5 : 3.5}
                  fill={isCurrent ? '#F59E0B' : '#0B0F19'}
                  stroke={isCurrent ? '#F59E0B' : '#06B6D4'}
                  strokeWidth={isHovered ? 3 : 2}
                  className="transition-all"
                />
                {/* Station Code Labels below */}
                {(idx % Math.ceil(points.length / 10) === 0 || idx === points.length - 1) && (
                  <text
                    x={x}
                    y={height - 5}
                    fill="#839AC7"
                    fontSize="9"
                    fontFamily="JetBrains Mono"
                    textAnchor="middle"
                  >
                    {p.station_code}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredIndex !== null && points[hoveredIndex] && (
          <div
            className="absolute top-2 bg-rail-950 border border-signal-cyan/40 p-2.5 rounded-lg shadow-2xl pointer-events-none text-xs z-30 font-mono"
            style={{
              left: `${Math.min(80, Math.max(10, (hoveredIndex / (points.length - 1)) * 100))}%`,
              transform: 'translateX(-50%)'
            }}
          >
            <div className="font-bold text-white flex items-center space-x-1.5">
              <span>{points[hoveredIndex].station_name}</span>
              <span className="text-signal-cyan">({points[hoveredIndex].station_code})</span>
            </div>
            <div className="text-rail-300 text-[11px] mt-1 space-y-0.5">
              <div>Predicted Delay: <strong className="text-signal-amber">+{points[hoveredIndex].predicted_delay_min} min</strong></div>
              <div>Predicted Arrival: <strong className="text-white">{points[hoveredIndex].predicted_arrival}</strong></div>
              <div>Window: {points[hoveredIndex].lower_bound_arrival} – {points[hoveredIndex].upper_bound_arrival}</div>
              <div>Reliability: <strong className="text-signal-green">{points[hoveredIndex].reliability_score}/100</strong></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
