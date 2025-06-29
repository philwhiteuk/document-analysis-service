# Document Analysis Service

Text Analysis-as-a-Service – upload a plain-text file and get back rich readability metrics, frequency stats and more. The project is split into an async FastAPI backend and a React + Vite frontend.

---

## Quick Start (Docker Compose)

```bash
# build and start both containers
docker compose up --build -d

# backend available at http://localhost:8000
# frontend served at   http://localhost:3000
```

## Local Development

Backend (requires Python 3.11):

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Frontend:

```bash
cd frontend
npm install
npm run dev  # Vite dev server on http://localhost:5173
```

## API Reference

| Method | Endpoint             | Description                      |
| ------ | -------------------- | -------------------------------- |
| POST   | `/upload/`           | Upload a `.txt` file             |
| GET    | `/results/{file_id}` | Retrieve analysis results        |
| GET    | `/history/?limit=N`  | List the N most-recent documents |
| GET    | `/health`            | Simple liveness check            |

## Project Structure (simplified)

```
backend/
  app/
    routers/        # upload, results, history
    services/       # analysis logic
    repositories/   # DB access layer
    core/           # config + DB setup
frontend/
  src/              # React TS source (Vite)
Dockerfile.backend  # Builds backend image
Dockerfile.frontend # Builds static React bundle served by nginx
docker-compose.yml  # Runs both services together
```

## Environment

The default SQLite database is created in-container; for production swap to Postgres by changing `DATABASE_URL` in `backend/app/core/config.py` and adding a service in `docker-compose.yml`.

## License

MIT
