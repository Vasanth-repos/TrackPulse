"""
Unit tests for Regime Detector and Quantile ETA Forecaster
"""

import pytest
from app.ml.regime_detector import regime_detector
from app.ml.forecaster import forecaster

def test_regime_classification():
    # Normal regime
    norm = regime_detector.classify_regime(
        current_delay_min=4,
        delay_trend_last_sec=1,
        delay_trend_3_sec=2,
        section_std_runtime=3.5
    )
    assert norm["regime"] == "NORMAL"
    assert norm["regime_code"] == 0

    # Delayed regime
    dly = regime_detector.classify_regime(
        current_delay_min=22,
        delay_trend_last_sec=3,
        delay_trend_3_sec=6,
        section_std_runtime=4.0
    )
    assert dly["regime"] == "DELAYED"
    assert dly["regime_code"] == 1

    # Disrupted regime
    dis = regime_detector.classify_regime(
        current_delay_min=55,
        delay_trend_last_sec=18,
        delay_trend_3_sec=30,
        section_std_runtime=8.0
    )
    assert dis["regime"] == "DISRUPTED"
    assert dis["regime_code"] == 2

def test_quantile_monotonicity_anti_crossing():
    """Ensure lower <= point <= upper under all conditions."""
    pred = forecaster.predict_single_step(
        current_delay_min=25,
        delay_trend_1_sec=5,
        delay_trend_3_sec=10,
        section_median_runtime=45.0,
        section_std_runtime=5.0,
        section_rec_p50=3.0,
        distance_remaining_km=800.0,
        stations_remaining=12,
        hour_of_day=14,
        day_of_week=3,
        regime_code=1,
        data_quality_score=98,
        scheduled_arrival_str="18:30"
    )

    assert pred["delay_lower_bound_min"] <= pred["predicted_delay_min"]
    assert pred["predicted_delay_min"] <= pred["delay_upper_bound_min"]
    assert pred["interval_width_min"] >= 0
    assert "baseline_1_eta" in pred
    assert "baseline_2_eta" in pred
