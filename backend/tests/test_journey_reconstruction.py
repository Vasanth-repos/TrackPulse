"""
Unit tests for Journey Reconstruction and Section Preprocessing
"""

import pytest
from app.preprocessing.pipeline import (
    parse_time_to_minutes,
    minutes_to_time_str,
    calculate_time_diff_minutes,
    reconstructor
)

def test_time_parsing_and_conversion():
    assert parse_time_to_minutes("00:00") == 0
    assert parse_time_to_minutes("19:20") == 1160
    assert parse_time_to_minutes("23:59") == 1439
    
    assert minutes_to_time_str(1160) == "19:20"
    assert minutes_to_time_str(0) == "00:00"
    assert minutes_to_time_str(1440) == "00:00"  # Midnight rollover

def test_time_difference_with_midnight_rollover():
    # Same day: 19:20 to 22:50
    diff = calculate_time_diff_minutes("19:20", "22:50")
    assert diff == 210  # 3h 30m

    # Midnight rollover: 23:30 to 01:00
    diff_rollover = calculate_time_diff_minutes("23:30", "01:00")
    assert diff_rollover == 90  # 1h 30m

def test_section_statistics_generation():
    stats = reconstructor.get_section_stat("SBC", "BNC")
    assert "median_runtime_min" in stats
    assert "std_runtime_min" in stats
    assert stats["median_runtime_min"] > 0
    assert stats["std_runtime_min"] > 0

def test_synthetic_dataset_generation():
    df = reconstructor.generate_synthetic_historical_dataset(num_journeys_per_train=5)
    assert len(df) > 0
    assert "journey_id" in df.columns
    assert "actual_delay_min" in df.columns
    assert "regime" in df.columns
    assert set(df["regime"].unique()).issubset({"NORMAL", "DELAYED", "DISRUPTED"})
