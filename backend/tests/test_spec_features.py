import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_network_analyze_endpoint():
    res = client.post("/api/network/analyze", json={"station_id": "MAS", "time_window_minutes": 180})
    assert res.status_code == 200
    data = res.json()
    assert data["station_id"] == "MAS"
    assert len(data["incoming_trains"]) > 0
    assert len(data["outgoing_trains"]) > 0
    assert "propagation_chains" in data

def test_recommendation_endpoint():
    req = {
        "source": "MAS",
        "destination": "NDLS",
        "journey_date": "2026-09-10",
        "departure_window_start": "06:00",
        "departure_window_end": "23:00",
        "max_acceptable_delay_min": 30,
        "connection_required": True,
        "connecting_departure_time": "15:00"
    }
    res = client.post("/api/recommend", json=req)
    assert res.status_code == 200
    data = res.json()
    assert data["total_candidates_found"] > 0
    assert data["recommended_train"] is not None
    assert data["recommended_train"]["overall_recommendation_score"] > 0

def test_what_if_simulation_endpoint():
    req = {
        "train_id": "12627",
        "delay_injection_minutes": 30,
        "injection_station_code": "NLR",
        "delay_cause_category": "SECTION_HALT"
    }
    res = client.post("/api/simulate", json=req)
    assert res.status_code == 200
    data = res.json()
    assert data["primary_train_id"] == "12627"
    assert len(data["affected_trains"]) >= 2
    assert data["network_stability_index"] < 100

def test_pnr_status_endpoint():
    req = {"pnr": "4281903490"}
    res = client.post("/api/pnr/status", json=req)
    assert res.status_code == 200
    data = res.json()
    assert data["pnr_masked"] == "********90"
    assert data["train_id"] == "12627"
    assert data["booking_status"] == "CONFIRMED"

def test_sms_inbound_endpoint():
    # Test ETA command
    res1 = client.post("/api/sms/inbound", json={"sender": "+919876543210", "message": "ETA 12627 BZA"})
    assert res1.status_code == 200
    data1 = res1.json()
    assert data1["command_detected"] == "ETA_INQUIRY"
    assert "TRACKPULSE" in data1["response_text"]
    assert data1["is_sms_friendly"] is True

    # Test PNR command
    res2 = client.post("/api/sms/inbound", json={"sender": "+919876543210", "message": "PNR 4281903490"})
    assert res2.status_code == 200
    data2 = res2.json()
    assert data2["command_detected"] == "PNR_INQUIRY"
    assert "********90" in data2["response_text"]

def test_sms_inbound_twiml_endpoint():
    res = client.post("/api/sms/inbound?format=twiml", json={"sender": "+919876543210", "message": "ETA 12627 BZA"})
    assert res.status_code == 200
    assert "application/xml" in res.headers["content-type"]
    assert "<Response>" in res.text
    assert "<Message>" in res.text

def test_data_store_and_invariants():
    from app.data.data_store import data_store
    stn = data_store.get_station("MAS")
    assert stn is not None
    assert stn["name"] == "MGR Chennai Central"

    train = data_store.get_train("12627")
    assert train is not None
    assert train["train_name"] == "Karnataka Express"

    sec = data_store.get_section_stats("SBC", "DMM")
    assert sec is not None
    assert sec["distance_km"] == 181.0

def test_risk_classifier_engine():
    from app.ml.risk_classifier import risk_classifier
    res = risk_classifier.predict_risk(
        current_delay_min=35,
        delay_trend_1_sec=4,
        delay_trend_3_sec=8,
        from_station="SBC",
        to_station="DMM",
        distance_remaining_km=800,
        stations_remaining=12,
        hour_of_day=14
    )
    assert res["risk_category"] in ["LOW", "MEDIUM", "HIGH"]
    assert res["model_metadata"]["roc_auc_score"] >= 0.90

def test_api_route_aliases():
    res_eta = client.get("/api/trains/12627/eta")
    assert res_eta.status_code == 200
    assert res_eta.json()["train_id"] == "12627"

    res_metrics = client.get("/api/metrics")
    assert res_metrics.status_code == 200

    res_replay = client.get("/api/replay")
    assert res_replay.status_code == 200
