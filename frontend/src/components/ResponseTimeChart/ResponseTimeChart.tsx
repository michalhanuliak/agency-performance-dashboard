import { useStats } from "@/adapters/useStats";
import { ResponseTimeChartView } from "./ResponseTimeChartView";

export function ResponseTimeChart() {
  const stats = useStats();
  return <ResponseTimeChartView data={stats.responseTimeByType} />;
}
