import React, { useState, useEffect } from 'react';
import { ReplaySession, ReplayStepEvent } from '../../types/api';
import { stepReplaySession, jumpReplayStep, resetReplaySession } from '../../services/api';
import { Play, Pause, RotateCcw, SkipBack, SkipForward, Clock, ShieldCheck, AlertTriangle, AlertOctagon, Activity, Radio, CheckCircle2 } from 'lucide-react';

interface ReplayStudioProps {
  initialSession: ReplaySession | null;
}

export const ReplayStudio: React.FC<ReplayStudioProps> = ({ initialSession }) => {
  const [session, setSession] = useState<ReplaySession | null>(initialSession);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);

  useEffect(() => {
    setSession(initialSession);
  }, [initialSession]);

  // Automated playback loop
  useEffect(() => {
    let interval: any = null;
    if (isPlaying && session && session.current_step < session.total_steps - 1) {
      interval = setInterval(async () => {
        try {
          const updated = await stepReplaySession('12627', 1);
          setSession(updated);
          if (updated.current_step >= updated.total_steps - 1) {
            setIsPlaying(false);
          }
        } catch (err) {
          setIsPlaying(false);
        }
      }, 1500 / speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, session, speed]);

  const handleStep = async (delta: number) => {
    setIsPlaying(false);
    try {
      const updated = await stepReplaySession('12627', delta);
      setSession(updated);
    } catch (e) {
      console.error(e);
    }
  };

  const handleJump = async (stepIndex: number) => {
    setIsPlaying(false);
    try {
      const updated = await jumpReplayStep('12627', stepIndex);
      setSession(updated);
    } catch (e) {
      console.error(e);
    }
  };

  const handleReset = async () => {
    setIsPlaying(false);
    try {
      const updated = await resetReplaySession('12627');
      setSession(updated);
    } catch (e) {
      console.error(e);
    }
  };

  if (!session) {
    return (
      <div className="gov-card p-8 text-center text-slate-600 bg-white border border-slate-300 rounded-lg">
        Loading replay simulation engine...
      </div>
    );
  }

  const currentStepData: ReplayStepEvent = session.steps[session.current_step] || session.steps[0];

  let regimeBadge = 'bg-emerald-50 text-emerald-900 border-emerald-300';
  if (currentStepData.regime === 'DELAYED') {
    regimeBadge = 'bg-amber-50 text-amber-900 border-amber-300';
  } else if (currentStepData.regime === 'DISRUPTED') {
    regimeBadge = 'bg-red-50 text-red-900 border-red-300';
  }

  return (
    <div className="space-y-4">
      
      {/* Replay Control Bar & Scenario Title */}
      <div className="gov-card p-4 bg-white border border-slate-300 rounded-lg shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-gov-50 text-gov-900 text-xs font-mono font-bold px-2 py-0.5 rounded border border-gov-300">
              HISTORICAL REPLAY
            </span>
            <h2 className="text-sm sm:text-base font-black text-gov-950 uppercase tracking-wide">
              {session.scenario_name}
            </h2>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Chronological streaming replay demonstrating live ETA adaptation, uncertainty envelope shifts, and reliability recalibration without data leakage.
          </p>
        </div>

        {/* Quick Scenario Jump Buttons */}
        <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-lg border border-slate-300 text-xs">
          <span className="text-[11px] text-slate-700 font-bold font-mono pl-1">Preset Phase:</span>
          <button
            onClick={() => handleJump(3)}
            className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-800 text-[11px] font-mono font-bold rounded border border-emerald-300 shadow-xs transition-colors"
          >
            1. Normal
          </button>
          <button
            onClick={() => handleJump(13)}
            className="px-2.5 py-1 bg-white hover:bg-red-50 text-red-800 text-[11px] font-mono font-bold rounded border border-red-300 shadow-xs transition-colors"
          >
            2. Disruption
          </button>
          <button
            onClick={() => handleJump(21)}
            className="px-2.5 py-1 bg-white hover:bg-blue-50 text-blue-800 text-[11px] font-mono font-bold rounded border border-blue-300 shadow-xs transition-colors"
          >
            3. Recovery
          </button>
        </div>
      </div>

      {/* Main Studio Interactive Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left / Center: Live Telemetry State Monitor */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Real-time State Card */}
          <div className="gov-card p-5 bg-white border border-slate-300 rounded-lg shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Current Simulated Observation</span>
                <div className="text-lg font-black text-gov-950 flex items-center space-x-2">
                  <span>{currentStepData.current_station_name}</span>
                  <span className="text-gov-700 font-mono text-sm">[{currentStepData.current_station_code}]</span>
                </div>
              </div>

              {/* Operating Regime */}
              <div className={`px-3 py-1 rounded-md text-xs font-bold border flex items-center space-x-1.5 ${regimeBadge}`}>
                <div className="w-2 h-2 rounded-full bg-current" />
                <span>● {currentStepData.regime} REGIME</span>
              </div>
            </div>

            {/* Grid of Key Forecast Signals */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Delay at Station */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">OBSERVED DELAY</span>
                <span className={`text-xl font-mono font-black ${
                  currentStepData.actual_delay_min === 0 ? 'text-emerald-700' :
                  currentStepData.actual_delay_min <= 15 ? 'text-amber-700' : 'text-red-700'
                }`}>
                  +{currentStepData.actual_delay_min} min
                </span>
              </div>

              {/* Destination ETA */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">DESTINATION ETA</span>
                <span className="text-xl font-mono font-black text-gov-950">
                  {currentStepData.predicted_eta}
                </span>
              </div>

              {/* Prediction Interval */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">ESTIMATED RANGE</span>
                <span className="text-xs font-mono font-bold text-slate-800 block mt-1">
                  {currentStepData.interval_lower} – {currentStepData.interval_upper}
                </span>
                <span className="text-[10px] text-gov-700 font-mono font-semibold">
                  (±{Math.round(currentStepData.interval_width_min / 2)}m span)
                </span>
              </div>

              {/* Reliability Score */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">RELIABILITY INDEX</span>
                <div className="flex items-baseline space-x-1 mt-0.5">
                  <span className={`text-xl font-mono font-black ${
                    currentStepData.reliability_score >= 70 ? 'text-emerald-700' :
                    currentStepData.reliability_score >= 40 ? 'text-amber-700' : 'text-red-700'
                  }`}>
                    {currentStepData.reliability_score}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">/100</span>
                </div>
              </div>
            </div>

            {/* Dynamic Event Narrative Banner */}
            <div className={`p-3.5 rounded-lg border text-xs leading-relaxed ${
              currentStepData.is_disruption_event
                ? 'bg-red-50 border-red-300 text-red-950'
                : currentStepData.is_recovery_event
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}>
              <div className="font-mono text-[10px] text-slate-600 uppercase font-bold mb-0.5">
                Simulated Telemetry Stream Event Log:
              </div>
              {currentStepData.narrative_description}
            </div>
          </div>

          {/* Timeline Scrubber Card */}
          <div className="gov-card p-4 bg-white border border-slate-300 rounded-lg shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-600">
                Station Progression: <strong className="text-gov-950 font-bold">{session.current_step + 1}</strong> of {session.total_steps}
              </span>
              <span className="text-slate-600 font-bold">
                Origin (SBC) → Destination (NDLS)
              </span>
            </div>

            {/* Scrubber Range Slider */}
            <input
              type="range"
              min={0}
              max={session.total_steps - 1}
              value={session.current_step}
              onChange={(e) => handleJump(parseInt(e.target.value))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-gov-900"
            />

            {/* Playback Controls Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleReset}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 p-2 rounded-md border border-slate-300 transition-colors shadow-xs"
                  title="Reset to origin"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleStep(-1)}
                  disabled={session.current_step === 0}
                  className="bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-800 p-2 rounded-md border border-slate-300 transition-colors shadow-xs"
                  title="Previous station"
                >
                  <SkipBack className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="bg-gov-900 hover:bg-gov-950 text-white font-bold px-4 py-2 rounded-md flex items-center space-x-1.5 shadow-sm transition-all"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  <span className="font-mono text-xs uppercase tracking-wider">{isPlaying ? 'Pause' : 'Play Replay'}</span>
                </button>
                <button
                  onClick={() => handleStep(1)}
                  disabled={session.current_step >= session.total_steps - 1}
                  className="bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-800 p-2 rounded-md border border-slate-300 transition-colors shadow-xs"
                  title="Next station"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              {/* Speed Multipliers */}
              <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-md border border-slate-300">
                <span className="text-[10px] text-slate-600 font-mono font-bold px-1">Speed:</span>
                {[1, 2, 5].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                      speed === s ? 'bg-gov-900 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Auditable Signals at Current Step */}
        <div className="lg:col-span-4 space-y-4">
          <div className="gov-card p-4 bg-white border border-slate-300 rounded-lg shadow-sm space-y-3">
            <div className="flex items-center space-x-2 border-b border-slate-200 pb-2.5">
              <Activity className="w-4 h-4 text-gov-800" />
              <h3 className="text-xs font-bold text-gov-950 uppercase font-mono tracking-wider">
                Step Auditable Evidence
              </h3>
            </div>

            <div className="space-y-2">
              {currentStepData.evidence_summary.map((ev, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 p-2.5 rounded text-xs text-slate-800 flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gov-700 flex-shrink-0 mt-1.5" />
                  <span className="leading-snug">{ev}</span>
                </div>
              ))}
            </div>

            {/* Mathematical Guarantee Card */}
            <div className="mt-4 p-3 bg-slate-100 rounded-lg border border-slate-300 text-[11px] text-slate-700 font-mono space-y-1.5">
              <div className="font-bold text-gov-950 uppercase">Leakage-Free Protocol:</div>
              <div>• Revealed Stations: 1 to {session.current_step + 1}</div>
              <div>• Future Stations: Strictly masked</div>
              <div>• Anti-Crossing: Monotonically verified</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
