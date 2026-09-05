import React, { useState } from 'react';
import { Search, Filter, PlayCircle, Eye, ArrowUpDown, ChevronRight } from 'lucide-react';
import { TrainLiveStatus } from '../../types/api';

interface LiveTrainTableProps {
  trains: TrainLiveStatus[];
  selectedTrainId: string;
  onSelectTrain: (trainId: string) => void;
  onLaunchReplay: (trainId: string) => void;
  filterRegime: string;
  onFilterChange: (regime: string) => void;
}

export const LiveTrainTable: React.FC<LiveTrainTableProps> = ({
  trains,
  selectedTrainId,
  onSelectTrain,
  onLaunchReplay,
  filterRegime,
  onFilterChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'delay' | 'reliability' | 'train_id'>('delay');
  const [sortAsc, setSortAsc] = useState(false);

  // Filter trains
  const filteredTrains = trains.filter((train) => {
    const matchesSearch =
      train.train_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      train.train_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      train.current_station_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      train.next_station_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      train.final_destination_name.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterRegime === 'DELAYED') return train.regime === 'DELAYED';
    if (filterRegime === 'DISRUPTED') return train.regime === 'DISRUPTED';
    if (filterRegime === 'LOW_RELIABILITY') return train.reliability_score < 50;
    if (filterRegime === 'NORMAL') return train.regime === 'NORMAL';

    return true;
  });

  // Sort trains
  filteredTrains.sort((a, b) => {
    let diff = 0;
    if (sortField === 'delay') {
      diff = a.current_delay_min - b.current_delay_min;
    } else if (sortField === 'reliability') {
      diff = a.reliability_score - b.reliability_score;
    } else if (sortField === 'train_id') {
      diff = a.train_id.localeCompare(b.train_id);
    }
    return sortAsc ? diff : -diff;
  });

  const handleSort = (field: 'delay' | 'reliability' | 'train_id') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="gov-card overflow-hidden">
      {/* Table Header / Toolbar */}
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white">
        <div>
          <h2 className="text-base font-bold text-gov-950 flex items-center gap-2">
            <span>Live Train Monitoring</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {filteredTrains.length} Active Coaching Services
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time adaptive arrival forecasting across key high-density Indian railway corridors
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search train no., name, station..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-gov-700 focus:border-gov-700"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded border border-slate-200 text-xs">
            <button
              onClick={() => onFilterChange('ALL')}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                filterRegime === 'ALL' ? 'bg-white font-bold text-gov-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => onFilterChange('NORMAL')}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                filterRegime === 'NORMAL' ? 'bg-white font-bold text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Normal
            </button>
            <button
              onClick={() => onFilterChange('DELAYED')}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                filterRegime === 'DELAYED' ? 'bg-white font-bold text-amber-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Delayed
            </button>
            <button
              onClick={() => onFilterChange('DISRUPTED')}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                filterRegime === 'DISRUPTED' ? 'bg-white font-bold text-red-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Disrupted
            </button>
          </div>
        </div>
      </div>

      {/* DENSE GOVERNMENT OPERATIONAL TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <th className="py-2.5 px-3 whitespace-nowrap cursor-pointer hover:bg-slate-100" onClick={() => handleSort('train_id')}>
                <div className="flex items-center gap-1">
                  Train
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-2.5 px-3 whitespace-nowrap">Train Name</th>
              <th className="py-2.5 px-3 whitespace-nowrap">Current Location</th>
              <th className="py-2.5 px-3 whitespace-nowrap">Next Station</th>
              <th className="py-2.5 px-3 whitespace-nowrap cursor-pointer hover:bg-slate-100" onClick={() => handleSort('delay')}>
                <div className="flex items-center gap-1">
                  Current Delay
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-2.5 px-3 whitespace-nowrap">Predicted ETA</th>
              <th className="py-2.5 px-3 whitespace-nowrap">Estimated Range</th>
              <th className="py-2.5 px-3 whitespace-nowrap cursor-pointer hover:bg-slate-100" onClick={() => handleSort('reliability')}>
                <div className="flex items-center gap-1">
                  Reliability
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-2.5 px-3 whitespace-nowrap">Regime</th>
              <th className="py-2.5 px-3 whitespace-nowrap">Last Update</th>
              <th className="py-2.5 px-3 whitespace-nowrap text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredTrains.map((train) => {
              const isSelected = train.train_id === selectedTrainId;

              // Color styling based on regime & delay
              let regimeBadge = 'bg-emerald-50 text-emerald-800 border-emerald-200';
              let delayColor = 'text-emerald-700 font-semibold';
              if (train.regime === 'DELAYED') {
                regimeBadge = 'bg-amber-50 text-amber-800 border-amber-200';
                delayColor = 'text-amber-700 font-bold';
              } else if (train.regime === 'DISRUPTED') {
                regimeBadge = 'bg-red-50 text-red-800 border-red-200';
                delayColor = 'text-red-700 font-bold';
              }

              // Reliability badge
              let relBadge = 'bg-emerald-100 text-emerald-900 border-emerald-300';
              if (train.reliability_category === 'MEDIUM') {
                relBadge = 'bg-amber-100 text-amber-900 border-amber-300';
              } else if (train.reliability_category === 'LOW') {
                relBadge = 'bg-red-100 text-red-900 border-red-300';
              }

              return (
                <tr
                  key={train.train_id}
                  onClick={() => onSelectTrain(train.train_id)}
                  className={`hover:bg-slate-50/80 cursor-pointer transition-colors ${
                    isSelected ? 'bg-blue-50/60 font-medium' : ''
                  }`}
                >
                  {/* Train Number */}
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className="font-mono font-black text-gov-900 text-sm">
                      {train.train_id}
                    </span>
                  </td>

                  {/* Train Name & Type */}
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <div className="font-bold text-slate-900">{train.train_name}</div>
                    <div className="text-[10px] text-slate-500 uppercase">{train.train_type}</div>
                  </td>

                  {/* Current Location */}
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <div className="font-medium text-slate-800">{train.current_station_name}</div>
                    <div className="text-[10px] font-mono text-slate-500">[{train.current_station_code}]</div>
                  </td>

                  {/* Next Station */}
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <div className="font-medium text-slate-800">{train.next_station_name}</div>
                    <div className="text-[10px] font-mono text-slate-500">[{train.next_station_code}]</div>
                  </td>

                  {/* Current Delay */}
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className={`num-tabular text-sm ${delayColor}`}>
                      {train.current_delay_min === 0 ? 'On Time' : `+${train.current_delay_min} min`}
                    </span>
                  </td>

                  {/* Predicted ETA */}
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className="font-mono font-black text-sm text-gov-950">
                      {train.predicted_eta}
                    </span>
                  </td>

                  {/* Estimated Range */}
                  <td className="py-2.5 px-3 whitespace-nowrap font-mono text-xs text-slate-600">
                    <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                      {train.eta_lower_bound} – {train.eta_upper_bound}
                    </span>
                  </td>

                  {/* Reliability */}
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold border ${relBadge}`}>
                      {train.reliability_category} ({train.reliability_score})
                    </span>
                  </td>

                  {/* Operating Regime */}
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase border ${regimeBadge}`}>
                      {train.regime}
                    </span>
                  </td>

                  {/* Last Updated */}
                  <td className="py-2.5 px-3 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                    14:38 ({train.data_freshness_sec}s ago)
                  </td>

                  {/* Actions */}
                  <td className="py-2.5 px-3 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onSelectTrain(train.train_id)}
                        className="px-2.5 py-1 bg-gov-50 hover:bg-gov-100 text-gov-800 font-semibold rounded text-[11px] border border-gov-200 flex items-center gap-1 transition-colors"
                        title="Open Detailed Operational Inspector"
                      >
                        <Eye className="w-3 h-3" />
                        View
                      </button>
                      <button
                        onClick={() => onLaunchReplay(train.train_id)}
                        className="p-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-200 transition-colors"
                        title="Launch Historical Replay Simulation"
                      >
                        <PlayCircle className="w-3.5 h-3.5 text-gov-700" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
