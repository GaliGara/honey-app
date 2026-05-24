import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "@/types/product";

interface CartStore {
  items: CartItem[];
  isOpen: boolean;

  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  clearCart: () => void;

  getTotalItems: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      addItem: (product: Product) => {
        set((s) => {
          const existing = s.items.find((i) => i.productId === product.id);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.productId === product.id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i,
              ),
            };
          }
          const newItem: CartItem = {
            productId: product.id,
            slug: product.slug,
            name: product.name,
            category: product.category,
            price: product.price,
            size: product.size,
            quantity: 1,
            visual: product.visual,
            colorScheme: product.colorScheme,
          };
          return { items: [...s.items, newItem] };
        });
      },

      removeItem: (productId: string) => {
        set((s) => ({
          items: s.items.filter((i) => i.productId !== productId),
        }));
      },

      increaseQuantity: (productId: string) => {
        set((s) => ({
          items: s.items.map((i) =>
            i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i,
          ),
        }));
      },

      decreaseQuantity: (productId: string) => {
        set((s) => {
          const item = s.items.find((i) => i.productId === productId);
          if (!item) return s;
          if (item.quantity <= 1) {
            return { items: s.items.filter((i) => i.productId !== productId) };
          }
          return {
            items: s.items.map((i) =>
              i.productId === productId
                ? { ...i, quantity: i.quantity - 1 }
                : i,
            ),
          };
        });
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),

      getSubtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: "honey-cart",
      // Solo persistir items, no el estado isOpen del drawer
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
