import { useState, useMemo } from "react";
import type { IncidentType } from "@/types/incidents";
import type { ColSpan } from "@/types/dashboard";
import { useDashboardConfig, useSaveDashboardConfig } from "@/adapters/useDashboardConfig";
import { INITIAL_WIDGETS, WIDGET_TITLES, type WidgetConfig } from "./constants";

export function useDashboardWidgets() {
  const { data: savedConfig, isLoading: isConfigLoading } = useDashboardConfig();
  const { mutate: saveConfig } = useSaveDashboardConfig();

  const [isEditMode, setIsEditMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState<IncidentType | undefined>();
  const [draftWidgets, setDraftWidgets] = useState<WidgetConfig[] | null>(null);

  const serverWidgets = useMemo(
    () =>
      savedConfig
        ? savedConfig.map((w) => ({ ...w, title: WIDGET_TITLES[w.id] ?? w.id }))
        : INITIAL_WIDGETS,
    [savedConfig],
  );

  const widgets = draftWidgets ?? serverWidgets;
  const setWidgets = (updater: WidgetConfig[] | ((prev: WidgetConfig[]) => WidgetConfig[])) => {
    setDraftWidgets((prev) => {
      const current = prev ?? serverWidgets;
      return typeof updater === "function" ? updater(current) : updater;
    });
  };

  const visibleWidgets = widgets.filter((w) => w.visible);
  const hiddenWidgets = widgets.filter((w) => !w.visible);

  function handleColSpanChange(id: string, colSpan: ColSpan) {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, colSpan } : w))
    );
  }

  function handleDelete(id: string) {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, visible: false } : w))
    );
  }

  function handleAdd(id: string) {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, visible: true } : w))
    );
  }

  function handleEnterEditMode() {
    setDraftWidgets(widgets);
    setIsEditMode(true);
  }

  function handleSaveAndExit() {
    saveConfig(widgets.map(({ id, colSpan, visible }) => ({ id, colSpan, visible })));
    setIsEditMode(false);
    setDraftWidgets(null);
  }

  function handleDiscard() {
    setDraftWidgets(null);
    setIsEditMode(false);
  }

  return {
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
  };
}
