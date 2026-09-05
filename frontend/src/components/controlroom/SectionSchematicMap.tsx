import React, { useState } from 'react';
import { Map, MapPin, Navigation, Info, ArrowRight, ShieldCheck } from 'lucide-react';

interface SectionDetail {
  fromStation: string;
  toStation: string;
  historicalRuntime: string;
  estimatedRuntime: string;
  delayContribution: string;
  reliability: 'High' | 'Medium' | 'Low';
  status: 'NORMAL' | 'DELAYED' | 'DISRUPTED';
  distanceKm: number;
}

export const SectionSchematicMap: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<SectionDetail>({
    fromStation: 'Nellore (NLR)',
    toStation: 'Ongole (OGL)',
    historicalRuntime: '02:10',
    estimatedRuntime: '02:24',
    delayContribution: '+14 min',
    reliability: 'Medium',
    status: 'DELAYED',
    distanceKm: 117,
  });

  // Section list along primary corridor
  const sections: SectionDetail[] = [
    {
      fromStation: 'Chennai Central (MAS)',
      toStation: 'Nellore (NLR)',
      historicalRuntime: '02:30',
      estimatedRuntime: '02:34',
      delayContribution: '+4 min',
      reliability: 'High',
      status: 'NORMAL',
      distanceKm: 177,
    },
    {
      fromStation: 'Nellore (NLR)',
      toStation: 'Ongole (OGL)',
      historicalRuntime: '02:10',
      estimatedRuntime: '02:24',
      delayContribution: '+14 min',
      reliability: 'Medium',
      status: 'DELAYED',
      distanceKm: 117,
    },
    {
      fromStation: 'Ongole (OGL)',
      toStation: 'Vijayawada (BZA)',
      historicalRuntime: '02:15',
      estimatedRuntime: '02:18',
      delayContribution: '+3 min',
      reliability: 'Medium',
      status: 'DELAYED',
      distanceKm: 139,
    },
    {
      fromStation: 'Vijayawada (BZA)',
      toStation: 'Warangal (WL)',
      historicalRuntime: '03:10',
      estimatedRuntime: '03:10',
      delayContribution: '0 min',
      reliability: 'High',
      status: 'NORMAL',
      distanceKm: 207,
    },
    {
      fromStation: 'Warangal (WL)',
      toStation: 'Nagpur (NGP)',
      historicalRuntime: '06:30',
      estimatedRuntime: '06:30',
      delayContribution: '0 min',
      reliability: 'High',
      status: 'NORMAL',
      distanceKm: 452,
    },
  ];

  return (
    <div className="gov-card p-4 bg-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 pb-2 mb-3 gap-2">
        <div>
          <h3 className="text-xs font-bold text-gov-950 uppercase tracking-wider flex items-center gap-1.5">
            <Map className="w-3.5 h-3.5 text-gov-700" />
            Corridor Schematic Section Map & Dynamic State
          </h3>
          <p className="text-[11px] text-slate-500">
            Interactive section health: Click sections along the corridor for operational runtime statistics
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600 font-medium">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Normal
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Delayed
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span> Disrupted
          </span>
          <span className="flex items-center gap-1 font-bold text-blue-700">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 ring-2 ring-blue-300"></span> Train Position
          </span>
        </div>
      </div>

      {/* Interactive Schematic SVG Track Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        
        {/* Left 8 Cols: Track Route Schematic */}
        <div className="lg:col-span-8 bg-slate-50 rounded-lg p-4 border border-slate-200">
          <div className="flex flex-col space-y-4">
            
            {/* Visual Schematic Segments */}
            {sections.map((sec, idx) => {
              const isSelected = selectedSection.fromStation === sec.fromStation;
              const hasTrain = sec.fromStation.includes('Nellore');

              let statusColor = 'border-emerald-500 bg-emerald-50 text-emerald-900';
              let trackColor = 'bg-emerald-500';
              if (sec.status === 'DELAYED') {
                statusColor = 'border-amber-500 bg-amber-50 text-amber-900';
                trackColor = 'bg-amber-500';
              } else if (sec.status === 'DISRUPTED') {
                statusColor = 'border-red-500 bg-red-50 text-red-900';
                trackColor = 'bg-red-500';
              }

              return (
                <div
                  key={sec.fromStation}
                  onClick={() => setSelectedSection(sec)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                    isSelected ? 'ring-2 ring-gov-800 shadow-xs bg-white' : 'hover:bg-white bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${trackColor}`}></div>
                    <div>
                      <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                        <span>{sec.fromStation}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                        <span>{sec.toStation}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Distance: {sec.distanceKm} km • Historical: {sec.historicalRuntime}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {hasTrain && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-100 text-blue-900 text-[10px] font-bold border border-blue-300">
                        <MapPin className="w-3 h-3 text-blue-700" />
                        Train 12627 Here
                      </span>
                    )}

                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${statusColor}`}>
                      {sec.delayContribution} ({sec.status})
                    </span>
                  </div>
                </div>
              );
            })}

          </div>
        </div>

        {/* Right 4 Cols: Selected Section Diagnostic Panel */}
        <div className="lg:col-span-4 gov-card-inset p-4 bg-white border border-slate-200 rounded-lg space-y-3">
          <div className="border-b border-slate-100 pb-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Selected Section Inspector
            </span>
            <div className="font-black text-sm text-gov-950 mt-0.5">
              {selectedSection.fromStation} → {selectedSection.toStation}
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Historical Running Time:</span>
              <span className="font-mono font-bold text-slate-800">{selectedSection.historicalRuntime}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Current Estimated Runtime:</span>
              <span className="font-mono font-bold text-slate-800">{selectedSection.estimatedRuntime}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Delay Contribution:</span>
              <span className="font-mono font-bold text-amber-700">{selectedSection.delayContribution}</span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-slate-500">Section Reliability:</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-300">
                <ShieldCheck className="w-3 h-3" />
                {selectedSection.reliability}
              </span>
            </div>
          </div>

          <div className="pt-1 text-[11px] text-slate-500">
            Speed restrictions active on bridge approach km 242/10. Block signaling clearing normally.
          </div>
        </div>

      </div>
    </div>
  );
};
