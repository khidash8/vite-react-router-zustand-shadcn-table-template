/* eslint-disable @typescript-eslint/no-unused-vars */
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";
import { X } from "lucide-react";
import type { ColumnFiltersState } from "@tanstack/react-table";
import type { TableFilter } from "../types/table-types.ts";

interface DataTableFiltersProps<_TData> {
  filters?: TableFilter[];
  columnFilters: ColumnFiltersState;
  onColumnFiltersChange: (filters: ColumnFiltersState) => void;
}

export function DataTableFilters<TData>({
  filters = [],
  columnFilters,
  onColumnFiltersChange,
}: DataTableFiltersProps<TData>) {
  const updateFilter = (key: string, value: string) => {
    const existingFilterIndex = columnFilters.findIndex(
      (filter) => filter.id === key,
    );

    if (value === "") {
      // Remove filter if value is empty
      const newFilters = columnFilters.filter((filter) => filter.id !== key);
      onColumnFiltersChange(newFilters);
    } else if (existingFilterIndex >= 0) {
      // Update existing filter
      const newFilters = [...columnFilters];
      newFilters[existingFilterIndex] = { id: key, value };
      onColumnFiltersChange(newFilters);
    } else {
      // Add new filter
      onColumnFiltersChange([...columnFilters, { id: key, value }]);
    }
  };

  const clearFilter = (key: string) => {
    const newFilters = columnFilters.filter((filter) => filter.id !== key);
    onColumnFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    onColumnFiltersChange([]);
  };

  const getFilterValue = (key: string): string => {
    const filter = columnFilters.find((f) => f.id === key);
    return (filter?.value as string) || "";
  };

  const renderFilter = (filter: TableFilter) => {
    const value = getFilterValue(filter.key);

    switch (filter.type) {
      case "select":
        return (
          <div key={filter.key} className="flex items-center gap-2">
            <Select
              value={value}
              onValueChange={(val) => updateFilter(filter.key, val)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue
                  placeholder={filter.placeholder || `Select ${filter.label}`}
                />
              </SelectTrigger>
              <SelectContent>
                {filter.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {value && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => clearFilter(filter.key)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        );

      case "text":
        return (
          <div key={filter.key} className="flex items-center gap-2">
            <Input
              placeholder={filter.placeholder || `Search ${filter.label}`}
              value={value}
              onChange={(e) => updateFilter(filter.key, e.target.value)}
              className="w-[180px]"
            />
            {value && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => clearFilter(filter.key)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        );

      case "date":
        return (
          <div key={filter.key} className="flex items-center gap-2">
            <Input
              type="date"
              value={value}
              onChange={(e) => updateFilter(filter.key, e.target.value)}
              className="w-[180px]"
            />
            {value && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => clearFilter(filter.key)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        );

      case "boolean":
        return (
          <div key={filter.key} className="flex items-center gap-2">
            <Select
              value={value}
              onValueChange={(val) => updateFilter(filter.key, val)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue
                  placeholder={filter.placeholder || `Select ${filter.label}`}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
            {value && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => clearFilter(filter.key)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (filters.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Label className="text-sm font-medium">Filters:</Label>
        {filters.map(renderFilter)}
        {columnFilters.length > 0 && (
          <Button variant="outline" size="sm" onClick={clearAllFilters}>
            Clear All
          </Button>
        )}
      </div>
    </div>
  );
}
