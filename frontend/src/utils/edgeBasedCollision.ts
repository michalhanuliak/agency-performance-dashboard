import type { CollisionDetection } from "@/lib/dnd";
import type { ColSpan } from "@/types/dashboard";

interface Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

interface DroppableItem {
  id: string;
  rect: Rect;
  colSpan: ColSpan;
}

interface InsertionResult {
  overId: string;
  side: "before" | "after";
}

export function computeInsertionIndex(
  items: DroppableItem[],
  pointer: { x: number; y: number },
  activeId: string
): InsertionResult | null {
  for (const item of items) {
    if (item.id === activeId) continue;

    const { rect } = item;
    const isOver =
      pointer.x >= rect.left &&
      pointer.x <= rect.right &&
      pointer.y >= rect.top &&
      pointer.y <= rect.bottom;

    if (!isOver) continue;

    let side: "before" | "after";
    if (item.colSpan === 4) {
      const midY = rect.top + rect.height / 2;
      side = pointer.y < midY ? "before" : "after";
    } else {
      const midX = rect.left + rect.width / 2;
      side = pointer.x < midX ? "before" : "after";
    }

    return { overId: item.id, side };
  }

  return null;
}

export const edgeBasedCollision: CollisionDetection = (args) => {
  const { droppableContainers, pointerCoordinates, active } = args;

  if (!pointerCoordinates) {
    return [];
  }

  const items: DroppableItem[] = [];
  for (const container of droppableContainers) {
    const rect = args.droppableRects.get(container.id);
    if (!rect) continue;
    items.push({
      id: String(container.id),
      rect: {
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height,
      },
      colSpan:
        (container.data.current as { colSpan?: ColSpan })?.colSpan ?? 1,
    });
  }

  const result = computeInsertionIndex(
    items,
    pointerCoordinates,
    String(active.id)
  );

  if (!result) {
    return [];
  }

  const container = droppableContainers.find(
    (c) => String(c.id) === result.overId
  );
  if (!container) {
    return [];
  }

  return [
    {
      id: result.overId,
      data: {
        droppableContainer: container,
        value: 0,
        side: result.side,
      },
    },
  ];
};
