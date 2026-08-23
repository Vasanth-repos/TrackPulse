# REST API Specification — RailETA Intelligence

All endpoints return JSON responses conforming to Pydantic v2 schemas.

## 1. Network & Monitoring Endpoints
- `GET /api/network/summary` — Returns total monitored trains, regime counts, and active corridor health.
- `GET /api/trains` — Returns list of all active coaching trains with current station, delay, predicted ETA, interval bounds, reliability score, and operating regime.

## 2. Train Specific Endpoints
- `GET /api/train/{train_id}` — Returns static train metadata, schedule, and route.
- `GET /api/train/{train_id}/eta` — Returns live point ETA and prediction interval.
- `GET /api/train/{train_id}/trajectory` — Returns station-by-station arrival interval forecasts for all upcoming route stations.
- `GET /api/train/{train_id}/reliability` — Returns composite reliability score and 5-factor breakdown.
- `GET /api/train/{train_id}/explanation` — Returns auditable evidence items explaining ETA shifts.

## 3. Historical Replay Endpoints
- `GET /api/replay/{train_id}/journeys` — Returns available replay scenarios.
- `GET /api/replay/{train_id}/session` — Returns current replay simulation state and history.
- `POST /api/replay/{train_id}/step?delta=1` — Advances or rewinds replay simulation step.
- `POST /api/replay/{train_id}/jump?step_index=12` — Jumps directly to a station event.
- `POST /api/replay/{train_id}/reset` — Resets replay session to initial departure.

## 4. Benchmarking & Quality Endpoints
- `GET /api/model/evaluation` — Returns Baseline 1 vs Baseline 2 vs Proposed Model comparisons, regime breakdown, and empirical calibration curve.
- `GET /api/data-quality` — Returns Phase 0 data audit scorecard.
