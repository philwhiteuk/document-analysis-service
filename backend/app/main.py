from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import init_db

from app.routers.upload import router as upload_router
from app.routers.results import router as results_router
from app.routers.history import router as history_router

app = FastAPI(title="Document Analysis Service")

# Register routers
app.include_router(upload_router)
app.include_router(results_router)
app.include_router(history_router)


@app.on_event("startup")
async def on_startup() -> None:
    await init_db()

# Allow all origins during initial development. Adjust in production.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    """Health-check endpoint for liveness probes."""
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
