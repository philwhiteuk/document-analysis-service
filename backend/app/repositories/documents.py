"""Data access layer for `Document`."""

from __future__ import annotations

from typing import Optional

from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Document


async def create(
    session: AsyncSession,
    *,
    file_id: str,
    filename: str,
    path: str,
    size_bytes: int,
    metrics: dict | None,
) -> Document:
    doc = Document(
        file_id=file_id,
        filename=filename,
        path=path,
        size_bytes=size_bytes,
        metrics=metrics,
    )
    session.add(doc)
    await session.commit()
    await session.refresh(doc)
    return doc


async def list_recent(session: AsyncSession, limit: int = 20) -> list[Document]:
    stmt = select(Document).order_by(desc(Document.uploaded_at)).limit(limit)
    result = await session.execute(stmt)
    return result.scalars().all()


async def get_by_file_id(session: AsyncSession, file_id: str) -> Optional[Document]:
    stmt = select(Document).where(Document.file_id == file_id)
    result = await session.execute(stmt)
    return result.scalar_one_or_none()
