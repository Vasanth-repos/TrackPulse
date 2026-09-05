# TrackPulse --- SIH26028 Dynamic ETA & Multi-Train Delay Intelligence

## Complete Prototype Implementation Specification

> **Purpose:** This document is the implementation contract for building
> the TrackPulse prototype for Smart India Hackathon Problem Statement
> **SIH26028 --- Dynamic Forecast of Expected Time of Arrival (ETA) for
> Coaching Trains**.
>
> **Primary goal:** Train the historical delay intelligence model in
> Kaggle using the official competition dataset plus the project's
> railway datasets, then build a deployable web prototype that
> continuously estimates train ETA, uncertainty, reliability, delay
> propagation across multiple incoming/outgoing trains,
> passenger-specific recommendations, and evidence-based reasoning.
>
> **Deployment target:** Vercel for the final demonstration.
>
> **Important:** Do not claim access to live Indian Railways/RTIS/PNR
> systems unless an authorized API/feed is actually available. For the
> prototype, use replayed/simulated live movement and mock adapters
> where necessary. The architecture must make replacement with
> authorized live APIs possible without redesigning the core system.

------------------------------------------------------------------------

# 1. PRODUCT VISION

TrackPulse is not just a train-delay classifier.

It is a **dynamic, uncertainty-aware railway ETA and delay-propagation
platform**.

The system combines:

1.  Historical train-delay behaviour.
2.  Train schedules and station/network structure.
3.  Train movement history.
4.  Section-wise running-time behaviour.
5.  Operational features available in the datasets.
6.  Current/replayed train state.
7.  Incoming-to-outgoing train dependencies.
8.  Delay propagation.
9.  Passenger requirements.
10. ETA uncertainty and reliability.
11. Evidence-based reasoning.
12. What-if simulation.

The final product should answer:

> **"Given what we know right now, when is this train likely to arrive,
> how reliable is that prediction, why is it changing, and which other
> trains/passengers may be affected?"**

------------------------------------------------------------------------

# 2. CORE USER SCENARIOS

## 2.1 Passenger

Passenger provides:

-   Source
-   Destination
-   Journey date
-   Preferred departure window
-   Maximum acceptable delay
-   Optional connection requirement
-   Optional priority

TrackPulse returns:

-   Recommended train
-   Current status
-   Dynamic ETA
-   P10/P50/P90 ETA
-   Predicted delay
-   Reliability
-   Delay risk
-   Reason
-   Connection risk
-   Alternative trains

------------------------------------------------------------------------

## 2.2 PNR / Button Phone

For a prototype:

``` text
PNR
 ↓
PNR adapter
 ↓
Train + journey information
 ↓
TrackPulse ETA engine
 ↓
Passenger-specific result
 ↓
SMS adapter
```

The PNR adapter must have two implementations:

### Prototype

`MockPNRProvider`

Uses a local JSON/database table.

### Production

`AuthorizedPNRProvider`

Calls an officially authorized railway service/API.

Never scrape or reverse-engineer an unauthorized private service.

Example response:

``` text
PNR: ********90
Train: 12675
From: MAS
To: CBE

Current Delay: +18 min

Predicted Arrival:
20:42–20:55

Most Likely:
20:48

Reliability:
87%

Connection Risk:
LOW
```

------------------------------------------------------------------------

# 3. SYSTEM ARCHITECTURE

``` text
                         DATA LAYER
 ┌──────────────────────────────────────────────────────────┐
 │ Kaggle Indian Railways Dataset                           │
 │ ir_train.csv / ir_test.csv / dictionary                 │
 │                                                          │
 │ Project Railway Datasets                                 │
 │ etrain_delays.csv                                       │
 │ EXP-TRAINS.json                                         │
 │ PASS-TRAINS.json                                       │
 │ SF-TRAINS.json                                         │
 │ stations.json                                           │
 │ Trains schedule.csv                                     │
 │ trains.csv                                              │
 │ trains.json                                              │
 │ trains_db_hbfs.csv                                      │
 │ is_wise_train_detail_03082015_v1.csv                   │
 └─────────────────────────┬────────────────────────────────┘
                           ↓
                  DATA VALIDATION
                           ↓
                  NORMALIZED DATA
                           ↓
               FEATURE ENGINEERING
                           ↓
        ┌──────────────────┴──────────────────┐
        ↓                                     ↓
 HISTORICAL ML MODEL                  RAILWAY NETWORK MODEL
 LightGBM                              Train/station graph
        │                                     │
        └──────────────────┬──────────────────┘
                           ↓
                  DYNAMIC ETA ENGINE
                           ↓
              ┌────────────┼────────────┐
              ↓            ↓            ↓
             P10          P50          P90
              │            │            │
              └────────────┼────────────┘
                           ↓
                 RELIABILITY ENGINE
                           ↓
                 REASONING ENGINE
                           ↓
                DELAY PROPAGATION
                           ↓
                USER REQUIREMENT
                     ENGINE
                           ↓
       ┌───────────────────┼────────────────────┐
       ↓                   ↓                    ↓
 Passenger Web       Railway Dashboard     SMS/PNR
       ↓                   ↓                    ↓
                    VERCEL DEPLOYMENT
```

------------------------------------------------------------------------

# 4. RECOMMENDED TECH STACK

## Frontend

-   Next.js
-   React
-   TypeScript
-   Tailwind CSS
-   Recharts
-   Leaflet / React Leaflet
-   Lucide React

## Backend / API

Preferred:

-   Next.js API routes / route handlers
-   TypeScript

For Python ML inference where required:

-   Python Vercel Function
-   FastAPI-compatible service structure
-   LightGBM
-   Pandas only where necessary

If Python dependency packaging becomes problematic on Vercel, keep the
same API contract and deploy the inference service using a
Vercel-supported Python/container service. The frontend must never
depend on the training notebook.

## Machine Learning

-   Python
-   Pandas
-   NumPy
-   Scikit-learn
-   LightGBM
-   SHAP
-   Joblib

Optional:

-   Optuna
-   scipy
-   calibration tools

## Database

Recommended:

-   PostgreSQL / Supabase PostgreSQL

Prototype alternative:

-   SQLite locally
-   JSON seed files

Production-style Vercel deployment:

-   Supabase PostgreSQL

## Cache / Live state

Optional:

-   Upstash Redis

Do not make Redis mandatory for the first prototype.

## Training

-   Kaggle Notebook
-   Kaggle GPU is not required for LightGBM.
-   Use CPU efficiently with multiple threads.

## Deployment

-   Vercel
-   GitHub
-   Environment variables
-   Optional Supabase
-   Optional Upstash Redis

------------------------------------------------------------------------

# 5. DATASETS

The project currently has these datasets/files:

``` text
etrain_delays.csv
EXP-TRAINS.json
ir_data_dictionary.csv
ir_sample_submission.csv
ir_test.csv
ir_train.csv
is_wise_train_detail_03082015_v1.csv
part-00000-...
PASS-TRAINS.json
SF-TRAINS.json
stations.json
Trains schedule.csv
trains.csv
trains.json
trains_db_hbfs.csv
```

Do not assume every file should be merged directly.

First create a dataset inventory.

------------------------------------------------------------------------

# 6. DATASET ROLE MAPPING

## 6.1 Kaggle dataset

### `ir_train.csv`

Primary supervised ML training source.

It contains the historical target:

``` text
is_delayed
```

The Kaggle competition contains approximately 1.5 million training
journey records and 375,000 test records.

Use this dataset primarily for:

-   baseline delay prediction
-   historical behaviour
-   risk probability
-   feature importance
-   model validation

Do NOT treat it alone as the complete dynamic ETA dataset.

------------------------------------------------------------------------

## 6.2 `ir_test.csv`

Use only for Kaggle-style prediction/submission.

Do not use test target information for training.

Do not merge future information from the test set into historical
features.

------------------------------------------------------------------------

## 6.3 `ir_data_dictionary.csv`

Use this to automatically document:

-   feature names
-   feature types
-   meanings
-   availability

The training notebook should load this file and print a feature report.

