from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# -------------------------------------------------------------
# 1. Multi-Train & Delay Propagation Schemas
# -------------------------------------------------------------

class IncomingTrainInfo(BaseModel):
    train_id: str
    train_name: str
    origin_station_code: str
    predicted_arrival: str
    scheduled_arrival: str
    current_delay_min: int
    predicted_delay_min: int
    eta_lower_bound: str
    eta_upper_bound: str
    reliability_score: int
    regime: str
    platform_assigned: str

class OutgoingTrainInfo(BaseModel):
    train_id: str
    train_name: str
    destination_station_code: str
    scheduled_departure: str
    predicted_departure: str
    required_turnaround_min: int
    available_turnaround_min: int
    incoming_dependency_train_id: Optional[str] = None
    dependency_type: str  # "RAKE", "CREW", "PLATFORM", "SCHEDULE"
    departure_risk: str  # "LOW", "MEDIUM", "HIGH"
    propagated_delay_min: int
    platform_assigned: str

class PlatformConflict(BaseModel):
    platform_number: str
    conflicting_trains: List[str]
    overlap_window: str
    severity: str  # "LOW", "MEDIUM", "HIGH"
    recommended_action: str

class PropagationChainNode(BaseModel):
    train_id: str
    train_name: str
    station_code: str
    event_type: str  # "ARRIVAL", "TURNAROUND", "DEPARTURE"
    delay_minutes: int
    risk_level: str
    reason: str

class NetworkAnalyzeRequest(BaseModel):
    station_id: str = "MAS"
    time_window_minutes: int = 180

class NetworkAnalyzeResponse(BaseModel):
    station_id: str
    station_name: str
    analyzed_timestamp: str
    incoming_trains: List[IncomingTrainInfo]
    outgoing_trains: List[OutgoingTrainInfo]
    platform_conflicts: List[PlatformConflict]
    propagation_chains: List[List[PropagationChainNode]]
    total_active_dependencies: int
    overall_station_congestion: str  # "NORMAL", "CONGESTED", "CRITICAL"

# -------------------------------------------------------------
# 2. User Requirement & Recommendation Schemas
# -------------------------------------------------------------

class UserRequirementRequest(BaseModel):
    source: str = "MAS"
    destination: str = "CBE"
    journey_date: str = "2026-09-10"
    departure_window_start: str = "06:00"
    departure_window_end: str = "23:00"
    max_acceptable_delay_min: int = 30
    connection_required: bool = False
    connecting_departure_time: Optional[str] = None
    user_priority: str = "BALANCED"  # "PUNCTUALITY", "FASTEST", "RELIABILITY", "BALANCED"

class CandidateTrainScore(BaseModel):
    train_id: str
    train_name: str
    train_type: str
    origin_station_code: str
    destination_station_code: str
    scheduled_departure: str
    scheduled_arrival: str
    predicted_arrival: str
    eta_p10: str
    eta_p50: str
    eta_p90: str
    interval_width_min: int
    current_delay_min: int
    predicted_delay_min: int
    reliability_score: float  # 0.0 to 1.0
    delay_risk: str  # "LOW", "MEDIUM", "HIGH"
    connection_risk: str  # "SAFE", "AT_RISK", "LIKELY_MISSED", "N/A"
    overall_recommendation_score: float  # 0.0 to 100.0
    is_recommended: bool
    reasons: List[str]

class UserRequirementResponse(BaseModel):
    source: str
    destination: str
    journey_date: str
    total_candidates_found: int
    recommended_train: Optional[CandidateTrainScore] = None
    alternative_trains: List[CandidateTrainScore] = []
    scoring_weights_used: Dict[str, float]

# -------------------------------------------------------------
# 3. What-If Simulation Schemas
# -------------------------------------------------------------

class WhatIfSimulateRequest(BaseModel):
    train_id: str = "12627"
    delay_injection_minutes: int = 30
    injection_station_code: str = "NLR"
    delay_cause_category: str = "SECTION_HALT"  # "SECTION_HALT", "WEATHER_FOG", "SIGNAL_FAILURE", "FREIGHT_CROSSING"

class SimulatedTrainImpact(BaseModel):
    train_id: str
    train_name: str
    dependency_relation: str  # "DIRECT_TARGET", "OUTGOING_RAKE_DEPENDENT", "DOWNSTREAM_CONNECTING"
    baseline_delay_min: int
    simulated_delay_min: int
    delay_delta_min: int
    baseline_eta: str
    simulated_eta: str
    baseline_reliability: int
    simulated_reliability: int
    simulated_risk: str  # "LOW", "MEDIUM", "HIGH"
    cascade_reason: str

class WhatIfSimulateResponse(BaseModel):
    primary_train_id: str
    injected_delay_minutes: int
    injection_station_code: str
    simulation_timestamp: str
    affected_trains: List[SimulatedTrainImpact]
    passenger_connection_impact: str
    platform_bottleneck_warning: Optional[str] = None
    network_stability_index: float  # 0 to 100

# -------------------------------------------------------------
# 4. PNR & Button Phone SMS Schemas
# -------------------------------------------------------------

class PNRStatusRequest(BaseModel):
    pnr: str = "4281903490"

class PNRStatusResponse(BaseModel):
    pnr_masked: str
    train_id: str
    train_name: str
    train_type: str
    origin_station_code: str
    destination_station_code: str
    passenger_boarding_station: str
    passenger_destination_station: str
    journey_date: str
    booking_status: str  # "CONFIRMED", "RAC", "WL"
    coach_berth: str
    current_delay_min: int
    predicted_arrival: str
    eta_range: str
    reliability_percentage: int
    connection_risk: str
    status_summary: str
    is_mock_provider: bool = True

class SMSInboundRequest(BaseModel):
    sender: str = "+919876543210"
    message: str = "ETA 12627 BZA"

class SMSInboundResponse(BaseModel):
    sender_masked: str
    command_detected: str  # "ETA_INQUIRY", "PNR_INQUIRY", "HELP", "INVALID"
    response_text: str
    character_count: int
    is_sms_friendly: bool
