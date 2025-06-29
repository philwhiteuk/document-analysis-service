"""Backend API integration tests using httpx.AsyncClient."""

import io
import json
import tempfile
from pathlib import Path

import pytest
from fastapi import status
from httpx import AsyncClient

from app.main import app
from app.core.config import settings


@pytest.fixture(name="client")
async def _client() -> AsyncClient:  # type: ignore[return-type]
    """Create an AsyncClient against the FastAPI app."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client


@pytest.fixture(autouse=True)
def _temp_upload_dir(monkeypatch: pytest.MonkeyPatch) -> None:
    """Use a temporary directory for uploads during tests."""
    with tempfile.TemporaryDirectory() as tmp:
        monkeypatch.setattr(settings, "UPLOAD_DIR", Path(tmp))
        yield


async def test_health(client: AsyncClient) -> None:
    resp = await client.get("/health")
    assert resp.status_code == status.HTTP_200_OK
    assert resp.json() == {"status": "ok"}


async def test_upload_and_retrieve_results(client: AsyncClient) -> None:
    # Prepare a simple text file in-memory
    text = "Hello world. This is a test file. Hello again!"
    data = {"file": ("sample.txt", io.BytesIO(text.encode()), "text/plain")}

    upload_resp = await client.post("/upload/", files=data)
    assert upload_resp.status_code == status.HTTP_201_CREATED

    payload = upload_resp.json()
    file_id = payload["file_id"]
    assert payload["filename"] == "sample.txt"
    assert payload["metrics"]["total_word_count"] == 9

    # Retrieve results
    res_resp = await client.get(f"/results/{file_id}")
    assert res_resp.status_code == status.HTTP_200_OK
    res_payload = res_resp.json()
    assert res_payload["file_id"] == file_id
    assert res_payload["metrics"] == payload["metrics"]

    # History should include this document
    hist_resp = await client.get("/history/?limit=1")
    assert hist_resp.status_code == status.HTTP_200_OK
    hist = hist_resp.json()
    assert hist[0]["file_id"] == file_id
