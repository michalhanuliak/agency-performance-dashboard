import type { DashboardWidgetConfig } from "@/adapters/useDashboardConfig";
import type { ColSpan } from "@/types/dashboard";
import { WidgetId } from "@/types/dashboard";

export interface WidgetConfig extends DashboardWidgetConfig {
  title: string;
}

export type WidgetSkeletonVariant = "kpi" | "chart" | "list" | "table";

interface WidgetRegistryEntry {
  title: string;
  defaultColSpan: ColSpan;
  skeletonVariant: WidgetSkeletonVariant;
}

const WIDGET_REGISTRY: Record<WidgetId, WidgetRegistryEntry> = {
  [WidgetId.AvgResponse]: { title: "Avg Response Time", defaultColSpan: 1, skeletonVariant: "kpi" },
  [WidgetId.AvgCallAnswer]: { title: "Avg Call Answer Time", defaultColSpan: 1, skeletonVariant: "kpi" },
  [WidgetId.TotalIncidents]: { title: "Total Incidents", defaultColSpan: 1, skeletonVariant: "kpi" },
  [WidgetId.CriticalIncidents]: { title: "Critical Incidents", defaultColSpan: 1, skeletonVariant: "kpi" },
  [WidgetId.ResponseByType]: { title: "Avg Response Time by Type", defaultColSpan: 2, skeletonVariant: "chart" },
  [WidgetId.SeverityBreakdown]: { title: "Severity Breakdown", defaultColSpan: 2, skeletonVariant: "chart" },
  [WidgetId.RecentIncidents]: { title: "Recent Incidents", defaultColSpan: 1, skeletonVariant: "list" },
  [WidgetId.IncidentsOverTime]: { title: "Incidents Over Time", defaultColSpan: 2, skeletonVariant: "chart" },
  [WidgetId.IncidentsTable]: { title: "Incidents Table", defaultColSpan: 4, skeletonVariant: "table" },
};

export const INITIAL_WIDGETS: WidgetConfig[] = Object.entries(WIDGET_REGISTRY).map(
  ([id, entry]) => ({
    id,
    title: entry.title,
    colSpan: entry.defaultColSpan,
    visible: true,
  }),
);

export const SKELETON_VARIANTS: Record<string, WidgetSkeletonVariant> = Object.fromEntries(
  Object.entries(WIDGET_REGISTRY).map(([id, entry]) => [id, entry.skeletonVariant]),
);

export const WIDGET_TITLES: Record<string, string> = Object.fromEntries(
  Object.entries(WIDGET_REGISTRY).map(([id, entry]) => [id, entry.title]),
);
