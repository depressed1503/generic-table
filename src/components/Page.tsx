// src/pages/UsersTablePage.tsx

import { type ColumnDef } from "@tanstack/react-table";
import type { QueryResult, FiltersSchema } from "../lib/types/GenericTableTypes";
import { TableWrapper } from "./GenericTable/TableWrapper";

type User = {
  id: number;
  name: string;
  status: string;
  age: number;
};

// ----- MOCK DB -----
const FAKE_DB: User[] = Array.from({ length: 50 }).map((_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  status: i % 3 ? "active" : "disabled",
  age: 18 + (i % 30),
}));

// ----- FAKE API -----
async function fakeFetchUsers(
  filters: UserFilters,
  ordering: string | null
): Promise<QueryResult<User>> {

  await new Promise(r => setTimeout(r, 300));

  let data = [...FAKE_DB];

  if (filters.search)
    data = data.filter(u =>
      u.name.toLowerCase().includes(filters.search.toLowerCase())
    );

  if (filters.status)
    data = data.filter(u => u.status === filters.status);

  // sort
  if (ordering) {
    const field = ordering.startsWith("-") ? ordering.slice(1) : ordering;
    const dir = ordering.startsWith("-") ? -1 : 1;

    data.sort((a: any, b: any) => {
      if (a[field] < b[field]) return -1 * dir;
      if (a[field] > b[field]) return 1 * dir;
      return 0;
    });
  }

  return {
    rows: data,
    total: data.length,
  };
}

// ----- FILTERS -----
type UserFilters = {
  search: string;
  status: string;
};

const filtersSchema: FiltersSchema<UserFilters> = {
  search: { type: "text" },
  status: {
    type: "select",
    options: [
      { label: "Active", value: "active" },
      { label: "Disabled", value: "disabled" },
    ],
  },
};

// ----- COLUMNS with custom CELL -----
const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: (info) => <b>{info.getValue()}</b>,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: (info) => <span style={{ color: "blue" }}>{info.getValue()}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "age",
    header: "Age",
  },
];

// ----- PAGE -----
export default function UsersTablePage() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Users Table (Fake API + URL state + Sorting)</h2>

      <TableWrapper<User, UserFilters>
        columns={columns}
        filtersSchema={filtersSchema}
        initialFilters={{ search: "", status: "" }}
        queryKey="users"
        queryFn={fakeFetchUsers}
      />
    </div>
  );
}
