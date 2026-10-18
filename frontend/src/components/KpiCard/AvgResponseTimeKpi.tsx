import { useStats } from "@/adapters/useStats";
import { KpiCard } from "./KpiCard";

export function AvgResponseTimeKpi() {
  const stats = useStats();
  return (
    <KpiCard
      value={stats.avgResponseTime}
      trend={stats.trends.avgResponseTime?.value}
      trendDirection={stats.trends.avgResponseTime?.direction}
    />
  );
}
