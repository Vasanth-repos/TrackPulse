"""
TrackPulse Real SMS Testing Tool
Test sending real SMS and handling incoming carrier webhooks.
"""

import os
import sys
import argparse
import urllib.request
import urllib.parse
import json

def test_webhook_locally(phone: str, message: str):
    url = "http://127.0.0.1:8000/api/sms/inbound"
    data = urllib.parse.urlencode({"From": phone, "Body": message}).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    try:
        with urllib.request.urlopen(req) as resp:
            print(f"\n[HTTP {resp.status} Response from Webhook]:")
            print(resp.read().decode("utf-8"))
    except Exception as e:
        print(f"Error testing local webhook: {e}")

def send_real_twilio_sms(to_phone: str, message: str):
    account_sid = os.getenv("TWILIO_ACCOUNT_SID")
    auth_token = os.getenv("TWILIO_AUTH_TOKEN")
    from_phone = os.getenv("TWILIO_PHONE_NUMBER")

    if not account_sid or not auth_token or not from_phone:
        print("[!] Twilio credentials not set in environment.")
        print("Please set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER in your .env file.")
        return

    url = f"https://api.twilio.com/2010-04-01/Accounts/{account_sid}/Messages.json"
    data = urllib.parse.urlencode({
        "From": from_phone,
        "To": to_phone,
        "Body": message
    }).encode("utf-8")

    import base64
    auth_str = f"{account_sid}:{auth_token}"
    auth_header = f"Basic {base64.b64encode(auth_str.encode()).decode()}"

    req = urllib.request.Request(
        url,
        data=data,
        headers={
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": auth_header
        }
    )

    try:
        with urllib.request.urlopen(req) as resp:
            res_data = json.loads(resp.read().decode("utf-8"))
            print(f"[OK] SMS successfully sent via Twilio! SID: {res_data.get('sid')}")
    except Exception as e:
        print(f"[!] Error sending SMS via Twilio: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="TrackPulse SMS Gateway Tester")
    parser.add_argument("--phone", default="+919876543210", help="Sender phone number (e.g. +919876543210)")
    parser.add_argument("--msg", default="ETA 12627 BZA", help="SMS message text (e.g. ETA 12627 BZA)")
    parser.add_argument("--real", action="store_true", help="Send outbound SMS via Twilio API")

    args = parser.parse_args()

    if args.real:
        print(f"Sending real SMS to {args.phone}...")
        send_real_twilio_sms(args.phone, args.msg)
    else:
        print(f"Testing carrier webhook for incoming SMS from {args.phone}: '{args.msg}'")
        test_webhook_locally(args.phone, args.msg)
