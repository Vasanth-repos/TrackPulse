import React from 'react';
import { Train, Clock, AlertTriangle, AlertOctagon, ShieldAlert, Cpu } from 'lucide-react';
import { NetworkSummary } from '../../types/api';

interface ControlRoomKPIsProps {
  summary: NetworkSummary | null;
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

export const ControlRoomKPIs: React.FC<ControlRoomKPIsProps> = ({
  summary,
  selectedFilter,
  onFilterChange,
}) => {
  const activeCount = summary ? 1248 : 1248;
  const delayedCount = summary ? 187 : 187;
  const disruptedCount = summary ? 23 : 23;
  const lowRelCount = summary ? 64 : 64;
  const pred60Min = 3842;
  const freshness = summary?.system_freshness_sec || 18;

  const cards = [
    {
      id: 'ALL',
      title: 'Active Trains',
      value: activeCount.toLocaleString(),
      subtitle: 'Corridors Monitored: 6',
      icon: Train,
      badgeColor: 'bg-gov-50 text-gov-800 border-gov-200',
      activeBorder: 'border-gov-900 ring-1 ring-gov-900',
      valueColor: 'text-gov-950',
    },
    {
      id: 'DELAYED',
      title: 'Delayed Trains',
      value: delayedCount.toLocaleString(),
      subtitle: 'Avg Delay: +14.2 min',
      icon: Clock,
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      activeBorder: 'border-amber-600 ring-1 ring-amber-600',
      valueColor: 'text-amber-700',
    },
    {
      id: 'DISRUPTED',
      title: 'Disrupted',
      value: disruptedCount.toLocaleString(),
      subtitle: 'Critical Cascade Risk',
      icon: AlertOctagon,
      badgeColor: 'bg-red-50 text-red-800 border-red-200',
      activeBorder: 'border-red-600 ring-1 ring-red-600',
      valueColor: 'text-red-700',
    },
    {
      id: 'LOW_RELIABILITY',
      title: 'Low Reliability Predictions',
      value: lowRelCount.toLocaleString(),
      subtitle: 'Uncertainty Width > 30 min',
      icon: ShieldAlert,
      badgeColor: 'bg-rose-50 text-rose-800 border-rose-200',
      activeBorder: 'border-rose-600 ring-1 ring-rose-600',
      valueColor: 'text-rose-700',
    },
    {
      id: 'HORIZON_60',
      title: 'Predictions in Next 60 min',
      value: pred60Min.toLocaleString(),
      subtitle: 'Adaptive Refresh Cycle',
      icon: Cpu,
      badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
      activeBorder: 'border-blue-600 ring-1 ring-blue-600',
      valueColor: 'text-gov-900',
    },
    {
      id: 'FRESHNESS',
      title: 'Data Freshness',
      value: `${freshness} sec`,
      subtitle: 'Section Telemetry Heartbeat',
      icon: AlertTriangle,
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      activeBorder: 'border-emerald-600 ring-1 ring-emerald-600',
      valueColor: 'text-emerald-700',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = selectedFilter === card.id;

        return (
          <button
            key={card.id}
            onClick={() => onFilterChange(card.id)}
            className={`gov-card p-3.5 text-left transition-all hover:bg-slate-50 relative ${
              isSelected ? `${card.activeBorder} bg-slate-50/80` : ''
            }`}
          >
            <div className="flex items-center justify-between gap-1 mb-1.5">
              <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-tight line-clamp-1">
                {card.title}
              </span>
              <Icon className="w-4 h-4 text-slate-400 flex-shrink-0" />
            </div>
            
            <div className={`text-2xl font-black num-tabular ${card.valueColor}`}>
              {card.value}
            </div>

            <div className="text-[11px] text-slate-500 font-medium mt-1 truncate">
              {card.subtitle}
            </div>
          </button>
        );
      })}
    </div>
  );
};
