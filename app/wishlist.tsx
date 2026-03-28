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
  };

  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center', padding: 16,
      backgroundColor: isDark ? '#0f172a' : '#ffffff',
      borderRadius: 24, marginBottom: 16,
      borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
    }}>
      {/* Image */}
      <View style={{
        width: 96, height: 96, borderRadius: 16, overflow: 'hidden',
        backgroundColor: isDark ? '#1e293b' : '#f8fafc', marginRight: 16,
      }}>
        <Image
          source={typeof item.image === 'string' ? { uri: item.image } : item.image}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
      </View>

      <View style={{ flex: 1 }}>
        {/* Name + unlike */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
          <Text
            numberOfLines={2}
            style={{ flex: 1, marginRight: 8, fontFamily: 'Ubuntu-Bold', fontSize: 14, color: isDark ? '#ffffff' : '#0f172a' }}
          >
            {item.name}
          </Text>
          <TouchableOpacity onPress={() => toggleWishlist(item)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="heart" size={22} color="#f43f5e" />
          </TouchableOpacity>
        </View>

        {/* Category */}
        <Text style={{ fontFamily: 'Ubuntu-Regular', fontSize: 12, color: isDark ? '#94a3b8' : '#64748b', marginBottom: 12 }}>
          {item.category || 'Item'}
        </Text>

        {/* Price + add to cart */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontFamily: 'Ubuntu-Bold', fontSize: 16, color: '#f97316' }}>
            KES {item.price.toLocaleString()}
          </Text>
          <TouchableOpacity
            onPress={handleAddToCart}
            style={{
              backgroundColor: isDark ? 'rgba(249,115,22,0.15)' : 'rgba(249,115,22,0.1)',
              paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12,
            }}
          >
            <Text style={{ fontFamily: 'Ubuntu-Bold', fontSize: 11, color: '#f97316', textTransform: 'uppercase' }}>
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
      <View className="px-6 py-5 flex-row items-center justify-between bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-white/5">
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
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {items.length > 0 ? (
          items.map((item) => (
            <WishlistCard key={item.id} item={item} />
          ))
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
