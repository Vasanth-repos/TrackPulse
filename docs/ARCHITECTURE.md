# System Architecture — RailETA Intelligence

## 1. System Architecture Diagram

```
[ Indian Railways Coaching Timetable & Delays ]
                      │
                      ▼
        [ Preprocessing & Data Quality ]
                      │
                      ▼
         [ Journey Reconstruction ]
                      │
        ┌─────────────┴─────────────┐
        ▼                           ▼
[ Regime Detector ]       [ Section Statistics ]
        │                           │
        └─────────────┬─────────────┘
                      │
                      ▼
   [ Section-Aware Quantile Regressors ]
         (p10, p50, p90 with Anti-Crossing)
                      │
        ┌─────────────┴─────────────┐
        ▼                           ▼
[ Reliability Engine ]      [ Evidence Generator ]
        │                           │
        └─────────────┬─────────────┘
                      │
                      ▼
         [ FastAPI Application Core ]
                      │
                      ▼
     [ React 18 + TS Frontend UI & Replay ]
```

## 2. Components
- **`app/preprocessing/`**: Reconstructs journey paths, calculates section median runtime and variance, computes dwell times, handles multi-day date rollovers.
- **`app/ml/regime_detector.py`**: Statistical classifier for NORMAL (25th–75th percentile), DELAYED (75th–95th percentile), and DISRUPTED (>95th percentile).
- **`app/ml/forecaster.py`**: Quantile Gradient Boosted Trees for $\alpha = 0.10, 0.50, 0.90$ with anti-crossing monotonic sort post-processing.
- **`app/ml/calibration.py`**: Offline calibration evaluation against target 80% coverage on held-out test journeys.
- **`app/reliability/engine.py`**: 5-factor calibrated 0–100 reliability scoring.
- **`app/evidence/generator.py`**: Rule-based mapping from telemetry deltas to auditable explanation items.
- **`app/replay/engine.py`**: Leakage-free chronological historical replay simulation engine.
- **`frontend/`**: Vite + React + TypeScript + Tailwind Railway Control Room UI.
