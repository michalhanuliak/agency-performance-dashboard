import { AvgResponseTimeKpi } from "@/components/KpiCard/AvgResponseTimeKpi";
import { AvgCallAnswerTimeKpi } from "@/components/KpiCard/AvgCallAnswerTimeKpi";
import { TotalIncidentsKpi } from "@/components/KpiCard/TotalIncidentsKpi";
import { CriticalIncidentsKpi } from "@/components/KpiCard/CriticalIncidentsKpi";
import { ResponseTimeChart } from "@/components/ResponseTimeChart/ResponseTimeChart";
import { SeverityBreakdown } from "@/components/SeverityBreakdown/SeverityBreakdown";
import { RecentIncidents } from "@/components/RecentIncidents/RecentIncidents";
import { IncidentsOverTime } from "@/components/IncidentsOverTime/IncidentsOverTime";
import { IncidentsTableWidget } from "@/components/IncidentsTable/IncidentsTableWidget";
import type { IncidentType } from "@/types/incidents";
import { WidgetId } from "@/types/dashboard";

export function renderWidget(
  widgetId: string,
  typeFilter: IncidentType | undefined,
  onTypeFilterChange: (v?: IncidentType) => void,
) {
  switch (widgetId) {
    case WidgetId.AvgResponse:
      return <AvgResponseTimeKpi />;
    case WidgetId.AvgCallAnswer:
      return <AvgCallAnswerTimeKpi />;
    case WidgetId.TotalIncidents:
      return <TotalIncidentsKpi />;
    case WidgetId.CriticalIncidents:
      return <CriticalIncidentsKpi />;
    case WidgetId.ResponseByType:
      return <ResponseTimeChart />;
    case WidgetId.SeverityBreakdown:
      return <SeverityBreakdown />;
    case WidgetId.RecentIncidents:
      return <RecentIncidents />;
    case WidgetId.IncidentsOverTime:
      return <IncidentsOverTime />;
    case WidgetId.IncidentsTable:
      return <IncidentsTableWidget typeFilter={typeFilter} onTypeFilterChange={onTypeFilterChange} />;
    default:
      return null;
  }
}
