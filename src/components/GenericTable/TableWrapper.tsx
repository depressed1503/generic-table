// src/components/table/TableWrapper.tsx

import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";


import { TableRenderer } from "./TableRenderer";
import { Pagination } from "./Pagination";
import { useTableFilters } from "../../lib/hooks/useTableFilters";
import { useTableQuery } from "../../lib/hooks/useTableQuery";
import { useUrlState } from "../../lib/hooks/useUrlState";
import type { FiltersSchema, QueryResult, SortState } from "../../lib/types/GenericTableTypes";
import { FiltersPanel } from "../FilterPanel/FilterPanel";


type TableWrapperProps<TData, TFilters extends object> = {
  columns: any[];
  filtersSchema: FiltersSchema<TFilters>;
  initialFilters: TFilters;
  queryKey: string;
  queryFn: (filters: TFilters, ordering: string | null) => Promise<QueryResult<TData>>;
};

export function TableWrapper<TData, TFilters extends object>({
  columns,
  filtersSchema,
  initialFilters,
  queryKey,
  queryFn,
}: TableWrapperProps<TData, TFilters>) {

  const { filters, update, setPartial } = useTableFilters(initialFilters);

  const [sort, setSort] = useState<SortState>({
    column: null,
    direction: null,
  });

  // restore/save to URL
  useUrlState(filters, setPartial, sort, setSort);

  // load data
  const query = useTableQuery(queryKey, filters, sort, queryFn);

  // sorting logic
  function handleSort(column: string) {
    setSort(prev => {
      if (prev.column !== column) return { column, direction: "asc" };
      if (prev.direction === "asc") return { column, direction: "desc" };
      return { column: null, direction: null };
    });
  }

  const table = useReactTable({
    data: query.data?.rows ?? [],
    columns,
    pageCount: Math.ceil((query.data?.total ?? 0) / 20),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <FiltersPanel filters={filters} schema={filtersSchema} update={update} />

      <TableRenderer
        table={table}
        onSort={handleSort}
        sort={sort}
      />

      <Pagination table={table} />
    </div>
  );
}
