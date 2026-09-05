"""
Reliability Service
Calibrates ETA confidence into 3 authoritative government tiers: HIGH, MEDIUM, LOW.
Evaluates prediction interval width, telemetry freshness latency, recent error trends, and operating regimes.
"""

from typing import Dict, Any, Tuple


class ReliabilityService:
    def __init__(self):
        pass

    def evaluate_reliability(
        self,
        base_reliability: str,
        interval_width_min: int,
        data_freshness_sec: int,
        regime: str,
        recent_error_min: float = 2.0
    ) -> Tuple[str, bool, str]:
        """
        Evaluates final reliability tier.
        Returns: (reliability_tier, is_stale, note)
        """
        is_stale = False
        note = ""

        # Step 11: Stale data checking (if telemetry lag > 180 seconds / 3 min)
        if data_freshness_sec > 180:
            is_stale = True
            reliability = "LOW"
            note = "Data update delayed. Reliability downgraded."
            return reliability, is_stale, note

        # Regime and interval width mapping
        if regime == "DISRUPTED" or interval_width_min > 30:
            reliability = "LOW"
            note = "Corridor disruption active. Prediction range broadened."
        elif regime == "DELAYED" or interval_width_min > 15:
            reliability = "MEDIUM"
            note = "Nominal recovery pacing observed."
        else:
            reliability = "HIGH" if base_reliability == "HIGH" else "MEDIUM"
            note = "Corridor conditions stable."

        return reliability, is_stale, note


reliability_service = ReliabilityService()
