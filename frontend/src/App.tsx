import React, { useState, useEffect } from 'react';
import { GlobalHeader, DashboardMode } from './components/layout/GlobalHeader';
import { GlobalStatusBar } from './components/layout/GlobalStatusBar';
import { GlobalFooter } from './components/layout/GlobalFooter';

import { ControlRoomDashboard } from './components/controlroom/ControlRoomDashboard';
import { PassengerDashboard } from './components/passenger/PassengerDashboard';
import { StationBoardDashboard } from './components/stationboard/StationBoardDashboard';

import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { AccessibilityModal } from './components/common/AccessibilityModal';
import { ComponentLibraryModal } from './components/common/ComponentLibraryModal';
import { HelpSystemModal } from './components/common/HelpSystemModal';
import { LoadingSkeleton } from './components/common/ErrorState';

import {
  fetchNetworkSummary,
  fetchAllTrains,
  fetchTrainTrajectory,
  fetchTrainReliability,
  fetchTrainEvidence,
  fetchReplaySession,
} from './services/api';

import {
  NetworkSummary,
  TrainLiveStatus,
  TrajectoryResponse,
  ReliabilityBreakdown,
  EvidenceResponse,
  ReplaySession,
} from './types/api';

import { Language } from './utils/translations';

export const App: React.FC = () => {
  // Global Platform State
  const [currentMode, setCurrentMode] = useState<DashboardMode>('control_room');
  const [selectedTrainId, setSelectedTrainId] = useState<string>('12627');
  const [language, setLanguage] = useState<Language>('en');
  const [textScale, setTextScale] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [highContrast, setHighContrast] = useState<boolean>(false);

  // Modals & Drawers
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [isComponentLibOpen, setIsComponentLibOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Live Time
  const [currentTime, setCurrentTime] = useState<string>('14:38:20');

  // Backend API Data States
  const [summary, setSummary] = useState<NetworkSummary | null>(null);
  const [trains, setTrains] = useState<TrainLiveStatus[]>([]);
  const [trajectory, setTrajectory] = useState<TrajectoryResponse | null>(null);
  const [reliability, setReliability] = useState<ReliabilityBreakdown | null>(null);
  const [evidence, setEvidence] = useState<EvidenceResponse | null>(null);
  const [replaySession, setReplaySession] = useState<ReplaySession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Live ticking clock effect
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      setCurrentTime(timeStr);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Keyboard shortcut for universal search (Ctrl+K or /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Load initial global network data
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [sumRes, trainsRes, replayRes] = await Promise.all([
          fetchNetworkSummary().catch(() => null),
          fetchAllTrains().catch(() => []),
          fetchReplaySession('12627').catch(() => null),
        ]);
        if (sumRes) setSummary(sumRes);
        if (trainsRes && trainsRes.length > 0) setTrains(trainsRes);
        if (replayRes) setReplaySession(replayRes);
      } catch (err) {
        console.error('Failed to load initial data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Load train-specific data when selected train changes
  useEffect(() => {
    async function loadTrainData() {
      try {
        const [trajRes, relRes, evRes] = await Promise.all([
          fetchTrainTrajectory(selectedTrainId).catch(() => null),
          fetchTrainReliability(selectedTrainId).catch(() => null),
          fetchTrainEvidence(selectedTrainId).catch(() => null),
        ]);
        if (trajRes) setTrajectory(trajRes);
        if (relRes) setReliability(relRes);
        if (evRes) setEvidence(evRes);
      } catch (err) {
        console.error(`Failed to load data for train ${selectedTrainId}:`, err);
      }
    }
    loadTrainData();
  }, [selectedTrainId]);

  const handleSelectTrain = (trainId: string) => {
    setSelectedTrainId(trainId);
  };

  // Font scale class
  const scaleClass =
    textScale === 'large'
      ? 'text-scale-large'
      : textScale === 'xlarge'
      ? 'text-scale-xlarge'
      : 'text-scale-normal';

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-all ${scaleClass} ${
        highContrast ? 'high-contrast bg-white text-black' : currentMode === 'station_board' ? 'bg-board-bg' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Persistent Official Top Government Header */}
      <GlobalHeader
        currentMode={currentMode}
        onModeChange={setCurrentMode}
        language={language}
        onLanguageChange={setLanguage}
        onOpenAccessibility={() => setIsAccessibilityOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenComponentLibrary={() => setIsComponentLibOpen(true)}
        currentTime={currentTime}
        unreadAlertCount={2}
      />

      {/* Persistent Global Status Bar (Live Telemetry & Historical Replay Badge) */}
      <GlobalStatusBar
        language={language}
        currentTime={currentTime}
        systemFreshnessSec={summary?.system_freshness_sec || 18}
      />

      {/* Main View Area */}
      <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
        {isLoading && trains.length === 0 ? (
          <LoadingSkeleton />
        ) : (
          <>
            {/* 1. CONTROL ROOM DASHBOARD */}
            {currentMode === 'control_room' && (
              <ControlRoomDashboard
                summary={summary}
                trains={trains}
                selectedTrainId={selectedTrainId}
                onSelectTrain={handleSelectTrain}
                trajectory={trajectory}
                reliability={reliability}
                evidence={evidence}
                replaySession={replaySession}
              />
            )}

            {/* 2. PASSENGER DASHBOARD */}
            {currentMode === 'passenger' && (
              <PassengerDashboard
                trains={trains}
                selectedTrainId={selectedTrainId}
                onSelectTrain={handleSelectTrain}
                trajectory={trajectory}
                language={language}
              />
            )}

            {/* 3. STATION BOARD DASHBOARD */}
            {currentMode === 'station_board' && (
              <StationBoardDashboard
                currentTime={currentTime}
                language={language}
              />
            )}
          </>
        )}
      </main>

      {/* Persistent Official Government Footer */}
      <GlobalFooter
        language={language}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenAccessibility={() => setIsAccessibilityOpen(true)}
        onOpenComponentLibrary={() => setIsComponentLibOpen(true)}
      />

      {/* Modals & Dialogs */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        trains={trains}
        onSelectTrain={handleSelectTrain}
      />

      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onSelectTrain={handleSelectTrain}
      />

      <AccessibilityModal
        isOpen={isAccessibilityOpen}
        onClose={() => setIsAccessibilityOpen(false)}
        language={language}
        onLanguageChange={setLanguage}
        textScale={textScale}
        onTextScaleChange={setTextScale}
        highContrast={highContrast}
        onHighContrastToggle={() => setHighContrast(!highContrast)}
      />

      <ComponentLibraryModal
        isOpen={isComponentLibOpen}
        onClose={() => setIsComponentLibOpen(false)}
      />

      <HelpSystemModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        language={language}
        currentTime={currentTime}
      />
    </div>
  );
};

export default App;
