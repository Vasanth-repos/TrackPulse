# 🚆 TrackPulse: Universal Railway ETA Reliability & SMS Gateway System

> **Adaptive ETA Reliability, Quantile Forecasting & Zero-Internet SMS Passenger Service for Indian Railways**  
> *"Don't just predict the ETA. Predict how reliable that ETA is, and deliver it to every citizen on any phone."*

---

## 1. System Architecture

TrackPulse is designed with strict decoupling between the telecom SMS ingestion layer, the train/station resolution layer, the ML model forecasting service, and the calibrated reliability engine:

```text
┌────────────────────────┐
│  KEYPAD / 2G PHONE     │
│  (Zero Internet Req.)  │
└───────────┬────────────┘
            │ SMS (e.g. "ETA 12627 BZA")
            ▼
┌────────────────────────┐
│      SMS GATEWAY       │  ◄── [ISmsGateway: MockSmsGateway / TwilioSmsGateway]
│   (Webhook Dispatch)   │
└───────────┬────────────┘
            │ HTTP POST /api/sms/incoming
            ▼
┌────────────────────────┐
│     FASTAPI ROUTER     │  ◄── [Rate Limiter: Sliding 60s window (10 req/min)]
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│   SMS MESSAGE PARSER   │  ◄── [Whitespace normalizer, case insensitive, validation]
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│ TRAIN & STN RESOLVER   │  ◄── [Database: SQLite / PostgreSQL / Demo seeds]
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│      ETA SERVICE       │  ◄── [Freshness checking (>180s lag downgrades reliability)]
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│     MODEL SERVICE      │  ◄── [IModelService: DemoModelService / LightGBMModelService]
└───────────┬────────────┘
            │ Quantiles: P10 / P50 / P90 + Non-crossing monotonicity
            ▼
┌────────────────────────┐
│   RELIABILITY ENGINE   │  ◄── [HIGH / MEDIUM / LOW based on spread, lag, regime]
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│ SMS RESPONSE GENERATOR │  ◄── [GSM 7-bit, <160 chars, plain language, NO raw ML terms]
└───────────┬────────────┘
            │ Outgoing SMS
            ▼
┌────────────────────────┐
│  KEYPAD PHONE DISPLAY  │
└────────────────────────┘
```

---

## 2. Installation

### Prerequisites
- Python 3.10+ (Python 3.11 recommended)
- Node.js 18+ (for frontend simulator)
- Docker & Docker Compose (optional for containerized deployment)

### Backend Setup
```bash
cd backend
python -m venv venv
# On Windows PowerShell:
.\venv\Scripts\Activate.ps1
# On Linux/macOS:
# source venv/bin/activate

pip install -r requirements.txt
```

### Frontend Setup
```bash
cd frontend
npm install
```

---

## 3. Environment Variables

Create a `.env` file in the root or `backend/` directory based on `.env.example`:

```ini
# Application Mode & Port
PORT=8000
ENVIRONMENT=development

# Database Configuration (SQLite default; PostgreSQL supported)
DATABASE_URL=sqlite:///./trackpulse_dev.db
# DATABASE_URL=postgresql://trackpulse_user:trackpulse_secure_password_demo@localhost:5432/trackpulse

# SMS Gateway Configuration
SMS_PROVIDER=mock                     # Options: "mock" or "twilio"
SMS_MAX_REQUESTS_PER_MINUTE=10        # Sliding window rate limit per phone number
SMS_SENDER_ID=139                     # Indian Railways standard SMS shortcode

# Twilio Configuration (Required only if SMS_PROVIDER=twilio)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
```

---

## 4. How to Start the Backend

```bash
# Set PYTHONPATH to include backend/
$env:PYTHONPATH="C:\train_eta\backend"

# Run with Uvicorn
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

- API Base URL: `http://127.0.0.1:8000`
- Interactive OpenAPI Docs (Swagger): `http://127.0.0.1:8000/docs`
- Redoc Documentation: `http://127.0.0.1:8000/redoc`

