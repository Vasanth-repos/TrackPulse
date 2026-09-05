import React, { useState } from 'react';
import { X, Bell, AlertTriangle, ShieldAlert, Cpu, Radio, Check } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTrain: (trainId: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onSelectTrain,
}) => {
  const [filterCategory, setFilterCategory] = useState<'ALL' | 'OPERATIONAL' | 'PASSENGER' | 'DATA' | 'MODEL'>('ALL');

  if (!isOpen) return null;

  const notifications = [
    {
      id: 'n-1',
      category: 'OPERATIONAL',
      title: 'Disrupted Operating Regime Detected',
      message: 'Train 12627 experiencing section congestion on Ongole approach. Regime shifted to DELAYED.',
      trainId: '12627',
      time: '14:38',
      unread: true,
    },
    {
      id: 'n-2',
      category: 'MODEL',
      title: 'ETA Reliability Degraded for Train 12627',
      message: 'Uncertainty width widened from 12m to 17m due to stochastic downstream clearings.',
      trainId: '12627',
      time: '14:35',
      unread: true,
    },
    {
      id: 'n-3',
      category: 'DATA',
      title: 'Data Feed Delayed by 42 Seconds',
      message: 'Automatic signalling packet retry in Zone A coastal loop. Backoff resolver active.',
      trainId: 'ALL',
      time: '14:30',
      unread: false,
    },
    {
      id: 'n-4',
      category: 'PASSENGER',
      title: 'Connection Advisory: Transfer Risk at BZA',
      message: 'Connecting train 12840 has only 8-min margin at Vijayawada Junction for incoming passengers.',
      trainId: '12840',
      time: '14:28',
      unread: false,
    },
  ];

  const filtered = notifications.filter(
    (n) => filterCategory === 'ALL' || n.category === filterCategory
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col border-l border-slate-200">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-gov-900 text-white">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-200" />
            <h2 className="font-bold text-sm">Operational Notification Center</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-300 hover:text-white rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filters */}
        <div className="p-2 border-b border-slate-200 bg-slate-50 flex items-center gap-1 overflow-x-auto text-xs">
          {(['ALL', 'OPERATIONAL', 'PASSENGER', 'DATA', 'MODEL'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors whitespace-nowrap ${
                filterCategory === cat
                  ? 'bg-gov-900 text-white'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                if (item.trainId !== 'ALL') onSelectTrain(item.trainId);
              }}
              className={`p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors space-y-1 ${
                item.unread ? 'bg-blue-50/50 font-medium' : ''
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  {item.unread && <span className="w-2 h-2 rounded-full bg-blue-600"></span>}
                  {item.title}
                </span>
                <span className="font-mono text-[10px] text-slate-400">{item.time}</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {item.message}
              </p>
              <div className="flex items-center gap-2 pt-1 text-[10px] text-gov-800 font-mono">
                <span className="bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200 font-bold">
                  {item.category}
                </span>
                {item.trainId !== 'ALL' && <span>Train {item.trainId}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 text-center">
          <button
            onClick={onClose}
            className="w-full py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded transition-colors"
          >
            Close Notification Center
          </button>
        </div>

      </div>
    </div>
  );
};
