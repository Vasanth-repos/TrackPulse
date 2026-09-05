"""
TrackPulse What-If Simulation Engine
Allows railway controllers and researchers to inject simulated disruption scenarios
(e.g., freight blocking, signal failure, fog, section halt) and evaluate cascading delay propagation.
"""

from typing import List, Dict, Any
from app.models.spec_schemas import WhatIfSimulateRequest, WhatIfSimulateResponse, SimulatedTrainImpact
from app.data.coaching_trains_dataset import TRAINS_METADATA, get_train_by_id
from app.services.train_service import train_service
from app.preprocessing.pipeline import parse_time_to_minutes, minutes_to_time_str

class WhatIfSimulationEngine:
    def __init__(self):
        pass

    def run_simulation(self, req: WhatIfSimulateRequest) -> WhatIfSimulateResponse:
        all_trains = train_service.get_all_trains_live()
        primary_live = next((t for t in all_trains if t["train_id"] == req.train_id), all_trains[0])
        primary_meta = get_train_by_id(req.train_id)

        injected_delay = req.delay_injection_minutes
        affected_list: List[SimulatedTrainImpact] = []

        # 1. Primary Direct Target Impact
        base_delay = primary_live["current_delay_min"]
        new_primary_delay = base_delay + injected_delay
        base_arr_min = parse_time_to_minutes(primary_live["predicted_eta"])
        sim_arr_min = base_arr_min + injected_delay
        new_primary_eta = minutes_to_time_str(sim_arr_min)

        base_rel = primary_live["reliability_score"]
        sim_rel = max(25, base_rel - int(injected_delay * 0.75))

        affected_list.append(
            SimulatedTrainImpact(
                train_id=req.train_id,
                train_name=primary_meta["train_name"],
                dependency_relation="DIRECT_TARGET",
                baseline_delay_min=base_delay,
                simulated_delay_min=new_primary_delay,
                delay_delta_min=injected_delay,
                baseline_eta=primary_live["predicted_eta"],
                simulated_eta=new_primary_eta,
                baseline_reliability=base_rel,
                simulated_reliability=sim_rel,
                simulated_risk="HIGH" if new_primary_delay > 25 else "MEDIUM",
                cascade_reason=f"Injected {injected_delay}m delay at {req.injection_station_code} due to {req.delay_cause_category.replace('_', ' ').title()}."
            )
        )

        # 2. Outgoing Dependent Rakes (e.g., 12628 dependent on 12627, or 12640 dependent on 12840)
        dependent_pairs = {
            "12627": {"dep_id": "12628", "name": "Karnataka Express", "sched_dep": "20:20", "min_turn": 60, "orig_delay": 4},
            "12840": {"dep_id": "12640", "name": "Brindavan Express", "sched_dep": "15:00", "min_turn": 45, "orig_delay": 1},
            "12622": {"dep_id": "12007", "name": "Shatabdi Express", "sched_dep": "06:00", "min_turn": 30, "orig_delay": 0},
        }

        dep_info = dependent_pairs.get(req.train_id)
        if dep_info:
            out_sched_min = parse_time_to_minutes(dep_info["sched_dep"])
            avail_turn = max(0, out_sched_min - sim_arr_min)
            req_turn = dep_info["min_turn"]

            if avail_turn < req_turn:
                prop_delay = req_turn - avail_turn
                out_base_delay = dep_info["orig_delay"]
                out_sim_delay = out_base_delay + prop_delay
                out_sim_eta = minutes_to_time_str(parse_time_to_minutes(dep_info["sched_dep"]) + out_sim_delay)

                affected_list.append(
                    SimulatedTrainImpact(
                        train_id=dep_info["dep_id"],
                        train_name=dep_info["name"],
                        dependency_relation="OUTGOING_RAKE_DEPENDENT",
                        baseline_delay_min=out_base_delay,
                        simulated_delay_min=out_sim_delay,
                        delay_delta_min=prop_delay,
                        baseline_eta=dep_info["sched_dep"],
                        simulated_eta=out_sim_eta,
                        baseline_reliability=88,
                        simulated_reliability=max(35, 88 - int(prop_delay * 1.2)),
                        simulated_risk="HIGH" if prop_delay > 15 else "MEDIUM",
                        cascade_reason=f"Turnaround shortfall of {prop_delay} min at terminus platform. Rake cleaning & safety check delayed."
                    )
                )

        # 3. Downstream Connecting Passenger Service (e.g., Coromandel / Howrah Mail connecting at Vijayawada)
        conn_train = next((t for t in all_trains if t["train_id"] == "12840"), None)
        if conn_train and req.train_id != "12840":
            affected_list.append(
                SimulatedTrainImpact(
                    train_id="12840",
                    train_name="Chennai - Howrah Mail",
                    dependency_relation="DOWNSTREAM_CONNECTING",
                    baseline_delay_min=conn_train["current_delay_min"],
                    simulated_delay_min=conn_train["current_delay_min"] + 10,
                    delay_delta_min=10,
                    baseline_eta=conn_train["predicted_eta"],
                    simulated_eta=minutes_to_time_str(parse_time_to_minutes(conn_train["predicted_eta"]) + 10),
                    baseline_reliability=conn_train["reliability_score"],
                    simulated_reliability=max(40, conn_train["reliability_score"] - 12),
                    simulated_risk="MEDIUM",
                    cascade_reason="Station master holding connection 10 min for transfer passengers from Train 12627."
                )
            )

        # Calculate network stability metric
        stability = max(30.0, 100.0 - (injected_delay * 1.4) - (len(affected_list) * 5.0))

        conn_impact = (
            f"Severe transfer disruption: {len(affected_list) - 1} outgoing and connecting services impacted. "
            f"Passenger connection buffer at junction reduced below 10 minutes."
            if injected_delay >= 20 else
            "Moderate transfer impact: Outgoing departures absorb delay within scheduled buffer."
        )

        bottleneck = (
            f"Platform 5 & 7 throat interlocking conflict at terminus station. Section controller dispatch action recommended."
            if injected_delay >= 25 else None
        )

        return WhatIfSimulateResponse(
            primary_train_id=req.train_id,
            injected_delay_minutes=injected_delay,
            injection_station_code=req.injection_station_code,
            simulation_timestamp="14:38:20 (Simulated State)",
            affected_trains=affected_list,
            passenger_connection_impact=conn_impact,
            platform_bottleneck_warning=bottleneck,
            network_stability_index=round(stability, 1)
        )

what_if_engine = WhatIfSimulationEngine()
