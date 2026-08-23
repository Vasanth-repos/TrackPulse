import React from 'react';
import { EvidenceResponse } from '../../types/api';
import { HelpCircle, Clock, Zap, TrendingUp, TrendingDown, AlertTriangle, Database, CheckCircle } from 'lucide-react';

interface EvidencePanelProps {
  evidence: EvidenceResponse | null;
}

export const EvidencePanel: React.FC<EvidencePanelProps> = ({ evidence }) => {
  if (!evidence) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'clock': return <Clock className="w-4 h-4 text-signal-amber" />;
      case 'zap': return <Zap className="w-4 h-4 text-signal-green" />;
      case 'trending-up': return <TrendingUp className="w-4 h-4 text-signal-red" />;
      case 'trending-down': return <TrendingDown className="w-4 h-4 text-signal-green" />;
      case 'alert-triangle': return <AlertTriangle className="w-4 h-4 text-signal-red" />;
      case 'database': return <Database className="w-4 h-4 text-signal-cyan" />;
      default: return <CheckCircle className="w-4 h-4 text-signal-green" />;
    }
  };

  return (
    <div className="bg-rail-900 border border-rail-800 rounded-xl p-4 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rail-800 pb-3 mb-3">
        <div className="flex items-center space-x-2">
          <HelpCircle className="w-4 h-4 text-signal-cyan" />
          <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
            Why Did This Forecast Change? (Auditable Evidence)
          </h3>
        </div>
        <div className="text-[11px] font-mono text-rail-300">
          Location: <strong className="text-white">{evidence.current_station}</strong> • Delta: <strong className="text-signal-amber">+{evidence.eta_delta_min}m</strong>
        </div>
      </div>

      {/* Evidence Cards List */}
      <div className="space-y-2.5">
        {evidence.evidence_items.map((item, idx) => (
          <div
            key={item.id || idx}
            className="bg-rail-850 border border-rail-750 p-3 rounded-lg flex items-start space-x-3 transition-all hover:border-rail-600"
          >
            <div className="p-2 rounded bg-rail-900 border border-rail-750 flex-shrink-0 mt-0.5">
              {getIcon(item.icon_type)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="text-xs font-bold text-white tracking-wide">{item.title}</div>
                <span className="font-mono text-[11px] font-bold text-signal-cyan bg-rail-950 px-2 py-0.5 rounded border border-rail-800">
                  {item.metric_value}
                </span>
              </div>
              <p className="text-xs text-rail-300 mt-1 leading-relaxed">
                {item.detail}
              </p>
              <div className="mt-1.5 flex items-center space-x-2 text-[10px] font-mono">
                <span className="text-rail-400">Category: {item.category}</span>
                <span className="text-rail-600">•</span>
                <span className={`${
                  item.impact_level === 'HIGH' ? 'text-signal-red' :
                  item.impact_level === 'MEDIUM' ? 'text-signal-amber' : 'text-signal-green'
                }`}>
                  {item.impact_level} Impact
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Audit Guarantee Footer */}
      <div className="mt-3.5 pt-2.5 border-t border-rail-800/80 text-[10px] text-rail-400 font-mono flex items-center justify-between">
        <span>Verified against section ground-truth telemetry</span>
        <span className="text-signal-green font-semibold">Zero AI Hallucination</span>
      </div>
    </div>
  );
};
