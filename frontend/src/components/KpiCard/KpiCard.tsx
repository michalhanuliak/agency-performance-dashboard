export const TrendDirection = {
  Up: "up",
  Down: "down",
  Neutral: "neutral",
} as const;

export type TrendDirection = (typeof TrendDirection)[keyof typeof TrendDirection];

interface KpiCardProps {
  ref?: React.Ref<HTMLDivElement>;
  value: string | number;
  trend?: string;
  trendDirection?: TrendDirection;
}

const TREND_STYLES: Record<TrendDirection, { className: string; icon: string }> = {
  [TrendDirection.Up]: { className: "text-red-500", icon: "\u2197" },
  [TrendDirection.Down]: { className: "text-green-500", icon: "\u2198" },
  [TrendDirection.Neutral]: { className: "text-muted-foreground", icon: "" },
};

export function KpiCard({ ref, value, trend, trendDirection = "neutral" }: KpiCardProps) {
  const { className, icon } = TREND_STYLES[trendDirection];

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex items-end justify-between">
        <p className="text-4xl font-bold">{value}</p>
        {trend && (
          <span className={`text-sm ${className}`}>
            {icon} {trend}
          </span>
        )}
      </div>
    </div>
  );
}
