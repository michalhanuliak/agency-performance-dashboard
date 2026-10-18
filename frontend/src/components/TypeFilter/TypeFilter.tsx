import type { IncidentType } from "@/types/incidents";
import { Tabs, TabsList, TabsTrigger } from "@/lib/ui/tabs";
import { INCIDENT_TYPES } from "./constants";

interface TypeFilterProps {
  ref?: React.Ref<HTMLDivElement>;
  value?: IncidentType;
  onChange: (value?: IncidentType) => void;
}

export function TypeFilter({ ref, value, onChange }: TypeFilterProps) {
  return (
    <div ref={ref}>
      <Tabs
        value={value ?? "all"}
        onValueChange={(v) => onChange(v === "all" ? undefined : v as IncidentType)}
      >
        <TabsList className="flex-wrap">
          <TabsTrigger value="all">All</TabsTrigger>
          {INCIDENT_TYPES.map((type) => (
            <TabsTrigger key={type} value={type}>
              {type}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
