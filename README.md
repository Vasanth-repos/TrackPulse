# 🚆 Adaptive ETA Reliability & Forecasting System for Indian Coaching Trains

> **SIH 2026 Problem Solution: Dynamic and Reliable ETA Forecasting for Indian Coaching Trains**  
> *"Don't just predict the ETA. Predict how reliable that ETA currently is."*

---

## 1. Executive Summary & Problem

Today's railway passenger ETA systems compute a static approximation:  
$$\text{ETA} = \text{Scheduled Arrival} + \text{Current Delay} + \text{Static Recovery Margin}$$

### The Core Problem
**Current delay $\ne$ Future delay.** A train delayed 24 minutes may recover, cascade, or diverge from historical behavior based on section dynamics and operating regimes. Producing a single point number without uncertainty creates false precision that damages passenger trust and operational planning.

### The Innovation
Our system introduces an **Adaptive ETA Reliability Layer** that produces four coordinated outputs for every coaching train across all upcoming stations:
1. **Predicted ETA:** Point-in-time arrival estimate.
2. **Statistically Derived Uncertainty Interval:** 10th-to-90th percentile arrival window ($\alpha \in [0.1, 0.9]$).
3. **Calibrated Reliability Score (0–100):** Trust index computed from uncertainty width, sequential error trend, operating regime, telemetry freshness, and section variability.
4. **Auditable Evidence:** Data-backed explanation factors for ETA changes (zero generative hallucinations).

---

## 2. System Architecture

```
                                  ┌───────────────────────────┐
                                  │ Indian Coaching Datasets  │
                                  │ Timetables / Delays / GPS │
                                  └─────────────┬─────────────┘
                                                │
                                                ▼
                                  ┌───────────────────────────┐
                                  │  Journey Reconstruction   │
                                  │  Section Statistics Engine│
                                  └─────────────┬─────────────┘
                                                │
                 ┌──────────────────────────────┴──────────────────────────────┐
                 ▼                                                             ▼
   ┌───────────────────────────┐                                 ┌───────────────────────────┐
   │ Operating Regime Detector │                                 │  Baseline Models (1 & 2)  │
   │ NORMAL / DELAYED / DISRUPT│                                 │ Schedule / Static Delay   │
   └─────────────┬─────────────┘                                 └─────────────┬─────────────┘
                 │                                                             │
                 ▼                                                             │
   ┌─────────────────────────────────────────────────────────┐                 │
   │  Section-Aware Quantile Forecaster (p10, p50, p90)      │                 │
   │  Gradient Boosting w/ Anti-Crossing Monotonic Sorting   │                 │
   └─────────────────────────────┬───────────────────────────┘                 │
                                 │                                             │
                 ┌───────────────┴───────────────┐                             │
                 ▼                               ▼                             ▼
   ┌───────────────────────────┐   ┌───────────────────────────┐   ┌───────────────────────────┐
   │    Reliability Engine     │   │     Evidence Engine       │   │    Model Benchmark Lab    │
   │  0–100 Multi-Factor Score │   │  Auditable Signal Reasons │   │ Calibration & Error Stats │
   └─────────────┬─────────────┘   └─────────────┬─────────────┘   └─────────────┬─────────────┘
                                 │                                             │
                                 ▼                                             ▼
                 ┌───────────────────────────────────────────────────────────┐
                 │                FastAPI Backend (Port 8000)                │
                 │          REST Endpoints & Chronological Replay            │
                 └─────────────────────────────┬─────────────────────────────┘
                                               │
                                               ▼
                 ┌───────────────────────────────────────────────────────────┐
                 │             React + Vite Frontend (Port 3000)             │
                 │         Railway Operations & Replay Command Deck          │
                 └───────────────────────────────────────────────────────────┘
```

---

## 3. Tech Stack

- **ML & Forecasting:** Python 3.11, LightGBM, XGBoost, Scikit-learn (Quantile Regression), Pandas, NumPy, Scipy.
- **Backend API:** FastAPI, Uvicorn, Pydantic v2.
- **Frontend & UI:** React 18, TypeScript, Vite, TailwindCSS, Lucide Icons, Custom Railway Design System.
- **Testing:** Pytest (15 automated unit & integration tests).

---

## 4. Getting Started & Running Locally

### Step 1: Start Backend Server
```bash
# Set PYTHONPATH to include backend/
$env:PYTHONPATH="c:\train_eta\backend"
python backend/app/main.py
```
Backend runs at `http://localhost:8000`. Swagger API docs at `http://localhost:8000/docs`.

### Step 2: Start Frontend Application
```bash
cd frontend
npm run dev
```
Frontend runs at `http://localhost:3000`.

---

## 5. Live Demonstration Script (90-Second Demo)

1. **Network Situation View:** Open `Overview` tab to see active coaching corridors (Karnataka Express, Mumbai Rajdhani, Howrah Rajdhani, Shatabdi, Vande Bharat).
2. **Train Inspector:** Select Train `12627` (Karnataka Express). Inspect the **Hero Arrival Time-Window** slider (`[======●======]`), the signature **Railway Journey Track Timeline**, the dynamic **Delay Trajectory Chart**, the **Reliability Factor Gauge**, and the **Why This ETA?** auditable cards.
3. **Live Replay Studio:** Switch to `Live Replay Studio` tab.
   - **Step 1 (Normal):** Train runs nominally through Bengaluru, narrow range, high reliability ($87+$).
   - **Step 2 (Disruption):** Advance to Wadi/Solapur halt; observe regime transition to `DISRUPTED`, arrival window widen substantially, and reliability score drop to $42$.
   - **Step 3 (Recovery):** Advance to Manmad/Bhusaval speed run; observe make-up time detected, window narrow, and reliability rebound to $78+$.
4. **Model Performance Lab:** Inspect the **Benchmark Lab** comparing Baseline 1, Baseline 2, and Proposed Quantile Model, with empirical 80% calibration coverage curves.
5. **Dataset Auditor:** Inspect Phase 0 schema validation and quality grade.
