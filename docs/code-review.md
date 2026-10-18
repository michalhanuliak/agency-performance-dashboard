# Code Review Findings

Reviewed on: 2026-03-08

## Findings (by severity)

No open high- or medium-severity issues identified after stabilization fixes.

### Low

1. **Frontend production bundle exceeds 500 kB warning threshold**
   - File: `frontend/vite.config.ts` (build output observation)
   - Why it matters: larger bundles can increase first-load time, especially after free-tier cold starts.
   - Recommendation: evaluate route/widget code splitting and/or manual chunking for chart/table-heavy modules.

2. **E2E server command uses hot-reload mode**
   - File: `playwright.config.ts`
   - Why it matters: `uvicorn --reload` is useful for local development but can add variability to deterministic E2E runs.
   - Recommendation: use non-reload server command in Playwright webServer config for CI verification.

## Fixed During Stabilization

1. **Backend dependency reproducibility risk**
   - Pinned versions in `api/requirements.txt`.

2. **Frontend lint/build blockers**
   - Fixed unused prop and invalid ref access during render.
   - Updated ESLint rule scoping for shadcn-style UI export patterns.

3. **E2E selector drift after UI semantics changes**
   - Updated tests to use current ARIA roles (`tab`, `radio`) and checked-state assertions.
