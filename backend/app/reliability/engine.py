"""
Reliability Engine
Calculates calibrated 0–100 reliability score using 5 auditable factors:
1. Uncertainty envelope width
2. Recent sequential prediction error trend
3. Operating regime stability
4. Data freshness & packet quality
5. Route section historical variability
"""

from typing import Dict, Any, List
from app.config import settings

class ReliabilityEngine:
    def __init__(self):
        pass

    def compute_reliability(
        self,
        interval_width_min: int,
        distance_remaining_km: float,
        recent_errors: List[float],
        regime: str,
        data_freshness_sec: int,
        data_quality_score: int,
        section_std_runtime: float
    ) -> Dict[str, Any]:
        """
        Computes composite reliability score (0–100) and returns factor decomposition.
        """
        # 1. Uncertainty Score (0-100)
        # Wider intervals lower the score, scaled by distance remaining
        expected_normal_width = max(5.0, distance_remaining_km * 0.015)
        width_ratio = interval_width_min / expected_normal_width
        if width_ratio <= 1.0:
            s_uncertainty = 100.0 - (width_ratio * 15.0)
        elif width_ratio <= 2.5:
            s_uncertainty = 85.0 - ((width_ratio - 1.0) * 30.0)
        else:
            s_uncertainty = max(10.0, 40.0 - ((width_ratio - 2.5) * 15.0))
        s_uncertainty = float(min(100.0, max(0.0, s_uncertainty)))

        # 2. Recent Error Trend Score (0-100)
        if not recent_errors:
            s_error = 90.0  # Default initial baseline
        else:
            avg_err = float(sum(recent_errors) / len(recent_errors))
            if avg_err <= 3.0:
                s_error = 100.0 - (avg_err * 5.0)
            elif avg_err <= 10.0:
                s_error = 85.0 - ((avg_err - 3.0) * 6.0)
            else:
                s_error = max(10.0, 43.0 - ((avg_err - 10.0) * 2.5))
        s_error = float(min(100.0, max(0.0, s_error)))

        # 3. Regime Stability Score (0-100)
        if regime == "NORMAL":
            s_regime = 96.0
        elif regime == "DELAYED":
            s_regime = 72.0
        else:  # DISRUPTED
            s_regime = 35.0

        # 4. Data Freshness & Quality Score (0-100)
        freshness_penalty = min(40.0, (data_freshness_sec / 60.0) * 10.0)
        s_freshness = float(max(10.0, (data_quality_score * 0.7) + (30.0 - freshness_penalty)))
        s_freshness = float(min(100.0, max(0.0, s_freshness)))

        # 5. Section Historical Variability Score (0-100)
        if section_std_runtime <= 4.0:
            s_variability = 95.0
        elif section_std_runtime <= 10.0:
            s_variability = 80.0
        else:
            s_variability = max(20.0, 70.0 - (section_std_runtime * 2.0))
        s_variability = float(min(100.0, max(0.0, s_variability)))

        # Weighted composite score
        w_u = settings.WEIGHT_UNCERTAINTY
        w_e = settings.WEIGHT_ERROR_TREND
        w_r = settings.WEIGHT_REGIME
        w_f = settings.WEIGHT_FRESHNESS
        w_v = settings.WEIGHT_VARIABILITY

        raw_score = (
            s_uncertainty * w_u +
            s_error * w_e +
            s_regime * w_r +
            s_freshness * w_f +
            s_variability * w_v
        )
        final_score = int(round(min(100.0, max(0.0, raw_score))))

        # Categorization
        if final_score >= settings.RELIABILITY_HIGH_THRESHOLD:
            category = "HIGH"
            interpretation = "High confidence forecast; narrow statistical bounds and stable historical adherence."
        elif final_score >= settings.RELIABILITY_MEDIUM_THRESHOLD:
            category = "MEDIUM"
            interpretation = "Moderate reliability; expected arrival may fluctuate within stated window."
        else:
            category = "LOW"
            interpretation = "Low reliability; severe section disruption or rapid delay acceleration detected."

        factors = [
            {
                "name": "Prediction Uncertainty Interval",
                "score": round(s_uncertainty, 1),
                "weight": w_u,
                "weighted_contribution": round(s_uncertainty * w_u, 1),
                "status": "OPTIMAL" if s_uncertainty >= 75 else ("ACCEPTABLE" if s_uncertainty >= 45 else "DEGRADED"),
                "description": f"Interval span: ±{interval_width_min // 2} min relative to {int(distance_remaining_km)} km remaining."
            },
            {
                "name": "Recent Sequential Prediction Error",
                "score": round(s_error, 1),
                "weight": w_e,
                "weighted_contribution": round(s_error * w_e, 1),
                "status": "OPTIMAL" if s_error >= 75 else ("ACCEPTABLE" if s_error >= 45 else "DEGRADED"),
                "description": f"Recent mean station prediction error: {round(recent_errors[-1] if recent_errors else 0.0, 1)} min."
            },
            {
                "name": "Operating Regime Stability",
                "score": round(s_regime, 1),
                "weight": w_r,
                "weighted_contribution": round(s_regime * w_r, 1),
                "status": "OPTIMAL" if s_regime >= 75 else ("ACCEPTABLE" if s_regime >= 45 else "DEGRADED"),
                "description": f"Train is currently in {regime} operating condition."
            },
            {
                "name": "Data Freshness & Packet Integrity",
                "score": round(s_freshness, 1),
                "weight": w_f,
                "weighted_contribution": round(s_freshness * w_f, 1),
                "status": "OPTIMAL" if s_freshness >= 75 else ("ACCEPTABLE" if s_freshness >= 45 else "DEGRADED"),
                "description": f"Telemetry updated {data_freshness_sec}s ago; packet quality {data_quality_score}%."
            },
            {
                "name": "Section Historical Variability",
                "score": round(s_variability, 1),
                "weight": w_v,
                "weighted_contribution": round(s_variability * w_v, 1),
                "status": "OPTIMAL" if s_variability >= 75 else ("ACCEPTABLE" if s_variability >= 45 else "DEGRADED"),
                "description": f"Section historical standard deviation: {round(section_std_runtime, 1)} min."
            }
        ]

        return {
            "overall_score": final_score,
            "category": category,
            "interpretation": interpretation,
            "factors": factors,
            "recent_error_trend_min": recent_errors[-5:] if recent_errors else [0.0],
            "historical_section_reliability": round(s_variability, 1)
        }

reliability_engine = ReliabilityEngine()
