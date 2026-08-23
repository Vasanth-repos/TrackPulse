"""
Evidence-Based Explanation Generator
Maps measurable, auditable input features and statistical deviations to structured evidence items.
Never uses unverified generative causal claims.
"""

from typing import List, Dict, Any

class EvidenceGenerator:
    def __init__(self):
        pass

    def generate_evidence(
        self,
        current_delay_min: int,
        prev_delay_min: int,
        delay_trend_1_sec: int,
        delay_trend_3_sec: int,
        section_actual_runtime: float,
        section_median_runtime: float,
        section_rec_p50: float,
        regime: str,
        data_freshness_sec: int,
        data_quality_score: int
    ) -> List[Dict[str, Any]]:
        """
        Generates 2-4 auditable evidence items explaining why the forecast or reliability adjusted.
        """
        items = []
        item_id = 1

        # 1. Section running time deviation
        runtime_delta = section_actual_runtime - section_median_runtime
        if runtime_delta >= 4.0:
            items.append({
                "id": f"ev-{item_id}",
                "code": "SEC_RUNTIME_EXCESS",
                "category": "SECTION_RUNTIME",
                "title": "Section Running Time Deviation",
                "detail": f"Observed section running time was +{int(round(runtime_delta))} min above historical median for this section ({int(section_median_runtime)} min).",
                "metric_value": f"+{int(round(runtime_delta))} min",
                "impact_level": "HIGH" if runtime_delta > 10 else "MEDIUM",
                "icon_type": "clock"
            })
            item_id += 1
        elif runtime_delta <= -3.0:
            items.append({
                "id": f"ev-{item_id}",
                "code": "SEC_RUNTIME_FAST",
                "category": "SECTION_RUNTIME",
                "title": "Section Speed Recovery",
                "detail": f"Section was traversed {abs(int(round(runtime_delta)))} min faster than median runtime ({int(section_median_runtime)} min).",
                "metric_value": f"{int(round(runtime_delta))} min",
                "impact_level": "MEDIUM",
                "icon_type": "zap"
            })
            item_id += 1

        # 2. Sequential Delay Trend
        if delay_trend_1_sec >= 5 or delay_trend_3_sec >= 10:
            items.append({
                "id": f"ev-{item_id}",
                "code": "DELAY_SURGE",
                "category": "DELAY_TREND",
                "title": "Recent Delay Acceleration",
                "detail": f"Cumulative delay increased by +{delay_trend_1_sec} min over the previous section and +{delay_trend_3_sec} min across last 3 sections.",
                "metric_value": f"+{delay_trend_1_sec} min / sec",
                "impact_level": "HIGH" if delay_trend_1_sec > 10 else "MEDIUM",
                "icon_type": "trending-up"
            })
            item_id += 1
        elif delay_trend_1_sec <= -3:
            items.append({
                "id": f"ev-{item_id}",
                "code": "DELAY_MAKEUP",
                "category": "DELAY_TREND",
                "title": "Active Delay Recovery",
                "detail": f"Delay reduced by {abs(delay_trend_1_sec)} min on the last section run.",
                "metric_value": f"{delay_trend_1_sec} min",
                "impact_level": "MEDIUM",
                "icon_type": "trending-down"
            })
            item_id += 1

        # 3. Recovery expectation vs historical
        if current_delay_min > 20 and section_rec_p50 < 2.0:
            items.append({
                "id": f"ev-{item_id}",
                "code": "LOW_RECOVERY_MARGIN",
                "category": "RECOVERY_EXPECTATION",
                "title": "Restricted Section Recovery Margin",
                "detail": f"Historical recovery buffer in upcoming sections is constrained (median recovery only {round(section_rec_p50, 1)} min).",
                "metric_value": f"{round(section_rec_p50, 1)} min buf",
                "impact_level": "LOW",
                "icon_type": "shield-alert"
            })
            item_id += 1

        # 4. Operating Regime State
        if regime == "DISRUPTED":
            items.append({
                "id": f"ev-{item_id}",
                "code": "REGIME_DISRUPTED",
                "category": "REGIME_SHIFT",
                "title": "Disrupted Operating Regime Active",
                "detail": "High uncertainty envelope active due to severe statistical divergence from corridor timetable norms.",
                "metric_value": "DISRUPTED",
                "impact_level": "HIGH",
                "icon_type": "alert-triangle"
            })
            item_id += 1

        # 5. Data freshness check
        if data_freshness_sec > 120 or data_quality_score < 80:
            items.append({
                "id": f"ev-{item_id}",
                "code": "STALE_TELEMETRY",
                "category": "DATA_QUALITY",
                "title": "Data Freshness Latency",
                "detail": f"Latest telemetry packet was received {data_freshness_sec}s ago. Confidence score discounted.",
                "metric_value": f"{data_freshness_sec}s lag",
                "impact_level": "MEDIUM",
                "icon_type": "database"
            })
            item_id += 1

        # Default normal evidence if nothing anomalous
        if not items:
            items.append({
                "id": f"ev-{item_id}",
                "code": "STABLE_RUNNING",
                "category": "SECTION_RUNTIME",
                "title": "Nominal Section Adherence",
                "detail": "Running times across preceding stations match historical median timetable progression.",
                "metric_value": "±0 min delta",
                "impact_level": "LOW",
                "icon_type": "check-circle"
            })

        return items

evidence_generator = EvidenceGenerator()