------------------------------------------------------------------------

## 6.4 `etrain_delays.csv`

Inspect and normalize.

Potential role:

-   historical delay patterns
-   station/train delay history
-   route delay behaviour
-   additional validation

Do not merge until keys and timestamp semantics are verified.

------------------------------------------------------------------------

## 6.5 `stations.json`

Use for:

-   station master
-   station code → name
-   latitude
-   longitude
-   zone
-   map display
-   route graph
-   distance calculation
-   station categories

Create normalized table:

``` text
stations
---------
station_code
station_name
latitude
longitude
state
zone
```

------------------------------------------------------------------------

## 6.6 `Trains schedule.csv`

Potentially the most important non-Kaggle source for the network layer.

Use for:

-   train schedule
-   source
-   destination
-   intermediate stations
-   scheduled arrival
-   scheduled departure
-   stop sequence
-   route structure

Normalize to:

``` text
train_id
station_code
stop_sequence
scheduled_arrival
scheduled_departure
```

------------------------------------------------------------------------

## 6.7 `trains.csv`

Inspect for:

-   train metadata
-   train number
-   train name
-   source
-   destination
-   train type

Use as train master if it contains reliable identifiers.

------------------------------------------------------------------------

## 6.8 `trains.json`

Use as an additional train metadata source if it contains fields not
present in `trains.csv`.

Do not duplicate records.

Create one canonical train table.

------------------------------------------------------------------------

## 6.9 `EXP-TRAINS.json`

Likely useful for train category/type.

Use only after schema inspection.

------------------------------------------------------------------------

## 6.10 `PASS-TRAINS.json`

Likely useful for passenger-train classification.

------------------------------------------------------------------------

## 6.11 `SF-TRAINS.json`

Likely useful for Superfast classification.

------------------------------------------------------------------------

## 6.12 `trains_db_hbfs.csv`

Inspect carefully.

Potential use:

-   train master
-   route metadata
-   station sequence
-   historical railway information

Do not assume `train_id` has the same meaning as another file until
validated.

------------------------------------------------------------------------

## 6.13 `is_wise_train_detail_03082015_v1.csv`

This appears to be a detailed historical railway movement/schedule
dataset.

Potential use:

-   train-wise historical running pattern
-   station sequence
-   scheduled/actual timings if present
-   sectional running time

Because this file may represent an older period, do not blindly merge it
with modern Kaggle records.

It can be used as:

1.  Historical route/schedule intelligence.
2.  Sectional running-time reference.
3.  Network topology reference.

------------------------------------------------------------------------

## 6.14 `part-00000-...`

Inspect schema before assigning a role.

If it is a Spark-generated partition:

-   identify original dataset
-   combine partitions if they belong together
-   remove duplicate rows
-   preserve source metadata

------------------------------------------------------------------------

# 7. FIRST KAGGLE NOTEBOOK: DATA AUDIT

Create:

``` text
01_data_audit.ipynb
```

The notebook must:

1.  Load all uploaded datasets.
2.  Print shape.
3.  Print column names.
4.  Print dtypes.
5.  Show null percentage.
6.  Show unique count.
7.  Show first 5 rows.
8.  Detect candidate IDs.
9.  Detect date/time columns.
10. Detect train identifiers.
11. Detect station identifiers.
12. Detect duplicate rows.
13. Detect inconsistent train IDs.
14. Detect impossible timestamps.
15. Detect impossible coordinates.
16. Detect negative travel durations.
17. Detect future-data leakage.

Output:

``` text
data_audit/
  dataset_summary.csv
  column_summary.csv
  duplicate_report.csv
  missing_report.csv
  key_candidate_report.csv
```

------------------------------------------------------------------------

# 8. CANONICAL DATA MODEL

Create these logical tables.

## 8.1 Train

``` text
train_id
train_number
train_name
train_type
source_station
destination_station
zone
is_special
is_superfast
is_passenger
```

------------------------------------------------------------------------

## 8.2 Station

``` text
station_code
station_name
latitude
longitude
zone
state
```

------------------------------------------------------------------------

## 8.3 TrainStop

``` text
train_id
station_code
stop_sequence
scheduled_arrival
scheduled_departure
distance_from_origin_km
```

------------------------------------------------------------------------

## 8.4 Journey

``` text
journey_id
train_id
journey_date
source_station
destination_station
scheduled_departure
scheduled_arrival
actual_arrival
delay_minutes
is_delayed
```

------------------------------------------------------------------------

## 8.5 MovementEvent

This is the key table for dynamic ETA.

``` text
event_id
journey_id
train_id
timestamp
station_code
latitude
longitude
next_station
observed_delay_minutes
distance_remaining_km
scheduled_arrival_next
actual_arrival_next
```

------------------------------------------------------------------------

## 8.6 SectionStatistics

``` text
from_station
to_station
train_type
direction
distance_km
sample_count
mean_running_minutes
median_running_minutes
p90_running_minutes
std_running_minutes
median_delay_change
recovery_rate
```

------------------------------------------------------------------------

## 8.7 TrainDependency

``` text
dependency_id
incoming_train_id
outgoing_train_id
station_code
dependency_type
minimum_turnaround_minutes
confidence
```

Possible dependency types:

``` text
RAKE
SCHEDULE
CREW
PLATFORM
PASSENGER_CONNECTION
UNKNOWN
```

Only create a dependency when supported by data or an explicitly
configured prototype rule.

------------------------------------------------------------------------

# 9. DATA PROCESSING PIPELINE

``` text
Raw datasets
     ↓
Schema inspection
     ↓
Column normalization
     ↓
ID normalization
     ↓
Timestamp normalization
     ↓
Station normalization
     ↓
Train normalization
     ↓
Duplicate removal
     ↓
Data quality checks
     ↓
Canonical tables
     ↓
Feature generation
```

Never train directly from raw mixed datasets.

------------------------------------------------------------------------

# 10. TRAIN ID NORMALIZATION

Different datasets may use:

``` text
12675
"12675"
"012675"
train_no
train_number
train_id
```

Create:

``` python
normalize_train_id(value)
```

Rules:

1.  Convert to string.
2.  Trim spaces.
3.  Remove accidental decimal suffixes.
4.  Preserve meaningful leading zeros only if the source uses them as an
    identifier.
5.  Create a separate canonical numeric train number where appropriate.
6.  Maintain original ID for traceability.

Never merge solely because two columns have similar-looking values.

------------------------------------------------------------------------

# 11. STATION ID NORMALIZATION

Create:

``` python
normalize_station_code(value)
```

Rules:

-   uppercase
-   strip whitespace
-   normalize known aliases
-   maintain mapping table
-   reject ambiguous aliases

Example:

``` text
MAS
mas
 MAS
```

must become:

``` text
MAS
```

------------------------------------------------------------------------

# 12. TIME NORMALIZATION

Convert all timestamps to a canonical format.

Recommended:

``` text
UTC internally
+
Asia/Kolkata presentation
```

If the source has no timezone, explicitly treat it as railway local time
rather than pretending it is UTC.

Derived fields:

``` text
year
month
day
day_of_week
hour
minute
is_weekend
is_night
is_peak
season
```

------------------------------------------------------------------------

# 13. KAGGLE ML TARGET

The Kaggle target is:

``` text
is_delayed
```

defined around final-destination delay greater than 15 minutes.

Use this for the first model:

``` text
P(delay > 15 min)
```

This is the **risk model**, not the final ETA model.

------------------------------------------------------------------------

# 14. FEATURE LEAKAGE RULE

NEVER use:

``` text
primary_delay_cause
delay_minutes
actual_future_arrival
future station delay
future section running time
future operational status
```

when those values are unavailable at prediction time.

The Kaggle competition explicitly warns that `primary_delay_cause` and
`delay_minutes` are training-only leakage fields.

Create a hardcoded exclusion list:

``` python
LEAKAGE_COLUMNS = [
    "primary_delay_cause",
    "delay_minutes",
    "actual_arrival",
    "future_delay",
    "target",
    "is_delayed"
]
```

The exact list must be adjusted after auditing all datasets.

