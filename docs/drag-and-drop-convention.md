# Drag & Drop Convention

## Overview

Widget reordering uses **dnd-kit** with a custom **edge-based collision detector**. Widgets live in a flat ordered array — the CSS grid handles visual positioning and wrapping. Dragging reorders the array; the grid reflows automatically.

## How Collision Detection Works

The custom `edgeBasedCollision` detector (`frontend/src/utils/edgeBasedCollision.ts`) replaces dnd-kit's default `closestCenter`:

1. **Hit-test** — find which droppable widget the pointer is physically over (bounding rect check)
2. **Side detection** — determine if the pointer is on the first or second half of that widget:
   - **colSpan 1 or 2:** left half → "before", right half → "after"
   - **colSpan 4 (full-width):** top half → "before", bottom half → "after"
3. **Skip active widget** — the dragged widget's placeholder is ignored
4. **No fallback** — if the pointer isn't over any widget, return empty (no action)

The collision result includes `side: "before" | "after"` in its data, which the drag handler reads to compute the correct insertion index.

## Drag Lifecycle

| Event | Handler | Purpose |
|-------|---------|---------|
| `onDragStart` | `handleDragStart` | Save active ID, snapshot widget order for cancel, reset dedup ref |
| `onDragMove` | `handleDragMove` | Read collision side, compute index, `arrayMove` the widget |
| `onDragEnd` | `handleDragEnd` | Clear drag state (order is already committed) |
| `onDragCancel` | `handleDragCancel` | Restore pre-drag snapshot (Escape key) |

### Why `onDragMove` instead of `onDragOver`

`onDragOver` only fires when the `over` target changes. Moving the pointer from the right half to the left half of the **same** widget doesn't change `over`, so the side change is missed. `onDragMove` fires on every pointer movement.

A `lastInsertionRef` deduplicates by tracking `{ overId, side }` — the handler skips if nothing changed.

### Why no `closestCenter` fallback

When the pointer is over the dragged widget's placeholder (skipped by collision detection), `closestCenter` would pick up a nearby unrelated widget and move it, causing flickering. Returning empty collisions is safer — the drag simply does nothing until the pointer is clearly over another widget.

## Passing Widget Data to Collision Detection

`SortableWidget` passes `colSpan` via `useSortable`'s `data` prop:

```typescript
useSortable({ id, data: { colSpan: props.colSpan ?? 1 }, disabled: !isEditMode });
```

The collision detector reads this from `container.data.current.colSpan` to decide left/right vs top/bottom split.

## Index Calculation

Given `oldIndex` (dragged widget) and `overIndex` (target widget):

| Side | Direction | Target Index |
|------|-----------|-------------|
| "before" | dragging backward (old > over) | `overIndex` |
| "before" | dragging forward (old < over) | `overIndex - 1` |
| "after" | dragging forward (old < over) | `overIndex` |
| "after" | dragging backward (old > over) | `overIndex + 1` |

Clamped to `[0, length - 1]`. Skipped if equal to current index (no-op).

## Files

| File | Role |
|------|------|
| `frontend/src/utils/edgeBasedCollision.ts` | `computeInsertionIndex` (pure, tested) + `edgeBasedCollision` (dnd-kit adapter) |
| `frontend/src/utils/edgeBasedCollision.test.ts` | 8 unit tests covering all colSpan variants and edge cases |
| `frontend/src/pages/DashboardPage.tsx` | Drag handlers, widget state, DndContext wiring |
| `frontend/src/components/WidgetWrapper/SortableWidget.tsx` | Placeholder rendering (`isDragging`), colSpan data |
