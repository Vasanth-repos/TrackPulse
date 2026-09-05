import React, { useState } from 'react';
import { Search, X, Train, MapPin, ArrowRight } from 'lucide-react';
import { TrainLiveStatus } from '../../types/api';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  trains: TrainLiveStatus[];
  onSelectTrain: (trainId: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  trains,
  onSelectTrain,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const results = trains.filter((t) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      t.train_id.toLowerCase().includes(q) ||
      t.train_name.toLowerCase().includes(q) ||
      t.current_station_name.toLowerCase().includes(q) ||
      t.next_station_name.toLowerCase().includes(q) ||
      t.final_destination_name.toLowerCase().includes(q)
    );
  });

  const handleSelect = (id: string) => {
    onSelectTrain(id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      <div className="gov-card bg-white w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-300">
        
        {/* Search Header Input */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-gov-800" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search train number (e.g. 12627), train name, station..."
            className="flex-1 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none"
            autoFocus
          />
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 p-2">
          {results.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500">
              No matching trains or stations found for "{query}".
            </div>
          ) : (
            results.map((train) => (
              <div
                key={train.train_id}
                onClick={() => handleSelect(train.train_id)}
                className="p-3 hover:bg-slate-50 rounded-md cursor-pointer flex items-center justify-between gap-3 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded bg-gov-900 text-white flex items-center justify-center font-mono font-bold text-xs">
                    {train.train_id}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900">{train.train_name}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <span>{train.current_station_name}</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                      <span>{train.final_destination_name}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right font-mono text-xs">
                  <div className="font-bold text-gov-950 text-sm">ETA: {train.predicted_eta}</div>
                  <div className="text-[11px] text-slate-500">{train.eta_lower_bound} – {train.eta_upper_bound}</div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 text-center font-mono">
          Press ESC or click outside to dismiss
        </div>

      </div>
    </div>
  );
};
