import { useRecentIncidents } from "@/adapters/useIncidents";
import { RecentIncidentsView } from "./RecentIncidentsView";

export function RecentIncidents() {
  const recentIncidents = useRecentIncidents();
  return <RecentIncidentsView data={recentIncidents} />;
}
