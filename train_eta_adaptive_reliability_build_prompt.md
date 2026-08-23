# Adaptive ETA Reliability & Forecasting System for Indian Coaching Trains

## Master Build Prompt

You are a senior full-stack engineer and machine-learning engineer.

Build a production-quality prototype for the following SIH 2026 problem:

**Title:** Adaptive ETA Reliability & Forecasting System for Indian Coaching Trains

---

## 1. Core Problem

Indian Railways already has train-running data and existing systems for providing current train status. The problem is not simply accessing train data.

The problem is forecasting where a coaching train will actually arrive in the future when its current delay may recover, increase, or behave differently from historical patterns.

The system must therefore provide:

1. Predicted ETA at upcoming stations
2. Final destination ETA
3. Statistically derived ETA prediction interval
4. ETA reliability score
5. Current operating regime
6. Evidence-based reasons for major prediction changes
7. Delay trajectory across upcoming stations
8. Continuous reliability updates as new observations become available

**Important:**

- Do NOT claim that this system is the first ETA prediction system.
- Do NOT claim that railway APIs do not exist.
- Do NOT claim that existing passenger ETA applications do not use ML.
- Position the system as a reliability-aware intelligence layer built on top of existing railway data.

---

## 2. Core Differentiator

The central concept is:

> **"Don't just predict the ETA. Predict how reliable that ETA currently is."**

### Normal condition

```text
ETA: 18:42
Expected range: 18:35–18:50
Reliability: 87/100
Regime: Normal
```

### Disrupted condition

```text
ETA: 19:15
Expected range: 18:55–19:40
Reliability: 42/100
Regime: Disrupted

Evidence:
- Abnormal section running detected
- Current delay increasing
- Expected recovery reduced
```

The reliability score must NOT be an arbitrary UI number. It must be derived from measurable factors and evaluated against historical outcomes.

---

## 3. Important Scope Decisions

Use **ONE primary forecasting model**.

Do NOT create three independently trained models for:

- Normal
- Delayed
- Disrupted

Instead:

```text
Operating regime → feature/context
                     ↓
              Single forecasting model
                     ↓
          Point ETA + quantile interval
```

Recommended model:

- XGBoost or LightGBM

Use quantile regression to produce prediction intervals.

Example:

```text
Lower ETA: 18:35
Point ETA: 18:42
Upper ETA: 18:50
```

Do NOT use arbitrary windows such as `ETA ± 10 minutes`.

---

## 4. Data Requirements

The application must support historical datasets containing, where available:

### Required

- `train_id`
- `journey_date`
- `station`
- `station_sequence`
- `scheduled_arrival`
- `scheduled_departure`
- `actual_arrival`
- `actual_departure`

### Useful

- `train_type`
- `train_name`
- `latitude`
- `longitude`
- `distance`
- `section`
- `current_delay`
- `speed`
- `weather`
- `day_of_week`
- `month`
- `time_of_day`

Do NOT assume that all fields exist.

The application must allow the dataset schema to be configured/mapped.

Before model training:

1. Inspect the dataset.
2. Display detected columns.
3. Allow mapping of dataset columns to the required schema.
4. Report missing mandatory fields.
5. Report missing optional fields.
6. Show number of journeys.
7. Show number of trains.
8. Show number of stations.
9. Show date range.
10. Show missing-value statistics.

If the uploaded dataset cannot support a particular feature, disable that feature gracefully rather than generating fake data.

**NEVER fabricate railway data.**

---

## 5. Journey Reconstruction

Build a preprocessing pipeline that reconstructs individual journeys.

For each train journey:

```text
Train
 ↓
Station 1
 ↓
Station 2
 ↓
Station 3
 ↓
...
 ↓
Destination
```

Sort observations chronologically.

Calculate:

- delay at each station
- section running time
- station dwell time
- delay change between stations
- delay recovery
- remaining distance
- remaining stations
- historical section statistics

A journey should be uniquely identified using appropriate fields such as:

```text
train_id + journey_date
```

Do not assume this is always sufficient. Inspect the dataset.

---

## 6. Section-Level Features

Represent the journey as sections:

```text
Station A
 ↓
Section A-B
 ↓
Station B
```

For every section calculate historical statistics where sufficient data exists:

- median running time
- mean running time
- standard deviation
- percentile running time
- historical delay distribution
- historical recovery behavior
- train-specific behavior
- time-of-day behavior
- day-of-week behavior
- seasonal behavior

Avoid statistics based on insufficient samples.

Expose sample counts in the analysis.

---

## 7. Operating Regime Detector

Implement three regimes:

