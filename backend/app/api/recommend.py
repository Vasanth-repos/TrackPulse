"""
User Requirement & Recommendation API Router
"""

from fastapi import APIRouter
from app.models.spec_schemas import UserRequirementRequest, UserRequirementResponse
from app.recommendation.requirement_engine import user_requirement_engine

router = APIRouter(prefix="", tags=["Passenger Recommendation Engine"])

@router.post("/recommend", response_model=UserRequirementResponse)
def get_train_recommendations(req: UserRequirementRequest):
    """Scores candidate coaching trains against passenger departure windows, delay tolerance, and reliability."""
    return user_requirement_engine.recommend_trains(req)
