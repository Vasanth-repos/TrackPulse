import React from 'react';
import { NetworkSummary } from '../../types/api';
import { Train, CheckCircle2, AlertTriangle, AlertOctagon, Activity, Gauge } from 'lucide-react';

interface NetworkSituationProps {
  summary: NetworkSummary | null;
  onSelectTrain?: (trainId: string) => void;
}

export const NetworkSituation: React.FC<NetworkSituationProps> = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="space-y-4">
      {/* Top Banner / Philosophy Note */}
      <div className="bg-gradient-to-r from-rail-900 via-rail-850 to-rail-900 border border-rail-750 p-3.5 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-signal-cyan/10 border border-signal-cyan/30 flex items-center justify-center text-signal-cyan">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white tracking-wide uppercase font-mono">
              National Coaching Corridor Network Situation
            </h2>
            <p className="text-xs text-rail-400">
              Reliability-Aware Dynamic Forecasting Layer • Active Real-Time Telemetry
            </p>
          </div>
        </div>
        <div className="bg-rail-800/90 border border-rail-700 px-3 py-1.5 rounded text-xs text-rail-300 font-mono">
          Core Axiom: <span className="text-signal-amber font-semibold">Current delay ≠ Future delay</span>
        </div>
      </div>

      {/* 4 Command Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Total Monitored */}
        <div className="bg-rail-900/80 border border-rail-800 p-3.5 rounded-lg shadow-sm">
          <div className="flex items-center justify-between text-rail-400 mb-1.5">
            <span className="text-xs font-medium uppercase font-mono">Monitored Trains</span>
            <Train className="w-4 h-4 text-signal-cyan" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{summary.total_monitored_trains}</div>
          <div className="text-[11px] text-rail-400 mt-1 flex items-center space-x-1">
            <span>Avg Network Delay:</span>
            <span className="text-signal-amber font-mono font-medium">+{summary.average_network_delay_min} min</span>
          </div>
        </div>

        {/* Normal Runs */}
        <div className="bg-rail-900/80 border border-rail-800 p-3.5 rounded-lg shadow-sm">
          <div className="flex items-center justify-between text-signal-green mb-1.5">
            <span className="text-xs font-medium uppercase font-mono">Normal Regime</span>
            <CheckCircle2 className="w-4 h-4 text-signal-green" />
          </div>
          <div className="text-2xl font-bold text-signal-green font-mono">{summary.normal_trains_count}</div>
          <div className="text-[11px] text-rail-400 mt-1">
            Adhering to historical timetable baseline
          </div>
        </div>

        {/* Delayed Runs */}
        <div className="bg-rail-900/80 border border-rail-800 p-3.5 rounded-lg shadow-sm">
          <div className="flex items-center justify-between text-signal-amber mb-1.5">
            <span className="text-xs font-medium uppercase font-mono">Delayed Regime</span>
            <AlertTriangle className="w-4 h-4 text-signal-amber" />
          </div>
          <div className="text-2xl font-bold text-signal-amber font-mono">{summary.delayed_trains_count}</div>
          <div className="text-[11px] text-rail-400 mt-1">
            Section recovery expected
          </div>
        </div>

        {/* Disrupted / Low Reliability */}
        <div className="bg-rail-900/80 border border-rail-800 p-3.5 rounded-lg shadow-sm">
          <div className="flex items-center justify-between text-signal-red mb-1.5">
            <span className="text-xs font-medium uppercase font-mono">Disrupted / Low Rel.</span>
            <AlertOctagon className="w-4 h-4 text-signal-red" />
          </div>
          <div className="text-2xl font-bold text-signal-red font-mono">{summary.disrupted_trains_count}</div>
          <div className="text-[11px] text-rail-400 mt-1 flex items-center space-x-1">
            <span>Avg Network Reliability:</span>
            <span className="text-white font-mono font-medium">{summary.average_reliability_score}/100</span>
          </div>
        </div>
      </div>

      {/* Active Corridors Status */}
      <div className="bg-rail-900 border border-rail-800 rounded-lg p-3.5">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-signal-cyan" />
            <h3 className="text-xs font-semibold text-white uppercase font-mono tracking-wider">
              High-Density Trunk Corridors Health
            </h3>
          </div>
          <span className="text-[11px] text-rail-400 font-mono">Updated real-time</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {summary.active_corridors.map((c, idx) => (
            <div key={idx} className="bg-rail-850 border border-rail-750 p-2.5 rounded flex items-center justify-between text-xs">
              <div className="truncate mr-2">
                <div className="text-white font-medium truncate">{c.corridor_name}</div>
                <div className="text-[11px] text-rail-400 font-mono">
                  {c.train_count} active train • Delay: +{c.avg_delay}m
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  c.status === 'NORMAL' ? 'bg-signal-green/20 text-signal-green border border-signal-green/30' :
                  c.status === 'DELAYED' ? 'bg-signal-amber/20 text-signal-amber border border-signal-amber/30' :
                  'bg-signal-red/20 text-signal-red border border-signal-red/30'
                }`}>
                  {c.status}
                </span>
                <div className="text-[10px] text-rail-400 font-mono mt-0.5">
                  Rel: {c.reliability}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