- `NORMAL`
- `DELAYED`
- `DISRUPTED`

The first implementation should use transparent statistical rules.

### NORMAL

Current behavior is within historical expected variation.

### DELAYED

Train has meaningful delay but behavior remains historically plausible.

### DISRUPTED

Train behavior deviates significantly from historical behavior.

Possible signals:

- abnormal section running time
- unusually rapid delay increase
- unexpected halt if detectable
- extreme delay
- unusually high section variability

Do NOT claim a causal reason unless the dataset actually contains evidence for it.

**Valid:**

> "Abnormal section running detected."

**Valid:**

> "Preceding-train delay detected."

**Invalid unless supported:**

> "Congestion caused the delay."

---

## 8. ETA Forecasting

Build a baseline first.

### Baseline 1

```text
Scheduled ETA
```

### Baseline 2

```text
Scheduled ETA + current delay + available recovery assumptions
```

Then build the proposed model.

### Proposed Model

Section-aware ML forecasting using XGBoost or LightGBM.

Possible features:

- current delay
- recent delay trend
- current section
- train identity
- train type
- section historical running time
- section variability
- historical recovery
- station dwell behavior
- remaining distance
- remaining stations
- time of day
- day of week
- month/season
- operating regime
- data freshness
- available weather information

Do not include features that would cause future-data leakage.

---

## 9. Quantile ETA Prediction

The model must produce:

- point ETA
- lower prediction bound
- upper prediction bound

Prefer quantile regression.

Example:

```text
Prediction:
18:42

10th percentile:
18:35

90th percentile:
18:50
```

Therefore:

```text
Expected arrival:
18:35–18:50
```

Store both the absolute timestamp and the predicted delay.

---

## 10. Delay Trajectory

Do not predict only the final destination.

For every upcoming station, generate:

- predicted arrival
- predicted delay
- lower bound
- upper bound
- reliability

Example:

```text
Station A → +22 min
Station B → +19 min
Station C → +28 min
Station D → +24 min
Destination → +26 min
```

This should be visualized as a timeline/trajectory chart.

---

## 11. Reliability Engine

Create a reliability score from measurable factors.

Possible components:

- prediction uncertainty
- recent prediction error
- data freshness
- operating regime
- forecast horizon
- section historical variability
- prediction stability

Normalize the result to `0–100`.

Example:

```text
0–39:
LOW

40–69:
MEDIUM

70–100:
HIGH
```

However, these thresholds should be configurable.

Do NOT hard-code the claim that `87` means "87% probability of being correct."

Reliability score and prediction probability are different concepts.

Explain this distinction in the UI.

---

## 12. Reliability Calibration

The system must evaluate whether the reliability mechanism actually works.

For prediction intervals, calculate:

- interval coverage
- interval width
- calibration error

Example:

```text
Requested coverage: 80%
Observed coverage: 78%
```

Also calculate:

- MAE
- RMSE
- median absolute error
- percentage within ±5 minutes
- percentage within ±10 minutes

Evaluate separately for:

- normal journeys
- moderate delays
- severe delays
- short forecast horizon
- long forecast horizon

---

## 13. Time-Safe Train/Test Split

This is critical.

Do NOT randomly split individual station observations from the same journey.

Prefer chronological splitting.

Example:

```text
2019–2023 → training
2024 → validation
2025 → test
```

Adapt this according to the actual dataset date range.

Prevent:

- future-data leakage
- same-journey leakage
- target leakage
- use of future station information

Document the split strategy in the application.

---

## 14. Historical Replay Engine

Build a replay engine to simulate real-time operation using historical journeys.

The replay must reveal information chronologically.

Example:

```text
10:05
→ system receives Station A state
→ predicts B/C/D

10:52
→ actual Station B observation becomes available
→ update prediction

11:46
→ actual Station C becomes available
→ update again
```

This must NOT simply load the complete journey and expose future information.

The replay engine should behave as if the system is receiving observations in real time.

### Controls

- Play
- Pause
- Restart
- Speed 1x
- Speed 2x
- Speed 5x
- Select journey
- Jump to event

---

## 15. Dynamic Reliability Update

As replay progresses:

```text
Prediction
 ↓
Actual observation
 ↓
Prediction error
 ↓
Error trend
 ↓
Reliability update
```

If recent prediction error increases:

> Reliability decreases.

If the train returns to predictable behavior:

> Reliability may increase.

Do not implement full online model retraining for the MVP.

Demonstrate recalibration through historical replay.

---

## 16. Evidence-Based Explanations

For every significant ETA change, generate a small list of evidence-based factors.

Examples:

