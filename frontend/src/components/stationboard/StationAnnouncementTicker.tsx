import React from 'react';
import { Radio, Volume2 } from 'lucide-react';
import { Language, translations } from '../../utils/translations';

interface StationAnnouncementTickerProps {
  language: Language;
  selectedTrainNo?: string;
}

export const StationAnnouncementTicker: React.FC<StationAnnouncementTickerProps> = ({
  language,
  selectedTrainNo = '12627',
}) => {
  const t = translations[language];

  return (
    <div className="bg-board-card border-2 border-amber-500 rounded-lg p-3 text-white flex flex-col sm:flex-row items-center gap-3 shadow-lg font-mono">
      
      {/* Restrained Pulsing Next Arrival Badge */}
      <div className="flex items-center gap-2 bg-amber-400 text-board-bg px-3 py-1.5 rounded font-black text-xs uppercase tracking-wider flex-shrink-0">
        <span className="w-2.5 h-2.5 rounded-full bg-board-bg animate-ping"></span>
        <Volume2 className="w-4 h-4" />
        <span>{t.importantInfo}</span>
      </div>

      {/* Scrolling / Display Announcement Text */}
      <div className="flex-1 text-xs sm:text-sm font-sans font-bold text-amber-200 truncate w-full text-center sm:text-left">
        "Train {selectedTrainNo} Karnataka Express is expected at Platform 5 at approximately 14:42. Passengers for Train 12640 please proceed to Platform 3."
      </div>

      <div className="text-[10px] text-slate-400 font-mono hidden md:block">
        BROADCAST CODE: IR-PA-0482
      </div>
    </div>
  );
};
