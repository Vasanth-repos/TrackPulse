"""
TrackPulse Universal SMS Service & Carrier Gateway
Parses feature phone inbound text commands and returns carrier-friendly SMS and TwiML XML responses.
"""

from typing import Dict, Any, Tuple
from app.models.spec_schemas import SMSInboundRequest, SMSInboundResponse
from app.pnr.pnr_provider import pnr_provider
from app.services.train_service import train_service

class SMSService:
    def __init__(self):
        pass

    def mask_phone(self, phone: str) -> str:
        if len(phone) >= 6:
            return f"{phone[:3]}****{phone[-3:]}"
        return "+91******10"

    def handle_inbound_sms(self, req: SMSInboundRequest) -> SMSInboundResponse:
        raw_msg = req.message.strip()
        tokens = raw_msg.split()
        cmd = tokens[0].upper() if tokens else "HELP"

        masked_sender = self.mask_phone(req.sender)

        if cmd in ["PNR"] and len(tokens) >= 2:
            pnr_num = tokens[1]
            pnr_res = pnr_provider.get_pnr_status(pnr_num)
            resp_text = (
                f"TRACKPULSE:\n"
                f"PNR {pnr_res.pnr_masked}\n"
                f"Train {pnr_res.train_id}\n"
                f"ETA {pnr_res.passenger_destination_station}: {pnr_res.predicted_arrival}\n"
                f"Range: {pnr_res.eta_range}\n"
                f"Rel: {pnr_res.reliability_percentage}%\n"
                f"Status: {pnr_res.booking_status} ({pnr_res.coach_berth})"
            )
            command_type = "PNR_INQUIRY"

        elif cmd in ["ETA", "STATUS"] and len(tokens) >= 2:
            train_id = tokens[1]
            stn_code = tokens[2].upper() if len(tokens) >= 3 else "DEST"
            
            all_trains = train_service.get_all_trains_live()
            live_t = next((t for t in all_trains if t["train_id"] == train_id), all_trains[0])

            resp_text = (
                f"TRACKPULSE:\n"
                f"Train {train_id} {live_t['train_name']}\n"
                f"{stn_code} ETA: {live_t['predicted_eta']}\n"
                f"Range: {live_t['eta_lower_bound']}-{live_t['eta_upper_bound']}\n"
                f"Rel: {live_t['reliability_score']}%\n"
                f"Status: {live_t['regime']} (+{live_t['current_delay_min']}m)"
            )
            command_type = "ETA_INQUIRY"

        else:
            resp_text = (
                "TRACKPULSE RAILWAY SMS:\n"
                "To check train ETA: Send 'ETA <TrainNo> <StationCode>'\n"
                "To check PNR status: Send 'PNR <10-digit PNR>'\n"
                "Example: ETA 12627 BZA"
            )
            command_type = "HELP"

        return SMSInboundResponse(
            sender_masked=masked_sender,
            command_detected=command_type,
            response_text=resp_text,
            character_count=len(resp_text),
            is_sms_friendly=len(resp_text) <= 160
        )

    def generate_twiml_xml(self, response_text: str) -> str:
        """Generates carrier-ready Twilio TwiML XML payload."""
        return (
            '<?xml version="1.0" encoding="UTF-8"?>\n'
            '<Response>\n'
            f'    <Message>{response_text}</Message>\n'
            '</Response>'
        )

sms_service = SMSService()
