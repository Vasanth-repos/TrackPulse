import React from 'react';
import { CheckCircle2, History, TrendingUp } from 'lucide-react';

export const PassengerEtaStability: React.FC = () => {
  const updates = [
    { time: '14:10', eta: '14:35' },
    { time: '14:20', eta: '14:39' },
    { time: '14:30', eta: '14:42' },
    { time: '14:38', eta: '14:42' },
  ];

  return (
    <div className="gov-card p-5 bg-white border border-slate-200">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
        <h3 className="text-xs font-bold text-gov-950 uppercase tracking-wider flex items-center gap-1.5">
          <History className="w-3.5 h-3.5 text-gov-800" />
          ETA Prediction History & Reassurance
        </h3>
        
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Prediction Status:</span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            STABLE
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {updates.map((upd, idx) => {
          const isLatest = idx === updates.length - 1;

          return (
            <div
              key={upd.time}
              className={`p-2.5 rounded-lg border text-center space-y-1 ${
                isLatest
                  ? 'bg-blue-50/80 border-blue-300 ring-1 ring-blue-500 font-bold'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="text-[10px] text-slate-500 font-mono">
                Update @ {upd.time}
              </div>
              <div className="font-mono text-base font-black text-gov-950">
                {upd.eta}
              </div>
              {isLatest && (
                <span className="inline-block text-[9px] uppercase font-bold text-blue-800 bg-blue-100 px-1.5 py-0.2 rounded">
                  Current Fix
                </span>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-slate-500 mt-3">
        ✓ <strong>Reassurance:</strong> The predicted ETA has stabilized over the last 20 minutes as the train maintains cruising speed across the Ongole bypass.
      </p>
    </div>
  );
};
