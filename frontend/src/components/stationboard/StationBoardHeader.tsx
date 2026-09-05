import React from 'react';
import { Clock, Calendar, ShieldCheck, MapPin, Radio } from 'lucide-react';
import { Language, translations } from '../../utils/translations';

interface StationBoardHeaderProps {
  currentStation: string;
  onStationChange: (station: string) => void;
  currentTime: string;
  language: Language;
}

export const StationBoardHeader: React.FC<StationBoardHeaderProps> = ({
  currentStation,
  onStationChange,
  currentTime,
  language,
}) => {
  const t = translations[language];

  const stationOptions = [
    { code: 'MAS', name: 'MGR CHENNAI CENTRAL' },
    { code: 'NDLS', name: 'NEW DELHI' },
    { code: 'BZA', name: 'VIJAYAWADA JUNCTION' },
    { code: 'SBC', name: 'KSR BENGALURU CITY' },
    { code: 'HWH', name: 'HOWRAH JUNCTION' },
  ];

  return (
    <div className="bg-board-card border border-board-border p-4 rounded-lg text-white shadow-md">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        
        {/* Left: Station Identity */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono font-black text-amber-400 text-lg tracking-wider">
              {t.appName}
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs uppercase font-bold text-slate-300 tracking-wider">
              {t.stationPassengerInfo}
            </span>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <MapPin className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-bold uppercase">STATION:</span>
              {/* Station Dropdown */}
              <select
                value={currentStation}
                onChange={(e) => onStationChange(e.target.value)}
                className="bg-board-bg border border-board-border text-white text-base font-black px-2.5 py-1 rounded tracking-wide uppercase focus:outline-none focus:ring-1 focus:ring-amber-400 font-mono"
              >
                {stationOptions.map((stn) => (
                  <option key={stn.code} value={stn.name} className="bg-slate-900 text-white">
                    {stn.name} ({stn.code})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Right: Operational Status, Date & Electronic Live Clock */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 self-start lg:self-center font-mono">
          
          {/* Operational Status */}
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase font-sans">Operational Status</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              NORMAL
            </span>
          </div>

          {/* Date */}
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase font-sans">Date</span>
            <span className="text-xs font-bold text-slate-200">10 SEP 2026</span>
          </div>

          {/* Electronic Station Clock */}
          <div className="flex flex-col bg-board-bg px-4 py-1.5 rounded border border-board-border shadow-inner">
            <span className="text-[10px] text-amber-400 uppercase font-sans font-bold">Station Time</span>
            <span className="text-xl sm:text-2xl font-black text-amber-400 num-tabular tracking-wider">
              {currentTime}
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
