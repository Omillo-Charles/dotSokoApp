import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

// Global modal reference for auth guard
let globalModalShow: ((opts: any) => void) | null = null;

export const setAuthModalHandler = (showFn: (opts: any) => void) => {
  globalModalShow = showFn;
};

export const requireAuth = async (action: string = "do this"): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem("accessToken");
    if (token) return true;
  } catch {}

  if (globalModalShow) {
    globalModalShow({
      title: "Sign in required",
      message: `You need to sign in to ${action}.`,
      variant: "info",
      actions: [
        { label: "Cancel", style: "secondary" },
        { label: "Sign In", style: "primary", onPress: () => router.push("/(auth)/login" as any) },
      ],
    });
  }
  return false;
};
