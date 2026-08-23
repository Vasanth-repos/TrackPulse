import React from 'react';
import { TrainLiveStatus } from '../../types/api';
import { Train, Clock, ArrowRight, ShieldCheck, AlertTriangle, AlertOctagon } from 'lucide-react';

interface EtaHeroProps {
  train: TrainLiveStatus;
}

export const EtaHero: React.FC<EtaHeroProps> = ({ train }) => {
  return (
    <div className="bg-gradient-to-b from-rail-850 to-rail-900 border border-rail-750 p-5 rounded-xl shadow-2xl relative overflow-hidden">
      {/* Subtle track background pattern */}
      <div className="absolute top-0 right-0 w-96 h-full opacity-5 pointer-events-none rail-track-line" />

      {/* Train Info Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rail-750 pb-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="text-xs font-mono font-bold bg-signal-cyan/20 text-signal-cyan px-2 py-0.5 rounded border border-signal-cyan/30">
              {train.train_id}
            </span>
            <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
              {train.train_name}
            </h1>
            <span className="text-xs text-rail-400 bg-rail-800 px-2 py-0.5 rounded font-medium border border-rail-700 hidden sm:inline-block">
              {train.train_type}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-rail-300 mt-1.5 font-medium">
            <span>Current: <strong className="text-white font-semibold">{train.current_station_name} ({train.current_station_code})</strong></span>
            <ArrowRight className="w-3.5 h-3.5 text-rail-500" />
            <span>Destination: <strong className="text-white font-semibold">{train.final_destination_name} ({train.final_destination_code})</strong></span>
          </div>
        </div>

        {/* Operating Regime Badge */}
        <div className="flex items-center space-x-2">
          <div className={`px-3 py-1.5 rounded-lg border flex items-center space-x-2 text-xs font-mono font-bold ${
            train.regime === 'NORMAL' ? 'bg-signal-green/15 text-signal-green border-signal-green/30 glow-signal-green' :
            train.regime === 'DELAYED' ? 'bg-signal-amber/15 text-signal-amber border-signal-amber/30 glow-signal-amber' :
            'bg-signal-red/15 text-signal-red border-signal-red/30 glow-signal-red'
          }`}>
            <span className="w-2 h-2 rounded-full bg-current animate-ping" />
            <span>● {train.regime} REGIME</span>
          </div>
        </div>
      </div>

      {/* Hero Display: ETA & Visual Time Window */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5 items-center">
        {/* Giant ETA Display */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="text-xs text-rail-400 font-mono uppercase tracking-widest flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-signal-cyan" />
            <span>Predicted Arrival ETA (Final)</span>
          </div>
          
          <div className="text-5xl sm:text-6xl font-black text-white tracking-tight font-mono my-1 flex items-baseline">
            <span>{train.predicted_eta}</span>
            <span className="text-sm font-sans font-medium text-rail-400 ml-2">IST</span>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <div className="text-rail-400 font-mono">
              Scheduled: <span className="text-rail-200 line-through">{train.scheduled_arrival}</span>
            </div>
            <div className="font-mono font-bold px-2 py-0.5 rounded text-xs bg-rail-800 border border-rail-700 text-signal-amber">
              {train.current_delay_min === 0 ? 'On Time' : `+${train.current_delay_min} min delay`}
            </div>
          </div>
        </div>

        {/* Visual Time-Window Uncertainty Slider */}
        <div className="lg:col-span-7 bg-rail-950/70 border border-rail-800 p-4 rounded-xl shadow-inner">
          <div className="flex items-center justify-between text-xs mb-2">
            <div className="font-mono text-rail-300 font-medium">
              Statistically Derived Arrival Window (80% CI)
            </div>
            <div className="font-mono text-signal-cyan text-xs">
              Span: ±{Math.round(train.interval_width_min / 2)} min
            </div>
          </div>

          {/* Visual Slider Envelope */}
          <div className="relative my-6 px-4">
            {/* Base Background Track */}
            <div className="h-3 bg-rail-850 rounded-full w-full relative overflow-hidden border border-rail-750">
              {/* Highlighted Uncertainty Envelope */}
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  train.regime === 'NORMAL' ? 'bg-signal-green/40 border border-signal-green/60' :
                  train.regime === 'DELAYED' ? 'bg-signal-amber/40 border border-signal-amber/60' :
                  'bg-signal-red/40 border border-signal-red/60'
                }`}
                style={{ left: '20%', width: '60%', position: 'absolute' }}
              />
            </div>

            {/* Point ETA Center Marker */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white border-2 border-signal-cyan shadow-lg shadow-signal-cyan/50 flex items-center justify-center cursor-pointer"
              style={{ left: '50%', transform: 'translate(-50%, -50%)' }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-rail-950" />
            </div>

            {/* Lower Bound Tick */}
            <div className="absolute -bottom-6 left-[20%] -translate-x-1/2 text-center">
              <span className="text-[11px] font-mono text-rail-300 font-bold block">{train.eta_lower_bound}</span>
              <span className="text-[9px] text-rail-500 font-mono">10th percentile</span>
            </div>

            {/* Point ETA Label */}
            <div className="absolute -top-6 left-[50%] -translate-x-1/2 text-center">
              <span className="text-xs font-mono text-white font-bold bg-rail-800 px-2 py-0.5 rounded border border-rail-700">
                ETA {train.predicted_eta}
              </span>
            </div>

            {/* Upper Bound Tick */}
            <div className="absolute -bottom-6 left-[80%] -translate-x-1/2 text-center">
              <span className="text-[11px] font-mono text-rail-300 font-bold block">{train.eta_upper_bound}</span>
              <span className="text-[9px] text-rail-500 font-mono">90th percentile</span>
            </div>
          </div>

          <p className="text-[11px] text-rail-400 mt-8 leading-relaxed">
            Statistically calibrated window based on section variance, delay recovery curves, and current operating regime. The train is expected to arrive within this interval.
          </p>
        </div>
      </div>
    </div>
  );
};
