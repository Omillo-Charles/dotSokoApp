import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Dimensions, Animated, Modal, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ImageCarousel } from "@/components/media/ImageCarousel";
import { Image } from "expo-image";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { CommentsModal } from "@/components/modals/CommentsModal";
import { requireAuth } from "@/lib/authGuard";
import { useFollowShop, useRateShop } from "@/hooks/useShop";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CONTENT_WIDTH = SCREEN_WIDTH - 92;

interface ProductCardProps {
  product: any;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const router = useRouter();
  const { isDark } = useColorScheme();
  const { addItem, items: cartItems } = useCartStore();
  const { toggleWishlist, items: wishlistItems, _hasHydrated } = useWishlistStore();

  const productId = product._id || product.id;
  const shopId = product.shop?.id || product.shop?._id;

  // ── Comments modal ──────────────────────────────────────────────────────────
  const [commentsOpen, setCommentsOpen] = useState(false);

  // Close modals on unmount to prevent stale state crashes during navigation
  useEffect(() => {
    return () => {
      setCommentsOpen(false);
      setShopActionsOpen(false);
    };
  }, []);

  // ── Shop actions modal ──────────────────────────────────────────────────────
  const [shopActionsOpen, setShopActionsOpen] = useState(false);
  const [pendingRating, setPendingRating] = useState(0);
  const [showRating, setShowRating] = useState(false);

  const followMutation = useFollowShop();
  const rateMutation = useRateShop();

  const handleFollowShop = async () => {
    if (!(await requireAuth("follow shops"))) return;
    if (!shopId) return;
    followMutation.mutate(shopId, {
      onSuccess: () => Alert.alert("Done", "Shop follow status updated."),
      onError: (err: any) => Alert.alert("Error", err?.response?.data?.message || "Failed to update follow"),
    });
  };

  const handleRateShop = async () => {
    if (!(await requireAuth("rate shops"))) return;
    if (!shopId || pendingRating === 0) return;
    rateMutation.mutate({ shopId, rating: pendingRating }, {
      onSuccess: () => {
        Alert.alert("Thanks!", `You rated ${product.shop?.name || "this shop"} ${pendingRating} star${pendingRating > 1 ? "s" : ""}.`);
        setShowRating(false);
        setPendingRating(0);
        setShopActionsOpen(false);
      },
      onError: (err: any) => Alert.alert("Error", err?.response?.data?.message || "Failed to submit rating"),
    });
  };
  const isInCart = cartItems.some((item) => item.id === productId);
  const [justAdded, setJustAdded] = useState(false);

  // Read wishlist state directly from items array — avoids calling a function
  // during render before hydration completes
  const liked = _hasHydrated && wishlistItems.some((item) => item.id === productId);

