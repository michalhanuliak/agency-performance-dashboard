import { Skeleton } from "@/lib/ui/skeleton";

type WidgetSkeletonVariant = "kpi" | "chart" | "list" | "table";

interface WidgetSkeletonProps {
  variant?: WidgetSkeletonVariant;
}

export function WidgetSkeleton({ variant = "chart" }: WidgetSkeletonProps) {
  switch (variant) {
    case "kpi":
      return (
        <div className="space-y-2 py-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      );
    case "chart":
      return (
        <div className="space-y-2 py-2">
          <Skeleton className="h-[200px] w-full" />
        </div>
      );
    case "list":
      return (
        <div className="space-y-2 py-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      );
    case "table":
      return (
        <div className="space-y-2 py-2">
          <Skeleton className="h-8 w-full" />
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      );
  }
}
