from app.models import IncidentType, Severity
from app.schemas import IncidentResponse, StatsResponse, ResponseTimeByType, SeverityCount


def test_incident_response():
    data = {
        "id": "abc-123",
        "timestamp": "2025-02-14T09:30:00",
        "type": "Fire",
        "severity": "Medium",
        "response_time_seconds": 225,
        "call_answer_time_seconds": 18,
        "ai_summary": "Test summary",
    }
    r = IncidentResponse(**data)
    assert r.type == IncidentType.FIRE


def test_stats_response():
    data = {
        "total_incidents": 100,
        "avg_call_answer_time": 12.5,
        "avg_response_time_by_type": [
            {"type": "Fire", "avg_response_time": 500.0},
        ],
        "severity_counts": [
            {"severity": "Critical", "count": 10},
        ],
        "monthly_counts": [
            {"month": "Jan", "count": 50},
        ],
        "trends": {
            "total_incidents": 5.2,
            "avg_call_answer_time": -3.1,
            "avg_response_time": None,
            "critical_incidents": None,
        },
    }
    r = StatsResponse(**data)
    assert r.total_incidents == 100
    assert r.severity_counts[0].severity == Severity.CRITICAL
    assert r.trends.total_incidents == 5.2
    assert r.trends.avg_call_answer_time == -3.1
    assert r.trends.avg_response_time is None
