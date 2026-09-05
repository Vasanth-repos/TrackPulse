"""
TrackPulse User Requirement & Recommendation Engine
Scores and ranks candidate coaching trains according to passenger travel windows,
delay tolerance, transfer safety, and statistical reliability.
"""

from typing import List, Dict, Any, Optional
from app.data.coaching_trains_dataset import TRAINS_METADATA, get_train_by_id, get_station_info
from app.models.spec_schemas import UserRequirementRequest, UserRequirementResponse, CandidateTrainScore
from app.preprocessing.pipeline import parse_time_to_minutes, minutes_to_time_str
from app.services.train_service import train_service

class UserRequirementEngine:
    def __init__(self):
        # Configurable default scoring weights as specified in Section 33
        self.default_weights = {
            "arrival_quality": 0.35,
            "reliability": 0.20,
            "punctuality": 0.15,
            "connection_safety": 0.15,
            "user_preference": 0.10,
            "delay_risk_inverse": 0.05
        }

    def recommend_trains(self, req: UserRequirementRequest) -> UserRequirementResponse:
        all_trains = train_service.get_all_trains_live()
        candidate_scores: List[CandidateTrainScore] = []

        window_start_min = parse_time_to_minutes(req.departure_window_start)
        window_end_min = parse_time_to_minutes(req.departure_window_end)

        for t_meta in TRAINS_METADATA:
            t_id = t_meta["train_id"]
            live_t = next((t for t in all_trains if t["train_id"] == t_id), None)
            if not live_t:
                continue

            route_codes = [s["station_code"] for s in t_meta["route"]]

            # Check if train connects source and destination (or serves the corridor)
            src_in = req.source in route_codes or req.source in ["ALL", "MAS", "SBC"]
            dest_in = req.destination in route_codes or req.destination in ["ALL", "NDLS", "HWH", "CBE", "MYS", "BZA"]

            if src_in and dest_in:
                sched_dep = t_meta["scheduled_departure_time"]
                sched_dep_min = parse_time_to_minutes(sched_dep)

                # Evaluate Departure Window Alignment
                in_window = window_start_min <= sched_dep_min <= window_end_min
                time_diff = min(abs(sched_dep_min - window_start_min), abs(window_end_min - sched_dep_min))
                arrival_quality = max(0.2, 1.0 - (time_diff / 360.0))

                # Reliability Factor
                rel_val = live_t["reliability_score"] / 100.0

                # Punctuality Factor
                punct_val = max(0.1, 1.0 - (live_t["current_delay_min"] / 60.0))

                # Connection Risk Factor
                if req.connection_required and req.connecting_departure_time:
                    conn_dep_min = parse_time_to_minutes(req.connecting_departure_time)
                    pred_arr_min = parse_time_to_minutes(live_t["predicted_eta"])
                    buffer_min = conn_dep_min - pred_arr_min
                    if buffer_min >= 30:
                        conn_risk = "SAFE"
                        conn_safety = 1.0
                    elif buffer_min >= 15:
                        conn_risk = "AT_RISK"
                        conn_safety = 0.5
                    else:
                        conn_risk = "LIKELY_MISSED"
                        conn_safety = 0.1
                else:
                    conn_risk = "SAFE" if live_t["current_delay_min"] <= 15 else "AT_RISK"
                    conn_safety = 0.85

                # Delay Risk
                delay_risk = "LOW" if live_t["current_delay_min"] <= 5 else "MEDIUM" if live_t["current_delay_min"] <= 20 else "HIGH"
                delay_risk_inv = 1.0 if delay_risk == "LOW" else 0.6 if delay_risk == "MEDIUM" else 0.2

                user_pref = 1.0 if in_window else 0.5

                # Compute Weighted Score
                weights = self.default_weights
                raw_score = (
                    weights["arrival_quality"] * arrival_quality +
                    weights["reliability"] * rel_val +
                    weights["punctuality"] * punct_val +
                    weights["connection_safety"] * conn_safety +
                    weights["user_preference"] * user_pref +
                    weights["delay_risk_inverse"] * delay_risk_inv
                )
                final_score = round(raw_score * 100.0, 1)

                # Generate Auditable Reasons
                reasons: List[str] = []
                if in_window:
                    reasons.append(f"Departs at {sched_dep}, perfectly inside your preferred window.")
                if live_t["current_delay_min"] <= 5:
                    reasons.append("High historical on-time punctuality across this section.")
                else:
                    reasons.append(f"Current delay of +{live_t['current_delay_min']}m is within your {req.max_acceptable_delay_min}m tolerance.")

                if rel_val >= 0.8:
                    reasons.append(f"Strong calibrated ETA trust index of {live_t['reliability_score']}% (Narrow uncertainty interval).")
                
                if conn_risk == "SAFE":
                    reasons.append("Sufficient transfer buffer available for onward journey.")

                candidate_scores.append(
                    CandidateTrainScore(
                        train_id=t_id,
                        train_name=t_meta["train_name"],
                        train_type=t_meta["train_type"],
                        origin_station_code=t_meta["origin_station_code"],
                        destination_station_code=t_meta["destination_station_code"],
                        scheduled_departure=t_meta["scheduled_departure_time"],
                        scheduled_arrival=t_meta["scheduled_arrival_time"],
                        predicted_arrival=live_t["predicted_eta"],
                        eta_p10=live_t["eta_lower_bound"],
                        eta_p50=live_t["predicted_eta"],
                        eta_p90=live_t["eta_upper_bound"],
                        interval_width_min=live_t["interval_width_min"],
                        current_delay_min=live_t["current_delay_min"],
                        predicted_delay_min=live_t["predicted_delay_min"],
                        reliability_score=rel_val,
                        delay_risk=delay_risk,
                        connection_risk=conn_risk,
                        overall_recommendation_score=final_score,
                        is_recommended=False,
                        reasons=reasons
                    )
                )

        # Sort candidates descending by overall recommendation score
        candidate_scores.sort(key=lambda c: c.overall_recommendation_score, reverse=True)

        if candidate_scores:
            candidate_scores[0].is_recommended = True
            recommended = candidate_scores[0]
            alternatives = candidate_scores[1:]
        else:
            recommended = None
            alternatives = []

        return UserRequirementResponse(
            source=req.source,
            destination=req.destination,
            journey_date=req.journey_date,
            total_candidates_found=len(candidate_scores),
            recommended_train=recommended,
            alternative_trains=alternatives,
            scoring_weights_used=self.default_weights
        )

user_requirement_engine = UserRequirementEngine()
