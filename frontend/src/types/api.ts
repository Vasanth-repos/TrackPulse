export type OperatingRegime = 'NORMAL' | 'DELAYED' | 'DISRUPTED';
export type ReliabilityCategory = 'HIGH' | 'MEDIUM' | 'LOW';

export interface Station {
  station_code: string;
  station_name: string;
  sequence: number;
  scheduled_arrival: string;
  scheduled_departure: string;
  distance_km: number;
  latitude?: number;
  longitude?: number;
  state?: string;
  zone?: string;
}

export interface TrainInfo {
  train_id: string;
  train_name: string;
  train_type: string;
  origin_station_code: string;
  origin_station_name: string;
  destination_station_code: string;
  destination_station_name: string;
  total_distance_km: number;
  total_stations: number;
  scheduled_departure_time: string;
  scheduled_arrival_time: string;
}

export interface TrainLiveStatus {
  train_id: string;
  train_name: string;
  train_type: string;
  current_station_code: string;
  current_station_name: string;
  current_station_sequence: number;
  next_station_code: string;
  next_station_name: string;
  final_destination_code: string;
  final_destination_name: string;
  current_delay_min: number;
  scheduled_arrival: string;
  predicted_eta: string;
  predicted_delay_min: number;
  eta_lower_bound: string;
  eta_upper_bound: string;
  interval_width_min: number;
  reliability_score: number;
  reliability_category: ReliabilityCategory;
  regime: OperatingRegime;
  data_freshness_sec: number;
  data_quality_score: number;
  is_live: boolean;
}

export interface TrajectoryPoint {
  station_code: string;
  station_name: string;
  sequence: number;
  distance_km: number;
  scheduled_arrival: string;
  scheduled_departure: string;
  actual_arrival?: string | null;
  actual_departure?: string | null;
  predicted_arrival: string;
  predicted_delay_min: number;
  lower_bound_arrival: string;
  upper_bound_arrival: string;
  interval_width_min: number;
  reliability_score: number;
  regime: OperatingRegime;
  status: 'PASSED' | 'CURRENT' | 'UPCOMING';
  actual_delay_min?: number | null;
}

export interface TrajectoryResponse {
  train_id: string;
  train_name: string;
  journey_date: string;
  current_station_code: string;
  points: TrajectoryPoint[];
  summary_trend: 'INCREASING' | 'STABLE' | 'RECOVERING';
  max_predicted_delay_min: number;
  min_predicted_delay_min: number;
}

export interface ReliabilityFactor {
  name: string;
  score: number;
  weight: number;
  weighted_contribution: number;
  status: 'OPTIMAL' | 'ACCEPTABLE' | 'DEGRADED';
  description: string;
}

export interface ReliabilityBreakdown {
  overall_score: number;
  category: ReliabilityCategory;
  interpretation: string;
  factors: ReliabilityFactor[];
  recent_error_trend_min: number[];
  historical_section_reliability: number;
}

export interface EvidenceItem {
  id: string;
  code: string;
  category: string;
  title: string;
  detail: string;
  metric_value: string;
  impact_level: 'LOW' | 'MEDIUM' | 'HIGH';
  icon_type: string;
}

export interface EvidenceResponse {
  train_id: string;
  current_station: string;
  previous_eta: string;
  current_eta: string;
  eta_delta_min: number;
  evidence_items: EvidenceItem[];
  audit_notes: string;
}

export interface ReplayStepEvent {
  step_index: number;
  timestamp_simulated: string;
  current_station_code: string;
  current_station_name: string;
  current_station_seq: number;
  actual_delay_min: number;
  predicted_eta: string;
  predicted_delay_min: number;
  interval_lower: string;
  interval_upper: string;
  interval_width_min: number;
  reliability_score: number;
  regime: OperatingRegime;
  evidence_summary: string[];
  is_disruption_event: boolean;
  is_recovery_event: boolean;
  narrative_description: string;
  distance_remaining_km?: number;
  scheduled_arrival?: string;
}

