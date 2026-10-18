import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "@/lib/charts";
import type { ResponseTimeByTypeDto } from "@/adapters/useStats";

interface ResponseTimeChartViewProps {
  data: ResponseTimeByTypeDto[];
}

export function ResponseTimeChartView({ data }: ResponseTimeChartViewProps) {

  return (
    <div className="h-full min-h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis type="number" stroke="var(--muted-foreground)" tick={{ fill: "var(--muted-foreground)" }} />
          <YAxis dataKey="type" type="category" stroke="var(--muted-foreground)" tick={{ fill: "var(--muted-foreground)" }} width={60} />
          <Tooltip
            contentStyle={{ backgroundColor: "var(--card)", color: "var(--card-foreground)", border: "1px solid var(--border)", borderRadius: 8 }}
            labelStyle={{ color: "var(--card-foreground)" }}
            itemStyle={{ color: "var(--card-foreground)" }}
            cursor={{ fill: "var(--muted)", opacity: 0.3 }}
            formatter={(value: number | undefined) => {
              if (value == null) return "";
              const m = Math.floor(value / 60);
              const s = Math.round(value % 60);
              return `${m}m ${s}s`;
            }}
          />
          <Bar dataKey="seconds" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
