/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ColumnDef } from "@tanstack/react-table";

export interface BaseEntity {
  id: string;
  [key: string]: any;
}

export interface TableConfig<T extends BaseEntity> {
  name: string;
  columns: ColumnDef<T>[];
  defaultData?: T[];
  formFields?: FormField[];
  searchableFields?: string[];
  enableRowSelection?: boolean;
  enableColumnVisibility?: boolean;
  enableAdvancedPagination?: boolean;
  filters?: TableFilter[]; // New: Add filter configurations
}

export interface TableFilter {
  key: string;
  label: string;
  type: "select" | "date" | "text" | "number" | "boolean";
  options?: { label: string; value: string }[];
  placeholder?: string;
}

export interface FormField {
  name: string;
  label: string;
  type:
    | "text"
    | "number"
    | "email"
    | "date"
    | "select"
    | "textarea"
    | "checkbox";
  required?: boolean;
  options?: { label: string; value: string }[];
  placeholder?: string;
}

export interface CrudState<T extends BaseEntity> {
  data: T[];
  addItem: (item: Omit<T, "id">) => void;
  updateItem: (id: string, item: Partial<T>) => void;
  deleteItem: (id: string) => void;
  getItem: (id: string) => T | undefined;
}
