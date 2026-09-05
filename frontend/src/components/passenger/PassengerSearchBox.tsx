import React, { useState } from 'react';
import { Search, History, Sparkles, Train, ArrowRight } from 'lucide-react';
import { Language, translations } from '../../utils/translations';
import { TrainLiveStatus } from '../../types/api';

interface PassengerSearchBoxProps {
  language: Language;
  onSearch: (trainId: string, stationCode?: string) => void;
  trains: TrainLiveStatus[];
  currentTrainId: string;
}

export const PassengerSearchBox: React.FC<PassengerSearchBoxProps> = ({
  language,
  onSearch,
  trains,
  currentTrainId,
}) => {
  const t = translations[language];
  const [trainInput, setTrainInput] = useState(currentTrainId || '12627');
  const [stationInput, setStationInput] = useState('BZA');
  const [showRecent, setShowRecent] = useState(false);

  const quickPicks = [
    { id: '12627', name: '12627 Karnataka Exp (MAS → NDLS)', stn: 'BZA' },
    { id: '12628', name: '12628 Karnataka Exp (NDLS → MAS)', stn: 'MAS' },
    { id: '12840', name: '12840 Chennai-Howrah Mail', stn: 'VSKP' },
    { id: '12640', name: '12640 Brindavan Exp (MAS → SBC)', stn: 'KPD' },
    { id: '12951', name: '12951 Mumbai Rajdhani', stn: 'KOTA' },
    { id: '12301', name: '12301 Howrah Rajdhani', stn: 'GAYA' },
    { id: '22436', name: '22436 Vande Bharat Exp', stn: 'CNB' },
  ];

  const recentSearches = [
    { id: '12627', name: 'Karnataka Express', stn: 'BZA' },
    { id: '12840', name: 'Chennai - Howrah Mail', stn: 'OGL' },
    { id: '12007', name: 'Shatabdi Express', stn: 'SBC' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trainInput.trim()) {
      onSearch(trainInput.trim(), stationInput.trim());
    }
  };

  const handlePick = (trainId: string, stn: string) => {
    setTrainInput(trainId);
    setStationInput(stn);
    onSearch(trainId, stn);
    setShowRecent(false);
  };

  return (
    <div className="gov-card p-5 bg-white border border-slate-200">
      <div className="max-w-3xl mx-auto space-y-4">
        
        {/* Title */}
        <div className="text-center space-y-1">
          <h2 className="text-xl font-black text-gov-950">
            {t.checkEta}
          </h2>
          <p className="text-xs text-slate-500">
            Statistical arrival forecasting with calibrated uncertainty intervals for coaching passengers
          </p>
        </div>

        {/* Main Search Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
            
            {/* Train Number Input */}
            <div className="sm:col-span-7 relative">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                {t.trainNo}
              </label>
              <div className="relative">
                <Train className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={trainInput}
                  onChange={(e) => setTrainInput(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-md text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gov-800 focus:border-gov-800"
                  required
                />
              </div>
            </div>

            {/* Optional Station Code Input */}
            <div className="sm:col-span-3">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Station Code <span className="text-slate-400 font-normal">(Opt)</span>
              </label>
              <input
                type="text"
                value={stationInput}
                onChange={(e) => setStationInput(e.target.value.toUpperCase())}
                placeholder="e.g. BZA"
                maxLength={5}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-md text-sm font-mono font-bold text-slate-900 placeholder-slate-400 uppercase focus:outline-none focus:ring-2 focus:ring-gov-800 focus:border-gov-800 text-center"
              />
            </div>

            {/* Search Button */}
            <div className="sm:col-span-2 flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 bg-gov-900 hover:bg-gov-950 text-white font-bold rounded-md text-xs uppercase tracking-wider transition-colors shadow-xs flex items-center justify-center gap-1.5 h-[42px]"
                id="btn-passenger-check-eta"
              >
                <Search className="w-4 h-4" />
                {t.checkEta}
              </button>
            </div>
          </div>

          {/* Quick Shortcuts: Use My Journey & Recent Searches */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handlePick('12627', 'BZA')}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-gov-800 hover:text-gov-950 bg-gov-50 hover:bg-gov-100 px-2.5 py-1 rounded border border-gov-200 transition-colors"
              >
                <Sparkles className="w-3 h-3 text-gov-700" />
                {t.useMyJourney} (12627 → BZA)
              </button>

              <button
                type="button"
                onClick={() => setShowRecent(!showRecent)}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded border border-slate-200 transition-colors"
              >
                <History className="w-3 h-3" />
                {t.recentSearches}
              </button>
            </div>

            {/* Quick Train Chips */}
            <div className="hidden md:flex items-center gap-1.5 text-[11px] text-slate-500">
              <span className="font-semibold">Quick:</span>
              {quickPicks.slice(0, 4).map((qp) => (
                <button
                  key={qp.id}
                  type="button"
                  onClick={() => handlePick(qp.id, qp.stn)}
                  className="font-mono text-gov-800 hover:underline px-1 py-0.5"
                >
                  {qp.id}
                </button>
              ))}
            </div>
          </div>

          {/* Recent Searches Dropdown Drawer */}
          {showRecent && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-md space-y-2 mt-2">
              <div className="text-[11px] font-bold text-slate-600 uppercase">
                {t.recentSearches}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {recentSearches.map((rec) => (
                  <button
                    key={rec.id}
                    type="button"
                    onClick={() => handlePick(rec.id, rec.stn)}
                    className="p-2 bg-white rounded border border-slate-200 text-left hover:border-gov-800 transition-colors"
                  >
                    <div className="font-bold text-xs text-gov-900 font-mono">{rec.id}</div>
                    <div className="text-[11px] text-slate-600 truncate">{rec.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">Target: {rec.stn}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

        </form>

      </div>
    </div>
  );
};
