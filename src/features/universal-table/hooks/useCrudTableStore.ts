/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { BaseEntity, CrudState } from "../types/table-types.ts";

interface CreateStoreOptions {
  persist?: boolean;
  storageKey?: string;
}

export function createCrudTableStore<T extends BaseEntity>(
  initialData: T[] = [],
  options?: CreateStoreOptions,
) {
  const { persist: enablePersist = false, storageKey = "crud-store" } =
    options || {};

  const storeConfig = (set: any, get: any) => ({
    data: initialData,

    addItem: (itemData: Omit<T, "id">) => {
      const newItem: T = {
        ...itemData,
        id: crypto.randomUUID(),
      } as T;

      set((state: CrudState<T>) => ({
        data: [newItem, ...state.data],
      }));
    },

    updateItem: (id: string, updatedData: Partial<T>) => {
      set((state: CrudState<T>) => ({
        data: state.data.map((item) =>
          item.id === id ? { ...item, ...updatedData } : item,
        ),
      }));
    },

    deleteItem: (id: string) => {
      set((state: CrudState<T>) => ({
        data: state.data.filter((item) => item.id !== id),
      }));
    },

    getItem: (id: string) => {
      return get().data.find((item: T) => item.id === id);
    },
  });

  if (enablePersist) {
    return create<CrudState<T>>()(
      persist(storeConfig, {
        name: storageKey,
        storage: createJSONStorage(() => localStorage),
      }),
    );
  }

  return create<CrudState<T>>(storeConfig);
}
