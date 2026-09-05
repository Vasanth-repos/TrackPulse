"""
SQLAlchemy Database Models for TrackPulse
Defines tables for trains, stations, schedules, train states, predictions, and SMS request audit logs.
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.database import Base


class StationDB(Base):
    __tablename__ = "stations"

    id = Column(Integer, primary_key=True, index=True)
    station_code = Column(String(10), unique=True, index=True, nullable=False)
    station_name = Column(String(100), nullable=False)
    state = Column(String(50))
    zone = Column(String(10))
    latitude = Column(Float)
    longitude = Column(Float)
    platforms = Column(Integer, default=4)


class TrainDB(Base):
    __tablename__ = "trains"

    id = Column(Integer, primary_key=True, index=True)
    train_number = Column(String(10), unique=True, index=True, nullable=False)
    train_name = Column(String(100), nullable=False)
    train_type = Column(String(50), default="Superfast Express")
    origin_code = Column(String(10), nullable=False)
    destination_code = Column(String(10), nullable=False)
    total_distance_km = Column(Float, default=0.0)


class ScheduleDB(Base):
    __tablename__ = "schedules"

    id = Column(Integer, primary_key=True, index=True)
    train_number = Column(String(10), index=True, nullable=False)
    station_code = Column(String(10), index=True, nullable=False)
    sequence = Column(Integer, nullable=False)
    scheduled_arrival = Column(String(10))
    scheduled_departure = Column(String(10))
    distance_km = Column(Float, default=0.0)


class TrainStateDB(Base):
    __tablename__ = "train_states"

    id = Column(Integer, primary_key=True, index=True)
    train_number = Column(String(10), unique=True, index=True, nullable=False)
    current_station_code = Column(String(10), nullable=False)
    next_station_code = Column(String(10), nullable=False)
    current_delay_minutes = Column(Integer, default=0)
    regime = Column(String(20), default="NORMAL")
    last_updated = Column(DateTime, default=datetime.utcnow)


class PredictionDB(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    train_number = Column(String(10), index=True, nullable=False)
    station_code = Column(String(10), index=True, nullable=False)
    predicted_eta = Column(String(10), nullable=False)
    p10 = Column(String(10), nullable=False)
    p90 = Column(String(10), nullable=False)
    reliability = Column(String(20), default="MEDIUM")
    created_at = Column(DateTime, default=datetime.utcnow)


class SMSRequestLogDB(Base):
    __tablename__ = "sms_requests"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    phone_number = Column(String(30), index=True, nullable=False)
    message = Column(String(255), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    command = Column(String(20))
    train_number = Column(String(10), nullable=True)
    station_code = Column(String(10), nullable=True)
    response_status = Column(String(20), default="success")
    response_message = Column(Text, nullable=True)
