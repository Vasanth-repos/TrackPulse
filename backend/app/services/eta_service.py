"""
TrackPulse ETA Service
Coordinates train resolution, station lookup, quantile ETA prediction,
calibrated reliability evaluation, and stale data verification.
"""

from typing import Dict, Any, Optional
import json
from pathlib import Path
from datetime import datetime

from app.models.prediction import ETAPredictionResponse
from app.utils.validators import validate_train_number, validate_station_code
from app.services.model_service import model_service
from app.services.reliability_service import reliability_service
from app.data.data_store import data_store


class ETAService:
    def __init__(self, demo_data_path: Optional[Path] = None):
        if demo_data_path is None:
            demo_data_path = Path(__file__).resolve().parent.parent / "data" / "demo_data.json"
        self.demo_data_path = demo_data_path
        self._demo_trains: Dict[str, Dict[str, Any]] = {}
        self._load_demo_data()

    def _load_demo_data(self):
        if self.demo_data_path.exists():
            with open(self.demo_data_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                for t in data.get("trains", []):
                    self._demo_trains[t["train_number"]] = t

    def get_eta(
        self,
        train_number: str,
        station_code: str,
        simulated_data_freshness_sec: int = 40
    ) -> ETAPredictionResponse:
        """
        Calculates and returns point ETA and quantile interval for a train and station.
        Performs validation, train lookup, station matching, and reliability scoring.
        """
        # 1. Validate train number
        is_valid_train, train_err = validate_train_number(train_number)
        if not is_valid_train:
            raise ValueError(train_err)

        # 2. Validate station code
        is_valid_stn, stn_err = validate_station_code(station_code)
        if not is_valid_stn:
            raise ValueError(stn_err)

        clean_train_no = train_number.strip()
        clean_stn_code = station_code.strip().upper()

        # 3. Resolve Train (Check demo data first, then canonical data store)
        train_meta = self._demo_trains.get(clean_train_no)
        if not train_meta:
            canonical_train = data_store.get_train(clean_train_no)
            if not canonical_train:
                raise KeyError(f"Train number {clean_train_no} not found.")
            train_meta = {
                "train_number": canonical_train["train_id"],
                "train_name": canonical_train["train_name"],
                "current_delay_minutes": 18,
                "regime": "DELAYED",
                "last_updated": "14:38:20",
                "stations": [
                    {
                        "station_code": s["station_code"],
                        "station_name": s.get("station_name", s["station_code"]),
                        "p10": s["arr"],
                        "p50_eta": s["arr"],
                        "p90": s["arr"],
                        "reliability": "MEDIUM"
                    } for s in canonical_train.get("route", [])
                ]
            }

        # 4. Resolve Station in route
        stations_list = train_meta.get("stations", [])
        matched_stn = next((s for s in stations_list if s["station_code"].upper() == clean_stn_code), None)
        if not matched_stn:
            raise KeyError(f"Station code {clean_stn_code} not found on route for train {clean_train_no}.")

        stn_name = matched_stn.get("station_name", clean_stn_code)

        # 5. Call Model Service Interface
        pred = model_service.predict_eta(
            train_number=clean_train_no,
            station_code=clean_stn_code,
            features={
                "current_delay_min": train_meta.get("current_delay_minutes", 18),
                "scheduled_arrival_str": matched_stn.get("scheduled_arrival", "14:24"),
                "distance_remaining_km": matched_stn.get("distance_km", 250.0)
            }
        )

        # 6. Evaluate Calibrated Reliability & Data Freshness
        rel_tier, is_stale, note = reliability_service.evaluate_reliability(
            base_reliability=pred.get("reliability", "MEDIUM"),
            interval_width_min=17,
            data_freshness_sec=simulated_data_freshness_sec,
            regime=pred.get("regime", "DELAYED")
        )

        return ETAPredictionResponse(
            train_number=clean_train_no,
            train_name=train_meta.get("train_name", "Express"),
            station=clean_stn_code,
            station_name=stn_name,
            eta=pred.get("eta", "14:42"),
            p10=pred.get("p10", "14:35"),
            p90=pred.get("p90", "14:52"),
            reliability=rel_tier,
            regime=pred.get("regime", "DELAYED"),
            current_delay=train_meta.get("current_delay_minutes", 18),
            last_updated=train_meta.get("last_updated", "14:38:20"),
            data_source_mode="DEMO / HISTORICAL REPLAY DATA",
            reason_summary=note or pred.get("reason_summary", "Nominal progression."),
            is_stale=is_stale
        )


eta_service = ETAService()
