from fastapi import APIRouter, Depends
from sqlalchemy import extract, func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Incident, Severity
from app.schemas import MonthlyCount, ResponseTimeByType, SeverityCount, StatsResponse, TrendData

router = APIRouter(tags=["stats"])

MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]


def _pct_change(old: float, new: float) -> float | None:
    if old == 0:
        return None
    return round(((new - old) / old) * 100, 1)


def _compute_trends(db: Session) -> TrendData:
    median_ts = db.query(Incident.timestamp).order_by(Incident.timestamp).offset(
        db.query(func.count(Incident.id)).scalar() // 2
    ).limit(1).scalar()

    if median_ts is None:
        return TrendData()

    earlier = db.query(Incident).filter(Incident.timestamp < median_ts)
    later = db.query(Incident).filter(Incident.timestamp >= median_ts)

    earlier_total = earlier.count()
    later_total = later.count()

    earlier_avg_call = db.query(func.avg(Incident.call_answer_time_seconds)).filter(
        Incident.timestamp < median_ts
    ).scalar() or 0.0
    later_avg_call = db.query(func.avg(Incident.call_answer_time_seconds)).filter(
        Incident.timestamp >= median_ts
    ).scalar() or 0.0

    earlier_avg_resp = db.query(func.avg(Incident.response_time_seconds)).filter(
        Incident.timestamp < median_ts
    ).scalar() or 0.0
    later_avg_resp = db.query(func.avg(Incident.response_time_seconds)).filter(
        Incident.timestamp >= median_ts
    ).scalar() or 0.0

    earlier_critical = db.query(func.count(Incident.id)).filter(
        Incident.timestamp < median_ts, Incident.severity == Severity.CRITICAL
    ).scalar()
    later_critical = db.query(func.count(Incident.id)).filter(
        Incident.timestamp >= median_ts, Incident.severity == Severity.CRITICAL
    ).scalar()

    return TrendData(
        total_incidents=_pct_change(earlier_total, later_total),
        avg_call_answer_time=_pct_change(earlier_avg_call, later_avg_call),
        avg_response_time=_pct_change(earlier_avg_resp, later_avg_resp),
        critical_incidents=_pct_change(earlier_critical, later_critical),
    )


@router.get("/stats", response_model=StatsResponse)
def get_stats(db: Session = Depends(get_db)):
    total = db.query(func.count(Incident.id)).scalar()

    avg_call_answer = db.query(
        func.avg(Incident.call_answer_time_seconds)
    ).scalar() or 0.0

    rows = (
        db.query(
            Incident.type,
            func.avg(Incident.response_time_seconds).label("avg_response_time"),
        )
        .group_by(Incident.type)
        .all()
    )

    avg_response_by_type = [
        ResponseTimeByType(type=row.type, avg_response_time=row.avg_response_time)
        for row in rows
    ]

    severity_rows = (
        db.query(Incident.severity, func.count(Incident.id).label("count"))
        .group_by(Incident.severity)
        .all()
    )
    severity_counts = [
        SeverityCount(severity=row.severity, count=row.count)
        for row in severity_rows
    ]

    month_rows = (
        db.query(
            extract("month", Incident.timestamp).label("month_num"),
            func.count(Incident.id).label("count"),
        )
        .group_by("month_num")
        .all()
    )
    month_map = {int(row.month_num): row.count for row in month_rows}
    monthly_counts = [
        MonthlyCount(month=name, count=month_map.get(idx + 1, 0))
        for idx, name in enumerate(MONTH_NAMES)
    ]

    trends = _compute_trends(db)

    return StatsResponse(
        total_incidents=total,
        avg_call_answer_time=avg_call_answer,
        avg_response_time_by_type=avg_response_by_type,
        severity_counts=severity_counts,
        monthly_counts=monthly_counts,
        trends=trends,
    )
