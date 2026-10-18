import { getGetStatsStatsGetQueryOptions, type getStatsStatsGetResponse } from "@/api";
import { useSuspenseQuery, type QueryFunction } from "@/lib/query";
import { formatSecondsToMMSS, formatSeconds } from "@/utils/format";
import { TYPE_COLORS, FALLBACK_COLOR } from "@/utils/colors";
import type { Stats, SeverityCount, MonthlyCount } from "@/types/incidents";
import { TrendDirection } from "@/components/KpiCard/KpiCard";

export interface ResponseTimeByTypeDto {
  type: string;
  seconds: number;
  formatted: string;
  fill: string;
}

export interface TrendDto {
  value: string;
  direction: TrendDirection;
}

export interface StatsDto {
  avgCallAnswerTime: string;
  avgResponseTime: string;
  responseTimeByType: ResponseTimeByTypeDto[];
  totalIncidents: number;
  severityCounts: SeverityCount[];
  criticalCount: number;
  monthlyCounts: MonthlyCount[];
  trends: {
    totalIncidents?: TrendDto;
    avgCallAnswerTime?: TrendDto;
    avgResponseTime?: TrendDto;
    criticalIncidents?: TrendDto;
  };
}

function toTrendDto(value: number | null | undefined): TrendDto | undefined {
  if (value == null) return undefined;
  return {
    value: `${Math.abs(value)}%`,
    direction: value === 0 ? TrendDirection.Neutral : value > 0 ? TrendDirection.Up : TrendDirection.Down,
  };
}

function toStatsDto(data: Stats): StatsDto {
  const allAvgSeconds =
    data.avg_response_time_by_type.reduce((sum, item) => sum + item.avg_response_time, 0) /
    (data.avg_response_time_by_type.length || 1);

  const criticalItem = data.severity_counts.find((s) => s.severity === "Critical");

  return {
    avgCallAnswerTime: formatSeconds(data.avg_call_answer_time),
    avgResponseTime: formatSecondsToMMSS(allAvgSeconds),
    responseTimeByType: data.avg_response_time_by_type.map((item) => ({
      type: item.type,
      seconds: item.avg_response_time,
      formatted: formatSecondsToMMSS(item.avg_response_time),
      fill: TYPE_COLORS[item.type] || FALLBACK_COLOR,
    })),
    totalIncidents: data.total_incidents,
    severityCounts: data.severity_counts,
    criticalCount: criticalItem?.count ?? 0,
    monthlyCounts: data.monthly_counts,
    trends: {
      totalIncidents: toTrendDto(data.trends.total_incidents),
      avgCallAnswerTime: toTrendDto(data.trends.avg_call_answer_time),
      avgResponseTime: toTrendDto(data.trends.avg_response_time),
      criticalIncidents: toTrendDto(data.trends.critical_incidents),
    },
  };
}

export function useStats(): StatsDto {
  const { data } = useSuspenseQuery({
    ...getGetStatsStatsGetQueryOptions(),
    queryFn: getGetStatsStatsGetQueryOptions().queryFn as QueryFunction<getStatsStatsGetResponse>,
  });
  return toStatsDto(data.data as Stats);
}
