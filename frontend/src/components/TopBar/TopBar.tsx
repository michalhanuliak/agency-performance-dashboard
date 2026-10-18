import { formatDateLong } from "@/utils/format";
import { Sun, Moon } from "@/lib/icons";
import { Button } from "@/lib/ui/button";
import { useTheme } from "@/lib/useTheme";

interface TopBarProps {
  ref?: React.Ref<HTMLDivElement>;
  isEditMode: boolean;
  onToggleEditMode: () => void;
  onSaveAndExit?: () => void;
  onDiscard?: () => void;
  onOpenSidebar?: () => void;
}

export function TopBar({
  ref,
  isEditMode,
  onToggleEditMode,
  onSaveAndExit,
  onDiscard,
  onOpenSidebar,
}: TopBarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      ref={ref}
      className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-8 py-4 border-b border-border"
    >
      <div className="min-w-0">
        <h1 className="text-base sm:text-xl font-bold tracking-tight truncate">
          Metro 911 Command Center
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {formatDateLong()}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label={
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
        {isEditMode ? (
          <>
            <Button variant="outline" onClick={onDiscard}>
              Discard
            </Button>
            <Button onClick={onSaveAndExit}>Save &amp; Exit</Button>
          </>
        ) : (
          <Button variant="secondary" onClick={onToggleEditMode}>
            Edit Dashboard
          </Button>
        )}
        {isEditMode && onOpenSidebar && (
          <Button variant="secondary" onClick={onOpenSidebar}>
            Add Widgets
          </Button>
        )}
      </div>
    </div>
  );
}
