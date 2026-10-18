import { useRef, useState, type Dispatch, type SetStateAction } from "react";
import {
  PointerSensor,
  useSensor,
  useSensors,
  arrayMove,
  type DragStartEvent,
  type DragMoveEvent,
} from "@/lib/dnd";

interface UseSortableDndParams<T extends { id: string }> {
  items: T[];
  setItems: Dispatch<SetStateAction<T[]>>;
}

export function useSortableDnd<T extends { id: string }>({ items, setItems }: UseSortableDndParams<T>) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [preDragItems, setPreDragItems] = useState<T[] | null>(null);
  const lastInsertionRef = useRef<{ overId: string; side: string } | null>(null);

  const activeItem = activeId ? items.find((item) => item.id === activeId) : null;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
    setPreDragItems(items);
    lastInsertionRef.current = null;
  }

  function handleDragMove(event: DragMoveEvent) {
    const { active, over, collisions } = event;
    if (!over || active.id === over.id) return;

    const side =
      (collisions?.[0]?.data as { side?: "before" | "after" } | undefined)
        ?.side ?? "before";

    const overId = String(over.id);
    if (
      lastInsertionRef.current?.overId === overId &&
      lastInsertionRef.current?.side === side
    ) {
      return;
    }
    lastInsertionRef.current = { overId, side };

    setItems((prev) => {
      const oldIndex = prev.findIndex((item) => item.id === active.id);
      const overIndex = prev.findIndex((item) => item.id === overId);
      if (oldIndex === -1 || overIndex === -1) return prev;

      let newIndex: number;
      if (side === "after") {
        newIndex = oldIndex < overIndex ? overIndex : overIndex + 1;
      } else {
        newIndex = oldIndex > overIndex ? overIndex : overIndex - 1;
      }

      newIndex = Math.max(0, Math.min(newIndex, prev.length - 1));
      if (oldIndex === newIndex) return prev;

      return arrayMove(prev, oldIndex, newIndex);
    });
  }

  function handleDragEnd() {
    setActiveId(null);
    setPreDragItems(null);
    lastInsertionRef.current = null;
  }

  function handleDragCancel() {
    if (preDragItems) setItems(preDragItems);
    setActiveId(null);
    setPreDragItems(null);
    lastInsertionRef.current = null;
  }

  return {
    sensors,
    activeItem,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    handleDragCancel,
  };
}
