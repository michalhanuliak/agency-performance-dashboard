import { Suspense, useState } from "react";
import { type IncidentType, SortDir } from "@/types/incidents";
import { TypeFilter } from "@/components/TypeFilter/TypeFilter";
import { WidgetSkeleton } from "@/components/WidgetSkeleton/WidgetSkeleton";
import { IncidentsTableContent } from "./IncidentsTableContent";

interface IncidentsTableWidgetProps {
  typeFilter?: IncidentType;
  onTypeFilterChange: (type?: IncidentType) => void;
}

export function IncidentsTableWidget({ typeFilter, onTypeFilterChange }: IncidentsTableWidgetProps) {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("timestamp");
  const [sortDir, setSortDir] = useState<SortDir>(SortDir.asc);

  const handleTypeFilterChange = (type?: IncidentType) => {
    setPage(1);
    onTypeFilterChange(type);
  };

  const handleSortChange = (column: string) => {
    if (column === sortBy) {
      setSortDir(sortDir === SortDir.asc ? SortDir.desc : SortDir.asc);
    } else {
      setSortBy(column);
      setSortDir(SortDir.asc);
    }
    setPage(1);
  };

  return (
    <div className="space-y-4 min-w-0">
      <TypeFilter value={typeFilter} onChange={handleTypeFilterChange} />
      <Suspense key={`${typeFilter ?? "all"}-${page}-${sortBy}-${sortDir}`} fallback={<WidgetSkeleton variant="table" />}>
        <IncidentsTableContent
          typeFilter={typeFilter}
          page={page}
          onPageChange={setPage}
          sortBy={sortBy}
          sortDir={sortDir}
          onSortChange={handleSortChange}
        />
      </Suspense>
    </div>
  );
}
