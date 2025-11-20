// src/components/table/TableRenderer.tsx
import { flexRender,  type Table } from "@tanstack/react-table";

export function TableRenderer({
  table,
  onSort,
  sort,
}: {
  table: Table<any>;
  onSort: (column: string) => void;
  sort: { column: string | null; direction: "asc" | "desc" | null };
}) {

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        {table.getHeaderGroups().map(hg => (
          <tr key={hg.id}>
            {hg.headers.map(header => {
              const colId = header.column.id;
              const isSorted = sort.column === colId;

              return (
                <th
                  key={header.id}
                  onClick={() => onSort(colId)}
                  style={{
                    padding: 6,
                    cursor: "pointer",
                    borderBottom: "1px solid #ccc"
                  }}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {isSorted ? (sort.direction === "asc" ? " ▲" : " ▼") : ""}
                </th>
              );
            })}
          </tr>
        ))}
      </thead>

      <tbody>
        {table.getRowModel().rows.map(row => (
          <tr key={row.id}>
            {row.getVisibleCells().map(cell => (
              <td key={cell.id} style={{ padding: 6 }}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
