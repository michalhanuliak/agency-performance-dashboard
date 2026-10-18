import { useSuspenseQuery, type QueryFunction } from "@/lib/query";
import { getListIncidentsIncidentsGetQueryOptions, ListIncidentsIncidentsGetSortDir, type listIncidentsIncidentsGetResponse, type ListIncidentsIncidentsGetSortBy, type IncidentType } from "@/api";
import type { Incident, PaginatedIncidents } from "@/types/incidents";
import { formatDateTime } from "@/utils/format";

export interface PaginatedIncidentDto {
  id: string;
  timestamp: string;
  type: string;
  severity: string;
  responseTime: number;
  callAnswerTime: number;
  aiSummary: string;
}

export interface PaginatedIncidentsResult {
  items: PaginatedIncidentDto[];
  total: number;
  page: number;
  totalPages: number;
}

function toDto(item: Incident): PaginatedIncidentDto {
  return {
    id: item.id,
    timestamp: formatDateTime(item.timestamp),
    type: item.type,
    severity: item.severity,
    responseTime: item.response_time_seconds,
    callAnswerTime: item.call_answer_time_seconds,
    aiSummary: item.ai_summary,
  };
}

const SORT_COLUMN_MAP: Record<string, ListIncidentsIncidentsGetSortBy> = {
  timestamp: "timestamp",
  type: "type",
  severity: "severity",
  responseTime: "response_time_seconds",
  callAnswerTime: "call_answer_time_seconds",
};

export function usePaginatedIncidents(
  page: number,
  type?: IncidentType,
  sortBy: string = "timestamp",
  sortDir: ListIncidentsIncidentsGetSortDir = ListIncidentsIncidentsGetSortDir.asc,
): PaginatedIncidentsResult {
  const params = {
    page,
    page_size: 20,
    sort_by: SORT_COLUMN_MAP[sortBy] ?? ("timestamp" as ListIncidentsIncidentsGetSortBy),
    sort_dir: sortDir,
    ...(type ? { type } : {}),
  };
  const opts = getListIncidentsIncidentsGetQueryOptions(params);
  const { data } = useSuspenseQuery({
    ...opts,
    queryFn: opts.queryFn as QueryFunction<listIncidentsIncidentsGetResponse>,
  });
  const paginated = data.data as PaginatedIncidents;
  return {
    items: paginated.items.map(toDto),
    total: paginated.total,
    page: paginated.page,
    totalPages: paginated.total_pages,
  };
}
