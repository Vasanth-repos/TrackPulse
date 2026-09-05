import React, { useState } from 'react';
import { PassengerSearchBox } from './PassengerSearchBox';
import { PassengerEtaCard } from './PassengerEtaCard';
import { PassengerTimeline } from './PassengerTimeline';
import { PassengerEtaStability } from './PassengerEtaStability';
import { ConnectionRiskAnalyzer } from './ConnectionRiskAnalyzer';
import { SmsIvrSection } from './SmsIvrSection';
import { PassengerRequirementPlanner } from './PassengerRequirementPlanner';
import { PNRLookupDeck } from '../pnr/PNRLookupDeck';
import { TrainLiveStatus, TrajectoryResponse } from '../../types/api';
import { Language } from '../../utils/translations';
import { Smartphone, Monitor, Clock, Sparkles, Lock } from 'lucide-react';

interface PassengerDashboardProps {
  trains: TrainLiveStatus[];
  selectedTrainId: string;
  onSelectTrain: (trainId: string) => void;
  trajectory: TrajectoryResponse | null;
  language: Language;
}

export const PassengerDashboard: React.FC<PassengerDashboardProps> = ({
  trains,
  selectedTrainId,
  onSelectTrain,
  trajectory,
  language,
}) => {
  const [activePassengerView, setActivePassengerView] = useState<'live_eta' | 'planner' | 'pnr_sms'>('live_eta');
  const [selectedStationCode, setSelectedStationCode] = useState('BZA');
  const [isMobilePreview, setIsMobilePreview] = useState(false);

  const currentTrain = trains.find((t) => t.train_id === selectedTrainId) || trains[0];

  const handleSearch = (trainId: string, stationCode?: string) => {
    onSelectTrain(trainId);
    if (stationCode) {
      setSelectedStationCode(stationCode);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Viewport Format Toggle & Operational Sub-Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <span className="text-xs font-black text-gov-950 uppercase tracking-wider block">
            Passenger Experience &amp; Information Portal
          </span>
          <p className="text-[11px] text-slate-500">
            Citizen access for live train arrival uncertainty, trip planning recommendations, and PNR / 2G SMS lookup
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Passenger Sub-deck segmented switcher */}
          <div className="flex items-center bg-slate-200/80 p-1 rounded-lg border border-slate-300 text-xs shadow-inner">
            <button
              onClick={() => setActivePassengerView('live_eta')}
              className={`px-3 py-1.5 rounded-md font-bold transition-all flex items-center gap-1.5 ${
                activePassengerView === 'live_eta'
                  ? 'gov-switcher-active'
                  : 'gov-switcher-inactive'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              Live ETA Status
            </button>

            <button
              onClick={() => setActivePassengerView('planner')}
              className={`px-3 py-1.5 rounded-md font-bold transition-all flex items-center gap-1.5 ${
                activePassengerView === 'planner'
                  ? 'gov-switcher-active'
                  : 'gov-switcher-inactive'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Train Recommender
            </button>

            <button
              onClick={() => setActivePassengerView('pnr_sms')}
              className={`px-3 py-1.5 rounded-md font-bold transition-all flex items-center gap-1.5 ${
                activePassengerView === 'pnr_sms'
                  ? 'gov-switcher-active'
                  : 'gov-switcher-inactive'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              PNR &amp; 2G SMS
            </button>
          </div>

          {/* Desktop vs Mobile Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded border border-slate-200 text-xs">
            <button
              onClick={() => setIsMobilePreview(false)}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                !isMobilePreview ? 'bg-gov-900 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              <Monitor className="w-3 h-3" />
              Desktop (1440px)
            </button>
            <button
              onClick={() => setIsMobilePreview(true)}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                isMobilePreview ? 'bg-gov-900 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              <Smartphone className="w-3 h-3" />
              Mobile (390px)
            </button>
          </div>
        </div>
      </div>

      {/* Conditional Layout: Standard Desktop vs Mobile Simulation Frame */}
      {isMobilePreview ? (
        <div className="max-w-[460px] mx-auto bg-slate-950 p-3 rounded-[40px] shadow-2xl border-4 border-slate-800">
          {/* Top Notch Pill */}
          <div className="w-24 h-4 bg-slate-900 rounded-full mx-auto mb-3 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-800"></div>
          </div>
          
          <div className="bg-slate-50 rounded-[32px] p-4 max-h-[820px] overflow-y-auto space-y-5">
            {/* VIEW 1: LIVE ETA STATUS */}
            {activePassengerView === 'live_eta' && (
              <div className="space-y-4">
                <PassengerSearchBox
                  language={language}
                  onSearch={handleSearch}
                  trains={trains}
                  currentTrainId={selectedTrainId}
                />
                {currentTrain && (
                  <PassengerEtaCard
                    train={currentTrain}
                    selectedStationCode={selectedStationCode}
                    language={language}
                  />
                )}
                <PassengerTimeline points={trajectory?.points} />
                <PassengerEtaStability />
                <ConnectionRiskAnalyzer />
                <SmsIvrSection language={language} />
              </div>
            )}

            {/* VIEW 2: TRIP PLANNER */}
            {activePassengerView === 'planner' && (
              <PassengerRequirementPlanner
                onSelectTrain={(tId) => {
                  onSelectTrain(tId);
                  setActivePassengerView('live_eta');
                }}
              />
            )}

            {/* VIEW 3: PNR & BUTTON PHONE SMS GATEWAY */}
            {activePassengerView === 'pnr_sms' && (
              <PNRLookupDeck
                isMobile={true}
                onSelectTrain={(tId) => {
                  onSelectTrain(tId);
                  setActivePassengerView('live_eta');
                }}
              />
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* VIEW 1: LIVE ETA STATUS */}
          {activePassengerView === 'live_eta' && (
            <div className="space-y-6">
              <PassengerSearchBox
                language={language}
                onSearch={handleSearch}
                trains={trains}
                currentTrainId={selectedTrainId}
              />
              {currentTrain && (
                <PassengerEtaCard
                  train={currentTrain}
                  selectedStationCode={selectedStationCode}
                  language={language}
                />
              )}
              <PassengerTimeline points={trajectory?.points} />
              <PassengerEtaStability />
              <ConnectionRiskAnalyzer />
              <SmsIvrSection language={language} />
            </div>
          )}

          {/* VIEW 2: TRIP PLANNER */}
          {activePassengerView === 'planner' && (
            <PassengerRequirementPlanner
              onSelectTrain={(tId) => {
                onSelectTrain(tId);
                setActivePassengerView('live_eta');
              }}
            />
          )}

          {/* VIEW 3: PNR & BUTTON PHONE SMS GATEWAY */}
          {activePassengerView === 'pnr_sms' && (
            <PNRLookupDeck
              onSelectTrain={(tId) => {
                onSelectTrain(tId);
                setActivePassengerView('live_eta');
              }}
            />
          )}
        </div>
      )}

    </div>
  );
};
