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
  Volume2,
  Radio,
  Sparkles,
  Signal,
  Battery
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
  const [lastSentMessage, setLastSentMessage] = useState('ETA 12627 BZA');
  const [smsResult, setSmsResult] = useState<SMSInboundResponse | null>({
    sender_masked: '+91987****210',
    command_detected: 'ETA_INQUIRY',
    response_text: "TRACKPULSE\n\n12627 Karnataka Express\nBZA ETA: 14:42\nRange: 14:35-14:52\nReliability: MEDIUM\nStatus: DELAYED\nDelay: +18 min",
    character_count: 120,
    is_sms_friendly: true
  });

  // Active Sub-tab
  const [activeDeck, setActiveDeck] = useState<'sms' | 'pnr' | 'ivr'>('sms');

  const samplePNRs = [
    { pnr: '4281903490', train: '12627 Karnataka Exp' },
    { pnr: '8491028374', train: '12621 TN Exp' },
    { pnr: '1234567890', train: '20607 Vande Bharat' },
    { pnr: '9876543210', train: '12951 Rajdhani Exp' }
  ];

  const quickCommands = [
    { cmd: 'ETA 12627 BZA', tag: 'ETA', label: '12627 to Vijayawada' },
    { cmd: 'STATUS 12627 BZA', tag: 'STATUS', label: '12627 Live Position' },
    { cmd: 'ETA 12621 NDLS', tag: 'ETA', label: '12621 to New Delhi' },
    { cmd: 'HELP', tag: 'HELP', label: 'Command List' },
    { cmd: 'PNR 4281903490', tag: 'PNR', label: 'PNR Inquiry' }
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

  const handleSendSMS = async (e?: React.FormEvent, customMsg?: string) => {
    if (e) e.preventDefault();
    const msgToSend = (customMsg || smsMessage).trim();
    if (!msgToSend) return;
    setSmsMessage(msgToSend);
    setLastSentMessage(msgToSend);
    setSmsLoading(true);
    setSmsError(null);
    try {
      const res = await sendInboundSMS(senderPhone, msgToSend);
      setSmsResult(res);
    } catch (err: any) {
      setSmsError(err.message || 'SMS processing failed');
    } finally {
      setSmsLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gov-900 text-white rounded-lg shrink-0 shadow-xs">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gov-950 flex items-center gap-2">
                Passenger Services &amp; Keypad SMS Gateway
              </h2>
              <p className="text-xs text-slate-500">
                Universal access for all 1.4B citizens: Zero-data 2G phone SMS (139), PNR tracking, and IVR helpline.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-[11px] font-bold rounded-full border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              Official 139 Gateway
            </span>
            <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[11px] font-semibold rounded-full border border-slate-200">
              TRAI Compliant
            </span>
          </div>
        </div>

        {/* Clean Segmented Tab Switcher */}
        <div className="flex flex-wrap items-center gap-2 pt-3.5">
          <button
            onClick={() => setActiveDeck('sms')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeDeck === 'sms'
                ? 'bg-gov-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Button Phone SMS Simulator</span>
          </button>

          <button
            onClick={() => setActiveDeck('pnr')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeDeck === 'pnr'
                ? 'bg-gov-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>10-Digit PNR Tracker</span>
          </button>

          <button
            onClick={() => setActiveDeck('ivr')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeDeck === 'ivr'
                ? 'bg-gov-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>139 Toll-Free IVR Tree</span>
          </button>
        </div>
      </div>

      {/* 1. BUTTON PHONE SMS GATEWAY SIMULATOR */}
      {activeDeck === 'sms' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
          {/* Left Column: Console Form */}
          <div className="md:col-span-6 bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-gov-950 flex items-center gap-2">
                  <Radio className="w-4 h-4 text-gov-800" />
                  SMS Gateway Dispatcher
                </h3>
                <p className="text-[11px] text-slate-500">
                  Simulate keypad phone SMS queries over standard telecom channels.
                </p>
              </div>
              <span className="px-2 py-0.5 bg-amber-50 text-amber-900 border border-amber-300 rounded text-[10px] font-bold tracking-wider uppercase shrink-0">
                DEMO SIMULATOR
              </span>
            </div>

            <form onSubmit={handleSendSMS} className="space-y-3.5">
              <div className="space-y-1 text-xs">
                <label htmlFor="sender-mobile-input" className="font-bold text-slate-700 block">
                  Sender Mobile Number:
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-mono font-bold text-slate-400">
                    🇮🇳
                  </span>
                  <input
                    id="sender-mobile-input"
                    type="text"
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold text-gov-950 text-xs focus:bg-white focus:ring-1 focus:ring-gov-800 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <label htmlFor="sms-command-input" className="font-bold text-slate-700">
                    SMS Message Content:
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {smsMessage.length}/160 chars
                  </span>
                </div>
                <input
                  id="sms-command-input"
                  type="text"
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value)}
                  placeholder="e.g. ETA 12627 BZA"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold text-gov-950 text-xs focus:bg-white focus:ring-1 focus:ring-gov-800 focus:outline-none uppercase transition-all tracking-wide"
                />
              </div>

              {/* Quick Command Chips */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-slate-600 block">
                  Quick Command Presets:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {quickCommands.map((q) => (
                    <button
                      key={q.cmd}
                      type="button"
                      onClick={() => handleSendSMS(undefined, q.cmd)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-mono font-semibold rounded-md border border-slate-200 transition-all flex items-center gap-1.5 hover:border-slate-300 active:scale-95"
                    >
                      <span className="px-1 py-0.2 bg-gov-100 text-gov-900 rounded text-[9px] font-bold">
                        {q.tag}
                      </span>
                      <span>{q.cmd}</span>
                    </button>
                  ))}
                </div>
              </div>

              {smsError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{smsError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={smsLoading || !smsMessage.trim()}
                className="w-full py-2.5 bg-gov-900 hover:bg-gov-950 text-white font-bold rounded-lg text-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm active:scale-[0.99] mt-1"
              >
                <Send className={`w-3.5 h-3.5 ${smsLoading ? 'animate-spin' : ''}`} />
                {smsLoading ? 'Connecting to Telecom Gateway...' : 'Send SMS to 139'}
              </button>
            </form>

            {/* Quick Syntax Help Card */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5 text-[11px]">
              <span className="font-bold text-slate-700 block">Official Keypad SMS Syntax:</span>
              <ul className="space-y-1 text-slate-600 font-mono text-[10px]">
                <li>• <strong className="text-gov-900">ETA &lt;TrainNo&gt; &lt;StnCode&gt;</strong> → Predicted ETA &amp; Range</li>
                <li>• <strong className="text-gov-900">STATUS &lt;TrainNo&gt; &lt;StnCode&gt;</strong> → Current Station &amp; Delay</li>
                <li>• <strong className="text-gov-900">HELP</strong> → List available SMS commands</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Virtual Keypad Phone Display */}
          <div className="md:col-span-6 bg-slate-900 rounded-2xl p-4 sm:p-5 border-4 border-slate-700 shadow-xl flex flex-col justify-between text-white font-mono space-y-4 min-h-[420px]">
            {/* Phone Screen Status Bar */}
            <div className="flex items-center justify-between border-b border-slate-700 pb-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <Signal className="w-3.5 h-3.5" />
                <span>2G GSM • 139 (IR)</span>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <span>98%</span>
                <Battery className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Conversation Messages */}
            <div className="space-y-3 py-2 flex-1 overflow-y-auto">
              {/* Outgoing Message from User */}
              <div className="flex justify-end">
                <div className="bg-emerald-700 text-white px-3.5 py-2 rounded-2xl rounded-tr-xs max-w-[85%] text-xs shadow-md space-y-0.5">
                  <span className="text-[9px] text-emerald-200 block font-sans">To: 139 (Indian Railways)</span>
                  <p className="font-mono font-bold tracking-wide">{lastSentMessage}</p>
                </div>
              </div>

              {/* Inbound Response from TrackPulse */}
              {smsResult ? (
                <div className="flex justify-start">
                  <div className="bg-slate-800 text-slate-100 p-3.5 rounded-2xl rounded-tl-xs max-w-[95%] text-xs border border-slate-700 shadow-md space-y-2">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-700/60 pb-1.5 font-sans">
                      <span className="font-bold text-amber-400">From: TRACKPULSE-IR</span>
                      <span className="font-mono text-emerald-400">
                        {smsResult.character_count}/160 chars
                      </span>
                    </div>
                    <pre className="whitespace-pre-wrap leading-relaxed font-mono text-[11px] text-slate-200 font-semibold selection:bg-slate-700">
                      {smsResult.response_text}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="text-center text-slate-500 text-xs py-12 italic font-sans">
                  Press "Send SMS to 139" to preview carrier response.
                </div>
              )}
            </div>

            {/* Phone Screen Footer Bar */}
            <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between font-sans">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Encoding: GSM 7-Bit Clean
              </span>
              <span className="text-emerald-400 font-bold">100% Zero-Data Capable</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. PNR STATUS LOOKUP */}
      {activeDeck === 'pnr' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
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
                  className="w-full pl-3 pr-20 py-2.5 bg-slate-50 border border-slate-300 rounded-lg font-mono text-sm font-bold text-gov-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gov-800 tracking-widest"
                />
                <span className="absolute right-3 top-3 text-[11px] text-slate-400 font-mono">
                  {pnrInput.length}/10
                </span>
              </div>

              <button
                type="submit"
                disabled={pnrLoading || pnrInput.length !== 10}
                className="px-6 py-2.5 bg-gov-900 hover:bg-gov-950 text-white font-bold rounded-lg text-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
              >
                <Search className={`w-3.5 h-3.5 ${pnrLoading ? 'animate-spin' : ''}`} />
                {pnrLoading ? 'Querying CRIS Gateway...' : 'Fetch Live Status'}
              </button>
            </form>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-500 font-bold text-[11px]">Quick Samples:</span>
              {samplePNRs.map((s) => (
                <button
                  key={s.pnr}
                  type="button"
                  onClick={() => {
                    setPnrInput(s.pnr);
                    fetchPNRStatus(s.pnr).then(setPnrResult).catch(() => {});
                  }}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-mono rounded-md border border-slate-200 transition-colors"
                >
                  {s.pnr} ({s.train})
                </button>
              ))}
            </div>

            {pnrError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{pnrError}</span>
              </div>
            )}
          </div>

          {/* PNR Result Display */}
          {pnrResult && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-lg text-gov-950">
                      PNR: {pnrResult.pnr_masked}
                    </span>
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded text-[11px] font-bold">
                      {pnrResult.booking_status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Coach: <strong className="text-slate-800">{pnrResult.coach_berth}</strong> • Journey: {pnrResult.passenger_boarding_station} → {pnrResult.passenger_destination_station}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-mono">Predicted Destination ETA</span>
                  <span className="text-base font-black text-gov-900 font-mono">
                    {pnrResult.predicted_arrival}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 text-[10px] block">Train</span>
                  <span className="font-mono font-bold text-gov-950 text-sm">
                    {pnrResult.train_id} {pnrResult.train_name}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 text-[10px] block">Uncertainty Range</span>
                  <span className="font-mono font-bold text-gov-950 text-sm">
                    {pnrResult.eta_range}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 text-[10px] block">Reliability Score</span>
                  <span className="font-mono font-bold text-emerald-700 text-sm">
                    {pnrResult.reliability_percentage}%
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 text-[10px] block">Transfer Risk</span>
                  <span className="font-mono font-bold text-amber-700 text-sm">
                    {pnrResult.connection_risk}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. 139 TOLL-FREE IVR VOICE TREE */}
      {activeDeck === 'ivr' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <div className="p-2.5 bg-amber-600 text-white rounded-lg">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gov-950">
                139 Interactive Voice Response (IVR) Automated Telephony
              </h3>
              <p className="text-xs text-slate-500">
                Audio synthesized automated hotline powered by TrackPulse Quantile ETA predictions.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-gov-900 text-white text-[10px] font-bold flex items-center justify-center">1</span>
                <span className="font-bold text-gov-950">Language &amp; Welcome</span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200 text-slate-700 font-medium leading-relaxed text-[11px]">
                "Welcome to Indian Railways TrackPulse ETA Hotline. For Hindi press 1. For English press 2. For Tamil press 3."
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-gov-900 text-white text-[10px] font-bold flex items-center justify-center">2</span>
                <span className="font-bold text-gov-950">Train Input Prompt</span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200 text-slate-700 font-medium leading-relaxed text-[11px]">
                "Please enter the 5-digit train number followed by the hash key. (e.g. 1 2 6 2 7 #)"
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-700 text-white text-[10px] font-bold flex items-center justify-center">3</span>
                <span className="font-bold text-emerald-950">Synthesized Quantile Output</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-950 font-medium leading-relaxed text-[11px]">
                "Train 12627 is running 18 minutes late. Expected arrival at Vijayawada between 14:35 and 14:52 with Medium reliability."
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
