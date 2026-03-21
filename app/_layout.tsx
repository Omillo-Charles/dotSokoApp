import { useEffect } from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useColorScheme } from "../hooks/useColorScheme";
import "../globals.css";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isDark } = useColorScheme();
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

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <View className={`flex-1 ${isDark ? "dark" : ""}`}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "transparent" },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack>
      </View>
    </SafeAreaProvider>
  );
}
