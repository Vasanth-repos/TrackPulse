"""
Train Domain Models
Data schemas for trains, routes, and station schedules.
"""

from typing import List, Optional
from pydantic import BaseModel, Field


class StationStop(BaseModel):
    station_code: str
    station_name: str
    sequence: int
    scheduled_arrival: str
    scheduled_departure: str
    distance_km: float = 0.0


class TrainDetails(BaseModel):
    train_number: str
    train_name: str
    train_type: str = "Superfast Express"
    origin_code: str
    origin_name: str
    destination_code: str
    destination_name: str
    total_distance_km: float
    current_station_code: str
    current_station_name: str
    next_station_code: str
    next_station_name: str
    current_delay_minutes: int
    data_source_mode: str = "DEMO / HISTORICAL REPLAY DATA"
    route: List[StationStop] = []
