import { useStats } from "@/adapters/useStats";
import { SeverityBreakdownView } from "./SeverityBreakdownView";

export function SeverityBreakdown() {
  const stats = useStats();
  return <SeverityBreakdownView data={stats.severityCounts} total={stats.totalIncidents} />;
}
