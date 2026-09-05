"""
TrackPulse SMS & Train Input Validators
Utility functions to validate train numbers, station codes, phone numbers, and command structures.
"""

import re
from typing import Tuple, Optional

# Valid Indian Railways train number: 5 digits (e.g. 12627) or 4 digits (older numbering)
TRAIN_REGEX = re.compile(r"^\d{4,5}$")

# Valid Station code: 2 to 6 uppercase alphabetic characters (e.g. BZA, NDLS, MAS, MALM)
STATION_REGEX = re.compile(r"^[A-Za-z]{2,6}$")

# Phone number: E.164 format or standard 10/12-digit Indian mobile format
PHONE_REGEX = re.compile(r"^\+?[0-9]{10,15}$")


def validate_train_number(train_number: str) -> Tuple[bool, Optional[str]]:
    """Validates train number format."""
    cleaned = train_number.strip()
    if not cleaned:
        return False, "Train number is required."
    if not TRAIN_REGEX.match(cleaned):
        return False, "Invalid train number. Must be a 4 or 5-digit number (e.g. 12627)."
    return True, None


def validate_station_code(station_code: str) -> Tuple[bool, Optional[str]]:
    """Validates railway station code format."""
    cleaned = station_code.strip()
    if not cleaned:
        return False, "Station code is required."
    if not STATION_REGEX.match(cleaned):
        return False, "Invalid station code. Must be 2-6 alphabetic characters (e.g. BZA, MAS)."
    return True, None


def validate_phone_number(phone_number: str) -> Tuple[bool, Optional[str]]:
    """Validates sender phone number format."""
    cleaned = phone_number.strip()
    if not cleaned:
        return False, "Phone number is required."
    if not PHONE_REGEX.match(cleaned):
        return False, "Invalid phone number format."
    return True, None


def mask_phone_number(phone_number: str) -> str:
    """Masks phone number for privacy preservation."""
    cleaned = phone_number.strip()
    if len(cleaned) >= 8:
        return f"{cleaned[:3]}****{cleaned[-4:]}"
    return "+91******10"
