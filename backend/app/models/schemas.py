from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class Station(BaseModel):
    station_code: str
    station_name: str
    sequence: int
    scheduled_arrival: str  # "HH:MM"
    scheduled_departure: str  # "HH:MM"
    distance_km: float
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    state: Optional[str] = None
    zone: Optional[str] = None

class TrainInfo(BaseModel):
    train_id: str
    train_name: str
    train_type: str  # "Superfast Express", "Rajdhani", "Shatabdi", "Vande Bharat", "Mail/Express"
    origin_station_code: str
    origin_station_name: str
    destination_station_code: str
    destination_station_name: str
    total_distance_km: float
    total_stations: int
    scheduled_departure_time: str
    scheduled_arrival_time: str

class TrainLiveStatus(BaseModel):
    train_id: str
    train_name: str
    train_type: str
    current_station_code: str
    current_station_name: str
    current_station_sequence: int
    next_station_code: str
    next_station_name: str
    final_destination_code: str
    final_destination_name: str
    current_delay_min: int
    scheduled_arrival: str
    predicted_eta: str
    predicted_delay_min: int
    eta_lower_bound: str
    eta_upper_bound: str
    interval_width_min: int
    reliability_score: int
    reliability_category: str  # "HIGH", "MEDIUM", "LOW"
    regime: str  # "NORMAL", "DELAYED", "DISRUPTED"
    data_freshness_sec: int
    data_quality_score: int
    is_live: bool = True

class TrajectoryPoint(BaseModel):
    station_code: str
    station_name: str
    sequence: int
    distance_km: float
    scheduled_arrival: str
    scheduled_departure: str
    actual_arrival: Optional[str] = None
    actual_departure: Optional[str] = None
    predicted_arrival: str
    predicted_delay_min: int
    lower_bound_arrival: str
    upper_bound_arrival: str
    interval_width_min: int
    reliability_score: int
    regime: str
    status: str  # "PASSED", "CURRENT", "UPCOMING"
    actual_delay_min: Optional[int] = None

class TrajectoryResponse(BaseModel):
    train_id: str
    train_name: str
    journey_date: str
    current_station_code: str
    points: List[TrajectoryPoint]
    summary_trend: str  # "INCREASING", "STABLE", "RECOVERING"
    max_predicted_delay_min: int
    min_predicted_delay_min: int

class ReliabilityFactor(BaseModel):
    name: str
    score: float  # 0 to 100
    weight: float
    weighted_contribution: float
    status: str  # "OPTIMAL", "ACCEPTABLE", "DEGRADED"
    description: str

class ReliabilityBreakdown(BaseModel):
    overall_score: int
    category: str
    interpretation: str
    factors: List[ReliabilityFactor]
    recent_error_trend_min: List[float]
    historical_section_reliability: float

class EvidenceItem(BaseModel):
    id: str
    code: str
    category: str  # "SECTION_RUNTIME", "DELAY_TREND", "RECOVERY_EXPECTATION", "DATA_QUALITY", "REGIME_SHIFT"
    title: str
    detail: str
    metric_value: str
    impact_level: str  # "LOW", "MEDIUM", "HIGH"
    icon_type: str

class EvidenceResponse(BaseModel):
    train_id: str
    current_station: str
    previous_eta: str
    current_eta: str
    eta_delta_min: int
    evidence_items: List[EvidenceItem]
    audit_notes: str

class ReplayStepEvent(BaseModel):
    step_index: int
    timestamp_simulated: str
    current_station_code: str
    current_station_name: str
    current_station_seq: int
    actual_delay_min: int
    predicted_eta: str
    predicted_delay_min: int
    interval_lower: str
    interval_upper: str
    interval_width_min: int
    reliability_score: int
    regime: str
    evidence_summary: List[str]
    is_disruption_event: bool = False
    is_recovery_event: bool = False
    narrative_description: str

class ReplaySession(BaseModel):
    session_id: str
    train_id: str
    train_name: str
    scenario_id: str
    scenario_name: str
    scenario_type: str  # "NORMAL", "DISRUPTED_AND_CASCADE", "RECOVERY_AND_MAKEUP"
    total_steps: int
    current_step: int
    steps: List[ReplayStepEvent]
    is_complete: bool

class NetworkSummary(BaseModel):
    total_monitored_trains: int
    normal_trains_count: int
    delayed_trains_count: int
    disrupted_trains_count: int
    low_reliability_count: int
    average_reliability_score: float
    average_network_delay_min: float
    active_corridors: List[Dict[str, Any]]
    system_freshness_sec: int
    system_status: str

class MetricEvaluation(BaseModel):
    model_name: str
    mae_min: float
    rmse_min: float
    median_absolute_error_min: float
    within_5_min_pct: float
    within_10_min_pct: float
    target_coverage_pct: Optional[float] = None
    observed_coverage_pct: Optional[float] = None
    average_interval_width_min: Optional[float] = None

class RegimeMetricBreakdown(BaseModel):
    regime: str
    sample_count: int
    baseline_schedule_mae: float
    baseline_current_delay_mae: float
    proposed_model_mae: float
    proposed_model_coverage_pct: float
    proposed_avg_width_min: float

class HorizonMetricBreakdown(BaseModel):
    horizon: str  # "SHORT (1-3 stations)", "MEDIUM (4-7 stations)", "LONG (8+ stations)"
    sample_count: int
    baseline_current_delay_mae: float
    proposed_model_mae: float
    proposed_coverage_pct: float

class EvaluationReport(BaseModel):
    evaluation_date: str
    dataset_name: str
    total_test_journeys: int
    total_test_observations: int
    models: List[MetricEvaluation]
    regime_breakdown: List[RegimeMetricBreakdown]
    horizon_breakdown: List[HorizonMetricBreakdown]
    calibration_curve: List[Dict[str, float]]  # [{"requested_coverage": 0.5, "observed_coverage": 0.49}, ...]

class DatasetAuditReport(BaseModel):
    dataset_name: str
    file_format: str
    total_records: int
    total_trains: int
    total_journeys: int
    total_stations: int
    date_range_start: str
    date_range_end: str
    detected_columns: List[str]
    missing_mandatory_fields: List[str]
    missing_optional_fields: List[str]
    missing_values_percentage: Dict[str, float]
    journey_completeness_pct: float
    timestamp_plausibility_pct: float
    data_quality_grade: str  # "A (Production Ready)", "B (Good)", "C (Degraded)"
    status: str
