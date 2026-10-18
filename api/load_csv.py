# api/load_csv.py
import csv
from datetime import datetime
from pathlib import Path

from sqlalchemy.orm import Session

from app.database import Base, engine, SessionLocal
from app.models import Incident, IncidentType, Severity

CSV_PATH = Path(__file__).resolve().parent / "data" / "incidents.csv"


def load():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        existing = db.query(Incident).count()
        if existing > 0:
            print(f"Database already has {existing} incidents. Skipping.")
            return

        with open(CSV_PATH, newline="") as f:
            reader = csv.DictReader(f)
            for row in reader:
                incident = Incident(
                    id=row["id"],
                    timestamp=datetime.fromisoformat(row["timestamp"]),
                    type=IncidentType(row["type"]),
                    severity=Severity(row["severity"]),
                    response_time_seconds=int(row["response_time_seconds"]),
                    call_answer_time_seconds=int(row["call_answer_time_seconds"]),
                    ai_summary=row["ai_summary"],
                )
                db.add(incident)

        db.commit()
        print(f"Loaded {db.query(Incident).count()} incidents.")
    finally:
        db.close()


if __name__ == "__main__":
    load()
