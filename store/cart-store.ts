import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  productVariantId: string;
  name: string;
  flavor: string;
  size?: string;
  price: number; // in rupees (INR)
  quantity: number;
  image?: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  email: string | null;
  name: string | null;
  abandonedAt: number | null;
  orderId: string | null;
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  setEmail: (email: string | null, name?: string | null) => void;
  markAbandoned: () => void;
  setOrderId: (orderId: string) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      email: null,
      name: null,
      abandonedAt: null,
      orderId: null,
      addItem: (item) => {
        set((state) => {
          const existing = state.items.find((i) => i.productVariantId === item.productVariantId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === existing.id
                  ? { ...i, quantity: Math.min(i.quantity + item.quantity, 10) }
                  : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              { ...item, id: crypto.randomUUID() },
            ],
          };
        });
        // Fire background abandon tracking
        const state = get();
        if (state.email && state.items.length > 0) {
          fetch("/api/cart/abandon", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: state.email, name: state.name, items: state.items }),
          }).catch(() => {});
        }
        // Reset abandonment timer on activity
        get().markAbandoned();
      },
      removeItem: (id) => {
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
        // Fire background abandon tracking
        const state = get();
        if (state.email && state.items.length > 0) {
          fetch("/api/cart/abandon", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: state.email, name: state.name, items: state.items }),
          }).catch(() => {});
        }
      },
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items:
            quantity === 0
              ? state.items.filter((i) => i.id !== id)
              : state.items.map((i) =>
                  i.id === id ? { ...i, quantity: Math.min(quantity, 10) } : i
                ),
        })),
      clearCart: () => set({ items: [], email: null, name: null, abandonedAt: null, orderId: null }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      setEmail: (email, name) => {
        set((state) => ({
          email,
          ...(name !== undefined ? { name } : {}),
        }));
        // Fire background abandon tracking
        const state = get();
        if (email && state.items.length > 0) {
          fetch("/api/cart/abandon", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, name: name ?? state.name, items: state.items }),
          }).catch(() => {});
        }
      },
      markAbandoned: () => set({ abandonedAt: Date.now() }),
      setOrderId: (orderId) => set({ orderId }),
    }),
    {
      name: "wellnz-cart",
      partialize: (state) => ({
        items: state.items,
        email: state.email,
        name: state.name,
        abandonedAt: state.abandonedAt,
        orderId: state.orderId,
      }),
    }
  )
);
