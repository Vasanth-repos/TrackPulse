"""
SMS Domain Models
Schemas for inbound SMS webhook requests, parsed SMS commands, and outbound SMS responses.
"""

from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class ParsedSMSCommand(BaseModel):
    command: str  # "ETA", "STATUS", "HELP", "INVALID"
    train_number: Optional[str] = None
    station_code: Optional[str] = None
    is_valid: bool = True
    error_message: Optional[str] = None


class IncomingSMSRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    from_number: str = Field(alias="from", default="+919876543210")
    message: str


class OutgoingSMSResponse(BaseModel):
    status: str = "success"  # "success" or "error"
    to: str
    message: str
    character_count: int = 0
    is_sms_length_compliant: bool = True
