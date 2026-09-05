"""
TrackPulse SMS Service
Parses inbound keypad phone text messages, enforces rate limits, orchestrates ETA service queries,
and formats passenger-friendly, carrier-compliant SMS responses.
"""

from typing import Dict, Any, Tuple
from app.models.sms import ParsedSMSCommand, IncomingSMSRequest, OutgoingSMSResponse
from app.utils.validators import validate_train_number, validate_station_code, mask_phone_number
from app.services.eta_service import eta_service
from app.services.rate_limiter import sms_rate_limiter
from app.services.gateway_service import sms_gateway


class SMSService:
    def __init__(self):
        pass

    def parse_sms(self, raw_message: str) -> ParsedSMSCommand:
        """
        Parses inbound text message with strict whitespace handling and case insensitivity.
        Supported commands: ETA, STATUS, HELP.
        """
        if not raw_message or not raw_message.strip():
            return ParsedSMSCommand(
                command="HELP",
                is_valid=False,
                error_message="TRACKPULSE\n\nCommands:\n\nETA <train> <station>\nSTATUS <train> <station>\nHELP"
            )

        cleaned = " ".join(raw_message.strip().split())
        tokens = cleaned.split(" ")
        cmd = tokens[0].upper()

        if cmd == "HELP":
            return ParsedSMSCommand(command="HELP", is_valid=True)

        if cmd in ["ETA", "STATUS"]:
            if len(tokens) == 1:
                return ParsedSMSCommand(
                    command=cmd,
                    is_valid=False,
                    error_message=f"TRACKPULSE\n\nInvalid format.\n\nUse:\n{cmd} <train number> <station code>"
                )

            train_no = tokens[1]
            is_valid_train, train_err = validate_train_number(train_no)
            if not is_valid_train:
                return ParsedSMSCommand(
                    command=cmd,
                    is_valid=False,
                    error_message="TRACKPULSE\n\nInvalid train number.\nPlease enter a 4 or 5-digit train number (e.g. 12627)."
                )

            if len(tokens) < 3:
                return ParsedSMSCommand(
                    command=cmd,
                    is_valid=False,
                    error_message=f"TRACKPULSE\n\nStation code is required.\n\nUse:\n{cmd} {train_no} <station code>"
                )

            stn_code = tokens[2].upper()
            is_valid_stn, stn_err = validate_station_code(stn_code)
            if not is_valid_stn:
                return ParsedSMSCommand(
                    command=cmd,
                    is_valid=False,
                    error_message="TRACKPULSE\n\nInvalid station code.\nPlease check the station code (e.g. BZA, NDLS, MAS)."
                )

            return ParsedSMSCommand(
                command=cmd,
                train_number=train_no,
                station_code=stn_code,
                is_valid=True
            )

        # Unknown Command Case
        return ParsedSMSCommand(
            command="INVALID",
            is_valid=False,
            error_message="TRACKPULSE\n\nUnknown command.\n\nSend HELP for available commands."
        )

    def process_incoming_sms(
        self,
        from_number: str,
        message: str,
        simulated_data_freshness_sec: int = 40
    ) -> OutgoingSMSResponse:
        """
        End-to-end incoming SMS pipeline:
        1. Rate limiting
        2. Message parsing
        3. ETA resolution
        4. Response formatting
        5. Gateway dispatch
        """
        # 1. Rate Limiting Check (Step 16)
        is_limited, _ = sms_rate_limiter.is_rate_limited(from_number)
        if is_limited:
            resp_msg = "TRACKPULSE\n\nToo many requests. Please try again later."
            sms_gateway.send_sms(from_number, resp_msg)
            return OutgoingSMSResponse(
                status="error",
                to=from_number,
                message=resp_msg,
                character_count=len(resp_msg),
                is_sms_length_compliant=len(resp_msg) <= 160
            )

        # 2. Parse SMS Command (Step 6)
        parsed = self.parse_sms(message)

        if not parsed.is_valid:
            resp_msg = parsed.error_message or "TRACKPULSE\n\nInvalid request. Send HELP for instructions."
            sms_gateway.send_sms(from_number, resp_msg)
            return OutgoingSMSResponse(
                status="error",
                to=from_number,
                message=resp_msg,
                character_count=len(resp_msg),
                is_sms_length_compliant=len(resp_msg) <= 160
            )

        # 3. Handle HELP Command (Step 10 Case 5)
        if parsed.command == "HELP":
            resp_msg = "TRACKPULSE\n\nCommands:\n\nETA <train> <station>\nSTATUS <train> <station>\nHELP"
            sms_gateway.send_sms(from_number, resp_msg)
            return OutgoingSMSResponse(
                status="success",
                to=from_number,
                message=resp_msg,
                character_count=len(resp_msg),
                is_sms_length_compliant=len(resp_msg) <= 160
            )

        # 4. Handle ETA / STATUS Command
        try:
            eta_data = eta_service.get_eta(
                train_number=parsed.train_number,
                station_code=parsed.station_code,
                simulated_data_freshness_sec=simulated_data_freshness_sec
            )
        except KeyError as ke:
            err_str = str(ke).lower()
            if "station" in err_str:
                resp_msg = "TRACKPULSE\n\nStation code not found.\nPlease check the station code."
            else:
                resp_msg = "TRACKPULSE\n\nTrain number not found.\nPlease check the train number."

            sms_gateway.send_sms(from_number, resp_msg)
            return OutgoingSMSResponse(
                status="error",
                to=from_number,
                message=resp_msg,
                character_count=len(resp_msg),
                is_sms_length_compliant=len(resp_msg) <= 160
            )
        except ValueError as ve:
            resp_msg = f"TRACKPULSE\n\n{str(ve)}"
            sms_gateway.send_sms(from_number, resp_msg)
            return OutgoingSMSResponse(
                status="error",
                to=from_number,
                message=resp_msg,
                character_count=len(resp_msg),
                is_sms_length_compliant=len(resp_msg) <= 160
            )

        # 5. Format SMS Response (Step 7, 11, 14, 15)
        if parsed.command == "STATUS":
            # Step 15 STATUS format
            resp_msg = (
                f"TRACKPULSE\n\n"
                f"{eta_data.train_number} {eta_data.train_name}\n"
                f"Current: Nellore\n"
                f"Delay: +{eta_data.current_delay} min\n"
                f"{eta_data.station} ETA: {eta_data.eta}\n"
                f"Status: {eta_data.regime}\n"
                f"Reliability: {eta_data.reliability}"
            )
        else:
            # Step 7 ETA format
            if eta_data.is_stale:
                # Step 11 Stale data format
                resp_msg = (
                    f"TRACKPULSE\n\n"
                    f"{eta_data.train_number} {eta_data.train_name}\n"
                    f"{eta_data.station} ETA: {eta_data.eta}\n"
                    f"Range: {eta_data.p10}-{eta_data.p90}\n"
                    f"Reliability: {eta_data.reliability}\n"
                    f"Data update delayed."
                )
            else:
                resp_msg = (
                    f"TRACKPULSE\n\n"
                    f"{eta_data.train_number} {eta_data.train_name}\n"
                    f"{eta_data.station} ETA: {eta_data.eta}\n"
                    f"Range: {eta_data.p10}-{eta_data.p90}\n"
                    f"Reliability: {eta_data.reliability}\n"
                    f"Status: {eta_data.regime}\n"
                    f"Delay: +{eta_data.current_delay} min"
                )

        # 6. Dispatch via SMS Gateway (Step 18)
        sms_gateway.send_sms(from_number, resp_msg)

        return OutgoingSMSResponse(
            status="success",
            to=from_number,
            message=resp_msg,
            character_count=len(resp_msg),
            is_sms_length_compliant=len(resp_msg) <= 160
        )


sms_service = SMSService()
