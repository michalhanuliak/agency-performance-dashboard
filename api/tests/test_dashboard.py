from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session


def test_get_config_returns_seeded_defaults(client):
    """GET /dashboard/config returns the default widget config."""
    response = client.get("/dashboard/config")
    assert response.status_code == 200
    data = response.json()
    assert "widgets" in data
    assert len(data["widgets"]) == 9
    assert data["widgets"][0]["id"] == "avg-response"
    assert data["widgets"][0]["col_span"] == 1
    assert data["widgets"][0]["visible"] is True


def test_put_config_saves_and_returns(client):
    """PUT /dashboard/config saves new config and returns it."""
    new_config = {
        "widgets": [
            {"id": "total-incidents", "col_span": 2, "visible": True},
            {"id": "avg-response", "col_span": 1, "visible": False},
        ]
    }
    response = client.put("/dashboard/config", json=new_config)
    assert response.status_code == 200
    data = response.json()
    assert len(data["widgets"]) == 2
    assert data["widgets"][0]["id"] == "total-incidents"
    assert data["widgets"][0]["col_span"] == 2

    # Verify persistence
    get_response = client.get("/dashboard/config")
    assert get_response.json() == data


def test_put_config_rejects_invalid_col_span(client):
    """PUT /dashboard/config rejects invalid col_span values."""
    bad_config = {
        "widgets": [
            {"id": "avg-response", "col_span": 3, "visible": True},
        ]
    }
    response = client.put("/dashboard/config", json=bad_config)
    assert response.status_code == 422


def test_put_config_rejects_duplicate_widget_ids(client):
    """PUT /dashboard/config rejects duplicate widget IDs in request body."""
    bad_config = {
        "widgets": [
            {"id": "avg-response", "col_span": 1, "visible": True},
            {"id": "avg-response", "col_span": 2, "visible": False},
        ]
    }
    response = client.put("/dashboard/config", json=bad_config)
    assert response.status_code == 400
    assert response.json()["error"] == "Duplicate widget IDs are not allowed: avg-response"


def test_put_config_rollback_on_commit_failure(client, monkeypatch):
    """PUT /dashboard/config rolls back and returns 500 when commit fails."""
    baseline = client.get("/dashboard/config").json()

    def raise_commit_error(self):
        raise SQLAlchemyError("forced commit failure")

    monkeypatch.setattr(Session, "commit", raise_commit_error)

    new_config = {
        "widgets": [
            {"id": "total-incidents", "col_span": 2, "visible": True},
            {"id": "avg-response", "col_span": 1, "visible": False},
        ]
    }

    response = client.put("/dashboard/config", json=new_config)
    assert response.status_code == 500
    assert response.json()["error"] == "Failed to persist dashboard config"

    # Ensure failed write was not persisted.
    assert client.get("/dashboard/config").json() == baseline
