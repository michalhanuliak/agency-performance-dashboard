import { useStats } from "@/adapters/useStats";
import { KpiCard } from "./KpiCard";

export function CriticalIncidentsKpi() {
  const stats = useStats();
  return (
    <KpiCard
      value={stats.criticalCount}
      trend={stats.trends.criticalIncidents?.value}
      trendDirection={stats.trends.criticalIncidents?.direction}
    />
  );
}
