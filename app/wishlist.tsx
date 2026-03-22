import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useWishlistStore, WishlistItem } from "../store/useWishlistStore";
import { useCartStore } from "../store/useCartStore";
import { useColorScheme } from "../hooks/useColorScheme";

const WishlistCard = ({ item }: { item: WishlistItem }) => {
  const { toggleWishlist } = useWishlistStore();
  const { addItem } = useCartStore();
  const { isDark } = useColorScheme();

  const handleAddToCart = () => {
    addItem({ ...item, quantity: 1 });
    // Optional: Show toast or feedback
  };

  return (
    <View className="flex-row items-center p-4 bg-white dark:bg-slate-900 rounded-3xl mb-4 shadow-sm border border-slate-100 dark:border-white/5">
      <View className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-2xl overflow-hidden mr-4">
        <Image 
          source={typeof item.image === 'string' ? { uri: item.image } : item.image} 
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      <View className="flex-1">
        <View className="flex-row justify-between items-start mb-1">
          <Text className="text-slate-900 dark:text-white font-ubuntu-bold text-base flex-1 mr-2" numberOfLines={2}>
            {item.name}
          </Text>
          <TouchableOpacity onPress={() => toggleWishlist(item)}>
            <Ionicons name="heart" size={24} color="#f43f5e" />
          </TouchableOpacity>
        </View>

        <Text className="text-slate-500 dark:text-slate-400 font-ubuntu text-sm mb-3">
          {item.category || "Item"}
        </Text>

        <View className="flex-row justify-between items-center">
          <Text className="text-primary font-ubuntu-bold text-lg">
            Ksh {item.price.toLocaleString()}
          </Text>

          <TouchableOpacity 
            onPress={handleAddToCart}
            className="bg-primary/10 dark:bg-primary/20 px-4 py-2 rounded-xl"
          >
            <Text className="text-primary font-ubuntu-bold text-xs uppercase">
              Add to Cart
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default function WishlistScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark } = useColorScheme();
  const { items } = useWishlistStore();

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950" style={{ paddingTop: insets.top }}>
      <View className="px-4 py-4 flex-row items-center justify-between bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-white/5">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="p-2 -ml-2"
        >
          <Ionicons name="arrow-back" size={24} color={isDark ? "#ffffff" : "#0f172a"} />
        </TouchableOpacity>
        <Text className="text-xl font-ubuntu-bold text-slate-900 dark:text-white">
          Wishlist
        </Text>
        <View className="w-10" />
      </View>

      <ScrollView 
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
      >
        {items.length > 0 ? (
          <>
            {items.map((item) => (
              <WishlistCard key={item.id} item={item} />
            ))}
            <View className="h-20" />
          </>
        ) : (
          <View className="flex-1 items-center justify-center pt-28">
            <View className="w-32 h-32 bg-slate-100 dark:bg-slate-900 rounded-full items-center justify-center mb-6">
              <Ionicons name="heart-outline" size={64} color="#94a3b8" />
            </View>
            <Text className="text-2xl font-ubuntu-bold text-slate-900 dark:text-white mb-2">
              Wishlist is empty
            </Text>
            <Text className="text-slate-500 dark:text-slate-400 font-ubuntu text-center px-10 mb-8 leading-6">
              Save items you love here to find them easily later.
            </Text>
            <TouchableOpacity 
              onPress={() => router.push("/shop")}
              className="bg-primary px-10 py-4 rounded-2xl shadow-lg shadow-primary/30"
            >
              <Text className="text-white font-ubuntu-bold text-base">Explore Shop</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
