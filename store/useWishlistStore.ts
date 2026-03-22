import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: any;
  category?: string;
}

interface WishlistState {
  items: WishlistItem[];
  toggleWishlist: (product: WishlistItem) => void;
  removeItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  getTotalItems: () => number;
}

// Custom storage to handle potential Native module missing error in web environments
const safeStorage = {
  getItem: async (name: string) => {
    try {
      if (Platform.OS === 'web') {
        return localStorage.getItem(name);
      }
      return await AsyncStorage.getItem(name);
    } catch (e) {
      return null;
    }
  },
  setItem: async (name: string, value: string) => {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem(name, value);
        return;
      }
      await AsyncStorage.setItem(name, value);
    } catch (e) {
      // Fallback silently
    }
  },
  removeItem: async (name: string) => {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem(name);
        return;
      }
      await AsyncStorage.removeItem(name);
    } catch (e) {
      // Fallback silently
    }
  },
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      
      toggleWishlist: (product) => {
        const { items } = get();
        const exists = items.find((item) => item.id === product.id);
        
        if (exists) {
          set({ items: items.filter((item) => item.id !== product.id) });
        } else {
          set({ items: [...items, product] });
        }
      },
      
      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },
      
      isInWishlist: (id) => {
        return get().items.some((item) => item.id === id);
      },
      
      getTotalItems: () => {
        return get().items.length;
      },
    }),
    {
      name: "wishlist-storage",
      storage: createJSONStorage(() => safeStorage),
    }
  )
);
