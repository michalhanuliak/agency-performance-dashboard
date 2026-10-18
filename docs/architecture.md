# Architecture: Agency Performance Dashboard

## Overview

Full-stack analytical dashboard for 911 supervisors to monitor operational metrics and identify trends in emergency response data. Built as a time-boxed full-stack exercise.

## Tech Stack

### Backend
- **Python 3.13** + **FastAPI** + **Uvicorn**
- **SQLAlchemy 2.x** (sync ORM) + **SQLite**
- **Pydantic v2** for request/response schemas
- Auto-generated OpenAPI spec at `/openapi.json`

### Frontend
- **React 19** + **TypeScript** + **Vite**
- **React Compiler** (`babel-plugin-react-compiler`) for auto-memoization
- **Tailwind CSS** + **shadcn/ui** for styling and UI components
- **Recharts** for bar chart visualization
- **TanStack Table** (via shadcn/ui Table) for the data grid
- **TanStack Query** for data fetching with Suspense
- **Orval** for API client generation from OpenAPI spec
- **Storybook** for component development

## Data

Source: `api/data/incidents.csv` — 100 rows of synthetic emergency response data.

Fields: `id` (UUID), `timestamp` (ISO datetime), `type` (Medical/Fire/Police/Traffic), `severity` (Critical/High/Medium/Low), `response_time_seconds`, `call_answer_time_seconds`, `ai_summary`

## Backend Architecture

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/stats` | Aggregated metrics: avg response time by type, avg call answer time (global), total incidents, severity breakdown |
| GET | `/incidents` | Paginated incidents list. Query params: `?type=Fire`, `?page=1`, `?page_size=20` |
| GET | `/dashboard/config` | Get saved widget layout config (positions, sizes, visibility) |
| PUT | `/dashboard/config` | Save widget layout config |

### Data Ingestion

Standalone script (`load_csv.py`) run once to seed SQLite from the CSV.

### Project Structure

```
api/
├── app/
│   ├── main.py           # FastAPI app, CORS, router includes
│   ├── database.py       # SQLAlchemy engine, session, Base
│   ├── models.py         # Incident SQLAlchemy model
│   ├── schemas.py        # Pydantic response schemas
│   └── routers/
│       ├── stats.py      # GET /stats
│       ├── incidents.py  # GET /incidents (paginated)
│       └── dashboard.py  # GET/PUT /dashboard/config
├── load_csv.py           # CSV -> SQLite ingestion script
├── requirements.txt
└── tests/
    ├── conftest.py
    ├── test_stats.py
    ├── test_incidents.py
    ├── test_dashboard.py
    ├── test_models.py
    └── test_schemas.py
```

### Model

```
Incident:
  id: UUID (primary key)
  timestamp: datetime
  type: str (Medical, Fire, Police, Traffic)
  severity: str (Critical, High, Medium, Low)
  response_time_seconds: int
  call_answer_time_seconds: int
  ai_summary: str
```

## Frontend Architecture

### Widget System

The dashboard is built as a configurable widget grid. Each widget is an **island** — a self-contained unit with its own data fetching, loading state, and error boundary. One widget failing doesn't break others.

**Widget sizes:** Each widget supports three view modes:
- **Minimal** — condensed view, just the essential visual (e.g. just a number, chart without labels)
- **Normal** — standard view with labels and context
- **Large** — expanded view with additional detail (sparklines, full summaries, pagination)

**Grid:** 4-column fixed grid. Widgets span 1-4 columns depending on their type. Uses CSS `@container` queries so widgets adapt to their container size, not the viewport. Scales from 4 columns (desktop) to 1 column (mobile).

**Edit mode:** Inline toggle on the dashboard. When active, each widget shows a gear icon with size options (Minimal/Normal/Large) as pill toggles. Config is persisted to the backend.

### Dependency Re-export Pattern

All third-party imports go through `src/lib/` so swapping a library requires changing one file:

```
src/lib/
├── charts.ts         # re-exports from recharts
├── dnd.ts            # re-exports from @dnd-kit/core + @dnd-kit/sortable
├── error-boundary.ts # re-exports from react-error-boundary
├── icons.ts          # re-exports from lucide-react
├── query.ts          # re-exports from @tanstack/react-query
├── table.ts          # re-exports from @tanstack/react-table
├── ui/               # shadcn/ui components
└── utils.ts          # cn() helper
```

### Layer Architecture

```
Orval (generated) -> Adapters (hooks) -> Widgets (islands) -> Dashboard Grid -> Pages
```

1. **api/** — Orval-generated TypeScript interfaces and API client from backend's OpenAPI spec. Generated files live in `api/__generated__/` split by API tag (dashboard, incidents, stats) plus a shared schemas file. Orval reads from a local `openapi.json` file (exported from the backend).
2. **types/** — Re-exported and aliased types from generated API. Components and adapters import types from here, never from `@/api` directly.
3. **adapters/** — Custom hooks that wrap generated API calls. Each adapter defines DTO interfaces and a mapper function. Handle error states, loading, data transforms. See `docs/adapter-convention.md`.
4. **components/** — Reusable UI components. Each component lives in its own folder with co-located Storybook stories. See `docs/component-convention.md`. Widgets are components that wrap an adapter + error boundary and support the three size modes.
5. **utils/** — Pure helper functions with `*.test.ts`.
6. **pages/** — Layout composition. Renders the dashboard grid with configured widgets.

**One component per file:** Every `.tsx` file in `components/` exports exactly one React component. Helper components (e.g., presentational views) live as sibling files in the same directory. shadcn/ui primitives in `ui/` are excluded from this rule.

### Widget Catalog

| Widget | Default Columns | Data Source |
|--------|----------------|-------------|
| KPI Card (Avg Response Time) | 1 | `/stats` |
| KPI Card (Avg Call Answer Time) | 1 | `/stats` |
| KPI Card (Total Incidents) | 1 | `/stats` |
| KPI Card (Critical Incidents) | 1 | `/stats` |
| Response Time by Type (bar chart) | 2 | `/stats` |
| Severity Breakdown (donut chart) | 2 | `/incidents` |
| Recent Incidents Feed | 1 | `/incidents` |
| Incidents Over Time (area chart) | 2 | `/incidents` |
| Incidents Data Table | 4 | `/incidents` |

### Project Structure

```
frontend/
├── src/
│   ├── api/              # Orval-generated client + types (split by tag in __generated__/)
│   ├── types/            # Re-exported + aliased API types
│   ├── adapters/         # Custom hooks with DTO mappers
│   ├── components/       # UI components (folder-per-component)
│   │   └── ExampleComponent/
│   │       ├── ExampleComponent.tsx
│   │       └── ExampleComponent.stories.tsx
│   ├── utils/            # Helpers + tests
│   ├── pages/            # Page layouts
│   ├── lib/              # Library re-exports + shadcn/ui
│   └── App.tsx
├── orval.config.ts
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

### Data Flow

1. Dashboard loads widget config from backend (which widgets, their sizes, positions)
2. Grid renders each widget as an island with its own error boundary
3. Each widget's adapter fetches its own data independently
4. `useStats()` feeds KPI cards + charts
5. `useIncidents(type?)` feeds table + feed + severity chart
6. Edit mode toggle exposes inline config controls per widget
7. Config changes persist to backend via API call

### Design

See `docs/figma-design-prompt.md` for the full visual design specification. Dark command center theme with severity/type color coding.

### Related Docs

- `docs/decisions.md` — architecture and process tradeoffs
- `docs/deployment.md` — Render runbook and smoke checks
- `docs/verification.md` — verification matrix and latest run status
