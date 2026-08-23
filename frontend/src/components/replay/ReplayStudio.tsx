import React, { useState, useEffect } from 'react';
import { ReplaySession, ReplayStepEvent } from '../../types/api';
import { stepReplaySession, jumpReplayStep, resetReplaySession } from '../../services/api';
import { Play, Pause, RotateCcw, FastForward, SkipBack, SkipForward, Train, Clock, ShieldCheck, AlertTriangle, AlertOctagon, HelpCircle, Activity } from 'lucide-react';

interface ReplayStudioProps {
  initialSession: ReplaySession | null;
}

export const ReplayStudio: React.FC<ReplayStudioProps> = ({ initialSession }) => {
  const [session, setSession] = useState<ReplaySession | null>(initialSession);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
      <div className="p-8 text-center text-rail-400 bg-rail-900 border border-rail-800 rounded-xl">
        Loading replay simulation engine...
      </div>
    );
  }

  const currentStepData: ReplayStepEvent = session.steps[session.current_step] || session.steps[0];

  return (
    <div className="space-y-4">
      {/* Replay Control Bar & Scenario Title */}
      <div className="bg-gradient-to-r from-rail-900 via-rail-850 to-rail-900 border border-rail-750 p-4 rounded-xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-signal-cyan/20 text-signal-cyan text-xs font-mono font-bold px-2 py-0.5 rounded border border-signal-cyan/30">
              SIMULATION STUDIO
            </span>
            <h2 className="text-sm sm:text-base font-bold text-white font-mono uppercase tracking-wide">
              {session.scenario_name}
            </h2>
          </div>
          <p className="text-xs text-rail-300 mt-1">
            Chronological streaming replay demonstrating live ETA adaptation, uncertainty envelope shifts, and reliability recalibration.
          </p>
        </div>

        {/* Quick Scenario Jump Buttons for Judge Presentation */}
        <div className="flex items-center space-x-2 bg-rail-950 p-1.5 rounded-lg border border-rail-800 text-xs">
          <span className="text-[11px] text-rail-400 font-mono pl-1">Preset Phase:</span>
          <button
            onClick={() => handleJump(3)}
            className="px-2 py-1 bg-rail-800 hover:bg-rail-750 text-signal-green text-[11px] font-mono font-bold rounded border border-signal-green/30"
          >
            1. Normal
          </button>
          <button
            onClick={() => handleJump(13)}
            className="px-2 py-1 bg-rail-800 hover:bg-rail-750 text-signal-red text-[11px] font-mono font-bold rounded border border-signal-red/30"
          >
            2. Disruption
          </button>
          <button
            onClick={() => handleJump(21)}
            className="px-2 py-1 bg-rail-800 hover:bg-rail-750 text-signal-cyan text-[11px] font-mono font-bold rounded border border-signal-cyan/30"
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
          <div className="bg-rail-900 border border-rail-800 rounded-xl p-5 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-rail-800 pb-3 mb-4">
              <div>
                <span className="text-xs text-rail-400 font-mono">Current Simulated Observation</span>
                <div className="text-lg font-bold text-white flex items-center space-x-2">
                  <span>{currentStepData.current_station_name}</span>
                  <span className="text-signal-cyan font-mono text-sm">({currentStepData.current_station_code})</span>
                </div>
              </div>

              {/* Operating Regime */}
              <div className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border flex items-center space-x-1.5 ${
                currentStepData.regime === 'NORMAL' ? 'bg-signal-green/20 text-signal-green border-signal-green/40 glow-signal-green' :
                currentStepData.regime === 'DELAYED' ? 'bg-signal-amber/20 text-signal-amber border-signal-amber/40 glow-signal-amber' :
                'bg-signal-red/20 text-signal-red border-signal-red/40 glow-signal-red animate-pulse'
              }`}>
                <div className="w-2 h-2 rounded-full bg-current" />
                <span>● {currentStepData.regime} REGIME</span>
              </div>
            </div>

            {/* Grid of Key Forecast Signals */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {/* Delay at Station */}
              <div className="bg-rail-950 p-3 rounded-lg border border-rail-800">
                <span className="text-[10px] text-rail-400 font-mono block">OBSERVED DELAY</span>
                <span className={`text-xl font-mono font-black ${
                  currentStepData.actual_delay_min === 0 ? 'text-signal-green' :
                  currentStepData.actual_delay_min <= 15 ? 'text-signal-amber' : 'text-signal-red'
                }`}>
                  +{currentStepData.actual_delay_min} min
                </span>
              </div>

              {/* Destination ETA */}
              <div className="bg-rail-950 p-3 rounded-lg border border-rail-800">
                <span className="text-[10px] text-rail-400 font-mono block">DESTINATION ETA</span>
                <span className="text-xl font-mono font-black text-white">
                  {currentStepData.predicted_eta}
                </span>
              </div>

              {/* Prediction Interval */}
              <div className="bg-rail-950 p-3 rounded-lg border border-rail-800">
                <span className="text-[10px] text-rail-400 font-mono block">EXPECTED WINDOW</span>
                <span className="text-xs font-mono font-bold text-rail-200 block mt-1">
                  {currentStepData.interval_lower} – {currentStepData.interval_upper}
                </span>
                <span className="text-[10px] text-signal-cyan font-mono">
                  (±{Math.round(currentStepData.interval_width_min / 2)}m span)
                </span>
              </div>

              {/* Reliability Score */}
              <div className="bg-rail-950 p-3 rounded-lg border border-rail-800">
                <span className="text-[10px] text-rail-400 font-mono block">RELIABILITY INDEX</span>
                <div className="flex items-baseline space-x-1 mt-0.5">
                  <span className={`text-xl font-mono font-black ${
                    currentStepData.reliability_score >= 70 ? 'text-signal-green' :
                    currentStepData.reliability_score >= 40 ? 'text-signal-amber' : 'text-signal-red'
                  }`}>
                    {currentStepData.reliability_score}
                  </span>
                  <span className="text-xs text-rail-500 font-mono">/100</span>
                </div>
              </div>
            </div>

            {/* Dynamic Event Narrative Banner */}
            <div className={`p-3 rounded-lg border text-xs leading-relaxed font-sans ${
              currentStepData.is_disruption_event
                ? 'bg-signal-red/10 border-signal-red/40 text-red-200'
                : currentStepData.is_recovery_event
                ? 'bg-signal-green/10 border-signal-green/40 text-emerald-200'
                : 'bg-rail-850 border-rail-750 text-rail-200'
            }`}>
              <div className="font-mono text-[10px] text-rail-400 uppercase font-semibold mb-0.5">
                Simulated Telemetry Stream Event Log:
              </div>
              {currentStepData.narrative_description}
            </div>
          </div>

          {/* Timeline Scrubber */}
          <div className="bg-rail-900 border border-rail-800 rounded-xl p-4 shadow-xl">
            <div className="flex items-center justify-between text-xs mb-2 font-mono">
              <span className="text-rail-400">
                Station Progression: <strong className="text-white">{session.current_step + 1}</strong> of {session.total_steps}
              </span>
              <span className="text-rail-400">
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
              className="w-full h-2 bg-rail-800 rounded-lg appearance-none cursor-pointer accent-signal-cyan"
            />

            {/* Playback Controls Toolbar */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleReset}
                  className="bg-rail-800 hover:bg-rail-750 text-rail-300 p-2 rounded-lg border border-rail-700 transition-colors"
                  title="Reset to origin"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleStep(-1)}
                  disabled={session.current_step === 0}
                  className="bg-rail-800 hover:bg-rail-750 disabled:opacity-40 text-rail-300 p-2 rounded-lg border border-rail-700 transition-colors"
                  title="Previous station"
                >
                  <SkipBack className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="bg-signal-cyan hover:bg-signal-cyan/90 text-rail-950 font-bold px-4 py-2 rounded-lg flex items-center space-x-1.5 shadow-lg shadow-signal-cyan/20 transition-all"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  <span className="font-mono text-xs">{isPlaying ? 'Pause' : 'Play Live Replay'}</span>
                </button>
                <button
                  onClick={() => handleStep(1)}
                  disabled={session.current_step >= session.total_steps - 1}
                  className="bg-rail-800 hover:bg-rail-750 disabled:opacity-40 text-rail-300 p-2 rounded-lg border border-rail-700 transition-colors"
                  title="Next station"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              {/* Speed Multipliers */}
              <div className="flex items-center space-x-1 bg-rail-950 p-1 rounded-lg border border-rail-800">
                <span className="text-[10px] text-rail-500 font-mono px-1">Speed:</span>
                {[1, 2, 5].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                      speed === s ? 'bg-rail-700 text-signal-cyan border border-rail-600' : 'text-rail-400 hover:text-rail-200'
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
          <div className="bg-rail-900 border border-rail-800 rounded-xl p-4 shadow-xl">
            <div className="flex items-center space-x-2 border-b border-rail-800 pb-3 mb-3">
              <Activity className="w-4 h-4 text-signal-cyan" />
              <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                Step Auditable Evidence
              </h3>
            </div>

            <div className="space-y-2">
              {currentStepData.evidence_summary.map((ev, idx) => (
                <div key={idx} className="bg-rail-850 border border-rail-750 p-2.5 rounded text-xs text-rail-200 flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-signal-cyan flex-shrink-0 mt-1.5" />
                  <span className="leading-snug">{ev}</span>
                </div>
              ))}
            </div>

            {/* Mathematical Guarantee Card */}
            <div className="mt-4 p-3 bg-rail-950 rounded-lg border border-rail-800 text-[11px] text-rail-400 font-mono space-y-1.5">
              <div className="font-bold text-rail-300 uppercase">Leakage-Free Protocol:</div>
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
