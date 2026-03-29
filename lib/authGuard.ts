import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { router } from "expo-router";

export const requireAuth = async (action: string = "do this"): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem("accessToken");
    if (token) return true;
  } catch {}

  Alert.alert(
    "Sign in required",
    `You need to sign in to ${action}.`,
    [
      { text: "Cancel", style: "cancel" },
      { text: "Sign In", onPress: () => router.push("/(auth)/login" as any) },
    ]
  );
  return false;
};
