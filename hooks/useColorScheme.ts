import { useColorScheme as useNativeWindColorScheme } from "nativewind";
import { useThemeStore } from "../store/useThemeStore";
import { useColorScheme as useDeviceColorScheme } from "react-native";
import { useEffect } from "react";

export function useColorScheme() {
  const { colorScheme: nwColorScheme, setColorScheme: setNWColorScheme } = useNativeWindColorScheme();
  const { theme, setTheme } = useThemeStore();
  const deviceColorScheme = useDeviceColorScheme();

  const colorScheme = theme === "system" ? (deviceColorScheme ?? "light") : theme;

  useEffect(() => {
    // Only set NW color scheme if it differs from our computed scheme
    if (nwColorScheme !== colorScheme) {
      setNWColorScheme(colorScheme);
    }
  }, [colorScheme, nwColorScheme, setNWColorScheme]);

  const toggleTheme = () => {
    const nextTheme = colorScheme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    setNWColorScheme(nextTheme);
  };

  return {
    colorScheme,
    isDark: colorScheme === "dark",
    toggleTheme,
    setTheme,
    theme,
  };
}
