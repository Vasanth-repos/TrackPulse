import React from 'react';
import { ArrowRight, ShieldCheck, Clock, Navigation, AlertTriangle } from 'lucide-react';
import { TrainLiveStatus } from '../../types/api';

interface TrainDetailHeaderProps {
  train: TrainLiveStatus;
}

export const TrainDetailHeader: React.FC<TrainDetailHeaderProps> = ({ train }) => {
  // Status color codes
  let statusBadge = 'bg-emerald-50 text-emerald-800 border-emerald-300';
  let delayBadge = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  if (train.regime === 'DELAYED') {
    statusBadge = 'bg-amber-50 text-amber-900 border-amber-300';
    delayBadge = 'text-amber-800 bg-amber-50 border-amber-200';
  } else if (train.regime === 'DISRUPTED') {
    statusBadge = 'bg-red-50 text-red-900 border-red-300';
    delayBadge = 'text-red-800 bg-red-50 border-red-200';
  }

  let relBadge = 'bg-emerald-100 text-emerald-900 border-emerald-300';
  if (train.reliability_category === 'MEDIUM') {
    relBadge = 'bg-amber-100 text-amber-900 border-amber-300';
  } else if (train.reliability_category === 'LOW') {
    relBadge = 'bg-red-100 text-red-900 border-red-300';
  }

  return (
    <div className="gov-card p-5 bg-white border-l-4 border-l-gov-900 shadow-sm">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        
        {/* Left: Train Identity & Route */}
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono font-black text-2xl text-gov-950">
              {train.train_id}
            </span>
            <span className="text-slate-400 text-xl font-light">—</span>
            <h1 className="text-xl font-black text-gov-900">
              {train.train_name}
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200 uppercase">
              {train.train_type}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
            <span>{train.current_station_name}</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-gov-900 font-bold">{train.final_destination_name}</span>
            <span className="text-xs text-slate-400">({train.final_destination_code})</span>
          </div>
        </div>

        {/* Right: Operational Metric Badges */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Operational Status */}
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</span>
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold border uppercase ${statusBadge}`}>
              <span className="w-2 h-2 rounded-full bg-current"></span>
              {train.regime}
            </span>
          </div>

          {/* Current Delay */}
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Current Delay</span>
            <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-bold font-mono border ${delayBadge}`}>
              {train.current_delay_min === 0 ? 'On Time' : `+${train.current_delay_min} min`}
            </span>
          </div>

          {/* Calibrated Reliability */}
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Reliability</span>
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold border ${relBadge}`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              {train.reliability_category} ({train.reliability_score} / 100)
            </span>
          </div>

          {/* Expected Arrival ETA */}
          <div className="flex flex-col bg-gov-900 text-white px-3.5 py-1.5 rounded-md shadow-xs">
            <span className="text-[10px] font-semibold text-blue-200 uppercase tracking-wider">Expected ETA</span>
            <span className="font-mono font-black text-lg leading-tight">
              {train.predicted_eta}
            </span>
          </div>

          {/* Uncertainty Range */}
          <div className="flex flex-col bg-slate-100 text-slate-800 px-3 py-1.5 rounded-md border border-slate-200">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Estimated Range</span>
            <span className="font-mono font-bold text-xs text-slate-700 leading-tight">
              {train.eta_lower_bound} – {train.eta_upper_bound}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
