import { useEffect } from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useColorScheme as useDeviceColorScheme } from "react-native";
import { useColorScheme } from "nativewind";
import { useThemeStore } from "../store/useThemeStore";
import "../globals.css";

// Prevent splash screen from auto hiding
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const deviceColorScheme = useDeviceColorScheme();
  const { theme } = useThemeStore();
  const { setColorScheme } = useColorScheme();

  const colorScheme =
    theme === "system" ? (deviceColorScheme ?? "light") : theme;

  const isDark = colorScheme === "dark";

  // Sync NativeWind theme WITHOUT affecting navigation tree
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
      <Stack.Screen name="shop/index" />
      <Stack.Screen name="shop/[id]" />
      <Stack.Screen name="shop/product/[id]" />
      <Stack.Screen name="deals" />
      <Stack.Screen name="wishlist" />
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

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <RootLayoutNav />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}