import React from 'react';
import { Radio, AlertCircle, Info, ShieldCheck } from 'lucide-react';

interface StationSelectedTrainProps {
  trainNo: string;
}

export const StationSelectedTrain: React.FC<StationSelectedTrainProps> = ({ trainNo = '12627' }) => {
  return (
    <div className="bg-board-card border-2 border-amber-400/80 rounded-lg p-5 text-white shadow-2xl relative overflow-hidden font-mono">
      
      {/* Top Spotlight Header */}
      <div className="flex items-center justify-between border-b border-board-border pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping"></span>
          <span className="font-sans font-black text-amber-400 uppercase tracking-widest text-sm">
            NEXT ARRIVAL SPOTLIGHT
          </span>
        </div>

        <span className="text-xs bg-board-bg text-slate-300 px-2 py-0.5 rounded border border-board-border">
          Selected Coaching Train
        </span>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center items-center">
        
        {/* Train No & Name */}
        <div className="lg:col-span-2 text-left sm:border-r border-board-border pr-2">
          <div className="font-black text-2xl sm:text-3xl text-amber-300">
            {trainNo}
          </div>
          <div className="font-sans font-bold text-base text-white">
            Karnataka Express
          </div>
          <div className="font-sans text-xs text-slate-400">
            Route: Chennai Central → New Delhi
          </div>
        </div>

        {/* Expected ETA */}
        <div className="bg-board-bg p-3 rounded border border-board-border">
          <div className="text-[10px] text-slate-400 uppercase font-sans">Expected Arrival</div>
          <div className="text-2xl font-black text-white">14:42</div>
        </div>

        {/* Uncertainty Range */}
        <div className="bg-board-bg p-3 rounded border border-board-border">
          <div className="text-[10px] text-slate-400 uppercase font-sans">Estimated Range</div>
          <div className="text-sm font-bold text-slate-200">14:35 – 14:52</div>
        </div>

        {/* Platform */}
        <div className="bg-amber-400 text-board-bg p-3 rounded">
          <div className="text-[10px] uppercase font-sans font-bold">Platform</div>
          <div className="text-3xl font-black">5</div>
        </div>

        {/* Reliability & Status */}
        <div className="bg-board-bg p-3 rounded border border-board-border text-center">
          <div className="text-[10px] text-slate-400 uppercase font-sans">Reliability / Status</div>
          <div className="text-sm font-bold text-amber-400">MEDIUM</div>
          <div className="text-xs font-bold text-amber-300">DELAYED (+18m)</div>
        </div>

      </div>

      {/* Station Announcement Directive */}
      <div className="mt-4 pt-3 border-t border-board-border flex items-center gap-2 text-xs font-sans text-amber-200">
        <Radio className="w-4 h-4 text-amber-400 flex-shrink-0 animate-pulse" />
        <span>
          <strong>Station Audio Broadcast:</strong> "Passengers are advised to remain attentive to platform announcements and electronic coach guidance displays."
        </span>
      </div>

    </div>
  );
};
