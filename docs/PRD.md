# Product Requirements Document (PRD) — RailETA Intelligence

## 1. Problem
Current railway passenger ETA tools (NTES, apps) output a single point estimate calculated as $\text{Scheduled} + \text{Delay} + \text{Static Recovery}$. This produces false precision because current delay does not equal future delay. Passengers and controllers have no indication of how much to trust an ETA or whether a train is under disruption.

## 2. Target Users
- **Passengers:** Need clear arrival windows (e.g. 18:35–18:50) and plain-language trust indicators ("High/Medium/Low Reliability").
- **Control Room Operations Staff:** Need sortable train boards by reliability, operating regime detection (Normal/Delayed/Disrupted), delay trajectory curves, and auditable reasons for forecast shifts.
- **Downstream Operations Systems:** Future automated consumers for platform and crew scheduling via standardized REST APIs.

## 3. Current Alternatives & Limitations
- **NTES (Official):** Near real-time location, but static ETA math. No uncertainty or reliability exposed.
- **Consumer Apps (RailYatri, Ixigo):** Single point estimates, proprietary opaque ML, no calibrated prediction intervals.
- **Academic Research (RSTGCN, Freight GNNs):** Focuses on freight or station-average delays, disconnected from passenger coaching train operations and reliability packaging.

## 4. Proposed Solution
An **Adaptive ETA Reliability Layer** producing 4 synchronized signals:
1. **Point ETA**
2. **Statistically Derived Uncertainty Interval** ($\alpha \in [0.1, 0.9]$)
3. **Calibrated Multi-Factor Reliability Score (0–100)**
4. **Auditable Signal Evidence** (never hallucinated)

## 5. Core Features
- Real-time Network Command Dashboard
- Visual Arrival Uncertainty Time-Window (`[======●======]`)
- Railway Track Progression Journey Timeline
- Station-by-Station Delay Trajectory & Recovery Forecast
- Multi-Factor Reliability Decomposition
- Signature 90-Second Demo Historical Replay Studio
- Model Benchmark & Empirical Calibration Curve Lab
- Phase 0 Dataset Health & Schema Mapping Auditor

## 6. Success Criteria
- Replayed journey demonstrably transitions Normal $\to$ Disrupted $\to$ Recovery live in under 90 seconds.
- Reliability score changes in sync with regime and backed by offline calibration (target 80% coverage vs ~80% empirical observed).
- Zero hallucinated generative causal claims.
- Baseline 1 & 2 vs Proposed Model benchmark with real measured metrics.
