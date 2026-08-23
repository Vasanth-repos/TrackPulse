"""
Preprocessing & Journey Reconstruction Pipeline
Calculates dwell times, section running times, cumulative distances,
and builds section statistics tables.
"""

from typing import List, Dict, Any, Tuple
import datetime
import numpy as np
import pandas as pd
from app.data.coaching_trains_dataset import TRAINS_METADATA, STATIONS_MASTER, get_station_info

def parse_time_to_minutes(time_str: str) -> int:
    """Parses 'HH:MM' into minutes from 00:00 (0 to 1439)."""
    parts = time_str.strip().split(":")
    return int(parts[0]) * 60 + int(parts[1])

def minutes_to_time_str(minutes: int) -> str:
    """Converts minutes (can be > 1440 for multi-day) into 'HH:MM'."""
    normalized = int(minutes) % 1440
    if normalized < 0:
        normalized += 1440
    hours = normalized // 60
    mins = normalized % 60
    return f"{hours:02d}:{mins:02d}"

def calculate_time_diff_minutes(dep_str: str, arr_str: str) -> int:
    """Calculates difference in minutes between two HH:MM strings handling midnight rollover."""
    dep_m = parse_time_to_minutes(dep_str)
    arr_m = parse_time_to_minutes(arr_str)
    diff = arr_m - dep_m
    if diff < 0:
        diff += 1440  # rolled over midnight
    return diff

