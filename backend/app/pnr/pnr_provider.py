"""
TrackPulse PNR Intelligence Adapter
Implements the IPNRProvider interface separating mock prototype data from authorized production feeds.
Provides masked PNR outputs, journey bounds, and dynamic ETA estimation for passengers.
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from app.models.spec_schemas import PNRStatusResponse
from app.data.coaching_trains_dataset import get_train_by_id
from app.services.train_service import train_service

class IPNRProvider(ABC):
    @abstractmethod
    def get_pnr_status(self, pnr: str) -> Optional[PNRStatusResponse]:
        pass

class MockPNRProvider(IPNRProvider):
    def __init__(self):
        # Realistic Indian Railways coaching PNR seed registry
        self.pnr_records: Dict[str, Dict[str, Any]] = {
            "4281903490": {
                "train_id": "12627",
                "boarding": "MAS",
                "destination": "NDLS",
                "date": "2026-09-10",
                "status": "CONFIRMED",
                "coach": "B4 - Berth 24 (Side Lower)"
            },
            "8491028374": {
                "train_id": "12951",
                "boarding": "MMCT",
                "destination": "NDLS",
                "date": "2026-09-10",
                "status": "CONFIRMED",
                "coach": "A2 - Berth 18 (Lower)"
            },
            "1234567890": {
                "train_id": "12627",
                "boarding": "MAS",
                "destination": "BZA",
                "date": "2026-09-10",
                "status": "CONFIRMED",
                "coach": "S3 - Berth 45 (Middle)"
            },
            "9876543210": {
                "train_id": "12840",
                "boarding": "MAS",
                "destination": "HWH",
                "date": "2026-09-10",
                "status": "RAC",
                "coach": "RAC - 12"
            },
            "5544332211": {
                "train_id": "12640",
                "boarding": "MAS",
                "destination": "SBC",
                "date": "2026-09-10",
                "status": "CONFIRMED",
                "coach": "D1 - Seat 14"
            },
            "7788990011": {
                "train_id": "22436",
                "boarding": "NDLS",
                "destination": "BSB",
                "date": "2026-09-10",
                "status": "CONFIRMED",
                "coach": "C3 - Seat 22 (Window)"
            }
        }

    def mask_pnr(self, pnr: str) -> str:
        clean = "".join(filter(str.isdigit, pnr))
        if len(clean) >= 4:
            return f"{'*' * (len(clean) - 2)}{clean[-2:]}"
        return "********90"

    def get_pnr_status(self, pnr: str) -> PNRStatusResponse:
        clean_pnr = "".join(filter(str.isdigit, pnr))
        rec = self.pnr_records.get(clean_pnr)

        if not rec:
            # Fallback default demo PNR for unlisted numbers
            rec = self.pnr_records["4281903490"]
            clean_pnr = "4281903490"

        train_id = rec["train_id"]
        train_meta = get_train_by_id(train_id)
        
        all_trains = train_service.get_all_trains_live()
        live_train = next((t for t in all_trains if t["train_id"] == train_id), all_trains[0])

        masked = self.mask_pnr(clean_pnr)

        conn_risk = "SAFE" if live_train["current_delay_min"] <= 15 else "AT_RISK"

        summary = (
            f"Train {train_id} {train_meta['train_name']} is currently running with +{live_train['current_delay_min']}m delay. "
            f"Expected arrival at {rec['destination']} is {live_train['predicted_eta']} (Uncertainty window: {live_train['eta_lower_bound']}–{live_train['eta_upper_bound']})."
        )

        return PNRStatusResponse(
            pnr_masked=masked,
            train_id=train_id,
            train_name=train_meta["train_name"],
            train_type=train_meta["train_type"],
            origin_station_code=train_meta["origin_station_code"],
            destination_station_code=train_meta["destination_station_code"],
            passenger_boarding_station=rec["boarding"],
            passenger_destination_station=rec["destination"],
            journey_date=rec["date"],
            booking_status=rec["status"],
            coach_berth=rec["coach"],
            current_delay_min=live_train["current_delay_min"],
            predicted_arrival=live_train["predicted_eta"],
            eta_range=f"{live_train['eta_lower_bound']} – {live_train['eta_upper_bound']}",
            reliability_percentage=live_train["reliability_score"],
            connection_risk=conn_risk,
            status_summary=summary,
            is_mock_provider=True
        )

class AuthorizedPNRProvider(IPNRProvider):
    """Production Adapter for officially authorized Indian Railways CRIS / RTIS API."""
    def __init__(self, api_endpoint: Optional[str] = None, api_key: Optional[str] = None):
        self.api_endpoint = api_endpoint
        self.api_key = api_key

    def get_pnr_status(self, pnr: str) -> Optional[PNRStatusResponse]:
        # Production hook for authenticated backend calls
        raise NotImplementedError("Authorized Railway API credentials must be configured via environment variables.")

# Singleton export
pnr_provider: IPNRProvider = MockPNRProvider()