------------------------------------------------------------------------

# 15. FEATURE ENGINEERING

## 15.1 Time

``` text
departure_hour
departure_minute
day_of_week
month
is_weekend
is_night
is_peak_hour
season
festival_period
```

------------------------------------------------------------------------

## 15.2 Route

``` text
distance_km
scheduled_travel_hours
num_scheduled_stops
average_stop_duration
route_length
section_count
```

------------------------------------------------------------------------

## 15.3 Station

``` text
source_station_category
destination_station_category
station_congestion
station_degree
```

------------------------------------------------------------------------

## 15.4 Weather

Use only weather features available at prediction time.

``` text
monsoon
fog risk
season severity
```

Do not use future weather observations.

------------------------------------------------------------------------

## 15.5 Train

``` text
train_type
zone
is_special
is_superfast
is_rake_shared
coach_age
loco_age
maintenance_score
```

Only retain fields that actually exist and are valid.

------------------------------------------------------------------------

## 15.6 Historical behaviour

Generate leakage-safe historical statistics:

``` text
route_historical_ontime_pct
train_historical_delay_mean
train_historical_delay_std
station_historical_delay_mean
section_p90_runtime
route_p90_delay
```

IMPORTANT:

For a prediction at time T:

``` text
historical features must use data before T only.
```

Do not calculate historical averages using the complete dataset and then
train.

------------------------------------------------------------------------

# 16. TEMPORAL TRAIN/VALIDATION/TEST SPLIT

Do NOT use a random split as the primary evaluation.

Preferred:

``` text
2018–2022 → training
2023       → validation
2024       → final test
```

If actual year distribution differs, calculate the split dynamically.

Alternative:

``` text
70% earliest time
15% next time
15% latest time
```

The latest period must remain untouched until final evaluation.

------------------------------------------------------------------------

# 17. MODEL STRATEGY

Do not build one giant model.

Use separate components.

## Model A --- Delay Risk

Input:

``` text
historical + route + train + weather + operational features
```

Output:

``` text
P(delay > 15 min)
```

Model:

``` text
LightGBMClassifier
```

------------------------------------------------------------------------

## Model B --- Dynamic Remaining Travel Time

If sufficient movement-event data exists:

Target:

``` text
remaining_minutes_to_destination
```

Model:

``` text
LightGBMRegressor
```

Input includes:

``` text
current_delay
distance_remaining
elapsed_journey_minutes
scheduled_remaining_minutes
section_statistics
train_type
time features
historical route behaviour
```

------------------------------------------------------------------------

## Model C --- Quantile ETA

Train separate quantile models:

``` text
P10
P50
P90
```

For example:

``` text
objective = quantile
alpha = 0.10

objective = quantile
alpha = 0.50

objective = quantile
alpha = 0.90
```

If quantile training is not stable on the final feature set, use an
ensemble/residual distribution method, but preserve the same API
contract.

------------------------------------------------------------------------

# 18. DYNAMIC ETA FORMULA

The system should not simply do:

``` text
scheduled arrival + current delay
```

Instead:

``` text
Dynamic ETA =
Current timestamp
+
Predicted remaining running time
+
Expected stop time
+
Expected delay propagation
+
Operational adjustment
```

Conceptually:

``` text
ETA_P50 =
now
+ predicted_remaining_runtime
+ predicted_station_stop_time
+ network_adjustment
```

The model learns how current conditions affect the remaining journey.

------------------------------------------------------------------------

# 19. SECTIONAL RUNNING TIME

For each consecutive station pair:

``` text
A → B
B → C
C → D
```

calculate:

``` text
median runtime
P90 runtime
mean runtime
standard deviation
sample count
```

Example:

``` text
MAS → AJJ
P50 = 58 min
P90 = 71 min
```

At inference time:

``` text
current station = MAS
next station = AJJ
```

use the relevant section statistics.

This makes ETA route-aware.

------------------------------------------------------------------------

# 20. ETA RANGE

Always return:

``` text
P10
P50
P90
```

Example:

``` text
P10 = 20:42
P50 = 20:48
P90 = 21:02
```

Interpretation:

-   P10: optimistic boundary
-   P50: most likely estimate
-   P90: conservative boundary

Do not describe P90 as a guarantee.

------------------------------------------------------------------------

# 21. RELIABILITY ENGINE

Reliability must be measurable.

Do not randomly assign:

``` text
High = 90%
Medium = 70%
Low = 40%
```

Instead evaluate historical prediction performance.

Possible reliability score:

``` text
reliability =
100 × calibrated confidence
```

based on:

-   interval coverage
-   historical MAE
-   prediction horizon
-   sample count
-   regime
-   route stability

Example:

``` text
ETA: 20:48
Range: 20:42–21:02
Reliability: 87%
```

------------------------------------------------------------------------

# 22. REGIME ENGINE

Internally classify operating condition.

``` text
NORMAL
DELAYED
DISRUPTED
```

### NORMAL

-   small delay
-   stable trajectory
-   predictable section performance

### DELAYED

-   significant delay
-   delay is relatively stable

### DISRUPTED

-   rapidly changing delay
-   abnormal stoppage
-   unusually high uncertainty
-   major network disturbance if supported by data

Regime affects:

``` text
prediction interval
reliability
reasoning
risk
```

It is an internal analytical state, not the main headline feature.

------------------------------------------------------------------------

# 23. REASONING ENGINE

Do not make an LLM invent railway causes.

Use structured evidence.

Input:

``` text
current delay
historical delay
section behaviour
distance remaining
train dependency
regime
weather risk
network risk
```

Output:

``` text
observed
inferred
confirmed
```

### Example

``` text
OBSERVED:
Train is currently 18 minutes late.

HISTORICAL:
This route typically recovers only 3–5 minutes in the remaining section.

INFERRED:
Most of the current delay is likely to persist.

NETWORK:
The train has a downstream outgoing dependency.

IMPACT:
Outgoing train departure risk is increased.
```

------------------------------------------------------------------------

# 24. SHAP

Use SHAP for model contribution.

Example:

``` text
Top prediction factors:

+ current delay
+ zone congestion
+ late incoming rake
+ high section runtime
- favourable historical punctuality
```

IMPORTANT:

SHAP shows model contribution.

It does NOT prove that a factor is the real-world causal reason.

The UI must say:

> "Factors contributing to this prediction"

not:

> "Root cause proved by AI"

------------------------------------------------------------------------

# 25. MULTI-TRAIN ENGINE

This is one of the most important parts of TrackPulse.

The system must support:

``` text
multiple incoming trains
+
multiple outgoing trains
```

simultaneously.

Example:

``` text
                  CENTRAL STATION
                         │
       ┌─────────────────┼─────────────────┐
       ↓                 ↓                 ↓
   Incoming A        Incoming B        Incoming C
       │                 │                 │
       └─────────────────┼─────────────────┘
                         ↓
                Station resources
                         │
       ┌─────────────────┼─────────────────┐
       ↓                 ↓                 ↓
   Outgoing X        Outgoing Y        Outgoing Z
```

------------------------------------------------------------------------

# 26. TRAIN DEPENDENCY GRAPH

Represent the network as a graph.

``` text
Node:
train / station / event

Edge:
dependency
```

Example:

``` text
Train A
  ↓
arrives station S
  ↓
rake turnaround
  ↓
Train X
```

If A is late:

``` text
A +18 min
 ↓
predicted arrival +18
 ↓
turnaround requirement
 ↓
X departure risk
 ↓
X downstream ETA changes
```

------------------------------------------------------------------------

# 27. DEPENDENCY TYPES

Use:

``` text
RAKE
PLATFORM
CREW
SCHEDULE
PASSENGER_CONNECTION
SECTION_CONGESTION
```

Only enable a dependency if:

-   it is present in the data, or
-   it is a clearly defined prototype rule.

Do not claim that two trains share a rake merely because their schedules
look similar.

------------------------------------------------------------------------

# 28. MULTIPLE INCOMING TRAIN ANALYSIS

At every station:

``` text
incoming_trains = get_incoming_trains(station, time_window)
```

