import React from 'react';
import { Check, Circle, Navigation, Clock } from 'lucide-react';
import { TrajectoryPoint } from '../../types/api';

interface JourneyTimelineProps {
  points: TrajectoryPoint[];
  currentStationCode: string;
}

export const JourneyTimeline: React.FC<JourneyTimelineProps> = ({
  points,
  currentStationCode,
}) => {
  // If no points provided, show placeholder
  if (!points || points.length === 0) return null;

  return (
    <div className="gov-card p-4 bg-white">
      <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-gov-800" />
          <h3 className="text-xs font-bold text-gov-950 uppercase tracking-wider">
            Journey Progress & Corridor Stations
          </h3>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 flex items-center justify-center text-white text-[8px]">✓</span>
            Departed / Passed
          </span>
          <span className="flex items-center gap-1 font-semibold text-gov-900">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 ring-2 ring-blue-300"></span>
            Current Location
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full border border-slate-400 bg-white"></span>
            Upcoming Station
          </span>
        </div>
      </div>

      {/* Horizontal Scrollable Station Timeline Track */}
      <div className="overflow-x-auto pb-2 pt-1">
        <div className="flex items-center min-w-max gap-0 relative">
          
          {points.map((pt, idx) => {
            const isCurrent = pt.station_code === currentStationCode || pt.status === 'CURRENT';
            const isPassed = pt.status === 'PASSED';
            const isUpcoming = pt.status === 'UPCOMING';

            let dotClass = 'border-2 border-slate-300 bg-white text-slate-400';
            let lineClass = 'bg-slate-200';
            let badgeBg = 'bg-slate-50 text-slate-600 border-slate-200';

            if (isPassed) {
              dotClass = 'bg-emerald-600 border-emerald-600 text-white';
              lineClass = 'bg-emerald-600';
              badgeBg = 'bg-emerald-50 text-emerald-800 border-emerald-200';
            } else if (isCurrent) {
              dotClass = 'bg-blue-600 border-blue-600 text-white ring-4 ring-blue-100 animate-pulse';
              lineClass = 'bg-slate-200';
              badgeBg = 'bg-blue-50 text-blue-900 border-blue-300 font-bold';
            }

            return (
              <div key={pt.station_code} className="flex items-center">
                
                {/* Station Node */}
                <div className="flex flex-col items-center text-center w-28 px-1">
                  {/* Status Indicator Dot */}
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${dotClass} z-10 shadow-xs mb-1.5`}>
                    {isPassed ? <Check className="w-3.5 h-3.5" /> : isCurrent ? '●' : '○'}
                  </div>

                  {/* Station Name & Code */}
                  <div className="font-bold text-xs text-slate-800 truncate w-full" title={pt.station_name}>
                    {pt.station_name}
                  </div>
                  <div className="font-mono text-[10px] text-slate-500 font-semibold">
                    {pt.station_code}
                  </div>

                  {/* Scheduled vs Predicted Arrival */}
                  <div className={`mt-1.5 px-1.5 py-0.5 rounded text-[10px] border w-full truncate ${badgeBg}`}>
                    {isPassed ? (
                      <span className="num-tabular">Act: {pt.actual_arrival || pt.scheduled_arrival}</span>
                    ) : isCurrent ? (
                      <span className="num-tabular font-bold">CURRENT</span>
                    ) : (
                      <span className="num-tabular font-bold">ETA: {pt.predicted_arrival}</span>
                    )}
                  </div>

                  {/* Distance */}
                  <div className="text-[9px] text-slate-400 mt-0.5">
                    {pt.distance_km} km
                  </div>
                </div>

                {/* Connecting Track Line (except after last node) */}
                {idx < points.length - 1 && (
                  <div className={`h-1 w-8 -mx-1 ${lineClass} z-0 rounded-full`}></div>
                )}

              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
};
