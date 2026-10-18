import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/lib/ui/sheet";
import { Button } from "@/lib/ui/button";

interface HiddenWidget {
  id: string;
  title: string;
}

interface WidgetSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  hiddenWidgets: HiddenWidget[];
  onAdd: (id: string) => void;
}

export function WidgetSidebar({ isOpen, onClose, hiddenWidgets, onAdd }: WidgetSidebarProps) {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" data-testid="widget-sidebar">
        <SheetHeader>
          <SheetTitle>Add Widgets</SheetTitle>
        </SheetHeader>

        {hiddenWidgets.length === 0 ? (
          <p className="text-muted-foreground text-sm px-4">All widgets active</p>
        ) : (
          <div className="space-y-3 px-4">
            {hiddenWidgets.map((w) => (
              <div
                key={w.id}
                className="flex items-center justify-between rounded-lg border border-border p-3"
              >
                <span className="text-sm">{w.title}</span>
                <Button size="sm" onClick={() => onAdd(w.id)}>
                  Add
                </Button>
              </div>
            ))}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