export interface ReplaySession {
  session_id: string;
  train_id: string;
  train_name: string;
  scenario_id: string;
  scenario_name: string;
  scenario_type: string;
  total_steps: number;
  current_step: number;
  steps: ReplayStepEvent[];
  is_complete: boolean;
}

export interface NetworkSummary {
  total_monitored_trains: number;
  normal_trains_count: number;
  delayed_trains_count: number;
  disrupted_trains_count: number;
  low_reliability_count: number;
  average_reliability_score: number;
  average_network_delay_min: number;
  active_corridors: Array<{
    corridor_name: string;
    train_count: number;
    status: string;
    avg_delay: number;
    reliability: number;
  }>;
  system_freshness_sec: number;
  system_status: string;
}

export interface MetricEvaluation {
  model_name: string;
  mae_min: number;
  rmse_min: number;
  median_absolute_error_min: number;
  within_5_min_pct: number;
  within_10_min_pct: number;
  target_coverage_pct?: number | null;
  observed_coverage_pct?: number | null;
  average_interval_width_min?: number | null;
}

export interface RegimeMetricBreakdown {
  regime: string;
  sample_count: number;
  baseline_schedule_mae: number;
  baseline_current_delay_mae: number;
  proposed_model_mae: number;
  proposed_model_coverage_pct: number;
  proposed_avg_width_min: number;
}

export interface HorizonMetricBreakdown {
  horizon: string;
  sample_count: number;
  baseline_current_delay_mae: number;
  proposed_model_mae: number;
  proposed_coverage_pct: number;
}

export interface EvaluationReport {
  evaluation_date: string;
  dataset_name: string;
  total_test_journeys: number;
  total_test_observations: number;
  models: MetricEvaluation[];
  regime_breakdown: RegimeMetricBreakdown[];
  horizon_breakdown: HorizonMetricBreakdown[];
  calibration_curve: Array<{ requested_coverage: number; observed_coverage: number }>;
}

export interface DatasetAuditReport {
  dataset_name: string;
  file_format: string;
  total_records: number;
  total_trains: number;
  total_journeys: number;
  total_stations: number;
  date_range_start: string;
  date_range_end: string;
  detected_columns: string[];
  missing_mandatory_fields: string[];
  missing_optional_fields: string[];
  missing_values_percentage: Record<string, number>;
  journey_completeness_pct: number;
  timestamp_plausibility_pct: number;
  data_quality_grade: string;
  status: string;
}

// -------------------------------------------------------------
// Multi-Train & Delay Propagation Types
// -------------------------------------------------------------

export interface IncomingTrainInfo {
  train_id: string;
  train_name: string;
  origin_station_code: string;
  predicted_arrival: string;
  scheduled_arrival: string;
  current_delay_min: number;
  predicted_delay_min: number;
  eta_lower_bound: string;
  eta_upper_bound: string;
  reliability_score: number;
  regime: string;
  platform_assigned: string;
}

export interface OutgoingTrainInfo {
  train_id: string;
  train_name: string;
  destination_station_code: string;
  scheduled_departure: string;
  predicted_departure: string;
  required_turnaround_min: number;
  available_turnaround_min: number;
  incoming_dependency_train_id?: string | null;
  dependency_type: 'RAKE' | 'CREW' | 'PLATFORM' | 'SCHEDULE' | string;
  departure_risk: 'LOW' | 'MEDIUM' | 'HIGH' | string;
  propagated_delay_min: number;
  platform_assigned: string;
}

export interface PlatformConflict {
  platform_number: string;
  conflicting_trains: string[];
  overlap_window: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | string;
  recommended_action: string;
}

export interface PropagationChainNode {
  train_id: string;
  train_name: string;
  station_code: string;
  event_type: 'ARRIVAL' | 'TURNAROUND' | 'DEPARTURE' | string;
  delay_minutes: number;
  risk_level: string;
  reason: string;
}

export interface NetworkAnalyzeRequest {
  station_id: string;
  time_window_minutes?: number;
}

export interface NetworkAnalyzeResponse {
  station_id: string;
  station_name: string;
  analyzed_timestamp: string;
  incoming_trains: IncomingTrainInfo[];
  outgoing_trains: OutgoingTrainInfo[];
  platform_conflicts: PlatformConflict[];
  propagation_chains: PropagationChainNode[][];
  total_active_dependencies: number;
  overall_station_congestion: 'NORMAL' | 'CONGESTED' | 'CRITICAL' | string;
}

