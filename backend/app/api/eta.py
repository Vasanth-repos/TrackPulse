"""
ETA API Endpoints
Provides direct ETA predictions for train numbers and station codes.
"""

from fastapi import APIRouter, HTTPException, Query
from app.models.prediction import ETAPredictionResponse
from app.services.eta_service import eta_service

router = APIRouter(prefix="/eta", tags=["ETA Service"])


@router.get("/{train_number}/{station_code}", response_model=ETAPredictionResponse)
def get_train_eta(
    train_number: str,
    station_code: str,
    data_freshness_sec: int = Query(default=40, description="Simulated data freshness latency in seconds")
):
    """
    Returns Point ETA, P10/P90 Quantile Bounds, Calibrated Reliability, and Current Delay
    for a specific train and station stop.
    """
    try:
        return eta_service.get_eta(
            train_number=train_number,
            station_code=station_code,
            simulated_data_freshness_sec=data_freshness_sec
        )
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except KeyError as ke:
        raise HTTPException(status_code=404, detail=str(ke))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal ETA evaluation error")
