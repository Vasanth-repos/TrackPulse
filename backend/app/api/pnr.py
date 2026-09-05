"""
PNR Intelligence API Router
"""

from fastapi import APIRouter
from app.models.spec_schemas import PNRStatusRequest, PNRStatusResponse
from app.pnr.pnr_provider import pnr_provider

router = APIRouter(prefix="", tags=["PNR Intelligence"])

@router.post("/pnr/status", response_model=PNRStatusResponse)
def get_pnr_status(req: PNRStatusRequest):
    """Retrieves journey details, masked PNR, and dynamic ETA prediction for a passenger PNR."""
    return pnr_provider.get_pnr_status(req.pnr)

@router.get("/pnr/{pnr}", response_model=PNRStatusResponse)
def get_pnr_status_get(pnr: str):
    """GET convenience route for PNR status lookups."""
    return pnr_provider.get_pnr_status(pnr)
