import React, { useState, useMemo } from "react";
import {
  View, Text, TouchableOpacity, ScrollView, Image,
  ActivityIndicator, Dimensions, Alert, Share
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ChevronLeft, Star, Share2, MapPin, Phone, Mail,
  ShoppingBag, Users, Info, ShoppingCart, MessageSquare, Heart
} from "lucide-react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useShop, useShopProducts, useShopReviews, useShopLists, useFollowShop } from "@/hooks/useShop";
import { useUser } from "@/hooks/useUser";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { GoldCheck } from "@/components/ui/CommonUI";

const { width } = Dimensions.get("window");

type SectionType = 'Products' | 'Reviews' | 'About' | 'Followers' | 'Following';

export default function ShopDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark } = useColorScheme();

  const [activeSection, setActiveSection] = useState<SectionType>('Products');

  const { data: shop, isLoading, error } = useShop(id as string);
  const { data: productsData = [], isLoading: isProductsLoading } = useShopProducts(id as string);
  const { data: reviewsData = [], isLoading: isReviewsLoading } = useShopReviews(id as string);
  const { data: listData = [], isLoading: isListsLoading } = useShopLists(id as string, activeSection as 'Followers' | 'Following');
  const followMutation = useFollowShop();
  const { user: currentUser } = useUser();
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const products = useMemo(() => {
    return (productsData || []).map((p: any) => ({
      ...p,
      _id: String(p._id || p.id || `product-${Math.random()}`),
    }));
  }, [productsData]);

  const isFollowing = (shop as any)?.isFollowing ?? false;

  const handleFollowToggle = async () => {
    if (!currentUser) {
      Alert.alert("Notice", "Please login to follow shops");
      return;
    }
    if (!shop?._id) return;
    try {
      await followMutation.mutateAsync(shop._id);
    } catch (err: any) {
      Alert.alert("Error", err.response?.data?.message || "Failed to toggle follow");
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(price);

  const handleShareShop = async () => {
    if (!shop) return;
    const shopId = shop._id || shop.id;
    const shopHandle = shop.username ? `@${shop.username}` : shop.name;
    const shopUrl = `https://dotsoko.com/shop/${shopId}`;
    
    try {
      await Share.share({
        title: `${shop.name} on .Soko`,
        message: `Check out ${shop.name} on .Soko!\n\n${shop.description || 'Quality products and great service'}\n\n${shopHandle}\n${products.length} products available\n\n${shopUrl}`,
        url: shopUrl,
      });
    } catch (err) {
      // User cancelled share
    }
  };

  const iconColor = isDark ? "#ffffff" : "#0f172a";
  const iconMuted = isDark ? "#94a3b8" : "#64748b";

  if (isLoading) {
    return (
      <View className="flex-1 bg-slate-50 dark:bg-slate-950 items-center justify-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (error || !shop) {
    return (
      <View className="flex-1 bg-slate-50 dark:bg-slate-950 items-center justify-center p-8">
        <Text className="text-2xl font-ubuntu-bold text-slate-900 dark:text-white mt-4 text-center">Oops!</Text>
        <Text className="text-slate-500 font-ubuntu mt-2 text-center mb-8">We couldn't find this shop.</Text>
        <TouchableOpacity onPress={() => router.back()} className="bg-slate-900 dark:bg-white px-8 py-3 rounded-full">
          <Text className="text-white dark:text-slate-900 font-ubuntu-bold">Back to Shop</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const tabs: SectionType[] = ['Products', 'Reviews', 'About', 'Followers', 'Following'];

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-4 py-4 flex-row items-center bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-white/5 z-30">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 mr-2">
          <ChevronLeft size={24} color={iconColor} />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-xl font-ubuntu-bold text-slate-900 dark:text-white" numberOfLines={1}>{shop.name}</Text>
          <Text className="text-xs font-ubuntu text-slate-500">{products.length} products</Text>
        </View>
        <TouchableOpacity className="p-2 -mr-2" onPress={handleShareShop}>
          <Share2 size={20} color={iconMuted} />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>

        {/* Banner */}
        <View className="h-36 bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
          {shop.banner ? (
            <Image source={{ uri: shop.banner }} className="w-full h-full" resizeMode="cover" />
          ) : (
            <View className="w-full h-full bg-gradient-to-b from-slate-300 to-slate-200 dark:from-slate-700 dark:to-slate-800" />
          )}
          <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.15)' }} />
        </View>

        {/* Profile Info Block */}
        <View className="bg-white dark:bg-slate-900 px-4 pb-4 border-b border-slate-100 dark:border-white/5">
          <View className="flex-row items-end justify-between" style={{ marginTop: -40 }}>
            {/* Avatar */}
            <View className="w-24 h-24 rounded-[1.5rem] border-4 border-white dark:border-slate-900 overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-md">
              <Image source={{ uri: shop.avatar || 'https://via.placeholder.com/150' }} className="w-full h-full" resizeMode="cover" />
            </View>
            {/* Actions */}
            <View className="flex-row items-center gap-2 pb-1">
              {currentUser && shop.owner !== currentUser._id && (
                <TouchableOpacity
                  onPress={handleFollowToggle}
                  disabled={followMutation.isPending}
                  className="px-5 py-2 rounded-full"
                  style={{
                    backgroundColor: isFollowing ? (isDark ? 'rgba(255,255,255,0.07)' : '#f1f5f9') : (isDark ? '#ffffff' : '#0f172a'),
                    opacity: followMutation.isPending ? 0.6 : 1
                  }}
                >
                  <Text className="text-xs font-ubuntu-bold"
                    style={{ color: isFollowing ? (isDark ? '#ffffff' : '#0f172a') : (isDark ? '#0f172a' : '#ffffff') }}>
                    {followMutation.isPending ? '...' : (isFollowing ? 'Following' : 'Follow')}
                  </Text>
                </TouchableOpacity>
              )}
              {!currentUser && (
                <TouchableOpacity onPress={() => Alert.alert("Notice", "Please login to follow")} className="px-5 py-2 rounded-full bg-slate-900 dark:bg-white">
                  <Text className="text-xs font-ubuntu-bold text-white dark:text-slate-900">Follow</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity className="p-2 rounded-full border border-slate-200 dark:border-slate-700">
                <Star size={16} color={iconMuted} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Name, Handle, Stats */}
          <View className="mt-3 space-y-1">
            <View className="flex-row items-center gap-1">
              <Text className="text-xl font-ubuntu-bold text-slate-900 dark:text-white">{shop.name}</Text>
              {shop.isVerified && <GoldCheck size={18} />}
            </View>
            <Text className="text-xs font-ubuntu text-slate-500">
              {shop.username ? `@${shop.username}` : `@${shop.name?.toLowerCase().replace(/\s+/g, '_')}`}
            </Text>
            <View className="flex-row items-center gap-4 mt-2">
              <TouchableOpacity onPress={() => setActiveSection('Followers')} className="items-center">
                <Text className="text-sm font-ubuntu-bold text-slate-900 dark:text-white">{shop.followersCount ?? shop.followers?.length ?? 0}</Text>
                <Text className="text-[10px] font-ubuntu text-slate-500">Followers</Text>
              </TouchableOpacity>
              <View className="w-px h-6 bg-slate-200 dark:bg-slate-700" />
              <TouchableOpacity onPress={() => setActiveSection('Following')} className="items-center">
                <Text className="text-sm font-ubuntu-bold text-slate-900 dark:text-white">{shop.followingCount ?? shop.following?.length ?? 0}</Text>
                <Text className="text-[10px] font-ubuntu text-slate-500">Following</Text>
              </TouchableOpacity>
              <View className="w-px h-6 bg-slate-200 dark:bg-slate-700" />
              <TouchableOpacity onPress={() => setActiveSection('Products')} className="items-center">
                <Text className="text-sm font-ubuntu-bold text-slate-900 dark:text-white">{products.length}</Text>
                <Text className="text-[10px] font-ubuntu text-slate-500">Products</Text>
              </TouchableOpacity>
              {(shop.rating || 0) > 0 && (
                <>
                  <View className="w-px h-6 bg-slate-200 dark:bg-slate-700" />
                  <View className="items-center">
                    <View className="flex-row items-center gap-0.5">
                      <Star size={12} color="#f59e0b" fill="#f59e0b" />
                      <Text className="text-sm font-ubuntu-bold text-slate-900 dark:text-white">{(shop.rating || 0).toFixed(1)}</Text>
                    </View>
                    <Text className="text-[10px] font-ubuntu text-slate-500">Rating</Text>
                  </View>
                </>
              )}
            </View>
          </View>

          {shop.description && (
            <Text className="text-xs font-ubuntu text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">{shop.description}</Text>
          )}
        </View>

        {/* Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-white/5">
          <View className="flex-row">
            {tabs.map((tab) => (
              <TouchableOpacity key={tab} onPress={() => setActiveSection(tab)}
                className="px-4 py-3 relative items-center justify-center">
                <Text className={`text-xs font-ubuntu-bold ${activeSection === tab ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>{tab}</Text>
                {activeSection === tab && (
                  <View className="absolute bottom-0 left-3 right-3 h-0.5 bg-slate-900 dark:bg-white rounded-t-full" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Section Content */}
        <View className="mt-2">

          {/* PRODUCTS */}
          {activeSection === 'Products' && (
            isProductsLoading ? (
              <ActivityIndicator size="large" color="#3b82f6" style={{ padding: 40 }} />
            ) : products.length === 0 ? (
              <View className="p-16 items-center">
                <ShoppingBag size={40} color="#cbd5e1" />
                <Text className="font-ubuntu-bold text-slate-900 dark:text-white mt-4">No products found</Text>
                <Text className="text-xs font-ubuntu text-slate-500 text-center mt-1">This shop hasn't posted any products yet.</Text>
              </View>
            ) : (
              <View className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5">
                {products.map((p: any, index: number) => (
                  <TouchableOpacity
                    key={p._id}
                    onPress={() => router.push(`/shop/product/${p._id}` as any)}
                    className={`p-4 flex-row gap-3 items-start ${index !== products.length - 1 ? 'border-b border-slate-100 dark:border-white/5' : ''}`}
                  >
                    <View className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <Image source={{ uri: p.image || p.images?.[0] }} className="w-full h-full" resizeMode="cover" />
                    </View>
                    <View className="flex-1 py-0.5">
                      <View className="flex-row items-center justify-between mb-1">
                        <Text className="text-[13px] font-ubuntu-bold text-slate-900 dark:text-white flex-1 mr-2" numberOfLines={1}>{p.name}</Text>
                        <Text className="text-xs font-ubuntu-bold text-slate-900 dark:text-white">{formatPrice(p.price)}</Text>
                      </View>
                      <Text className="text-[11px] font-ubuntu text-slate-500 dark:text-slate-400" numberOfLines={2}>{p.description}</Text>
                      <View className="flex-row items-center gap-3 mt-2">
                        <View className="flex-row items-center gap-1">
                          <Heart size={12} color={iconMuted} />
                          <Text className="text-[10px] font-ubuntu-bold text-slate-500">{p.likesCount || 0}</Text>
                        </View>
                        <View className="flex-row items-center gap-1">
                          <MessageSquare size={12} color={iconMuted} />
                          <Text className="text-[10px] font-ubuntu-bold text-slate-500">{p.commentsCount || 0}</Text>
                        </View>
                        {p.rating > 0 && (
                          <View className="flex-row items-center gap-1">
                            <Star size={12} color="#f59e0b" fill="#f59e0b" />
                            <Text className="text-[10px] font-ubuntu-bold text-amber-500">{p.rating}</Text>
                          </View>
                        )}
                        <TouchableOpacity
                          onPress={() => {
                            addItem({ id: p._id, name: p.name, price: p.price, image: p.image || p.images?.[0], quantity: 1, category: p.category || "" });
                            Alert.alert("Added", `${p.name} added to cart`);
                          }}
                          className="ml-auto p-1"
                        >
                          <ShoppingCart size={16} color={iconMuted} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )
          )}

          {/* REVIEWS */}
          {activeSection === 'Reviews' && (
            isReviewsLoading ? (
              <ActivityIndicator size="large" color="#3b82f6" style={{ padding: 40 }} />
            ) : reviewsData.length === 0 ? (
              <View className="p-16 items-center">
                <Star size={40} color="#cbd5e1" />
                <Text className="font-ubuntu-bold text-slate-900 dark:text-white mt-4">No reviews yet</Text>
                <Text className="text-xs font-ubuntu text-slate-500 text-center mt-1">Be the first to review this shop!</Text>
              </View>
            ) : (
              <View className="bg-white dark:bg-slate-900">
                {/* Rating summary */}
                <View className="p-5 flex-row items-center gap-4 border-b border-slate-100 dark:border-white/5">
                  <Text className="text-4xl font-ubuntu-bold text-slate-900 dark:text-white">{(shop.rating || 0).toFixed(1)}</Text>
                  <View>
                    <View className="flex-row gap-0.5 mb-1">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} size={14} color="#f59e0b" fill={(shop.rating || 0) >= i ? '#f59e0b' : 'transparent'} />
                      ))}
                    </View>
                    <Text className="text-xs font-ubuntu text-slate-500">Based on {shop.reviewsCount || reviewsData.length} reviews</Text>
                  </View>
                </View>
                {reviewsData.map((review: any) => (
                  <View key={review._id} className="p-4 border-b border-slate-100 dark:border-white/5">
                    <View className="flex-row items-center justify-between mb-3">
                      <View className="flex-row items-center gap-3">
                        <View className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                          <Image source={{ uri: review.user?.avatar || 'https://via.placeholder.com/150' }} className="w-full h-full" />
                        </View>
                        <View>
                          <Text className="text-sm font-ubuntu-bold text-slate-900 dark:text-white">{review.user?.name}</Text>
                          <Text className="text-[10px] font-ubuntu text-slate-500">{review.user?.username ? `@${review.user.username}` : 'Customer'}</Text>
                        </View>
                      </View>
                      <View className="items-end">
                        <View className="flex-row gap-0.5">
                          {[1,2,3,4,5].map(i => (
                            <Star key={i} size={11} color="#f59e0b" fill={review.rating >= i ? '#f59e0b' : 'transparent'} />
                          ))}
                        </View>
                        <Text className="text-[9px] font-ubuntu text-slate-400 mt-0.5">{new Date(review.createdAt).toLocaleDateString()}</Text>
                      </View>
                    </View>
                    {review.comment && (
                      <View className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-3 border border-slate-100 dark:border-slate-700">
                        <Text className="text-xs font-ubuntu text-slate-700 dark:text-slate-300 leading-relaxed">{review.comment}</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )
          )}

          {/* ABOUT */}
          {activeSection === 'About' && (
            <View className="p-4 gap-4">
              <View className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800">
                <Text className="text-[10px] font-ubuntu-bold text-slate-400 uppercase tracking-widest mb-3">About</Text>
                <Text className="text-sm font-ubuntu text-slate-700 dark:text-slate-300 leading-relaxed">
                  {shop.description || "No description provided."}
                </Text>
              </View>
              <View className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800">
                <Text className="text-[10px] font-ubuntu-bold text-slate-400 uppercase tracking-widest mb-4">Contact Details</Text>
                {shop.phone && (
                  <View className="flex-row items-center gap-3 mb-3">
                    <Phone size={16} color="#3b82f6" />
                    <Text className="text-sm font-ubuntu text-slate-700 dark:text-slate-300">{shop.phone}</Text>
                  </View>
                )}
                {shop.email && (
                  <View className="flex-row items-center gap-3 mb-3">
                    <Mail size={16} color="#3b82f6" />
                    <Text className="text-sm font-ubuntu text-slate-700 dark:text-slate-300">{shop.email}</Text>
                  </View>
                )}
                {shop.address && (
                  <View className="flex-row items-center gap-3">
                    <MapPin size={16} color="#3b82f6" />
                    <Text className="text-sm font-ubuntu text-slate-700 dark:text-slate-300">{shop.address}</Text>
                  </View>
                )}
              </View>
              <View className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800">
                <Text className="text-[10px] font-ubuntu-bold text-slate-400 uppercase tracking-widest mb-4">Store Stats</Text>
                <View className="gap-2.5">
                  {[
                    { label: 'Member Since', value: shop.createdAt ? new Date(shop.createdAt).toLocaleDateString() : 'N/A' },
                    { label: 'Total Products', value: products.length },
                    { label: 'Verified', value: shop.isVerified ? '✓ Yes' : 'No' },
                    { label: 'Reviews', value: shop.reviewsCount ?? reviewsData.length },
                  ].map(({ label, value }) => (
                    <View key={label} className="flex-row items-center justify-between">
                      <Text className="text-xs font-ubuntu text-slate-500">{label}</Text>
                      <Text className={`text-xs font-ubuntu-bold ${label === 'Verified' && shop.isVerified ? 'text-green-600' : 'text-slate-900 dark:text-white'}`}>{String(value)}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* FOLLOWERS / FOLLOWING */}
          {(activeSection === 'Followers' || activeSection === 'Following') && (
            isListsLoading ? (
              <ActivityIndicator size="large" color="#3b82f6" style={{ padding: 40 }} />
            ) : listData.length === 0 ? (
              <View className="p-16 items-center">
                <Users size={40} color="#cbd5e1" />
                <Text className="font-ubuntu-bold text-slate-900 dark:text-white mt-4">
                  {activeSection === 'Followers' ? 'No followers yet' : 'Not following anyone'}
                </Text>
              </View>
            ) : (
              <View className="bg-white dark:bg-slate-900">
                {listData.map((item: any) => (
                  <TouchableOpacity
                    key={item._id || item.id}
                    onPress={() => {
                      const sid = item.username ? `@${item.username}` : (item._id || item.id);
                      if (sid) router.push(`/shop/${sid}` as any);
                    }}
                    className="flex-row items-center justify-between p-4 border-b border-slate-100 dark:border-white/5"
                  >
                    <View className="flex-row items-center gap-3">
                      <View className="w-11 h-11 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <Image source={{ uri: item.avatar || 'https://via.placeholder.com/150' }} className="w-full h-full" />
                      </View>
                      <View>
                        <View className="flex-row items-center gap-1">
                          <Text className="text-sm font-ubuntu-bold text-slate-900 dark:text-white">{item.name || 'User'}</Text>
                          {item.isVerified && <GoldCheck size={13} />}
                        </View>
                        <Text className="text-[10px] font-ubuntu text-slate-500">
                          {item.username ? `@${item.username}` : `@${(item.name || 'user').toLowerCase().replace(/\s+/g, '_')}`}
                        </Text>
                      </View>
                    </View>
                    {activeSection === 'Following' && (
                      <View className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full">
                        <Text className="text-[10px] font-ubuntu-bold text-slate-700 dark:text-white">View Shop</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )
          )}
        </View>
      </ScrollView>
    </View>
  );
}
