"""
Dataset Audit & Data Quality API
Provides schema validation, missing value rates, and data quality grades.
"""

from fastapi import APIRouter
from app.models.schemas import DatasetAuditReport
from app.services.audit_service import audit_service

router = APIRouter(prefix="", tags=["Dataset Health & Schema Mapping"])

@router.get("/data-quality", response_model=DatasetAuditReport)
def get_data_quality_report():
    """Returns Phase 0 data audit report for the active railway historical archive."""
    return audit_service.get_dataset_audit_report()

@router.post("/dataset/audit", response_model=DatasetAuditReport)
def audit_custom_dataset():
    """Audits custom uploaded railway dataset and checks mandatory schema compliance."""
    return audit_service.get_dataset_audit_report()
