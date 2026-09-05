import React, { useState } from 'react';
import { AlertTriangle, ShieldCheck, AlertOctagon, ArrowRight, Clock, Info } from 'lucide-react';

export const ConnectionRiskAnalyzer: React.FC = () => {
  const [connectingTrain, setConnectingTrain] = useState('12840 (Chennai - Howrah Mail)');
  const [connectingDeparture, setConnectingDeparture] = useState('15:00');
  const [arrivalEta, setArrivalEta] = useState('14:42');
  const [etaUpper, setEtaUpper] = useState('14:52');

  // Three states: SAFE, AT RISK, LIKELY MISSED
  const [riskState, setRiskState] = useState<'AT_RISK' | 'SAFE' | 'LIKELY_MISSED'>('AT_RISK');

  let riskBadge = 'bg-amber-50 text-amber-900 border-amber-300';
  let RiskIcon = AlertTriangle;
  let reasonText = 'Upper ETA estimate (14:52) leaves only 8 minutes before departure, violating the recommended 20-minute transfer buffer.';

  if (riskState === 'SAFE') {
    riskBadge = 'bg-emerald-50 text-emerald-900 border-emerald-300';
    RiskIcon = ShieldCheck;
    reasonText = 'Upper ETA estimate leaves over 35 minutes transfer time between platform 2 and platform 7.';
  } else if (riskState === 'LIKELY_MISSED') {
    riskBadge = 'bg-red-50 text-red-900 border-red-300';
    RiskIcon = AlertOctagon;
    reasonText = 'Expected arrival overlaps or exceeds connecting train departure time.';
  }

  const handleToggleState = (state: 'SAFE' | 'AT_RISK' | 'LIKELY_MISSED') => {
    setRiskState(state);
    if (state === 'SAFE') {
      setConnectingDeparture('15:45');
    } else if (state === 'AT_RISK') {
      setConnectingDeparture('15:00');
    } else {
      setConnectingDeparture('14:40');
    }
  };

  return (
    <div className="gov-card p-5 bg-white border border-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-2 mb-3 gap-2">
        <div>
          <h3 className="text-xs font-bold text-gov-950 uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
            Connecting Train Transfer Risk Analysis
          </h3>
          <p className="text-[11px] text-slate-500">
            Actionable connection confidence derived from upper quantile uncertainty bounds
          </p>
        </div>

        {/* Demo Scenario State Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded border border-slate-200 text-xs">
          <button
            onClick={() => handleToggleState('SAFE')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              riskState === 'SAFE' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
            }`}
          >
            Safe
          </button>
          <button
            onClick={() => handleToggleState('AT_RISK')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              riskState === 'AT_RISK' ? 'bg-white text-amber-800 shadow-xs' : 'text-slate-600'
            }`}
          >
            At Risk
          </button>
          <button
            onClick={() => handleToggleState('LIKELY_MISSED')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              riskState === 'LIKELY_MISSED' ? 'bg-white text-red-800 shadow-xs' : 'text-slate-600'
            }`}
          >
            Likely Missed
          </button>
        </div>
      </div>

      {/* Main Connection Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-3">
        {/* Item 1: Your Incoming Train */}
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-500">Your Incoming Train</div>
          <div className="font-bold text-xs text-gov-950">12627 Karnataka Express</div>
          <div className="font-mono text-xs text-slate-700">
            Arrival ETA: <strong>{arrivalEta}</strong>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            Range: 14:35 – {etaUpper}
          </div>
        </div>

        {/* Item 2: Next Connecting Train */}
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-500">Your Next Connecting Train</div>
          <div className="font-bold text-xs text-gov-950">{connectingTrain}</div>
          <div className="font-mono text-xs text-slate-700">
            Departure: <strong className="text-gov-900">{connectingDeparture}</strong>
          </div>
          <div className="text-[10px] text-slate-500">
            Transfer Station: Vijayawada (BZA)
          </div>
        </div>

        {/* Item 3: Connection Risk Evaluation */}
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-2">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-500">Connection Risk</div>
            <div className="mt-1">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-black uppercase border ${riskBadge}`}>
                <RiskIcon className="w-4 h-4" />
                {riskState.replace('_', ' ')}
              </span>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 font-medium">
            Based on current ETA uncertainty
          </div>
        </div>
      </div>

      {/* Narrative Explanation */}
      <div className="p-3 rounded-md bg-amber-50/80 border border-amber-200 text-xs text-amber-950 space-y-1">
        <div>
          <strong>Transfer Assessment:</strong> {reasonText}
        </div>
        <div className="text-[11px] text-amber-900/80">
          Tip: Station master transfer desks recommend a minimum 25-minute buffer between long-distance connecting coaching rakes at junction stations.
        </div>
      </div>
    </div>
  );
};