// -------------------------------------------------------------
// Passenger Recommendation Types
// -------------------------------------------------------------

export interface UserRequirementRequest {
  source: string;
  destination: string;
  journey_date?: string;
  departure_window_start?: string;
  departure_window_end?: string;
  max_acceptable_delay_min?: number;
  connection_required?: boolean;
  connecting_departure_time?: string | null;
  user_priority?: 'BALANCED' | 'PUNCTUALITY' | 'FASTEST' | 'RELIABILITY' | string;
}

export interface CandidateTrainScore {
  train_id: string;
  train_name: string;
  train_type: string;
  origin_station_code: string;
  destination_station_code: string;
  scheduled_departure: string;
  scheduled_arrival: string;
  predicted_arrival: string;
  eta_p10: string;
  eta_p50: string;
  eta_p90: string;
  interval_width_min: number;
  current_delay_min: number;
  predicted_delay_min: number;
  reliability_score: number;
  delay_risk: 'LOW' | 'MEDIUM' | 'HIGH' | string;
  connection_risk: 'SAFE' | 'AT_RISK' | 'LIKELY_MISSED' | 'N/A' | string;
  overall_recommendation_score: number;
  is_recommended: boolean;
  reasons: string[];
}

export interface UserRequirementResponse {
  source: string;
  destination: string;
  journey_date: string;
  total_candidates_found: number;
  recommended_train: CandidateTrainScore | null;
  alternative_trains: CandidateTrainScore[];
  scoring_weights_used: Record<string, number>;
}

// -------------------------------------------------------------
// What-If Disruption Simulator Types
// -------------------------------------------------------------

export interface WhatIfSimulateRequest {
  train_id: string;
  delay_injection_minutes: number;
  injection_station_code: string;
  delay_cause_category: 'SECTION_HALT' | 'WEATHER_FOG' | 'SIGNAL_FAILURE' | 'FREIGHT_CROSSING' | string;
}

export interface SimulatedTrainImpact {
  train_id: string;
  train_name: string;
  dependency_relation: 'DIRECT_TARGET' | 'OUTGOING_RAKE_DEPENDENT' | 'DOWNSTREAM_CONNECTING' | string;
  baseline_delay_min: number;
  simulated_delay_min: number;
  delay_delta_min: number;
  baseline_eta: string;
  simulated_eta: string;
  baseline_reliability: number;
  simulated_reliability: number;
  simulated_risk: 'LOW' | 'MEDIUM' | 'HIGH' | string;
  cascade_reason: string;
}

export interface WhatIfSimulateResponse {
  primary_train_id: string;
  injected_delay_minutes: number;
  injection_station_code: string;
  simulation_timestamp: string;
  affected_trains: SimulatedTrainImpact[];
  passenger_connection_impact: string;
  platform_bottleneck_warning?: string | null;
  network_stability_index: number;
}

// -------------------------------------------------------------
// PNR & Button Phone SMS Types
// -------------------------------------------------------------

export interface PNRStatusRequest {
  pnr: string;
}

export interface PNRStatusResponse {
  pnr_masked: string;
  train_id: string;
  train_name: string;
  train_type: string;
  origin_station_code: string;
  destination_station_code: string;
  passenger_boarding_station: string;
  passenger_destination_station: string;
  journey_date: string;
  booking_status: string;
  coach_berth: string;
  current_delay_min: number;
  predicted_arrival: string;
  eta_range: string;
  reliability_percentage: number;
  connection_risk: string;
  status_summary: string;
  is_mock_provider: boolean;
}

export interface SMSInboundRequest {
  sender: string;
  message: string;
}

export interface SMSInboundResponse {
  sender_masked: string;
  command_detected: 'ETA_INQUIRY' | 'PNR_INQUIRY' | 'HELP' | 'INVALID' | string;
  response_text: string;
  character_count: number;
  is_sms_friendly: boolean;
}
