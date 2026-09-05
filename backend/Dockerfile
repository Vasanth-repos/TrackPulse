# TrackPulse Railway ETA Backend Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend application source code
COPY . .

# Set environment variables
ENV PYTHONPATH="/app" \
    PYTHONUNBUFFERED=1 \
    DATABASE_URL="sqlite:///./trackpulse_dev.db" \
    SMS_PROVIDER="mock"

EXPOSE 8000

# Start FastAPI application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
