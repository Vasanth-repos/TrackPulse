"""
Universal SMS Gateway API Router
Exposes POST /api/sms/incoming for SMS Gateway Webhook integration and local simulator.
Also maintains /api/sms/inbound for TwiML carrier compatibility.
"""

from typing import Optional
from fastapi import APIRouter, Request, Response
from app.models.sms import IncomingSMSRequest, OutgoingSMSResponse
from app.services.sms_service import sms_service
from app.sms.sms_service import sms_service as spec_sms_service
from app.models.spec_schemas import SMSInboundRequest

router = APIRouter(prefix="/sms", tags=["SMS Gateway & Simulator"])


@router.post("/incoming", response_model=OutgoingSMSResponse)
def receive_incoming_sms(
    payload: IncomingSMSRequest,
    data_freshness_sec: int = 40
):
    """
    Primary SMS Gateway Webhook Endpoint (Step 8).
    Receives incoming text messages from keypad phone users, executes parsing,
    invokes ETA service, and returns structured carrier-friendly response.
    """
    return sms_service.process_incoming_sms(
        from_number=payload.from_number,
        message=payload.message,
        simulated_data_freshness_sec=data_freshness_sec
    )


@router.post("/inbound")
async def handle_inbound_sms_legacy(
    request: Request,
    format: Optional[str] = None
):
    """
    Carrier & TwiML XML Gateway Endpoint for Spec & Carrier Compatibility.
    Accepts both JSON and form-encoded webhooks.
    """
    content_type = request.headers.get("content-type", "")

    if "application/json" in content_type:
        body = await request.json()
        sender = body.get("sender", body.get("from", "+919876543210"))
        message = body.get("message", "HELP")
    else:
        form_data = await request.form()
        sender = form_data.get("From", "+919876543210")
        message = form_data.get("Body", "HELP")

    spec_res = spec_sms_service.handle_inbound_sms(
        SMSInboundRequest(sender=str(sender), message=str(message))
    )

    accept = request.headers.get("accept", "")
    if format == "twiml" or "xml" in accept or "application/x-www-form-urlencoded" in content_type:
        xml_content = spec_sms_service.generate_twiml_xml(spec_res.response_text)
        return Response(content=xml_content, media_type="application/xml")

    return spec_res
