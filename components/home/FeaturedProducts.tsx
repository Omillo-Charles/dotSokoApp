import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, Dimensions, ActivityIndicator, Animated } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { usePersonalizedFeed } from "@/hooks/useProducts";
import { useColorScheme } from "nativewind";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2; // px-4 (16*2) + gap-4 (16) = 48

// ── Per-card component so hooks are called unconditionally per product ─────────
function ProductCard({ p, isDark }: { p: any; isDark: boolean }) {
  const router = useRouter();
  const { addItem, items: cartItems } = useCartStore();
  const { toggleWishlist, items: wishlistItems, _hasHydrated } = useWishlistStore();

  const id = p._id || p.id;
  const imageSrc = p.image || p.images?.[0] || "https://ik.imagekit.io/omytech/d8f07aa0-f9cc-4e8c-859a-1c7ec2ffc0e8";
  const rating = p.averageRating || p.rating || 0;
  const price = p.price || 0;

  // ── Cart ────────────────────────────────────────────────────────────────────
  const isInCart = cartItems.some((item) => item.id === id);
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = () => {
    addItem({
      id,
      name: p.name,
      price,
      image: imageSrc,
      category: p.category,
      quantity: 1,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  // ── Wishlist / like ─────────────────────────────────────────────────────────
  const liked = _hasHydrated && wishlistItems.some((item) => item.id === id);
  const heartScale = useRef(new Animated.Value(1)).current;

  const handleLike = () => {
    Animated.sequence([
      Animated.spring(heartScale, { toValue: 1.5, useNativeDriver: true, speed: 50 }),
      Animated.spring(heartScale, { toValue: 1, useNativeDriver: true, speed: 30 }),
    ]).start();

    toggleWishlist({
      id,
      name: p.name,
      price,
      image: imageSrc,
      category: p.category,
    });
  };

  const cartColor = justAdded || isInCart ? "#f97316" : (isDark ? "#f8fafc" : "#0f172a");
  const cartIcon = justAdded || isInCart ? "cart" : "cart-outline";

  return (
    <View
      key={id}
      style={{ width: CARD_WIDTH }}
      className="mb-4 bg-white dark:bg-slate-950 rounded-[20px] border border-slate-200 dark:border-white/10 overflow-hidden"
    >
      {/* Image container */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => router.push(`/shop/product/${id}` as any)}
        className="relative w-full aspect-square bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-white/10"
      >
        <Image
          source={{ uri: imageSrc }}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
          transition={200}
        />

        {/* Wishlist heart — top right */}
        <TouchableOpacity
          onPress={handleLike}
          activeOpacity={0.8}
          style={{
            position: "absolute", top: 8, right: 8,
            backgroundColor: isDark ? "rgba(15,23,42,0.8)" : "rgba(255,255,255,0.85)",
            borderRadius: 999, padding: 7,
          }}
        >
          <Animated.View style={{ transform: [{ scale: heartScale }] }}>
            <Ionicons
              name={liked ? "heart" : "heart-outline"}
              size={15}
              color={liked ? "#f43f5e" : (isDark ? "#cbd5e1" : "#64748b")}
            />
          </Animated.View>
        </TouchableOpacity>

        {/* Cart — top left */}
        <TouchableOpacity
          onPress={handleAddToCart}
          activeOpacity={0.8}
          style={{
            position: "absolute", top: 8, left: 8,
            backgroundColor: isDark ? "rgba(15,23,42,0.8)" : "rgba(255,255,255,0.85)",
            borderRadius: 999, padding: 7,
          }}
        >
          <Ionicons name={cartIcon} size={15} color={cartColor} />
        </TouchableOpacity>
      </TouchableOpacity>

      {/* Content */}
      <View className="p-3 flex-1">
        {/* Stars */}
        <View className="flex-row items-center mb-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <Ionicons
              key={s}
              name="star"
              size={10}
              color={rating >= s ? "#fbbf24" : "#cbd5e1"}
            />
          ))}
          <Text className="text-[10px] text-slate-500 font-ubuntu-bold ml-1">
            ({Number(rating).toFixed(1)})
          </Text>
        </View>

        {/* Name */}
        <TouchableOpacity onPress={() => router.push(`/shop/product/${id}` as any)}>
          <Text numberOfLines={1} className="font-ubuntu-bold text-slate-900 dark:text-white text-sm">
            {p.name || "Untitled Product"}
          </Text>
        </TouchableOpacity>

        {/* Description */}
        <Text numberOfLines={2} className="text-xs text-slate-500 dark:text-slate-400 font-ubuntu-medium mt-1 min-h-[32px]">
          {p.description || "No description"}
        </Text>

        {/* Price + arrow */}
        <View className="mt-3 flex-row items-center justify-between">
          <Text className="text-sm font-ubuntu-bold text-primary">
            KES {Number(price).toLocaleString()}
          </Text>
          <TouchableOpacity
            onPress={() => router.push(`/shop/product/${id}` as any)}
            className="w-7 h-7 rounded-full bg-orange-100 dark:bg-orange-500/20 items-center justify-center"
          >
            <Ionicons name="chevron-forward" size={14} color="#f97316" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ── Section wrapper ────────────────────────────────────────────────────────────
export const FeaturedProducts = () => {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const { data: products = [], isLoading, isError } = usePersonalizedFeed(12);

  if (isLoading) {
    return (
      <View className="flex-1 w-full bg-slate-50 dark:bg-slate-900 mt-2 pb-6 justify-center items-center py-12">
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  if (isError || products.length === 0) {
    return null;
  }

  return (
    <View className="flex-1 w-full bg-slate-50 dark:bg-slate-900 mt-2 pb-6">
      <View className="px-4 py-4 flex-row justify-between items-center bg-transparent">
        <Text className="text-xl font-ubuntu-bold text-slate-900 dark:text-white">
          For You
        </Text>
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => router.push("/shop" as any)}
        >
          <Text className="text-primary font-ubuntu-medium text-sm mr-1">View All</Text>
          <Ionicons name="chevron-forward" size={16} color="#f97316" />
        </TouchableOpacity>
      </View>

      <View className="flex-row flex-wrap justify-between px-4">
        {products.map((p: any) => (
          <ProductCard key={p._id || p.id} p={p} isDark={isDark} />
        ))}
      </View>
    </View>
  );
};
