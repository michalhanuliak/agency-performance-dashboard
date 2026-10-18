# api/tests/test_incidents.py
def test_list_incidents(seeded_client):
    resp = seeded_client.get("/incidents")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["items"]) == 4


def test_filter_incidents_by_type(seeded_client):
    resp = seeded_client.get("/incidents?type=Fire")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["items"]) == 2
    assert all(i["type"] == "Fire" for i in data["items"])


def test_filter_incidents_no_match(seeded_client):
    resp = seeded_client.get("/incidents?type=Traffic")
    assert resp.status_code == 200
    assert len(resp.json()["items"]) == 0


def test_list_incidents_paginated(seeded_client):
    """Default pagination returns envelope with items, total, page info."""
    resp = seeded_client.get("/incidents")
    assert resp.status_code == 200
    data = resp.json()
    assert "items" in data
    assert "total" in data
    assert "page" in data
    assert "page_size" in data
    assert "total_pages" in data
    assert data["total"] == 4
    assert data["page"] == 1
    assert data["page_size"] == 20
    assert data["total_pages"] == 1
    assert len(data["items"]) == 4


def test_list_incidents_page_size(seeded_client):
    """Custom page_size limits returned items."""
    resp = seeded_client.get("/incidents?page_size=2")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["items"]) == 2
    assert data["total"] == 4
    assert data["total_pages"] == 2
    assert data["page"] == 1


def test_list_incidents_page_2(seeded_client):
    """Page 2 returns remaining items."""
    resp = seeded_client.get("/incidents?page=2&page_size=2")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["items"]) == 2
    assert data["page"] == 2


def test_list_incidents_filter_with_pagination(seeded_client):
    """Type filter works with pagination."""
    resp = seeded_client.get("/incidents?type=Fire&page_size=1")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] == 2
    assert data["total_pages"] == 2
    assert len(data["items"]) == 1
    assert all(i["type"] == "Fire" for i in data["items"])


def test_list_incidents_page_beyond_range(seeded_client):
    """Page beyond total returns empty items."""
    resp = seeded_client.get("/incidents?page=100")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["items"]) == 0
    assert data["total"] == 4


def test_sort_by_response_time_asc(seeded_client):
    """Sort by response_time_seconds ascending."""
    resp = seeded_client.get("/incidents?sort_by=response_time_seconds&sort_dir=asc")
    assert resp.status_code == 200
    items = resp.json()["items"]
    times = [i["response_time_seconds"] for i in items]
    assert times == sorted(times)


def test_sort_by_response_time_desc(seeded_client):
    """Sort by response_time_seconds descending."""
    resp = seeded_client.get("/incidents?sort_by=response_time_seconds&sort_dir=desc")
    assert resp.status_code == 200
    items = resp.json()["items"]
    times = [i["response_time_seconds"] for i in items]
    assert times == sorted(times, reverse=True)


def test_sort_by_type(seeded_client):
    """Sort by type ascending."""
    resp = seeded_client.get("/incidents?sort_by=type&sort_dir=asc")
    assert resp.status_code == 200
    items = resp.json()["items"]
    types = [i["type"] for i in items]
    assert types == sorted(types)


def test_sort_by_severity(seeded_client):
    """Sort by severity ascending."""
    resp = seeded_client.get("/incidents?sort_by=severity&sort_dir=asc")
    assert resp.status_code == 200
    assert len(resp.json()["items"]) == 4


def test_sort_with_pagination(seeded_client):
    """Sorting works together with pagination."""
    resp = seeded_client.get("/incidents?sort_by=response_time_seconds&sort_dir=asc&page_size=2&page=1")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["items"]) == 2
    assert data["items"][0]["response_time_seconds"] <= data["items"][1]["response_time_seconds"]

    resp2 = seeded_client.get("/incidents?sort_by=response_time_seconds&sort_dir=asc&page_size=2&page=2")
    data2 = resp2.json()
    assert data["items"][-1]["response_time_seconds"] <= data2["items"][0]["response_time_seconds"]


def test_sort_invalid_column(seeded_client):
    """Invalid sort_by column returns 422."""
    resp = seeded_client.get("/incidents?sort_by=invalid_column")
    assert resp.status_code == 422


def test_sort_default_is_timestamp_asc(seeded_client):
    """Default sort (no params) is timestamp ascending."""
    resp = seeded_client.get("/incidents")
    items = resp.json()["items"]
    timestamps = [i["timestamp"] for i in items]
    assert timestamps == sorted(timestamps)


def test_recent_incidents(seeded_client):
    """GET /incidents/recent returns most recent incidents."""
    resp = seeded_client.get("/incidents/recent")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == 4  # only 4 in test data
    # Should be sorted by timestamp descending
    timestamps = [i["timestamp"] for i in data]
    assert timestamps == sorted(timestamps, reverse=True)


def test_recent_incidents_limit(seeded_client):
    """GET /incidents/recent?limit=2 respects limit."""
    resp = seeded_client.get("/incidents/recent?limit=2")
    assert resp.status_code == 200
    assert len(resp.json()) == 2
