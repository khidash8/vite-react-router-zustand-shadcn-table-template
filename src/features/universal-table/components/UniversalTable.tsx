/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type SortingState,
  type ColumnFiltersState,
  type ColumnDef,
} from "@tanstack/react-table";
import { Input } from "../../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../../components/ui/dialog";
import { ChevronLeft, ChevronRight, Edit, Plus, Trash2 } from "lucide-react";
import { Checkbox } from "../../../components/ui/checkbox.tsx";
import { UniversalDataTablePagination } from "./UniversalDataTablePagination.tsx";
import { DataTableFilters } from "./DataTableFilters.tsx";
import { Button } from "../../../components/ui/button.tsx";
import type {
  BaseEntity,
  CrudState,
  TableConfig,
} from "../types/table-types.ts";
import { DataTableViewOptions } from "./DataTableViewOptions.tsx";
import { UniversalTableForm } from "./UniversalTableForm.tsx";

interface UniversalTableProps<T extends BaseEntity> {
  config: TableConfig<T>;
  crud: CrudState<T>;
  title?: string;
  enableSearch?: boolean;
  enablePagination?: boolean;
}

export function UniversalTable<T extends BaseEntity>({
  config,
  crud,
  title,
  enableSearch = true,
  enablePagination = true,
}: UniversalTableProps<T>) {
  const { data, addItem, updateItem, deleteItem } = crud;

  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Add actions column to columns
  const columnsWithActions: ColumnDef<T>[] = [
    ...(config.enableRowSelection
      ? [
          {
            id: "select",
            header: ({ table }: { table: any }) => (
              <Checkbox
                checked={
                  table.getIsAllPageRowsSelected() ||
                  (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) =>
                  table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
              />
            ),
            cell: ({ row }: { row: any }) => (
              <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
              />
            ),
          },
        ]
      : []),
    ...config.columns,
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const item = row.original;

        return (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditingItem(item);
                setIsFormOpen(true);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setItemToDelete(item.id);
                setIsDeleteDialogOpen(true);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns: columnsWithActions,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      globalFilter,
      rowSelection,
      columnFilters,
    },
  });

  const handleFormSubmit = (formData: any) => {
    if (editingItem) {
      updateItem(editingItem.id, formData);
    } else {
      addItem(formData);
    }
    setEditingItem(null);
  };

  const handleDelete = () => {
    if (itemToDelete) {
      deleteItem(itemToDelete);
      setItemToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{title || config.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Total: {data.length} items
            {config.enableRowSelection && (
              <span className="ml-2">
                • {table.getFilteredSelectedRowModel().rows.length} selected
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {config.enableColumnVisibility && (
            <DataTableViewOptions table={table} />
          )}
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add {config.name}
          </Button>
        </div>
      </div>

      <div className={"flex items-center justify-between"}>
        {/* Search */}
        {enableSearch && (
          <div className="flex items-center py-4">
            <Input
              placeholder={`Search ${config.name.toLowerCase()}...`}
              value={globalFilter ?? ""}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="max-w-sm"
            />
          </div>
        )}

        {/* Column Filters */}
        {config.filters && config.filters.length > 0 && (
          <DataTableFilters
            filters={config.filters}
            columnFilters={columnFilters}
            onColumnFiltersChange={setColumnFilters}
          />
        )}
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columnsWithActions.length}
                  className="h-24 text-center"
                >
                  No {config.name.toLowerCase()} found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {enablePagination &&
        (config.enableAdvancedPagination ? (
          <UniversalDataTablePagination table={table} />
        ) : (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

      {/* Forms and Dialogs */}
      <UniversalTableForm
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setEditingItem(null);
        }}
        onSubmit={handleFormSubmit}
        editingItem={editingItem}
        formFields={config.formFields || []}
        title={config.name}
      />

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {config.name}</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this {config.name.toLowerCase()}?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
