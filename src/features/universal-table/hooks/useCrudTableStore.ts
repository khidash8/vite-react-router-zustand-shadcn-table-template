import { create } from "zustand";
import type { BaseEntity, CrudState } from "../types/table-types.ts";

export function createCrudTableStore<T extends BaseEntity>(
  initialData: T[] = [],
) {
  return create<CrudState<T>>((set, get) => ({
    data: initialData,

    addItem: (itemData: Omit<T, "id">) => {
      const newItem: T = {
        ...itemData,
        id: crypto.randomUUID(),
      } as T;

      set((state) => ({
        data: [newItem, ...state.data],
      }));
    },

    updateItem: (id: string, updatedData: Partial<T>) => {
      set((state) => ({
        data: state.data.map((item) =>
          item.id === id ? { ...item, ...updatedData } : item,
        ),
      }));
    },

    deleteItem: (id: string) => {
      set((state) => ({
        data: state.data.filter((item) => item.id !== id),
      }));
    },

    getItem: (id: string) => {
      return get().data.find((item) => item.id === id);
    },
  }));
}
