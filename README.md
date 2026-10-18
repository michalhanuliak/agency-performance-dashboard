# Agency Performance Dashboard

Full-stack analytical dashboard for 911 supervisors to monitor operational metrics and identify trends in emergency response data.

Built as a time-boxed full-stack exercise, then extended with a configurable widget grid, layout persistence, and a test/CI gate. The 100-incident dataset in `api/data/incidents.csv` is synthetic.

![Tech Stack](https://img.shields.io/badge/React_19-blue) ![Tech Stack](https://img.shields.io/badge/FastAPI-green) ![Tech Stack](https://img.shields.io/badge/TypeScript-blue) ![Tech Stack](https://img.shields.io/badge/SQLite-lightgrey)

## Features

- KPI cards: Avg Response Time, Avg Call Answer Time, Total Incidents, Critical Incidents
- Response Time by Type chart (Medical, Fire, Police, Traffic)
- Severity Breakdown donut chart
- Recent Incidents feed
- Incidents Over Time chart
- Incidents table with pagination, sorting, and type filtering
- Configurable dashboard grid (drag and drop + resize: `1×1`, `2×1`, `Full`)
- Dashboard layout persistence to backend
- Dark/light theme toggle
- Responsive layout (desktop to mobile)

## Architecture

Each widget is an independent island (own fetch lifecycle, loading state, and error handling). A widget failure does not break the rest of the dashboard.

```
Orval (generated client) -> Adapters (DTO mappers) -> Components/Widgets -> Dashboard page
```

See [`docs/architecture.md`](docs/architecture.md) for full details.

## Prerequisites

- Python 3.13+
- Node.js 18+
- npm 9+

## Quick Start

```bash
# 1) Install root deps (Playwright)
npm install

# 2) Install frontend deps
cd frontend && npm install && cd ..

# 3) Install backend deps + seed DB
cd api
cp .env.sample .env
pip3 install -r requirements.txt
python3 load_csv.py
cd ..

# 4) Verification (unit/integration/build)
npm run verify

# 5) Full verification (includes e2e)
npm run verify:all
```

## Local Development

From repo root you can use:

```bash
npm run dev:api
npm run dev:frontend
```

Or (Unix shells) run both with:

```bash
npm run dev
```

### Backend

```bash
cd api
cp .env.sample .env
pip3 install -r requirements.txt
python3 load_csv.py
python3 -m uvicorn app.main:app --reload
```

Backend: http://localhost:8000  
OpenAPI docs: http://localhost:8000/docs

### Frontend

```bash
cd frontend
cp .env.sample .env
npm install
npm run dev
```

Frontend: http://localhost:5173

### Storybook

```bash
cd frontend
npm run storybook
```

Storybook: http://localhost:6006

## Verification Commands

| Command | Purpose |
|---|---|
| `npm run test:api` | Backend pytest suite |
| `npm run test:frontend` | Frontend Vitest suite |
| `npm run lint:frontend` | Frontend linting |
| `npm run build:frontend` | Frontend production build |
| `npm run verify` | API tests + frontend tests + lint + build |
| `npm run test:e2e` | Playwright end-to-end tests |
| `npm run verify:all` | Full gate (`verify` + e2e) |

## Environment Variables

Each service has `.env.sample` with local defaults.

| Variable | Service | Default | Description |
|---|---|---|---|
| `ALLOWED_ORIGINS` | API | `http://localhost:5173` | Comma-separated CORS allowlist |
| `VITE_API_URL` | Frontend | `http://localhost:8000` | Backend base URL |

## Deployment

This project deploys on Render via [`render.yaml`](render.yaml) (blueprint setup).

```yaml
services:
  - agency-dashboard-api (Python web service)
  - agency-dashboard (Static site)
```

Deployment steps:

1. Fork the repository.
2. In Render, create **New Blueprint** and select the repo.
3. Render provisions both services from `render.yaml`.
4. Pushes to the configured branch trigger redeploys.

Detailed runbook: [`docs/deployment.md`](docs/deployment.md)

## Documentation Index

- Architecture: [`docs/architecture.md`](docs/architecture.md)
- Decisions and tradeoffs: [`docs/decisions.md`](docs/decisions.md)
- Deployment runbook: [`docs/deployment.md`](docs/deployment.md)
- Verification evidence and commands: [`docs/verification.md`](docs/verification.md)
- Code review findings and improvements: [`docs/code-review.md`](docs/code-review.md)
