// src/components/table/TableWrapper.tsx

import React, { useState } from "react";
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable
} from "@tanstack/react-table";

import { useTableFilters } from "./hooks/useTableFilters";
import { useTableQuery } from "./hooks/useTableQuery";
import { useUrlState } from "./hooks/useUrlState";

import { TableRenderer } from "./TableRenderer";
import { Pagination } from "./Pagination";
import type { FiltersSchema, QueryResult, SortState } from "./types";

type TableWrapperProps<TData, TFilters extends object> = {
  columns: any[];
  initialFilters: TFilters;
  queryKey: string;
  queryFn: (
    filters: TFilters,
    ordering: string | null
  ) => Promise<QueryResult<TData>>;
};

export function TableWrapper<TData, TFilters extends object>({
  columns,
  initialFilters,
  queryKey,
  queryFn
}: TableWrapperProps<TData, TFilters>) {
  const { filters, update, setPartial } = useTableFilters(initialFilters);

  const [sort, setSort] = useState<SortState>({
    column: null,
    direction: null
  });

  // url-state
  useUrlState(filters, setPartial, sort, setSort);

  // серверный запрос
  const query = useTableQuery(queryKey, filters, sort, queryFn);

  // сортировка по клику
  function handleSort(colId: string) {
    setSort((prev) => {
      if (prev.column !== colId) return { column: colId, direction: "asc" };
      if (prev.direction === "asc") return { column: colId, direction: "desc" };
      return { column: null, direction: null };
    });
  }

  // отрисовка фильтра внутри header
  function renderFilter(column: any) {
    const conf = column.columnDef.meta?.filter;
    if (!conf) return null;

    const key = column.id;
    const value = (filters as any)[key];

    switch (conf.type) {
      case "text":
        return (
          <input
            style={{ width: "100%", marginTop: 4 }}
            value={value ?? ""}
            onChange={(e) => update(key as keyof TFilters, e.target.value as any)}
          />
        );

      case "select":
        return (
          <select
            style={{ width: "100%", marginTop: 4 }}
            value={value ?? ""}
            onChange={(e) => update(key as keyof TFilters, e.target.value as any)}
          >
            <option value="">—</option>
            {conf.options.map((o: any) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        );

      case "multiselect":
        return (
          <select
            multiple
            style={{ width: "100%", marginTop: 4 }}
            value={value || []}
            onChange={(e) =>
              update(
                key as keyof TFilters,
                Array.from(e.target.selectedOptions, (o) => o.value) as any
              )
            }
          >
            {conf.options.map((o: any) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        );

      case "custom":
        const C = conf.component;
        return (
          <C
            value={value}
            onChange={(v: any) => update(key as keyof TFilters, v)}
          />
        );

      default:
        return null;
    }
  }

  const table = useReactTable({
    data: query.data?.rows ?? [],
    columns,
    pageCount: Math.ceil((query.data?.total ?? 0) / 20),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <TableRenderer
        table={table}
        renderFilter={renderFilter}
        sort={sort}
        onSort={handleSort}
      />

      <Pagination table={table} />
    </div>
  );
}
