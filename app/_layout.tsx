import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreenNative from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useColorScheme as useDeviceColorScheme } from "react-native";
import { useColorScheme } from "nativewind";
import { useThemeStore } from "../store/useThemeStore";
import SplashScreen from "@components/ui/SplashScreen"; // <- our custom splash
import { cleanupStorage } from "../lib/storageCleanup";
import "../globals.css";

// Prevent native splash from auto-hiding
SplashScreenNative.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const deviceColorScheme = useDeviceColorScheme();
  const { theme } = useThemeStore();
  const { setColorScheme } = useColorScheme();

  const colorScheme =
    theme === "system" ? (deviceColorScheme ?? "light") : theme;

  const isDark = colorScheme === "dark";

  useEffect(() => {
    setColorScheme(colorScheme);
  }, [colorScheme]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: isDark ? "#020617" : "#ffffff",
        },
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="cart" options={{ presentation: "modal" }} />
      <Stack.Screen name="checkout" />
      <Stack.Screen name="shop/index" />
      <Stack.Screen name="shop/create" />
      <Stack.Screen name="shop/[id]" />
      <Stack.Screen name="shop/product/[id]" />
      <Stack.Screen name="deals" />
      <Stack.Screen name="wishlist" />
      <Stack.Screen name="profile/index" />
      <Stack.Screen name="profile/orders" />
      <Stack.Screen name="profile/orders/[id]" />
      <Stack.Screen name="profile/wishlist" />
      <Stack.Screen name="profile/addresses" />
      <Stack.Screen name="profile/settings" />
      <Stack.Screen name="seller/index" />
    </Stack>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    "Ubuntu-Light": require("../assets/fonts/ubuntufont/ubuntu-font-family-0.83/Ubuntu-L.ttf"),
    "Ubuntu-Regular": require("../assets/fonts/ubuntufont/ubuntu-font-family-0.83/Ubuntu-R.ttf"),
    "Ubuntu-Medium": require("../assets/fonts/ubuntufont/ubuntu-font-family-0.83/Ubuntu-M.ttf"),
    "Ubuntu-Bold": require("../assets/fonts/ubuntufont/ubuntu-font-family-0.83/Ubuntu-B.ttf"),
  });

  const [appReady, setAppReady] = useState(false);

  // Clean up storage and hide native splash only after React splash renders
  useEffect(() => {
    if (loaded) {
      // Clean up any corrupted storage data
      cleanupStorage().finally(() => {
        setAppReady(true); // show custom splash
        SplashScreenNative.hideAsync();
      });
    }
  }, [loaded]);

  if (!appReady) {
    return <SplashScreen onLoaded={() => setAppReady(true)} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <RootLayoutNav />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}