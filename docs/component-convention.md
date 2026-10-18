# Component Convention

## Folder Structure

Each component lives in its own folder:

```
components/
└── MetricCard/
    ├── MetricCard.tsx
    ├── MetricCard.stories.tsx
    └── constants.ts          # module-level constants (optional)
```

## Component File

```tsx
// components/MetricCard/MetricCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/ui/card";

interface MetricCardProps {
  ref?: React.Ref<HTMLDivElement>;
  title: string;
  value: string;
}

export function MetricCard({ ref, title, value }: MetricCardProps) {
  return (
    <Card ref={ref}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{value}</p>
      </CardContent>
    </Card>
  );
}
```

Rules:
- Named export as `function` declaration (not arrow function)
- `ref` as a regular prop (React 19 — no `forwardRef` needed)
- Props interface defined in the same file
- Import third-party libraries through `@/lib/` re-exports
- No business logic — data comes in via props, events go out via callbacks
- **One component per file** — each `.tsx` file exports exactly one React component. Helper/presentational components live in the same directory as separate files (e.g., `RecentIncidentsView.tsx` alongside `RecentIncidents.tsx`). Exception: shadcn/ui primitives in `ui/` follow their own conventions.
- **Constants in `constants.ts`** — module-level constants (config arrays, lookup maps, sets) live in a co-located `constants.ts` file within the component directory, not inline in the component file.

## Storybook File

```tsx
// components/MetricCard/MetricCard.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { MetricCard } from "./MetricCard";

const meta: Meta<typeof MetricCard> = {
  component: MetricCard,
};

export default meta;
type Story = StoryObj<typeof MetricCard>;

export const Default: Story = {
  args: {
    title: "Avg Response Time",
    value: "04:32",
  },
};
```

Rules:
- One `Default` story minimum
- Additional stories for meaningful variants
- Use `args` for props

## Widget Components

Widgets are components that act as **islands** — self-contained with their own data fetching, error boundary, and `@container` responsive sizing.

### Size Prop

Every widget accepts a `size` prop: `"minimal" | "normal" | "large"`. The widget renders differently based on size.

```tsx
// components/KpiWidget/KpiWidget.tsx
import { useStats } from "@/adapters/useStats";

type WidgetSize = "minimal" | "normal" | "large";

interface KpiWidgetProps {
  ref?: React.Ref<HTMLDivElement>;
  metric: "avgResponseTime" | "avgCallAnswerTime" | "totalIncidents";
  size: WidgetSize;
}

export function KpiWidget({ ref, metric, size }: KpiWidgetProps) {
  const { data, isLoading, error } = useStats();

  if (isLoading) return <WidgetSkeleton />;
  if (error || !data) return <WidgetError />;

  const value = data[metric];

  return (
    <div ref={ref} className="@container">
      {size === "minimal" && <p className="text-2xl font-bold">{value}</p>}
      {size === "normal" && (
        <>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-3xl font-bold">{value}</p>
        </>
      )}
      {size === "large" && (
        <>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-3xl font-bold">{value}</p>
          {/* sparkline or trend */}
        </>
      )}
    </div>
  );
}
```

### Container Queries

Widgets use `@container` CSS so they adapt to their grid cell size, not the viewport:

```css
@container (max-width: 200px) {
  /* minimal layout */
}
@container (min-width: 201px) and (max-width: 400px) {
  /* normal layout */
}
@container (min-width: 401px) {
  /* large layout */
}
```

