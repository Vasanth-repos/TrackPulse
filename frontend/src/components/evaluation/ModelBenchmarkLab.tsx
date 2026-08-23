import React from 'react';
import { EvaluationReport } from '../../types/api';
import { BarChart3, CheckCircle2, TrendingDown, Award, Layers, Compass } from 'lucide-react';

interface ModelBenchmarkLabProps {
  report: EvaluationReport | null;
}

export const ModelBenchmarkLab: React.FC<ModelBenchmarkLabProps> = ({ report }) => {
  if (!report) {
    return (
      <div className="p-8 text-center text-rail-400 bg-rail-900 border border-rail-800 rounded-xl">
        Loading ML benchmarking lab results...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rail-900 via-rail-850 to-rail-900 border border-rail-750 p-4 rounded-xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-signal-cyan/15 border border-signal-cyan/30 flex items-center justify-center text-signal-cyan">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-mono uppercase tracking-wide">
              Official ML Forecaster & Baseline Benchmark Lab
            </h2>
            <p className="text-xs text-rail-300">
              Evaluated on chronological held-out test journeys ({report.total_test_observations} observations). No future target leakage.
            </p>
          </div>
        </div>
        <div className="text-right text-xs text-rail-400 font-mono">
          <span>Target Coverage: </span>
          <strong className="text-signal-green">80.0%</strong>
        </div>
      </div>

      {/* Main Model Comparison Table */}
      <div className="bg-rail-900 border border-rail-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="p-3.5 border-b border-rail-800 bg-rail-850/70 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-signal-cyan" />
            <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
              Primary Model Comparison Table
            </h3>
          </div>
          <span className="text-[11px] font-mono text-signal-green font-semibold">Lower Error = Superior Adherence</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-rail-950 text-rail-400 font-mono text-[11px] border-b border-rail-800">
              <tr>
                <th className="py-3 px-4">Forecasting Approach</th>
                <th className="py-3 px-4">MAE (min)</th>
                <th className="py-3 px-4">RMSE (min)</th>
                <th className="py-3 px-4">Median Error</th>
                <th className="py-3 px-4">Within ±5m</th>
                <th className="py-3 px-4">Within ±10m</th>
                <th className="py-3 px-4">80% Interval Coverage</th>
                <th className="py-3 px-4">Avg Width</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rail-800/60 font-sans">
              {report.models.map((m, idx) => {
                const isProposed = m.model_name.includes('Proposed');
                return (
                  <tr
                    key={idx}
                    className={`${isProposed ? 'bg-signal-cyan/10 font-medium' : 'hover:bg-rail-850/40'}`}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-white flex items-center space-x-2">
                      {isProposed && <CheckCircle2 className="w-4 h-4 text-signal-cyan flex-shrink-0" />}
                      <span>{m.model_name}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-sm font-bold text-white">
                      {m.mae_min} min
                    </td>
                    <td className="py-3.5 px-4 font-mono text-rail-300">
                      {m.rmse_min} min
                    </td>
                    <td className="py-3.5 px-4 font-mono text-rail-300">
                      {m.median_absolute_error_min} min
                    </td>
                    <td className="py-3.5 px-4 font-mono text-signal-green font-semibold">
                      {m.within_5_min_pct}%
                    </td>
                    <td className="py-3.5 px-4 font-mono text-signal-green font-semibold">
                      {m.within_10_min_pct}%
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      {m.observed_coverage_pct ? (
                        <span className="bg-signal-green/20 text-signal-green font-bold px-2 py-0.5 rounded border border-signal-green/30">
                          {m.observed_coverage_pct}%
                        </span>
                      ) : (
                        <span className="text-rail-600">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-rail-300">
                      {m.average_interval_width_min ? `±${Math.round(m.average_interval_width_min / 2)}m` : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Disaggregation Grid: Regime Breakdown & Calibration Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Regime Breakdown */}
        <div className="lg:col-span-6 bg-rail-900 border border-rail-800 rounded-xl p-4 shadow-xl">
          <div className="flex items-center space-x-2 border-b border-rail-800 pb-3 mb-3">
            <Layers className="w-4 h-4 text-signal-cyan" />
            <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
              Disaggregation by Operating Regime
            </h3>
          </div>

          <div className="space-y-3">
            {report.regime_breakdown.map((r, idx) => (
              <div key={idx} className="bg-rail-850 border border-rail-750 p-3 rounded-lg text-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    r.regime === 'NORMAL' ? 'bg-signal-green/20 text-signal-green border border-signal-green/30' :
                    r.regime === 'DELAYED' ? 'bg-signal-amber/20 text-signal-amber border border-signal-amber/30' :
                    'bg-signal-red/20 text-signal-red border border-signal-red/30'
                  }`}>
                    ● {r.regime} REGIME
                  </span>
                  <span className="text-rail-400 font-mono text-[11px]">n={r.sample_count} journeys</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center font-mono">
                  <div className="bg-rail-950 p-2 rounded border border-rail-800">
                    <span className="text-[9px] text-rail-500 block">PROPOSED MAE</span>
                    <strong className="text-white text-xs">{r.proposed_model_mae}m</strong>
                  </div>
                  <div className="bg-rail-950 p-2 rounded border border-rail-800">
                    <span className="text-[9px] text-rail-500 block">80% COVERAGE</span>
                    <strong className="text-signal-green text-xs">{r.proposed_model_coverage_pct}%</strong>
                  </div>
                  <div className="bg-rail-950 p-2 rounded border border-rail-800">
                    <span className="text-[9px] text-rail-500 block">AVG WIDTH</span>
                    <strong className="text-signal-cyan text-xs">±{Math.round(r.proposed_avg_width_min / 2)}m</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empirical Calibration Curve */}
        <div className="lg:col-span-6 bg-rail-900 border border-rail-800 rounded-xl p-4 shadow-xl">
          <div className="flex items-center space-x-2 border-b border-rail-800 pb-3 mb-3">
            <Compass className="w-4 h-4 text-signal-cyan" />
            <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
              Empirical Quantile Calibration Curve
            </h3>
          </div>

          <p className="text-[11px] text-rail-400 mb-3 font-sans">
            Evaluates whether the stated X% prediction interval contains actual arrival outcomes X% of the time.
          </p>

          <div className="space-y-2 font-mono text-xs">
            {report.calibration_curve.map((c, idx) => {
              const diff = Math.abs(c.observed_coverage - c.requested_coverage);
              const isClose = diff <= 2.0;

              return (
                <div key={idx} className="bg-rail-850 p-2.5 rounded border border-rail-750 flex items-center justify-between">
                  <span className="text-rail-300">Target CI: {c.requested_coverage}%</span>
                  <div className="flex items-center space-x-3">
                    <span className={`font-bold ${isClose ? 'text-signal-green' : 'text-signal-amber'}`}>
                      Observed: {c.observed_coverage}%
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded border ${
                      isClose ? 'bg-signal-green/10 text-signal-green border-signal-green/30' : 'bg-signal-amber/10 text-signal-amber border-signal-amber/30'
                    }`}>
                      {isClose ? 'Well Calibrated' : `Δ ${diff.toFixed(1)}%`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
