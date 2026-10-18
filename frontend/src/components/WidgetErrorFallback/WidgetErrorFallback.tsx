import { AlertTriangle } from "@/lib/icons";

interface WidgetErrorFallbackProps {
  error: unknown;
  resetErrorBoundary: () => void;
}

export function WidgetErrorFallback({ resetErrorBoundary }: WidgetErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8 text-muted-foreground">
      <AlertTriangle className="h-8 w-8 text-destructive" />
      <p className="text-sm">Failed to load</p>
      <button
        onClick={resetErrorBoundary}
        className="rounded-md bg-secondary px-3 py-1.5 text-xs hover:bg-secondary/80"
      >
        Retry
      </button>
    </div>
  );
}