- Current delay increased by 8 minutes
- Section running time above historical median
- Current section variability is high
- Historical recovery expectation reduced
- Data update is stale
- Preceding-train delay detected

Do NOT use an LLM to invent explanations.

The explanation should come from actual model features/statistics.

If feature attribution is implemented, use SHAP or a similarly appropriate technique, but clearly label feature influence as "model evidence", not causal explanation.

---

## 17. Data Quality Layer

Calculate:

- last update timestamp
- data freshness
- missing fields
- invalid timestamps
- duplicate records
- impossible station sequences
- abnormal values

Example:

```text
Data quality:
HIGH

Last update:
8 seconds ago

Missing fields:
0

Historical coverage:
Strong
```

If data quality is poor:

- reduce reliability
- show warning
- do not fabricate missing values without a documented preprocessing method

---

## 18. Backend

Use:

- Python
- FastAPI
- Pandas
- NumPy
- Scikit-learn
- XGBoost or LightGBM
- PostgreSQL

Use a clean modular architecture:

```text
backend/
    app/
        api/
        models/
        services/
        ml/
        preprocessing/
        replay/
        reliability/
        database/
        config/
```

Separate:

- data ingestion
- preprocessing
- feature engineering
- model inference
- reliability
- replay
- API

Do not put all logic into one Python file.

---

## 19. API

Implement REST endpoints such as:

```text
GET /api/trains

GET /api/train/{train_id}

GET /api/train/{train_id}/eta

GET /api/train/{train_id}/trajectory

GET /api/train/{train_id}/reliability

GET /api/train/{train_id}/explanation

GET /api/train/{train_id}/replay

GET /api/stations

GET /api/metrics

GET /api/model/evaluation
```

Use Pydantic schemas.

Return consistent JSON responses.

---

## 20. Frontend

Use:

- React
- TypeScript
- Vite

Build a professional railway control dashboard.

### Main pages

1. Dashboard
2. Train details
3. Live/replay view
4. Prediction analysis
5. Model evaluation
6. Data quality
7. Settings

---

## 21. Main Dashboard

Show:

- Total monitored trains
- Normal trains
- Delayed trains
- Disrupted trains
- Low-reliability predictions

Train table:

```text
Train
Current station
Current delay
ETA
Expected range
Reliability
Regime
```

Example:

```text
126XX | Station A | +24 | 18:42 | 18:35–18:50 | 87 | Delayed
```

Use clear visual hierarchy.

Do not overuse colors.

---

## 22. Train Details Page

Show:

- Train number
- Train name
- Current location
- Current delay
- Current regime
- ETA
- Prediction interval
- Reliability
- Data quality

Then:

- Delay trajectory chart
- Station-by-station ETA table
- Evidence/reasons
- Historical comparison

---

## 23. Replay Page

Create a highly visual replay interface.

Show:

- train moving along route
- current station
- current delay
- predicted ETA
- ETA interval
- reliability
- regime

When disruption occurs, visibly show:

```text
Normal
 ↓
Disrupted
 ↓
ETA changes
 ↓
Range widens
 ↓
Reliability decreases
```

When recovery occurs:

```text
Disrupted
 ↓
Normal/Delayed
 ↓
Range narrows
 ↓
Reliability increases
```

This is the primary hackathon demonstration.

---

## 24. Model Evaluation Page

Display actual measured results.

Compare:

```text
Scheduled ETA
vs
Schedule + Current Delay
vs
Proposed Adaptive ETA
```

Metrics:

- MAE
- RMSE
- Median Absolute Error
- Within ±5 min
- Within ±10 min
- Prediction interval coverage
- Average interval width

Break down by:

- Normal
- Moderate Delay
- Severe Delay
- Forecast Horizon

Never fabricate metric values.

If training has not been completed, show:

> "Not evaluated yet"

---

## 25. Map

If latitude/longitude data exists, integrate a map.

Show:

- route
- stations
- current train location
- upcoming stations
- delay
- reliability

Use Leaflet or another lightweight mapping library.

If geographic data does not exist, use a route/timeline visualization instead.

Do not fabricate GPS coordinates.

---

## 26. Database

Use PostgreSQL for:

- trains
- stations
- routes
- journeys
- journey_events
- sections
- predictions
- prediction_intervals
- reliability_scores
- replay_sessions
- model_metrics
- audit_logs

Use proper indexes.

Do not over-engineer database relationships before understanding the dataset.

---

## 27. Model Versioning

Store:

- model name
- model version
- training date
- training data range
- features used
- metrics
- hyperparameters

Every prediction should be traceable to a model version.

---

## 28. Testing

Implement:

### Unit tests

