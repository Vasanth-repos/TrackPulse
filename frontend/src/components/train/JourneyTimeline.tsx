import React from 'react';
import { TrajectoryPoint } from '../../types/api';
import { Train, CheckCircle2, Clock } from 'lucide-react';

interface JourneyTimelineProps {
  points: TrajectoryPoint[];
  currentStationCode: string;
}

export const JourneyTimeline: React.FC<JourneyTimelineProps> = ({
  points,
  currentStationCode
}) => {
  return (
    <div className="bg-rail-900 border border-rail-800 rounded-xl p-4 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Train className="w-4 h-4 text-signal-cyan" />
          <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
            Railway Journey Track Progression
          </h3>
        </div>
        <div className="text-[11px] text-rail-400 font-mono">
          {points.length} Route Stations • Scrollable
        </div>
      </div>

      {/* Horizontal Railway Track */}
      <div className="overflow-x-auto pb-4 pt-8">
        <div className="flex items-center min-w-max px-6 relative">
          {/* Continuous Railway Track Line */}
          <div className="absolute top-[32px] left-6 right-6 h-1.5 bg-rail-800 border-t border-b border-rail-700 pointer-events-none" />

          {points.map((pt, idx) => {
            const isPassed = pt.status === 'PASSED';
            const isCurrent = pt.status === 'CURRENT';
            const isUpcoming = pt.status === 'UPCOMING';

            return (
              <div
                key={pt.station_code}
                className="flex flex-col items-center relative z-10 w-28 text-center flex-shrink-0 group"
              >
                {/* Upper Time / Status Indicator */}
                <div className="mb-2 h-7 flex items-center justify-center">
                  {isCurrent ? (
                    <span className="bg-signal-amber text-rail-950 font-mono font-black text-[10px] px-2 py-0.5 rounded-full shadow-lg animate-pulse uppercase tracking-wider">
                      TRAIN HERE
                    </span>
                  ) : (
                    <span className="font-mono text-[11px] text-rail-300 font-semibold">
                      {isPassed ? pt.actual_arrival : pt.predicted_arrival}
                    </span>
                  )}
                </div>

                {/* Station Node Marker */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                    isCurrent
                      ? 'bg-signal-cyan border-white shadow-lg shadow-signal-cyan/50 scale-125'
                      : isPassed
                      ? 'bg-rail-800 border-signal-green text-signal-green'
                      : 'bg-rail-950 border-rail-700 text-rail-500'
                  }`}
                >
                  {isCurrent ? (
                    <Train className="w-4 h-4 text-rail-950 animate-bounce" />
                  ) : isPassed ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-rail-700" />
                  )}
                </div>

                {/* Station Name & Code */}
                <div className="mt-2.5">
                  <div className="font-mono font-bold text-xs text-white tracking-wide">
                    {pt.station_code}
                  </div>
                  <div className="text-[10px] text-rail-400 truncate max-w-[100px] mt-0.5">
                    {pt.station_name}
                  </div>
                  <div className="text-[9px] text-rail-500 font-mono mt-0.5">
                    {pt.distance_km} km
                  </div>

                  {/* Delay Badge */}
                  <div className="mt-1">
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        pt.predicted_delay_min === 0
                          ? 'bg-signal-green/20 text-signal-green'
                          : pt.predicted_delay_min <= 15
                          ? 'bg-signal-amber/20 text-signal-amber'
                          : 'bg-signal-red/20 text-signal-red'
                      }`}
                    >
                      {pt.predicted_delay_min === 0 ? '0m' : `+${pt.predicted_delay_min}m`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
