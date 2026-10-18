// Re-export generated types — components import from here, not @/api
export type {
  IncidentResponse as Incident,
  PaginatedResponseIncidentResponse as PaginatedIncidents,
  StatsResponse as Stats,
  ResponseTimeByType,
  SeverityCount,
  MonthlyCount,
} from "@/api";

// Re-export enums as both type and value (const objects used at runtime)
export { IncidentType, Severity, ListIncidentsIncidentsGetSortDir as SortDir } from "@/api";
