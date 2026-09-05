import React from 'react';
import { AlertOctagon, AlertTriangle, HelpCircle, RefreshCw, Clock, Database } from 'lucide-react';

export type ErrorType =
  | 'TRAIN_NOT_FOUND'
  | 'STATION_NOT_FOUND'
  | 'DATA_UNAVAILABLE'
  | 'STALE_DATA'
  | 'MODEL_UNAVAILABLE';

interface ErrorStateProps {
  type: ErrorType;
  customMessage?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ type, customMessage, onRetry }) => {
  if (type === 'TRAIN_NOT_FOUND') {
    return (
      <div className="gov-card p-6 bg-white border-2 border-slate-300 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-500">
          <AlertOctagon className="w-6 h-6 text-red-600" />
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-sm text-gov-950">Train Number Could Not Be Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {customMessage || 'Please verify the 5-digit coaching train number (e.g. 12627, 12951, 12301) and try again.'}
          </p>
        </div>
        {onRetry && (
          <button onClick={onRetry} className="px-4 py-1.5 bg-gov-900 text-white font-bold text-xs rounded">
            Search Again
          </button>
        )}
      </div>
    );
  }

  if (type === 'STATION_NOT_FOUND') {
    return (
      <div className="gov-card p-6 bg-white border-2 border-slate-300 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-500">
          <AlertTriangle className="w-6 h-6 text-amber-600" />
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-sm text-gov-950">Station Code Could Not Be Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {customMessage || 'The requested station code could not be resolved along this train route.'}
          </p>
        </div>
      </div>
    );
  }

  if (type === 'DATA_UNAVAILABLE') {
    return (
      <div className="gov-card p-6 bg-amber-50 border-2 border-amber-300 space-y-3">
        <div className="flex items-start gap-3">
          <Database className="w-6 h-6 text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-amber-950">Current Train Information is Temporarily Unavailable</h3>
            <p className="text-xs text-amber-900">
              Live GPS and block telemetry signals are interrupted. Showing last confirmed fix at 14:30.
            </p>
            <div className="text-[11px] font-mono text-amber-800 pt-1">
              Last Verified Update: 14:30:00 (No fabricated ETA is presented)
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'STALE_DATA') {
    return (
      <div className="gov-card p-4 bg-amber-50 border border-amber-300 flex items-center justify-between gap-3 text-xs text-amber-950">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-700 flex-shrink-0" />
          <div>
            <strong>Data is delayed:</strong> Telemetry was last updated 4 min ago. Reliability index adjusted to <strong>LOW</strong>.
          </div>
        </div>
        {onRetry && (
          <button onClick={onRetry} className="px-2.5 py-1 bg-amber-800 text-white font-bold rounded text-[11px] flex items-center gap-1">
            <RefreshCw className="w-3 h-3" /> Refresh Feed
          </button>
        )}
      </div>
    );
  }

  if (type === 'MODEL_UNAVAILABLE') {
    return (
      <div className="gov-card p-6 bg-slate-50 border-2 border-slate-300 space-y-3">
        <div className="flex items-start gap-3">
          <AlertOctagon className="w-6 h-6 text-slate-700 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-gov-950">ETA Prediction Temporarily Unavailable</h3>
            <p className="text-xs text-slate-600">
              The machine learning estimation engine is undergoing adaptive retraining.
            </p>
            <div className="p-2.5 bg-white rounded border border-slate-200 mt-2 font-mono text-xs">
              <strong>Official Published Timetable Fallback:</strong> Scheduled Arrival: 14:30 (Labeled strictly as published timetable schedule, not predicted ETA).
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="gov-card p-6 bg-white border border-slate-200 space-y-4 animate-pulse">
      <div className="h-6 bg-slate-200 rounded w-1/3"></div>
      <div className="h-12 bg-slate-100 rounded w-1/2"></div>
      <div className="grid grid-cols-3 gap-3">
        <div className="h-20 bg-slate-100 rounded"></div>
        <div className="h-20 bg-slate-100 rounded"></div>
        <div className="h-20 bg-slate-100 rounded"></div>
      </div>
      <div className="h-32 bg-slate-100 rounded"></div>
    </div>
  );
};
