import React, { useState, useEffect } from 'react';
import {
  NetworkAnalyzeResponse
} from '../../types/api';
import { fetchNetworkAnalysis } from '../../services/api';
import {
  Network,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  RefreshCw,
  Train,
  AlertCircle,
  TrendingUp,
  MapPin
} from 'lucide-react';

interface MultiTrainPropagationDeckProps {
  onSelectTrain?: (trainId: string) => void;
}

export const MultiTrainPropagationDeck: React.FC<MultiTrainPropagationDeckProps> = ({
  onSelectTrain
}) => {
  const [stationId, setStationId] = useState<string>('MAS');
  const [timeWindowMin, setTimeWindowMin] = useState<number>(180);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<NetworkAnalyzeResponse | null>(null);
  const [activeTab, setActiveTab] = useState<'turnaround' | 'conflicts' | 'chains'>('turnaround');

  const loadAnalysis = async (station: string, windowMin: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNetworkAnalysis(station, windowMin);
      setAnalysis(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load network delay propagation analysis');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalysis(stationId, timeWindowMin);
  }, [stationId, timeWindowMin]);

  const stations = [
    { code: 'MAS', name: 'Chennai Central (MAS)' },
    { code: 'NDLS', name: 'New Delhi (NDLS)' },
    { code: 'BZA', name: 'Vijayawada Jn (BZA)' },
    { code: 'SBC', name: 'KSR Bengaluru (SBC)' },
    { code: 'HWH', name: 'Howrah Jn (HWH)' },
    { code: 'BPL', name: 'Bhopal Jn (BPL)' }
  ];

  const getCongestionBadge = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-900 border-red-300';
      case 'CONGESTED':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      default:
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'HIGH':
        return 'bg-red-600 text-white font-bold';
      case 'MEDIUM':
        return 'bg-amber-500 text-slate-950 font-bold';
      default:
        return 'bg-emerald-600 text-white font-bold';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls Panel */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-gov-900 text-white rounded-md">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gov-950 tracking-tight">
                  Multi-Train Delay Propagation & Station Congestion Engine
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-gov-100 text-gov-800 rounded border border-gov-300">
                  SIH26028 RAKE INTELLIGENCE
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Real-time tracking of incoming coaching rakes, turnaround buffer depletion, platform bottlenecks, and cascading delay trees.
              </p>
            </div>
          </div>

          {/* Action & Station Selectors */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs">
              <MapPin className="w-3.5 h-3.5 text-gov-700" />
              <label htmlFor="station-select" className="font-semibold text-slate-700">Station:</label>
              <select
                id="station-select"
                value={stationId}
                onChange={(e) => setStationId(e.target.value)}
                className="bg-white border border-slate-300 rounded px-2 py-0.5 font-bold text-gov-950 text-xs focus:outline-none focus:ring-1 focus:ring-gov-800"
              >
                {stations.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs">
              <Clock className="w-3.5 h-3.5 text-gov-700" />
              <label htmlFor="window-select" className="font-semibold text-slate-700">Window:</label>
              <select
                id="window-select"
                value={timeWindowMin}
                onChange={(e) => setTimeWindowMin(Number(e.target.value))}
                className="bg-white border border-slate-300 rounded px-2 py-0.5 font-bold text-gov-950 text-xs focus:outline-none focus:ring-1 focus:ring-gov-800"
              >
                <option value={60}>60 Minutes (1 hr)</option>
                <option value={120}>120 Minutes (2 hrs)</option>
                <option value={180}>180 Minutes (3 hrs)</option>
                <option value={360}>360 Minutes (6 hrs)</option>
              </select>
            </div>

            <button
              onClick={() => loadAnalysis(stationId, timeWindowMin)}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gov-900 hover:bg-gov-950 text-white rounded text-xs font-bold transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Summary Metric Ribbon */}
        {analysis && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Station Congestion
              </span>
              <div className="mt-1 flex items-center gap-2">
                <span className={`px-2 py-0.5 text-xs font-bold rounded border ${getCongestionBadge(analysis.overall_station_congestion)}`}>
                  {analysis.overall_station_congestion}
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Active Rake Links
              </span>
              <span className="text-xl font-black text-gov-950 mt-1 block">
                {analysis.total_active_dependencies} Pairs
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Platform Conflicts
              </span>
              <div className="mt-1 flex items-center gap-1.5">
                <span className={`text-xl font-black ${analysis.platform_conflicts.length > 0 ? 'text-red-700' : 'text-emerald-700'}`}>
                  {analysis.platform_conflicts.length}
                </span>
                <span className="text-xs text-slate-600 font-medium">
                  {analysis.platform_conflicts.length > 0 ? 'Action required' : 'Clear'}
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Cascading Chains
              </span>
              <span className="text-xl font-black text-gov-950 mt-1 block">
                {analysis.propagation_chains.length} Active Nodes
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Sub-tabs for Deep Inspection */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-lg px-4 pt-3 gap-2">
        <button
          onClick={() => setActiveTab('turnaround')}
          className={`pb-2.5 px-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-colors ${
            activeTab === 'turnaround'
              ? 'border-gov-900 text-gov-950'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Train className="w-3.5 h-3.5" />
          Rake Turnaround & Outgoing Departures ({analysis?.outgoing_trains.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('conflicts')}
          className={`pb-2.5 px-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-colors ${
            activeTab === 'conflicts'
              ? 'border-gov-900 text-gov-950'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          Platform Occupancy Conflicts ({analysis?.platform_conflicts.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('chains')}
          className={`pb-2.5 px-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-colors ${
            activeTab === 'chains'
              ? 'border-gov-900 text-gov-950'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          Multi-Hop Cascading Delay Trees ({analysis?.propagation_chains.length || 0})
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded text-xs text-red-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* TAB 1: RAKE TURNAROUND & OUTGOING DEPARTURES */}
      {activeTab === 'turnaround' && analysis && (
        <div className="space-y-6">
          {/* Outgoing Train Impact Grid */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gov-950 flex items-center gap-2">
                  <span>Outgoing Coaching Services — Turnaround Dependency Analysis</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Calculates rake turnaround buffer health: If (Available Turnaround &lt; Required Maintenance), departure delay propagates automatically.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 uppercase text-[10px] tracking-wider font-black">
                    <th className="p-3">Outgoing Service</th>
                    <th className="p-3">Destination</th>
                    <th className="p-3">Sched. Dep</th>
                    <th className="p-3">Pred. Dep</th>
                    <th className="p-3">Incoming Feeder Rake</th>
                    <th className="p-3">Turnaround Buffer</th>
                    <th className="p-3">Propagated Delay</th>
                    <th className="p-3">Departure Risk</th>
                    <th className="p-3">Platform</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {analysis.outgoing_trains.map((t) => {
                    const bufferDeficit = t.required_turnaround_min - t.available_turnaround_min;
                    return (
                      <tr
                        key={t.train_id}
                        className="hover:bg-slate-50 transition-colors cursor-pointer"
                        onClick={() => onSelectTrain && onSelectTrain(t.train_id)}
                      >
                        <td className="p-3 font-bold text-gov-950">
                          <div className="flex items-center gap-1.5">
                            <span className="bg-slate-200 text-gov-900 px-1.5 py-0.5 rounded font-mono font-bold text-[11px]">
                              {t.train_id}
                            </span>
                            <span>{t.train_name}</span>
                          </div>
                        </td>
                        <td className="p-3 font-medium text-slate-700">{t.destination_station_code}</td>
                        <td className="p-3 font-mono text-slate-600">{t.scheduled_departure}</td>
                        <td className="p-3 font-mono font-bold text-gov-900">{t.predicted_departure}</td>
                        <td className="p-3">
                          {t.incoming_dependency_train_id ? (
                            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-700">
                              <span className="bg-amber-100 text-amber-900 px-1 py-0.5 rounded border border-amber-200">
                                Rake #{t.incoming_dependency_train_id}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">Primary Yard Rake</span>
                          )}
                        </td>
                        <td className="p-3">
                          <div className="space-y-0.5">
                            <div className="text-[11px] font-bold text-slate-800">
                              {t.available_turnaround_min}m avail / {t.required_turnaround_min}m req
                            </div>
                            <div className="w-24 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-full ${
                                  bufferDeficit > 0
                                    ? 'bg-red-600'
                                    : t.available_turnaround_min < t.required_turnaround_min + 30
                                    ? 'bg-amber-500'
                                    : 'bg-emerald-600'
                                }`}
                                style={{
                                  width: `${Math.min(
                                    100,
                                    (t.available_turnaround_min / t.required_turnaround_min) * 100
                                  )}%`
                                }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="p-3 font-bold font-mono">
                          {t.propagated_delay_min > 0 ? (
                            <span className="text-red-700">+{t.propagated_delay_min}m</span>
                          ) : (
                            <span className="text-emerald-700">0m (On Time)</span>
                          )}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] ${getRiskBadge(t.departure_risk)}`}>
                            {t.departure_risk}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-800 font-bold rounded border border-slate-300 font-mono">
                            PF {t.platform_assigned}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Incoming Feeder Trains Table */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 bg-slate-50 border-b border-slate-200">
              <h3 className="text-sm font-bold text-gov-950">
                Incoming Coaching Inflows (Feeder Trains)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Arrival quantile forecast and delay certainty feeding into platform allocation and rake links.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 uppercase text-[10px] tracking-wider font-black">
                    <th className="p-3">Train</th>
                    <th className="p-3">Origin</th>
                    <th className="p-3">Sched. Arr</th>
                    <th className="p-3">Pred. Arrival (P50)</th>
                    <th className="p-3">Quantile Range [P10-P90]</th>
                    <th className="p-3">Current Delay</th>
                    <th className="p-3">Pred. Delay</th>
                    <th className="p-3">Reliability</th>
                    <th className="p-3">Platform</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {analysis.incoming_trains.map((t) => (
                    <tr
                      key={t.train_id}
                      className="hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() => onSelectTrain && onSelectTrain(t.train_id)}
                    >
                      <td className="p-3 font-bold text-gov-950">
                        <div className="flex items-center gap-1.5">
                          <span className="bg-slate-200 text-gov-900 px-1.5 py-0.5 rounded font-mono font-bold text-[11px]">
                            {t.train_id}
                          </span>
                          <span>{t.train_name}</span>
                        </div>
                      </td>
                      <td className="p-3 font-medium text-slate-700">{t.origin_station_code}</td>
                      <td className="p-3 font-mono text-slate-600">{t.scheduled_arrival}</td>
                      <td className="p-3 font-mono font-bold text-gov-900">{t.predicted_arrival}</td>
                      <td className="p-3 font-mono text-slate-600">
                        [{t.eta_lower_bound} — {t.eta_upper_bound}]
                      </td>
                      <td className="p-3 font-mono font-semibold text-slate-700">+{t.current_delay_min}m</td>
                      <td className="p-3 font-mono font-bold text-red-700">+{t.predicted_delay_min}m</td>
                      <td className="p-3 font-bold text-gov-900">{t.reliability_score}%</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-800 font-bold rounded border border-slate-300 font-mono">
                          PF {t.platform_assigned}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PLATFORM OCCUPANCY CONFLICTS */}
      {activeTab === 'conflicts' && analysis && (
        <div className="space-y-4">
          {analysis.platform_conflicts.length === 0 ? (
            <div className="p-8 bg-white border border-slate-200 rounded-lg text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-800">No Platform Conflicts Detected</h3>
              <p className="text-xs text-slate-500 mt-1">
                All scheduled and forecasted platform occupancies maintain safe headway windows (&gt;20 minutes separation).
              </p>
            </div>
          ) : (
            analysis.platform_conflicts.map((conflict, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg border-2 border-red-300 p-4 shadow-sm space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-red-600 text-white font-black text-xs rounded">
                      PLATFORM {conflict.platform_number}
                    </span>
                    <span className="text-xs font-bold text-red-900">
                      Simultaneous Occupancy Conflict
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      Overlap Window: {conflict.overlap_window}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-red-100 text-red-800 border border-red-300 rounded">
                      {conflict.severity} SEVERITY
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-semibold text-slate-500 block mb-1">Conflicting Train Services:</span>
                    <div className="flex flex-wrap gap-2">
                      {conflict.conflicting_trains.map((tid) => (
                        <span
                          key={tid}
                          className="px-2.5 py-1 bg-slate-100 text-slate-900 font-mono font-bold rounded border border-slate-300"
                        >
                          Train #{tid}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="font-semibold text-slate-500 block mb-1">Recommended Dispatch Action:</span>
                    <div className="p-2.5 bg-amber-50 border border-amber-200 rounded text-amber-950 font-medium leading-relaxed">
                      {conflict.recommended_action}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: MULTI-HOP CASCADING DELAY TREES */}
      {activeTab === 'chains' && analysis && (
        <div className="space-y-4">
          {analysis.propagation_chains.length === 0 ? (
            <div className="p-8 bg-white border border-slate-200 rounded-lg text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-800">No Cascading Chains Active</h3>
              <p className="text-xs text-slate-500 mt-1">
                Delays are currently contained within individual trains with zero cross-train turnaround spillover.
              </p>
            </div>
          ) : (
            analysis.propagation_chains.map((chain, chainIdx) => (
              <div key={chainIdx} className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-gov-950 uppercase tracking-wider">
                    Cascading Propagation Chain #{chainIdx + 1}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {chain.length} Sequential Multi-Hop Impact Stages
                  </span>
                </div>

                {/* Horizontal Chain Flow */}
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
                  {chain.map((node, nodeIdx) => (
                    <React.Fragment key={nodeIdx}>
                      <div className="flex-1 bg-slate-50 rounded-lg border border-slate-200 p-3.5 space-y-2 hover:border-gov-700 transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase text-slate-500">
                            Stage {nodeIdx + 1}: {node.event_type}
                          </span>
                          <span className={`px-1.5 py-0.2 rounded text-[10px] ${getRiskBadge(node.risk_level)}`}>
                            {node.risk_level}
                          </span>
                        </div>

                        <div className="font-bold text-xs text-gov-950">
                          {node.train_name} ({node.train_id})
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
                          <span className="text-slate-600 font-medium">Station: {node.station_code}</span>
                          <span className="font-mono font-bold text-red-700">+{node.delay_minutes}m Delay</span>
                        </div>

                        <div className="text-[11px] text-slate-600 bg-white p-2 rounded border border-slate-200 leading-snug">
                          {node.reason}
                        </div>
                      </div>

                      {nodeIdx < chain.length - 1 && (
                        <div className="hidden lg:flex items-center justify-center text-slate-400">
                          <ArrowRight className="w-5 h-5 text-gov-800" />
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
