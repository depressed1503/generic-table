// src/components/table/hooks/useUrlState.ts

import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import type { SortState } from "../types/GenericTableTypes";

export function useUrlState<TFilters extends object>(
  filters: TFilters,
  setFilters: (f: Partial<TFilters>) => void,
  sort: SortState,
  setSort: (s: SortState) => void
) {
  const [params, setParams] = useSearchParams();

  // ---- load from URL on mount ----
  useEffect(() => {
    const restored: Partial<TFilters> = {};

    Object.keys(filters).forEach((key) => {
      const v = params.get(key);
      if (v !== null) restored[key as keyof TFilters] = v as any;
    });

    const ordering = params.get("ordering");
    if (ordering) {
      if (ordering.startsWith("-")) {
        setSort({ column: ordering.slice(1), direction: "desc" });
      } else {
        setSort({ column: ordering, direction: "asc" });
      }
    }

    setFilters(restored);
  }, []);

  // ---- update URL on filters or sort change ----
  useEffect(() => {
    const p = new URLSearchParams();

    Object.entries(filters).forEach(([k, v]) => {
      if (v === "" || v === null) return;
      p.set(k, Array.isArray(v) ? v.join(",") : String(v));
    });

    if (sort.column && sort.direction) {
      p.set("ordering", sort.direction === "asc" ? sort.column : `-${sort.column}`);
    }

    setParams(p);

  }, [filters, sort]);
}
