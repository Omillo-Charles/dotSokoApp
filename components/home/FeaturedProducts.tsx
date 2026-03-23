import React from "react";
import { View, Text, TouchableOpacity, Dimensions, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { usePersonalizedFeed } from "@/hooks/useProducts";
import { useColorScheme } from "nativewind";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2; // px-4 (16*2) + gap-4 (16) = 48

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
    return null; // hide the section if no products or error
  }

  return (
    <View className="flex-1 w-full bg-slate-50 dark:bg-slate-900 mt-2 pb-6">
      <View className="px-4 py-4 flex-row justify-between items-center bg-transparent">
        <Text className="text-xl md:text-2xl font-ubuntu-bold text-slate-900 dark:text-white">
          For You
        </Text>
        <TouchableOpacity className="flex-row items-center" onPress={() => router.push("/shop" as any)}>
          <Text className="text-primary font-ubuntu-medium text-sm mr-1">View All</Text>
          <Ionicons name="chevron-forward" size={16} color="#f97316" />
        </TouchableOpacity>
      </View>
      
      <View className="flex-row flex-wrap justify-between px-4">
        {products.map((p: any) => {
          const id = p._id || p.id;
          const imageSrc = p.image || (p.images?.length > 0 ? p.images[0] : "https://ik.imagekit.io/omytech/d8f07aa0-f9cc-4e8c-859a-1c7ec2ffc0e8");
          const rating = p.averageRating || p.rating || 0;
          const price = p.price || 0;
          const isWishlisted = false; // Add actual logic if wishlists exist

          return (
            <View 
              key={id} 
              style={{ width: CARD_WIDTH }}
              className="mb-4 bg-white dark:bg-slate-950 rounded-[20px] border border-slate-200 dark:border-white/10 overflow-hidden"
            >
              {/* Image Container */}
              <TouchableOpacity 
                activeOpacity={0.8}
                onPress={() => router.push(`/shop/product/${id}` as any)}
                className="relative w-full aspect-square bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-white/10"
              >
                <Image
                  source={{ uri: imageSrc }}
                  style={{ width: '100%', height: '100%' }}
                  contentFit="cover"
                  transition={200}
                />
                
                {/* Wishlist Heart */}
                <TouchableOpacity className="absolute top-2 right-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-full p-2 shadow-sm">
                  <Ionicons 
                    name={isWishlisted ? "heart" : "heart-outline"} 
                    size={16} 
                    color={isWishlisted ? "#ec4899" : (isDark ? "#cbd5e1" : "#64748b")} 
                  />
                </TouchableOpacity>

                {/* Add to Cart */}
                <TouchableOpacity className="absolute top-2 left-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-full p-2 shadow-sm">
                  <Ionicons 
                    name="cart-outline" 
                    size={16} 
                    color={isDark ? "#f8fafc" : "#0f172a"} 
                  />
                </TouchableOpacity>
              </TouchableOpacity>

              {/* Content Container */}
              <View className="p-3 flex-1">
                {/* Rating */}
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

                {/* Title */}
                <TouchableOpacity onPress={() => router.push(`/shop/product/${id}` as any)}>
                  <Text numberOfLines={1} className="font-ubuntu-bold text-slate-900 dark:text-white text-sm">
                    {p.name || "Untitled Product"}
                  </Text>
                </TouchableOpacity>

                {/* Description */}
                <Text numberOfLines={2} className="text-xs text-slate-500 dark:text-slate-400 font-ubuntu-medium mt-1 min-h-[32px]">
                  {p.description || "No description"}
                </Text>

                {/* Price & Action */}
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
        })}
      </View>
    </View>
  );
};
