"""
Section-Aware Quantile ETA Forecaster & Baseline Models
Uses Gradient Boosting with Quantile Loss (10th, 50th, 90th percentiles)
with Monotonic Post-Processing to guarantee anti-quantile crossing.
"""

from typing import Dict, Any, Tuple, List
import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor
from app.preprocessing.pipeline import reconstructor, parse_time_to_minutes, minutes_to_time_str
from app.ml.regime_detector import regime_detector

FEATURE_COLUMNS = [
    "current_delay_min",
    "delay_trend_1_sec",
    "delay_trend_3_sec",
    "section_median_runtime",
    "section_std_runtime",
    "section_rec_p50",
    "distance_remaining_km",
    "stations_remaining",
    "hour_of_day",
    "day_of_week",
    "regime_code",
    "data_quality_score"
]

class EtaForecaster:
    def __init__(self):
        self.model_p10 = None
        self.model_p50 = None
        self.model_p90 = None
        self.is_trained = False
        self._train_models()

    def _train_models(self):
        """Trains quantile gradient boosted models on historical reconstructed journeys."""
        df = reconstructor.generate_synthetic_historical_dataset(num_journeys_per_train=45)
        
        # Prepare feature matrix and target: target is arrival delay at subsequent stations
        # Target variable: actual arrival delay (minutes)
        regime_map = {"NORMAL": 0, "DELAYED": 1, "DISRUPTED": 2}
        df["regime_code"] = df["regime"].map(regime_map).fillna(0)
        df["current_delay_min"] = df["actual_delay_min"]

        X = df[FEATURE_COLUMNS].copy()
        y = df["actual_delay_min"].values

        # Train Quantile Gradient Boosting Regressors
        self.model_p10 = GradientBoostingRegressor(loss="quantile", alpha=0.10, n_estimators=60, max_depth=3, random_state=42)
        self.model_p50 = GradientBoostingRegressor(loss="quantile", alpha=0.50, n_estimators=60, max_depth=3, random_state=42)
        self.model_p90 = GradientBoostingRegressor(loss="quantile", alpha=0.90, n_estimators=60, max_depth=3, random_state=42)

        self.model_p10.fit(X, y)
        self.model_p50.fit(X, y)
        self.model_p90.fit(X, y)
        self.is_trained = True

    def predict_single_step(
        self,
        current_delay_min: int,
        delay_trend_1_sec: int,
        delay_trend_3_sec: int,
        section_median_runtime: float,
        section_std_runtime: float,
        section_rec_p50: float,
        distance_remaining_km: float,
        stations_remaining: int,
        hour_of_day: int,
        day_of_week: int,
        regime_code: int,
        data_quality_score: int,
        scheduled_arrival_str: str
    ) -> Dict[str, Any]:
        """
        Predicts point ETA and prediction interval [lower, upper] for an upcoming station.
        Ensures strict anti-crossing: lower <= point <= upper.
        """
        feats = pd.DataFrame([[
            current_delay_min,
            delay_trend_1_sec,
            delay_trend_3_sec,
            section_median_runtime,
            section_std_runtime,
            section_rec_p50,
            distance_remaining_km,
            stations_remaining,
            hour_of_day,
            day_of_week,
            regime_code,
            data_quality_score
        ]], columns=FEATURE_COLUMNS)

        pred_p10 = float(self.model_p10.predict(feats)[0])
        pred_p50 = float(self.model_p50.predict(feats)[0])
        pred_p90 = float(self.model_p90.predict(feats)[0])

        # Strictly enforce quantile monotonicity (Anti-Quantile Crossing)
        sorted_bounds = sorted([pred_p10, pred_p50, pred_p90])
        pred_lower_delay = max(0, int(round(sorted_bounds[0])))
        pred_point_delay = max(0, int(round(sorted_bounds[1])))
        pred_upper_delay = max(pred_point_delay, int(round(sorted_bounds[2])))

        # Add distance/regime uncertainty expansion if disrupted or long horizon
        if regime_code == 2:  # DISRUPTED
            pred_upper_delay = max(pred_upper_delay, pred_point_delay + int(max(10, distance_remaining_km * 0.018)))
            pred_lower_delay = max(0, pred_point_delay - int(max(4, distance_remaining_km * 0.008)))
        elif regime_code == 1:  # DELAYED
            pred_upper_delay = max(pred_upper_delay, pred_point_delay + int(max(5, distance_remaining_km * 0.01)))
            pred_lower_delay = max(0, pred_point_delay - int(max(2, distance_remaining_km * 0.005)))
        else:  # NORMAL
            pred_upper_delay = max(pred_upper_delay, pred_point_delay + int(max(3, distance_remaining_km * 0.005)))
            pred_lower_delay = max(0, pred_point_delay - int(max(2, distance_remaining_km * 0.003)))

        sched_min = parse_time_to_minutes(scheduled_arrival_str)
        point_eta_min = sched_min + pred_point_delay
        lower_eta_min = sched_min + pred_lower_delay
        upper_eta_min = sched_min + pred_upper_delay
        interval_width = upper_eta_min - lower_eta_min

        # Baseline 1: Scheduled ETA only
        baseline_1_eta = scheduled_arrival_str
        baseline_1_delay = 0

        # Baseline 2: Schedule + Current Delay - Standard Static Margin (5%)
        baseline_2_delay = max(0, int(current_delay_min * 0.95))
        baseline_2_eta = minutes_to_time_str(sched_min + baseline_2_delay)

        return {
            "predicted_eta": minutes_to_time_str(point_eta_min),
            "predicted_delay_min": pred_point_delay,
            "eta_lower_bound": minutes_to_time_str(lower_eta_min),
            "eta_upper_bound": minutes_to_time_str(upper_eta_min),
            "delay_lower_bound_min": pred_lower_delay,
            "delay_upper_bound_min": pred_upper_delay,
            "interval_width_min": interval_width,
            "baseline_1_eta": baseline_1_eta,
            "baseline_1_delay_min": baseline_1_delay,
            "baseline_2_eta": baseline_2_eta,
            "baseline_2_delay_min": baseline_2_delay
        }

forecaster = EtaForecaster()
