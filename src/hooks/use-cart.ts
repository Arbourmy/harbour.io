import { Product } from "@/payload-types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CartItem = {
  product: Product;
  id: number;
};

type CartState = {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product) =>
        set((state) => {
          const id = Math.floor(Math.random() * 1000000);
          const isDuplicate = state.items.some((item) => item.id === id);
          if (isDuplicate) {
            return { items: [...state.items, { product, id: generateUniqueId(state.items) }] };
          }
          return { items: [...state.items, { product, id }] };
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Helper function to generate a unique ID
function generateUniqueId(items: CartItem[]): number {
  const id = Math.floor(Math.random() * 1000000);
  const isDuplicate = items.some((item) => item.id === id);
  if (isDuplicate) {
    return generateUniqueId(items);
  }
  return id;
}
