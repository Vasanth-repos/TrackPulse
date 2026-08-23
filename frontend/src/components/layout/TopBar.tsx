import React, { useState, useEffect } from 'react';
import { Activity, Clock, ShieldCheck, Radio, Train } from 'lucide-react';

interface TopBarProps {
  systemFreshnessSec?: number;
  systemStatus?: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  systemFreshnessSec = 6,
  systemStatus = "OPERATIONAL_ONLINE"
}) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimeStr(now.toTimeString().split(' ')[0] + ' IST');
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-rail-900/90 backdrop-blur-md border-b border-rail-750 px-4 py-2.5 flex items-center justify-between text-xs sticky top-0 z-50">
      {/* Brand & Project Identity */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center justify-center w-8 h-8 rounded bg-gradient-to-br from-signal-cyan/20 to-signal-cyan/5 border border-signal-cyan/30 text-signal-cyan">
          <Train className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-sm tracking-wider text-white uppercase font-mono">
              RAIL<span className="text-signal-cyan">ETA</span> INTELLIGENCE
            </span>
            <span className="bg-rail-800 text-rail-300 text-[10px] px-1.5 py-0.5 rounded font-mono border border-rail-700">
              v1.0 • SIH 2026
            </span>
          </div>
          <p className="text-[11px] text-rail-400 font-sans hidden sm:block">
            Adaptive ETA Reliability & Forecasting Engine for Indian Coaching Trains
          </p>
        </div>
      </div>

      {/* System Metrics & Ticker */}
      <div className="flex items-center space-x-4">
        {/* Telemetry Freshness */}
        <div className="hidden md:flex items-center space-x-1.5 bg-rail-850 px-2.5 py-1 rounded border border-rail-750">
          <Radio className="w-3.5 h-3.5 text-signal-green animate-pulse" />
          <span className="text-rail-400">Pravah Feed:</span>
          <span className="text-signal-green font-mono font-medium">{systemFreshnessSec}s ago</span>
        </div>

        {/* System Health */}
        <div className="flex items-center space-x-1.5 bg-rail-850 px-2.5 py-1 rounded border border-rail-750">
          <div className="w-2 h-2 rounded-full bg-signal-green glow-signal-green" />
          <span className="text-white font-medium font-mono uppercase text-[11px]">
            {systemStatus === "OPERATIONAL_ONLINE" ? "LIVE STREAMING" : systemStatus}
          </span>
        </div>

        {/* Live Clock */}
        <div className="flex items-center space-x-1.5 bg-rail-800/80 px-3 py-1 rounded border border-rail-700 text-rail-200">
          <Clock className="w-3.5 h-3.5 text-signal-cyan" />
          <span className="font-mono text-xs font-semibold tracking-wider">{timeStr || '18:32:14 IST'}</span>
        </div>
      </div>
    </header>
  );
};
