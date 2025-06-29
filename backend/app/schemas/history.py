"""Pydantic schemas for history endpoints."""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict


class DocumentSummary(BaseModel):
    """Lightweight representation of a previously analysed document."""

    file_id: str
    filename: str
    uploaded_at: datetime

    model_config = ConfigDict(from_attributes=True)
