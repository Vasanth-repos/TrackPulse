import React, { useState } from 'react';
import {
  PNRStatusResponse,
  SMSInboundResponse
} from '../../types/api';
import { fetchPNRStatus, sendInboundSMS } from '../../services/api';
import {
  Smartphone,
  PhoneCall,
  Search,
  CheckCircle2,
  ShieldCheck,
  Clock,
  Train,
  Send,
  HelpCircle,
  AlertCircle,
  MessageSquare,
  Lock,
  Volume2
} from 'lucide-react';

interface PNRLookupDeckProps {
  onSelectTrain?: (trainId: string) => void;
}

export const PNRLookupDeck: React.FC<PNRLookupDeckProps> = ({ onSelectTrain }) => {
  // PNR State
  const [pnrInput, setPnrInput] = useState('4281903490');
  const [pnrLoading, setPnrLoading] = useState(false);
  const [pnrError, setPnrError] = useState<string | null>(null);
  const [pnrResult, setPnrResult] = useState<PNRStatusResponse | null>(null);

  // SMS Simulator State
  const [senderPhone, setSenderPhone] = useState('+919876543210');
  const [smsMessage, setSmsMessage] = useState('ETA 12627 BZA');
  const [smsLoading, setSmsLoading] = useState(false);
  const [smsError, setSmsError] = useState<string | null>(null);
  const [smsResult, setSmsResult] = useState<SMSInboundResponse | null>(null);

  // Active Sub-tab
  const [activeDeck, setActiveDeck] = useState<'pnr' | 'sms' | 'ivr'>('pnr');

  const samplePNRs = [
    { pnr: '4281903490', label: '4281903490 (12627 Karnataka Exp)' },
    { pnr: '8491028374', label: '8491028374 (12621 TN Exp)' },
    { pnr: '1234567890', label: '1234567890 (20607 Vande Bharat)' },
    { pnr: '9876543210', label: '9876543210 (12951 Rajdhani Exp)' }
  ];

  const handleLookupPNR = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pnrInput.trim()) return;
    setPnrLoading(true);
    setPnrError(null);
    try {
      const res = await fetchPNRStatus(pnrInput.trim());
      setPnrResult(res);
    } catch (err: any) {
      setPnrError(err.message || 'PNR Lookup failed. Please verify the 10-digit number.');
    } finally {
      setPnrLoading(false);
    }
  };

  const handleSendSMS = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!smsMessage.trim()) return;
    setSmsLoading(true);
    setSmsError(null);
    try {
      const res = await sendInboundSMS(senderPhone, smsMessage.trim());
      setSmsResult(res);
    } catch (err: any) {
      setSmsError(err.message || 'SMS processing failed');
    } finally {
      setSmsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-gov-900 text-white rounded-md">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gov-950">
                PNR Intelligence & Universal Keypad Phone SMS / IVR Gateway
              </h2>
              <p className="text-xs text-slate-500">
                Inclusive accessibility for all 1.4B citizens: Web PNR inquiry, zero-internet 2G button phone SMS, and 139 IVR integration.
              </p>
            </div>
          </div>

          <span className="px-2.5 py-1 bg-gov-50 text-gov-800 text-[11px] font-bold rounded border border-gov-200 shrink-0">
            CRIS &amp; TRAI COMPLIANT
          </span>
        </div>

        {/* View Switcher */}
        <div className="flex gap-2 pt-4">
          <button
            onClick={() => setActiveDeck('pnr')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeDeck === 'pnr' ? 'gov-switcher-active' : 'gov-switcher-inactive'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            10-Digit PNR Tracker
          </button>

          <button
            onClick={() => setActiveDeck('sms')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeDeck === 'sms' ? 'gov-switcher-active' : 'gov-switcher-inactive'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Button Phone SMS Simulator
          </button>

          <button
            onClick={() => setActiveDeck('ivr')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeDeck === 'ivr' ? 'gov-switcher-active' : 'gov-switcher-inactive'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            139 Toll-Free IVR Voice Tree
          </button>
        </div>
      </div>

      {/* 1. PNR STATUS LOOKUP */}
      {activeDeck === 'pnr' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 space-y-4">
            <h3 className="text-sm font-bold text-gov-950">
              Enter 10-Digit Passenger Name Record (PNR)
            </h3>

            <form onSubmit={handleLookupPNR} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  maxLength={10}
                  value={pnrInput}
                  onChange={(e) => setPnrInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 4281903490"
                  className="w-full pl-3 pr-24 py-2 bg-slate-50 border border-slate-300 rounded font-mono text-sm font-bold text-gov-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gov-800 tracking-wider"
                />
                <span className="absolute right-3 top-2.5 text-[11px] text-slate-400 font-mono">
                  {pnrInput.length}/10
                </span>
              </div>

              <button
                type="submit"
                disabled={pnrLoading || pnrInput.length !== 10}
                className="px-6 py-2 bg-gov-900 hover:bg-gov-950 text-white font-bold rounded text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Search className={`w-3.5 h-3.5 ${pnrLoading ? 'animate-spin' : ''}`} />
                {pnrLoading ? 'Querying CRIS Gateway...' : 'Fetch Live Status'}
              </button>
            </form>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-500 font-semibold text-[11px]">Quick Samples:</span>
              {samplePNRs.map((s) => (
                <button
                  key={s.pnr}
                  type="button"
                  onClick={() => {
                    setPnrInput(s.pnr);
                  }}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-mono rounded border border-slate-200 transition-colors"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Error Banner */}
          {pnrError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded text-xs text-red-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{pnrError}</span>
            </div>
          )}

          {/* PNR Results Card */}
          {pnrResult && (
            <div className="bg-white rounded-xl border-2 border-slate-300 shadow-md overflow-hidden">
              <div className="bg-gov-950 text-white px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold bg-gov-800 px-2.5 py-1 rounded tracking-wider">
                    PNR: {pnrResult.pnr_masked}
                  </span>
                  <span className="text-xs text-slate-300">
                    Booking: <strong className="text-emerald-400 font-bold">{pnrResult.booking_status}</strong> ({pnrResult.coach_berth})
                  </span>
                </div>

                <span className="text-[10px] text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  TrackPulse Mock CRIS Gateway
                </span>
              </div>

              <div className="p-5 space-y-4">
                {/* Train and Route Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="text-base font-black text-gov-950">
                      {pnrResult.train_id} — {pnrResult.train_name}
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Journey: <strong className="text-slate-900">{pnrResult.passenger_boarding_station}</strong> → <strong className="text-slate-900">{pnrResult.passenger_destination_station}</strong> on {pnrResult.journey_date}
                    </p>
                  </div>

                  <button
                    onClick={() => onSelectTrain && onSelectTrain(pnrResult.train_id)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-gov-900 rounded text-xs font-bold transition-colors flex items-center gap-1.5 border border-slate-300 self-start sm:self-auto"
                  >
                    <Train className="w-3.5 h-3.5" />
                    Inspect Train Live
                  </button>
                </div>

                {/* Key Status Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-50 p-3 rounded border border-slate-200">
                    <span className="text-slate-500 font-semibold block text-[11px]">Current Train Delay</span>
                    <div className="font-mono font-bold text-red-700 text-sm mt-0.5">
                      +{pnrResult.current_delay_min} Minutes
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded border border-slate-200">
                    <span className="text-slate-500 font-semibold block text-[11px]">Predicted Arrival (P50)</span>
                    <div className="font-mono font-bold text-gov-950 text-sm mt-0.5">
                      {pnrResult.predicted_arrival}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded border border-slate-200">
                    <span className="text-slate-500 font-semibold block text-[11px]">Quantile Window [P10-P90]</span>
                    <div className="font-mono font-bold text-slate-700 text-xs mt-1">
                      {pnrResult.eta_range}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded border border-slate-200">
                    <span className="text-slate-500 font-semibold block text-[11px]">Calibrated Confidence</span>
                    <div className="font-bold text-emerald-800 text-sm mt-0.5">
                      {pnrResult.reliability_percentage}% Certainty
                    </div>
                  </div>
                </div>

                {/* Plain-Language Status Summary */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-800 font-medium leading-relaxed">
                  <span className="font-bold text-gov-950 block mb-1">Official Journey Summary:</span>
                  {pnrResult.status_summary}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. BUTTON PHONE SMS GATEWAY SIMULATOR */}
      {activeDeck === 'sms' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 6 cols: SMS Form & Presets */}
          <div className="lg:col-span-6 bg-white rounded-lg border border-slate-200 shadow-sm p-5 space-y-4">
            <h3 className="text-sm font-bold text-gov-950">
              Universal Carrier SMS Inbound Gateway (139 / 567678)
            </h3>
            <p className="text-xs text-slate-500">
              Simulate an incoming SMS message from any 2G button phone without active internet access.
            </p>

            <form onSubmit={handleSendSMS} className="space-y-3">
              <div className="space-y-1 text-xs">
                <label htmlFor="sender-mobile-input" className="font-bold text-slate-700 block">Sender Mobile Number:</label>
                <input
                  id="sender-mobile-input"
                  type="text"
                  value={senderPhone}
                  onChange={(e) => setSenderPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 font-mono font-bold text-gov-950 text-xs focus:bg-white"
                />
              </div>

              <div className="space-y-1 text-xs">
                <label htmlFor="sms-command-input" className="font-bold text-slate-700 block">SMS Message Content:</label>
                <input
                  id="sms-command-input"
                  type="text"
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value)}
                  placeholder="e.g. ETA 12627 BZA"
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 font-mono font-bold text-gov-950 text-xs focus:bg-white uppercase"
                />
              </div>

              {/* Quick Command Buttons */}
              <div className="flex flex-wrap gap-2 pt-1 text-xs">
                <button
                  type="button"
                  onClick={() => setSmsMessage('ETA 12627 BZA')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-mono font-semibold rounded border border-slate-200"
                >
                  ETA 12627 BZA
                </button>
                <button
                  type="button"
                  onClick={() => setSmsMessage('PNR 4281903490')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-mono font-semibold rounded border border-slate-200"
                >
                  PNR 4281903490
                </button>
                <button
                  type="button"
                  onClick={() => setSmsMessage('ETA 12621 NDLS')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-mono font-semibold rounded border border-slate-200"
                >
                  ETA 12621 NDLS
                </button>
                <button
                  type="button"
                  onClick={() => setSmsMessage('HELP')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-mono font-semibold rounded border border-slate-200"
                >
                  HELP
                </button>
              </div>

              <button
                type="submit"
                disabled={smsLoading || !smsMessage.trim()}
                className="w-full py-2 bg-gov-900 hover:bg-gov-950 text-white font-bold rounded text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                <Send className={`w-3.5 h-3.5 ${smsLoading ? 'animate-spin' : ''}`} />
                {smsLoading ? 'Simulating Carrier Delivery...' : 'Dispatch Inbound SMS'}
              </button>
            </form>
          </div>

          {/* Right 6 cols: Virtual Phone Display */}
          <div className="lg:col-span-6 bg-slate-900 rounded-2xl p-5 border-4 border-slate-700 shadow-xl flex flex-col justify-between text-white font-mono space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2 text-xs text-slate-400">
              <span>SMS Gateway 139 / 567678</span>
              <span>4G / 2G GSM Signal [||||]</span>
            </div>

            {/* Conversation Bubbles */}
            <div className="space-y-3 py-2 flex-1 min-h-[160px]">
              {/* Outgoing Message from User */}
              <div className="flex justify-end">
                <div className="bg-emerald-800 text-white px-3 py-2 rounded-lg max-w-xs text-xs shadow">
                  <span className="text-[10px] text-emerald-200 block mb-0.5">To: 139 (Indian Railways)</span>
                  {smsMessage}
                </div>
              </div>

              {/* Inbound Response from TrackPulse */}
              {smsResult ? (
                <div className="flex justify-start">
                  <div className="bg-slate-800 text-slate-100 px-3.5 py-2.5 rounded-lg max-w-sm text-xs border border-slate-700 shadow space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>From: TRACKPULSE-IR</span>
                      <span className="font-bold text-emerald-400">
                        {smsResult.character_count}/160 chars
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap leading-relaxed font-mono">
                      {smsResult.response_text}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center text-slate-500 text-xs py-8 italic">
                  Press "Dispatch Inbound SMS" to preview carrier response.
                </div>
              )}
            </div>

            {/* Footer Meter */}
            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Encoding: GSM 7-Bit Clean</span>
              <span className="text-emerald-400 font-bold">100% Zero-Data Capable</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. 139 TOLL-FREE IVR VOICE TREE */}
      {activeDeck === 'ivr' && (
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <div className="p-2.5 bg-amber-600 text-white rounded-md">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gov-950">
                139 Interactive Voice Response (IVR) Script Architecture
              </h3>
              <p className="text-xs text-slate-500">
                Audio synthesized automated telephony tree powered by TrackPulse Quantile ETA Predictions.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
              <span className="font-black text-gov-950 block text-xs">Prompt 1: Language &amp; Service</span>
              <div className="p-2.5 bg-white rounded border border-slate-200 text-slate-700 font-medium leading-relaxed">
                "Welcome to Indian Railways TrackPulse ETA Hotline. For Hindi press 1. For English press 2. For Tamil press 3."
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
              <span className="font-black text-gov-950 block text-xs">Prompt 2: Train Number Inquiry</span>
              <div className="p-2.5 bg-white rounded border border-slate-200 text-slate-700 font-medium leading-relaxed">
                "Please enter the 5-digit train number followed by the hash key. (e.g. 1 2 6 2 7 #)"
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
              <span className="font-black text-gov-950 block text-xs">Prompt 3: Quantile Speech Synthesizer</span>
              <div className="p-2.5 bg-emerald-50 rounded border border-emerald-200 text-emerald-950 font-medium leading-relaxed">
                "Train 12627 is running 35 minutes late. Expected arrival at Vijayawada between 19:00 and 19:15 with 94% reliability."
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