For each:

``` text
ETA
delay
reliability
platform/resource
dependency
```

Then rank by:

``` text
earliest ETA
delay severity
resource conflict
dependency impact
```

Example:

``` text
Incoming A
ETA 18:10
Delay +5

Incoming B
ETA 18:18
Delay +20

Incoming C
ETA 18:25
Delay +8
```

------------------------------------------------------------------------

# 29. MULTIPLE OUTGOING TRAIN ANALYSIS

For each outgoing train:

``` text
scheduled_departure
predicted_departure
required_turnaround
incoming dependency
platform/resource
passenger connection
```

Calculate:

``` text
departure_risk
```

Example:

``` text
Outgoing X → LOW
Outgoing Y → HIGH
Outgoing Z → MEDIUM
```

------------------------------------------------------------------------

# 30. DELAY PROPAGATION ENGINE

Input:

``` text
current train state
```

Then:

``` text
1. Predict current ETA.
2. Find affected station.
3. Find dependent outgoing trains.
4. Estimate available turnaround.
5. Estimate propagated delay.
6. Update outgoing train state.
7. Repeat downstream.
8. Stop at configured horizon.
```

Pseudo-flow:

``` text
delay_event
   ↓
affected_train
   ↓
dependency_lookup
   ↓
propagation_probability
   ↓
new_delay_range
   ↓
downstream_train
   ↓
repeat
```

------------------------------------------------------------------------

# 31. PROPAGATION FORMULA

Prototype rule:

``` text
available_turnaround =
outgoing_scheduled_departure
-
incoming_predicted_arrival
```

If:

``` text
available_turnaround >= minimum_turnaround
```

then:

``` text
low propagation risk
```

Otherwise:

``` text
propagated_delay =
minimum_turnaround - available_turnaround
```

Then combine with uncertainty.

Example:

``` text
Incoming predicted arrival = 18:42
Outgoing scheduled departure = 18:45
Required turnaround = 15 min

Available = 3 min

Potential shortfall = 12 min
```

Output:

``` text
Outgoing departure risk: HIGH
Expected propagated delay: ~12 min
```

This is a prototype rule, not a claim about actual railway operational
policy.

------------------------------------------------------------------------

# 32. USER REQUIREMENT ENGINE

Input:

``` json
{
  "source": "MAS",
  "destination": "CBE",
  "date": "2026-09-10",
  "departure_window_start": "18:00",
  "departure_window_end": "22:00",
  "max_delay_minutes": 20,
  "connection_required": true
}
```

Candidate trains are scored.

------------------------------------------------------------------------

# 33. TRAIN RECOMMENDATION SCORE

Example:

``` text
score =
0.35 × arrival_quality
+
0.20 × reliability
+
0.15 × punctuality
+
0.15 × connection_safety
+
0.10 × user_preference
+
0.05 × delay_risk_inverse
```

Weights must be configurable.

Do not hardcode the weights throughout the application.

Create:

``` text
recommendation_config
```

------------------------------------------------------------------------

# 34. RECOMMENDATION OUTPUT

``` json
{
  "train": "12675",
  "recommended": true,
  "predicted_arrival": "20:48",
  "eta_p10": "20:42",
  "eta_p50": "20:48",
  "eta_p90": "21:02",
  "reliability": 0.87,
  "delay_risk": "MEDIUM",
  "connection_risk": "LOW",
  "reasons": [
    "Current delay is moderate",
    "Route historically recovers a small portion of delay",
    "Connection buffer is sufficient"
  ]
}
```

------------------------------------------------------------------------

# 35. WHAT-IF SIMULATION

User should be able to ask:

``` text
What if Train A becomes 30 minutes late?
```

Simulation:

``` text
baseline network
      ↓
inject +30 min delay
      ↓
recalculate affected ETA
      ↓
propagate dependencies
      ↓
compare baseline vs scenario
```

Output:

``` text
Train A
+30 min

Train X
+12 min risk

Train Y
+7 min risk

Passenger connection
Risk increased from LOW → HIGH
```

------------------------------------------------------------------------

# 36. REAL-TIME / REPLAY MODE

For SIH prototype, if no authorized live feed exists:

Create:

``` text
ReplayEngine
```

It reads historical movement events and exposes them as if they are
arriving live.

Example:

``` text
10:00 → train state
10:05 → train state
10:10 → train state
10:15 → train state
```

Frontend receives updates.

This demonstrates dynamic behaviour without falsely claiming real RTIS
access.

------------------------------------------------------------------------

# 37. LIVE DATA ADAPTER INTERFACE

Create:

``` text
TrainMovementProvider
```

Methods:

``` text
get_current_train_state(train_id)
get_active_trains()
get_station_arrivals(station_id)
get_station_departures(station_id)
```

Implement:

``` text
ReplayTrainMovementProvider
MockTrainMovementProvider
```

Future:

``` text
RTISProvider
AuthorizedRailwayProvider
```

This separation is mandatory.

------------------------------------------------------------------------

# 38. API DESIGN

## GET train ETA

``` text
GET /api/trains/{train_id}/eta
```

Response:

``` json
{
  "train_id": "12675",
  "status": "DELAYED",
  "current_delay_minutes": 18,
  "eta": "2026-09-10T20:48:00+05:30",
  "eta_p10": "2026-09-10T20:42:00+05:30",
  "eta_p50": "2026-09-10T20:48:00+05:30",
  "eta_p90": "2026-09-10T21:02:00+05:30",
  "reliability": 0.87,
  "regime": "DELAYED",
  "risk": "MEDIUM",
  "reasons": []
}
```

------------------------------------------------------------------------

# 39. MULTI-TRAIN API

``` text
POST /api/network/analyze
```

Input:

``` json
{
  "station_id": "MAS",
  "time_window_minutes": 120
}
```

Response:

``` json
{
  "station": "MAS",
  "incoming": [],
  "outgoing": [],
  "conflicts": [],
  "propagation": []
}
```

------------------------------------------------------------------------

# 40. USER RECOMMENDATION API

``` text
POST /api/recommend
```

Input:

``` json
{
  "source": "MAS",
  "destination": "CBE",
  "date": "2026-09-10",
  "departure_window": ["18:00", "22:00"],
  "max_delay_minutes": 20
}
```

------------------------------------------------------------------------

# 41. WHAT-IF API

``` text
POST /api/simulate
```

Input:

``` json
{
  "train_id": "12675",
  "delay_injection_minutes": 30
}
```

------------------------------------------------------------------------

# 42. PNR API

Prototype:

``` text
POST /api/pnr/status
```

Input:

``` json
{
  "pnr": "1234567890"
}
```

Output:

``` json
{
  "pnr": "********90",
  "train_id": "12675",
  "source": "MAS",
  "destination": "CBE",
  "status": "CONFIRMED",
  "eta": "20:48",
  "reliability": 0.87
}
```

Mask PNR in UI/logs.

------------------------------------------------------------------------

# 43. SMS API

Create:

``` text
POST /api/sms/inbound
```

Input:

``` json
{
  "sender": "masked",
  "message": "PNR 1234567890"
}
```

Process:

``` text
parse message
 ↓
validate PNR
 ↓
PNR provider
 ↓
ETA engine
 ↓
generate short response
 ↓
SMS provider adapter
```

For the prototype:

``` text
MockSMSProvider
```

can display the generated message in the dashboard instead of sending a
real SMS.

------------------------------------------------------------------------

# 44. SMS RESPONSE FORMAT

Keep under typical SMS-friendly length.

Example:

``` text
TrackPulse:
Train 12675
Delay: +18m
ETA: 20:48
Range: 20:42-21:02
Reliability: 87%
Risk: MEDIUM
Reason: Current delay likely to persist.
```

------------------------------------------------------------------------

# 45. FRONTEND PAGES

## `/`

Landing page.

Show:

-   TrackPulse
-   Dynamic ETA
-   Multi-train intelligence
-   Passenger recommendation
-   PNR/SMS accessibility
-   Live/replay demo

------------------------------------------------------------------------

## `/passenger`

