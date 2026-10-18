from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Widget
from app.schemas import DashboardConfigRequest, DashboardConfigResponse, WidgetConfigItem

router = APIRouter(tags=["dashboard"])


@router.get("/dashboard/config", response_model=DashboardConfigResponse)
def get_dashboard_config(db: Session = Depends(get_db)):
    widgets = db.query(Widget).order_by(Widget.position).all()
    return DashboardConfigResponse(
        widgets=[
            WidgetConfigItem(id=w.widget_id, col_span=w.col_span, visible=w.visible)
            for w in widgets
        ]
    )


@router.put("/dashboard/config", response_model=DashboardConfigResponse)
def put_dashboard_config(
    body: DashboardConfigRequest, db: Session = Depends(get_db)
):
    seen_ids: set[str] = set()
    duplicate_ids: set[str] = set()
    for widget in body.widgets:
        if widget.id in seen_ids:
            duplicate_ids.add(widget.id)
        seen_ids.add(widget.id)

    if duplicate_ids:
        duplicates = ", ".join(sorted(duplicate_ids))
        raise HTTPException(
            status_code=400,
            detail=f"Duplicate widget IDs are not allowed: {duplicates}",
        )

    existing = {w.widget_id: w for w in db.query(Widget).all()}
    incoming_ids = set()

    for position, w in enumerate(body.widgets):
        incoming_ids.add(w.id)
        if w.id in existing:
            widget = existing[w.id]
            widget.col_span = w.col_span
            widget.visible = w.visible
            widget.position = position
        else:
            db.add(Widget(widget_id=w.id, col_span=w.col_span, visible=w.visible, position=position))

    for widget_id, widget in existing.items():
        if widget_id not in incoming_ids:
            db.delete(widget)

    try:
        db.commit()
    except SQLAlchemyError as exc:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Failed to persist dashboard config",
        ) from exc

    widgets = db.query(Widget).order_by(Widget.position).all()
    return DashboardConfigResponse(
        widgets=[
            WidgetConfigItem(id=w.widget_id, col_span=w.col_span, visible=w.visible)
            for w in widgets
        ]
    )
