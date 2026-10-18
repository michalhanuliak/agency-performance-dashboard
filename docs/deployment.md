# Deployment Runbook

## Platform

This project is deployed with Render using the repository blueprint file [`render.yaml`](../render.yaml).

Services:

1. `agency-dashboard-api` (Python web service)
2. `agency-dashboard` (static frontend)

## Render Service Configuration

### API service (`agency-dashboard-api`)

- Runtime: Python
- Root directory: `api`
- Build command:

```bash
pip install -r requirements.txt && python load_csv.py
```

- Start command:

```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

- Required environment variables:
  - `PYTHON_VERSION=3.13.0`
  - `ALLOWED_ORIGINS=https://agency-dashboard.onrender.com`

### Frontend service (`agency-dashboard`)

- Runtime: Static site
- Root directory: `frontend`
- Build command:

```bash
npm install && npm run build
```

- Publish directory: `dist`
- Required environment variables:
  - `VITE_API_URL=https://agency-dashboard-api.onrender.com`

## First-Time Deploy Steps

1. Fork the repository.
2. In Render, create **New Blueprint** and select the repo.
3. Confirm both services are detected from `render.yaml`.
4. Create the stack.
5. Wait for both services to complete their initial deploy.

## Post-Deploy Smoke Checks

1. Open API docs endpoint: `/docs`
2. Open frontend URL and verify:
   - KPI cards render
   - Table renders rows
   - Edit mode toggles on/off
3. Confirm browser network requests from frontend go to the expected API host.

## Local/Deployment Parity Notes

- The backend seeds data from `api/data/incidents.csv` via `api/load_csv.py`.
- Seeding is idempotent: if incidents already exist, loader exits without duplicating rows.
- Frontend API base URL is environment-driven (`VITE_API_URL`).
- CORS allowlist is environment-driven (`ALLOWED_ORIGINS`).

## Rollback Strategy

If a deploy regresses behavior:

1. Re-deploy the previous known-good commit in Render.
2. Run local verification (`npm run verify` and `npm run test:e2e`) before next redeploy.
3. Capture failure details in `docs/code-review.md` or a follow-up doc in `docs/plans/`.
