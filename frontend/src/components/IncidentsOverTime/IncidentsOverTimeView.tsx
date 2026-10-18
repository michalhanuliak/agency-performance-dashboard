import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "@/lib/charts";
import type { MonthlyCount } from "@/types/incidents";
import { TYPE_COLORS } from "@/utils/colors";

export interface IncidentsOverTimeViewProps {
  data: MonthlyCount[];
}

export function IncidentsOverTimeView({ data: monthlyData }: IncidentsOverTimeViewProps) {

  return (
    <div className="h-full min-h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="month" stroke="var(--muted-foreground)" tick={{ fill: "var(--muted-foreground)" }} fontSize={12} />
          <YAxis stroke="var(--muted-foreground)" tick={{ fill: "var(--muted-foreground)" }} fontSize={12} width={30} />
          <Tooltip
            contentStyle={{ backgroundColor: "var(--card)", color: "var(--card-foreground)", border: "1px solid var(--border)", borderRadius: 8 }}
            labelStyle={{ color: "var(--card-foreground)" }}
            itemStyle={{ color: "var(--card-foreground)" }}
          />
          <Area type="monotone" dataKey="count" stroke={TYPE_COLORS.Traffic} fill={TYPE_COLORS.Traffic} fillOpacity={0.3} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
