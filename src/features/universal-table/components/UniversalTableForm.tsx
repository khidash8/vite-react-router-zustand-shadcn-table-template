/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../components/ui/dialog";
import { Textarea } from "../../../components/ui/textarea";
import type { BaseEntity, FormField } from "../types/table-types.ts";

interface UniversalFormProps<T extends BaseEntity> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<T, "id">) => void;
  editingItem?: T | null;
  formFields: FormField[];
  title: string;
}

export function UniversalTableForm<T extends BaseEntity>({
  open,
  onOpenChange,
  onSubmit,
  editingItem,
  formFields,
  title,
}: UniversalFormProps<T>) {
  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    if (editingItem) {
      setFormData(editingItem);
    } else {
      // Initialize with empty values
      const initialData: Record<string, any> = {};
      formFields.forEach((field) => {
        initialData[field.name] = field.type === "checkbox" ? false : "";
      });
      setFormData(initialData);
    }
  }, [editingItem, open, formFields]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as Omit<T, "id">);
    onOpenChange(false);
  };

  const renderField = (field: FormField) => {
    const commonProps = {
      id: field.name,
      value: formData[field.name] || "",
      onChange: (value: any) =>
        setFormData((prev) => ({ ...prev, [field.name]: value })),
      placeholder: field.placeholder,
      required: field.required,
    };

    switch (field.type) {
      case "select": {
        const options = field.options ?? []; // default to an empty array
        const hasOptions = options.length > 0;
        const defaultValue = hasOptions ? options[0].value : "";

        return (
          <Select
            value={formData[field.name] || defaultValue}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, [field.name]: value }))
            }
          >
            <SelectTrigger>
              <SelectValue
                placeholder={!hasOptions ? field.placeholder : undefined}
              />
            </SelectTrigger>
            <SelectContent>
              {hasOptions ? (
                options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))
              ) : (
                <div className="p-2 text-sm text-gray-500">
                  No options available
                </div>
              )}
            </SelectContent>
          </Select>
        );
      }

      case "textarea":
        return (
          <Textarea
            {...commonProps}
            onChange={(e) => commonProps.onChange(e.target.value)}
          />
        );

      case "checkbox":
        return (
          <Input
            type="checkbox"
            checked={formData[field.name] || false}
            onChange={(e) => commonProps.onChange(e.target.checked)}
            className="w-4 h-4"
          />
        );

      case "date":
        return (
          <Input
            type="date"
            {...commonProps}
            onChange={(e) => commonProps.onChange(e.target.value)}
          />
        );

      case "number":
        return (
          <Input
            type="number"
            {...commonProps}
            onChange={(e) => {
              const value = e.target.value === "" ? "" : Number(e.target.value);
              commonProps.onChange(value);
            }}
          />
        );

      default:
        return (
          <Input
            type={field.type}
            {...commonProps}
            onChange={(e) => commonProps.onChange(e.target.value)}
          />
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingItem ? `Edit ${title}` : `Add New ${title}`}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formFields.map((field) => (
              <div
                key={field.name}
                className={field.type === "textarea" ? "col-span-2" : ""}
              >
                <Label htmlFor={field.name} className={"mb-2"}>
                  {field.label}
                  {field.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </Label>
                {renderField(field)}
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingItem ? "Update" : "Create"} {title}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
