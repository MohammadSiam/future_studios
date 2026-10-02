import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, CartProduct } from "@/types/cart";

interface CartState {
  items: CartItem[];
  addItem: (product: CartProduct, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const clamp = (quantity: number, stock: number) =>
  Math.min(Math.max(quantity, 1), stock);

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: ({ id, slug, title, price, stock, thumbnail }, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((item) => item.id === id);

          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === id
                  ? {
                      ...item,
                      quantity: clamp(item.quantity + quantity, stock),
                    }
                  : item,
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                id,
                slug,
                title,
                price,
                stock,
                thumbnail,
                quantity: clamp(quantity, stock),
              },
            ],
          };
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, quantity: clamp(quantity, item.stock) }
              : item,
          ),
        })),
      clearCart: () => set({ items: [] }),
    }),
    { name: "cart", version: 1 },
  ),
);

const subscribeToHydration = (onChange: () => void) =>
  useCartStore.persist.onFinishHydration(onChange);
const getHydrated = () => useCartStore.persist.hasHydrated();
const getServerHydrated = () => false;

export function useCartHydrated() {
  return useSyncExternalStore(
    subscribeToHydration,
    getHydrated,
    getServerHydrated,
  );
}
