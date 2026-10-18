# api/app/models.py
import enum
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Enum, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class IncidentType(str, enum.Enum):
    FIRE = "Fire"
    MEDICAL = "Medical"
    POLICE = "Police"
    TRAFFIC = "Traffic"


class Severity(str, enum.Enum):
    CRITICAL = "Critical"
    HIGH = "High"
    MEDIUM = "Medium"
    LOW = "Low"


class Incident(Base):
    __tablename__ = "incidents"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime, index=True)
    type: Mapped[IncidentType] = mapped_column(Enum(IncidentType), index=True)
    severity: Mapped[Severity] = mapped_column(Enum(Severity), index=True)
    response_time_seconds: Mapped[int] = mapped_column(Integer)
    call_answer_time_seconds: Mapped[int] = mapped_column(Integer)
    ai_summary: Mapped[str] = mapped_column(Text)


class Widget(Base):
    __tablename__ = "widgets"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    widget_id: Mapped[str] = mapped_column(String(50), unique=True)
    col_span: Mapped[int] = mapped_column(Integer)
    visible: Mapped[bool] = mapped_column(Boolean, default=True)
    position: Mapped[int] = mapped_column(Integer)
