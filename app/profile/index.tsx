import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, RefreshControl } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "nativewind";
import { useSignOut } from "@/hooks/useAuth";
import { useMyShop } from "@/hooks/useShop";

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const signOutMutation = useSignOut();
  const { data: myShop, isLoading: isShopLoading, refetch: refetchShop } = useMyShop();

  useFocusEffect(
    useCallback(() => { refetchShop(); }, [refetchShop])
  );

  const [user, setUser] = useState<{ id: string; name: string; email: string; avatar?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem("user").then((data) => {
      if (data) setUser(JSON.parse(data));
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: isDark ? "#020617" : "#f8fafc" }}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-4 py-4 flex-row items-center justify-between bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-white/5">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <Ionicons name="arrow-back" size={24} color={isDark ? "#ffffff" : "#0f172a"} />
        </TouchableOpacity>
        <Text className="text-xl font-ubuntu-bold text-slate-900 dark:text-white">Profile</Text>
        <TouchableOpacity onPress={() => router.push("/(tabs)")}>
          <Ionicons name="home-outline" size={24} color={isDark ? "#ffffff" : "#0f172a"} />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isShopLoading} onRefresh={refetchShop} tintColor={isDark ? "#ffffff" : "#0f172a"} />
        }
      >
        {/* Avatar + name */}
        <View className="items-center py-8">
          <View className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-800 items-center justify-center mb-4 overflow-hidden border-4 border-white dark:border-slate-800">
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
            ) : (
              <Ionicons name="person" size={40} color={isDark ? "#475569" : "#94a3b8"} />
            )}
          </View>
          <Text className="text-2xl font-ubuntu-bold text-slate-900 dark:text-white mb-1">
            {user?.name || "User"}
          </Text>
          <Text className="text-base font-ubuntu text-slate-500 dark:text-slate-400">
            {user?.email || ""}
          </Text>
        </View>

        {/* Menu */}
        <View className="px-4 gap-3 mb-8">
          <MenuButton
            icon="cube-outline"
            title="My Orders"
            subtitle="Track and manage your orders"
            isDark={isDark}
            onPress={() => router.push("/profile/orders" as any)}
          />
          <MenuButton
            icon="heart-outline"
            title="Wishlist"
            subtitle="View your saved items"
            isDark={isDark}
            onPress={() => router.push("/profile/wishlist" as any)}
          />
          <MenuButton
            icon="location-outline"
            title="Shipping Addresses"
            subtitle="Manage delivery locations"
            isDark={isDark}
            onPress={() => router.push("/profile/addresses" as any)}
          />
          <MenuButton
            icon="settings-outline"
            title="Settings"
            subtitle="Account preferences and security"
            isDark={isDark}
            onPress={() => router.push("/profile/settings" as any)}
          />
          <MenuButton
            icon="help-circle-outline"
            title="Help & Support"
            subtitle="Contact us for assistance"
            isDark={isDark}
            onPress={() => {}}
          />
          <MenuButton
            icon="storefront-outline"
            title="Seller Dashboard"
            subtitle={isShopLoading ? "Checking shop status..." : "Manage your shop and products"}
            isDark={isDark}
            loading={isShopLoading}
            onPress={() => {
              if (isShopLoading) return;
              if (myShop?.id || myShop?._id) {
                router.push("/seller/" as any);
              } else {
                router.push("/shop/create" as any);
              }
            }}
          />
        </View>

        {/* Sign out */}
        <View className="px-4 mb-12">
          <TouchableOpacity
            onPress={() => signOutMutation.mutate()}
            disabled={signOutMutation.isPending}
            className="w-full h-14 bg-red-50 dark:bg-red-500/10 rounded-2xl flex-row items-center justify-center border border-red-100 dark:border-red-500/20"
          >
            {signOutMutation.isPending ? (
              <ActivityIndicator color="#ef4444" />
            ) : (
              <>
                <Ionicons name="log-out-outline" size={20} color="#ef4444" />
                <Text className="text-red-500 font-ubuntu-bold text-base ml-2">Sign Out</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function MenuButton({
  icon, title, subtitle, isDark, onPress, loading = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  isDark: boolean;
  onPress: () => void;
  loading?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-white/5"
    >
      <View className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 items-center justify-center mr-4">
        <Ionicons name={icon} size={24} color={isDark ? "#94a3b8" : "#64748b"} />
      </View>
      <View className="flex-1">
        <Text className="text-base font-ubuntu-medium text-slate-900 dark:text-white mb-0.5">{title}</Text>
        <Text className="text-sm font-ubuntu text-slate-500 dark:text-slate-400">{subtitle}</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="small" color={isDark ? "#94a3b8" : "#64748b"} />
      ) : (
        <Ionicons name="chevron-forward" size={20} color={isDark ? "#475569" : "#cbd5e1"} />
      )}
    </TouchableOpacity>
  );
}
