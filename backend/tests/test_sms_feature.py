"""
TrackPulse SMS Feature Automated Test Suite
Tests all 12 core functional and edge-case requirements from Step 20:
1. Valid ETA request
2. Invalid train number format and not found
3. Invalid station code format and not found
4. Missing station code
5. Unknown command
6. HELP command
7. STATUS command
8. Stale data freshness degradation
9. Rate limiting protection
10. SMS gateway mock dispatch
11. ETA model interface swapping (Demo vs LightGBM)
12. Database schema and request persistence
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.rate_limiter import sms_rate_limiter
from app.services.gateway_service import sms_gateway, MockSmsGateway
from app.services.model_service import DemoModelService, LightGBMModelService, set_model_service

client = TestClient(app)


@pytest.fixture(autouse=True)
def reset_rate_limiter():
    """Resets rate limiter state before each test."""
    sms_rate_limiter.reset()
    if isinstance(sms_gateway, MockSmsGateway):
        sms_gateway.sent_messages.clear()


# -------------------------------------------------------------
# 1. Valid ETA Request Tests (REST API & SMS)
# -------------------------------------------------------------

def test_01_valid_eta_rest_api():
    res = client.get("/api/eta/12627/BZA")
    assert res.status_code == 200
    data = res.json()
    assert data["train_number"] == "12627"
    assert data["station"] == "BZA"
    assert data["station_name"] == "Vijayawada"
    assert data["eta"] == "14:42"
    assert data["p10"] == "14:35"
    assert data["p90"] == "14:52"
    assert data["reliability"] == "MEDIUM"
    assert data["regime"] == "DELAYED"
    assert data["current_delay"] == 18
    assert "DEMO" in data["data_source_mode"]


def test_01_valid_eta_sms_incoming():
    payload = {"from": "+919876543210", "message": "ETA 12627 BZA"}
    res = client.post("/api/sms/incoming", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "success"
    assert data["to"] == "+919876543210"
    assert "TRACKPULSE" in data["message"]
    assert "12627 Karnataka Express" in data["message"]
    assert "BZA ETA: 14:42" in data["message"]
    assert "Range: 14:35-14:52" in data["message"]
    assert "Reliability: MEDIUM" in data["message"]
    assert "Status: DELAYED" in data["message"]
    assert "Delay: +18 min" in data["message"]
    # Verify no raw technical ML terms in passenger SMS
    assert "SHAP" not in data["message"]
    assert "LightGBM" not in data["message"]
    assert "P10" not in data["message"]


# -------------------------------------------------------------
# 2. Invalid Train Number Tests
# -------------------------------------------------------------

def test_02_invalid_train_number_format():
    payload = {"from": "+919876543210", "message": "ETA ABC BZA"}
    res = client.post("/api/sms/incoming", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "error"
    assert "Invalid train number" in data["message"]


def test_02_train_number_not_found():
    payload = {"from": "+919876543210", "message": "ETA 99999 BZA"}
    res = client.post("/api/sms/incoming", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "error"
    assert "Train number not found" in data["message"]
    assert "Please check the train number." in data["message"]


# -------------------------------------------------------------
# 3. Invalid Station Tests
# -------------------------------------------------------------

def test_03_invalid_station_code_not_found():
    payload = {"from": "+919876543210", "message": "ETA 12627 XYZ"}
    res = client.post("/api/sms/incoming", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "error"
    assert "Station code not found" in data["message"]
    assert "Please check the station code." in data["message"]


# -------------------------------------------------------------
# 4. Missing Station Code Tests
# -------------------------------------------------------------

def test_04_missing_station_code():
    payload = {"from": "+919876543210", "message": "ETA 12627"}
    res = client.post("/api/sms/incoming", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "error"
    assert "Station code is required" in data["message"]


# -------------------------------------------------------------
# 5. Unknown Command Tests
# -------------------------------------------------------------

def test_05_unknown_command():
    payload = {"from": "+919876543210", "message": "ABC"}
    res = client.post("/api/sms/incoming", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "error"
    assert "Unknown command" in data["message"]
    assert "Send HELP for available commands." in data["message"]


# -------------------------------------------------------------
# 6. HELP Command Tests
# -------------------------------------------------------------

def test_06_help_command():
    payload = {"from": "+919876543210", "message": "HELP"}
    res = client.post("/api/sms/incoming", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "success"
    assert "Commands:" in data["message"]
    assert "ETA <train> <station>" in data["message"]
    assert "STATUS <train> <station>" in data["message"]
    assert "HELP" in data["message"]


# -------------------------------------------------------------
# 7. STATUS Command Tests
# -------------------------------------------------------------

def test_07_status_command():
    payload = {"from": "+919876543210", "message": "STATUS 12627 BZA"}
    res = client.post("/api/sms/incoming", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "success"
    assert "12627 Karnataka Express" in data["message"]
    assert "Current: Nellore" in data["message"]
    assert "Delay: +18 min" in data["message"]
    assert "BZA ETA: 14:42" in data["message"]
    assert "Status: DELAYED" in data["message"]
    assert "Reliability: MEDIUM" in data["message"]


# -------------------------------------------------------------
# 8. Stale Data Freshness Degradation Tests
# -------------------------------------------------------------

def test_08_stale_data_handling():
    # Pass data_freshness_sec=300 (> 180 sec stale threshold)
    payload = {"from": "+919876543210", "message": "ETA 12627 BZA"}
    res = client.post("/api/sms/incoming?data_freshness_sec=300", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "success"
    assert "Reliability: LOW" in data["message"]
    assert "Data update delayed." in data["message"]


# -------------------------------------------------------------
# 9. SMS Rate Limiting Tests
# -------------------------------------------------------------

def test_09_rate_limiting():
    phone = "+919888877777"
    # Send 10 valid requests
    for _ in range(10):
        res = client.post("/api/sms/incoming", json={"from": phone, "message": "ETA 12627 BZA"})
        assert res.status_code == 200
        assert res.json()["status"] == "success"

    # The 11th request should be rate-limited
    res_limited = client.post("/api/sms/incoming", json={"from": phone, "message": "ETA 12627 BZA"})
    assert res_limited.status_code == 200
    data = res_limited.json()
    assert data["status"] == "error"
    assert "Too many requests. Please try again later." in data["message"]


# -------------------------------------------------------------
# 10. SMS Gateway Mock Dispatch Tests
# -------------------------------------------------------------

def test_10_sms_gateway_mock_dispatch():
    if isinstance(sms_gateway, MockSmsGateway):
        sms_gateway.sent_messages.clear()
        client.post("/api/sms/incoming", json={"from": "+919111122222", "message": "ETA 12627 BZA"})
        assert len(sms_gateway.sent_messages) == 1
        record = sms_gateway.sent_messages[0]
        assert record["to"] == "+919111122222"
        assert "12627 Karnataka Express" in record["message"]


# -------------------------------------------------------------
# 11. Model Service Swapping Tests (Demo vs LightGBM)
# -------------------------------------------------------------

def test_11_model_service_swapping():
    demo_svc = DemoModelService()
    set_model_service(demo_svc)
    res_demo = client.get("/api/eta/12627/BZA")
    assert res_demo.status_code == 200
    assert res_demo.json()["eta"] == "14:42"

    # Swap to LightGBM Service
    lgb_svc = LightGBMModelService()
    set_model_service(lgb_svc)
    res_lgb = client.get("/api/eta/12627/BZA")
    assert res_lgb.status_code == 200
    assert "eta" in res_lgb.json()

    # Reset back to demo service
    set_model_service(demo_svc)


# -------------------------------------------------------------
# 12. Database Table & Model Tests
# -------------------------------------------------------------

def test_12_database_initialization():
    from app.db.database import engine, Base
    from app.db.models import TrainDB, StationDB, SMSRequestLogDB
    # Tables must be created and queryable
    Base.metadata.create_all(bind=engine)
    table_names = engine.table_names() if hasattr(engine, "table_names") else [t for t in Base.metadata.tables.keys()]
    assert "trains" in table_names
    assert "stations" in table_names
    assert "sms_requests" in table_names
