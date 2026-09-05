"""
Adaptive ETA Reliability & Forecasting System - FastAPI Server
Main Entry Point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api.trains import router as trains_router
from app.api.eta import router as eta_router
from app.api.replay import router as replay_router
from app.api.metrics import router as metrics_router
from app.api.audit import router as audit_router
from app.api.network import router as network_router
from app.api.recommend import router as recommend_router
from app.api.simulate import router as simulate_router
from app.api.pnr import router as pnr_router
from app.api.sms import router as sms_router
from app.db.database import init_db

app = FastAPI(
    title="🚆 TrackPulse — Dynamic ETA & Multi-Train Delay Intelligence API",
    description=(
        "Production-grade, reliability-aware train ETA forecasting layer for Indian Railways coaching trains. "
        "Provides point ETA, quantile prediction intervals (P10/P50/P90), multi-train delay propagation, "
        "passenger recommendation scoring, what-if simulations, PNR intelligence, and universal SMS gateway."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Initialize database schema tables on application startup
@app.on_event("startup")
def on_startup():
    init_db()

# Configure CORS for local development and demo presentation
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(eta_router, prefix="/api")
app.include_router(trains_router, prefix="/api")
app.include_router(replay_router, prefix="/api")
app.include_router(metrics_router, prefix="/api")
app.include_router(audit_router, prefix="/api")
app.include_router(network_router, prefix="/api")
app.include_router(recommend_router, prefix="/api")
app.include_router(simulate_router, prefix="/api")
app.include_router(pnr_router, prefix="/api")
app.include_router(sms_router, prefix="/api")

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
