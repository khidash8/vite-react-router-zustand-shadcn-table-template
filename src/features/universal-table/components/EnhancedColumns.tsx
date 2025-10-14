import type { ColumnDef, AccessorKeyColumnDef } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
import { UniversalDataTableColumnHeader } from "./UniversalDataTableColumnHeader.tsx";
import { Button } from "../../../components/ui/button.tsx";
import { Checkbox } from "../../../components/ui/checkbox.tsx";

// Helper to check if a column has an accessorKey
function hasAccessorKey<T>(
  column: ColumnDef<T>,
): column is AccessorKeyColumnDef<T> {
  return !!(column as AccessorKeyColumnDef<T>).accessorKey;
}

// Helper to get header title
function getHeaderTitle<T>(column: ColumnDef<T>): string {
  if (typeof column.header === "string") return column.header;
  if (hasAccessorKey(column)) return String(column.accessorKey);
  return "Column";
}

// Enhanced columns with proper typing
export function createEnhancedColumns<T>(
  baseColumns: ColumnDef<T>[],
  enableSorting: boolean = true,
): ColumnDef<T>[] {
  return baseColumns.map((column) => {
    // Only enhance columns that have accessorKey and support sorting
    if (!enableSorting || !hasAccessorKey(column)) return column;

    return {
      ...column,
      header: ({ column: col }) => {
        return (
          <UniversalDataTableColumnHeader
            column={col}
            title={getHeaderTitle(column)}
          />
        );
      },
    } as ColumnDef<T>;
  });
}

// Actions column creator
export function createActionsColumn<T extends { id: string }>(
  onEdit: (item: T) => void,
  onDelete: (id: string) => void,
): ColumnDef<T> {
  return {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const item = row.original;

      return (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(item)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDelete(item.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  };
}

// Selection column creator
export function createSelectionColumn<T>(): ColumnDef<T> {
  return {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  };
}
