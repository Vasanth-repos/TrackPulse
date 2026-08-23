"""
Integration tests for FastAPI endpoints
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "OPERATIONAL_ONLINE"

def test_network_summary_endpoint():
    response = client.get("/api/network/summary")
    assert response.status_code == 200
    data = response.json()
    assert "total_monitored_trains" in data
    assert data["total_monitored_trains"] > 0
    assert "average_reliability_score" in data

def test_trains_list_endpoint():
    response = client.get("/api/trains")
    assert response.status_code == 200
    trains = response.json()
    assert len(trains) > 0
    train_12627 = next((t for t in trains if t["train_id"] == "12627"), None)
    assert train_12627 is not None
    assert "predicted_eta" in train_12627
    assert "reliability_score" in train_12627

def test_train_trajectory_endpoint():
    response = client.get("/api/train/12627/trajectory")
    assert response.status_code == 200
    data = response.json()
    assert data["train_id"] == "12627"
    assert len(data["points"]) > 0
    assert "summary_trend" in data

def test_replay_session_endpoint():
    response = client.get("/api/replay/12627/session")
    assert response.status_code == 200
    data = response.json()
    assert data["train_id"] == "12627"
    assert data["total_steps"] > 0
    assert len(data["steps"]) > 0

def test_model_evaluation_endpoint():
    response = client.get("/api/model/evaluation")
    assert response.status_code == 200
    data = response.json()
    assert "models" in data
    assert len(data["models"]) == 3
    assert "calibration_curve" in data
    assert "regime_breakdown" in data

def test_data_quality_endpoint():
    response = client.get("/api/data-quality")
    assert response.status_code == 200
    data = response.json()
    assert "journey_completeness_pct" in data
    assert "data_quality_grade" in data