Passenger mode.

Components:

``` text
Search form
Train cards
ETA cards
Recommendation
Connection risk
Reasoning
```

------------------------------------------------------------------------

## `/train/[id]`

Train detail.

Show:

``` text
Current position
Current delay
P10/P50/P90
Reliability
Regime
ETA timeline
Reasons
Section forecast
```

------------------------------------------------------------------------

## `/station/[id]`

Station intelligence.

Show:

``` text
Incoming trains
Outgoing trains
Predicted arrival
Predicted departure
Platform/resource pressure
Propagation risk
```

------------------------------------------------------------------------

## `/network`

Network dashboard.

Show:

``` text
Map
Active trains
Delayed trains
High-risk stations
Propagation chains
```

------------------------------------------------------------------------

## `/simulate`

What-if simulation.

Inputs:

``` text
Train
Delay injection
```

Output:

``` text
Before
After
Affected trains
Connection impact
```

------------------------------------------------------------------------

## `/pnr`

PNR demonstration.

Input:

``` text
PNR
```

Output:

``` text
Journey
ETA
delay
risk
recommendation
```

------------------------------------------------------------------------

# 46. DASHBOARD VISUAL DESIGN

Use a professional railway-control-room style.

Primary cards:

``` text
CURRENT DELAY
+18 min

PREDICTED ETA
20:48

ETA RANGE
20:42 – 21:02

RELIABILITY
87%

RISK
MEDIUM
```

Avoid excessive animation.

The judge must understand the result within 5 seconds.

------------------------------------------------------------------------

# 47. MAP

Use:

``` text
Leaflet + OpenStreetMap
```

Show:

-   train positions
-   stations
-   route
-   delay severity
-   propagation arrows

Do not expose a huge amount of raw data to the browser.

API should return only the required map objects.

------------------------------------------------------------------------

# 48. PROJECT STRUCTURE

Recommended:

``` text
trackpulse/
│
├── app/
│   ├── page.tsx
│   ├── passenger/
│   ├── train/
│   ├── station/
│   ├── network/
│   ├── simulate/
│   ├── pnr/
│   └── api/
│       ├── trains/
│       ├── network/
│       ├── recommend/
│       ├── simulate/
│       ├── pnr/
│       └── sms/
│
├── components/
│   ├── TrainCard.tsx
│   ├── ETACard.tsx
│   ├── ReliabilityBadge.tsx
│   ├── ReasoningPanel.tsx
│   ├── IncomingTrains.tsx
│   ├── OutgoingTrains.tsx
│   ├── PropagationGraph.tsx
│   ├── NetworkMap.tsx
│   └── RequirementForm.tsx
│
├── lib/
│   ├── api/
│   ├── eta/
│   ├── recommendation/
│   ├── propagation/
│   ├── reasoning/
│   ├── pnr/
│   ├── sms/
│   └── validation/
│
├── ml/
│   ├── model/
│   ├── feature_schema.json
│   ├── feature_defaults.json
│   └── inference.py
│
├── data/
│   ├── seed/
│   └── schemas/
│
├── types/
│   ├── train.ts
│   ├── eta.ts
│   ├── station.ts
│   └── network.ts
│
├── public/
│
├── kaggle/
│   ├── 01_data_audit.ipynb
│   ├── 02_preprocess.ipynb
│   ├── 03_feature_engineering.ipynb
│   ├── 04_train_delay_model.ipynb
│   ├── 05_train_eta_model.ipynb
│   ├── 06_calibration.ipynb
│   └── 07_export_artifacts.ipynb
│
├── scripts/
│   ├── validate-data.ts
│   ├── seed-db.ts
│   └── build-network.ts
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── fixtures/
│
├── .env.example
├── package.json
├── tsconfig.json
├── next.config.ts
├── vercel.json
└── README.md
```

------------------------------------------------------------------------

# 49. KAGGLE NOTEBOOK ORDER

Build notebooks in exactly this order.

## Notebook 1

``` text
01_data_audit.ipynb
```

Goal:

Understand every dataset.

------------------------------------------------------------------------

## Notebook 2

``` text
02_preprocess.ipynb
```

Goal:

Create clean canonical datasets.

Outputs:

``` text
clean_trains.parquet
clean_stations.parquet
clean_schedule.parquet
clean_delays.parquet
```

------------------------------------------------------------------------

## Notebook 3

``` text
03_feature_engineering.ipynb
```

Goal:

Create leakage-safe training tables.

Outputs:

``` text
train_features.parquet
valid_features.parquet
test_features.parquet
feature_schema.json
```

------------------------------------------------------------------------

## Notebook 4

``` text
04_train_delay_model.ipynb
```

Train:

``` text
LightGBMClassifier
```

Save:

``` text
delay_model.txt
delay_feature_schema.json
delay_metrics.json
```

------------------------------------------------------------------------

## Notebook 5

``` text
05_train_eta_model.ipynb
```

If movement events support the target:

``` text
LightGBM P10
LightGBM P50
LightGBM P90
```

Save:

``` text
eta_p10.txt
eta_p50.txt
eta_p90.txt
eta_feature_schema.json
```

If movement data is insufficient, build the prototype ETA using:

``` text
sectional runtime statistics
+
current delay
+
Kaggle delay risk
```

and clearly label it as a hybrid forecast.

------------------------------------------------------------------------

## Notebook 6

``` text
06_calibration.ipynb
```

Measure:

``` text
AUC
MAE
RMSE
Brier score
Calibration
P10 coverage
P90 coverage
Interval width
```

------------------------------------------------------------------------

## Notebook 7

``` text
07_export_artifacts.ipynb
```

Export only the required production artifacts.

------------------------------------------------------------------------

# 50. MODEL EVALUATION

## Delay model

Primary:

``` text
ROC-AUC
```

Also:

``` text
PR-AUC
Log Loss
Brier Score
Calibration curve
```

------------------------------------------------------------------------

## ETA model

Primary:

``` text
MAE
RMSE
```

Also:

``` text
±5 min accuracy
±10 min accuracy
±15 min accuracy
```

Example:

``` text
Within ±10 min = 78%
```

------------------------------------------------------------------------

## Prediction intervals

Calculate:

``` text
P10 coverage
P90 coverage
90% interval coverage
mean interval width
```

The goal is not merely a narrow interval.

The interval must be reliable.

------------------------------------------------------------------------

# 51. BASELINE COMPARISON

TrackPulse must beat simple baselines.

Implement:

### Baseline 1

``` text
Scheduled ETA
```

### Baseline 2

``` text
Scheduled ETA + current delay
```

### Baseline 3

``` text
Historical section median
```

### Model

``` text
TrackPulse hybrid/ML ETA
```

Compare:

``` text
Baseline MAE
TrackPulse MAE
```

This is important for the hackathon presentation.

------------------------------------------------------------------------

# 52. MODEL ARTIFACT VERSIONING

Save:

``` text
model_version
training_date
dataset_version
feature_version
metrics
```

Example:

``` json
{
  "model_version": "trackpulse-eta-1.0",
  "training_date": "2026-09-10",
  "feature_version": "1.0",
  "mae_minutes": 8.4,
  "within_10_min": 0.81
}
```

Never deploy an untracked model file.

------------------------------------------------------------------------

# 53. INFERENCE CONTRACT

The frontend/backend must send features in the exact training order.

Create:

``` text
feature_schema.json
```

Example:

``` json
{
  "features": [
    "current_delay_minutes",
    "distance_remaining_km",
    "scheduled_remaining_minutes",
    "train_type",
    "zone",
    "month",
    "departure_hour"
  ]
}
```

Inference must:

1.  validate input
2.  normalize categories
3.  fill allowed defaults
4.  preserve feature order
5.  predict
6.  validate output
7.  return structured JSON

------------------------------------------------------------------------

# 54. NEVER DO THIS IN PRODUCTION

Do not send:

``` text
entire CSV
```

from browser to API.

Do not load:

``` text
1.5M rows
```

inside every web request.

Do not retrain the model on Vercel.

Do not calculate huge historical aggregations during every request.

