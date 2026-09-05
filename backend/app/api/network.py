"""
Network & Multi-Train Delay Propagation API Router
"""

from fastapi import APIRouter
from app.models.spec_schemas import NetworkAnalyzeRequest, NetworkAnalyzeResponse
from app.propagation.multi_train_engine import multi_train_engine

router = APIRouter(prefix="", tags=["Network & Multi-Train Intelligence"])

@router.post("/network/analyze", response_model=NetworkAnalyzeResponse)
def analyze_network(req: NetworkAnalyzeRequest):
    """Analyzes incoming/outgoing coaching train interactions, platform assignments, and delay propagation."""
    return multi_train_engine.analyze_station_network(req.station_id, req.time_window_minutes)

@router.get("/network/analyze/{station_id}", response_model=NetworkAnalyzeResponse)
def analyze_network_by_station(station_id: str):
    """GET convenience route for multi-train station analysis."""
    return multi_train_engine.analyze_station_network(station_id, 180)
