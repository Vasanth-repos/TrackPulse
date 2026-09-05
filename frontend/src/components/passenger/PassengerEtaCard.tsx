import React from 'react';
import { ArrowRight, ShieldCheck, Clock, AlertTriangle, Info, MapPin } from 'lucide-react';
import { TrainLiveStatus } from '../../types/api';
import { Language, translations } from '../../utils/translations';

interface PassengerEtaCardProps {
  train: TrainLiveStatus;
  selectedStationCode?: string;
  language: Language;
}

export const PassengerEtaCard: React.FC<PassengerEtaCardProps> = ({
  train,
  selectedStationCode = 'BZA',
  language,
}) => {
  const t = translations[language];

  // Reliability styling
  let relBadge = 'bg-emerald-100 text-emerald-900 border-emerald-300';
  if (train.reliability_category === 'MEDIUM') {
    relBadge = 'bg-amber-100 text-amber-900 border-amber-300';
  } else if (train.reliability_category === 'LOW') {
    relBadge = 'bg-red-100 text-red-900 border-red-300';
  }

  // Delay styling
  let delayText = 'On Time';
  let delayClass = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  if (train.current_delay_min > 0) {
    delayText = `Delayed by ${train.current_delay_min} min`;
    delayClass = 'text-amber-800 bg-amber-50 border-amber-200';
  }

  return (
    <div className="gov-card p-6 sm:p-8 bg-white border-2 border-slate-300 shadow-sm relative overflow-hidden">
      
      {/* Top Train Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-gov-950">
              {train.train_name}
            </h2>
            <span className="font-mono text-base font-black px-2 py-0.5 rounded bg-gov-900 text-white">
              {train.train_id}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 font-medium mt-1">
            <span>{train.current_station_name}</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-gov-900 font-bold">{train.final_destination_name}</span>
          </div>
        </div>

        {/* Selected Target Station Badge */}
        <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-md px-3 py-1.5 self-start sm:self-center">
          <MapPin className="w-4 h-4 text-blue-700" />
          <div className="text-left">
            <div className="text-[10px] uppercase font-bold text-blue-800">Target Station</div>
            <div className="text-xs font-black text-gov-950">
              {selectedStationCode === 'BZA' ? 'Vijayawada Junction' : train.next_station_name} ({selectedStationCode || train.next_station_code})
            </div>
          </div>
        </div>
      </div>

      {/* Hero ETA Display Grid */}
      <div className="py-6 sm:py-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Left 7 Cols: Massive Bold ETA & Estimated Range */}
        <div className="md:col-span-7 space-y-2 text-center md:text-left">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {t.expectedArrival}
          </div>

          <div className="font-mono font-black text-5xl sm:text-6xl text-gov-950 tracking-tight leading-none">
            {train.predicted_eta}
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs">
            <span className="font-semibold text-slate-600 uppercase tracking-wide">
              {t.estimatedRange}:
            </span>
            <span className="font-mono font-bold text-sm bg-slate-100 text-slate-900 px-2.5 py-1 rounded border border-slate-300">
              {train.eta_lower_bound} – {train.eta_upper_bound}
            </span>
          </div>
        </div>

        {/* Right 5 Cols: Reliability & Operational Status Badges */}
        <div className="md:col-span-5 space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
          
          {/* Reliability Factor */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 uppercase">{t.reliability}:</span>
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold border ${relBadge}`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              {train.reliability_category} ({train.reliability_score}/100)
            </span>
          </div>

          {/* Current Delay */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 uppercase">Current Status:</span>
            <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-bold border ${delayClass}`}>
              {delayText}
            </span>
          </div>

          {/* Reason */}
          <div className="text-[11px] text-slate-600 pt-1 border-t border-slate-200">
            <strong className="text-slate-800">Reason:</strong> Delay trend is increasing due to section runtime deceleration.
          </div>

          {/* Last Updated */}
          <div className="text-[10px] text-slate-400 font-mono text-right">
            {t.lastUpdate}: 14:38:20
          </div>

        </div>

      </div>

      {/* Mandatory Official Disclaimer */}
      <div className="border-t border-slate-200 pt-3 flex items-start gap-2 text-[11px] text-slate-500">
        <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
        <p>
          <strong>Public Service Notice:</strong> Arrival times are statistical estimates derived from live section telemetry and gradient quantile models. Arrival times may change as train running conditions and track clearings develop.
        </p>
      </div>

    </div>
  );
};
