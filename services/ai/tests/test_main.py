from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_health() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_analyze_rejects_invalid_url() -> None:
    response = client.post("/analyze", json={"video_url": "local-file"})
    assert response.status_code == 400


def test_analyze_returns_contract() -> None:
    response = client.post("/analyze", json={"video_url": "https://example.com/video.mp4"})
    assert response.status_code == 200
    payload = response.json()
    assert set(payload.keys()) == {"min_angle", "max_angle", "movement_score", "raw_json"}
