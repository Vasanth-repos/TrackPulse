"""
Prediction Domain Models
Data schemas for point ETA predictions, P10/P90 quantile intervals, and calibrated reliability categories.
"""

from typing import Optional
from pydantic import BaseModel, Field


class ETAPredictionResponse(BaseModel):
    train_number: str
    train_name: str
    station: str
    station_name: str
    eta: str
    p10: str
    p90: str
    reliability: str  # "HIGH", "MEDIUM", "LOW"
    regime: str       # "NORMAL", "DELAYED", "DISRUPTED"
    current_delay: int
    last_updated: str
    data_source_mode: str = "DEMO / HISTORICAL REPLAY DATA"
    reason_summary: Optional[str] = None
    is_stale: bool = False
