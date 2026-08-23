import React from 'react';
import { TrajectoryPoint } from '../../types/api';
import { Table, CheckCircle2, Clock } from 'lucide-react';

interface StationEtaTableProps {
  points: TrajectoryPoint[];
}

export const StationEtaTable: React.FC<StationEtaTableProps> = ({ points }) => {
  return (
    <div className="bg-rail-900 border border-rail-800 rounded-xl overflow-hidden shadow-xl">
      <div className="p-3.5 border-b border-rail-800 flex items-center justify-between bg-rail-850/60">
        <div className="flex items-center space-x-2">
          <Table className="w-4 h-4 text-signal-cyan" />
          <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
            Station-by-Station Arrival Forecasts & Uncertainty Bounds
          </h3>
        </div>
        <span className="text-xs text-rail-400 font-mono">Quantile Interval (80% CI)</span>
      </div>

      <div className="overflow-x-auto max-h-96">
        <table className="w-full text-left text-xs">
          <thead className="bg-rail-950 text-rail-400 font-mono text-[11px] sticky top-0 border-b border-rail-800 z-10">
            <tr>
              <th className="py-2.5 px-3.5">#</th>
              <th className="py-2.5 px-3.5">Station</th>
              <th className="py-2.5 px-3.5">Distance</th>
              <th className="py-2.5 px-3.5">Scheduled</th>
              <th className="py-2.5 px-3.5">Actual / Predicted</th>
              <th className="py-2.5 px-3.5">Delay</th>
              <th className="py-2.5 px-3.5">Prediction Interval</th>
              <th className="py-2.5 px-3.5">Reliability</th>
              <th className="py-2.5 px-3.5 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rail-800/60 font-sans">
            {points.map((pt) => {
              const isCurrent = pt.status === 'CURRENT';
              const isPassed = pt.status === 'PASSED';
              return (
                <tr
                  key={pt.station_code}
                  className={`transition-colors ${
                    isCurrent ? 'bg-signal-cyan/10 font-medium' : isPassed ? 'opacity-70' : 'hover:bg-rail-850/40'
                  }`}
                >
                  <td className="py-2.5 px-3.5 font-mono text-rail-400">{pt.sequence}</td>
                  <td className="py-2.5 px-3.5">
                    <div className="font-bold text-white font-mono">{pt.station_code}</div>
                    <div className="text-[11px] text-rail-300 truncate max-w-[140px]">{pt.station_name}</div>
                  </td>
                  <td className="py-2.5 px-3.5 font-mono text-rail-400">{pt.distance_km} km</td>
                  <td className="py-2.5 px-3.5 font-mono text-rail-300">{pt.scheduled_arrival}</td>
                  <td className="py-2.5 px-3.5 font-mono font-bold text-white">
                    {isPassed ? pt.actual_arrival : pt.predicted_arrival}
                  </td>
                  <td className="py-2.5 px-3.5">
                    <span className={`font-mono font-bold text-[11px] ${
                      pt.predicted_delay_min === 0 ? 'text-signal-green' :
                      pt.predicted_delay_min <= 15 ? 'text-signal-amber' : 'text-signal-red'
                    }`}>
                      {pt.predicted_delay_min === 0 ? 'ON TIME' : `+${pt.predicted_delay_min}m`}
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5 font-mono text-rail-300">
                    {isPassed ? '—' : `${pt.lower_bound_arrival} – ${pt.upper_bound_arrival}`}
                  </td>
                  <td className="py-2.5 px-3.5 font-mono">
                    <span className={`font-bold ${
                      pt.reliability_score >= 70 ? 'text-signal-green' :
                      pt.reliability_score >= 40 ? 'text-signal-amber' : 'text-signal-red'
                    }`}>
                      {pt.reliability_score}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5 text-right font-mono">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isCurrent ? 'bg-signal-amber text-rail-950' :
                      isPassed ? 'bg-rail-800 text-signal-green' :
                      'bg-rail-850 text-rail-400'
                    }`}>
                      {pt.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
