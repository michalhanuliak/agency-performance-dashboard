import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@/lib/table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/lib/ui/pagination";
import { Button } from "@/lib/ui/button";
import { ChevronUp, ChevronDown } from "@/lib/icons";
import { SortDir } from "@/types/incidents";
import { TYPE_COLORS, SEVERITY_COLORS, FALLBACK_COLOR } from "@/utils/colors";
import { formatSecondsToMMSS } from "@/utils/format";
import { SORTABLE_COLUMNS } from "./constants";

interface IncidentRow {
  id: string;
  timestamp: string;
  type: string;
  severity: string;
  responseTime: number;
  callAnswerTime: number;
  aiSummary: string;
}

interface IncidentsTableProps {
  ref?: React.Ref<HTMLDivElement>;
  data: IncidentRow[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  sortBy: string;
  sortDir: SortDir;
  onSortChange: (column: string) => void;
}

const columns: ColumnDef<IncidentRow>[] = [
  { accessorKey: "timestamp", header: "Time" },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ getValue }) => {
      const type = getValue<string>();
      return (
        <span className="flex items-center gap-2">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: TYPE_COLORS[type] ?? FALLBACK_COLOR }}
          />
          {type}
        </span>
      );
    },
  },
  {
    accessorKey: "severity",
    header: "Severity",
    cell: ({ getValue }) => {
      const severity = getValue<string>();
      const color = SEVERITY_COLORS[severity] ?? FALLBACK_COLOR;
      return (
        <span
          className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
          style={{ backgroundColor: `${color}20`, color }}
        >
          {severity}
        </span>
      );
    },
  },
  {
    accessorKey: "responseTime",
    header: "Response",
    cell: ({ getValue }) => formatSecondsToMMSS(getValue<number>()),
  },
  {
    accessorKey: "callAnswerTime",
    header: "Answer",
    cell: ({ getValue }) => `${getValue<number>()}s`,
  },
  { accessorKey: "aiSummary", header: "Summary" },
];

export function IncidentsTable({ ref, data, page, totalPages, onPageChange, sortBy, sortDir, onSortChange }: IncidentsTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div ref={ref} className="rounded-md border overflow-x-auto">
      <Table className="min-w-[600px]">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : (() => {
                    const columnId = header.column.id;
                    const isSortable = SORTABLE_COLUMNS.has(columnId);
                    const content = flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    );
                    if (!isSortable) return content;
                    return (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1 -ml-2"
                        onClick={() => onSortChange(columnId)}
                      >
                        {content}
                        {sortBy === columnId &&
                          (sortDir === SortDir.asc ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />)
                        }
                      </Button>
                    );
                  })()}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="even:bg-muted/10 transition-colors duration-150">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext(),
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center"
              >
                No incidents found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between px-4 py-3 border-t text-sm text-muted-foreground">
        <span>
          Page {page} of {totalPages}
        </span>
        <Pagination className="w-auto mx-0">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(page - 1)}
                className={page <= 1 ? "pointer-events-none opacity-40" : "cursor-pointer"}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange(page + 1)}
                className={page >= totalPages ? "pointer-events-none opacity-40" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
