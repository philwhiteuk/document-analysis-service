"""API router for document history."""

from __future__ import annotations

from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.repositories import documents as repo
from app.schemas import history as schemas

router = APIRouter(prefix="/history", tags=["history"])


@router.get("/", response_model=List[schemas.DocumentSummary])
async def list_history(
    limit: int = 20,
    session: AsyncSession = Depends(get_session),
) -> Any:
    """Return recently uploaded documents (most recent first)."""
    docs = await repo.list_recent(session, limit=limit)
    return [schemas.DocumentSummary.from_orm(d) for d in docs]
