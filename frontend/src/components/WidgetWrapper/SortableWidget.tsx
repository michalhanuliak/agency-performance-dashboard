import { WidgetWrapper, type WidgetWrapperProps } from "./WidgetWrapper";
import { colSpanClass } from "./constants";
import { useSortableWidget } from "./useSortableWidget";

interface SortableWidgetProps extends Omit<WidgetWrapperProps, "ref" | "dragHandleProps"> {
  id: string;
}

export function SortableWidget({ id, ...props }: SortableWidgetProps) {
  const { isDragging, placeholderHeight, setNodeRef, setSortableRef, dragHandleProps } =
    useSortableWidget({
      id,
      colSpan: props.colSpan ?? 1,
      isEditMode: props.isEditMode ?? false,
    });

  if (isDragging) {
    return (
      <div
        ref={setSortableRef}
        className={`@container ${colSpanClass[props.colSpan ?? 1]}`}
      >
        <div
          className="rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/10"
          style={{ height: placeholderHeight, minHeight: 96 }}
        />
      </div>
    );
  }

  return (
    <WidgetWrapper
      ref={setNodeRef}
      dragHandleProps={dragHandleProps}
      {...props}
    />
  );
}
