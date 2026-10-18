import { useCallback, useState } from "react";
import { useSortable } from "@/lib/dnd";
import type { ColSpan } from "@/types/dashboard";

interface UseSortableWidgetOptions {
  id: string;
  colSpan: ColSpan;
  isEditMode: boolean;
}

export function useSortableWidget({ id, colSpan, isEditMode }: UseSortableWidgetOptions) {
  const [placeholderHeight, setPlaceholderHeight] = useState<number | undefined>();

  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    isDragging,
  } = useSortable({ id, data: { colSpan }, disabled: !isEditMode });

  const setNodeRef = useCallback(
    (node: HTMLDivElement | null) => {
      setSortableRef(node);
      if (node) {
        const { height } = node.getBoundingClientRect();
        setPlaceholderHeight(height);
      }
    },
    [setSortableRef],
  );

  return {
    isDragging,
    placeholderHeight,
    setNodeRef,
    setSortableRef,
    dragHandleProps: isEditMode ? { ...attributes, ...listeners } : undefined,
  };
}
