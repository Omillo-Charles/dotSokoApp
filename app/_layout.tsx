import { useEffect } from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import "../globals.css";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

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

  if (!loaded) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
