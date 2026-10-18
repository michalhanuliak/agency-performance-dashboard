import { useStats } from "@/adapters/useStats";
import { KpiCard } from "./KpiCard";

export function AvgCallAnswerTimeKpi() {
  const stats = useStats();
  return (
    <KpiCard
      value={stats.avgCallAnswerTime}
      trend={stats.trends.avgCallAnswerTime?.value}
      trendDirection={stats.trends.avgCallAnswerTime?.direction}
    />
  );
}
