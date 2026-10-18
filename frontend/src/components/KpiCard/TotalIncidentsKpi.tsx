import { useStats } from "@/adapters/useStats";
import { KpiCard } from "./KpiCard";

export function TotalIncidentsKpi() {
  const stats = useStats();
  return (
    <KpiCard
      value={stats.totalIncidents}
      trend={stats.trends.totalIncidents?.value}
      trendDirection={stats.trends.totalIncidents?.direction}
    />
  );
}
