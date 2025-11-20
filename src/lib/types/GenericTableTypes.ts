// src/components/table/types.ts

export type OrderDirection = "asc" | "desc" | null;

export type SortState = {
  column: string | null;
  direction: OrderDirection;
};

export type FilterType =
  | { type: "text" }
  | { type: "select"; options: Array<{ label: string; value: string }> }
  | { type: "multiselect"; options: Array<{ label: string; value: string }> }
  | { type: "custom"; component: React.ComponentType<any> };

export type FiltersSchema<TFilters extends object> = {
  [K in keyof TFilters]: FilterType;
};

export type QueryResult<TData> = {
  rows: TData[];
  total: number;
};
