import React, { useState } from 'react';
import {
  UserRequirementRequest,
  UserRequirementResponse,
  CandidateTrainScore
} from '../../types/api';
import { fetchTrainRecommendations } from '../../services/api';
import {
  Search,
  Sparkles,
  ShieldCheck,
  Clock,
  Calendar,
  AlertCircle,
  Sliders,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Train,
  Check,
  Info
} from 'lucide-react';

interface PassengerRequirementPlannerProps {
  onSelectTrain?: (trainId: string) => void;
}

export const PassengerRequirementPlanner: React.FC<PassengerRequirementPlannerProps> = ({
  onSelectTrain
}) => {
  const [source, setSource] = useState('MAS');
  const [destination, setDestination] = useState('CBE');
  const [journeyDate, setJourneyDate] = useState('2026-09-10');
  const [windowStart, setWindowStart] = useState('06:00');
  const [windowEnd, setWindowEnd] = useState('22:00');
  const [maxDelayTolerance, setMaxDelayTolerance] = useState<number>(30);
  const [connectionRequired, setConnectionRequired] = useState<boolean>(false);
  const [connectingTime, setConnectingTime] = useState<string>('20:30');
  const [userPriority, setUserPriority] = useState<string>('BALANCED');

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<UserRequirementResponse | null>(null);

  const stations = [
    { code: 'MAS', name: 'Chennai Central (MAS)' },
    { code: 'CBE', name: 'Coimbatore Jn (CBE)' },
    { code: 'SBC', name: 'KSR Bengaluru (SBC)' },
    { code: 'NDLS', name: 'New Delhi (NDLS)' },
    { code: 'BZA', name: 'Vijayawada Jn (BZA)' },
    { code: 'BPL', name: 'Bhopal Jn (BPL)' }
  ];

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload: UserRequirementRequest = {
        source,
        destination,
        journey_date: journeyDate,
        departure_window_start: windowStart,
        departure_window_end: windowEnd,
        max_acceptable_delay_min: maxDelayTolerance,
        connection_required: connectionRequired,
        connecting_departure_time: connectionRequired ? connectingTime : null,
        user_priority: userPriority
      };
      const res = await fetchTrainRecommendations(payload);
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Failed to generate train recommendations');
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'HIGH':
      case 'LIKELY_MISSED':
        return 'bg-red-100 text-red-900 border-red-300 font-bold';
      case 'MEDIUM':
      case 'AT_RISK':
        return 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
      default:
        return 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Requirement Filter Form */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-gov-900 text-white rounded-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gov-950">
                Passenger Journey & Multi-Factor Train Recommendation Engine
              </h2>
              <p className="text-xs text-slate-500">
                Find optimal trains based on your departure window, historical punctuality, calibrated ETA confidence, and connecting train safety.
              </p>
            </div>
          </div>

          <span className="px-2.5 py-1 bg-gov-50 text-gov-800 text-[11px] font-bold rounded border border-gov-200 shrink-0">
            SIH26028 PASSENGER ENGINE
          </span>
        </div>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* Origin */}
            <div className="space-y-1">
              <label htmlFor="origin-station-select" className="font-bold text-slate-700 block">Origin Station:</label>
              <select
                id="origin-station-select"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded p-2 font-bold text-gov-950 focus:bg-white text-xs focus:ring-1 focus:ring-gov-800"
              >
                {stations.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Destination */}
            <div className="space-y-1">
              <label htmlFor="destination-station-select" className="font-bold text-slate-700 block">Destination Station:</label>
              <select
                id="destination-station-select"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded p-2 font-bold text-gov-950 focus:bg-white text-xs focus:ring-1 focus:ring-gov-800"
              >
                {stations.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Journey Date */}
            <div className="space-y-1">
              <label htmlFor="journey-date-input" className="font-bold text-slate-700 block">Journey Date:</label>
              <input
                id="journey-date-input"
                type="date"
                value={journeyDate}
                onChange={(e) => setJourneyDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded p-2 font-bold text-gov-950 focus:bg-white text-xs focus:ring-1 focus:ring-gov-800"
              />
            </div>

            {/* Priority Mode */}
            <div className="space-y-1">
              <label htmlFor="user-priority-select" className="font-bold text-slate-700 block">Decision Priority:</label>
              <select
                id="user-priority-select"
                value={userPriority}
                onChange={(e) => setUserPriority(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded p-2 font-bold text-gov-950 focus:bg-white text-xs focus:ring-1 focus:ring-gov-800"
              >
                <option value="BALANCED">Balanced (Reliability + Punctuality)</option>
                <option value="PUNCTUALITY">Maximum Punctuality (Least Delay)</option>
                <option value="RELIABILITY">Maximum Confidence (Predictable ETA)</option>
                <option value="FASTEST">Fastest Total Transit Time</option>
              </select>
            </div>
          </div>

          {/* Secondary Filters: Departure Window & Delay Tolerance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs pt-2 border-t border-slate-100 items-center">
            <div className="space-y-1">
              <label htmlFor="window-start-input" className="font-bold text-slate-700 block">Departure Window (Start):</label>
              <input
                id="window-start-input"
                type="time"
                value={windowStart}
                onChange={(e) => setWindowStart(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded p-1.5 font-bold text-slate-800 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="window-end-input" className="font-bold text-slate-700 block">Departure Window (End):</label>
              <input
                id="window-end-input"
                type="time"
                value={windowEnd}
                onChange={(e) => setWindowEnd(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded p-1.5 font-bold text-slate-800 text-xs"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <label htmlFor="tolerance-slider" className="font-bold text-slate-700">Max Delay Tolerance:</label>
                <span className="font-mono font-bold text-gov-900">+{maxDelayTolerance} min</span>
              </div>
              <input
                id="tolerance-slider"
                type="range"
                min={15}
                max={90}
                step={15}
                value={maxDelayTolerance}
                onChange={(e) => setMaxDelayTolerance(Number(e.target.value))}
                className="w-full accent-gov-900 cursor-pointer"
              />
            </div>

            {/* Connection Checkbox & Connecting Train Time */}
            <div className="space-y-1 bg-slate-50 p-2.5 rounded border border-slate-200">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="chk-conn"
                  checked={connectionRequired}
                  onChange={(e) => setConnectionRequired(e.target.checked)}
                  className="rounded text-gov-900 focus:ring-gov-800"
                />
                <label htmlFor="chk-conn" className="font-bold text-slate-800 cursor-pointer">
                  Catching a Connecting Train
                </label>
              </div>
              {connectionRequired && (
                <div className="flex items-center gap-1.5 mt-1.5">
                  <label htmlFor="connection-departure-time" className="text-[11px] text-slate-600 font-medium">Connecting Dep:</label>
                  <input
                    id="connection-departure-time"
                    type="time"
                    value={connectingTime}
                    onChange={(e) => setConnectingTime(e.target.value)}
                    className="bg-white border border-slate-300 rounded px-1.5 py-0.5 text-xs font-bold font-mono"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gov-900 hover:bg-gov-950 text-white font-black rounded text-xs shadow transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Search className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Evaluating Train Network...' : 'Find Best Trains for My Schedule'}
            </button>
          </div>
        </form>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded text-xs text-red-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Results View */}
      {result && (
        <div className="space-y-6">
          {/* Header & Weights Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white p-3.5 rounded-lg border border-slate-200">
            <div className="text-xs text-slate-700">
              Found <strong className="text-gov-950">{result.total_candidates_found} candidate services</strong> for{' '}
              <strong className="text-gov-950">{result.source} → {result.destination}</strong> on {result.journey_date}.
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-600 font-semibold">
              <span className="text-slate-400">Multi-Factor Weights:</span>
              <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                Arrival: {(result.scoring_weights_used.arrival_quality * 100).toFixed(0)}%
              </span>
              <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                Reliability: {(result.scoring_weights_used.reliability * 100).toFixed(0)}%
              </span>
              <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                Punctuality: {(result.scoring_weights_used.punctuality * 100).toFixed(0)}%
              </span>
              <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                Safety: {(result.scoring_weights_used.connection_safety * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          {/* 1. PRIMARY RECOMMENDED TRAIN CARD */}
          {result.recommended_train && (
            <div className="bg-white rounded-xl border-2 border-emerald-600 shadow-md overflow-hidden">
              <div className="bg-emerald-700 text-white px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 fill-emerald-200 text-emerald-800" />
                  <span className="font-black text-xs uppercase tracking-wider">
                    Official TrackPulse Recommended Option
                  </span>
                </div>
                <span className="bg-emerald-900/60 text-emerald-100 px-2 py-0.5 rounded text-[11px] font-bold font-mono">
                  Score: {result.recommended_train.overall_recommendation_score.toFixed(1)} / 100
                </span>
              </div>

              <div className="p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-black text-gov-950">
                        {result.recommended_train.train_id} — {result.recommended_train.train_name}
                      </span>
                      <span className="px-2 py-0.5 bg-gov-100 text-gov-800 text-[11px] font-bold rounded">
                        {result.recommended_train.train_type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Route: {result.recommended_train.origin_station_code} → {result.recommended_train.destination_station_code}
                    </p>
                  </div>

                  <button
                    onClick={() => onSelectTrain && onSelectTrain(result.recommended_train!.train_id)}
                    className="px-3.5 py-1.5 bg-gov-900 hover:bg-gov-950 text-white rounded text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <Train className="w-3.5 h-3.5" />
                    Inspect Live Journey Track
                  </button>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-50 p-3 rounded border border-slate-200">
                    <span className="text-slate-500 font-semibold block text-[11px]">Departure Time</span>
                    <div className="font-mono font-bold text-gov-950 text-sm mt-0.5">
                      {result.recommended_train.scheduled_departure}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded border border-slate-200">
                    <span className="text-slate-500 font-semibold block text-[11px]">Predicted Arrival (P50)</span>
                    <div className="font-mono font-bold text-gov-950 text-sm mt-0.5">
                      {result.recommended_train.predicted_arrival}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Sched: {result.recommended_train.scheduled_arrival}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded border border-slate-200">
                    <span className="text-slate-500 font-semibold block text-[11px]">Calibrated Confidence</span>
                    <div className="font-bold text-gov-950 text-sm mt-0.5">
                      {(result.recommended_train.reliability_score * 100).toFixed(0)}% Reliable
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Interval: [{result.recommended_train.eta_p10} - {result.recommended_train.eta_p90}]
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded border border-slate-200">
                    <span className="text-slate-500 font-semibold block text-[11px]">Connection Status</span>
                    <div className="mt-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] border ${getRiskBadge(result.recommended_train.connection_risk)}`}>
                        {result.recommended_train.connection_risk}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Plain-Language Justification Points */}
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-3.5 space-y-1.5">
                  <span className="text-xs font-bold text-emerald-950 block">
                    Why this train is recommended for your journey:
                  </span>
                  <ul className="space-y-1 text-xs text-emerald-900 font-medium">
                    {result.recommended_train.reasons.map((reason, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* 2. ALTERNATIVE TRAINS TABLE */}
          {result.alternative_trains.length > 0 && (
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-4 bg-slate-50 border-b border-slate-200">
                <h3 className="text-sm font-bold text-gov-950">
                  Alternative Train Options ({result.alternative_trains.length} ranked services)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Compare trade-offs between departure timing, predicted delays, confidence score, and connection certainty.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 uppercase text-[10px] tracking-wider font-black">
                      <th className="p-3">Rank & Train</th>
                      <th className="p-3">Departure</th>
                      <th className="p-3">Sched. Arr</th>
                      <th className="p-3">Pred. Arrival (P50)</th>
                      <th className="p-3">P10 - P90 Width</th>
                      <th className="p-3">Reliability</th>
                      <th className="p-3">Delay Risk</th>
                      <th className="p-3">Transfer Risk</th>
                      <th className="p-3">Composite Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {result.alternative_trains.map((t, idx) => (
                      <tr
                        key={t.train_id}
                        className="hover:bg-slate-50 transition-colors cursor-pointer"
                        onClick={() => onSelectTrain && onSelectTrain(t.train_id)}
                      >
                        <td className="p-3 font-bold text-gov-950">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                              #{idx + 2}
                            </span>
                            <div>
                              <div>{t.train_name}</div>
                              <span className="font-mono text-[11px] text-slate-500">#{t.train_id} ({t.train_type})</span>
                            </div>
                          </div>
                        </td>

                        <td className="p-3 font-mono font-medium text-slate-700">{t.scheduled_departure}</td>
                        <td className="p-3 font-mono text-slate-500">{t.scheduled_arrival}</td>
                        <td className="p-3 font-mono font-bold text-gov-950">{t.predicted_arrival}</td>
                        <td className="p-3 font-mono text-slate-600">±{t.interval_width_min} min</td>
                        <td className="p-3 font-bold text-slate-800">
                          {(t.reliability_score * 100).toFixed(0)}%
                        </td>

                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] border ${getRiskBadge(t.delay_risk)}`}>
                            {t.delay_risk}
                          </span>
                        </td>

                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] border ${getRiskBadge(t.connection_risk)}`}>
                            {t.connection_risk}
                          </span>
                        </td>

                        <td className="p-3 font-mono font-black text-gov-950">
                          {t.overall_recommendation_score.toFixed(1)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
