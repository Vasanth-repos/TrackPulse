import React from 'react';
import { Check, Clock, Navigation } from 'lucide-react';
import { TrajectoryPoint } from '../../types/api';

interface PassengerTimelineProps {
  points?: TrajectoryPoint[];
}

export const PassengerTimeline: React.FC<PassengerTimelineProps> = ({ points }) => {
  // Curated simplified timeline for Passenger Experience
  const simpleStages = [
    { name: 'Chennai Central', code: 'MAS', status: 'DEPARTED', label: '✓ Departed', time: '06:00', badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
    { name: 'Nellore', code: 'NLR', status: 'PASSED', label: '✓ Passed', time: '08:34', badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
    { name: 'Ongole', code: 'OGL', status: 'CURRENT', label: '● Current Location', time: '11:42', badgeColor: 'bg-blue-600 text-white border-blue-600 font-bold animate-pulse' },
    { name: 'Vijayawada Junction', code: 'BZA', status: 'UPCOMING', label: 'ETA 14:42', time: '14:42', badgeColor: 'bg-gov-900 text-white border-gov-900 font-bold' },
    { name: 'Warangal', code: 'WL', status: 'UPCOMING', label: 'ETA 17:10', time: '17:10', badgeColor: 'bg-slate-100 text-slate-800 border-slate-300' },
    { name: 'New Delhi', code: 'NDLS', status: 'UPCOMING', label: 'ETA 08:25 tomorrow', time: '08:25 (+1d)', badgeColor: 'bg-slate-100 text-slate-800 border-slate-300' },
  ];

  return (
    <div className="gov-card p-5 bg-white border border-slate-200">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 mb-4">
        <h3 className="text-xs font-bold text-gov-950 uppercase tracking-wider flex items-center gap-1.5">
          <Navigation className="w-4 h-4 text-gov-800" />
          Journey Timeline
        </h3>
        <span className="text-[11px] text-slate-500 font-medium">
          Route Corridor: Southern to Northern Trunk
        </span>
      </div>

      {/* Simplified Vertical / Horizontal Steps */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {simpleStages.map((stage) => {
          const isCurrent = stage.status === 'CURRENT';
          const isTarget = stage.code === 'BZA';

          return (
            <div
              key={stage.code}
              className={`p-3 rounded-lg border flex flex-col justify-between space-y-2 transition-all ${
                isCurrent
                  ? 'bg-blue-50/70 border-blue-300 ring-2 ring-blue-500'
                  : isTarget
                  ? 'bg-gov-50/70 border-gov-300'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div>
                <div className="text-[10px] font-mono text-slate-500 font-bold">
                  {stage.code}
                </div>
                <div className="font-bold text-xs text-slate-900 leading-snug">
                  {stage.name}
                </div>
              </div>

              <div>
                <span className={`inline-block px-2 py-0.5 rounded text-[11px] border text-center w-full ${stage.badgeColor}`}>
                  {stage.label}
                </span>
                <div className="text-[10px] text-slate-400 text-center font-mono mt-1">
                  Sched: {stage.time}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
