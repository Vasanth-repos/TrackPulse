import React, { useState } from 'react';
import { MessageSquare, PhoneCall, Info, Send, ChevronRight, Server, Smartphone, Radio } from 'lucide-react';
import { Language, translations } from '../../utils/translations';

interface SmsIvrSectionProps {
  language: Language;
}

export const SmsIvrSection: React.FC<SmsIvrSectionProps> = ({ language }) => {
  const t = translations[language];
  const [activeMode, setActiveMode] = useState<'SMS' | 'IVR'>('SMS');
  const [showArchModal, setShowArchModal] = useState(false);

  const [inputSms, setInputSms] = useState('ETA 12627 BZA');
  const [smsResponse, setSmsResponse] = useState(`TRACKPULSE
Train 12627 (Karnataka Exp)
BZA ETA: 14:42
Range: 14:35–14:52
Reliability: MEDIUM
Status: DELAYED (+18m)
Platform: 5`);

  const handleSendTestSms = (e: React.FormEvent) => {
    e.preventDefault();
    const parts = inputSms.trim().split(' ');
    const trainNo = parts[1] || '12627';
    const stn = parts[2] || 'BZA';

    setSmsResponse(`TRACKPULSE
Train ${trainNo}
${stn.toUpperCase()} ETA: 14:42
Range: 14:35–14:52
Reliability: MEDIUM
Status: DELAYED (+18m)
Platform: 5`);
  };

  return (
    <div className="gov-card p-5 bg-white border border-slate-200 space-y-4">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-2.5 gap-2">
        <div>
          <h3 className="text-xs font-bold text-gov-950 uppercase tracking-wider flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-gov-800" />
            {t.smsTitle}
          </h3>
          <p className="text-[11px] text-slate-500">
            {t.smsSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Segmented SMS / IVR Switcher */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded border border-slate-200 text-xs">
            <button
              onClick={() => setActiveMode('SMS')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors flex items-center gap-1 ${
                activeMode === 'SMS' ? 'bg-gov-900 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              <MessageSquare className="w-3 h-3" />
              SMS Gateway
            </button>
            <button
              onClick={() => setActiveMode('IVR')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors flex items-center gap-1 ${
                activeMode === 'IVR' ? 'bg-gov-900 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              <PhoneCall className="w-3 h-3" />
              Toll-Free IVR Flow
            </button>
          </div>

          <button
            onClick={() => setShowArchModal(!showArchModal)}
            className="px-2.5 py-1 bg-gov-50 hover:bg-gov-100 text-gov-900 text-[11px] font-bold rounded border border-gov-200 transition-colors flex items-center gap-1"
          >
            <Info className="w-3 h-3" />
            {t.howItWorks}
          </button>
        </div>
      </div>

      {/* Architecture Flow Banner (when expanded) */}
      {showArchModal && (
        <div className="p-3.5 bg-gov-50/80 rounded-lg border border-gov-200 space-y-2">
          <div className="text-xs font-bold text-gov-950 uppercase tracking-wide">
            Universal Telephony Architecture Diagram
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs py-2 bg-white rounded p-3 border border-slate-200">
            <div className="flex items-center gap-1 font-bold text-slate-800">
              <Smartphone className="w-4 h-4 text-slate-600" />
              <span>Keypad Phone</span>
            </div>
            <span className="text-slate-400">→</span>
            <div className="flex items-center gap-1 font-bold text-slate-800">
              <Server className="w-4 h-4 text-gov-700" />
              <span>SMS / Telecom Gateway</span>
            </div>
            <span className="text-slate-400">→</span>
            <div className="flex items-center gap-1 font-bold text-slate-800">
              <Radio className="w-4 h-4 text-gov-800" />
              <span>TrackPulse API</span>
            </div>
            <span className="text-slate-400">→</span>
            <div className="flex items-center gap-1 font-bold text-slate-800">
              <Radio className="w-4 h-4 text-emerald-700" />
              <span>Quantile ETA Engine</span>
            </div>
            <span className="text-slate-400">→</span>
            <div className="flex items-center gap-1 font-bold text-gov-900">
              <MessageSquare className="w-4 h-4 text-gov-700" />
              <span>Instant Outbound SMS</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-600">
            Enables 100% digital accessibility for non-smartphone users across all 2G/3G feature phones in rural & suburban districts.
          </div>
        </div>
      )}

      {/* Interactive SMS Simulator Tab */}
      {activeMode === 'SMS' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Instructions */}
          <div className="md:col-span-6 space-y-2 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <div className="font-bold text-slate-800">SMS Command Format:</div>
              <div className="font-mono text-sm font-black text-gov-900 bg-white p-2 rounded border border-slate-200 inline-block">
                ETA &lt;Train Number&gt; &lt;Station Code&gt;
              </div>
              <div className="text-[11px] text-slate-500 pt-1">
                Example: Send <strong>ETA 12627 BZA</strong> to the railway inquiry shortcode.
              </div>
            </div>

            {/* Test Simulator Form */}
            <form onSubmit={handleSendTestSms} className="flex gap-2">
              <input
                type="text"
                value={inputSms}
                onChange={(e) => setInputSms(e.target.value)}
                placeholder="ETA 12627 BZA"
                className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded font-mono text-xs uppercase"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-gov-900 text-white font-bold rounded text-xs flex items-center gap-1 hover:bg-gov-950"
              >
                <Send className="w-3 h-3" />
                Simulate SMS
              </button>
            </form>
          </div>

          {/* Phone Screen Mockup */}
          <div className="md:col-span-6 flex justify-center">
            <div className="w-full max-w-sm rounded-xl bg-slate-900 p-4 text-white shadow-md border-4 border-slate-800 font-mono text-xs space-y-2">
              <div className="flex justify-between text-[10px] text-slate-400 border-b border-slate-700 pb-1">
                <span>SMS INQUIRY</span>
                <span>SIGNAL: ●●●●</span>
              </div>
              
              <div className="bg-slate-800 p-2 rounded text-blue-300 text-[11px]">
                Sent: {inputSms}
              </div>

              <div className="bg-emerald-950/80 border border-emerald-700 p-3 rounded text-emerald-300 whitespace-pre-line text-xs font-mono font-bold leading-relaxed">
                {smsResponse}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive IVR Voice Option Tab */}
      {activeMode === 'IVR' && (
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3 text-xs">
          <div className="font-bold text-gov-950 text-sm flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-gov-800" />
            Interactive Voice Response (IVR) Step-by-Step Flow
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            <div className="p-2.5 bg-white rounded border border-slate-200 space-y-1">
              <span className="font-bold text-gov-900 text-[11px]">Step 1</span>
              <p className="text-[11px] text-slate-600">Dial National Railway IVR</p>
            </div>
            <div className="p-2.5 bg-white rounded border border-slate-200 space-y-1">
              <span className="font-bold text-gov-900 text-[11px]">Step 2</span>
              <p className="text-[11px] text-slate-600">Enter 5-digit Train No: <strong>12627</strong></p>
            </div>
            <div className="p-2.5 bg-white rounded border border-slate-200 space-y-1">
              <span className="font-bold text-gov-900 text-[11px]">Step 3</span>
              <p className="text-[11px] text-slate-600">Key in Station Code: <strong>BZA (292)</strong></p>
            </div>
            <div className="p-2.5 bg-white rounded border border-slate-200 space-y-1">
              <span className="font-bold text-emerald-800 text-[11px]">Step 4</span>
              <p className="text-[11px] text-slate-600">Hear clear spoken ETA & confidence interval in English, தமிழ் or हिन्दी</p>
            </div>
          </div>

          <div className="p-2.5 bg-white rounded border border-slate-200 text-slate-700 italic text-[11px]">
            🔊 <em>Simulated voice readout: "Train 1-2-6-2-7 Karnataka Express is expected at Vijayawada Junction at 14:42 hours with an estimated arrival window between 14:35 and 14:52 hours. Expected delay: 18 minutes."</em>
          </div>
        </div>
      )}

    </div>
  );
};
