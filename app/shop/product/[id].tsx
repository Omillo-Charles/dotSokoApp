import React, { useState, useMemo, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert, Dimensions, Share } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft, Heart, Share2, Plus, Minus, ShieldCheck, Truck, ShoppingCart, MessageSquare, Star } from "lucide-react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { GoldCheck, ProductRating } from "@/components/ui/CommonUI";
import { requireAuth } from "@/lib/authGuard";

const screenWidth = Dimensions.get("window").width;
const MAX_IMAGE_HEIGHT = 520;

function useImageHeight(uri: string | undefined) {
  const containerWidth = screenWidth - 32;
  const [height, setHeight] = useState(containerWidth);

  useEffect(() => {
    if (!uri) return;
    Image.getSize(
      uri,
      (w, h) => {
        const ratio = h / w;
        setHeight(Math.min(Math.round(containerWidth * ratio), MAX_IMAGE_HEIGHT));
      },
      () => setHeight(containerWidth)
    );
  }, [uri]);

  return height;
}

function ProductMainImage({ uri, height, price, formatPrice, isDark }: {
  uri: string;
  height: number;
  price: number;
  formatPrice: (p: number) => string;
  isDark: boolean;
}) {
  const borderColor = isDark ? '#1e293b' : '#e2e8f0';
  const priceBg = isDark ? 'rgba(15,23,42,0.9)' : 'rgba(255,255,255,0.9)';
  const priceText = isDark ? '#ffffff' : '#0f172a';

  return (
    <View style={{
      borderRadius: 20,
      borderWidth: 1,
      borderColor,
      overflow: 'hidden',
      position: 'relative',
    }}>
      <Image
        source={{ uri }}
        style={{ width: '100%', height }}
        resizeMode="cover"
      />
      <View style={{
        position: 'absolute', bottom: 12, right: 12,
        backgroundColor: priceBg,
        paddingHorizontal: 12, paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor,
      }}>
        <Text style={{ fontSize: 11, fontFamily: 'Ubuntu-Bold', color: priceText }}>
          {formatPrice(price)}
        </Text>
      </View>
    </View>
  );
}

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark } = useColorScheme();

  const { data: product, isLoading, error } = useProduct(id as string);
  
  // Safe store access with lazy loading
  const [cartStore, setCartStore] = useState<any>(null);
  const [wishlistStore, setWishlistStore] = useState<any>(null);

  useEffect(() => {
    // Dynamically import stores after component mounts
    import("@/store/useCartStore").then(module => {
      setCartStore(module.useCartStore.getState());
    }).catch(err => console.error("Failed to load cart store:", err));

    import("@/store/useWishlistStore").then(module => {
      setWishlistStore(module.useWishlistStore.getState());
    }).catch(err => console.error("Failed to load wishlist store:", err));
  }, []);

  const { data: productsData, isLoading: isProductsLoading } = useProducts(
    product?.category ? { cat: product.category, limit: 13 } : { limit: 13 }
  );

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);

  const productImages = useMemo(() => {
    if (!product) return [];
    let media: string[] = [];
    if (product.variantOptions && product.variantOptions.length > 0) {
      media = [...media, ...product.variantOptions.map((v: any) => v.image)];
    } else if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      media = [...media, ...product.images];
    } else if (product.image) {
      media = [...media, product.image];
    }
    return media;
  }, [product]);

  const activeImageUri = productImages[activeImageIndex] || product?.image || '';
  const imageHeight = useImageHeight(activeImageUri);

  const recommendedProducts = useMemo(() => {
    if (!productsData || !product) return [];
    return productsData
      .filter((p: any) => (p._id || p.id) !== product._id)
      .slice(0, 12);
  }, [productsData, product]);

  // Check wishlist status
  useEffect(() => {
    if (wishlistStore && product) {
      const productId = product.id || product._id;
      setIsInWishlist(wishlistStore.items?.some((item: any) => item.id === productId) || false);
    }
  }, [wishlistStore, product]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(price);

  const handleAddToCart = async () => {
    if (!product) return;
    if (!(await requireAuth("add items to cart"))) return;
    if (product.sizes?.length > 0 && !selectedSize) {
      Alert.alert("Notice", "Please select a size");
      return;
    }
    
    if (!cartStore) {
      Alert.alert("Error", "Cart not available");
      return;
    }

    try {
      const currentImage = productImages[activeImageIndex] || product.image;
      const productData = {
        id: String(product.id || product._id),
        name: String(product.name || ""),
        price: Number(product.price) || 0,
        image: currentImage || null,
        quantity: Number(quantity) || 1,
        category: String(product.category || "")
      };
      
      cartStore.addItem(productData);
      Alert.alert("Success", "Added to Cart!");
    } catch (err) {
      console.error("Error adding to cart:", err);
      Alert.alert("Error", "Failed to add to cart");
    }
  };

  const handleToggleWishlist = async () => {
    if (!product) return;
    if (!(await requireAuth("save items to wishlist"))) return;
    
    if (!wishlistStore) {
      Alert.alert("Error", "Wishlist not available");
      return;
    }

    try {
      const productData = {
        id: String(product.id || product._id),
        name: String(product.name || ""),
        price: Number(product.price) || 0,
        image: product.image || null,
        category: String(product.category || "")
      };
      
      wishlistStore.toggleWishlist(productData);
      setIsInWishlist(!isInWishlist);
    } catch (err) {
      console.error("Error toggling wishlist:", err);
      Alert.alert("Error", "Failed to update wishlist");
    }
  };

  const handleShare = async () => {
    if (!product) return;
    const productId = product.id || product._id;
    try {
      await Share.share({
        title: product.name,
        message: `Check out ${product.name} on .Soko!\n\nKES ${Number(product.price).toLocaleString()}\n\nhttps://dotsoko.com/shop/product/${productId}`,
        url: `https://dotsoko.com/shop/product/${productId}`,
      });
    } catch (err) {
      // user cancelled
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-slate-50 dark:bg-slate-950 items-center justify-center">
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View className="flex-1 bg-slate-50 dark:bg-slate-950 items-center justify-center p-4">
        <Text className="text-2xl font-ubuntu-bold text-slate-900 dark:text-white mt-4 text-center">Oops!</Text>
        <Text className="text-slate-500 font-ubuntu mt-2 text-center">Product not found.</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-8 bg-slate-900 dark:bg-white px-8 py-3 rounded-full">
          <Text className="text-white dark:text-slate-900 font-ubuntu-bold">Back to Shop</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const iconColor = isDark ? "#ffffff" : "#0f172a";
  const iconMuted = isDark ? "#94a3b8" : "#64748b";

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950" style={{ paddingTop: insets.top }}>
      <View className="px-6 py-5 flex-row items-center bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-white/5 z-30">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 mr-2 rounded-full">
          <ChevronLeft size={24} color={iconColor} />
        </TouchableOpacity>
        <Text className="text-xl font-ubuntu-bold text-slate-900 dark:text-white flex-1" numberOfLines={1}>{product.name}</Text>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        <View className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm mb-12">

          {/* Shop Header */}
          <View className="p-5 flex-row items-center justify-between">
            <TouchableOpacity 
              className="flex-row items-center gap-3" 
              onPress={() => {
                const shopId = product.shop?.id || product.shop?._id;
                if (shopId) router.push(`/shop/${shopId}` as any);
              }}
            >
              <View className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700">
                <Image source={{ uri: product.shop?.avatar || 'https://via.placeholder.com/150' }} className="w-full h-full" />
              </View>
              <View>
                <View className="flex-row items-center gap-1">
                  <Text className="text-[13px] font-ubuntu-bold text-slate-900 dark:text-white">{product.shop?.name || "Official Store"}</Text>
                  {product.shop?.isVerified && <GoldCheck size={14} />}
                </View>
                <Text className="text-[8px] font-ubuntu-bold text-slate-400 uppercase tracking-wider mt-0.5">Visit Shop</Text>
              </View>
            </TouchableOpacity>
            <View className="flex-row items-center gap-2">
              <TouchableOpacity
                onPress={handleToggleWishlist}
                className="p-1.5 rounded-full"
                style={{ backgroundColor: isInWishlist ? 'rgba(236, 72, 153, 0.1)' : 'transparent' }}
              >
                <Heart size={16} color={isInWishlist ? "#ec4899" : iconMuted} fill={isInWishlist ? "#ec4899" : "transparent"} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleShare} className="p-1.5 rounded-full">
                <Share2 size={16} color={iconMuted} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Photo Section */}
          <View style={{ paddingHorizontal: 16, paddingVertical: 8, gap: 12 }}>
            <ProductMainImage
              uri={activeImageUri}
              height={imageHeight}
              price={product.price}
              formatPrice={formatPrice}
              isDark={isDark}
            />

            {productImages.length > 1 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingBottom: 8 }}>
                {productImages.map((src, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => setActiveImageIndex(idx)}
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 12,
                      overflow: 'hidden',
                      borderWidth: 2,
                      borderColor: activeImageIndex === idx
                        ? (isDark ? '#ffffff' : '#0f172a')
                        : (isDark ? '#1e293b' : '#e2e8f0'),
                    }}
                  >
                    <Image
                      source={{ uri: src }}
                      style={{ width: '100%', height: '100%' }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

          {/* Description & Info Section */}
          <View className="p-5">
            <Text className="text-xl font-ubuntu-bold text-slate-900 dark:text-white leading-tight mb-2">{product.name}</Text>
            <Text className="text-[13px] font-ubuntu-medium text-slate-500 dark:text-slate-400 mb-6">{product.description}</Text>

            <ProductRating productId={product._id} initialRating={product.rating} initialReviewsCount={product.reviewsCount} />

            <View className="gap-y-6 mt-4">
              {product.sizes && product.sizes.length > 0 && (
                <View>
                  <Text className="text-[10px] font-ubuntu-bold text-slate-400 uppercase tracking-[0.1em] ml-1 mb-2">Select Size</Text>
                  <View className="flex-row flex-wrap gap-2">
                    {product.sizes.map((size: string) => (
                      <TouchableOpacity
                        key={size}
                        onPress={() => setSelectedSize(size)}
                        className="px-4 py-2 rounded-xl border"
                        style={{
                          backgroundColor: selectedSize === size ? (isDark ? '#3b82f6' : '#0f172a') : 'transparent',
                          borderColor: selectedSize === size ? (isDark ? '#3b82f6' : '#0f172a') : (isDark ? '#334155' : '#e2e8f0')
                        }}
                      >
                        <Text className={`font-ubuntu-bold text-xs ${selectedSize === size ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{size}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {product.variantOptions && product.variantOptions.length > 1 && (
                <View>
                  <Text className="text-[10px] font-ubuntu-bold text-slate-400 uppercase tracking-[0.1em] ml-1 mb-2">Select Variation</Text>
                  <View className="flex-row flex-wrap gap-2">
                    {product.variantOptions.map((variant: any, index: number) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => setActiveImageIndex(index)}
                        className="px-4 py-2 rounded-xl border"
                        style={{
                          backgroundColor: activeImageIndex === index ? (isDark ? '#3b82f6' : '#0f172a') : 'transparent',
                          borderColor: activeImageIndex === index ? (isDark ? '#3b82f6' : '#0f172a') : (isDark ? '#334155' : '#e2e8f0')
                        }}
                      >
                        <Text className={`font-ubuntu-bold text-xs ${activeImageIndex === index ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{variant.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              <View className="flex-row items-center justify-between bg-slate-50 dark:bg-slate-800 rounded-xl p-3 border border-slate-200 dark:border-slate-700">
                <Text className="text-[10px] font-ubuntu-bold text-slate-900 dark:text-white uppercase tracking-[0.1em]">Select Quantity</Text>
                <View className="flex-row items-center bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                  <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))} className="p-2"><Minus size={14} color={iconMuted} /></TouchableOpacity>
                  <Text className="w-8 text-center text-xs font-ubuntu-bold text-slate-900 dark:text-white">{quantity}</Text>
                  <TouchableOpacity onPress={() => setQuantity(quantity + 1)} className="p-2"><Plus size={14} color={iconMuted} /></TouchableOpacity>
                </View>
              </View>

              <View className="mt-2">
                <TouchableOpacity onPress={handleAddToCart} className="w-full bg-slate-900 dark:bg-white h-12 rounded-xl flex-row items-center justify-center gap-2 shadow-sm">
                  <ShoppingCart size={16} color={isDark ? "#0f172a" : "#ffffff"} />
                  <Text className="font-ubuntu-bold text-white dark:text-slate-900 text-xs">Add to Cart — {formatPrice(product.price * quantity)}</Text>
                </TouchableOpacity>
                <View className="flex-row items-center justify-center gap-5 mt-4">
                  <View className="flex-row items-center gap-1.5"><ShieldCheck size={12} color={iconMuted} /><Text className="text-[8px] font-ubuntu-bold text-slate-400 uppercase tracking-widest">Secure</Text></View>
                  <View className="flex-row items-center gap-1.5"><Truck size={12} color={iconMuted} /><Text className="text-[8px] font-ubuntu-bold text-slate-400 uppercase tracking-widest">Delivery</Text></View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Recommended Products */}
        <View>
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-ubuntu-bold text-slate-900 dark:text-white">Recommended for You</Text>
            <TouchableOpacity onPress={() => router.push("/shop" as any)}>
              <Text className="text-xs font-ubuntu-bold text-primary">View All</Text>
            </TouchableOpacity>
          </View>

          <View className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] overflow-hidden shadow-sm">
            {isProductsLoading ? (
              <View className="p-8 items-center gap-3">
                {[1, 2, 3].map(i => (
                  <View key={i} className="w-full h-24 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
                ))}
              </View>
            ) : recommendedProducts.length > 0 ? (
              recommendedProducts.map((p: any, index: number) => {
                const pid = p._id || p.id;
                const img = p.image || p.images?.[0];
                return (
                  <TouchableOpacity
                    key={pid}
                    onPress={() => router.push(`/shop/product/${pid}` as any)}
                    style={{
                      padding: 16,
                      flexDirection: 'row',
                      gap: 16,
                      alignItems: 'flex-start',
                      borderBottomWidth: index !== recommendedProducts.length - 1 ? 1 : 0,
                      borderBottomColor: isDark ? '#1e293b' : '#f1f5f9',
                    }}
                  >
                    <View style={{
                      width: 96,
                      borderRadius: 16,
                      overflow: 'hidden',
                      borderWidth: 1,
                      borderColor: isDark ? '#1e293b' : '#e2e8f0',
                      flexShrink: 0,
                      backgroundColor: isDark ? '#020617' : '#f8fafc',
                    }}>
                      <Image
                        source={{ uri: img }}
                        style={{ width: '100%', aspectRatio: 1 }}
                        resizeMode="cover"
                      />
                    </View>

                    <View style={{ flex: 1, minWidth: 0, paddingVertical: 2 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 2 }}>
                        <Text
                          className="font-ubuntu-bold text-slate-900 dark:text-white"
                          style={{ fontSize: 13, flex: 1 }}
                          numberOfLines={1}
                        >
                          {p.name}
                        </Text>
                        <Text className="font-ubuntu-bold text-primary" style={{ fontSize: 12, flexShrink: 0 }}>
                          {formatPrice(p.price)}
                        </Text>
                      </View>

                      <Text
                        className="font-ubuntu-medium text-slate-500 dark:text-slate-400"
                        style={{ fontSize: 11, marginBottom: 8 }}
                        numberOfLines={2}
                      >
                        {p.description}
                      </Text>

                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                          <Heart size={12} color={iconMuted} />
                          <Text className="font-ubuntu-bold text-slate-500" style={{ fontSize: 10 }}>{p.likesCount || 0}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                          <MessageSquare size={12} color={iconMuted} />
                          <Text className="font-ubuntu-bold text-slate-500" style={{ fontSize: 10 }}>{p.commentsCount || 0}</Text>
                        </View>
                        {p.rating > 0 && (
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <Star size={12} color="#f59e0b" fill="#f59e0b" />
                            <Text className="font-ubuntu-bold text-amber-500" style={{ fontSize: 10 }}>{p.rating}</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })
            ) : (
              <View className="p-12 items-center">
                <Text className="text-sm font-ubuntu-medium text-slate-500 italic">No similar products</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
