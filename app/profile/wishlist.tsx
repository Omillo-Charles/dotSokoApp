import React, { useRef } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  Image, Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import { useWishlistStore, WishlistItem } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";

// ── Single wishlist card ───────────────────────────────────────────────────────
function WishlistCard({ item, isDark, onViewProduct }: {
  item: WishlistItem;
  isDark: boolean;
  onViewProduct: () => void;
}) {
  const { toggleWishlist } = useWishlistStore();
  const { addItem, items: cartItems } = useCartStore();

  const isInCart = cartItems.some((c) => c.id === item.id);

  // Heart scale animation on remove
  const heartScale = useRef(new Animated.Value(1)).current;

  const handleRemove = () => {
    Animated.sequence([
      Animated.spring(heartScale, { toValue: 1.4, useNativeDriver: true, speed: 50 }),
      Animated.spring(heartScale, { toValue: 0, useNativeDriver: true, speed: 30 }),
    ]).start(() => toggleWishlist(item));
  };

  const handleAddToCart = () => {
    addItem({ id: item.id, name: item.name, price: item.price, image: item.image, category: item.category, quantity: 1 });
  };

  const borderColor = isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9";
  const cardBg = isDark ? "#0f172a" : "#ffffff";

  return (
    <View style={{ backgroundColor: cardBg, borderRadius: 20, borderWidth: 1, borderColor, marginBottom: 12, overflow: "hidden" }}>
      <TouchableOpacity activeOpacity={0.85} onPress={onViewProduct}>
        {/* Product image — full width, natural aspect */}
        <View style={{ width: "100%", aspectRatio: 1.6, backgroundColor: isDark ? "#1e293b" : "#f8fafc" }}>
          <Image
            source={typeof item.image === "string" ? { uri: item.image } : item.image}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
          {/* Category pill */}
          {item.category && (
            <View style={{
              position: "absolute", top: 10, left: 10,
              backgroundColor: isDark ? "rgba(15,23,42,0.85)" : "rgba(255,255,255,0.9)",
              paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
            }}>
              <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 10, color: isDark ? "#94a3b8" : "#64748b", textTransform: "uppercase", letterSpacing: 0.5 }}>
                {item.category.replace(/-/g, " ")}
              </Text>
            </View>
          )}
          {/* Remove heart — top right */}
          <TouchableOpacity
            onPress={handleRemove}
            activeOpacity={0.8}
            style={{
              position: "absolute", top: 10, right: 10,
              backgroundColor: isDark ? "rgba(15,23,42,0.85)" : "rgba(255,255,255,0.9)",
              borderRadius: 999, padding: 8,
            }}
          >
            <Animated.View style={{ transform: [{ scale: heartScale }] }}>
              <Ionicons name="heart" size={16} color="#f43f5e" />
            </Animated.View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* Content row */}
      <View style={{ padding: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <TouchableOpacity style={{ flex: 1, marginRight: 12 }} onPress={onViewProduct} activeOpacity={0.7}>
          <Text numberOfLines={1} style={{ fontFamily: "Ubuntu-Bold", fontSize: 14, color: isDark ? "#ffffff" : "#0f172a", marginBottom: 2 }}>
            {item.name}
          </Text>
          <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 15, color: "#f97316" }}>
            KES {Number(item.price).toLocaleString()}
          </Text>
        </TouchableOpacity>

        {/* Add to cart button */}
        <TouchableOpacity
          onPress={handleAddToCart}
          activeOpacity={0.8}
          style={{
            flexDirection: "row", alignItems: "center", gap: 6,
            paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14,
            backgroundColor: isInCart
              ? (isDark ? "rgba(249,115,22,0.2)" : "rgba(249,115,22,0.12)")
              : (isDark ? "#1e293b" : "#f1f5f9"),
          }}
        >
          <Ionicons
            name={isInCart ? "cart" : "cart-outline"}
            size={16}
            color={isInCart ? "#f97316" : (isDark ? "#94a3b8" : "#64748b")}
          />
          <Text style={{
            fontFamily: "Ubuntu-Bold", fontSize: 11,
            color: isInCart ? "#f97316" : (isDark ? "#94a3b8" : "#64748b"),
            textTransform: "uppercase",
          }}>
            {isInCart ? "In Cart" : "Add"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── Screen ─────────────────────────────────────────────────────────────────────
export default function ProfileWishlistScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const { items } = useWishlistStore();

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-4 py-4 flex-row items-center bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-white/5">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 mr-2">
          <Ionicons name="arrow-back" size={24} color={isDark ? "#ffffff" : "#0f172a"} />
        </TouchableOpacity>
        <Text className="text-xl font-ubuntu-bold text-slate-900 dark:text-white flex-1">Wishlist</Text>
        {items.length > 0 && (
          <View className="bg-red-50 dark:bg-red-500/10 px-3 py-1 rounded-full">
            <Text className="text-xs font-ubuntu-bold text-red-500">{items.length}</Text>
          </View>
        )}
      </View>

      {items.length === 0 ? (
        <View className="flex-1 items-center justify-center p-8">
          <View className="w-28 h-28 bg-slate-100 dark:bg-slate-900 rounded-full items-center justify-center mb-6">
            <Ionicons name="heart-outline" size={52} color="#94a3b8" />
          </View>
          <Text className="text-xl font-ubuntu-bold text-slate-900 dark:text-white mb-2">
            Nothing saved yet
          </Text>
          <Text className="text-slate-500 dark:text-slate-400 font-ubuntu text-center px-8 mb-8 leading-6">
            Tap the heart on any product to save it here.
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/shop/index" as any)}
            className="bg-primary px-10 py-4 rounded-2xl"
          >
            <Text className="text-white font-ubuntu-bold text-base">Explore Shop</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {items.map((item) => (
            <WishlistCard
              key={item.id}
              item={item}
              isDark={isDark}
              onViewProduct={() => router.push(`/shop/product/${item.id}` as any)}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
