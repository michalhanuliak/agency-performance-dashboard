import type { RecentIncidentDto } from "@/adapters/useIncidents";
import { TYPE_COLORS, SEVERITY_COLORS } from "@/utils/colors";

interface RecentIncidentsViewProps {
  data: RecentIncidentDto[];
}

export function RecentIncidentsView({ data: recentIncidents }: RecentIncidentsViewProps) {

  return (
    <div className="space-y-4">
      {recentIncidents.map((item) => (
        <div key={item.id} className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: TYPE_COLORS[item.type] }} />
            <span className="text-sm text-muted-foreground">{item.time}</span>
            <span
              className="rounded-full px-2 py-0.5 text-xs font-medium"
              style={{ backgroundColor: `${SEVERITY_COLORS[item.severity]}20`, color: SEVERITY_COLORS[item.severity] }}
            >
              {item.severity}
            </span>
          </div>
          <p className="text-sm pl-4">{item.summary}</p>
        </div>
      ))}
    </div>
  );
}
