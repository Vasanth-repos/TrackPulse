"""
Universal SMS & Carrier Gateway API Router
Supports JSON and Carrier Twilio TwiML XML payloads.
"""

from typing import Optional
from fastapi import APIRouter, Request, Response, Form
from app.models.spec_schemas import SMSInboundRequest, SMSInboundResponse
from app.sms.sms_service import sms_service

router = APIRouter(prefix="", tags=["Universal SMS & Carrier Gateway"])

@router.post("/sms/inbound")
async def handle_inbound_sms(
    request: Request,
    format: Optional[str] = None
):
    """
    Processes inbound SMS inquiries for ETA or PNR.
    Supports JSON body {"sender": "...", "message": "..."} OR
    Twilio form-encoded webhooks (From, Body) returning TwiML XML.
    """
    content_type = request.headers.get("content-type", "")

    if "application/json" in content_type:
        body = await request.json()
        req = SMSInboundRequest(
            sender=body.get("sender", "+919876543210"),
            message=body.get("message", "HELP")
        )
    else:
        form_data = await request.form()
        sender = form_data.get("From", "+919876543210")
        message = form_data.get("Body", "HELP")
        req = SMSInboundRequest(sender=str(sender), message=str(message))

    sms_res = sms_service.handle_inbound_sms(req)

    # Return TwiML XML if requested by format param or accept header
    accept = request.headers.get("accept", "")
    if format == "twiml" or "xml" in accept or "application/x-www-form-urlencoded" in content_type:
        xml_content = sms_service.generate_twiml_xml(sms_res.response_text)
        return Response(content=xml_content, media_type="application/xml")

    return sms_res
