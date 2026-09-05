"""
TrackPulse Canonical In-Memory O(1) Fast Hash Cache & Ingestion Store
Loads canonical stations, trains, section statistics, and network dependencies.
Provides O(1) indexing and live telemetry ingestion.
"""

import json
import os
from typing import Dict, List, Optional, Any
from pathlib import Path

class CanonicalDataStore:
    _instance: Optional['CanonicalDataStore'] = None

    def __init__(self):
        self._stations_by_code: Dict[str, Dict[str, Any]] = {}
        self._trains_by_id: Dict[str, Dict[str, Any]] = {}
        self._sections_by_key: Dict[str, Dict[str, Any]] = {}
        self._dependencies: List[Dict[str, Any]] = []
        self._dependencies_by_incoming: Dict[str, List[Dict[str, Any]]] = {}
        self._dependencies_by_outgoing: Dict[str, List[Dict[str, Any]]] = {}
        self._dependencies_by_station: Dict[str, List[Dict[str, Any]]] = {}
        self._live_telemetry: Dict[str, Dict[str, Any]] = {}

        self._load_seed_data()

    @classmethod
    def get_instance(cls) -> 'CanonicalDataStore':
        if cls._instance is None:
            cls._instance = CanonicalDataStore()
        return cls._instance

    def _get_seed_path(self, filename: str) -> Path:
        # Check backend/data/seed, then data/seed
        candidates = [
            Path(__file__).resolve().parent.parent.parent / "data" / "seed" / filename,
            Path(__file__).resolve().parent.parent.parent.parent / "data" / "seed" / filename,
            Path("data") / "seed" / filename,
            Path("backend") / "data" / "seed" / filename
        ]
        for p in candidates:
            if p.exists():
                return p
        # Default fallback
        return candidates[0]

    def _load_seed_data(self):
        # 1. Stations
        stations_path = self._get_seed_path("canonical_stations.json")
        if stations_path.exists():
            with open(stations_path, "r", encoding="utf-8") as f:
                self._stations_by_code = json.load(f)

        # 2. Trains
        trains_path = self._get_seed_path("canonical_trains.json")
        if trains_path.exists():
            with open(trains_path, "r", encoding="utf-8") as f:
                trains_list = json.load(f)
                for t in trains_list:
                    self._trains_by_id[t["train_id"]] = t

        # 3. Section Statistics
        sections_path = self._get_seed_path("section_statistics.json")
        if sections_path.exists():
            with open(sections_path, "r", encoding="utf-8") as f:
                self._sections_by_key = json.load(f)

        # 4. Dependencies
        deps_path = self._get_seed_path("canonical_dependencies.json")
        if deps_path.exists():
            with open(deps_path, "r", encoding="utf-8") as f:
                self._dependencies = json.load(f)
                for dep in self._dependencies:
                    inc = dep.get("incoming_train_id")
                    out = dep.get("outgoing_train_id")
                    stn = dep.get("station_code")

                    if inc:
                        self._dependencies_by_incoming.setdefault(inc, []).append(dep)
                    if out:
                        self._dependencies_by_outgoing.setdefault(out, []).append(dep)
                    if stn:
                        self._dependencies_by_station.setdefault(stn, []).append(dep)

    # -------------------------------------------------------------
    # Fast O(1) Accessors
    # -------------------------------------------------------------

    def get_station(self, code: str) -> Optional[Dict[str, Any]]:
        return self._stations_by_code.get(code)

    def get_all_stations(self) -> List[Dict[str, Any]]:
        return list(self._stations_by_code.values())

    def get_train(self, train_id: str) -> Optional[Dict[str, Any]]:
        return self._trains_by_id.get(train_id)

    def get_all_trains(self) -> List[Dict[str, Any]]:
        return list(self._trains_by_id.values())

    def get_section_stats(self, from_station: str, to_station: str) -> Optional[Dict[str, Any]]:
        key = f"{from_station}_{to_station}"
        rev_key = f"{to_station}_{from_station}"
        return self._sections_by_key.get(key) or self._sections_by_key.get(rev_key)

    def get_dependencies_for_station(self, station_code: str) -> List[Dict[str, Any]]:
        return self._dependencies_by_station.get(station_code, [])

    def get_outgoing_dependency(self, incoming_train_id: str) -> Optional[Dict[str, Any]]:
        deps = self._dependencies_by_incoming.get(incoming_train_id, [])
        return deps[0] if deps else None

    def get_incoming_dependency(self, outgoing_train_id: str) -> Optional[Dict[str, Any]]:
        deps = self._dependencies_by_outgoing.get(outgoing_train_id, [])
        return deps[0] if deps else None

    def ingest_live_telemetry(self, train_id: str, telemetry: Dict[str, Any]):
        """Fast hash cache store for live RTIS/CRIS telemetry updates"""
        self._live_telemetry[train_id] = telemetry

    def get_live_telemetry(self, train_id: str) -> Optional[Dict[str, Any]]:
        return self._live_telemetry.get(train_id)

# Singleton global instance
data_store = CanonicalDataStore.get_instance()
