# api/tests/conftest.py
from datetime import datetime

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from app.main import DEFAULT_WIDGETS, app
from app.models import Incident, IncidentType, Severity, Widget


@pytest.fixture
def client():
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(engine)
    TestSession = sessionmaker(bind=engine)

    # Seed default widgets (mirrors startup lifespan)
    db = TestSession()
    for position, w in enumerate(DEFAULT_WIDGETS):
        db.add(Widget(**w, position=position))
    db.commit()
    db.close()

    def override_get_db():
        db = TestSession()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    app.dependency_overrides.clear()


@pytest.fixture
def seeded_client(client):
    """Client with test data pre-loaded."""
    from app.database import get_db as _get_db

    db: Session = next(app.dependency_overrides[_get_db]())
    incidents = [
        Incident(id="1", timestamp=datetime(2025, 1, 1, 10, 0, 0), type=IncidentType.FIRE, severity=Severity.HIGH, response_time_seconds=300, call_answer_time_seconds=5, ai_summary="Fire incident"),
        Incident(id="2", timestamp=datetime(2025, 1, 2, 11, 0, 0), type=IncidentType.MEDICAL, severity=Severity.CRITICAL, response_time_seconds=500, call_answer_time_seconds=10, ai_summary="Medical incident"),
        Incident(id="3", timestamp=datetime(2025, 1, 3, 12, 0, 0), type=IncidentType.FIRE, severity=Severity.LOW, response_time_seconds=700, call_answer_time_seconds=15, ai_summary="Another fire"),
        Incident(id="4", timestamp=datetime(2025, 1, 4, 13, 0, 0), type=IncidentType.POLICE, severity=Severity.MEDIUM, response_time_seconds=400, call_answer_time_seconds=8, ai_summary="Police incident"),
    ]
    for i in incidents:
        db.add(i)
    db.commit()
    return client