  const handleAddToCart = async () => {
    if (!(await requireAuth("add items to cart"))) return;
    addItem({
      id: productId,
      name: product.name,
      price: product.price || 0,
      image: product.images?.[0] || product.image || null,
      category: product.category || "",
      quantity: 1,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  // ── Like / wishlist state ───────────────────────────────────────────────────

  // Heart scale animation
  const heartScale = useRef(new Animated.Value(1)).current;

  const handleLike = async () => {
    if (!(await requireAuth("save items to wishlist"))) return;
    Animated.sequence([
      Animated.spring(heartScale, { toValue: 1.4, useNativeDriver: true, speed: 50 }),
      Animated.spring(heartScale, { toValue: 1, useNativeDriver: true, speed: 30 }),
    ]).start();

    toggleWishlist({
      id: productId,
      name: product.name,
      price: product.price || 0,
      image: product.images?.[0] || product.image || null,
      category: product.category || "",
    });
  };

  // ── Derived display values ──────────────────────────────────────────────────
  const productPrice = product.price || 0;
  const productImages = product.images || (product.image ? [product.image] : []);
  const shopName = product.shop?.name || product.vendor?.name || "Unknown Shop";
  const shopAvatar = product.shop?.avatar || product.vendor?.avatar || "https://ik.imagekit.io/omytech/defaultAvatar.jpeg";
  const time = product.time || (product.createdAt ? new Date(product.createdAt).toLocaleDateString() : "Now");

  const cartIconColor = justAdded || isInCart ? "#f97316" : (isDark ? "#94a3b8" : "#64748b");
  const cartIconName = justAdded || isInCart ? "cart" : "cart-outline";

  return (
    <>
      <View 
        className="p-4 border-b border-slate-100 dark:border-white/5 bg-white dark:bg-slate-950"
      >
      <View className="flex-row">
        {/* Left Column: Avatar */}
        <TouchableOpacity 
          className="mr-3"
          onPress={() => {
            setCommentsOpen(false);
            setShopActionsOpen(false);
            router.push(`/shop/${product.shop?._id || product.shop?.id}` as any);
          }}
        >
          <View className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10">
            <Image 
              source={shopAvatar} 
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
              transition={200}
              cachePolicy="disk"
            />
          </View>
        </TouchableOpacity>

        {/* Right Column: Content */}
        <View className="flex-1 min-w-0">
          {/* Header row - NOT clickable */}
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
            <TouchableOpacity
              onPress={() => setShopActionsOpen(true)}
              className="p-1"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="ellipsis-horizontal" size={16} color={isDark ? "#94a3b8" : "#64748b"} />
            </TouchableOpacity>
          </View>

          {/* Product Info - Clickable for product details */}
          <TouchableOpacity 
            activeOpacity={0.7}
            onPress={() => {
              setCommentsOpen(false);
              setShopActionsOpen(false);
              router.push(`/shop/product/${product._id || product.id}` as any);
            }}
          >
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
            {/* Comment — opens modal */}
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 12, paddingVertical: 4 }}
              onPress={() => setCommentsOpen(true)}
              activeOpacity={0.7}
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

            {/* Like / Wishlist — fills for current user, no count */}
            <TouchableOpacity
              style={{ paddingRight: 12, paddingVertical: 4 }}
              onPress={handleLike}
              activeOpacity={0.7}
            >
              <Animated.View style={{ transform: [{ scale: heartScale }] }}>
                <Ionicons
                  name={liked ? "heart" : "heart-outline"}
                  size={18}
                  color={liked ? "#f43f5e" : (isDark ? "#94a3b8" : "#64748b")}
                />
              </Animated.View>
            </TouchableOpacity>

            {/* Cart */}
            <TouchableOpacity
              className="p-1"
              onPress={handleAddToCart}
              activeOpacity={0.7}
            >
              <Ionicons name={cartIconName} size={20} color={cartIconColor} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>

    <CommentsModal
      visible={commentsOpen}
      onClose={() => setCommentsOpen(false)}
      productId={productId}
      productName={product.name}
      initialCount={product.commentsCount || 0}
    />

    {/* Shop Actions Modal */}
    <Modal
      visible={shopActionsOpen}
      transparent
      animationType="fade"
      onRequestClose={() => { setShopActionsOpen(false); setShowRating(false); setPendingRating(0); }}
    >
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "flex-end" }}
        activeOpacity={1}
        onPress={() => { setShopActionsOpen(false); setShowRating(false); setPendingRating(0); }}
      >
        <TouchableOpacity activeOpacity={1} onPress={() => {}}>
          <View style={{
            backgroundColor: isDark ? "#0f172a" : "#ffffff",
            borderTopLeftRadius: 24, borderTopRightRadius: 24,
            paddingTop: 8, paddingBottom: 36, paddingHorizontal: 20,
          }}>
            {/* Handle */}
            <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: isDark ? "#334155" : "#e2e8f0", alignSelf: "center", marginBottom: 16 }} />

            {/* Shop info */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9" }}>
              <View style={{ width: 44, height: 44, borderRadius: 22, overflow: "hidden", backgroundColor: isDark ? "#1e293b" : "#f1f5f9" }}>
                <Image source={product.shop?.avatar || "https://ik.imagekit.io/omytech/defaultAvatar.jpeg"} style={{ width: "100%", height: "100%" }} contentFit="cover" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 14, color: isDark ? "#ffffff" : "#0f172a" }}>
                  {product.shop?.name || "Shop"}
                </Text>
                {product.shop?.username && (
                  <Text style={{ fontFamily: "Ubuntu-Regular", fontSize: 12, color: isDark ? "#64748b" : "#94a3b8" }}>
                    @{product.shop.username}
                  </Text>
                )}
              </View>
            </View>

            {!showRating ? (
              <View style={{ gap: 10 }}>
                {/* Follow */}
                <TouchableOpacity
                  onPress={handleFollowShop}
                  disabled={followMutation.isPending}
                  style={{
                    flexDirection: "row", alignItems: "center", gap: 14,
                    padding: 16, borderRadius: 16,
                    backgroundColor: isDark ? "#1e293b" : "#f8fafc",
                    borderWidth: 1, borderColor: isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9",
                  }}
                >
                  <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: "rgba(59,130,246,0.12)", alignItems: "center", justifyContent: "center" }}>
                    {followMutation.isPending
                      ? <ActivityIndicator size="small" color="#3b82f6" />
                      : <Ionicons name="person-add-outline" size={18} color="#3b82f6" />
                    }
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 14, color: isDark ? "#ffffff" : "#0f172a" }}>Follow Shop</Text>
                    <Text style={{ fontFamily: "Ubuntu-Regular", fontSize: 12, color: isDark ? "#64748b" : "#94a3b8", marginTop: 1 }}>
                      Get updates from {product.shop?.name || "this shop"}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={isDark ? "#334155" : "#cbd5e1"} />
                </TouchableOpacity>

                {/* Rate */}
                <TouchableOpacity
                  onPress={() => setShowRating(true)}
                  style={{
                    flexDirection: "row", alignItems: "center", gap: 14,
                    padding: 16, borderRadius: 16,
                    backgroundColor: isDark ? "#1e293b" : "#f8fafc",
                    borderWidth: 1, borderColor: isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9",
                  }}
                >
                  <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: "rgba(245,158,11,0.12)", alignItems: "center", justifyContent: "center" }}>
                    <Ionicons name="star-outline" size={18} color="#f59e0b" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 14, color: isDark ? "#ffffff" : "#0f172a" }}>Rate Shop</Text>
                    <Text style={{ fontFamily: "Ubuntu-Regular", fontSize: 12, color: isDark ? "#64748b" : "#94a3b8", marginTop: 1 }}>
                      Share your experience
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={isDark ? "#334155" : "#cbd5e1"} />
                </TouchableOpacity>

                {/* View shop */}
                <TouchableOpacity
                  onPress={() => { setShopActionsOpen(false); router.push(`/shop/${shopId}` as any); }}
                  style={{
                    flexDirection: "row", alignItems: "center", gap: 14,
                    padding: 16, borderRadius: 16,
                    backgroundColor: isDark ? "#1e293b" : "#f8fafc",
                    borderWidth: 1, borderColor: isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9",
                  }}
                >
                  <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: "rgba(249,115,22,0.12)", alignItems: "center", justifyContent: "center" }}>
                    <Ionicons name="storefront-outline" size={18} color="#f97316" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 14, color: isDark ? "#ffffff" : "#0f172a" }}>View Shop</Text>
                    <Text style={{ fontFamily: "Ubuntu-Regular", fontSize: 12, color: isDark ? "#64748b" : "#94a3b8", marginTop: 1 }}>
                      See all products from this shop
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={isDark ? "#334155" : "#cbd5e1"} />
                </TouchableOpacity>
              </View>
            ) : (
              /* Rating picker */
              <View>
                <TouchableOpacity onPress={() => { setShowRating(false); setPendingRating(0); }} style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 16 }}>
                  <Ionicons name="arrow-back" size={16} color={isDark ? "#94a3b8" : "#64748b"} />
                  <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 13, color: isDark ? "#94a3b8" : "#64748b" }}>Back</Text>
                </TouchableOpacity>

                <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 15, color: isDark ? "#ffffff" : "#0f172a", marginBottom: 6 }}>
                  Rate {product.shop?.name || "this shop"}
                </Text>
                <Text style={{ fontFamily: "Ubuntu-Regular", fontSize: 13, color: isDark ? "#64748b" : "#94a3b8", marginBottom: 20 }}>
                  Tap a star to select your rating
                </Text>

                {/* Stars */}
                <View style={{ flexDirection: "row", justifyContent: "center", gap: 12, marginBottom: 24 }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity key={star} onPress={() => setPendingRating(star)} activeOpacity={0.7}>
                      <Ionicons
                        name={pendingRating >= star ? "star" : "star-outline"}
                        size={36}
                        color={pendingRating >= star ? "#f59e0b" : (isDark ? "#334155" : "#cbd5e1")}
                      />
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity
                  onPress={handleRateShop}
                  disabled={pendingRating === 0 || rateMutation.isPending}
                  style={{
                    height: 52, borderRadius: 16,
                    backgroundColor: pendingRating > 0 ? "#f59e0b" : (isDark ? "#1e293b" : "#e2e8f0"),
                    alignItems: "center", justifyContent: "center",
                    flexDirection: "row", gap: 8,
                  }}
                >
                  {rateMutation.isPending
                    ? <ActivityIndicator size="small" color="#ffffff" />
                    : <Ionicons name="star" size={18} color={pendingRating > 0 ? "#ffffff" : (isDark ? "#475569" : "#94a3b8")} />
                  }
                  <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 14, color: pendingRating > 0 ? "#ffffff" : (isDark ? "#475569" : "#94a3b8") }}>
                    {rateMutation.isPending ? "Submitting..." : `Submit ${pendingRating > 0 ? `${pendingRating} Star${pendingRating > 1 ? "s" : ""}` : "Rating"}`}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
    </>
  );
};
