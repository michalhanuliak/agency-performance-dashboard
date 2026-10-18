import type { CSSProperties } from "react";
import { Button } from "@/lib/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/lib/ui/toggle-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/ui/card";
import { Trash2 } from "@/lib/icons";
import { SIZE_OPTIONS, colSpanClass, type ColSpan } from "./constants";

export type { ColSpan };

export interface WidgetWrapperProps {
  ref?: React.Ref<HTMLDivElement>;
  title?: string;
  isEditMode?: boolean;
  colSpan?: ColSpan;
  onColSpanChange?: (colSpan: ColSpan) => void;
  onDelete?: () => void;
  style?: CSSProperties;
  dragHandleProps?: Record<string, unknown>;
  children: React.ReactNode;
}

export function WidgetWrapper({
  ref,
  title,
  isEditMode = false,
  colSpan = 1,
  onColSpanChange,
  onDelete,
  style,
  dragHandleProps,
  children,
}: WidgetWrapperProps) {
  return (
    <div
      ref={ref}
      style={style}
      className={`@container ${colSpanClass[colSpan]}`}
    >
      <Card
        className={`h-full flex flex-col widget-shadow hover:widget-shadow-hover transition-shadow duration-200 ${isEditMode ? "border-dashed border-muted-foreground/40" : ""}`}
      >
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 pb-2">
          <div className="flex items-center gap-2">
            {isEditMode && (
              <span
                className="text-muted-foreground cursor-grab"
                data-testid="drag-handle"
                {...dragHandleProps}
              >
                ⠿
              </span>
            )}
            {title && (
              <CardTitle className="text-base font-semibold tracking-tight">{title}</CardTitle>
            )}
          </div>
          {isEditMode && (
            <div className="flex items-center gap-2">
              <ToggleGroup
                type="single"
                value={String(colSpan)}
                onValueChange={(v) => v && onColSpanChange?.(Number(v) as ColSpan)}
                size="sm"
                className="gap-0 rounded-md border border-border"
              >
                {SIZE_OPTIONS.map((opt) => (
                  <ToggleGroupItem
                    key={opt.label}
                    value={String(opt.colSpan)}
                    aria-label={`Resize to ${opt.label}`}
                    className="h-6 px-2 text-[11px] rounded-none first:rounded-l-md last:rounded-r-md"
                  >
                    {opt.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
              <Button
                size="icon"
                variant="ghost"
                onClick={onDelete}
                data-testid="widget-delete"
                aria-label="Remove widget"
                className="h-6 w-6 text-muted-foreground hover:text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="flex-1 min-h-0">{children}</CardContent>
      </Card>
    </div>
  );
}
