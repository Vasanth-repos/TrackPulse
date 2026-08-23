# 🚆 Adaptive ETA Reliability & Forecasting System for Indian Coaching Trains
## Full Project Description, Tech Stack, Build Phases & Roadmap

---

# Part 1 — Project Description

## 1.1 What We're Building

A **reliability-aware, adaptive ETA forecasting layer** for Indian Railways coaching trains that sits on top of existing data infrastructure (NTES/Pravah) and existing forecasting research. Rather than producing a single point ETA, the system continuously outputs four coordinated signals per train, per upcoming station:

```
ETA            → point-in-time arrival forecast
Uncertainty    → statistically-derived prediction interval (how wide could the error be)
Reliability    → a separately computed, calibrated score (how much to trust this forecast right now)
Evidence       → data-supported reasons for significant changes (never invented causality)
```

## 1.2 The Problem in One Line

```
Current delay ≠ Future delay
```
A train delayed 24 minutes may recover, worsen, or diverge from historical behavior. Today's ETA (schedule + current delay + static recovery margin) gives a single number with no signal of how much to trust it — creating false precision that undermines passenger trust and operational planning.

## 1.3 The Four Questions the System Answers

| # | Question | Component |
|---|---|---|
| 1 | When will it arrive? | ETA prediction |
| 2 | How might the delay evolve across the remaining journey? | Delay trajectory forecasting |
| 3 | How uncertain is that prediction? | Quantile-based prediction interval |
| 4 | Can the current ETA still be trusted right now? | Reliability assessment |

## 1.4 Core Innovation Statement

**Adaptive ETA Reliability Management** — not a new prediction algorithm (ETA prediction, ML/DL, GNNs, and uncertainty-aware forecasting are all established research areas), but the integration of these proven components into a **deployment-oriented layer** that continuously monitors its own forecast quality and communicates trust, not just a number.

## 1.5 What We Are Explicitly Not Claiming

- Not the first railway ETA system, API, or ML model
- Not claiming no comparable capability exists anywhere — only that publicly visible services don't appear to offer a standardized reliability-aware interface combining these elements
- Not claiming feature importance proves causation
- Not claiming access to proprietary live signalling data unless demonstrably integrated
- Not claiming perfect prediction — claiming **calibrated, honest uncertainty**

## 1.6 Target Users & Interfaces

| User | Interface | What they see |
|---|---|---|
| Passengers | Simple app/display view | ETA, expected range, plain-language reliability ("High"/"Moderate"/"Low"), current status |
| Control room / operations staff | Dashboard | Full train list sortable by reliability (not just by delay), regime, delay trajectory, evidence for changes |
| Downstream systems (future) | REST API | Same prediction data, consumed by crew/platform/cleaning planning tools — **not built by us**, only enabled |

---

# Part 2 — Issues in the Current Solution (Consolidated & Verified)

## 2.1 What Actually Exists Today (Verified, Not Assumed)

| Layer | Confirmed reality |
|---|---|
| Official tracking | NTES (CRIS, since 2014) — near real-time status via web/app/display boards/139 helpline |
| Institutional API access | CRIS's **Project Pravah** already exposes 140+ APIs (NTES, PRS, FOIS, e-procurement) to 45+ B2B/B2C consumers, handling 1.25M calls/day — data access is **not** the gap |
| Consumer ETA apps | RailYatri (ML on historical patterns + crowdsourced GPS), ixigo (claimed near-100% accuracy, unverified/black-box) |
| Third-party developer APIs | RailRadar exposes live coordinates, GeoJSON routes, seat forecasts on top of NTES |
| Academic research (India-specific) | Classical ML (KNN, decision trees, RF) on regional IR data; a Kalman-Filter + GCN-LSTM ensemble validated on real IR **freight** data (MAPE ~19.5%); RSTGCN — a GCN forecasting **station-level average hourly delay** across all 4,735 IR stations (17 zones), released Oct 2025 |
| Global research maturity | Markov delay evolution, Bayesian-network explainability, LSTM/deep learning, heterogeneous GNNs for train-train interaction, uncertainty-aware simulation (AAAI 2026), and a standardized benchmark (RIDE, 2026) — this is a **mature, active field**, not a vacuum |

## 2.2 The Real Gaps (What's Actually Missing)

