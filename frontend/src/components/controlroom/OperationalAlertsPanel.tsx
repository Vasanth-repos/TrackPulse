import React, { useState } from 'react';
import { AlertOctagon, AlertTriangle, Info, Check, Eye, MapPin } from 'lucide-react';

interface AlertItem {
  id: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  trainId: string;
  title: string;
  description: string;
  timestamp: string;
  acknowledged: boolean;
}

interface OperationalAlertsPanelProps {
  onSelectTrain: (trainId: string) => void;
}

export const OperationalAlertsPanel: React.FC<OperationalAlertsPanelProps> = ({ onSelectTrain }) => {
  const [alerts, setAlerts] = useState<AlertItem[]>([
    {
      id: 'alt-1',
      priority: 'HIGH',
      trainId: '12627',
      title: 'ETA Deterioration Detected',
      description: 'Reliability changed from HIGH → MEDIUM due to progressive +4 min/station section deceleration.',
      timestamp: '14:38:10',
      acknowledged: false,
    },
    {
      id: 'alt-2',
      priority: 'MEDIUM',
      trainId: '12840',
      title: 'Current Delay Increasing',
      description: 'Train 12840 (Chennai - Howrah Mail) experiencing +28 min cumulative delay past Ongole.',
      timestamp: '14:35:45',
      acknowledged: false,
    },
    {
      id: 'alt-3',
      priority: 'LOW',
      trainId: 'ALL',
      title: 'Data Freshness Degraded for Zone A',
      description: 'Automatic signalling telemetry delay 42s in Southern Railway coastal corridor.',
      timestamp: '14:30:20',
      acknowledged: true,
    },
  ]);

  const handleAcknowledge = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: !a.acknowledged } : a))
    );
  };

  return (
    <div className="gov-card p-4 bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
        <div>
          <h3 className="text-xs font-bold text-gov-950 uppercase tracking-wider flex items-center gap-1.5">
            <AlertOctagon className="w-3.5 h-3.5 text-red-600" />
            Operational Dispatch Alerts & Signal Warnings
          </h3>
          <p className="text-[11px] text-slate-500">
            Real-time automated regime shifts and forecast stability exceptions
          </p>
        </div>

        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-50 text-red-800 border border-red-200">
          {alerts.filter((a) => !a.acknowledged).length} Unacknowledged
        </span>
      </div>

      <div className="space-y-2.5">
        {alerts.map((alert) => {
          let priorityBadge = 'bg-red-50 text-red-900 border-red-300';
          let borderHighlight = 'border-l-4 border-l-red-600';
          let PriorityIcon = AlertOctagon;

          if (alert.priority === 'MEDIUM') {
            priorityBadge = 'bg-amber-50 text-amber-900 border-amber-300';
            borderHighlight = 'border-l-4 border-l-amber-500';
            PriorityIcon = AlertTriangle;
          } else if (alert.priority === 'LOW') {
            priorityBadge = 'bg-slate-100 text-slate-800 border-slate-300';
            borderHighlight = 'border-l-4 border-l-slate-400';
            PriorityIcon = Info;
          }

          return (
            <div
              key={alert.id}
              className={`p-3 rounded-lg border bg-slate-50/70 ${borderHighlight} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
                alert.acknowledged ? 'opacity-60 bg-slate-100/50' : ''
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-bold border ${priorityBadge}`}>
                    <PriorityIcon className="w-3 h-3" />
                    {alert.priority} PRIORITY
                  </span>
                  {alert.trainId !== 'ALL' && (
                    <span className="font-mono font-bold text-gov-900">
                      Train {alert.trainId}
                    </span>
                  )}
                  <span className="text-slate-400">•</span>
                  <span className="font-bold text-slate-800">{alert.title}</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {alert.description}
                </p>
                <div className="text-[10px] text-slate-400 font-mono">
                  Timestamp: {alert.timestamp}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 self-end sm:self-center flex-shrink-0">
                {alert.trainId !== 'ALL' && (
                  <button
                    onClick={() => onSelectTrain(alert.trainId)}
                    className="px-2.5 py-1 bg-white hover:bg-slate-100 text-gov-900 font-semibold rounded text-[11px] border border-slate-300 flex items-center gap-1 transition-colors"
                  >
                    <Eye className="w-3 h-3" />
                    View Train
                  </button>
                )}
                <button
                  onClick={() => handleAcknowledge(alert.id)}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold border flex items-center gap-1 transition-colors ${
                    alert.acknowledged
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                  }`}
                >
                  <Check className="w-3 h-3" />
                  {alert.acknowledged ? 'Acknowledged' : 'Acknowledge'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
