"""
Historical Replay Engine
Simulates real-time station-by-station streaming with zero data leakage.
Drives the signature Normal -> Disruption -> Recovery hackathon demonstration narrative.
"""

from typing import Dict, Any, List, Optional
import copy
import numpy as np
from app.data.coaching_trains_dataset import TRAINS_METADATA, get_train_by_id, get_station_info
from app.preprocessing.pipeline import reconstructor, parse_time_to_minutes, minutes_to_time_str
from app.ml.forecaster import forecaster
from app.ml.regime_detector import regime_detector
from app.reliability.engine import reliability_engine
from app.evidence.generator import evidence_generator

class ReplayEngine:
    def __init__(self):
        self.cached_sessions: Dict[str, Dict[str, Any]] = {}
        self.active_session_states: Dict[str, int] = {}  # session_id -> current_step_index
        self._build_curated_replay_scenarios()

    def _build_curated_replay_scenarios(self):
        """Precomputes curated scenarios for primary coaching train 12627 (Karnataka Express) and 12951."""
        train = get_train_by_id("12627")
        route = train["route"]
        total_dist = train["total_distance_km"]

        # -------------------------------------------------------------
        # Scenario 1: Signature Hackathon Narrative (Normal -> Disrupted -> Recovery)
        # -------------------------------------------------------------
        steps_narrative: List[Dict[str, Any]] = []
        recent_errors: List[float] = []
        prev_delay = 0

        # Handcrafted realistic delay trajectory for 12627:
        # Stations 1-10: Normal run (0 to 6 min delay)
        # Stations 11-18: Severe freight congestion & section halt (delay surges 6 -> 24 -> 52 min)
        # Stations 19-27: Speed recovery on central trunk (delay recovers 52 -> 38 -> 22 min)
        # Stations 28-34: Stable arrival into New Delhi (delay ~20 min)
        target_delays = [
            0, 2, 3, 4, 3, 5, 6, 5, 7, 6,       # Stns 1-10 (SBC to YG): NORMAL
            18, 28, 42, 54, 58, 62, 55, 48,    # Stns 11-18 (WADI to KPG): DISRUPTED
            42, 36, 30, 26, 24, 22, 21, 20,    # Stns 19-26 (MMR to BPL): RECOVERY
            20, 19, 18, 18, 17, 17, 16, 16     # Stns 27-34 (BINA to NDLS): NORMAL/DELAYED
        ]

        for step_idx, stn in enumerate(route):
            stn_code = stn["station_code"]
            stn_name = get_station_info(stn_code)["station_name"]
            seq = stn["sequence"]
            dist_from_origin = stn["dist"]
            dist_rem = total_dist - dist_from_origin
            stns_rem = len(route) - 1 - step_idx
            
            actual_delay = target_delays[step_idx] if step_idx < len(target_delays) else 16
            trend_1 = actual_delay - prev_delay if step_idx > 0 else 0
            trend_3 = actual_delay - (target_delays[step_idx-3] if step_idx >= 3 else target_delays[0])

            # Section stats
            prev_code = route[step_idx-1]["station_code"] if step_idx > 0 else stn_code
            sec_stats = reconstructor.get_section_stat(prev_code, stn_code)
            actual_sec_runtime = sec_stats["median_runtime_min"] + trend_1

            # Regime
            reg_info = regime_detector.classify_regime(
                current_delay_min=actual_delay,
                delay_trend_last_sec=trend_1,
                delay_trend_3_sec=trend_3,
                section_std_runtime=sec_stats["std_runtime_min"],
                is_abnormal_section=(actual_delay > 40 and trend_1 >= 10)
            )
            regime = reg_info["regime"]
            regime_code = reg_info["regime_code"]

            # Forecast destination (NDLS)
            dest_stn = route[-1]
            pred = forecaster.predict_single_step(
                current_delay_min=actual_delay,
                delay_trend_1_sec=trend_1,
                delay_trend_3_sec=trend_3,
                section_median_runtime=sec_stats["median_runtime_min"],
                section_std_runtime=sec_stats["std_runtime_min"],
                section_rec_p50=sec_stats["typical_recovery_p50"],
                distance_remaining_km=dist_rem,
                stations_remaining=stns_rem,
                hour_of_day=(parse_time_to_minutes(stn["arr"]) // 60) % 24,
                day_of_week=5,
                regime_code=regime_code,
                data_quality_score=98 if regime != "DISRUPTED" else 85,
                scheduled_arrival_str=dest_stn["arr"]
            )

            # Error feedback
            if step_idx > 0:
                sim_err = abs(actual_delay - (prev_delay + int(np.random.choice([0, 1]))))
                recent_errors.append(float(sim_err))
                if len(recent_errors) > 5:
                    recent_errors.pop(0)

            # Reliability
            rel = reliability_engine.compute_reliability(
                interval_width_min=pred["interval_width_min"],
                distance_remaining_km=dist_rem,
                recent_errors=recent_errors,
                regime=regime,
                data_freshness_sec=12 if regime != "DISRUPTED" else 45,
                data_quality_score=98 if regime != "DISRUPTED" else 85,
                section_std_runtime=sec_stats["std_runtime_min"]
            )

            # Evidence
            ev_list = evidence_generator.generate_evidence(
                current_delay_min=actual_delay,
                prev_delay_min=prev_delay,
                delay_trend_1_sec=trend_1,
                delay_trend_3_sec=trend_3,
                section_actual_runtime=actual_sec_runtime,
                section_median_runtime=sec_stats["median_runtime_min"],
                section_rec_p50=sec_stats["typical_recovery_p50"],
                regime=regime,
                data_freshness_sec=12 if regime != "DISRUPTED" else 45,
                data_quality_score=98 if regime != "DISRUPTED" else 85
            )
            ev_summary = [e["title"] + ": " + e["metric_value"] for e in ev_list]

            is_disruption = (step_idx in [11, 12, 13, 14])
            is_recovery = (step_idx in [19, 20, 21, 22])

            if step_idx < 10:
                narrative = f"Train running nominally through {stn_name}. Forecast ETA remains stable within narrow uncertainty envelope."
            elif is_disruption:
                narrative = f"CRITICAL DISRUPTION: Unforeseen delay surge detected at {stn_name} (+{trend_1} min). Operating regime switched to DISRUPTED. Uncertainty window widens and reliability score drops."
            elif is_recovery:
                narrative = f"ACTIVE RECOVERY: Driver make-up time observed past {stn_name} (-{abs(trend_1)} min). Expected arrival interval narrows; reliability score rebounds."
            else:
                narrative = f"Approaching destination corridor via {stn_name}. Calibrated ETA settled with high confidence."

            steps_narrative.append({
                "step_index": step_idx,
                "timestamp_simulated": stn["arr"],
                "current_station_code": stn_code,
                "current_station_name": stn_name,
                "current_station_seq": seq,
                "actual_delay_min": actual_delay,
                "predicted_eta": pred["predicted_eta"],
                "predicted_delay_min": pred["predicted_delay_min"],
                "interval_lower": pred["eta_lower_bound"],
                "interval_upper": pred["eta_upper_bound"],
                "interval_width_min": pred["interval_width_min"],
                "reliability_score": rel["overall_score"],
                "regime": regime,
                "evidence_summary": ev_summary,
                "is_disruption_event": is_disruption,
                "is_recovery_event": is_recovery,
                "narrative_description": narrative,
                "distance_remaining_km": dist_rem,
                "scheduled_arrival": dest_stn["arr"]
            })

            prev_delay = actual_delay

        session_id_1 = "12627_signature_demo"
        self.cached_sessions[session_id_1] = {
            "session_id": session_id_1,
            "train_id": "12627",
            "train_name": "Karnataka Express",
            "scenario_id": "sig_demo",
            "scenario_name": "Signature 90s Demo: Normal -> Disruption -> Recovery",
            "scenario_type": "DISRUPTED_AND_CASCADE",
            "total_steps": len(steps_narrative),
            "current_step": 0,
            "steps": steps_narrative,
            "is_complete": False
        }
        self.active_session_states[session_id_1] = 0

    def get_session(self, session_id: str = "12627_signature_demo") -> Dict[str, Any]:
        if session_id not in self.cached_sessions:
            session_id = "12627_signature_demo"
        sess = copy.deepcopy(self.cached_sessions[session_id])
        current_step = self.active_session_states.get(session_id, 0)
        sess["current_step"] = current_step
        sess["is_complete"] = (current_step >= sess["total_steps"] - 1)
        return sess

    def step_session(self, session_id: str, delta: int = 1) -> Dict[str, Any]:
        if session_id not in self.cached_sessions:
            session_id = "12627_signature_demo"
        curr = self.active_session_states.get(session_id, 0)
        total = self.cached_sessions[session_id]["total_steps"]
        new_step = max(0, min(total - 1, curr + delta))
        self.active_session_states[session_id] = new_step
        return self.get_session(session_id)

    def jump_to_step(self, session_id: str, step_index: int) -> Dict[str, Any]:
        if session_id not in self.cached_sessions:
            session_id = "12627_signature_demo"
        total = self.cached_sessions[session_id]["total_steps"]
        self.active_session_states[session_id] = max(0, min(total - 1, step_index))
        return self.get_session(session_id)

    def reset_session(self, session_id: str) -> Dict[str, Any]:
        if session_id not in self.cached_sessions:
            session_id = "12627_signature_demo"
        self.active_session_states[session_id] = 0
        return self.get_session(session_id)

replay_engine = ReplayEngine()
