# Frontend: Agency Performance Dashboard

## Docs

Read these before writing code:

- `docs/component-convention.md` — folder-per-component pattern, React 19 function components with ref as prop, Storybook stories, widget size variants
- `docs/adapter-convention.md` — custom hooks wrapping Orval-generated API, DTO mapper functions, error/loading handling
- `docs/figma-design-prompt.md` — full visual design specification for the dark-themed dashboard

## Key Rules

- **TypeScript:** Use `interface` for object shapes, `type` for unions/intersections/utilities
- **Imports:** Never import from `@/api` directly in components — use `@/types` for types, `@/adapters` for data
- **Lib re-exports:** All third-party imports go through `src/lib/` (recharts, tanstack, etc.)
- **UI Primitives:** Use shadcn/ui components (Button, Tabs, Sheet, Pagination, etc.) instead of raw HTML elements. Import through `@/lib/ui/*` re-exports. Install new ones with `npx shadcn@latest add <component>` from `frontend/`.
- **Components:** Named exports, `function` declarations, folder-per-component with co-located stories
- **Widgets:** Islands architecture — each widget has its own adapter, error boundary, loading state. Support 3 sizes: minimal/normal/large. Use CSS `@container` queries for responsive sizing.
- **Adapters:** One per domain, define DTO interfaces + `to<Domain>Dto()` mapper, return `{ data, isLoading, error }`
- **Utils:** Pure functions in `src/utils/`, co-located `*.test.ts` files
- **Grid:** 4-column fixed grid, scales to 1 column on mobile. Widget config (positions, sizes) persisted to backend.
