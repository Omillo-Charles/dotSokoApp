import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

/**
 * Validates and cleans up storage data to prevent corruption errors
 * Only cleans up if data is actually corrupted
 */
export const cleanupStorage = async () => {
  try {
    console.log("Validating storage...");
    
    // Check if cart storage is corrupted
    const cartData = Platform.OS === 'web' 
      ? localStorage.getItem("cart-storage")
      : await AsyncStorage.getItem("cart-storage");
    
    if (cartData) {
      try {
        const parsed = JSON.parse(cartData);
        // Check if items array has any invalid entries (missing category or other required fields)
        if (parsed?.state?.items && Array.isArray(parsed.state.items)) {
          const hasInvalidItems = parsed.state.items.some((item: any) => 
            !item || typeof item !== 'object' || !item.id
          );
          if (hasInvalidItems) {
            console.log("Found corrupted cart data, cleaning up...");
            if (Platform.OS === 'web') localStorage.removeItem("cart-storage");
            else await AsyncStorage.removeItem("cart-storage");
          } else {
            // Ensure all items have category field
            const needsCategoryFix = parsed.state.items.some((item: any) => item.category === undefined);
            if (needsCategoryFix) {
              console.log("Fixing cart items missing category field...");
              parsed.state.items = parsed.state.items.map((item: any) => ({
                ...item,
                category: item.category !== undefined ? item.category : ""
              }));
              const fixed = JSON.stringify(parsed);
              if (Platform.OS === 'web') localStorage.setItem("cart-storage", fixed);
              else await AsyncStorage.setItem("cart-storage", fixed);
            }
          }
        }
      } catch (e) {
        console.log("Cart storage corrupted, removing...");
        if (Platform.OS === 'web') localStorage.removeItem("cart-storage");
        else await AsyncStorage.removeItem("cart-storage");
      }
    }
    
    // Check if wishlist storage is corrupted
    const wishlistData = Platform.OS === 'web'
      ? localStorage.getItem("wishlist-storage")
      : await AsyncStorage.getItem("wishlist-storage");
    
    if (wishlistData) {
      try {
        const parsed = JSON.parse(wishlistData);
        // Check if items array has any invalid entries
        if (parsed?.state?.items && Array.isArray(parsed.state.items)) {
          const hasInvalidItems = parsed.state.items.some((item: any) => 
            !item || typeof item !== 'object' || !item.id
          );
          if (hasInvalidItems) {
            console.log("Found corrupted wishlist data, cleaning up...");
            if (Platform.OS === 'web') localStorage.removeItem("wishlist-storage");
            else await AsyncStorage.removeItem("wishlist-storage");
          } else {
            // Ensure all items have category field
            const needsCategoryFix = parsed.state.items.some((item: any) => item.category === undefined);
            if (needsCategoryFix) {
              console.log("Fixing wishlist items missing category field...");
              parsed.state.items = parsed.state.items.map((item: any) => ({
                ...item,
                category: item.category !== undefined ? item.category : ""
              }));
              const fixed = JSON.stringify(parsed);
              if (Platform.OS === 'web') localStorage.setItem("wishlist-storage", fixed);
              else await AsyncStorage.setItem("wishlist-storage", fixed);
            }
          }
        }
      } catch (e) {
        console.log("Wishlist storage corrupted, removing...");
        if (Platform.OS === 'web') localStorage.removeItem("wishlist-storage");
        else await AsyncStorage.removeItem("wishlist-storage");
      }
    }
    
    console.log("Storage validation completed");
  } catch (error) {
    console.error("Error during storage cleanup:", error);
  }
};
