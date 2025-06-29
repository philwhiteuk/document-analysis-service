"""Test configuration: add backend to Python path so `import app` works."""

import sys
from pathlib import Path

BACKEND_PATH = Path(__file__).resolve().parents[1] / "backend"
if str(BACKEND_PATH) not in sys.path:
    sys.path.insert(0, str(BACKEND_PATH))

import pytest_asyncio
from app.core.database import init_db

@pytest_asyncio.fixture(scope="session", autouse=True)
async def _init_db():
    await init_db()
