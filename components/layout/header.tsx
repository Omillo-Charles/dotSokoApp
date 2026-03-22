import React from "react";
import { View, Text, TouchableOpacity, TextInput, Platform, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "../../hooks/useColorScheme";
import { useCartStore } from "../../store/useCartStore";
import { useWishlistStore } from "../../store/useWishlistStore";

export const Header = () => {
  const insets = useSafeAreaInsets();
  const { isDark, toggleTheme } = useColorScheme();
  const { getTotalItems: getCartTotal } = useCartStore();
  const { getTotalItems: getWishlistTotal } = useWishlistStore();
  const totalCartItems = getCartTotal();
  const totalWishlistItems = getWishlistTotal();
  
  return (
    <View 
      style={{ paddingTop: insets.top }} 
      className="bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-white/5 shadow-sm"
    >
      <View className="px-4 py-3">
        {/* Top Row: Logo and Action Icons */}
        <View className="flex-row items-center justify-between mb-3">
          {/* Logo */}
          <Link href="/" asChild>
            <TouchableOpacity>
              <Text className="text-2xl font-ubuntu-bold text-slate-900 dark:text-white tracking-tight">
                <Text className="text-secondary">.</Text>Soko
              </Text>
            </TouchableOpacity>
          </Link>

          {/* Action Icons */}
          <View className="flex-row items-center gap-4">
            <TouchableOpacity onPress={toggleTheme} className="relative">
              <Ionicons 
                name={isDark ? "sunny-outline" : "moon-outline"} 
                size={24} 
                color={isDark ? "#f8fafc" : "#64748b"} 
              />
            </TouchableOpacity>
            
            <Link href="/wishlist" asChild>
              <TouchableOpacity className="relative">
                <Ionicons name="heart-outline" size={24} color={isDark ? "#f8fafc" : "#64748b"} />
                {totalWishlistItems > 0 && (
                  <View className="absolute -top-1 -right-1 w-4 h-4 bg-secondary items-center justify-center rounded-full">
                    <Text className="text-[10px] font-ubuntu-bold text-white">{totalWishlistItems}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </Link>

            <Link href="/cart" asChild>
              <TouchableOpacity className="relative">
                <Ionicons name="cart-outline" size={24} color={isDark ? "#f8fafc" : "#64748b"} />
                {totalCartItems > 0 && (
                  <View className="absolute -top-1 -right-1 w-4 h-4 bg-secondary items-center justify-center rounded-full">
                    <Text className="text-[10px] font-ubuntu-bold text-white">{totalCartItems}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </Link>

            <Link href="/login" asChild>
              <TouchableOpacity>
                <Ionicons name="person-outline" size={24} color={isDark ? "#f8fafc" : "#64748b"} />
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* Search Bar Row */}
        <View className="relative">
          <View className="flex-row items-center bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-white/10 rounded-2xl px-4 py-2.5">
            <Ionicons name="search-outline" size={20} color={isDark ? "#94a3b8" : "#94a3b8"} />
            <TextInput
              placeholder="Search products..."
              placeholderTextColor="#94a3b8"
              className="flex-1 ml-3 text-slate-900 dark:text-white font-ubuntu text-base"
            />
          </View>
        </View>
      </View>
    </View>
  );
};
