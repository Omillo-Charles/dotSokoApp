import React, { useState, useCallback, useRef } from 'react';
import {
  View, Text, Pressable, Platform, ScrollView, TouchableOpacity,
  ActivityIndicator, RefreshControl, Modal, TextInput, FlatList, Image,
} from 'react-native';
import { Search, ShoppingBag, AlertCircle } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from "@/hooks/useColorScheme";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/shop/ProductCard";
import { CATEGORIES } from "@/constants/categories";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

// ── Shop search modal ──────────────────────────────────────────────────────────
function ShopSearchModal({ visible, onClose, isDark }: { visible: boolean; onClose: () => void; isDark: boolean }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const inputRef = useRef<TextInput>(null);

  const border = isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9";
  const muted = isDark ? "#64748b" : "#94a3b8";
  const text = isDark ? "#ffffff" : "#0f172a";
  const inputBg = isDark ? "#1e293b" : "#f8fafc";

  const { data: allShops = [], isLoading } = useQuery({
    queryKey: ["shops-all"],
    queryFn: async () => {
      const res = await api.get("/shops", { params: { limit: 100 } });
      return res.data.data || res.data || [];
    },
    staleTime: 1000 * 60 * 5,
  });

  const filtered = query.trim().length < 1
    ? allShops
    : allShops.filter((s: any) => {
        const q = query.toLowerCase();
        return (
          s.name?.toLowerCase().includes(q) ||
          s.username?.toLowerCase().includes(q) ||
          s.category?.toLowerCase().includes(q)
        );
      });

  const handleSelect = (shop: any) => {
    onClose();
    setQuery("");
    const id = shop.id || shop._id;
    router.push(`/shop/${id}` as any);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: isDark ? "#020617" : "#ffffff", paddingTop: insets.top }}>
        {/* Header */}
        <View style={{
          flexDirection: "row", alignItems: "center", gap: 12,
          paddingHorizontal: 16, paddingVertical: 14,
          borderBottomWidth: 1, borderBottomColor: border,
        }}>
          {/* Search input */}
          <View style={{
            flex: 1, flexDirection: "row", alignItems: "center", gap: 10,
            backgroundColor: inputBg, borderRadius: 14,
            borderWidth: 1, borderColor: border,
            paddingHorizontal: 14, paddingVertical: 11,
          }}>
            <Ionicons name="search-outline" size={18} color={muted} />
            <TextInput
              ref={inputRef}
              value={query}
              onChangeText={setQuery}
              placeholder="Search shops by name or category..."
              placeholderTextColor={muted}
              autoFocus
              style={{ flex: 1, fontFamily: "Ubuntu-Regular", fontSize: 14, color: text, padding: 0 }}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery("")} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="close-circle" size={17} color={muted} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity onPress={onClose} style={{ paddingLeft: 4 }}>
            <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 14, color: "#f97316" }}>Cancel</Text>
          </TouchableOpacity>
        </View>

        {/* Results */}
        {isLoading ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator size="large" color="#f97316" />
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item: any) => item.id || item._id}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 40 }}
            ListEmptyComponent={
              <View style={{ alignItems: "center", paddingTop: 60 }}>
                <Ionicons name="storefront-outline" size={48} color={muted} />
                <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 15, color: text, marginTop: 14 }}>No shops found</Text>
                <Text style={{ fontFamily: "Ubuntu-Regular", fontSize: 13, color: muted, marginTop: 4 }}>
                  Try a different name or category
                </Text>
              </View>
            }
            renderItem={({ item: shop }: { item: any }) => (
              <TouchableOpacity
                onPress={() => handleSelect(shop)}
                activeOpacity={0.7}
                style={{
                  flexDirection: "row", alignItems: "center", gap: 14,
                  paddingVertical: 12,
                  borderBottomWidth: 1, borderBottomColor: border,
                }}
              >
                {/* Avatar */}
                <View style={{
                  width: 48, height: 48, borderRadius: 24, overflow: "hidden",
                  backgroundColor: isDark ? "#1e293b" : "#f1f5f9",
                  borderWidth: 1, borderColor: border, flexShrink: 0,
                }}>
                  {shop.avatar
                    ? <Image source={{ uri: shop.avatar }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
                    : <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                        <Ionicons name="storefront-outline" size={22} color={muted} />
                      </View>
                  }
                </View>

                {/* Info */}
                <View style={{ flex: 1, minWidth: 0 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                    <Text numberOfLines={1} style={{ fontFamily: "Ubuntu-Bold", fontSize: 14, color: text }}>
                      {shop.name}
                    </Text>
                    {shop.isVerified && (
                      <Ionicons name="checkmark-circle" size={14} color="#f97316" />
                    )}
                  </View>
                  <Text numberOfLines={1} style={{ fontFamily: "Ubuntu-Regular", fontSize: 12, color: muted, marginTop: 1 }}>
                    {shop.username ? `@${shop.username}` : ""}{shop.username && shop.category ? " · " : ""}{shop.category?.replace(/-/g, " ")}
                  </Text>
                </View>

                {/* Followers */}
                <View style={{ alignItems: "flex-end", flexShrink: 0 }}>
                  <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 12, color: text }}>
                    {(shop.followersCount || 0).toLocaleString()}
                  </Text>
                  <Text style={{ fontFamily: "Ubuntu-Regular", fontSize: 10, color: muted }}>followers</Text>
                </View>

                <Ionicons name="chevron-forward" size={16} color={isDark ? "#334155" : "#cbd5e1"} />
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </Modal>
  );
}

export default function ShopScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isDark } = useColorScheme();
  const { cat } = useLocalSearchParams<{ cat?: string }>();

  const [activeTab, setActiveTab] = useState<'foryou' | 'following'>('foryou');
  const [shopSearchOpen, setShopSearchOpen] = useState(false);

  // When a category is active, ignore the tab filter and just filter by category
  const queryParams = cat
    ? { cat, limit: 30 }
    : { limit: 20, following: activeTab === 'following' ? 'true' : undefined };

  const {
    data: products,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useProducts(queryParams);

  const onRefresh = useCallback(() => { refetch(); }, [refetch]);

  // Resolve the human-readable category name for the header
  const activeCategoryName = cat
    ? (CATEGORIES.find((c) => c.value === cat)?.name ?? cat)
    : null;

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-4 py-4 flex-row items-center bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-white/5">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 -ml-2 mr-2"
        >
          <Ionicons name="arrow-back" size={24} color={isDark ? "#ffffff" : "#0f172a"} />
        </TouchableOpacity>
        <Text className="text-xl font-ubuntu-bold text-slate-900 dark:text-white flex-1" numberOfLines={1}>
          {activeCategoryName ?? "Shop"}
        </Text>
        {activeCategoryName && (
          <TouchableOpacity
            onPress={() => router.replace('/shop/index' as any)}
            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full"
          >
            <Text className="text-xs font-ubuntu-bold text-slate-500 dark:text-slate-400">Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100, flexGrow: 1 }}
        refreshControl={
          <RefreshControl 
            refreshing={isRefetching} 
            onRefresh={onRefresh}
            tintColor={isDark ? "#ffffff" : "#3b82f6"}
          />
        }
      >
        <View className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/10 z-10 pt-2">
          <View className="px-4 pt-1 mb-1 flex-row items-center justify-between">
            <Text className="text-2xl font-ubuntu-bold text-slate-900 dark:text-white tracking-tight">
              {activeCategoryName ? activeCategoryName : "Explore"}
            </Text>
            <Pressable
              onPress={() => setShopSearchOpen(true)}
              className="w-9 h-9 bg-slate-100 dark:bg-slate-800 rounded-full items-center justify-center"
            >
              <Search size={18} color="#64748b" />
            </Pressable>
          </View>

          {/* Only show tabs when not filtering by category */}
          {!activeCategoryName && (
            <View className="flex-row">
              <Pressable
                onPress={() => setActiveTab('foryou')}
                className="flex-1 h-10 items-center justify-center"
              >
                <Text className={`font-ubuntu-medium text-sm ${activeTab === 'foryou' ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>For You</Text>
                {activeTab === 'foryou' && <View className="absolute bottom-0 w-16 h-1 bg-primary rounded-t-full" />}
              </Pressable>
              <Pressable
                onPress={() => setActiveTab('following')}
                className="flex-1 h-10 items-center justify-center"
              >
                <Text className={`font-ubuntu-medium text-sm ${activeTab === 'following' ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>Following</Text>
                {activeTab === 'following' && <View className="absolute bottom-0 w-16 h-1 bg-primary rounded-t-full" />}
              </Pressable>
            </View>
          )}
        </View>

        {isLoading && !isRefetching ? (
          <View className="flex-1 items-center justify-center p-20">
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text className="mt-4 font-ubuntu text-slate-500">Loading products...</Text>
          </View>
        ) : isError ? (
          <View className="flex-1 items-center justify-center p-8">
            <AlertCircle size={48} color="#f43f5e" />
            <Text className="mt-4 font-ubuntu-bold text-slate-900 dark:text-white text-center">Failed to load products</Text>
            <TouchableOpacity 
              onPress={() => refetch()}
              className="mt-4 px-6 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl"
            >
              <Text className="font-ubuntu-medium text-primary">Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : products && products.length > 0 ? (
          <View className="pt-2">
            {products.map((product: any) => (
              <ProductCard 
                key={product._id || product.id} 
                product={product} 
              />
            ))}
          </View>
        ) : (
          <View className="flex-1 items-center justify-center p-8 mt-10">
            <View className="w-20 h-20 bg-slate-200 dark:bg-slate-800 rounded-[2rem] items-center justify-center mb-6">
              <ShoppingBag size={40} color="#94a3b8" />
            </View>
            <Text className="font-ubuntu-bold text-slate-900 dark:text-white text-lg uppercase tracking-tight text-center mb-2">
              No products found
            </Text>
            <Text className="text-sm font-ubuntu text-slate-500 dark:text-slate-400 text-center leading-relaxed max-w-[280px]">
              {activeCategoryName
                ? `No products found in ${activeCategoryName} yet.`
                : activeTab === 'following'
                  ? "Sign in or follow some shops to see products here."
                  : "Be the first to post something amazing!"}
            </Text>
            <Pressable className="mt-8 px-8 py-3.5 bg-primary rounded-2xl">
              <Text className="text-white font-ubuntu-bold text-sm">Post a Product</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <Pressable 
        className="absolute bottom-6 right-6 z-40 bg-primary h-14 w-14 rounded-full items-center justify-center"
        style={Platform.OS === 'ios' ? { shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 } : { shadowColor: '#000', elevation: 8 }}
      >
        <Ionicons name="add" size={24} color="#ffffff" />
      </Pressable>

      <ShopSearchModal
        visible={shopSearchOpen}
        onClose={() => setShopSearchOpen(false)}
        isDark={isDark}
      />
    </View>
  );
}
