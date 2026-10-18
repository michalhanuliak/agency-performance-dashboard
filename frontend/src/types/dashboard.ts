// Re-export generated col_span enum as a friendly alias
export type { WidgetConfigItemColSpan as ColSpan } from "@/api";

export const WidgetId = {
  AvgResponse: "avg-response",
  AvgCallAnswer: "avg-call-answer",
  TotalIncidents: "total-incidents",
  CriticalIncidents: "critical-incidents",
  ResponseByType: "response-by-type",
  SeverityBreakdown: "severity-breakdown",
  RecentIncidents: "recent-incidents",
  IncidentsOverTime: "incidents-over-time",
  IncidentsTable: "incidents-table",
} as const;

export type WidgetId = (typeof WidgetId)[keyof typeof WidgetId];
