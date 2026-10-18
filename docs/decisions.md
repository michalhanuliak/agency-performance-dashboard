# Engineering Decisions

## Scope Guardrail (2026-03-08)

Decision:

- Stabilization-only changes before publishing.
- No product/UX behavior changes without explicit discussion and approval.

Rationale:

- Keep risk low while improving deploy confidence and clarity for anyone cloning the repo.
- Avoid introducing regressions late in the project.

Tradeoff:

- Some product enhancements are intentionally deferred.

## Widget-Island Architecture

Decision:

- Each dashboard widget owns its data fetch lifecycle, loading state, and failure handling.

Rationale:

- A single widget failure should not break the entire dashboard.
- Improves composability and makes widgets testable in isolation.

Tradeoff:

- More adapter/component boundaries and repeated patterns.

## API Client Boundary via Orval + Adapters

Decision:

- Generate API client/types from OpenAPI with Orval.
- Keep components isolated from generated shapes using adapter DTO mappers.

Rationale:

- Reduces manual API typing drift.
- Keeps component contracts stable even when backend schema naming differs.

Tradeoff:

- Requires regeneration discipline and adapter maintenance.

## Third-Party Import Boundary (`src/lib/*`)

Decision:

- Re-export third-party UI/chart/table libraries through local wrappers.

Rationale:

- Enables low-friction library swaps.
- Keeps import surface consistent across the frontend.

Tradeoff:

- Additional wrapper files and indirection.

## Dashboard Layout Persistence in Backend

Decision:

- Persist widget visibility/order/size to backend (`/dashboard/config`).

Rationale:

- Preserves user workspace state across sessions and refreshes.

Tradeoff:

- Adds backend state management and config schema evolution concerns.

## Render Blueprint Deployment

Decision:

- Use Render `render.yaml` to define both services as infrastructure-as-code.

Rationale:

- Single source of truth for deployment config.
- Anyone can replicate the deployment via the Blueprint flow.

Tradeoff:

- Render free-tier cold starts and resource constraints.
