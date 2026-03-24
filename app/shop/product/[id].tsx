import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator, Dimensions, Alert, TextInput } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft, Heart, Share2, Plus, Minus, ShieldCheck, Truck, ShoppingCart, MessageSquare, Star, Trash2 } from "lucide-react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { useComments } from "@/hooks/useComments";
import { useUser } from "@/hooks/useUser";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { GoldCheck, ProductRating } from "@/components/ui/CommonUI";

const { width } = Dimensions.get("window");

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark } = useColorScheme();

  const { data: product, isLoading, error } = useProduct(id as string);
  const { comments, isLoading: isCommentsLoading, deleteComment, createComment } = useComments(id as string);
  const { user: currentUser } = useUser();
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const { data: productsData, isLoading: isProductsLoading } = useProducts(
    product?.category ? { cat: product.category, limit: 11 } : { limit: 11 }
  );

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [commentText, setCommentText] = useState("");

  const recommendedProducts = useMemo(() => {
    if (!productsData || !product) return [];
    return productsData.filter((p: any) => p._id !== product._id).slice(0, 10);
  }, [productsData, product]);

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(price);
  };

  const handleAddToCart = () => {
    if (!product) return;
    if (product.sizes?.length > 0 && !selectedSize) {
      Alert.alert("Notice", "Please select a size");
      return;
    }
    const currentImage = productImages[activeImageIndex] || product.image;
    addItem({ id: product._id, name: product.name, price: product.price, image: currentImage, quantity, category: product.category });
    Alert.alert("Success", "Added to Cart!");
  };

  const handlePostComment = () => {
    if (!currentUser) return Alert.alert("Notice", "Please login to comment");
    if (!commentText.trim()) return;
    createComment({ productId: product._id, content: commentText.trim() });
    setCommentText("");
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-slate-50 dark:bg-slate-950 items-center justify-center">
        <ActivityIndicator size="large" color="#0f172a" />
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

  const inWishlist = isInWishlist(product._id);
  const iconColor = isDark ? "#ffffff" : "#0f172a";
  const iconMuted = isDark ? "#94a3b8" : "#64748b";

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950">
      <View style={{ paddingTop: insets.top }} className="px-4 py-4 flex-row items-center bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-white/5 z-30">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 mr-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
          <ChevronLeft size={24} color={iconColor} />
        </TouchableOpacity>
        <Text className="text-xl font-ubuntu-bold text-slate-900 dark:text-white flex-1" numberOfLines={1}>{product.name}</Text>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        {/* Main Product Info Card */}
        <View className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm mb-12">
          
          {/* Shop Header */}
          <View className="p-5 flex-row items-center justify-between">
            <TouchableOpacity className="flex-row items-center gap-3" onPress={() => {}}>
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
              <TouchableOpacity onPress={() => toggleWishlist({ id: product._id, name: product.name, price: product.price, image: product.image })} className="p-1.5 rounded-full" style={{ backgroundColor: inWishlist ? 'rgba(236, 72, 153, 0.1)' : 'transparent' }}>
                <Heart size={16} color={inWishlist ? "#ec4899" : iconMuted} fill={inWishlist ? "#ec4899" : "transparent"} />
              </TouchableOpacity>
              <TouchableOpacity className="p-1.5 rounded-full">
                <Share2 size={16} color={iconMuted} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Photo Section */}
          <View className="px-4 py-2 space-y-4">
            <View className="rounded-[1.25rem] border border-slate-200 dark:border-slate-800 overflow-hidden relative">
              <Image source={{ uri: productImages[activeImageIndex] || product.image }} style={{ width: '100%', height: width - 80 }} resizeMode="cover" />
              <View className="absolute bottom-3 right-3 bg-white/90 dark:bg-slate-900/90 px-3 py-1.5 rounded-[1rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                <Text className="text-xs font-ubuntu-bold text-slate-900 dark:text-white">{formatPrice(product.price)}</Text>
              </View>
            </View>
            {productImages.length > 1 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingBottom: 8 }}>
                {productImages.map((src, idx) => (
                  <TouchableOpacity 
                    key={idx} 
                    onPress={() => setActiveImageIndex(idx)} 
                    className="w-20 h-20 rounded-xl overflow-hidden border-2"
                    style={{ 
                      borderColor: activeImageIndex === idx 
                        ? (isDark ? '#ffffff' : '#0f172a') 
                        : (isDark ? '#1e293b' : '#e2e8f0'),
                      shadowOpacity: activeImageIndex === idx ? 0.05 : 0,
                      shadowRadius: 2,
                      shadowOffset: { width: 0, height: 1 }
                    }}>
                    <Image source={{ uri: src }} className="w-full h-full" resizeMode="contain" />
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
                        }}>
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
                         }}>
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
                  <View className="flex-row items-center gap-1.5"><ShieldCheck size={12} color={iconMuted}/><Text className="text-[8px] font-ubuntu-bold text-slate-400 uppercase tracking-widest">Secure</Text></View>
                  <View className="flex-row items-center gap-1.5"><Truck size={12} color={iconMuted}/><Text className="text-[8px] font-ubuntu-bold text-slate-400 uppercase tracking-widest">Delivery</Text></View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Comments Section */}
        <View className="mb-12">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-lg font-ubuntu-bold text-slate-900 dark:text-white">Community Feedback</Text>
              <Text className="text-xs font-ubuntu-bold text-slate-500 mt-0.5">{comments?.length || 0} comments</Text>
            </View>
          </View>
          
          <View className="gap-3">
            {isCommentsLoading ? (
              <ActivityIndicator size="small" />
            ) : comments?.length > 0 ? (
              comments.map((comment: any) => (
                <View key={comment._id} className="bg-slate-200/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
                  <View className="flex-row items-center gap-2.5 mb-2">
                    <View className="w-7 h-7 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
                      <Image source={{ uri: comment.user?.avatar || 'https://via.placeholder.com/150' }} className="w-full h-full" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs font-ubuntu-bold text-slate-900 dark:text-white">{comment.user?.name}</Text>
                      <Text className="text-[9px] font-ubuntu-bold text-slate-500">{new Date(comment.createdAt).toLocaleDateString()}</Text>
                    </View>
                    {currentUser && currentUser._id === comment.user?._id && (
                      <TouchableOpacity onPress={() => deleteComment(comment._id)} className="p-1">
                        <Trash2 size={14} color="#ef4444" />
                      </TouchableOpacity>
                    )}
                  </View>
                  <Text className="text-xs font-ubuntu-medium text-slate-600 dark:text-slate-300 leading-relaxed">{comment.content}</Text>
                </View>
              ))
            ) : (
              <View className="py-10 items-center bg-slate-100 dark:bg-slate-900 rounded-[1.5rem] border border-dashed border-slate-300 dark:border-slate-700">
                <Text className="text-[11px] font-ubuntu-bold text-slate-500">No comments yet. Be the first!</Text>
              </View>
            )}
            
            {/* Minimal Add Comment */}
            {currentUser ? (
              <View className="flex-row items-center gap-2 mt-2">
                 <TextInput value={commentText} onChangeText={setCommentText} placeholder="Write a comment..." placeholderTextColor={iconMuted} className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs font-ubuntu text-slate-900 dark:text-white" />
                 <TouchableOpacity onPress={handlePostComment} className="bg-slate-900 dark:bg-white p-2.5 rounded-xl">
                    <Plus size={16} color={isDark ? "#0f172a" : "#fff"} />
                 </TouchableOpacity>
              </View>
            ) : (
               <Text className="text-xs font-ubuntu text-slate-400 mt-2 text-center">Login to comment</Text>
            )}
          </View>
        </View>

        {/* Recommended for You */}
        <View>
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-ubuntu-bold text-slate-900 dark:text-white">Recommended for You</Text>
            <TouchableOpacity onPress={() => router.push("/shop")}><Text className="text-xs font-ubuntu-bold text-amber-500 hover:underline">View All</Text></TouchableOpacity>
          </View>
          <View className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] overflow-hidden shadow-sm">
            {isProductsLoading ? (
              <ActivityIndicator size="small" style={{ padding: 20 }} />
            ) : recommendedProducts.length > 0 ? (
              recommendedProducts.map((p: any, index: number) => (
                <TouchableOpacity key={p._id} onPress={() => router.push(`/shop/product/${p._id}`)} className={`p-4 flex-row gap-4 items-start ${index !== recommendedProducts.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''}`}>
                  <View className="w-24 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-950 items-center justify-center">
                    <Image source={{ uri: p.image }} style={{ width: '100%', aspectRatio: 1 }} resizeMode="cover" />
                  </View>
                  <View className="flex-1 justify-between py-0.5">
                    <View>
                      <View className="flex-row items-center justify-between mb-1">
                        <Text className="text-[13px] font-ubuntu-bold text-slate-900 dark:text-white flex-1 mr-2" numberOfLines={1}>{p.name}</Text>
                        <Text className="text-xs font-ubuntu-bold text-slate-900 dark:text-white">{formatPrice(p.price)}</Text>
                      </View>
                      <Text className="text-[11px] font-ubuntu-medium text-slate-500 dark:text-slate-400" numberOfLines={2}>{p.description}</Text>
                    </View>
                    <View className="flex-row items-center gap-3 mt-2">
                       <View className="flex-row items-center gap-1"><Heart size={12} color={iconMuted}/> <Text className="text-[10px] font-ubuntu-bold text-slate-500">{p.likesCount || 0}</Text></View>
                       <View className="flex-row items-center gap-1"><MessageSquare size={12} color={iconMuted}/> <Text className="text-[10px] font-ubuntu-bold text-slate-500">{p.commentsCount || 0}</Text></View>
                       {p.rating > 0 && <View className="flex-row items-center gap-1"><Star size={12} color="#f59e0b" fill="#f59e0b"/> <Text className="text-[10px] font-ubuntu-bold text-amber-500">{p.rating}</Text></View>}
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View className="p-8 items-center"><Text className="text-sm font-ubuntu-medium text-slate-500 italic">No similar products</Text></View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}


