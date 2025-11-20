// src/components/table/TableRenderer.tsx

import React from "react";
import { flexRender, Table } from "@tanstack/react-table";

export function TableRenderer<T>({
  table,
  renderFilter,
  sort,
  onSort
}: {
  table: Table<T>;
  renderFilter: (column: any) => React.ReactNode;
  sort: { column: string | null; direction: "asc" | "desc" | null };
  onSort: (columnId: string) => void;
}) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        {table.getHeaderGroups().map((hg) => (
          <tr key={hg.id}>
            {hg.headers.map((header) => {
              const col = header.column;
              const colId = col.id;
              const isSorted = sort.column === colId;

              return (
                <th
                  key={header.id}
                  style={{
                    borderBottom: "1px solid #ddd",
                    padding: 4,
                    verticalAlign: "top"
                  }}
                >
                  {/* Заголовок колонки */}
                  <div
                    style={{ cursor: "pointer", userSelect: "none" }}
                    onClick={() => onSort(colId)}
                  >
                    {flexRender(col.columnDef.header, header.getContext())}
                    {isSorted ? (sort.direction === "asc" ? " ▲" : " ▼") : ""}
                  </div>

                  {/* Фильтр под заголовком */}
                  {renderFilter(col)}
                </th>
              );
            })}
          </tr>
        ))}
      </thead>

      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} style={{ padding: 4 }}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
