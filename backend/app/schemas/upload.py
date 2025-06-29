from pydantic import BaseModel
from typing import Any

class UploadResponse(BaseModel):
    file_id: str
    filename: str
    metrics: dict[str, Any]
