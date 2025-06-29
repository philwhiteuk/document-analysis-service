from pathlib import Path


class Settings:
    """Application configuration settings.

    For simplicity, settings are hard-coded. In production, use environment
    variables or a settings management library.
    """

    UPLOAD_DIR: Path = Path(__file__).resolve().parent.parent / "uploads"
    MAX_FILE_SIZE_BYTES: int = 5 * 1024 * 1024  # 5 MB limit for text files.


settings = Settings()

# Ensure upload directory exists at import time
settings.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
