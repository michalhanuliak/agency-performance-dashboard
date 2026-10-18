import { Suspense } from "react";
import { ErrorBoundary } from "@/lib/error-boundary";
import { DndContext, DragOverlay, SortableContext, rectSortingStrategy } from "@/lib/dnd";
import { edgeBasedCollision } from "@/utils/edgeBasedCollision";
import { TopBar } from "@/components/TopBar/TopBar";
import { SortableWidget } from "@/components/WidgetWrapper/SortableWidget";
import { WidgetWrapper } from "@/components/WidgetWrapper/WidgetWrapper";
import { WidgetSidebar } from "@/components/WidgetSidebar/WidgetSidebar";
import { WidgetErrorFallback } from "@/components/WidgetErrorFallback/WidgetErrorFallback";
import { WidgetSkeleton } from "@/components/WidgetSkeleton/WidgetSkeleton";
import { SKELETON_VARIANTS } from "./constants";
import { useDashboardWidgets } from "./useDashboardWidgets";
import { useSortableDnd } from "@/hooks/useSortableDnd";
import { renderWidget } from "./renderWidget";

export function DashboardPage() {
  const {
    widgets,
    setWidgets,
    visibleWidgets,
    hiddenWidgets,
    isConfigLoading,
    isEditMode,
    isSidebarOpen,
    setIsSidebarOpen,
    typeFilter,
    setTypeFilter,
    handleColSpanChange,
    handleDelete,
    handleAdd,
    handleEnterEditMode,
    handleSaveAndExit,
    handleDiscard,
  } = useDashboardWidgets();

  const {
    sensors,
    activeItem: activeWidget,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    handleDragCancel,
  } = useSortableDnd({ items: widgets, setItems: setWidgets });

  if (isConfigLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <TopBar isEditMode={false} onToggleEditMode={() => {}} />
        <div className="p-6 text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar
        isEditMode={isEditMode}
        onToggleEditMode={handleEnterEditMode}
        onSaveAndExit={handleSaveAndExit}
        onDiscard={handleDiscard}
        onOpenSidebar={() => setIsSidebarOpen(true)}
      />

      <DndContext sensors={sensors} collisionDetection={edgeBasedCollision} onDragStart={handleDragStart} onDragMove={handleDragMove} onDragEnd={handleDragEnd} onDragCancel={handleDragCancel}>
        <SortableContext items={visibleWidgets.map((w) => w.id)} strategy={rectSortingStrategy}>
          <div className={"p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-min gap-4"}>
            {visibleWidgets.map((widget) => (
              <SortableWidget
                key={widget.id}
                id={widget.id}
                title={widget.title}
                isEditMode={isEditMode}
                colSpan={widget.colSpan}
                onColSpanChange={(c) => handleColSpanChange(widget.id, c)}
                onDelete={() => handleDelete(widget.id)}
              >
                <ErrorBoundary
                  FallbackComponent={WidgetErrorFallback}
                  resetKeys={[typeFilter]}
                >
                  <Suspense fallback={<WidgetSkeleton variant={SKELETON_VARIANTS[widget.id]} />}>
                    {renderWidget(widget.id, typeFilter, setTypeFilter)}
                  </Suspense>
                </ErrorBoundary>
              </SortableWidget>
            ))}
          </div>
        </SortableContext>
        <DragOverlay>
          {activeWidget && (
            <WidgetWrapper
              title={activeWidget.title}
              colSpan={activeWidget.colSpan}
              isEditMode
              style={{ opacity: 0.8, cursor: "grabbing" }}
            >
              <div className="flex items-center justify-center min-h-24 text-muted-foreground/50 text-sm">
                {SKELETON_VARIANTS[activeWidget.id] ?? "widget"}
              </div>
            </WidgetWrapper>
          )}
        </DragOverlay>
      </DndContext>

      <WidgetSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        hiddenWidgets={hiddenWidgets}
        onAdd={handleAdd}
      />
    </div>
  );
}
