"""
Train API Endpoints
Provides network summaries, train list, live status, delay trajectories,
reliability breakdown, and evidence explanations.
"""

from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException
from app.models.schemas import (
    NetworkSummary, TrainLiveStatus, TrajectoryResponse,
    ReliabilityBreakdown, EvidenceResponse, TrainInfo
)
from app.services.train_service import train_service
from app.data.coaching_trains_dataset import TRAINS_METADATA, get_train_by_id, get_station_info

router = APIRouter(prefix="", tags=["Trains & Live Monitoring"])

@router.get("/network/summary", response_model=NetworkSummary)
def get_network_summary():
    """Returns network-wide overview of all monitored trains and active corridors."""
    return train_service.get_network_summary()

@router.get("/trains", response_model=List[TrainLiveStatus])
def get_all_trains():
    """Returns live status of all active coaching trains with ETA, uncertainty, reliability, and regime."""
    return train_service.get_all_trains_live()

@router.get("/train/{train_id}", response_model=TrainInfo)
@router.get("/trains/{train_id}", response_model=TrainInfo)
def get_train_details(train_id: str):
    """Returns static metadata, origin/destination, and route summary for a train."""
    train = get_train_by_id(train_id)
    if not train:
        raise HTTPException(status_code=404, detail="Train not found")
    
    return TrainInfo(
        train_id=train["train_id"],
        train_name=train["train_name"],
        train_type=train["train_type"],
        origin_station_code=train["origin_station_code"],
        origin_station_name=train["origin_station_name"],
        destination_station_code=train["destination_station_code"],
        destination_station_name=train["destination_station_name"],
        total_distance_km=train["total_distance_km"],
        total_stations=len(train["route"]),
        scheduled_departure_time=train["scheduled_departure_time"],
        scheduled_arrival_time=train["scheduled_arrival_time"]
    )

@router.get("/train/{train_id}/eta", response_model=TrainLiveStatus)
@router.get("/trains/{train_id}/eta", response_model=TrainLiveStatus)
def get_train_live_eta(train_id: str):
    """Returns current live point ETA, prediction interval [lower, upper], and reliability score."""
    all_trains = train_service.get_all_trains_live()
    for t in all_trains:
        if t["train_id"] == train_id:
            return t
    raise HTTPException(status_code=404, detail="Train not found")

@router.get("/train/{train_id}/trajectory", response_model=TrajectoryResponse)
def get_train_trajectory(train_id: str):
    """Returns station-by-station delay trajectory and predicted arrival intervals for all upcoming stations."""
    return train_service.get_train_trajectory(train_id)

@router.get("/train/{train_id}/reliability", response_model=ReliabilityBreakdown)
def get_train_reliability(train_id: str):
    """Returns multi-factor breakdown of the reliability score for this train."""
    return train_service.get_train_reliability_breakdown(train_id)

@router.get("/train/{train_id}/explanation", response_model=EvidenceResponse)
def get_train_evidence(train_id: str):
    """Returns auditable evidence-based explanations for why the ETA or reliability changed."""
    return train_service.get_train_evidence(train_id)
