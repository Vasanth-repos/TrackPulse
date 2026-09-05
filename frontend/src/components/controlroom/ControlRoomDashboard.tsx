import React, { useState } from 'react';
import { ControlRoomKPIs } from './ControlRoomKPIs';
import { LiveTrainTable } from './LiveTrainTable';
import { TrainDetailHeader } from './TrainDetailHeader';
import { JourneyTimeline } from './JourneyTimeline';
import { EtaStabilityChart } from './EtaStabilityChart';
import { DelayTrajectoryChart } from './DelayTrajectoryChart';
import { ReliabilityPanel } from './ReliabilityPanel';
import { ModelExplanationPanel } from './ModelExplanationPanel';
import { SectionSchematicMap } from './SectionSchematicMap';
import { OperationalAlertsPanel } from './OperationalAlertsPanel';
import { ReplayStudio } from '../replay/ReplayStudio';
import { MultiTrainPropagationDeck } from '../network/MultiTrainPropagationDeck';
import { WhatIfSimulator } from '../simulation/WhatIfSimulator';
import {
  NetworkSummary,
  TrainLiveStatus,
  TrajectoryResponse,
  ReliabilityBreakdown,
  EvidenceResponse,
  ReplaySession
} from '../../types/api';
import { Layers, ArrowLeft, PlayCircle, Eye, Network, Sliders } from 'lucide-react';

interface ControlRoomDashboardProps {
  summary: NetworkSummary | null;
  trains: TrainLiveStatus[];
  selectedTrainId: string;
  onSelectTrain: (trainId: string) => void;
  trajectory: TrajectoryResponse | null;
  reliability: ReliabilityBreakdown | null;
  evidence: EvidenceResponse | null;
  replaySession: ReplaySession | null;
}

