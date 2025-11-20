import { type Table } from "@tanstack/react-table";

export function Pagination({ table }: { table: Table<any> }) {
  return (
    <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
      <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
        Prev
      </button>

      <span>
        Page {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
      </span>

      <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
        Next
      </button>
    </div>
  );
}
