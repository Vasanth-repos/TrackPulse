import {
  NetworkSummary,
  TrainLiveStatus,
  TrainInfo,
  TrajectoryResponse,
  ReliabilityBreakdown,
  EvidenceResponse,
  ReplaySession,
  EvaluationReport,
  DatasetAuditReport,
  NetworkAnalyzeResponse,
  UserRequirementRequest,
  UserRequirementResponse,
  WhatIfSimulateRequest,
  WhatIfSimulateResponse,
  PNRStatusResponse,
  SMSInboundResponse
} from '../types/api';

const API_BASE = '/api';

export async function fetchNetworkSummary(): Promise<NetworkSummary> {
  const res = await fetch(`${API_BASE}/network/summary`);
  if (!res.ok) throw new Error('Failed to fetch network summary');
  return res.json();
}

export async function fetchAllTrains(): Promise<TrainLiveStatus[]> {
  const res = await fetch(`${API_BASE}/trains`);
  if (!res.ok) throw new Error('Failed to fetch trains');
  return res.json();
}

export async function fetchTrainDetails(trainId: string): Promise<TrainInfo> {
  const res = await fetch(`${API_BASE}/train/${trainId}`);
  if (!res.ok) throw new Error(`Failed to fetch details for train ${trainId}`);
  return res.json();
}

export async function fetchTrainTrajectory(trainId: string): Promise<TrajectoryResponse> {
  const res = await fetch(`${API_BASE}/train/${trainId}/trajectory`);
  if (!res.ok) throw new Error(`Failed to fetch trajectory for train ${trainId}`);
  return res.json();
}

export async function fetchTrainReliability(trainId: string): Promise<ReliabilityBreakdown> {
  const res = await fetch(`${API_BASE}/train/${trainId}/reliability`);
  if (!res.ok) throw new Error(`Failed to fetch reliability for train ${trainId}`);
  return res.json();
}

export async function fetchTrainEvidence(trainId: string): Promise<EvidenceResponse> {
  const res = await fetch(`${API_BASE}/train/${trainId}/explanation`);
  if (!res.ok) throw new Error(`Failed to fetch evidence for train ${trainId}`);
  return res.json();
}

export async function fetchReplaySession(trainId: string, sessionId: string = '12627_signature_demo'): Promise<ReplaySession> {
  const res = await fetch(`${API_BASE}/replay/${trainId}/session?session_id=${sessionId}`);
  if (!res.ok) throw new Error(`Failed to fetch replay session for train ${trainId}`);
  return res.json();
}

export async function stepReplaySession(trainId: string, delta: number, sessionId: string = '12627_signature_demo'): Promise<ReplaySession> {
  const res = await fetch(`${API_BASE}/replay/${trainId}/step?delta=${delta}&session_id=${sessionId}`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Failed to step replay session');
  return res.json();
}

export async function jumpReplayStep(trainId: string, stepIndex: number, sessionId: string = '12627_signature_demo'): Promise<ReplaySession> {
  const res = await fetch(`${API_BASE}/replay/${trainId}/jump?step_index=${stepIndex}&session_id=${sessionId}`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Failed to jump replay step');
  return res.json();
}

export async function resetReplaySession(trainId: string, sessionId: string = '12627_signature_demo'): Promise<ReplaySession> {
  const res = await fetch(`${API_BASE}/replay/${trainId}/reset?session_id=${sessionId}`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Failed to reset replay session');
  return res.json();
}

export async function fetchModelEvaluation(): Promise<EvaluationReport> {
  const res = await fetch(`${API_BASE}/model/evaluation`);
  if (!res.ok) throw new Error('Failed to fetch model evaluation');
  return res.json();
}

export async function fetchDatasetAudit(): Promise<DatasetAuditReport> {
  const res = await fetch(`${API_BASE}/data-quality`);
  if (!res.ok) throw new Error('Failed to fetch dataset audit report');
  return res.json();
}

// -------------------------------------------------------------
// Spec Feature API Functions
// -------------------------------------------------------------

export async function fetchNetworkAnalysis(stationId: string = 'MAS', timeWindowMin: number = 180): Promise<NetworkAnalyzeResponse> {
  const res = await fetch(`${API_BASE}/network/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ station_id: stationId, time_window_minutes: timeWindowMin })
  });
  if (!res.ok) throw new Error(`Failed to analyze network for station ${stationId}`);
  return res.json();
}

export async function fetchTrainRecommendations(req: UserRequirementRequest): Promise<UserRequirementResponse> {
  const res = await fetch(`${API_BASE}/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req)
  });
  if (!res.ok) throw new Error('Failed to fetch train recommendations');
  return res.json();
}

export async function simulateDelayInjection(req: WhatIfSimulateRequest): Promise<WhatIfSimulateResponse> {
  const res = await fetch(`${API_BASE}/simulate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req)
  });
  if (!res.ok) throw new Error('Failed to simulate delay injection');
  return res.json();
}

export async function fetchPNRStatus(pnr: string): Promise<PNRStatusResponse> {
  const res = await fetch(`${API_BASE}/pnr/status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pnr })
  });
  if (!res.ok) throw new Error(`Failed to fetch PNR status for ${pnr}`);
  return res.json();
}

export async function sendInboundSMS(sender: string, message: string): Promise<SMSInboundResponse> {
  const res = await fetch(`${API_BASE}/sms/inbound`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sender, message })
  });
  if (!res.ok) throw new Error('Failed to send inbound SMS request');
  return res.json();
}
