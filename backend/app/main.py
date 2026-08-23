"""
Adaptive ETA Reliability & Forecasting System - FastAPI Server
Main Entry Point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api.trains import router as trains_router
from app.api.replay import router as replay_router
from app.api.metrics import router as metrics_router
from app.api.audit import router as audit_router

app = FastAPI(
    title="🚆 Adaptive ETA Reliability & Forecasting API",
    description=(
        "Production-grade, reliability-aware train ETA forecasting layer for Indian Railways coaching trains. "
        "Provides point ETA, quantile prediction intervals, calibrated reliability scores, auditable evidence, "
        "and real-time streaming historical replay."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS for local development and demo presentation
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(trains_router, prefix="/api")
app.include_router(replay_router, prefix="/api")
app.include_router(metrics_router, prefix="/api")
app.include_router(audit_router, prefix="/api")

@app.get("/")
def root():
    return {
        "system": "Adaptive ETA Reliability & Forecasting System for Indian Coaching Trains",
        "status": "OPERATIONAL_ONLINE",
        "docs_url": "/docs",
        "core_differentiator": "Don't just predict the ETA. Predict how reliable that ETA currently is.",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
