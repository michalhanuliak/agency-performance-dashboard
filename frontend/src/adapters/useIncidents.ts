import {
  getRecentIncidentsIncidentsRecentGetQueryOptions,
  type recentIncidentsIncidentsRecentGetResponse,
} from "@/api";
import { useSuspenseQuery, type QueryFunction } from "@/lib/query";
import type { Incident } from "@/types/incidents";
import { formatTime } from "@/utils/format";

export interface RecentIncidentDto {
  id: string;
  time: string;
  type: string;
  severity: string;
  summary: string;
}

function toRecentIncidentDto(data: Incident): RecentIncidentDto {
  return {
    id: data.id,
    time: formatTime(data.timestamp),
    type: data.type,
    severity: data.severity,
    summary: data.ai_summary,
  };
}

export function useRecentIncidents(limit = 5) {
  const opts = getRecentIncidentsIncidentsRecentGetQueryOptions({ limit });
  const { data } = useSuspenseQuery({
    ...opts,
    queryFn: opts.queryFn as QueryFunction<recentIncidentsIncidentsRecentGetResponse>,
  });
  return (data.data as Incident[]).map(toRecentIncidentDto);
}