Do not expose the Kaggle training data publicly.

Instead:

``` text
Kaggle
 ↓
training
 ↓
small model artifacts
 ↓
database aggregates
 ↓
Vercel inference
```

------------------------------------------------------------------------

# 55. DATABASE DESIGN

Tables:

``` text
trains
stations
train_stops
journeys
movement_events
section_statistics
train_dependencies
eta_predictions
prediction_reasons
simulation_runs
```

------------------------------------------------------------------------

# 56. `eta_predictions`

``` text
id
train_id
timestamp
eta_p10
eta_p50
eta_p90
current_delay
reliability
risk
regime
model_version
```

------------------------------------------------------------------------

# 57. `prediction_reasons`

``` text
id
prediction_id
factor
direction
contribution
evidence_type
human_reason
```

Evidence types:

``` text
OBSERVED
INFERRED
CONFIRMED
```

------------------------------------------------------------------------

# 58. NETWORK GRAPH STORAGE

For the prototype, relational tables are enough.

Do NOT introduce Neo4j unless the team actually needs it.

Graph can be computed in memory:

``` text
network_graph = build_graph(
    trains,
    train_stops,
    dependencies
)
```

------------------------------------------------------------------------

# 59. CACHING

Cache:

``` text
station master
train master
schedule
section statistics
model metadata
```

Short-lived cache:

``` text
ETA predictions
network state
```

Avoid recalculating unchanged predictions repeatedly.

------------------------------------------------------------------------

# 60. SECURITY

Never expose:

``` text
database password
model training credentials
Kaggle API token
PNR provider credentials
SMS provider credentials
```

Use environment variables.

Example:

``` text
DATABASE_URL=
KAGGLE_API_TOKEN=
PNR_API_URL=
PNR_API_KEY=
SMS_API_KEY=
```

Never commit `.env`.

------------------------------------------------------------------------

# 61. PRIVACY

PNR is sensitive.

Rules:

-   Do not log full PNR.
-   Mask PNR in UI.
-   Hash or encrypt stored identifiers if storage is necessary.
-   Do not store passenger names unless absolutely required.
-   Do not use PNR for model training.
-   Do not expose passenger data in public dashboards.

------------------------------------------------------------------------

# 62. VERCEL DEPLOYMENT

The final frontend should be a Next.js application deployed on Vercel.

Recommended architecture:

``` text
                 VERCEL
 ┌──────────────────────────────────┐
 │ Next.js UI                       │
 │                                  │
 │ Passenger                        │
 │ Train                            │
 │ Station                          │
 │ Network                          │
 │ Simulation                       │
 │ PNR                              │
 └───────────────┬──────────────────┘
                 │
                 ↓
        Vercel API Functions
                 │
       ┌─────────┼─────────┐
       ↓         ↓         ↓
   ETA Engine  Network   Recommendation
       │
       ↓
 ML inference artifacts
       │
       ↓
 PostgreSQL / Supabase
```

Vercel currently supports Python and Node.js Functions, and current
Vercel documentation also supports longer-running Functions with the
appropriate configuration/plan. Keep normal ETA requests lightweight; do
not use the web request path for model training or large batch
processing.

------------------------------------------------------------------------

# 63. IMPORTANT VERCEL RULE

The Kaggle training process happens separately.

``` text
Kaggle
    ↓
Train
    ↓
Export model
    ↓
GitHub / artifact storage
    ↓
Vercel
    ↓
Inference only
```

Never:

``` text
User request
 ↓
train LightGBM
 ↓
return result
```

------------------------------------------------------------------------

# 64. MODEL DEPLOYMENT OPTIONS

Preferred prototype:

``` text
LightGBM model
+
small feature schema
+
Python inference function
```

If the model artifact/dependencies become too large for a clean
serverless deployment:

``` text
Next.js on Vercel
+
Python inference service deployed through Vercel-supported backend/container capability
```

The API contract must remain:

``` text
POST /predict
```

so the frontend does not need to change.

------------------------------------------------------------------------

# 65. VERCEL ENVIRONMENT VARIABLES

Set separately for:

``` text
Development
Preview
Production
```

Example:

``` text
DATABASE_URL
MODEL_VERSION
PNR_PROVIDER_MODE=mock
SMS_PROVIDER_MODE=mock
REPLAY_MODE=true
```

For hackathon demo:

``` text
PNR_PROVIDER_MODE=mock
SMS_PROVIDER_MODE=mock
REPLAY_MODE=true
```

This makes the prototype honest and deterministic.

------------------------------------------------------------------------

# 66. REPLAY DEMO

Create a deterministic demo scenario.

Example:

``` text
Station: Chennai Central

Incoming:
Train A +18 min
Train B +7 min
Train C +24 min

Outgoing:
Train X scheduled 18:45
Train Y scheduled 19:00
Train Z scheduled 19:20
```

Run replay.

Judge sees:

``` text
Incoming delay
 ↓
ETA update
 ↓
dependency detected
 ↓
outgoing risk
 ↓
passenger connection impact
```

This should be the main demonstration.

------------------------------------------------------------------------

# 67. DEMO SCENARIO 2 --- PASSENGER

Input:

``` text
From: Chennai
To: Coimbatore
Departure: 18:00–22:00
Max delay: 20 min
```

System:

``` text
Find candidate trains
 ↓
predict ETA
 ↓
calculate reliability
 ↓
calculate connection risk
 ↓
rank
```

Output:

``` text
Recommended:
Train 12675

ETA:
20:48

Range:
20:42–21:02

Reliability:
87%

Reason:
Lower predicted delay and safer connection buffer.
```

------------------------------------------------------------------------

# 68. DEMO SCENARIO 3 --- WHAT IF

Judge enters:

``` text
Train A delay = +30 min
```

System shows:

``` text
Before:
Train X risk LOW

After:
Train X risk HIGH
Expected delay +12 min

Train Y:
MEDIUM

Passenger connection:
LOW → HIGH
```

------------------------------------------------------------------------

# 69. TESTING

## Unit tests

Test:

``` text
train ID normalization
station normalization
timestamp parsing
feature creation
ETA calculation
P10/P50/P90 ordering
reliability
risk classification
recommendation scoring
propagation
PNR parsing
SMS formatting
```

------------------------------------------------------------------------

# 70. MODEL TESTS

Verify:

``` text
P10 <= P50 <= P90
```

for every prediction.

If not:

``` text
repair/monotonize interval
```

or reject the prediction.

Also verify:

``` text
ETA is not in the past
delay is within reasonable bounds
required feature count is correct
```

------------------------------------------------------------------------

# 71. NETWORK TESTS

Scenario:

``` text
Incoming A
Outgoing X
```

Inject:

``` text
A +30
```

Expected:

``` text
X risk increases
```

Then test:

``` text
A +0
```

Expected:

``` text
X remains baseline
```

Test three incoming trains and three outgoing trains.

------------------------------------------------------------------------

# 72. DATA QUALITY TESTS

Fail the pipeline if:

``` text
train ID missing excessively
station code invalid
timestamp impossible
negative travel time
duplicate journey IDs
future leakage detected
```

------------------------------------------------------------------------

# 73. PERFORMANCE REQUIREMENTS

Target prototype:

``` text
Single ETA request < 1–2 seconds
Multi-train station analysis < 3 seconds
Recommendation < 3 seconds
What-if simulation < 5 seconds
```

Do not perform heavy data loading during each request.

------------------------------------------------------------------------

# 74. SCALABILITY

Prototype:

``` text
PostgreSQL
+
Vercel Functions
+
cached model
```

Future:

``` text
Kafka
+
Redis
+
stream processor
+
distributed inference
+
graph neural network
```

Do not implement Kafka/GNN just for appearance.

------------------------------------------------------------------------

# 75. OPTIONAL FUTURE GNN

If sufficient train-network event data becomes available:

``` text
Graph:
train + station + section nodes
```

Use:

``` text
GNN / Temporal GNN
```

to learn network-level propagation.

For the SIH prototype:

``` text
LightGBM
+
explicit dependency graph
```

is easier to validate and explain.

