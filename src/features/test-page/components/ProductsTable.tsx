import type { ColumnDef } from "@tanstack/react-table";
import { createCrudTableStore } from "../../universal-table/hooks/useCrudTableStore.ts";
import type { TableConfig } from "../../universal-table/types/table-types.ts";
import { createEnhancedColumns } from "../../universal-table/components/EnhancedColumns.tsx";
import { UniversalTable } from "../../universal-table/components/UniversalTable.tsx";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
  description: string;
  createdAt: string;
}

const productFormFields = [
  {
    name: "name",
    label: "Product Name",
    type: "text" as const,
    required: true,
    placeholder: "Enter product name",
  },
  {
    name: "price",
    label: "Price",
    type: "number" as const,
    required: true,
    placeholder: "0.00",
  },
  {
    name: "category",
    label: "Category",
    type: "select" as const,
    required: true,
    options: [
      { label: "Electronics", value: "electronics" },
      { label: "Clothing", value: "clothing" },
      { label: "Books", value: "books" },
    ],
  },
  {
    name: "inStock",
    label: "In Stock",
    type: "checkbox" as const,
  },
  {
    name: "description",
    label: "Description",
    type: "textarea" as const,
    placeholder: "Enter product description",
  },
];

const initialProducts: Product[] = [
  {
    id: "1",
    name: "MacBook Pro",
    price: 1999.99,
    category: "electronics",
    inStock: true,
    description: "16-inch MacBook Pro with M3 chip",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "T-Shirt",
    price: 29.99,
    category: "clothing",
    inStock: true,
    description: "Cotton crew neck t-shirt",
    createdAt: "2024-01-14",
  },
  {
    id: "3",
    name: "React Programming Guide",
    price: 49.99,
    category: "books",
    inStock: false,
    description: "Complete guide to React development",
    createdAt: "2024-01-13",
  },
  {
    id: "4",
    name: "Wireless Headphones",
    price: 199.99,
    category: "electronics",
    inStock: true,
    description: "Noise cancelling wireless headphones",
    createdAt: "2024-01-12",
  },
];

const useProductStore = createCrudTableStore<Product>(initialProducts);

const productBaseColumns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Name",
    enableSorting: false,
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => <>${row.original.price.toFixed(2)}</>,
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "inStock",
    header: "In Stock",
    cell: ({ row }) => <>{row.original.inStock ? "Yes" : "No"}</>,
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
];

const productConfig: TableConfig<Product> = {
  name: "Product",
  columns: createEnhancedColumns(productBaseColumns),
  formFields: productFormFields,
  enableRowSelection: true,
  enableColumnVisibility: true,
  enableAdvancedPagination: true,
};

export function EnhancedProductsTable() {
  const productCrud = useProductStore();

  return (
    <UniversalTable
      config={productConfig}
      crud={productCrud}
      title="Product Management"
      enableSearch={true}
      enablePagination={true}
    />
  );
}
