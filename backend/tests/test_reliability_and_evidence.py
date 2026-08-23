"""
Unit tests for Reliability Engine and Evidence Generator
"""

import pytest
from app.reliability.engine import reliability_engine
from app.evidence.generator import evidence_generator

def test_reliability_scoring_bounds():
    # Optimal conditions
    rel_high = reliability_engine.compute_reliability(
        interval_width_min=6,
        distance_remaining_km=400.0,
        recent_errors=[0.5, 1.0],
        regime="NORMAL",
        data_freshness_sec=5,
        data_quality_score=100,
        section_std_runtime=3.0
    )
    assert 0 <= rel_high["overall_score"] <= 100
    assert rel_high["category"] == "HIGH"
    assert len(rel_high["factors"]) == 5

    # Disrupted conditions
    rel_low = reliability_engine.compute_reliability(
        interval_width_min=45,
        distance_remaining_km=200.0,
        recent_errors=[12.0, 18.0],
        regime="DISRUPTED",
        data_freshness_sec=180,
        data_quality_score=65,
        section_std_runtime=14.0
    )
    assert 0 <= rel_low["overall_score"] <= 100
    assert rel_low["category"] == "LOW"

def test_evidence_generation():
    ev = evidence_generator.generate_evidence(
        current_delay_min=48,
        prev_delay_min=30,
        delay_trend_1_sec=18,
        delay_trend_3_sec=32,
        section_actual_runtime=75.0,
        section_median_runtime=50.0,
        section_rec_p50=1.0,
        regime="DISRUPTED",
        data_freshness_sec=10,
        data_quality_score=95
    )
    assert len(ev) > 0
    categories = [item["category"] for item in ev]
    assert "SECTION_RUNTIME" in categories
    assert "DELAY_TREND" in categories
    assert "REGIME_SHIFT" in categories