------------------------------------------------------------------------

# 76. WHY LIGHTGBM

LightGBM is appropriate because the core dataset is tabular and
contains:

-   categorical features
-   numerical features
-   operational features
-   route features
-   weather features
-   historical statistics

Advantages:

-   fast training
-   strong tabular performance
-   manageable model size
-   feature importance
-   SHAP support
-   practical inference speed

------------------------------------------------------------------------

# 77. WHY NOT ONLY AN LSTM/TRANSFORMER

A sequence model may be useful later.

But for the first working prototype:

``` text
LightGBM
+
section statistics
+
network rules
```

is easier to:

-   train
-   debug
-   explain
-   deploy
-   evaluate

------------------------------------------------------------------------

# 78. WHY NOT ONLY KAGGLE MODEL

The Kaggle target is essentially:

``` text
Will this journey be >15 min late?
```

TrackPulse needs:

``` text
When exactly will it arrive?
What is the uncertainty?
What happens to connected trains?
Which train should the passenger choose?
Why did the prediction change?
```

Therefore:

``` text
Kaggle ML
+
movement/schedule data
+
sectional runtime
+
network engine
+
reasoning
=
TrackPulse
```

------------------------------------------------------------------------

# 79. END-TO-END REQUEST FLOW

For a train ETA:

``` text
User opens train
       ↓
API receives train ID
       ↓
Get current/replayed state
       ↓
Find current station/section
       ↓
Calculate remaining distance
       ↓
Get historical section statistics
       ↓
Create model features
       ↓
LightGBM prediction
       ↓
P10/P50/P90
       ↓
Reliability
       ↓
Regime
       ↓
SHAP/evidence
       ↓
Dependency lookup
       ↓
Propagation analysis
       ↓
Return JSON
       ↓
Frontend visualization
```

------------------------------------------------------------------------

# 80. END-TO-END PASSENGER FLOW

``` text
Passenger requirement
       ↓
Candidate train search
       ↓
Current state
       ↓
ETA prediction
       ↓
Uncertainty
       ↓
Connection analysis
       ↓
Risk
       ↓
Ranking
       ↓
Recommendation
       ↓
Reasoning
```

------------------------------------------------------------------------

# 81. END-TO-END PNR FLOW

``` text
PNR
 ↓
PNR provider
 ↓
Train/journey details
 ↓
Current/replayed train state
 ↓
ETA engine
 ↓
Network impact
 ↓
Passenger-specific result
 ↓
Web/SMS response
```

------------------------------------------------------------------------

# 82. REASONING TEMPLATE

Use structured templates rather than free-form hallucination.

``` text
Prediction:
Train is expected to arrive around {P50}.

Range:
Most outcomes are expected between {P10} and {P90}.

Current condition:
Train is currently {delay} minutes late.

Historical evidence:
This section normally takes approximately {P50_SECTION} minutes.

Network:
{dependency_statement}

Risk:
{risk}

Reliability:
{reliability}% based on historical validation/calibration.
```

------------------------------------------------------------------------

# 83. REASONING EXAMPLE

``` text
Expected arrival: 20:48

Current delay:
+18 minutes

Why:
The train is already 18 minutes late and the remaining section historically recovers only a small portion of delay.

Network impact:
The predicted arrival leaves a short turnaround window for an outgoing dependent service.

Risk:
MEDIUM

Reliability:
87%
```

Do not state:

``` text
"Signal failure caused the delay"
```

unless actual signal-failure data confirms it.

------------------------------------------------------------------------

# 84. UI REASONING LABELS

Use:

``` text
OBSERVED
```

for direct data.

``` text
HISTORICAL
```

for learned historical behaviour.

``` text
INFERRED
```

for model/rule inference.

``` text
CONFIRMED
```

only for externally confirmed operational information.

This improves trust.

------------------------------------------------------------------------

# 85. MODEL MONITORING

Record:

``` text
prediction time
actual arrival when later available
prediction error
model version
feature version
```

Then calculate:

``` text
rolling MAE
rolling RMSE
interval coverage
calibration
```

This creates a foundation for future retraining.

------------------------------------------------------------------------

# 86. MODEL RETRAINING

Do not retrain automatically during the SIH demo.

Recommended production workflow:

``` text
New historical data
 ↓
Data validation
 ↓
Leakage check
 ↓
Temporal validation
 ↓
Model training
 ↓
Evaluation
 ↓
Compare previous model
 ↓
Approve
 ↓
Deploy
```

------------------------------------------------------------------------

# 87. GITHUB WORKFLOW

Branches:

``` text
main
develop
feature/*
```

Recommended commits:

``` text
feat: add railway data normalization
feat: add delay model inference
feat: add dynamic ETA engine
feat: add propagation engine
feat: add passenger recommendation
feat: add PNR mock adapter
feat: add network dashboard
fix: correct temporal leakage
```

------------------------------------------------------------------------

# 88. CI CHECKS

On every pull request:

``` text
npm lint
npm test
npm build
typecheck
API tests
```

For ML repository:

``` text
data schema test
feature schema test
model loading test
prediction smoke test
```

------------------------------------------------------------------------

# 89. REQUIRED ENVIRONMENT

Local:

``` text
Node.js 20+
Python 3.11+
Git
```

Python:

``` text
pandas
numpy
scikit-learn
lightgbm
shap
joblib
fastapi
uvicorn
```

Frontend:

``` text
next
react
typescript
tailwindcss
recharts
leaflet
react-leaflet
lucide-react
```

Database:

``` text
PostgreSQL
```

------------------------------------------------------------------------

# 90. KAGGLE TRAINING CHECKLIST

Before training:

``` text
[ ] All datasets loaded
[ ] Shapes documented
[ ] IDs mapped
[ ] Dates normalized
[ ] Stations normalized
[ ] Duplicate report generated
[ ] Missing values understood
[ ] Leakage columns excluded
[ ] Temporal split created
[ ] Historical features are point-in-time safe
```

After training:

``` text
[ ] AUC recorded
[ ] MAE recorded
[ ] RMSE recorded
[ ] ±5/10/15 minute accuracy recorded
[ ] P10/P90 coverage recorded
[ ] Calibration checked
[ ] SHAP generated
[ ] Model exported
[ ] Feature schema exported
[ ] Metrics exported
```

------------------------------------------------------------------------

# 91. KAGGLE MODEL EXPORT PACKAGE

Create:

``` text
trackpulse_model/
├── delay_model.txt
├── eta_p10.txt
├── eta_p50.txt
├── eta_p90.txt
├── feature_schema.json
├── categorical_mappings.json
├── feature_defaults.json
├── section_statistics.parquet
├── model_metrics.json
└── model_metadata.json
```

Do not export the entire training dataset into the production
application.

------------------------------------------------------------------------

# 92. PROTOTYPE DATA SIZE

The application must use only:

``` text
required train master
required station master
required schedule
required section statistics
required dependencies
```

Do not bundle:

``` text
322 MB ir_train.csv
```

into the Vercel deployment.

The Kaggle dataset is for training/validation, not browser-side runtime.

------------------------------------------------------------------------

# 93. DEMO DATA

Create a small deterministic demo dataset:

``` text
demo_trains.json
demo_movements.json
demo_dependencies.json
demo_pnr.json
```

This guarantees that the SIH demo works even if external services are
unavailable.

------------------------------------------------------------------------

# 94. FAILURE HANDLING

If ML service fails:

``` text
Fallback:
historical section median
+
current delay
```

If live data unavailable:

``` text
Fallback:
replay mode
```

If PNR provider unavailable:

``` text
Fallback:
mock PNR provider
```

If database unavailable:

``` text
Fallback:
read-only demo seed data
```

Always show:

``` text
Data source: Replay / Live / Demo
```

Never hide the difference.

------------------------------------------------------------------------

# 95. SOURCE TRANSPARENCY

Every result should optionally expose:

``` text
Data source:
Historical + Replay

Model:
TrackPulse ETA v1.0

Last update:
18:42

Prediction:
20:48

Reliability:
87%
```

This increases judge confidence.

