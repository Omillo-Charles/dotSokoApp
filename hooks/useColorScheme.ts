import { useColorScheme as useNativeWindColorScheme } from "nativewind";
import { useThemeStore } from "../store/useThemeStore";
import { useColorScheme as useDeviceColorScheme } from "react-native";

export function useColorScheme() {
  const { setColorScheme } = useNativeWindColorScheme();
  const { theme, setTheme } = useThemeStore();
  const deviceColorScheme = useDeviceColorScheme();

  const colorScheme = theme === "system" ? (deviceColorScheme ?? "light") : theme;

  const toggleTheme = () => {
    const nextTheme = colorScheme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    setColorScheme(nextTheme);
  };

  return {
    colorScheme,
    isDark: colorScheme === "dark",
    toggleTheme,
    setTheme,
    theme,
  };
}
