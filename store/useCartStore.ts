import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import api from "../lib/api";

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

      addItem: async (product) => {
        try {
          if (!product || !product.id) return;
          const { items } = get();
          const safeProduct: CartItem = { 
            id: String(product.id),
            name: String(product.name || ""),
            price: Number(product.price) || 0,
            image: product.image || null,
            quantity: Number(product.quantity) || 1,
            category: product.category !== undefined ? String(product.category) : ""
          };
          const existing = items.find((item) => item.id === safeProduct.id);
          
          if (existing) {
            set({ items: items.map((item) => item.id === safeProduct.id ? { ...item, quantity: item.quantity + 1 } : item) });
          } else {
            set({ items: [...items, safeProduct] });
          }

          // Sync with API
          const token = await safeStorage.getItem("accessToken");
          if (token) {
             await api.post('/carts/add', { productId: safeProduct.id, quantity: 1 });
          }
        } catch (error) {
          console.error("Error adding item to cart:", error);
        }
      },

      removeItem: async (id) => {
        try {
          set({ items: get().items.filter((item) => item.id !== id) });
          
          // Sync with API
          const token = await safeStorage.getItem("accessToken");
          if (token) {
             await api.delete(`/carts/item/${id}`);
          }
        } catch (error) {
          console.error("Error removing item from cart:", error);
        }
      },

      updateQuantity: async (id, quantity) => {
        try {
          if (quantity <= 0) { 
            get().removeItem(id); 
            return; 
          }
          set({ items: get().items.map((item) => item.id === id ? { ...item, quantity } : item) });
          
          // Sync with API
          const token = await safeStorage.getItem("accessToken");
          if (token) {
             await api.put(`/carts/item/${id}`, { quantity });
          }
        } catch (error) {
          console.error("Error updating quantity:", error);
        }
      },

      clearCart: async () => {
        try {
          set({ items: [] });
          
          // Sync with API
          const token = await safeStorage.getItem("accessToken");
          if (token) {
             await api.delete('/carts/clear');
          }
        } catch (error) {
          console.error("Error clearing cart:", error);
        }
      },

      getTotalItems: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      },
    }),
    {
      name: "cart-storage",
      version: 2,
      storage: createJSONStorage(() => safeStorage),
      migrate: (persistedState: any) => {
        if (persistedState && persistedState.items && Array.isArray(persistedState.items)) {
          persistedState.items = persistedState.items
            .filter((item: any) => item && typeof item === 'object' && item.id)
            .map((item: any) => ({
              ...item,
              category: item.category !== undefined ? String(item.category) : ""
            }));
        }
        return persistedState || { items: [] };
      },
    }
  )
);

export const clearCartStore = async () => {
  try {
    useCartStore.setState({ items: [] });
    if (Platform.OS === 'web') localStorage.removeItem("cart-storage");
    else await AsyncStorage.removeItem("cart-storage");
  } catch (error) {
    console.error("Error clearing cart store:", error);
  }
};

export const resetCartStorage = async () => {
  try {
    await clearCartStore();
    useCartStore.setState({ items: [] });
  } catch (error) {
    console.error("Error resetting cart storage:", error);
  }
};