------------------------------------------------------------------------

# 96. IMPORTANT CLAIMS POLICY

Never say:

``` text
"Live Indian Railways data"
```

unless actually connected.

Say:

``` text
"Historical + replayed movement data"
```

for the prototype.

Never say:

``` text
"AI knows the exact reason"
```

Say:

``` text
"Evidence-based prediction factors"
```

Never say:

``` text
"Guaranteed ETA"
```

Say:

``` text
"Predicted ETA range"
```

------------------------------------------------------------------------

# 97. HACKATHON DIFFERENTIATORS

The strongest differentiators are:

## 1. Dynamic ETA

Not static schedule.

## 2. Uncertainty

P10/P50/P90.

## 3. Reliability

Quantified confidence.

## 4. Multi-train propagation

Incoming + outgoing simultaneously.

## 5. Passenger-specific recommendation

The system answers the user's actual requirement.

## 6. Reasoning

Evidence-backed explanation.

## 7. What-if

Simulate delay scenarios.

## 8. Accessibility

PNR/button-phone/SMS-ready interface.

------------------------------------------------------------------------

# 98. WHAT SHOULD NOT BE IMPLEMENTED FIRST

Do not spend the first development phase on:

``` text
Kafka
GNN
Transformer
LLM agent
complex microservices
Kubernetes
Neo4j
real-time RTIS scraping
```

First make this work:

``` text
Data
 ↓
ML
 ↓
ETA
 ↓
Uncertainty
 ↓
Reasoning
 ↓
Multi-train propagation
 ↓
Recommendation
 ↓
Dashboard
```

------------------------------------------------------------------------

# 99. DEVELOPMENT PHASES

## Phase 1 --- Data

``` text
Audit all datasets
Normalize
Create canonical tables
Build section statistics
```

------------------------------------------------------------------------

## Phase 2 --- ML

``` text
Train delay model
Train ETA models if movement data permits
Evaluate
Calibrate
Export
```

------------------------------------------------------------------------

## Phase 3 --- Backend

``` text
ETA API
Network API
Recommendation API
Simulation API
PNR mock API
```

------------------------------------------------------------------------

## Phase 4 --- Network

``` text
Incoming trains
Outgoing trains
Dependencies
Propagation
```

------------------------------------------------------------------------

## Phase 5 --- Frontend

``` text
Passenger
Train
Station
Network
Simulation
PNR
```

------------------------------------------------------------------------

## Phase 6 --- Deployment

``` text
GitHub
 ↓
Vercel
 ↓
Production
```

------------------------------------------------------------------------

# 100. FINAL DEMO FLOW

The judge should see this sequence:

### Step 1

Open TrackPulse.

### Step 2

Show multiple incoming trains.

``` text
A +18
B +7
C +24
```

### Step 3

Show dynamic ETA.

``` text
A
ETA 18:42
Range 18:35–18:51
Reliability 88%
```

### Step 4

Show reasoning.

``` text
Current delay is 18 minutes.
Historical section behaviour indicates limited recovery.
```

### Step 5

Show outgoing trains.

``` text
X → HIGH RISK
Y → LOW
Z → MEDIUM
```

### Step 6

Click X.

Show:

``` text
Incoming dependency
Predicted departure
Propagation risk
```

### Step 7

Use passenger requirement.

``` text
Chennai → Coimbatore
18:00–22:00
Max delay 20 min
```

TrackPulse recommends a train.

### Step 8

Enter mock PNR.

Show:

``` text
PNR
 ↓
journey
 ↓
dynamic ETA
 ↓
connection risk
```

### Step 9

Run what-if:

``` text
Train A +30 min
```

Show the network changing.

This is the strongest complete story.

------------------------------------------------------------------------

# 101. FINAL ARCHITECTURE SUMMARY

``` text
                         TRACKPULSE
                             │
       ┌─────────────────────┼─────────────────────┐
       │                     │                     │
 Historical Data       Railway Structure      Replay/Live
       │                     │                     │
 Kaggle + project       trains/stations       movement state
 datasets                   │                     │
       └─────────────────────┼─────────────────────┘
                             ↓
                    DATA NORMALIZATION
                             ↓
                     FEATURE ENGINEERING
                             ↓
                 ┌───────────┴───────────┐
                 ↓                       ↓
          DELAY RISK MODEL          ETA MODEL
            LightGBM              P10/P50/P90
                 │                       │
                 └───────────┬───────────┘
                             ↓
                       RELIABILITY
                             ↓
                         REGIME
                             ↓
                        REASONING
                             ↓
                    TRAIN NETWORK GRAPH
                             ↓
                   DELAY PROPAGATION
                             ↓
                   USER REQUIREMENT
                             ↓
               ┌─────────────┼─────────────┐
               ↓             ↓             ↓
           Passenger       Railway       PNR/SMS
              UI          Dashboard      Adapter
               └─────────────┼─────────────┘
                             ↓
                           VERCEL
```

------------------------------------------------------------------------

# 102. DEFINITION OF DONE

The prototype is considered complete only when all of these work:

``` text
[ ] Kaggle dataset successfully trained
[ ] Project datasets audited
[ ] Dataset relationships documented
[ ] Leakage prevented
[ ] Temporal validation completed
[ ] Delay model trained
[ ] ETA model/hybrid ETA implemented
[ ] P10/P50/P90 generated
[ ] Reliability calibrated
[ ] Section statistics implemented
[ ] Train graph implemented
[ ] Multiple incoming trains supported
[ ] Multiple outgoing trains supported
[ ] Delay propagation implemented
[ ] Passenger requirement engine implemented
[ ] Train recommendation implemented
[ ] Reasoning engine implemented
[ ] SHAP/evidence implemented
[ ] What-if simulation implemented
[ ] PNR mock flow implemented
[ ] SMS-ready response implemented
[ ] Replay mode implemented
[ ] Fallbacks implemented
[ ] Tests passing
[ ] Production build passing
[ ] Vercel deployment working
[ ] Demo scenario deterministic
[ ] No unsupported claims about live railway access
```

------------------------------------------------------------------------

# 103. FINAL IMPLEMENTATION PRINCIPLE

The project must be built as:

``` text
ML for prediction
+
statistics for historical behaviour
+
graph/rules for network dependencies
+
calibration for reliability
+
structured evidence for reasoning
+
requirement scoring for passenger decisions
```

Do **not** force machine learning to solve every part.

The strongest TrackPulse prototype is one where every component has a
clear job:

``` text
Kaggle ML
    → learns historical delay risk

Movement + schedule data
    → determines where the train is and what remains

Section statistics
    → estimates realistic running time

ETA engine
    → predicts arrival

Quantile models
    → provide uncertainty

Reliability engine
    → tells how trustworthy the forecast is

Network engine
    → handles multiple incoming/outgoing trains

Propagation engine
    → estimates downstream effects

Requirement engine
    → chooses the best train for a specific passenger

Reasoning engine
    → explains the prediction from evidence

Replay engine
    → demonstrates dynamic behaviour without unauthorized live access

PNR/SMS adapters
    → make the same intelligence accessible to button-phone users

Vercel
    → hosts the final interactive prototype
```

------------------------------------------------------------------------

# 104. FIRST ACTION AFTER THIS DOCUMENT

Do **not** start frontend development immediately.

First complete:

``` text
STEP 1
Upload all project datasets into Kaggle.

STEP 2
Run 01_data_audit.ipynb.

STEP 3
Produce the complete schema/key relationship report.

STEP 4
Determine exactly which project datasets can be safely joined to
the Kaggle dataset.

STEP 5
Build the canonical movement/schedule/section tables.

STEP 6
Create point-in-time-safe training events.

STEP 7
Train and evaluate the delay model.

STEP 8
Train the dynamic ETA models if the movement data supports
future-arrival targets.

STEP 9
Export the production model artifacts.

STEP 10
Only then implement the TrackPulse web application.
```

**Critical rule:** Never invent relationships between the uploaded
datasets. The exact joins must be determined from their actual columns,
identifiers, date coverage, and semantics after the Kaggle data audit.
