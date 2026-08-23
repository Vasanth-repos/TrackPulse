import React, { useState } from 'react';
import { TrainLiveStatus } from '../../types/api';
import { Train, ChevronRight, PlayCircle, ShieldCheck, AlertTriangle, AlertOctagon } from 'lucide-react';

interface TrainTableProps {
  trains: TrainLiveStatus[];
  selectedTrainId: string;
  onSelectTrain: (trainId: string) => void;
  onLaunchReplay: (trainId: string) => void;
  searchQuery: string;
}

export const TrainTable: React.FC<TrainTableProps> = ({
  trains,
  selectedTrainId,
  onSelectTrain,
  onLaunchReplay,
  searchQuery
}) => {
  const [filterRegime, setFilterRegime] = useState<string>('ALL');

  const filteredTrains = trains.filter((t) => {
    const matchesSearch =
      t.train_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.train_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.current_station_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.final_destination_name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRegime = filterRegime === 'ALL' || t.regime === filterRegime;
    return matchesSearch && matchesRegime;
  });

  return (
    <div className="bg-rail-900 border border-rail-800 rounded-lg overflow-hidden shadow-xl">
      {/* Table Header Controls */}
      <div className="p-3.5 border-b border-rail-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-rail-850/60">
        <div className="flex items-center space-x-2">
          <Train className="w-4 h-4 text-signal-cyan" />
          <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
            Active Coaching Trains Live Board
          </h3>
          <span className="text-xs text-rail-400 font-mono">({filteredTrains.length} active)</span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1 text-xs">
          {['ALL', 'NORMAL', 'DELAYED', 'DISRUPTED'].map((reg) => (
            <button
              key={reg}
              onClick={() => setFilterRegime(reg)}
              className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                filterRegime === reg
                  ? 'bg-rail-700 text-white font-semibold border border-rail-600'
                  : 'text-rail-400 hover:text-rail-200 hover:bg-rail-800'
              }`}
            >
              {reg}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-rail-950/80 text-rail-400 border-b border-rail-800 font-mono text-[11px]">
            <tr>
              <th className="py-2.5 px-3.5">Train</th>
              <th className="py-2.5 px-3.5">Current Location</th>
              <th className="py-2.5 px-3.5">Current Delay</th>
              <th className="py-2.5 px-3.5">Predicted ETA</th>
              <th className="py-2.5 px-3.5">Expected Window</th>
              <th className="py-2.5 px-3.5">Reliability</th>
              <th className="py-2.5 px-3.5">Regime</th>
              <th className="py-2.5 px-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rail-800/60 font-sans">
            {filteredTrains.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-rail-400">
                  No trains found matching criteria.
                </td>
              </tr>
            ) : (
              filteredTrains.map((t) => {
                const isSelected = t.train_id === selectedTrainId;
                return (
                  <tr
                    key={t.train_id}
                    onClick={() => onSelectTrain(t.train_id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-rail-800/80 border-l-2 border-signal-cyan'
                        : 'hover:bg-rail-850/50'
                    }`}
                  >
                    {/* Train ID & Name */}
                    <td className="py-3 px-3.5">
                      <div className="font-mono font-bold text-white text-xs">{t.train_id}</div>
                      <div className="text-[11px] text-rail-300 font-medium truncate max-w-[160px]">{t.train_name}</div>
                      <div className="text-[10px] text-rail-400">{t.train_type}</div>
                    </td>

                    {/* Location */}
                    <td className="py-3 px-3.5">
                      <div className="text-white font-medium">{t.current_station_name}</div>
                      <div className="text-[10px] text-rail-400 font-mono">
                        {t.current_station_code} → {t.final_destination_code}
                      </div>
                    </td>

                    {/* Delay */}
                    <td className="py-3 px-3.5">
                      <span className={`font-mono font-bold ${
                        t.current_delay_min === 0 ? 'text-signal-green' :
                        t.current_delay_min <= 15 ? 'text-signal-amber' : 'text-signal-red'
                      }`}>
                        {t.current_delay_min === 0 ? 'ON TIME' : `+${t.current_delay_min} min`}
                      </span>
                    </td>

                    {/* Predicted ETA */}
                    <td className="py-3 px-3.5">
                      <div className="text-white font-mono font-bold text-sm">{t.predicted_eta}</div>
                      <div className="text-[10px] text-rail-400 font-mono">
                        Sched: {t.scheduled_arrival}
                      </div>
                    </td>

                    {/* Expected Arrival Window */}
                    <td className="py-3 px-3.5">
                      <div className="bg-rail-950 px-2 py-1 rounded border border-rail-800 font-mono text-[11px] text-rail-200 inline-block">
                        {t.eta_lower_bound} – {t.eta_upper_bound}
                      </div>
                      <div className="text-[10px] text-rail-400 mt-0.5 font-mono">
                        span: ±{Math.round(t.interval_width_min / 2)}m
                      </div>
                    </td>

                    {/* Reliability Pill */}
                    <td className="py-3 px-3.5">
                      <div className="flex items-center space-x-1.5">
                        <div className="w-12 bg-rail-950 h-1.5 rounded-full overflow-hidden border border-rail-800">
                          <div
                            className={`h-full ${
                              t.reliability_score >= 70 ? 'bg-signal-green' :
                              t.reliability_score >= 40 ? 'bg-signal-amber' : 'bg-signal-red'
                            }`}
                            style={{ width: `${t.reliability_score}%` }}
                          />
                        </div>
                        <span className="font-mono font-bold text-xs text-white">
                          {t.reliability_score}
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-rail-400">
                        {t.reliability_category}
                      </div>
                    </td>

                    {/* Regime Badge */}
                    <td className="py-3 px-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold inline-flex items-center space-x-1 ${
                        t.regime === 'NORMAL' ? 'bg-signal-green/20 text-signal-green border border-signal-green/30' :
                        t.regime === 'DELAYED' ? 'bg-signal-amber/20 text-signal-amber border border-signal-amber/30' :
                        'bg-signal-red/20 text-signal-red border border-signal-red/30'
                      }`}>
                        <span>●</span>
                        <span>{t.regime}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3.5 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onLaunchReplay(t.train_id);
                          }}
                          className="bg-signal-cyan/15 hover:bg-signal-cyan/25 text-signal-cyan border border-signal-cyan/30 px-2 py-1 rounded text-[11px] font-medium flex items-center space-x-1 transition-colors"
                          title="Open Historical Replay Demo"
                        >
                          <PlayCircle className="w-3.5 h-3.5" />
                          <span>Replay</span>
                        </button>
                        <ChevronRight className="w-4 h-4 text-rail-500" />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
