import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

/**
 * Validates and cleans up storage data to prevent corruption errors
 */
export const cleanupStorage = async () => {
  try {
    console.log("Starting storage cleanup...");
    
    // For now, just clear everything to prevent corruption errors
    // This is a temporary fix to ensure the app doesn't crash
    if (Platform.OS === 'web') {
      localStorage.removeItem("wishlist-storage");
      localStorage.removeItem("cart-storage");
      console.log("Cleared web storage");
    } else {
      await AsyncStorage.multiRemove(["wishlist-storage", "cart-storage"]);
      console.log("Cleared mobile storage");
    }
    
    console.log("Storage cleanup completed successfully");
  } catch (error) {
    console.error("Error during storage cleanup:", error);
  }
};
