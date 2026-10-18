import { PieChart, Pie, Cell, ResponsiveContainer } from "@/lib/charts";
import type { SeverityCount } from "@/types/incidents";
import { SEVERITY_COLORS, FALLBACK_COLOR } from "@/utils/colors";

interface SeverityBreakdownViewProps {
  data: SeverityCount[];
  total: number;
}

export function SeverityBreakdownView({ data, total }: SeverityBreakdownViewProps) {

  return (
    <div className="flex flex-col @[320px]:flex-row items-center justify-center gap-4 h-full min-h-[200px]">
      <div className="relative aspect-square w-[140px] @[320px]:h-full @[320px]:w-auto @[320px]:max-h-[280px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="severity"
              innerRadius="60%"
              outerRadius="85%"
              strokeWidth={0}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.severity}
                  fill={SEVERITY_COLORS[entry.severity] || FALLBACK_COLOR}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold">{total}</span>
        </div>
      </div>
      <div className="space-y-2">
        {data.map((item) => (
          <div
            key={item.severity}
            className="flex items-center justify-between gap-8"
          >
            <div className="flex items-center gap-2">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: SEVERITY_COLORS[item.severity] }}
              />
              <span className="text-sm">{item.severity}</span>
            </div>
            <span className="text-sm font-medium">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
