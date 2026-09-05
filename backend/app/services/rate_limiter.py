"""
SMS Rate Limiter Service
Sliding-window in-memory rate limiter preventing spam and abuse from keypad phone callers.
Configurable via SMS_RATE_LIMIT_PER_MINUTE environment variable.
"""

import time
import os
from typing import Dict, List, Tuple


class SMSRateLimiter:
    def __init__(self, max_requests_per_minute: int = 10):
        self.max_requests = int(os.getenv("SMS_RATE_LIMIT_PER_MINUTE", max_requests_per_minute))
        self.window_seconds = 60
        self._history: Dict[str, List[float]] = {}

    def is_rate_limited(self, phone_number: str) -> Tuple[bool, int]:
        """
        Checks if a phone number exceeded rate limits.
        Returns: (is_limited, remaining_allowed)
        """
        now = time.time()
        timestamps = self._history.setdefault(phone_number, [])

        # Filter out timestamps older than the sliding window
        valid_timestamps = [t for t in timestamps if now - t < self.window_seconds]
        self._history[phone_number] = valid_timestamps

        if len(valid_timestamps) >= self.max_requests:
            return True, 0

        # Record this request
        self._history[phone_number].append(now)
        remaining = self.max_requests - len(self._history[phone_number])
        return False, remaining

    def reset(self):
        """Clears all rate limit histories (for testing)."""
        self._history.clear()


sms_rate_limiter = SMSRateLimiter()
