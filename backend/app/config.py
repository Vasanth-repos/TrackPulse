import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "Adaptive ETA Reliability & Forecasting System"
    API_V1_PREFIX: str = "/api"
    DEBUG: bool = True
    
    # Reliability weights (sum to 1.0)
    WEIGHT_UNCERTAINTY: float = 0.35
    WEIGHT_ERROR_TREND: float = 0.25
    WEIGHT_REGIME: float = 0.20
    WEIGHT_FRESHNESS: float = 0.10
    WEIGHT_VARIABILITY: float = 0.10
    
    # Reliability score category cutoffs
    RELIABILITY_HIGH_THRESHOLD: float = 70.0
    RELIABILITY_MEDIUM_THRESHOLD: float = 40.0
    
    # Regime percentile thresholds
    REGIME_NORMAL_PERCENTILE: float = 75.0
    REGIME_DELAYED_PERCENTILE: float = 95.0

settings = Settings()
