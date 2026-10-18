# api/tests/test_models.py
from datetime import datetime

from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from app.database import Base
from app.models import Incident, IncidentType, Severity


def test_create_incident():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)

    with Session(engine) as session:
        incident = Incident(
            id="0b6f2c1e-8d4a-4f3b-9a7e-2c5d1e9f4a10",
            timestamp=datetime.fromisoformat("2025-02-14T09:30:00"),
            type=IncidentType.FIRE,
            severity=Severity.MEDIUM,
            response_time_seconds=225,
            call_answer_time_seconds=18,
            ai_summary="Shed fire in a backyard.",
        )
        session.add(incident)
        session.commit()

        saved = session.get(Incident, "0b6f2c1e-8d4a-4f3b-9a7e-2c5d1e9f4a10")
        assert saved.type == IncidentType.FIRE
        assert saved.response_time_seconds == 225