export const ControlRoomDashboard: React.FC<ControlRoomDashboardProps> = ({
  summary,
  trains,
  selectedTrainId,
  onSelectTrain,
  trajectory,
  reliability,
  evidence,
  replaySession,
}) => {
  const [activeTab, setActiveTab] = useState<'monitor' | 'inspector' | 'propagation' | 'simulation' | 'replay'>('monitor');
  const [filterRegime, setFilterRegime] = useState<string>('ALL');

  const currentTrain = trains.find((t) => t.train_id === selectedTrainId) || trains[0];

  const handleInspectTrain = (trainId: string) => {
    onSelectTrain(trainId);
    setActiveTab('inspector');
  };

  const handleLaunchReplay = (trainId: string) => {
    onSelectTrain(trainId);
    setActiveTab('replay');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Title & Operational Sub-Navigation */}
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <h1 className="text-xl font-black text-gov-950 flex items-center gap-2">
            <span>Control Room Dashboard</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Network-wide ETA reliability, rake propagation, what-if modeling, and disruption monitoring for Indian Railways coaching services
          </p>
        </div>

        {/* View Segmented Switcher for Control Room Tabs */}
        <div className="flex flex-wrap items-center bg-slate-200/80 p-1 rounded-lg border border-slate-300 text-xs shadow-inner">
          <button
            onClick={() => setActiveTab('monitor')}
            className={`px-3 py-1.5 rounded-md font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'monitor'
                ? 'gov-switcher-active'
                : 'gov-switcher-inactive'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Live Train Monitor
          </button>

          <button
            onClick={() => setActiveTab('inspector')}
            className={`px-3 py-1.5 rounded-md font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'inspector'
                ? 'gov-switcher-active'
                : 'gov-switcher-inactive'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Train Inspector ({selectedTrainId})
          </button>

          <button
            onClick={() => setActiveTab('propagation')}
            className={`px-3 py-1.5 rounded-md font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'propagation'
                ? 'gov-switcher-active'
                : 'gov-switcher-inactive'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            Rake &amp; Propagation
          </button>

          <button
            onClick={() => setActiveTab('simulation')}
            className={`px-3 py-1.5 rounded-md font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'simulation'
                ? 'gov-switcher-active'
                : 'gov-switcher-inactive'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            What-If Simulator
          </button>

          <button
            onClick={() => setActiveTab('replay')}
            className={`px-3 py-1.5 rounded-md font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'replay'
                ? 'gov-switcher-active'
                : 'gov-switcher-inactive'
            }`}
          >
            <PlayCircle className="w-3.5 h-3.5" />
            Replay Studio
          </button>
        </div>
      </div>

      {/* TOP KPI CARDS */}
      <ControlRoomKPIs
        summary={summary}
        selectedFilter={filterRegime}
        onFilterChange={setFilterRegime}
      />

      {/* TAB 1: LIVE TRAIN MONITOR OVERVIEW */}
      {activeTab === 'monitor' && (
        <div className="space-y-6">
          <LiveTrainTable
            trains={trains}
            selectedTrainId={selectedTrainId}
            onSelectTrain={handleInspectTrain}
            onLaunchReplay={handleLaunchReplay}
            filterRegime={filterRegime}
            onFilterChange={setFilterRegime}
          />

          {/* Section Map Schematic & Dispatch Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <SectionSchematicMap />
            </div>
            <div className="lg:col-span-5">
              <OperationalAlertsPanel onSelectTrain={handleInspectTrain} />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DETAILED TRAIN INSPECTOR */}
      {activeTab === 'inspector' && currentTrain && (
        <div className="space-y-6">
          {/* Back button & quick switcher */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveTab('monitor')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gov-800 hover:text-gov-950 bg-white px-3 py-1.5 rounded border border-slate-200 transition-colors shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Live Train Monitor
            </button>

            <button
              onClick={() => handleLaunchReplay(currentTrain.train_id)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-gov-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded border border-slate-200 transition-colors"
            >
              <PlayCircle className="w-3.5 h-3.5 text-gov-700" />
              Launch Replay Simulation for Train {currentTrain.train_id}
            </button>
          </div>

          {/* Detailed Header Card */}
          <TrainDetailHeader train={currentTrain} />

          {/* Journey Progress Track Timeline */}
          {trajectory && (
            <JourneyTimeline
              points={trajectory.points}
              currentStationCode={trajectory.current_station_code}
            />
          )}

          {/* 2-Column Analytical Deck: Charts + Reliability & Evidence */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 Cols: Stability Chart & Trajectory Chart */}
            <div className="lg:col-span-7 space-y-6">
              <EtaStabilityChart />
              {trajectory && (
                <DelayTrajectoryChart
                  points={trajectory.points}
                  summaryTrend={trajectory.summary_trend}
                />
              )}
            </div>

            {/* Right 5 Cols: Reliability Panel & SHAP Explanation */}
            <div className="lg:col-span-5 space-y-6">
              <ReliabilityPanel breakdown={reliability} />
              <ModelExplanationPanel evidence={evidence} />
            </div>
          </div>

          {/* Section Map Schematic */}
          <SectionSchematicMap />
        </div>
      )}

      {/* TAB 3: MULTI-TRAIN & DELAY PROPAGATION */}
      {activeTab === 'propagation' && (
        <MultiTrainPropagationDeck onSelectTrain={handleInspectTrain} />
      )}

      {/* TAB 4: WHAT-IF DISRUPTION SIMULATOR */}
      {activeTab === 'simulation' && (
        <WhatIfSimulator
          initialTrainId={selectedTrainId}
          onSelectTrain={handleInspectTrain}
        />
      )}

      {/* TAB 5: HISTORICAL REPLAY STUDIO */}
      {activeTab === 'replay' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveTab('inspector')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gov-800 hover:text-gov-950 bg-white px-3 py-1.5 rounded border border-slate-200 transition-colors shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Train Inspector
            </button>
          </div>
          <ReplayStudio initialSession={replaySession} />
        </div>
      )}

    </div>
  );
};
