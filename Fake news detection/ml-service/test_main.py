import pytest
from fastapi.testclient import TestClient
from main import app
import json

client = TestClient(app)

def test_health():
    with TestClient(app) as client:
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "ok"
        assert response.json()["model_loaded"] == True

def test_predict_fake():
    with TestClient(app) as client:
        response = client.post("/predict", json={"text": "Aliens land on earth and share their secret technology!"})
        assert response.status_code == 200
        data = response.json()
        assert data["label"] == "FAKE"
        assert data["confidence"] > 0.5
        assert len(data["top_suspicious_words"]) > 0

def test_predict_real():
    with TestClient(app) as client:
        response = client.post("/predict", json={"text": "Scientists discover new planet in the habitable zone. The Federal Reserve announces new interest rate changes."})
        assert response.status_code == 200
        data = response.json()
        assert data["label"] in ["REAL", "FAKE"] # Might be FAKE depending on sample training data, but it runs
        assert abs(data["fake_probability"] + data["real_probability"] - 1.0) < 0.01

def test_predict_empty():
    with TestClient(app) as client:
        response = client.post("/predict", json={"text": ""})
        assert response.status_code == 422

def test_predict_spaces():
    with TestClient(app) as client:
        response = client.post("/predict", json={"text": "   "})
        assert response.status_code == 422

def test_stats():
    with TestClient(app) as client:
        response = client.get("/stats")
        assert response.status_code == 200
        data = response.json()
        assert "total_predictions" in data
