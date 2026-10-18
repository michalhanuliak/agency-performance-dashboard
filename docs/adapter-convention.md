# Adapter Convention

## Purpose

Adapters are custom hooks that sit between Orval-generated API calls and components. They own error handling, loading states, and data transforms. Components never call the generated API directly.

```
api/ (generated) -> adapters/ (hooks) -> components (via props)
```

## File Structure

```
adapters/
├── useStats.ts
└── useIncidents.ts
```

One file per domain concept. Named `use<Domain>.ts`.

## Adapter File

```ts
// adapters/useStats.ts
import { useGetStats, type GetStatsResponse } from "@/api";
import { formatSeconds } from "@/utils/format";

interface ResponseTimeByType {
  type: string;
  seconds: number;
  formatted: string;
}

interface StatsDto {
  avgCallAnswerTime: number;
  responseTimeByType: ResponseTimeByType[];
  totalIncidents: number;
}

function toStatsDto(data: GetStatsResponse): StatsDto {
  return {
    avgCallAnswerTime: data.avg_call_answer_time,
    responseTimeByType: data.avg_response_time_by_type.map((item) => ({
      type: item.type,
      seconds: item.avg_response_time,
      formatted: formatSeconds(item.avg_response_time),
    })),
    totalIncidents: data.total_incidents,
  };
}

export function useStats() {
  const { data, error, isLoading } = useGetStats();

  return {
    data: data ? toStatsDto(data) : null,
    isLoading,
    error,
  };
}
```

## Rules

- Return `{ data, isLoading, error }` — data is a DTO or null
- Define DTO interfaces and a `to<Domain>Dto()` mapper function per adapter — keeps transform logic testable and separate from the hook
- DTO types stay co-located in the adapter file unless reused elsewhere
- Format helpers belong in `utils/` — adapters import them, not define them
- Types re-exported from `@/types` for shared use; generated `@/api` types never imported directly by components
- One adapter can compose multiple API calls if they belong to the same domain
