"""File upload API router."""

from __future__ import annotations

import shutil
import uuid
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile, status

from app.core.config import settings

router = APIRouter(prefix="/upload", tags=["upload"])

ALLOWED_EXTENSIONS = {".txt"}


@router.post("/", status_code=status.HTTP_201_CREATED)
async def upload_file(file: UploadFile = File(...)) -> dict[str, str]:
    """Upload a text file for analysis.

    Currently, the file is simply stored on disk and an identifier is
    returned. Further processing will be added in subsequent tasks.
    """

    extension = Path(file.filename).suffix.lower()
    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only .txt files are supported.",
        )

    # Check size by reading chunks until exceeding limit
    max_size = settings.MAX_FILE_SIZE_BYTES
    total_read = 0
    tmp_path = settings.UPLOAD_DIR / f"tmp-{uuid.uuid4().hex}"

    with tmp_path.open("wb") as buffer:
        async for chunk in file.stream():
            total_read += len(chunk)
            if total_read > max_size:
                buffer.close()
                tmp_path.unlink(missing_ok=True)
                raise HTTPException(
                    status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                    detail="File exceeds maximum allowed size (5 MB).",
                )
            buffer.write(chunk)

    # Move to final destination with unique id
    file_id = uuid.uuid4().hex
    final_path = settings.UPLOAD_DIR / f"{file_id}{extension}"
    shutil.move(tmp_path, final_path)

    return {"file_id": file_id, "filename": file.filename}
