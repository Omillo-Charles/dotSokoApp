import React from "react";
import { View, Text, TouchableOpacity, Share, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ImageCarousel } from "@/components/media/ImageCarousel";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CONTENT_WIDTH = SCREEN_WIDTH - 92; // 16 (left p) + 48 (avatar) + 12 (mr) + 16 (right p)

interface ProductCardProps {
  product: any;
  onAddToCart?: (product: any) => void;
  onToggleWishlist?: (product: any) => void;
  isInWishlist?: boolean;
}

export const ProductCard = ({ 
  product, 
  onAddToCart, 
  onToggleWishlist, 
  isInWishlist = false 
}: ProductCardProps) => {
  const router = useRouter();
  const { isDark } = useColorScheme();
  
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${product.name} on .Soko! Only KES ${product.price?.toLocaleString()}`,
        url: `https://dotsoko.com/shop/product/${product._id || product.id}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const productPrice = product.price || 0;
  const productImages = product.images || (product.image ? [product.image] : []);
  const shopName = product.shop?.name || product.vendor?.name || "Unknown Shop";
  const shopAvatar = product.shop?.avatar || product.vendor?.avatar || "https://ik.imagekit.io/omytech/defaultAvatar.jpeg";
  const time = product.time || (product.createdAt ? new Date(product.createdAt).toLocaleDateString() : "Now");

  return (
    <View 
      className="p-4 border-b border-slate-100 dark:border-white/5 bg-white dark:bg-slate-950"
    >
      <View className="flex-row">
        {/* Left Column: Avatar */}
        <TouchableOpacity 
          className="mr-3"
          onPress={() => router.push(`/shop/${product.shop?._id || product.shop?.id}` as any)}
        >
          <View className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10">
            <ImageCarousel 
              images={[shopAvatar]} 
              width={48}
              maxHeight={48}
            />
          </View>
        </TouchableOpacity>

        {/* Right Column: Content */}
        <View className="flex-1 min-w-0">
          {/* Header row + Info (Wrapped in Touchable for Detail Access) */}
          <TouchableOpacity 
            activeOpacity={0.7}
            onPress={() => router.push(`/shop/product/${product._id || product.id}` as any)}
          >
            {/* Header row */}
            <View className="flex-row items-center justify-between mb-0.5">
              <View className="flex-row items-center flex-1 pr-2">
                <Text 
                  numberOfLines={1} 
                  className="text-slate-900 dark:text-white font-ubuntu-bold text-[14px] tracking-tight"
                >
                  {shopName}
                </Text>
                {(product.shop?.isVerified || product.vendor?.verified) && (
                  <Ionicons name="checkmark-circle" size={14} color="#f97316" style={{ marginLeft: 3 }} />
                )}
                {product.shop?.username && (
                  <Text numberOfLines={1} className="text-slate-500 dark:text-slate-400 font-ubuntu text-xs ml-1 flex-shrink">
                    @{product.shop.username}
                  </Text>
                )}
                <Text className="text-slate-500 dark:text-slate-400 font-ubuntu text-xs"> · {time}</Text>
              </View>
              <View className="p-1">
                <Ionicons name="ellipsis-horizontal" size={16} color={isDark ? "#94a3b8" : "#64748b"} />
              </View>
            </View>

            {/* Product Info */}
            <Text className="text-slate-800 dark:text-slate-200 font-ubuntu text-[13px] leading-5 mb-2">
              {product.description || product.content}
            </Text>
          </TouchableOpacity>

          {/* Product Media (Carousel) */}
          {productImages.length > 0 && (
            <View className="relative mb-3">
              <ImageCarousel 
                images={productImages} 
                width={CONTENT_WIDTH}
                maxHeight={Math.min(CONTENT_WIDTH * 1.25, 450)} // Dynamic height logic
                alt={product.name}
                onPress={() => router.push(`/shop/product/${product._id || product.id}` as any)}
              />
              
              {/* Floating Price Tag */}
              <View className="absolute bottom-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm">
                <Text className="text-primary font-ubuntu-bold text-xs uppercase">
                  KES {productPrice.toLocaleString()}
                </Text>
                {product.averageRating > 0 && (
                  <View className="flex-row items-center mt-0.5">
                    <Ionicons name="star" size={10} color="#fbbf24" />
                    <Text className="text-[10px] font-ubuntu-bold text-amber-600 ml-1">
                      {product.averageRating.toFixed(1)}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Actions Bar (Twitter Style) */}
          <View className="flex-row items-center justify-between mt-1 max-w-[280px]">
            {/* Comment */}
            <TouchableOpacity 
              className="flex-row items-center pr-3 py-1"
              onPress={() => router.push(`/shop/product/${product._id || product.id}` as any)}
            >
              <Ionicons name="chatbubble-outline" size={18} color={isDark ? "#94a3b8" : "#64748b"} />
              <Text className="ml-1 text-slate-500 dark:text-slate-400 font-ubuntu-medium text-[11px]">
                {product.commentsCount || 0}
              </Text>
            </TouchableOpacity>

            {/* Repost */}
            <TouchableOpacity className="flex-row items-center pr-3 py-1">
              <Ionicons name="repeat-outline" size={18} color={isDark ? "#94a3b8" : "#64748b"} />
              <Text className="ml-1 text-slate-500 dark:text-slate-400 font-ubuntu-medium text-[11px]">
                {product.reposts || 0}
              </Text>
            </TouchableOpacity>

            {/* Like */}
            <TouchableOpacity 
              className="flex-row items-center pr-3 py-1"
              onPress={() => onToggleWishlist?.(product)}
            >
              <Ionicons 
                name={isInWishlist ? "heart" : "heart-outline"} 
                size={18} 
                color={isInWishlist ? "#f43f5e" : (isDark ? "#94a3b8" : "#64748b")} 
              />
              <Text className="ml-1 text-slate-500 dark:text-slate-400 font-ubuntu-medium text-[11px]">
                {product.likesCount || 0}
              </Text>
            </TouchableOpacity>

            {/* Cart (Direct Buy) */}
            <TouchableOpacity 
              className="p-1"
              onPress={() => onAddToCart?.(product)}
            >
              <Ionicons name="cart-outline" size={20} color={isDark ? "#94a3b8" : "#64748b"} />
            </TouchableOpacity>

            {/* Share */}
            <TouchableOpacity 
              className="p-1"
              onPress={handleShare}
            >
              <Ionicons name="share-outline" size={18} color={isDark ? "#94a3b8" : "#64748b"} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};