---

## 5. How to Start the SMS Simulator

```bash
cd frontend
npm run dev
```

- Open `http://localhost:3000` in your browser.
- Switch to **PASSENGER** mode in the top navigation switcher.
- Select the **Button Phone SMS Simulator** tab.
- Type in phone numbers and commands (e.g., `ETA 12627 BZA`, `STATUS 12627 BZA`, `HELP`, `PNR 4281903490`) to test live carrier responses and character compliance in real time.

---

## 6. SMS Commands

The SMS syntax is engineered specifically for physical keypad phones (no internet, low bandwidth, zero ambiguity):

| Command | Format | Example | Description |
| :--- | :--- | :--- | :--- |
| **ETA** | `ETA <TrainNo> <StnCode>` | `ETA 12627 BZA` | Returns predicted ETA, arrival range (P10-P90), reliability grade, regime, and delay. |
| **STATUS** | `STATUS <TrainNo> <StnCode>` | `STATUS 12627 BZA` | Returns current train position, current delay, target ETA, status, and reliability. |
| **HELP** | `HELP` | `HELP` | Returns complete list of available keypad SMS commands. |
| **PNR** | `PNR <10-digit PNR>` | `PNR 4281903490` | Returns masked passenger booking status, train ETA, and coach/berth details. |

### Sample Outgoing SMS Messages

**Standard ETA Response:**
```text
TRACKPULSE

12627 Karnataka Express
BZA ETA: 14:42
Range: 14:35-14:52
Reliability: MEDIUM
Status: DELAYED
Delay: +18 min
```

**Stale Telemetry Lag Response (>180 seconds delay in GPS update):**
```text
TRACKPULSE

12627 Karnataka Express
BZA ETA: 14:42
Range: 14:35-14:52
Reliability: LOW
Data update delayed.
```

**STATUS Command Response:**
```text
TRACKPULSE

12627 Karnataka Express
Current: Nellore
Delay: +18 min
BZA ETA: 14:42
Status: DELAYED
Reliability: MEDIUM
```

---

## 7. API Endpoints

### 1. Direct REST ETA Endpoint
`GET /api/eta/{train_number}/{station_code}`
- **Parameters:** `train_number` (e.g. `12627`), `station_code` (e.g. `BZA`), `data_freshness_sec` (optional query param).
- **Response:**
  ```json
  {
    "train_number": "12627",
    "train_name": "Karnataka Express",
    "station": "BZA",
    "station_name": "Vijayawada",
    "eta": "14:42",
    "p10": "14:35",
    "p90": "14:52",
    "reliability": "MEDIUM",
    "regime": "DELAYED",
    "current_delay": 18,
    "last_updated": "14:38:20",
    "is_stale": false
  }
  ```

### 2. SMS Gateway Inbound Webhook
`POST /api/sms/incoming`
- **Request:**
  ```json
  {
    "from": "+919876543210",
    "message": "ETA 12627 BZA"
  }
  ```
- **Response:**
  ```json
  {
    "status": "success",
    "to": "+919876543210",
    "message": "TRACKPULSE\n\n12627 Karnataka Express\nBZA ETA: 14:42\nRange: 14:35-14:52\nReliability: MEDIUM\nStatus: DELAYED\nDelay: +18 min",
    "character_count": 134,
    "is_sms_length_compliant": true
  }
  ```

### 3. TwiML Carrier Webhook
`POST /api/sms/inbound?format=twiml`
- Accepts standard carrier form-encoded webhooks (`From`, `Body`) and outputs TwiML XML `<Response><Message>...</Message></Response>`.

---

## 8. Database Structure

The persistence layer is managed via SQLAlchemy 2.0 and supports SQLite for local development and PostgreSQL for production:

