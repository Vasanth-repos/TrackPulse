import React, { useState, useEffect } from 'react';
import { TopBar } from './components/layout/TopBar';
import { HeaderNav, NavTab } from './components/layout/HeaderNav';
import { NetworkSituation } from './components/dashboard/NetworkSituation';
import { TrainTable } from './components/dashboard/TrainTable';
import { EtaHero } from './components/train/EtaHero';
import { JourneyTimeline } from './components/train/JourneyTimeline';
import { DelayTrajectoryChart } from './components/train/DelayTrajectoryChart';
import { ReliabilityGauge } from './components/train/ReliabilityGauge';
import { EvidencePanel } from './components/train/EvidencePanel';
import { StationEtaTable } from './components/train/StationEtaTable';
import { ReplayStudio } from './components/replay/ReplayStudio';
import { ModelBenchmarkLab } from './components/evaluation/ModelBenchmarkLab';
import { DatasetAuditor } from './components/audit/DatasetAuditor';

import {
  fetchNetworkSummary,
  fetchAllTrains,
  fetchTrainTrajectory,
  fetchTrainReliability,
  fetchTrainEvidence,
  fetchReplaySession,
  fetchModelEvaluation,
  fetchDatasetAudit
} from './services/api';

import {
  NetworkSummary as INetworkSummary,
  TrainLiveStatus,
  TrajectoryResponse,
  ReliabilityBreakdown,
  EvidenceResponse,
  ReplaySession as IReplaySession,
  EvaluationReport,
  DatasetAuditReport
} from './types/api';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [selectedTrainId, setSelectedTrainId] = useState<string>('12627');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Data states
  const [summary, setSummary] = useState<INetworkSummary | null>(null);
  const [trains, setTrains] = useState<TrainLiveStatus[]>([]);
  const [trajectory, setTrajectory] = useState<TrajectoryResponse | null>(null);
  const [reliability, setReliability] = useState<ReliabilityBreakdown | null>(null);
  const [evidence, setEvidence] = useState<EvidenceResponse | null>(null);
  const [replaySession, setReplaySession] = useState<IReplaySession | null>(null);
  const [evalReport, setEvalReport] = useState<EvaluationReport | null>(null);
  const [auditReport, setAuditReport] = useState<DatasetAuditReport | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load initial application data
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [sumRes, trainsRes, evalRes, auditRes, replayRes] = await Promise.all([
          fetchNetworkSummary(),
          fetchAllTrains(),
          fetchModelEvaluation(),
          fetchDatasetAudit(),
          fetchReplaySession('12627')
        ]);
        setSummary(sumRes);
        setTrains(trainsRes);
        setEvalReport(evalRes);
        setAuditReport(auditRes);
        setReplaySession(replayRes);
      } catch (err) {
        console.error('Initial data fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Load train-specific data when selection changes
  useEffect(() => {
    async function loadTrainData() {
      try {
        const [trajRes, relRes, evRes] = await Promise.all([
          fetchTrainTrajectory(selectedTrainId),
          fetchTrainReliability(selectedTrainId),
          fetchTrainEvidence(selectedTrainId)
        ]);
        setTrajectory(trajRes);
        setReliability(relRes);
        setEvidence(evRes);
      } catch (err) {
        console.error(`Error loading data for train ${selectedTrainId}:`, err);
      }
    }
    loadTrainData();
  }, [selectedTrainId]);

  const handleSelectTrain = (trainId: string) => {
    setSelectedTrainId(trainId);
    setActiveTab('train_detail');
  };

  const handleLaunchReplay = (trainId: string) => {
    setSelectedTrainId(trainId);
    setActiveTab('replay');
  };

  const currentTrain = trains.find((t) => t.train_id === selectedTrainId) || trains[0];

  return (
    <div className="min-h-screen bg-rail-950 text-slate-100 flex flex-col font-sans">
      {/* Global Top Bar */}
      <TopBar
        systemFreshnessSec={summary?.system_freshness_sec || 6}
        systemStatus={summary?.system_status || 'OPERATIONAL_ONLINE'}
      />

      {/* Global Tab Navigation */}
      <HeaderNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedTrainId={selectedTrainId}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto space-y-6">
        {/* Tab 1: Network Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <NetworkSituation summary={summary} onSelectTrain={handleSelectTrain} />
            <TrainTable
              trains={trains}
              selectedTrainId={selectedTrainId}
              onSelectTrain={handleSelectTrain}
              onLaunchReplay={handleLaunchReplay}
              searchQuery={searchQuery}
            />
          </div>
        )}

        {/* Tab 2: Train Inspector */}
        {activeTab === 'train_detail' && currentTrain && (
          <div className="space-y-6">
            {/* Hero ETA Display & Uncertainty Slider */}
            <EtaHero train={currentTrain} />

            {/* Signature Railway Journey Timeline */}
            {trajectory && (
              <JourneyTimeline
                points={trajectory.points}
                currentStationCode={trajectory.current_station_code}
              />
            )}

            {/* Two Column Layout: Trajectory Chart + Reliability & Evidence */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Trajectory Chart & Station Table */}
              <div className="lg:col-span-7 space-y-6">
                {trajectory && (
                  <DelayTrajectoryChart
                    points={trajectory.points}
                    summaryTrend={trajectory.summary_trend}
                  />
                )}
                {trajectory && <StationEtaTable points={trajectory.points} />}
              </div>

              {/* Right Column: Reliability Gauge & "WHY THIS ETA?" Evidence */}
              <div className="lg:col-span-5 space-y-6">
                <ReliabilityGauge breakdown={reliability} />
                <EvidencePanel evidence={evidence} />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Live Replay Studio */}
        {activeTab === 'replay' && (
          <ReplayStudio initialSession={replaySession} />
        )}

        {/* Tab 4: Model Benchmark Lab */}
        {activeTab === 'benchmark' && (
          <ModelBenchmarkLab report={evalReport} />
        )}

        {/* Tab 5: Dataset Health Auditor */}
        {activeTab === 'auditor' && (
          <DatasetAuditor auditReport={auditReport} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-rail-900 border-t border-rail-800 px-4 py-3 text-center text-xs text-rail-400 font-mono">
        🚆 Adaptive ETA Reliability & Forecasting System for Indian Coaching Trains • SIH 2026 • Powered by Section-Aware Quantile ML
      </footer>
    </div>
  );
};

export default App;
