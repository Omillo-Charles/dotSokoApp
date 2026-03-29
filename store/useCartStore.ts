import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: any;
  quantity: number;
  category?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (product: any) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
}

const safeStorage = {
  getItem: async (name: string) => {
    try {
      if (Platform.OS === 'web') return localStorage.getItem(name);
      return await AsyncStorage.getItem(name);
    } catch { return null; }
  },
  setItem: async (name: string, value: string) => {
    try {
      if (Platform.OS === 'web') { localStorage.setItem(name, value); return; }
      await AsyncStorage.setItem(name, value);
    } catch {}
  },
  removeItem: async (name: string) => {
    try {
      if (Platform.OS === 'web') { localStorage.removeItem(name); return; }
      await AsyncStorage.removeItem(name);
    } catch {}
  },
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const { items } = get();
        const existing = items.find((item) => item.id === product.id);
        if (existing) {
          set({ items: items.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) });
        } else {
          set({ items: [...items, { ...product, quantity: 1 }] });
        }
      },

      removeItem: (id) => set({ items: get().items.filter((item) => item.id !== id) }),

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) { get().removeItem(id); return; }
        set({ items: get().items.map((item) => item.id === id ? { ...item, quantity } : item) });
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),

      getSubtotal: () => get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => safeStorage),
    }
  )
);

/**
 * Call on sign-out: wipes in-memory state and removes the persisted key.
 * Call on sign-in: re-hydrates automatically from the same key (no-op needed).
 */
export const clearCartStore = async () => {
  useCartStore.setState({ items: [] });
  try {
    if (Platform.OS === 'web') localStorage.removeItem("cart-storage");
    else await AsyncStorage.removeItem("cart-storage");
  } catch {}
};
