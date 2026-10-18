# api/tests/test_stats.py
def test_stats_total_incidents(seeded_client):
    resp = seeded_client.get("/stats")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total_incidents"] == 4


def test_stats_avg_call_answer_time(seeded_client):
    resp = seeded_client.get("/stats")
    data = resp.json()
    # (5 + 10 + 15 + 8) / 4 = 9.5
    assert data["avg_call_answer_time"] == 9.5


def test_stats_avg_response_time_by_type(seeded_client):
    resp = seeded_client.get("/stats")
    data = resp.json()
    by_type = {item["type"]: item["avg_response_time"] for item in data["avg_response_time_by_type"]}
    # Fire: (300 + 700) / 2 = 500
    assert by_type["Fire"] == 500.0
    # Medical: 500 / 1 = 500
    assert by_type["Medical"] == 500.0
    # Police: 400 / 1 = 400
    assert by_type["Police"] == 400.0


def test_stats_severity_counts(seeded_client):
    resp = seeded_client.get("/stats")
    data = resp.json()
    by_severity = {item["severity"]: item["count"] for item in data["severity_counts"]}
    assert by_severity["High"] == 1
    assert by_severity["Critical"] == 1
    assert by_severity["Low"] == 1
    assert by_severity["Medium"] == 1


def test_stats_monthly_counts(seeded_client):
    resp = seeded_client.get("/stats")
    data = resp.json()
    by_month = {item["month"]: item["count"] for item in data["monthly_counts"]}
    assert len(data["monthly_counts"]) == 12
    # All 4 test incidents are in January
    assert by_month["Jan"] == 4
    assert by_month["Feb"] == 0
