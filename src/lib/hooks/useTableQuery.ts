// src/components/table/hooks/useTableQuery.ts

import { useQuery } from "@tanstack/react-query";
import type { SortState, QueryResult } from "../types/GenericTableTypes";

export function useTableQuery<TData, TFilters extends object>(
  key: string,
  filters: TFilters,
  sort: SortState,
  queryFn: (filters: TFilters, ordering: string | null) => Promise<QueryResult<TData>>
) {

  const ordering = sort.column
    ? (sort.direction === "asc" ? sort.column : `-${sort.column}`)
    : null;

  return useQuery({
    queryKey: [key, filters, ordering],
    queryFn: () => queryFn(filters, ordering),
    placeholderData: (prev) => prev
  });
}