- delay calculation
- journey reconstruction
- section feature generation
- reliability calculation
- interval calculation

### Integration tests

- dataset → model
- model → API
- replay → prediction update

### API tests

- endpoint status
- schema validation
- invalid train ID
- missing data

### ML validation

- leakage check
- chronological split
- baseline comparison

---

## 29. Security

Implement basic production-quality security:

- environment variables
- no hard-coded secrets
- input validation
- CORS configuration
- authentication structure
- rate limiting where appropriate

Do not claim railway production certification.

---

## 30. Demo Data

If no suitable dataset is supplied, do NOT fabricate realistic-looking railway results and present them as actual data.

Instead:

1. Create a clearly labelled synthetic demo dataset only for UI development.
2. Clearly label it `Synthetic Demo Data`.
3. Keep the architecture compatible with real historical data.
4. Do not use synthetic data for final model-performance claims.

---

## 31. Development Strategy

Build in this order:

### Phase 1
Dataset inspection and schema mapping

### Phase 2
Journey reconstruction

### Phase 3
Baseline ETA calculations

### Phase 4
Feature engineering

### Phase 5
XGBoost/LightGBM ETA model

### Phase 6
Quantile prediction

### Phase 7
Regime detection

### Phase 8
Reliability engine

### Phase 9
Historical replay

### Phase 10
FastAPI backend

### Phase 11
React dashboard

### Phase 12
Evaluation and testing

### Phase 13
Demo polish

Do not build the frontend first and invent the ML outputs later.

---

## 32. Important ML Rules

Avoid target leakage.

Never use:

- future station arrival
- future delay
- final journey delay
- future section information unavailable at prediction time

when generating a prediction for the current timestamp.

All features must represent information that would genuinely be available at prediction time.

Document every feature's availability time.

---

## 33. Important Product Rules

Do not add unnecessary features such as:

- chatbot
- generative AI
- passenger sentiment analysis
- platform optimization
- crew scheduling
- reinforcement learning
- GNN
- digital twin

unless the core ETA + reliability system is already working.

The project must remain centered on the SIH problem:

> **Dynamic and reliable ETA forecasting for coaching trains.**

---

## 34. Final User Experience

The most important screen should communicate:

```text
--------------------------------------------------

TRAIN 126XX

Current:
Station B

Current delay:
+24 min

Predicted ETA:
18:42

Expected arrival:
18:35 – 18:50

Reliability:
87/100

Operating regime:
DELAYED

Why the forecast changed:
• Section running time above historical range
• Recovery expectation reduced

--------------------------------------------------
```

Then show:

```text
Delay trajectory:

Station C   +21 min
Station D   +25 min
Station E   +27 min
Destination +26 min
```

---

## 35. Final Demo Scenario

The final demo must tell one clear story.

### STEP 1 — Normal

Train is running normally.

- ETA is stable.
- Range is narrow.
- Reliability is high.

### STEP 2 — Abnormal behavior

Historical replay introduces abnormal running behavior.

System detects deviation.

```text
Regime:
NORMAL → DISRUPTED
```

### STEP 3 — Forecast update

System updates ETA.

Prediction interval widens.

Reliability decreases.

### STEP 4 — Recovery

Train begins recovering.

Prediction errors decrease.

Reliability increases.

Prediction interval narrows.

### STEP 5 — Model evaluation

Show comparison:

```text
Scheduled ETA
Schedule + Current Delay
Proposed Adaptive ETA
```

The jury must be able to understand the innovation without seeing the source code.

---

## 36. Final Project Positioning

Use this as the product description:

> **"An adaptive ETA forecasting and reliability system for Indian coaching trains that builds on existing railway data infrastructure to predict arrival times, estimate statistically grounded uncertainty, detect changing operating conditions, monitor prediction reliability, and continuously update forecasts as new train-running observations become available."**

### Core message

> **"Don't just predict the ETA. Predict how reliable that ETA currently is."**

---

## 37. First Task

Before generating the entire application:

1. Inspect the available project files.
2. Inspect the available dataset.
3. Identify the exact dataset schema.
4. Determine whether individual journeys can be reconstructed.
5. Determine whether actual station-level timestamps exist.
6. Determine which proposed features are actually available.
7. Produce a **DATASET FEASIBILITY REPORT**.
8. Produce a **DEVELOPMENT PLAN** based on the actual dataset.
9. Only then begin implementation.

Do not assume the dataset satisfies the requirements.

If the dataset is insufficient for the proposed system, clearly identify exactly which requirement fails and recommend the smallest architecture modification needed.

**Do not fabricate missing railway data.**

**Start with the dataset audit.**
