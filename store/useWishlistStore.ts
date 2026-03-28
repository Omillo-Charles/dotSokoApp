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
  _hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  toggleWishlist: (product: WishlistItem) => void;
  removeItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  getTotalItems: () => number;
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

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      _hasHydrated: false,

      setHasHydrated: (v) => set({ _hasHydrated: v }),

      toggleWishlist: (product) => {
        const { items } = get();
        const exists = items.find((item) => item.id === product.id);
        set({ items: exists
          ? items.filter((item) => item.id !== product.id)
          : [...items, product]
        });
      },

      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },

      isInWishlist: (id) => {
        return get().items.some((item) => item.id === id);
      },

      getTotalItems: () => get().items.length,
    }),
    {
      name: "wishlist-storage",
      storage: createJSONStorage(() => safeStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
