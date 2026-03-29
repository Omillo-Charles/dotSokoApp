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
        try {
          if (!product || !product.id) {
            console.error("Invalid product for wishlist");
            return;
          }
          const { items } = get();
          const safeProduct: WishlistItem = { 
            id: String(product.id),
            name: String(product.name || ""),
            price: Number(product.price) || 0,
            image: product.image || null,
            category: product.category !== undefined ? String(product.category) : ""
          };
          const exists = items.find((item) => item.id === safeProduct.id);
          set({ items: exists ? items.filter((item) => item.id !== safeProduct.id) : [...items, safeProduct] });
        } catch (error) {
          console.error("Error toggling wishlist:", error);
        }
      },

      removeItem: (id) => {
        try {
          set({ items: get().items.filter((item) => item.id !== id) });
        } catch (error) {
          console.error("Error removing item:", error);
        }
      },

      isInWishlist: (id) => {
        try {
          return get().items.some((item) => item.id === id);
        } catch (error) {
          console.error("Error checking wishlist:", error);
          return false;
        }
      },

      getTotalItems: () => {
        try {
          return get().items.length;
        } catch (error) {
          console.error("Error getting total items:", error);
          return 0;
        }
      },
    }),
    {
      name: "wishlist-storage",
      version: 2,
      storage: createJSONStorage(() => safeStorage),
      onRehydrateStorage: () => (state) => {
        try {
          if (state?.items && Array.isArray(state.items)) {
            // Filter out any invalid items and ensure category is defined
            state.items = state.items
              .filter((item: any) => item && typeof item === 'object' && item.id)
              .map((item: any) => ({
                ...item,
                category: item.category !== undefined ? String(item.category) : ""
              }));
          }
          state?.setHasHydrated(true);
        } catch (error) {
          console.error("Error rehydrating wishlist:", error);
          if (state) {
            state.items = [];
            state.setHasHydrated(true);
          }
        }
      },
      migrate: (persistedState: any, version: number) => {
        // Validate and clean up items during migration
        if (persistedState && persistedState.items && Array.isArray(persistedState.items)) {
          persistedState.items = persistedState.items
            .filter((item: any) => item && typeof item === 'object' && item.id)
            .map((item: any) => ({
              ...item,
              category: item.category !== undefined ? String(item.category) : ""
            }));
          return { ...persistedState, _hasHydrated: false };
        }
        return { items: [], _hasHydrated: false };
      },
    }
  )
);

/**
 * Call on sign-out: wipes in-memory state and removes the persisted key.
 */
export const clearWishlistStore = async () => {
  try {
    useWishlistStore.setState({ items: [], _hasHydrated: true });
    if (Platform.OS === 'web') localStorage.removeItem("wishlist-storage");
    else await AsyncStorage.removeItem("wishlist-storage");
  } catch (error) {
    console.error("Error clearing wishlist store:", error);
  }
};

/**
 * Force reset wishlist storage if corrupted
 */
export const resetWishlistStorage = async () => {
  try {
    await clearWishlistStore();
    useWishlistStore.setState({ items: [], _hasHydrated: false });
  } catch (error) {
    console.error("Error resetting wishlist storage:", error);
  }
};
