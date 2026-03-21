import React from "react";
import { View, Text, TouchableOpacity, TextInput, Platform, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const Header = () => {
  const insets = useSafeAreaInsets();
  
  return (
    <View 
      style={{ paddingTop: insets.top }} 
      className="bg-white border-b border-slate-100 shadow-sm"
    >
      <View className="px-4 py-3">
        {/* Top Row: Logo and Action Icons */}
        <View className="flex-row items-center justify-between mb-3">
          {/* Logo */}
          <Link href="/" asChild>
            <TouchableOpacity>
              <Text className="text-2xl font-ubuntu-bold text-slate-900 tracking-tight">
                <Text className="text-secondary">.</Text>Soko
              </Text>
            </TouchableOpacity>
          </Link>

          {/* Action Icons */}
          <View className="flex-row items-center gap-4">
            <TouchableOpacity className="relative">
              <Ionicons name="sunny-outline" size={24} color="#64748b" />
            </TouchableOpacity>
            
            <TouchableOpacity className="relative">
              <Ionicons name="heart-outline" size={24} color="#64748b" />
              <View className="absolute -top-1 -right-1 w-4 h-4 bg-secondary items-center justify-center rounded-full">
                <Text className="text-[10px] font-ubuntu-bold text-white">0</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity className="relative">
              <Ionicons name="cart-outline" size={24} color="#64748b" />
              <View className="absolute -top-1 -right-1 w-4 h-4 bg-secondary items-center justify-center rounded-full">
                <Text className="text-[10px] font-ubuntu-bold text-white">0</Text>
              </View>
            </TouchableOpacity>

            <Link href="/login" asChild>
              <TouchableOpacity>
                <Ionicons name="person-outline" size={24} color="#64748b" />
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* Search Bar Row */}
        <View className="relative">
          <View className="flex-row items-center bg-slate-100 border border-slate-200/50 rounded-2xl px-4 py-2.5">
            <Ionicons name="search-outline" size={20} color="#94a3b8" />
            <TextInput
              placeholder="Search products..."
              placeholderTextColor="#94a3b8"
              className="flex-1 ml-3 text-slate-900 font-ubuntu text-base"
            />
          </View>
        </View>
      </View>
    </View>
  );
};
