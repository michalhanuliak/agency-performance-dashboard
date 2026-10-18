import type { IncidentType, SortDir } from "@/types/incidents";
import { usePaginatedIncidents } from "@/adapters/usePaginatedIncidents";
import { IncidentsTable } from "./IncidentsTable";

interface IncidentsTableContentProps {
  typeFilter?: IncidentType;
  page: number;
  onPageChange: (page: number) => void;
  sortBy: string;
  sortDir: SortDir;
  onSortChange: (column: string) => void;
}

export function IncidentsTableContent({
  typeFilter,
  page,
  onPageChange,
  sortBy,
  sortDir,
  onSortChange,
}: IncidentsTableContentProps) {
  const { items, totalPages, page: currentPage } = usePaginatedIncidents(page, typeFilter, sortBy, sortDir);
  return (
    <IncidentsTable
      data={items}
      page={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      sortBy={sortBy}
      sortDir={sortDir}
      onSortChange={onSortChange}
    />
  );
}
