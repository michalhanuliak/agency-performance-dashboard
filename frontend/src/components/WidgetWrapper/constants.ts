import type { ColSpan } from "@/types/dashboard";
export type { ColSpan };

export const SIZE_OPTIONS: { label: string; colSpan: ColSpan }[] = [
  { label: "1×1", colSpan: 1 },
  { label: "2×1", colSpan: 2 },
  { label: "Full", colSpan: 4 },
];

export const colSpanClass: Record<ColSpan, string> = {
  1: "col-span-1",
  2: "col-span-1 sm:col-span-2",
  4: "col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4",
};
