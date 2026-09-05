import React from 'react';
import { TrainLiveStatus } from '../../types/api';

export interface StationBoardItem {
  trainNo: string;
  trainName: string;
  destination: string;
  scheduled: string;
  expected: string;
  status: 'ON TIME' | 'DELAYED' | 'DISRUPTED';
  platform: string;
  reliability: 'HIGH' | 'MEDIUM' | 'LOW';
  range: string;
}

interface StationBoardTableProps {
  selectedTrainNo: string;
  onSelectTrain: (trainNo: string) => void;
}

export const StationBoardTable: React.FC<StationBoardTableProps> = ({
  selectedTrainNo,
  onSelectTrain,
}) => {
  // Authentic Coaching trains displayed on large station board
  const boardItems: StationBoardItem[] = [
    {
      trainNo: '12627',
      trainName: 'Karnataka Express',
      destination: 'New Delhi (NDLS)',
      scheduled: '14:30',
      expected: '14:42',
      status: 'DELAYED',
      platform: '5',
      reliability: 'MEDIUM',
      range: '14:35 – 14:52',
    },
    {
      trainNo: '12640',
      trainName: 'Brindavan Express',
      destination: 'KSR Bengaluru (SBC)',
      scheduled: '15:00',
      expected: '15:01',
      status: 'ON TIME',
      platform: '3',
      reliability: 'HIGH',
      range: '14:58 – 15:04',
    },
    {
      trainNo: '12628',
      trainName: 'Karnataka Express',
      destination: 'New Delhi (NDLS)',
      scheduled: '15:20',
      expected: '15:36',
      status: 'DELAYED',
      platform: '7',
      reliability: 'MEDIUM',
      range: '15:30 – 15:45',
    },
    {
      trainNo: '12951',
      trainName: 'Mumbai Rajdhani Express',
      destination: 'New Delhi (NDLS)',
      scheduled: '16:00',
      expected: '16:04',
      status: 'ON TIME',
      platform: '1',
      reliability: 'HIGH',
      range: '16:00 – 16:08',
    },
    {
      trainNo: '12840',
      trainName: 'Chennai - Howrah Mail',
      destination: 'Howrah Junction (HWH)',
      scheduled: '16:45',
      expected: '17:13',
      status: 'DELAYED',
      platform: '8',
      reliability: 'LOW',
      range: '17:05 – 17:28',
    },
    {
      trainNo: '22436',
      trainName: 'Vande Bharat Express',
      destination: 'Varanasi Junction (BSB)',
      scheduled: '17:15',
      expected: '17:15',
      status: 'ON TIME',
      platform: '2',
      reliability: 'HIGH',
      range: '17:12 – 17:18',
    },
    {
      trainNo: '12007',
      trainName: 'Shatabdi Express',
      destination: 'Mysuru Junction (MYS)',
      scheduled: '17:40',
      expected: '17:40',
      status: 'ON TIME',
      platform: '4',
      reliability: 'HIGH',
      range: '17:38 – 17:44',
    },
  ];

  return (
    <div className="bg-board-card border border-board-border rounded-lg overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono border-collapse">
          <thead>
            <tr className="bg-board-header border-b border-board-border text-xs sm:text-sm font-bold text-amber-400 uppercase tracking-wider">
              <th className="py-3 px-4 whitespace-nowrap">Train No.</th>
              <th className="py-3 px-4 whitespace-nowrap font-sans">Train Name</th>
              <th className="py-3 px-4 whitespace-nowrap font-sans">Destination</th>
              <th className="py-3 px-4 whitespace-nowrap text-center">Scheduled</th>
              <th className="py-3 px-4 whitespace-nowrap text-center">Expected</th>
              <th className="py-3 px-4 whitespace-nowrap text-center">Status</th>
              <th className="py-3 px-4 whitespace-nowrap text-center">Platform</th>
              <th className="py-3 px-4 whitespace-nowrap text-center">Reliability</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-board-border text-sm sm:text-base text-slate-100">
            {boardItems.map((item) => {
              const isSelected = item.trainNo === selectedTrainNo;

              let statusStyle = 'text-emerald-400 font-black';
              if (item.status === 'DELAYED') {
                statusStyle = 'text-amber-400 font-black';
              } else if (item.status === 'DISRUPTED') {
                statusStyle = 'text-red-400 font-black';
              }

              let relStyle = 'text-emerald-400 font-bold';
              if (item.reliability === 'MEDIUM') {
                relStyle = 'text-amber-300 font-bold';
              } else if (item.reliability === 'LOW') {
                relStyle = 'text-red-400 font-bold';
              }

              return (
                <tr
                  key={item.trainNo}
                  onClick={() => onSelectTrain(item.trainNo)}
                  className={`cursor-pointer transition-colors hover:bg-board-highlight/40 ${
                    isSelected ? 'bg-board-highlight/70 ring-1 ring-amber-400/80' : ''
                  }`}
                >
                  {/* Train Number */}
                  <td className="py-3 px-4 whitespace-nowrap font-black text-amber-300 text-base">
                    {item.trainNo}
                  </td>

                  {/* Train Name */}
                  <td className="py-3 px-4 whitespace-nowrap font-sans font-bold text-white text-base">
                    {item.trainName}
                  </td>

                  {/* Destination */}
                  <td className="py-3 px-4 whitespace-nowrap font-sans text-slate-300 text-sm">
                    {item.destination}
                  </td>

                  {/* Scheduled */}
                  <td className="py-3 px-4 whitespace-nowrap text-center text-slate-400 font-medium">
                    {item.scheduled}
                  </td>

                  {/* Expected Arrival */}
                  <td className="py-3 px-4 whitespace-nowrap text-center font-black text-lg text-white">
                    {item.expected}
                  </td>

                  {/* Status */}
                  <td className={`py-3 px-4 whitespace-nowrap text-center ${statusStyle}`}>
                    {item.status}
                  </td>

                  {/* Platform */}
                  <td className="py-3 px-4 whitespace-nowrap text-center">
                    <span className="inline-block bg-amber-400 text-board-bg font-black text-base px-2.5 py-0.5 rounded">
                      {item.platform}
                    </span>
                  </td>

                  {/* Reliability */}
                  <td className={`py-3 px-4 whitespace-nowrap text-center text-xs ${relStyle}`}>
                    {item.reliability}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
