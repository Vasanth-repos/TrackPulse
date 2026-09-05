"""
Replay API Endpoints
Controls the historical replay simulation studio for live judge demonstrations.
"""

from typing import Dict, Any, List
from fastapi import APIRouter, Query, Body
from app.models.schemas import ReplaySession, ReplayStepEvent
from app.replay.engine import replay_engine

router = APIRouter(prefix="/replay", tags=["Historical Replay Studio"])

@router.get("", response_model=ReplaySession)
@router.get("/", response_model=ReplaySession)
def get_default_replay_session(session_id: str = "12627_signature_demo"):
    """Returns the default active replay session state."""
    return replay_engine.get_session(session_id)

@router.get("/{train_id}/journeys", response_model=List[Dict[str, str]])
def get_available_journeys(train_id: str):
    """Returns available replay scenarios for the train."""
    return [
        {
            "scenario_id": "12627_signature_demo",
            "scenario_name": "Signature 90-Second Demo (Normal -> Disrupted -> Recovery)",
            "scenario_type": "DISRUPTED_AND_CASCADE",
            "description": "Full end-to-end multi-day journey from Bengaluru (SBC) to New Delhi (NDLS) featuring a cascade disruption at Wadi followed by speed recovery."
        }
    ]

@router.get("/{train_id}/session", response_model=ReplaySession)
def get_replay_session(train_id: str, session_id: str = "12627_signature_demo"):
    """Returns the current replay session state and station-by-station streaming history."""
    return replay_engine.get_session(session_id)

@router.post("/{train_id}/step", response_model=ReplaySession)
def step_replay_session(
    train_id: str,
    delta: int = Query(default=1, description="Step delta (+1 to advance, -1 to rewind)"),
    session_id: str = Query(default="12627_signature_demo")
):
    """Advances or rewinds the replay session by one or more station events."""
    return replay_engine.step_session(session_id, delta=delta)

@router.post("/{train_id}/jump", response_model=ReplaySession)
def jump_replay_step(
    train_id: str,
    step_index: int = Query(..., description="Target station step index (0 to N)"),
    session_id: str = Query(default="12627_signature_demo")
):
    """Jumps directly to a specific station event in the replay timeline."""
    return replay_engine.jump_to_step(session_id, step_index=step_index)

@router.post("/{train_id}/reset", response_model=ReplaySession)
def reset_replay_session(train_id: str, session_id: str = "12627_signature_demo"):
    """Resets the replay session to the initial departure station."""
    return replay_engine.reset_session(session_id)
