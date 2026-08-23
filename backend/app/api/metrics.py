"""
Model Evaluation & Benchmark Metrics API
Exposes baseline vs proposed model comparisons, calibration curves, and regime disaggregations.
"""

from fastapi import APIRouter
from app.models.schemas import EvaluationReport
from app.ml.calibration import calibration_evaluator

router = APIRouter(prefix="", tags=["Model Benchmarks & Calibration"])

@router.get("/model/evaluation", response_model=EvaluationReport)
def get_model_evaluation():
    """Returns official benchmark comparison between Baseline 1, Baseline 2, and Proposed Quantile Model."""
    return calibration_evaluator.get_report()