- `trains`: Primary train metadata (`train_number`, `train_name`, `origin`, `destination`, `is_active`).
- `stations`: Official railway station register (`code`, `name`, `zone`, `division`).
- `schedules`: Scheduled timetable sequence per train (`train_number`, `station_code`, `scheduled_arrival`, `stop_sequence`).
- `train_states`: Real-time/historical telemetry state (`train_number`, `current_station`, `next_station`, `current_delay_minutes`, `last_updated`).
- `predictions`: Stored quantile ETA predictions (`train_number`, `station_code`, `predicted_eta`, `p10`, `p90`, `reliability`, `regime`).
- `sms_requests`: Privacy-conscious audit log of SMS queries (`phone_masked`, `command`, `train_number`, `station_code`, `response_status`, `character_count`, `timestamp`).

> **Privacy Guarantee:** Phone numbers are hashed/masked (`+91987****210`) to ensure zero exposure of passenger PII in logs or analytics.

---

## 9. How to Replace Mock SMS Gateway with Real SMS Provider

TrackPulse uses the `ISmsGateway` interface in `backend/app/services/gateway_service.py`:

```python
from app.services.gateway_service import ISmsGateway, get_sms_gateway

class RealSmsGateway(ISmsGateway):
    def send_sms(self, phone_number: str, message: str) -> bool:
        # 1. Integrate with Twilio, Gupshup, or CDAC SMS Gateway
        # 2. Authenticate using os.getenv("SMS_API_KEY")
        # 3. Post to SMS provider endpoint
        return True
```

To activate a real provider in production:
1. Set `SMS_PROVIDER=twilio` (or custom provider) in `.env`.
2. Configure `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_PHONE_NUMBER`.
3. Point your carrier webhook URL to `https://your-domain.gov.in/api/sms/incoming`.

---

## 10. How to Replace Demo Model with LightGBM

The prediction layer is encapsulated behind `IModelService` in `backend/app/services/model_service.py`:

```python
from app.services.model_service import set_model_service, LightGBMModelService

# Switch from Demo predictions to live trained LightGBM Quantile Models:
live_ml_service = LightGBMModelService(model_weights_dir="app/ml/weights")
set_model_service(live_ml_service)
```

The SMS service and ETA API interact only with `get_model_service()`, allowing seamless hot-swapping between simulated historical replay and live quantile regression without changing a single line of SMS or routing code.

---

## 11. Testing Instructions

Automated test suites verify input validation, rate limiting, error codes, TwiML compatibility, stale telemetry, and model swapping:

```bash
cd backend
$env:PYTHONPATH="C:\train_eta\backend"
python -m pytest tests/ -v
```

All 38 test suites cover:
1. `test_01_valid_eta_rest_api` & `test_01_valid_eta_sms_incoming`
2. `test_02_invalid_train_number_format` & `test_02_train_number_not_found`
3. `test_03_invalid_station_code_not_found`
4. `test_04_missing_station_code`
5. `test_05_unknown_command`
6. `test_06_help_command`
7. `test_07_status_command`
8. `test_08_stale_data_handling`
9. `test_09_rate_limiting` (sliding window enforcement)
10. `test_10_sms_gateway_mock_dispatch`
11. `test_11_model_service_swapping`
12. `test_12_database_initialization` & persistence invariants

---

## 12. Production Considerations & Engineering Rules

1. **Zero Technical Jargon to Passengers:** SMS messages never display `P10`, `P90`, `SHAP`, or `LightGBM`. All predictions use plain language (`Range: 14:35-14:52`).
2. **Data Freshness Invariant:** If telemetry lag exceeds 180 seconds, reliability is automatically downgraded to `LOW` and annotated with `"Data update delayed."`.
3. **Strict Rate Limiting:** In-memory sliding window rate limits each phone number to 10 requests/minute to prevent SMS gateway flooding.
4. **Data Privacy:** Raw 10-digit mobile numbers are masked (`+91987****210`) in memory and database logs.
5. **Clear Demo Labelling:** All simulated seeds and historical replay trajectories are explicitly stamped `DEMO / HISTORICAL REPLAY DATA`.
6. **Containerized Deployment:** Start full production stack (Backend + Frontend + PostgreSQL) with:
   ```bash
   docker compose up --build
   ```
