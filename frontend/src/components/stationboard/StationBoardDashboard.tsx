import React, { useState } from 'react';
import { StationBoardHeader } from './StationBoardHeader';
import { StationBoardTable } from './StationBoardTable';
import { StationSelectedTrain } from './StationSelectedTrain';
import { StationAnnouncementTicker } from './StationAnnouncementTicker';
import { Language } from '../../utils/translations';

interface StationBoardDashboardProps {
  currentTime: string;
  language: Language;
}

export const StationBoardDashboard: React.FC<StationBoardDashboardProps> = ({
  currentTime,
  language,
}) => {
  const [currentStation, setCurrentStation] = useState('MGR CHENNAI CENTRAL');
  const [selectedTrainNo, setSelectedTrainNo] = useState('12627');

  return (
    <div className="bg-board-bg text-slate-100 p-4 sm:p-6 rounded-xl border border-board-border space-y-6 shadow-2xl">
      
      {/* 1. Station Board Electronic Header */}
      <StationBoardHeader
        currentStation={currentStation}
        onStationChange={setCurrentStation}
        currentTime={currentTime}
        language={language}
      />

      {/* 2. Selected Train Next Arrival Spotlight */}
      <StationSelectedTrain trainNo={selectedTrainNo} />

      {/* 3. Full-Width Electronic Timetable Display */}
      <StationBoardTable
        selectedTrainNo={selectedTrainNo}
        onSelectTrain={setSelectedTrainNo}
      />

      {/* 4. Bottom Public Address Announcement Ticker */}
      <StationAnnouncementTicker
        language={language}
        selectedTrainNo={selectedTrainNo}
      />

    </div>
  );
};