1. **ETA is a static, unadaptive number.** Current method = schedule + current delay + fixed recovery margin (the PS's own stated baseline) — doesn't learn or adjust per section/condition.
2. **No exposed uncertainty.** Every current tool — official or third-party — gives a single point estimate. None publish a statistically grounded confidence interval.
3. **No reliability signal.** Nothing tells the user *how much to trust* today's ETA versus yesterday's, or flags when its own recent predictions have been degrading.
4. **No evidence-based explanation.** No current tool tells a user or operator *why* an ETA just changed — only that it did.
5. **Prediction and operational decision-making are disconnected.** Research and industry both treat "predict the delay" and "use the delay for planning" as separate problems; nothing packages both for Indian **coaching (passenger)** trains specifically — RSTGCN, the closest research precedent, targets **freight/station-average** delay, not individual passenger-train ETA with operational packaging.
6. **Data-quality-aware confidence doesn't exist.** No tool reduces its stated confidence when its input data is stale or incomplete — most silently produce a confident-looking number regardless of input quality.

## 2.3 What This Means for Positioning

We are not filling a data-access vacuum (Pravah/NTES/RailRadar already solved that) and not inventing a new algorithm (decades of research exist). We are building the **missing reliability/trust layer** that turns already-available data and already-researched techniques into a deployable, honest, operationally useful signal — specifically packaged for Indian coaching trains, which existing India-specific research (freight-focused, station-average-focused) does not directly address.

---

# Part 3 — Technology Stack

## 3.1 Data & Machine Learning

| Component | Tool | Why |
|---|---|---|
| Data manipulation | Python, Pandas, NumPy | Standard, fast to iterate |
| Core forecasting model | XGBoost or LightGBM (quantile objective) | Gives point ETA + statistically derived lower/upper bounds in one model; avoids three-model complexity |
| Classical baselines | Scikit-learn (Linear Regression, Random Forest) | Required for the mandatory baseline comparison |
| Regime detection | Rule/threshold-based on historical delay distribution (Pandas/NumPy) | Explainable, fast to build; "learned thresholds" explicitly noted as future work |
| Optional deep learning | PyTorch (only if time permits, for a stretch LSTM comparison) | Not required for MVP — keep as a "future work" mention, not a dependency |

## 3.2 Backend & API

| Component | Tool | Why |
|---|---|---|
| API framework | FastAPI (Python) | Fast to build, auto-generates OpenAPI docs — good for judge-facing API demo |
| Data validation | Pydantic (built into FastAPI) | Enforces response schema (ETA, range, reliability, regime, evidence) |
| Database | PostgreSQL | Structured historical + replay data; reliable for tabular train/section data |
| Task/replay engine | Simple Python scheduler or async loop | Drives the historical-replay demo without needing production streaming infra |

## 3.3 Frontend

| Component | Tool | Why |
|---|---|---|
| Framework | React + TypeScript | Standard, fast for building two focused dashboards |
| Build tool | Vite | Fast dev/demo iteration |
| Charts | Recharts or Plotly | Delay trajectory, reliability-over-time, prediction interval visualization |
| Map (optional, control room) | Leaflet / Mapbox (only if time allows) | Visualizing train position — nice-to-have, not core |

## 3.4 Deployment & Demo Infrastructure

| Component | Tool | Why |
|---|---|---|
| Containerization | Docker (+ docker-compose) | One-command demo setup for judges |
| Hosting (if needed) | Any free-tier cloud (Render/Railway/local laptop demo) | Hackathon-appropriate, no need for heavy infra |

## 3.5 What We Deliberately Exclude From the Core Build

- Full Graph Neural Network implementation (mention in literature review only)
- Online/live model retraining (use historical replay instead)
- Generative AI / chatbot / LLM explanation layers
- Reinforcement learning, digital twins, computer vision
- Automated crew/platform/cleaning allocation logic (future downstream consumer of the API)
- Live signalling data integration (use NTES-derived/historical/replayed data, clearly labeled)

---

# Part 3B — Datasets Required & Sources

## 3B.1 Core Datasets Needed

| Dataset Type | What You Need It For | Priority |
|---|---|---|
| Train schedule/timetable | Scheduled arrival/departure per station, route sequence, distance | Essential |
| Historical actual running data (delays) | Ground truth for training — actual vs. scheduled arrival/departure | Essential |
| Station master data | Station codes, names, coordinates, zone | Essential |
| Section-level running time history | Per-section variability, recovery behavior | Essential |
| Weather data | External regime-shift signal | Useful, not blocking |
| Punctuality index (aggregate) | Sanity-check/benchmark your model against official reported punctuality | Nice-to-have |

## 3B.2 Verified Sources

### A. Kaggle (fastest to start with)
| Dataset | What it contains |
|---|---|
| "Indian Railways Train Delays Dataset 2025" (kaggle.com/datasets/naijilaji/indian-railways-passenger-train-delays-dataset) | Scraped delay patterns and punctuality across Indian train routes — most directly useful for your delay-prediction target variable |
| "Indian Railway Delay Dataset" (kaggle.com/datasets/vishwassrivastava1/indian-railway-delay-dataset) | Delay-focused dataset |
| "Indian Railway Schedule Dataset" (kaggle.com/datasets/dhanashrishirsath/railyatri-railway-schedule-dataset) | Train schedule data, RailYatri-sourced |
| "Indian Trains Schedule & Routes" (kaggle.com/datasets/rohan26x/indian-express-train-dataset) | Route/schedule data |
| "Indian Railways Time Table" (kaggle.com/datasets/harsh16/indian-railways-time-table-for-trains-available) | Official timetable, sourced from data.gov.in |

**Access:** free download via kaggle.com — requires a free Kaggle account + `kaggle datasets download` CLI or manual download.

### B. Government Open Data (most authoritative)
- **"Year wise Train Punctuality Index of Indian Railways"** — official Ministry of Railways data, hosted on Dataful (dataful.in/datasets/1204) — use as your evaluation benchmark/sanity check
- **data.gov.in — "Indian Railways Train Time Table"** (data.gov.in/catalog/indian-railways-train-time-table) — official train-wise departure/arrival times, route, distance, source/destination station, published by the Open Government Data (OGD) Platform India
- **Access:** free, typically no auth required, downloadable CSV/JSON via the data.gov.in catalog

### C. Community-Maintained / GitHub
- **datameet/railways** (github.com/datameet/railways) — community-collected data including station GeoJSON (coordinates, zone, state) and train route/schedule data with class availability, timings, duration
- **itzmeanjan/indian-railway** (github.com/itzmeanjan/indian-railway) — timetable dataset sourced from data.gov.in, cleaned for exploration
- **Access:** free, `git clone` — good supplementary source for station coordinates (useful for map visualization)

### D. Developer APIs (for live/near-live demo flavor)
- **RailRadar** (railradar.in/docs) — developer-first REST API for live train running status, PNR status, station arrival/departure boards, GeoJSON route geometry, seat availability forecasts, timetables — useful to supplement your historical dataset with a live-lookup call during the demo for realism
- **CRIS Pravah** (crisapis.indianrail.gov.in) — official institutional API gateway; likely requires registration/approval — treat as a "future integration" reference in your pitch rather than something to fully integrate within the hackathon window

### E. Weather Data
- **IMD (India Meteorological Department)** public APIs/data portal — historical and current weather by station/region
- Alternative: **OpenWeatherMap** free tier (easier auth, global coverage, sufficient for a hackathon demo)

## 3B.3 Realistic Sourcing Strategy

```
Primary training data:  Kaggle "Indian Railways Train Delays Dataset 2025"
                         + data.gov.in official timetable (cross-reference for accuracy)
Station metadata:       datameet/railways GeoJSON (coordinates, zone)
Benchmark/sanity check: Official Ministry of Railways punctuality index (Dataful)
Live demo flavor:       RailRadar API for one or two live train lookups during presentation
Weather (optional):     OpenWeatherMap (easier than IMD for hackathon speed)
```

**Caveat to state explicitly in your pitch:** scraped/Kaggle data quality varies — cross-validate a sample against the official data.gov.in timetable before trusting it as ground truth, and disclose this validation step to judges as evidence of rigor.

---

# Part 3C — In-Depth Pipeline Analysis

## Stage 1: Data Ingestion & Reconciliation
**What happens:** Pull the Kaggle delay dataset + data.gov.in timetable + datameet station metadata. Join them on train number and station code.
**Deep issue:** Different sources use inconsistent train number formats (5-digit vs. text names) and station code conventions. Build a normalization/mapping table as your first real engineering task — this silently breaks more hackathon pipelines than any modeling choice.
**Output:** One unified table: `train_id | station_code | scheduled_arrival | scheduled_departure | actual_arrival | actual_departure | distance_from_origin`

## Stage 2: Data Quality Layer
**What happens:** For every row, compute missing-field count, timestamp plausibility (arrival after departure of previous station, no negative running times), duplicate detection.
**Deep issue:** Scraped data often has silent duplicates or malformed timestamps around midnight rollovers (multi-day journeys crossing date boundaries) — the most common source of "impossible" negative delay values. Build an explicit date-rollover handler early.
**Output:** A `data_quality_score` per record, carried forward into the reliability engine (Phase 5) — not a throwaway step.

## Stage 3: Journey Reconstruction
**What happens:** Group cleaned records by `(train_id, journey_date)` and order by station sequence to reconstruct each train's full journey as a time-ordered path.
**Deep issue:** Long-distance trains spanning multiple days need journey_date to track correctly across midnight — if this breaks, your "long-horizon" evaluation scenario (your explicit differentiator) becomes meaningless.
**Output:** One row per (train, journey, station) with a clean sequential index — the backbone table everything else builds from.

## Stage 4: Section-Level Feature Engineering
**What happens:** For each consecutive station pair (a "section"), compute historical statistics across all journeys: median/mean running time, variance, historical delay distribution (percentiles), typical recovery amount.
**Deep issue:** Some sections will have very few historical journeys (sparse data), making statistics unreliable. Flag low-sample sections explicitly and either fall back to zone-level averages or exclude them from your pilot routes — this sparsity check should directly inform Phase 0 route selection.
**Output:** A `section_stats` table keyed by `(from_station, to_station)` — the most reused artifact in your entire pipeline.

## Stage 5: Operating-Regime Detection
**What happens:** Compare each train's current delay/behavior against its section's historical distribution: within 25th–75th percentile → Normal; beyond that but within historical range → Delayed; beyond the historical range entirely → Disrupted.
**Deep issue:** Global thresholds (one cutoff for the whole network) will misclassify busy urban sections (naturally higher "normal" delay) vs. quiet rural sections. Thresholds must be computed **per section**, not globally — a direct consequence of Stage 4.
**Output:** A `regime` label per prediction point, feeding into Stage 6 as a context feature.

## Stage 6: Feature Assembly for the Model
**What happens:** Assemble the full feature vector per prediction point: current delay, recent delay trend, train identity, current section stats, distance remaining, time-of-day, day-of-week, regime label, data-quality score.
**Deep issue:** Raw train ID as a categorical feature (thousands of unique values) will overfit or blow up the feature space with one-hot encoding. Use **target encoding** (average historical delay per train) or embed train type (Rajdhani/Express/Passenger) instead of raw train ID.
**Output:** Final training matrix, ready for Stage 7.

## Stage 7: Model Training (Quantile Regression)
**What happens:** Train XGBoost/LightGBM with quantile objectives (e.g., 0.1, 0.5, 0.9) to get lower bound, point estimate, and upper bound — the standard way to get a statistically grounded interval from a gradient-boosted model.
**Deep issue:** Independently trained quantile models can produce **quantile crossing** (the 0.1 prediction ends up higher than the 0.5 prediction). Add a simple post-processing sort/clip step so this never visibly breaks in front of judges.
**Output:** Trained model(s) producing `(lower, point, upper)` per prediction.

## Stage 8: Baseline Comparison
**What happens:** Compute Baseline 1 (schedule only) and Baseline 2 (schedule + current delay + recovery assumption) on the exact same held-out test set as your proposed model.
**Deep issue:** Evaluating on a slightly different test slice than the baselines (different date range or route subset) invalidates the comparison. Lock down **one single held-out test set** before touching any model and reuse it everywhere.

## Stage 9: Calibration Testing (Critical)
**What happens:** For your held-out test set, check what percentage of actual arrivals fell inside your stated 80% prediction interval — it should be close to 80%.
**Deep issue:** If badly miscalibrated (e.g., only 50% coverage), your quantile models likely lack sufficient training data per regime bucket, especially Disrupted (rare by definition). The honest fix is to **empirically widen the Disrupted-regime intervals** based on observed coverage rather than trusting raw model output — mentioning this correction is itself a strong credibility signal to judges.

## Stage 10: Reliability Score Computation
**What happens:** Combine (normalized, weighted-summed to 0–100): interval width, recent prediction error trend, data-quality score, regime stability.
**Deep issue:** Weighting these components is a design choice with no single correct answer — present it as "a first-pass weighted combination, validated by the Stage 9 calibration check," not "the optimal formula."

## Stage 11: Evidence Generation
**What happens:** A rule-engine (not generative text) mapping specific observed signals to pre-written evidence strings — e.g., abnormal section running time vs. historical 95th percentile → "Abnormal section running detected."
**Deep issue:** Keep this rule-based, not LLM-generated — an LLM explanation layer risks hallucinating causal claims exactly like the ones you've committed to avoiding.

## Stage 12: Replay Engine
**What happens:** Step through one full historical journey station-by-station; at each step, generate a prediction using only data available up to that point, then reveal the next actual station's outcome.
**Deep issue:** The most common bug is **data leakage** — accidentally letting the model see the actual outcome about to be "revealed." Explicitly split "known so far" vs. "ground truth to reveal" into separate objects in code, and test that replay at step N cannot access step N+1's actual values.

## Stage 13: API & Frontend Integration
**What happens:** FastAPI serves the replay-driven predictions; frontend polls/streams these as the demo "plays."
**Deep issue:** For a smooth live demo, pre-compute the full replay sequence and cache it rather than computing predictions live during the presentation — protects against a live inference failure in front of judges. State this is a demo-safety choice, not a production limitation.

## Summary: The Three Pipeline Risks That Matter Most
1. **Date-rollover bugs in multi-day journeys** (Stage 3) — silently corrupts your long-horizon evaluation, your explicit differentiator
2. **Global vs. per-section regime thresholds** (Stage 5) — the difference between a defensible and a naive-looking regime detector
3. **Calibration miscoverage, especially in the Disrupted regime** (Stage 9) — this is your core scientific claim; if wrong and undiscovered, a sharp judge checking the numbers will find it before you do

---

# Part 4 — Build Phases

## Phase 0 — Problem & Data Scoping (Day 0, before coding)
- Identify 1–3 candidate historical datasets (NTES scrape / Kaggle IR delay datasets)
- Verify exactly which fields are actually available (train ID, timestamps, station sequence, delay, distance — confirm before designing features around assumed fields)
- Choose pilot route(s) **based on what the data actually supports**, not an idealized split
- **Deliverable:** a data availability audit — what you have vs. what the architecture assumes

## Phase 1 — Data Pipeline
- Clean and reconstruct full journeys per train (station sequence, timestamps, actual vs. scheduled)
- Build section-level table: per section — median/mean running time, variance, historical delay distribution, typical recovery
- **Deliverable:** a clean, queryable historical dataset + section statistics table

## Phase 2 — Baselines
- Baseline 1: Scheduled ETA only
- Baseline 2: Schedule + current delay + recovery assumption (the PS's own stated current method — must match this accurately, not a weakened strawman)
- Compute MAE/RMSE for both on held-out historical data
- **Deliverable:** baseline accuracy numbers to beat — this is your evidence anchor for the whole pitch

## Phase 3 — Core Forecasting Model
- Feature set: current delay, recent delay trend, train identity, current section, distance remaining, historical section stats, time-of-day/day-of-week, regime tag, data-quality flag
- Train XGBoost/LightGBM with quantile loss → point ETA + lower/upper bound
- Compare against Phase 2 baselines
- **Deliverable:** working model + accuracy comparison table (baseline vs. proposed)

## Phase 4 — Operating-Regime Detector
- Threshold-based classification: Normal / Delayed / Disrupted, derived from historical delay distribution per section
- Feed regime as a context feature back into the Phase 3 model (not a separate model per regime)
- **Deliverable:** regime tagging function integrated into the feature pipeline

## Phase 5 — Reliability Engine
- Compute reliability score from: interval width, recent prediction error trend, data freshness/quality, regime stability, historical section variability
- Normalize to 0–100 scale
- **Run offline calibration**: for held-out historical cases, check whether your stated X% interval actually contains outcomes X% of the time (prediction interval coverage) — this is the single most important validation step
- **Deliverable:** reliability scoring function + a calibration chart (your strongest evidence slide)

## Phase 6 — Evidence-Based Explanation
- Rule-based, not free-text generative: map specific observed signals (preceding-train delay in data, abnormal section running time vs. historical) to specific evidence statements
- Explicitly avoid unsupported causal language ("congestion caused this") unless that signal is actually present in the data
- **Deliverable:** evidence-generation function tied to specific, auditable input signals

## Phase 7 — Historical Replay Engine
- Replay a historical journey chronologically as if live: at each timestamp, generate a prediction, then reveal the next actual observation, compute error, update reliability
- This is what powers your live demo — no real-time production infrastructure needed
- **Deliverable:** a replay script that can drive the full normal → disruption → recovery demo narrative

## Phase 8 — API Layer
- Endpoints: `/train/{id}/eta`, `/train/{id}/trajectory`, `/train/{id}/reliability`, `/train/{id}/explanation`, `/train/{id}/stations`
- All endpoints served from the same underlying prediction service
- **Deliverable:** working FastAPI service with auto-generated docs (Swagger UI doubles as a judge-facing artifact)

## Phase 9 — Frontend Dashboards
- Passenger view: ETA, range, plain-language reliability, status — minimal, no ML jargon
- Control-room dashboard: sortable table (train, ETA, range, reliability, regime), delay-trajectory chart, evidence panel
- **Deliverable:** two working UI views consuming the live/replayed API

## Phase 10 — Evaluation & Pitch Assembly
- Final accuracy/reliability comparison table across normal / moderate-delay / severe-delay / long-horizon scenarios
- Assemble the 90-second demo narrative (normal → disruption → recovery)
- Write the non-claims slide and the positioning statement
- **Deliverable:** pitch deck + live demo script + evaluation results table

---

# Part 5 — Roadmap (Hackathon Timeline, ~36–48 hrs typical SIH format)

| Time block | Focus | Owner (suggested) |
|---|---|---|
| Hr 0–4 | Phase 0–1: data scoping, cleaning, journey reconstruction | Data/ML lead |
| Hr 4–10 | Phase 2–3: baselines + core quantile model | Data/ML lead |
| Hr 10–16 | Phase 4–5: regime detection + reliability engine + offline calibration | Data/ML lead + backend dev |
| Hr 16–22 | Phase 6–7: evidence explanation + replay engine | ML lead |
| Hr 16–26 (parallel) | Phase 8: API layer | Backend dev |
| Hr 20–32 (parallel) | Phase 9: frontend dashboards (start once API contract is stable) | Frontend dev |
| Hr 30–36 | Integration testing: full replay demo end-to-end | Whole team |
| Hr 36–42 | Phase 10: evaluation table, pitch deck, demo rehearsal | PM/research lead + whole team |
| Hr 42–48 | Buffer: bug fixes, demo polish, Q&A prep against the stress-test question list | Whole team |

## Post-Hackathon Roadmap (if pursued beyond SIH, for your pitch's "future scope" slide)

| Stage | Milestone |
|---|---|
| Near-term | Live NTES/Pravah integration replacing historical replay; learned (not threshold) regime detection |
| Mid-term | Pilot deployment on 1–2 real zones/divisions in partnership with a railway division; live calibration monitoring |
| Long-term | Full API productization for crew/platform/cleaning allocation systems to consume; expansion toward network-wide propagation modeling (building on, not duplicating, research like RSTGCN) |

---

# Part 6 — Suggested Team Roles

| Role | Responsibility |
|---|---|
| ML/Data lead | Phases 0–7 |
| Backend developer | Phase 8, supports Phase 5/7 integration |
| Frontend developer | Phase 9 |
| Research/PM/presentation lead | Literature positioning, non-claims framing, pitch deck, Q&A prep, Phase 10 |

---

# Part 7 — Success Criteria (What "Done" Looks Like for the Demo)

- [ ] A single replayed journey demonstrably transitions Normal → Disrupted → Recovery live in front of judges
- [ ] Reliability score visibly changes in sync with the regime and is backed by an offline calibration chart, not an arbitrary number
- [ ] Evidence statements are drawn from real input signals, never invented causal claims
- [ ] A baseline-vs-proposed accuracy table exists with real numbers from your own experiments
- [ ] The API is live and demoable (Swagger docs open in front of judges)
- [ ] The pitch explicitly states what is *not* claimed, before a judge has to ask
