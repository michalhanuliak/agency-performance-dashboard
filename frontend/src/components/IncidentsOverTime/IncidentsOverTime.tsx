import { useStats } from "@/adapters/useStats";
import { IncidentsOverTimeView } from "./IncidentsOverTimeView";

export function IncidentsOverTime() {
  const { monthlyCounts } = useStats();
  return <IncidentsOverTimeView data={monthlyCounts} />;
}
