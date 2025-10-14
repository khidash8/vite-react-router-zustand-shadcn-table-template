import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../../../components/ui/badge.tsx";
import { createCrudTableStore } from "../../universal-table/hooks/useCrudTableStore.ts";
import type { TableConfig } from "../../universal-table/types/table-types.ts";
import { createEnhancedColumns } from "../../universal-table/components/EnhancedColumns.tsx";
import { UniversalTable } from "../../universal-table/components/UniversalTable.tsx";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "user" | "moderator";
  joinDate: string;
  active: boolean;
}

const userBaseColumns: ColumnDef<User>[] = [
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      const variant =
        role === "admin"
          ? "destructive"
          : role === "moderator"
            ? "default"
            : "secondary";
      return (
        <Badge variant={variant} className="capitalize">
          {role}
        </Badge>
      );
    },
  },
  {
    accessorKey: "joinDate",
    header: "Join Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("joinDate"));
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: "active",
    header: "Status",
    cell: ({ row }) => {
      const active = row.getValue("active");
      return (
        <Badge variant={active ? "default" : "secondary"}>
          {active ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
];

const userFormFields = [
  {
    name: "firstName",
    label: "First Name",
    type: "text" as const,
    required: true,
  },
  {
    name: "lastName",
    label: "Last Name",
    type: "text" as const,
    required: true,
  },
  {
    name: "email",
    label: "Email",
    type: "email" as const,
    required: true,
  },
  {
    name: "role",
    label: "Role",
    type: "select" as const,
    options: [
      { label: "Admin", value: "admin" },
      { label: "User", value: "user" },
      { label: "Moderator", value: "moderator" },
    ],
  },
  {
    name: "joinDate",
    label: "Join Date",
    type: "date" as const,
  },
  {
    name: "active",
    label: "Active",
    type: "checkbox" as const,
  },
];

const initialUsers: User[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    role: "admin",
    joinDate: "2024-01-15",
    active: true,
  },
];

const useUserStore = createCrudTableStore<User>(initialUsers);

const userConfig: TableConfig<User> = {
  name: "User",
  columns: createEnhancedColumns(userBaseColumns),
  formFields: userFormFields,
  enableRowSelection: true,
  enableColumnVisibility: true,
  enableAdvancedPagination: true,
};

export function EnhancedUsersTable() {
  const userCrud = useUserStore();

  return (
    <UniversalTable
      config={userConfig}
      crud={userCrud}
      title="User Management"
    />
  );
}
