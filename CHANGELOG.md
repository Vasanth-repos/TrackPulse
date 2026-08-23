# Changelog — Adaptive ETA Reliability & Forecasting System

## [1.0.0] - 2026-08-22
### Initial Production-Quality Prototype Release

#### ML & Data Pipeline
- Implemented **Journey Reconstruction Engine** with multi-day midnight rollover handling and section-level statistics.
- Developed statistical **Operating Regime Detector** (`NORMAL`, `DELAYED`, `DISRUPTED`).
- Built **Section-Aware Quantile Forecaster** using Gradient Boosted Quantile Regressors ($\alpha \in [0.10, 0.50, 0.90]$) with **Monotonic Anti-Quantile Crossing** post-processing.
- Established **Baseline 1** (Timetable) and **Baseline 2** (Schedule + Current Delay + Static Recovery) for rigorous comparisons.
- Implemented **Calibration & Evaluation Benchmarking Module** with empirical 80% coverage testing and disaggregated regime/horizon breakdowns.
- Built 5-factor calibrated **Reliability Engine** (0–100 score).
- Developed **Rule-Based Evidence Generator** with auditable signals and zero generative hallucinations.
- Created **Leakage-Free Historical Replay Engine** powering the 90-second demo narrative.

#### Backend API
- FastAPI application with CORS and OpenAPI / Swagger documentation at `/docs`.
- REST endpoints for Network Overview, Active Trains, Live Delay Trajectories, Reliability Breakdown, Auditable Evidence, Replay Controls, and Model Benchmarks.
- 15 automated Pytest unit and integration tests passing with 100% success rate.

#### Frontend Application
- Bespoke **Railway Control Room UI** designed with dark charcoal theme, track progression metaphors, and glassmorphism.
- Signature **Visual Uncertainty Time-Window Component** (`[======●======]`).
- Interactive **Railway Journey Track Timeline** and dynamic SVG **Delay Trajectory Chart**.
- Compact **Reliability Index Meter** with factor breakdown.
- Auditable **"Why This ETA?" Evidence Panel**.
- Full-featured **Live Replay Studio** with Play/Pause, Step Scrubber, and Speed Multipliers.
- **Model Performance Benchmark Lab** and **Dataset Health Auditor**.
