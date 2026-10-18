from datetime import datetime
from typing import Generic, Literal, TypeVar

from pydantic import BaseModel

from app.models import IncidentType, Severity

T = TypeVar("T")


class PaginatedResponse(BaseModel, Generic[T]):
    items: list[T]
    total: int
    page: int
    page_size: int
    total_pages: int


class IncidentResponse(BaseModel):
    id: str
    timestamp: datetime
    type: IncidentType
    severity: Severity
    response_time_seconds: int
    call_answer_time_seconds: int
    ai_summary: str

    model_config = {"from_attributes": True}


PaginatedIncidentsResponse = PaginatedResponse[IncidentResponse]


class ResponseTimeByType(BaseModel):
    type: IncidentType
    avg_response_time: float


class SeverityCount(BaseModel):
    severity: Severity
    count: int


class MonthlyCount(BaseModel):
    month: str
    count: int


class TrendData(BaseModel):
    total_incidents: float | None = None
    avg_call_answer_time: float | None = None
    avg_response_time: float | None = None
    critical_incidents: float | None = None


class StatsResponse(BaseModel):
    total_incidents: int
    avg_call_answer_time: float
    avg_response_time_by_type: list[ResponseTimeByType]
    severity_counts: list[SeverityCount]
    monthly_counts: list[MonthlyCount]
    trends: TrendData


class WidgetConfigItem(BaseModel):
    id: str
    col_span: Literal[1, 2, 4]
    visible: bool


class DashboardConfigResponse(BaseModel):
    widgets: list[WidgetConfigItem]


class DashboardConfigRequest(BaseModel):
    widgets: list[WidgetConfigItem]
