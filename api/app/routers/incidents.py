# api/app/routers/incidents.py
import math
from typing import Literal

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Incident, IncidentType
from app.schemas import IncidentResponse, PaginatedIncidentsResponse

router = APIRouter(tags=["incidents"])

SORTABLE_COLUMNS = {
    "timestamp": Incident.timestamp,
    "type": Incident.type,
    "severity": Incident.severity,
    "response_time_seconds": Incident.response_time_seconds,
    "call_answer_time_seconds": Incident.call_answer_time_seconds,
}


@router.get("/incidents", response_model=PaginatedIncidentsResponse)
def list_incidents(
    type: IncidentType | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    sort_by: Literal[
        "timestamp", "type", "severity", "response_time_seconds", "call_answer_time_seconds"
    ] = Query(default="timestamp"),
    sort_dir: Literal["asc", "desc"] = Query(default="asc"),
    db: Session = Depends(get_db),
):
    query = db.query(Incident)
    if type:
        query = query.filter(Incident.type == type)

    total = query.count()
    total_pages = math.ceil(total / page_size) if total > 0 else 1
    offset = (page - 1) * page_size

    sort_column = SORTABLE_COLUMNS[sort_by]
    order = sort_column.desc() if sort_dir == "desc" else sort_column.asc()
    items = query.order_by(order).offset(offset).limit(page_size).all()

    return PaginatedIncidentsResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@router.get("/incidents/recent", response_model=list[IncidentResponse])
def recent_incidents(
    limit: int = Query(default=5, ge=1, le=20),
    db: Session = Depends(get_db),
):
    items = db.query(Incident).order_by(Incident.timestamp.desc()).limit(limit).all()
    return items
