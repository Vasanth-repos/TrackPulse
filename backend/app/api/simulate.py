"""
What-If Simulation API Router
"""

from fastapi import APIRouter
from app.models.spec_schemas import WhatIfSimulateRequest, WhatIfSimulateResponse
from app.simulation.what_if_engine import what_if_engine

router = APIRouter(prefix="", tags=["What-If Delay Simulation"])

@router.post("/simulate", response_model=WhatIfSimulateResponse)
def simulate_delay_injection(req: WhatIfSimulateRequest):
    """Simulates what-if disruption scenarios and computes multi-train delay propagation across the network."""
    return what_if_engine.run_simulation(req)
