"""Results retrieval API router."""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.repositories import documents as repo

router = APIRouter(prefix="/results", tags=["results"])


@router.get("/{file_id}")
async def get_results(file_id: str, session: AsyncSession = Depends(get_session)) -> dict:
    """Return analysis results for given file ID."""
    doc = await repo.get_by_file_id(session, file_id)
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found")

    if doc.metrics is None:
        raise HTTPException(status_code=status.HTTP_202_ACCEPTED, detail="Analysis pending")

    return {
        "file_id": doc.file_id,
        "filename": doc.filename,
        "uploaded_at": doc.uploaded_at.isoformat() if doc.uploaded_at else None,
        "metrics": doc.metrics,
    }
