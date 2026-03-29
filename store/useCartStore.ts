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
        try {
          if (!product || !product.id) {
            console.error("Invalid product for cart");
            return;
          }
          const { items } = get();
          const safeProduct: CartItem = { 
            id: String(product.id),
            name: String(product.name || ""),
            price: Number(product.price) || 0,
            image: product.image || null,
            quantity: Number(product.quantity) || 1,
            category: String(product.category || "")
          };
          const existing = items.find((item) => item.id === safeProduct.id);
          if (existing) {
            set({ items: items.map((item) => item.id === safeProduct.id ? { ...item, quantity: item.quantity + 1 } : item) });
          } else {
            set({ items: [...items, safeProduct] });
          }
        } catch (error) {
          console.error("Error adding item to cart:", error);
        }
      },

      removeItem: (id) => {
        try {
          set({ items: get().items.filter((item) => item.id !== id) });
        } catch (error) {
          console.error("Error removing item from cart:", error);
        }
      },

      updateQuantity: (id, quantity) => {
        try {
          if (quantity <= 0) { get().removeItem(id); return; }
          set({ items: get().items.map((item) => item.id === id ? { ...item, quantity } : item) });
        } catch (error) {
          console.error("Error updating quantity:", error);
        }
      },

      clearCart: () => {
        try {
          set({ items: [] });
        } catch (error) {
          console.error("Error clearing cart:", error);
        }
      },

      getTotalItems: () => {
        try {
          return get().items.reduce((acc, item) => acc + item.quantity, 0);
        } catch (error) {
          console.error("Error getting total items:", error);
          return 0;
        }
      },

      getSubtotal: () => {
        try {
          return get().items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        } catch (error) {
          console.error("Error getting subtotal:", error);
          return 0;
        }
      },
    }),
    {
      name: "cart-storage",
      version: 2, // Increment version to force reset
      storage: createJSONStorage(() => safeStorage),
      migrate: (persistedState: any, version: number) => {
        // Force reset for version 2
        return { items: [] };
      },
    }
  )
);

/**
 * Call on sign-out: wipes in-memory state and removes the persisted key.
 * Call on sign-in: re-hydrates automatically from the same key (no-op needed).
 */
export const clearCartStore = async () => {
  try {
    useCartStore.setState({ items: [] });
    if (Platform.OS === 'web') localStorage.removeItem("cart-storage");
    else await AsyncStorage.removeItem("cart-storage");
  } catch (error) {
    console.error("Error clearing cart store:", error);
  }
};

/**
 * Force reset cart storage if corrupted
 */
export const resetCartStorage = async () => {
  try {
    await clearCartStore();
    useCartStore.setState({ items: [] });
  } catch (error) {
    console.error("Error resetting cart storage:", error);
  }
};