class JourneyReconstructor:
    def __init__(self):
        self.section_stats: Dict[Tuple[str, str], Dict[str, float]] = {}
        self._build_historical_section_stats()

    def _build_historical_section_stats(self):
        """Precomputes baseline section statistics across all train routes."""
        for train in TRAINS_METADATA:
            route = train["route"]
            for i in range(len(route) - 1):
                s1 = route[i]
                s2 = route[i+1]
                pair = (s1["station_code"], s2["station_code"])
                
                sched_runtime = calculate_time_diff_minutes(s1["dep"], s2["arr"])
                dist = s2["dist"] - s1["dist"]
                
                # Statistical section properties
                median_rt = float(sched_runtime)
                std_rt = max(3.0, round(sched_runtime * 0.12, 1))
                rec_p50 = max(0.0, round(sched_runtime * 0.08, 1))
                
                self.section_stats[pair] = {
                    "median_runtime_min": median_rt,
                    "mean_runtime_min": median_rt + 1.2,
                    "std_runtime_min": std_rt,
                    "p10_runtime_min": max(1.0, median_rt - 1.28 * std_rt),
                    "p90_runtime_min": median_rt + 1.28 * std_rt,
                    "typical_recovery_p50": rec_p50,
                    "distance_km": dist,
                    "sample_count": 142
                }

    def get_section_stat(self, from_code: str, to_code: str) -> Dict[str, float]:
        pair = (from_code, to_code)
        if pair in self.section_stats:
            return self.section_stats[pair]
        return {
            "median_runtime_min": 45.0,
            "mean_runtime_min": 47.0,
            "std_runtime_min": 8.0,
            "p10_runtime_min": 35.0,
            "p90_runtime_min": 58.0,
            "typical_recovery_p50": 3.0,
            "distance_km": 50.0,
            "sample_count": 50
        }

    def generate_synthetic_historical_dataset(self, num_journeys_per_train: int = 40) -> pd.DataFrame:
        """
        Generates realistic historical journey records for training & baseline benchmarking.
        Labels and distributions match Indian coaching train characteristics.
        """
        records = []
        base_date = datetime.date(2025, 1, 1)
        np.random.seed(42)

        for train in TRAINS_METADATA:
            train_id = train["train_id"]
            train_name = train["train_name"]
            train_type = train["train_type"]
            route = train["route"]
            total_dist = train["total_distance_km"]

            for j_idx in range(num_journeys_per_train):
                journey_date = (base_date + datetime.timedelta(days=j_idx)).isoformat()
                
                # Determine journey profile
                # 65% Normal, 25% Delayed, 10% Disrupted with cascade/recovery
                rand_val = np.random.rand()
                if rand_val < 0.65:
                    scenario_type = "NORMAL"
                    init_delay = max(0, int(np.random.normal(3, 4)))
                    delay_drift_scale = 1.5
                elif rand_val < 0.90:
                    scenario_type = "DELAYED"
                    init_delay = int(np.random.normal(20, 8))
                    delay_drift_scale = 3.5
                else:
                    scenario_type = "DISRUPTED"
                    init_delay = int(np.random.normal(45, 15))
                    delay_drift_scale = 7.0

                current_delay = init_delay
                prev_delays = [current_delay]

                for i, stn in enumerate(route):
                    stn_code = stn["station_code"]
                    seq = stn["sequence"]
                    dist = stn["dist"]
                    dist_rem = total_dist - dist
                    stns_rem = len(route) - 1 - i

                    sched_arr_m = parse_time_to_minutes(stn["arr"])
                    sched_dep_m = parse_time_to_minutes(stn["dep"])

                    # Simulate section running delay evolution
                    if i > 0:
                        prev_stn = route[i - 1]
                        pair = (prev_stn["station_code"], stn_code)
                        stats = self.get_section_stat(prev_stn["station_code"], stn_code)
                        
                        # Section noise
                        sec_noise = np.random.normal(0, delay_drift_scale)
                        # Chance of recovery if delayed
                        recovery = 0.0
                        if current_delay > 15:
                            recovery = np.random.uniform(0, stats["typical_recovery_p50"])
                        
                        current_delay = max(0, int(current_delay + sec_noise - recovery))
                        prev_delays.append(current_delay)

                    actual_arr_m = sched_arr_m + current_delay
                    dwell = calculate_time_diff_minutes(stn["arr"], stn["dep"])
                    actual_dep_m = actual_arr_m + max(1, dwell + int(np.random.choice([0, 1, 2])))

                    trend_1 = 0 if len(prev_delays) < 2 else prev_delays[-1] - prev_delays[-2]
                    trend_3 = 0 if len(prev_delays) < 4 else prev_delays[-1] - prev_delays[-4]

                    sec_stats = self.get_section_stat(
                        route[i-1]["station_code"] if i > 0 else stn_code,
                        stn_code
                    )

                    # Determine station operating regime
                    if current_delay <= 15 and abs(trend_1) <= 5:
                        regime = "NORMAL"
                    elif current_delay <= 40 or abs(trend_1) <= 12:
                        regime = "DELAYED"
                    else:
                        regime = "DISRUPTED"

                    records.append({
                        "train_id": train_id,
                        "train_name": train_name,
                        "train_type": train_type,
                        "journey_id": f"{train_id}_{journey_date}",
                        "journey_date": journey_date,
                        "scenario_type": scenario_type,
                        "station_code": stn_code,
                        "station_sequence": seq,
                        "distance_from_origin": dist,
                        "distance_remaining_km": dist_rem,
                        "stations_remaining": stns_rem,
                        "scheduled_arrival_str": stn["arr"],
                        "scheduled_departure_str": stn["dep"],
                        "scheduled_arrival_min": sched_arr_m,
                        "actual_arrival_min": actual_arr_m,
                        "actual_arrival_str": minutes_to_time_str(actual_arr_m),
                        "actual_delay_min": current_delay,
                        "delay_trend_1_sec": trend_1,
                        "delay_trend_3_sec": trend_3,
                        "section_median_runtime": sec_stats["median_runtime_min"],
                        "section_std_runtime": sec_stats["std_runtime_min"],
                        "section_rec_p50": sec_stats["typical_recovery_p50"],
                        "regime": regime,
                        "hour_of_day": (sched_arr_m // 60) % 24,
                        "day_of_week": j_idx % 7,
                        "data_quality_score": 98 if scenario_type != "DISRUPTED" else 88
                    })

        return pd.DataFrame(records)

reconstructor = JourneyReconstructor()
