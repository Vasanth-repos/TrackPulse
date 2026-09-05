import React, { useState } from 'react';
import {
  WhatIfSimulateResponse,
  WhatIfSimulateRequest
} from '../../types/api';
import { simulateDelayInjection } from '../../services/api';
import {
  Sliders,
  Play,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Activity,
  GitFork,
  Clock,
  Zap,
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';

interface WhatIfSimulatorProps {
  initialTrainId?: string;
  onSelectTrain?: (trainId: string) => void;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  initialTrainId = '12627',
  onSelectTrain
}) => {
  const [trainId, setTrainId] = useState<string>(initialTrainId);
  const [delayMinutes, setDelayMinutes] = useState<number>(45);
  const [injectionStation, setInjectionStation] = useState<string>('NLR');
  const [causeCategory, setCauseCategory] = useState<string>('SECTION_HALT');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [simulationResult, setSimulationResult] = useState<WhatIfSimulateResponse | null>(null);

  const trainsList = [
    { id: '12627', name: 'Karnataka Express (SBC → NDLS)' },
    { id: '12621', name: 'Tamil Nadu Express (MAS → NDLS)' },
    { id: '12951', name: 'Mumbai Rajdhani Express (MMCT → NDLS)' },
    { id: '22691', name: 'Bengaluru Rajdhani Express (SBC → NZM)' },
    { id: '12675', name: 'Kovai Superfast Express (MAS → CBE)' },
    { id: '12007', name: 'Mysuru Shatabdi Express (MAS → MYS)' }
  ];

  const stationsList = [
    { code: 'NLR', name: 'Nellore (NLR)' },
    { code: 'BZA', name: 'Vijayawada (BZA)' },
    { code: 'BPQ', name: 'Balharshah (BPQ)' },
    { code: 'NGP', name: 'Nagpur (NGP)' },
    { code: 'BPL', name: 'Bhopal (BPL)' },
    { code: 'ET', name: 'Itarsi (ET)' },
    { code: 'AGC', name: 'Agra Cantt (AGC)' },
    { code: 'MAS', name: 'Chennai Central (MAS)' }
  ];

  const causeOptions = [
    { id: 'SECTION_HALT', label: 'Section Precedence / Freight Crossing' },
    { id: 'WEATHER_FOG', label: 'Adverse Weather / Severe Fog Condition' },
    { id: 'SIGNAL_FAILURE', label: 'Automatic Signalling Interlocking Failure' },
    { id: 'FREIGHT_CROSSING', label: 'Overdue Track Maintenance / TSR Caution Order' }
  ];

  const handleRunSimulation = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload: WhatIfSimulateRequest = {
        train_id: trainId,
        delay_injection_minutes: delayMinutes,
        injection_station_code: injectionStation,
        delay_cause_category: causeCategory
      };
      const result = await simulateDelayInjection(payload);
      setSimulationResult(result);
    } catch (err: any) {
      setError(err.message || 'Disruption simulation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setDelayMinutes(45);
    setInjectionStation('NLR');
    setCauseCategory('SECTION_HALT');
    setSimulationResult(null);
    setError(null);
  };

  const getStabilityColor = (score: number) => {
    if (score >= 80) return 'text-emerald-700 bg-emerald-100 border-emerald-300';
    if (score >= 50) return 'text-amber-800 bg-amber-100 border-amber-300';
    return 'text-red-800 bg-red-100 border-red-300';
  };

  const getRelationBadge = (relation: string) => {
    switch (relation) {
      case 'DIRECT_TARGET':
        return 'bg-blue-100 text-blue-900 border-blue-300 font-bold';
      case 'OUTGOING_RAKE_DEPENDENT':
        return 'bg-purple-100 text-purple-900 border-purple-300 font-bold';
      case 'DOWNSTREAM_CONNECTING':
        return 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Simulation Setup Control Box */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-gov-900 text-white rounded-md">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gov-950">
                What-If Disruption & Propagation Simulator
              </h2>
              <p className="text-xs text-slate-500">
                Simulate synthetic section halts or weather delays to evaluate downstream rake turnarounds and network resilience.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded text-xs border border-slate-300 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
            <button
              onClick={handleRunSimulation}
              disabled={loading}
              className="px-4 py-1.5 bg-gov-900 hover:bg-gov-950 text-white font-black rounded text-xs shadow transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <Play className={`w-3.5 h-3.5 fill-current ${loading ? 'animate-pulse' : ''}`} />
              {loading ? 'Simulating...' : 'Run What-If Simulation'}
            </button>
          </div>
        </div>

        {/* Input Parameters Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* 1. Target Train */}
          <div className="space-y-1.5">
            <label htmlFor="target-train-select" className="font-bold text-slate-700 block">
              1. Primary Target Train:
            </label>
            <select
              id="target-train-select"
              value={trainId}
              onChange={(e) => setTrainId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs font-bold text-gov-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gov-800"
            >
              {trainsList.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.id} — {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Injection Station */}
          <div className="space-y-1.5">
            <label htmlFor="disruption-location-select" className="font-bold text-slate-700 block">
              2. Disruption Location:
            </label>
            <select
              id="disruption-location-select"
              value={injectionStation}
              onChange={(e) => setInjectionStation(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs font-bold text-gov-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gov-800"
            >
              {stationsList.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Delay Cause Category */}
          <div className="space-y-1.5">
            <label htmlFor="cause-category-select" className="font-bold text-slate-700 block">
              3. Root Cause Category:
            </label>
            <select
              id="cause-category-select"
              value={causeCategory}
              onChange={(e) => setCauseCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs font-bold text-gov-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gov-800"
            >
              {causeOptions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Delay Slider & Presets */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="delay-slider" className="font-bold text-slate-700">
                4. Delay Injected:
              </label>
              <span className="font-mono font-black text-red-700 text-sm bg-red-50 px-2 py-0.5 rounded border border-red-200">
                +{delayMinutes} Minutes
              </span>
            </div>
            <input
              id="delay-slider"
              type="range"
              min={5}
              max={180}
              step={5}
              value={delayMinutes}
              onChange={(e) => setDelayMinutes(Number(e.target.value))}
              className="w-full accent-gov-900 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold">
              <span>+5m</span>
              <span>+30m</span>
              <span>+60m</span>
              <span>+120m</span>
              <span>+180m</span>
            </div>
          </div>
        </div>

        {/* Quick Scenario Preset Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-500">Quick Scenarios:</span>
          <button
            onClick={() => {
              setDelayMinutes(25);
              setInjectionStation('NLR');
              setCauseCategory('SECTION_HALT');
            }}
            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold rounded border border-slate-200 transition-colors"
          >
            Minor Precedence (+25m at NLR)
          </button>
          <button
            onClick={() => {
              setDelayMinutes(55);
              setInjectionStation('BZA');
              setCauseCategory('SIGNAL_FAILURE');
            }}
            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold rounded border border-slate-200 transition-colors"
          >
            BZA Yard Interlocking Issue (+55m)
          </button>
          <button
            onClick={() => {
              setDelayMinutes(110);
              setInjectionStation('AGC');
              setCauseCategory('WEATHER_FOG');
            }}
            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold rounded border border-slate-200 transition-colors"
          >
            Dense Northern Fog (+110m at AGC)
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded text-xs text-red-800 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Simulation Output Dashboard */}
      {simulationResult && (
        <div className="space-y-6">
          {/* Top Impact Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Stability Index */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Network Stability Index
              </span>
              <div className="mt-2 flex items-center gap-3">
                <span className={`text-2xl font-black px-3 py-1 rounded border ${getStabilityColor(simulationResult.network_stability_index)}`}>
                  {simulationResult.network_stability_index.toFixed(1)} / 100
                </span>
                <span className="text-xs text-slate-600 font-medium">
                  {simulationResult.network_stability_index > 75
                    ? 'High Network Absorption Buffer'
                    : 'Severe Cascading Vulnerability'}
                </span>
              </div>
            </div>

            {/* Injected Impact Scope */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Disruption Scope
              </span>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-2xl font-black text-gov-950">
                  {simulationResult.affected_trains.length} Trains
                </span>
                <span className="text-xs text-slate-600 font-medium">
                  Directly & Indirectly Affected
                </span>
              </div>
            </div>

            {/* Primary Shock */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Primary Disruption Injection
              </span>
              <div className="mt-2 flex items-center gap-2 font-mono text-sm font-bold text-slate-800">
                <span className="px-2 py-0.5 bg-slate-100 border border-slate-300 rounded text-gov-900">
                  Train #{simulationResult.primary_train_id}
                </span>
                <span className="text-red-700">
                  +{simulationResult.injected_delay_minutes}m @ {simulationResult.injection_station_code}
                </span>
              </div>
            </div>
          </div>

          {/* Passenger & Bottleneck Alerts */}
          <div className="space-y-3">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-xs flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-black text-amber-900 uppercase block mb-0.5">
                  Passenger Transfer & Connection Impact:
                </span>
                <p className="text-amber-950 leading-relaxed font-medium">
                  {simulationResult.passenger_connection_impact}
                </p>
              </div>
            </div>

            {simulationResult.platform_bottleneck_warning && (
              <div className="p-4 bg-red-50 border border-red-300 rounded-lg text-xs flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-black text-red-900 uppercase block mb-0.5">
                    Platform Bottleneck Warning:
                  </span>
                  <p className="text-red-950 leading-relaxed font-medium">
                    {simulationResult.platform_bottleneck_warning}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Before vs. After Impact Comparison Matrix */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 bg-slate-50 border-b border-slate-200">
              <h3 className="text-sm font-bold text-gov-950">
                Multi-Train Cascading Impact Analysis (Baseline vs. Simulated)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Exact delta metrics showing propagated arrival times, turnaround depletion, and reliability degradation.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 uppercase text-[10px] tracking-wider font-black">
                    <th className="p-3">Affected Train</th>
                    <th className="p-3">Coupling Type</th>
                    <th className="p-3">Baseline Delay</th>
                    <th className="p-3">Simulated Delay</th>
                    <th className="p-3">Delay Delta</th>
                    <th className="p-3">Simulated ETA</th>
                    <th className="p-3">Reliability Shift</th>
                    <th className="p-3">Cascading Root Cause</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {simulationResult.affected_trains.map((t) => {
                    const reliabilityDelta = t.simulated_reliability - t.baseline_reliability;
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

                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] border ${getRelationBadge(t.dependency_relation)}`}>
                            {t.dependency_relation.replace(/_/g, ' ')}
                          </span>
                        </td>

                        <td className="p-3 font-mono text-slate-600">
                          +{t.baseline_delay_min}m
                        </td>

                        <td className="p-3 font-mono font-black text-gov-950">
                          +{t.simulated_delay_min}m
                        </td>

                        <td className="p-3">
                          {t.delay_delta_min > 0 ? (
                            <span className="px-2 py-0.5 bg-red-100 text-red-900 font-mono font-bold rounded border border-red-200">
                              +{t.delay_delta_min}m Shift
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 font-mono font-bold rounded border border-emerald-200">
                              0m (Unaffected)
                            </span>
                          )}
                        </td>

                        <td className="p-3 font-mono text-xs">
                          <div className="text-slate-500 line-through text-[11px]">
                            {t.baseline_eta}
                          </div>
                          <div className="font-bold text-gov-950">
                            {t.simulated_eta}
                          </div>
                        </td>

                        <td className="p-3">
                          <div className="flex items-center gap-1.5 font-bold">
                            <span className="text-gov-950">{t.simulated_reliability}%</span>
                            <span className={`text-[10px] ${reliabilityDelta < 0 ? 'text-red-600' : 'text-slate-500'}`}>
                              ({reliabilityDelta > 0 ? `+${reliabilityDelta}` : reliabilityDelta}%)
                            </span>
                          </div>
                        </td>

                        <td className="p-3 text-[11px] text-slate-700 leading-snug font-medium max-w-xs">
                          {t.cascade_reason}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
