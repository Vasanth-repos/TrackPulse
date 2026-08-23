import React from 'react';
import { LayoutDashboard, TrainTrack, PlayCircle, BarChart3, FileCheck2, Search } from 'lucide-react';

export type NavTab = 'overview' | 'train_detail' | 'replay' | 'benchmark' | 'auditor';

interface HeaderNavProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTrainId: string;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  selectedTrainId
}) => {
  const tabs = [
    { id: 'overview' as NavTab, label: 'Network Overview', icon: LayoutDashboard },
    { id: 'train_detail' as NavTab, label: `Train Inspector (${selectedTrainId})`, icon: TrainTrack },
    { id: 'replay' as NavTab, label: 'Live Replay Studio', icon: PlayCircle, badge: 'Demo' },
    { id: 'benchmark' as NavTab, label: 'Model Benchmark Lab', icon: BarChart3 },
    { id: 'auditor' as NavTab, label: 'Dataset Health Auditor', icon: FileCheck2 }
  ];

  return (
    <nav className="bg-rail-900 border-b border-rail-800 px-4 py-2 flex flex-col md:flex-row items-center justify-between gap-3">
      {/* Navigation Tabs */}
      <div className="flex items-center space-x-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-rail-750 text-white border border-rail-600 shadow-sm'
                  : 'text-rail-400 hover:text-rail-200 hover:bg-rail-850'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-signal-cyan' : 'text-rail-400'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="bg-signal-cyan/20 text-signal-cyan text-[10px] font-mono px-1.5 py-0.2 rounded border border-signal-cyan/30">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Train Search Input */}
      <div className="relative w-full md:w-64">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-rail-500" />
        <input
          type="text"
          placeholder="Search train (e.g. 12627, Rajdhani)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-rail-850 text-white placeholder-rail-500 text-xs rounded-md pl-8 pr-3 py-1.5 border border-rail-750 focus:outline-none focus:border-signal-cyan/60 font-sans"
        />
      </div>
    </nav>
  );
};
