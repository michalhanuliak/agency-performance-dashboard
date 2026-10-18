# Verification

This document tracks the repeatable verification gate for deployment readiness.

## Verification Matrix

Run from repository root unless stated otherwise.

| Check | Command |
|---|---|
| Backend tests | `npm run test:api` |
| Frontend unit tests | `npm run test:frontend` |
| Frontend lint | `npm run lint:frontend` |
| Frontend build | `npm run build:frontend` |
| E2E tests | `npm run test:e2e` |
| Full gate (no e2e) | `npm run verify` |
| Full gate (with e2e) | `npm run verify:all` |

## Latest Verification Run

Date: 2026-03-08

- `npm run test:api`: PASS (`25 passed`)
- `npm run test:frontend`: PASS (`3 files, 18 tests`)
- `npm run lint:frontend`: PASS
- `npm run build:frontend`: PASS (Vite production build emitted `dist/`)
- `npm run test:e2e`: PASS (`17 passed`)
- `npm run verify`: PASS
- `npm run verify:all`: PASS

Notes:

- Frontend build logs a non-blocking chunk-size warning (`>500 kB`) for the main bundle.
