import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from "@/hooks/useColorScheme";
import { useMyShop } from "@/hooks/useShop";
import { Star, MessageSquare, TrendingUp, TrendingDown, Minus } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import api from "@/lib/api";

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}

export default function CustomerReviewsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark } = useColorScheme();
  const { data: shop, isLoading: isShopLoading } = useMyShop();

  const [filter, setFilter] = useState<'all' | '5' | '4' | '3' | '2' | '1'>('all');

  const { data: reviewsData, isLoading: isReviewsLoading, refetch } = useQuery({
    queryKey: ['shop-reviews', shop?.id],
    queryFn: async () => {
      if (!shop?.id) return { data: [], total: 0 };
      const response = await api.get(`/shops/${shop.id}/reviews`);
      return response.data;
    },
    enabled: !!shop?.id,
  });

  const reviews: Review[] = reviewsData?.data || [];
  const isRefreshing = isShopLoading || isReviewsLoading;

  // Calculate rating distribution
  const ratingDistribution = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  };

  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : '0.0';

  // Filter reviews
  const filteredReviews = filter === 'all' 
    ? reviews 
    : reviews.filter(r => r.rating === parseInt(filter));

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  const renderStars = (rating: number, size: number = 16) => {
    return (
      <View className="flex-row">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            fill={star <= rating ? '#f59e0b' : 'transparent'}
            color={star <= rating ? '#f59e0b' : '#cbd5e1'}
          />
        ))}
      </View>
    );
  };

  const getRatingTrend = () => {
    if (reviews.length < 2) return null;
    
    const recentReviews = reviews.slice(0, Math.min(5, reviews.length));
    const olderReviews = reviews.slice(Math.min(5, reviews.length));
    
    if (olderReviews.length === 0) return null;
    
    const recentAvg = recentReviews.reduce((sum, r) => sum + r.rating, 0) / recentReviews.length;
    const olderAvg = olderReviews.reduce((sum, r) => sum + r.rating, 0) / olderReviews.length;
    
    const diff = recentAvg - olderAvg;
    
    if (Math.abs(diff) < 0.1) return { type: 'stable', value: 0 };
    if (diff > 0) return { type: 'up', value: diff };
    return { type: 'down', value: Math.abs(diff) };
  };

  const trend = getRatingTrend();

  if (isShopLoading) {
    return (
      <View className="flex-1 bg-slate-50 dark:bg-slate-950 items-center justify-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-4 py-4 flex-row items-center justify-between bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-white/5">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <Ionicons name="arrow-back" size={24} color={isDark ? "#ffffff" : "#0f172a"} />
        </TouchableOpacity>
        <Text className="text-xl font-ubuntu-bold text-slate-900 dark:text-white">Customer Reviews</Text>
        <View className="w-10" />
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refetch} />}
      >
        {/* Rating Overview */}
        <View className="bg-white dark:bg-slate-900 mx-4 mt-6 rounded-3xl p-6 border border-slate-100 dark:border-white/5 shadow-sm">
          <View className="flex-row items-center justify-between mb-6">
            <View className="items-center">
              <Text className="text-5xl font-ubuntu-bold text-slate-900 dark:text-white mb-2">
                {averageRating}
              </Text>
              {renderStars(parseFloat(averageRating), 20)}
              <Text className="text-slate-500 dark:text-slate-400 font-ubuntu text-sm mt-2">
                {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
              </Text>
            </View>

            {trend && (
              <View className={`px-4 py-2 rounded-xl ${
                trend.type === 'up' ? 'bg-green-100 dark:bg-green-900/30' :
                trend.type === 'down' ? 'bg-red-100 dark:bg-red-900/30' :
                'bg-slate-100 dark:bg-slate-800'
              }`}>
                <View className="flex-row items-center gap-1">
                  {trend.type === 'up' && <TrendingUp size={16} color="#10b981" />}
                  {trend.type === 'down' && <TrendingDown size={16} color="#ef4444" />}
                  {trend.type === 'stable' && <Minus size={16} color="#64748b" />}
                  <Text className={`font-ubuntu-bold text-sm ${
                    trend.type === 'up' ? 'text-green-600 dark:text-green-400' :
                    trend.type === 'down' ? 'text-red-600 dark:text-red-400' :
                    'text-slate-600 dark:text-slate-400'
                  }`}>
                    {trend.type === 'stable' ? 'Stable' : `${trend.value.toFixed(1)}`}
                  </Text>
                </View>
                <Text className="text-slate-500 dark:text-slate-400 font-ubuntu text-xs mt-0.5">
                  {trend.type === 'stable' ? 'No change' : 'Recent trend'}
                </Text>
              </View>
            )}
          </View>

          {/* Rating Distribution */}
          <View className="gap-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = ratingDistribution[rating as keyof typeof ratingDistribution];
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              
              return (
                <View key={rating} className="flex-row items-center gap-3">
                  <Text className="text-slate-600 dark:text-slate-400 font-ubuntu-bold text-sm w-8">
                    {rating} ★
                  </Text>
                  <View className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <View 
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </View>
                  <Text className="text-slate-500 dark:text-slate-400 font-ubuntu text-xs w-10 text-right">
                    {count}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Filter Tabs */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10, gap: 8 }}
        >
          <TouchableOpacity
            onPress={() => setFilter('all')}
            className={`px-4 py-1.5 rounded-lg ${
              filter === 'all' 
                ? 'bg-primary' 
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10'
            }`}
          >
            <Text className={`font-ubuntu-bold text-xs ${
              filter === 'all' ? 'text-white' : 'text-slate-600 dark:text-slate-400'
            }`}>
              All ({totalReviews})
            </Text>
          </TouchableOpacity>
          {[5, 4, 3, 2, 1].map((rating) => (
            <TouchableOpacity
              key={rating}
              onPress={() => setFilter(rating.toString() as any)}
              className={`px-4 py-1.5 rounded-lg flex-row items-center gap-1.5 ${
                filter === rating.toString()
                  ? 'bg-primary'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10'
              }`}
            >
              <Text className={`font-ubuntu-bold text-xs ${
                filter === rating.toString() ? 'text-white' : 'text-slate-600 dark:text-slate-400'
              }`}>
                {rating} ★ ({ratingDistribution[rating as keyof typeof ratingDistribution]})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Reviews List */}
        <View className="px-4 py-4 pb-6">
          {isReviewsLoading ? (
            <View className="py-20">
              <ActivityIndicator size="large" color="#3b82f6" />
            </View>
          ) : filteredReviews.length === 0 ? (
            <View className="bg-white dark:bg-slate-900 rounded-3xl p-12 items-center border border-slate-100 dark:border-white/5">
              <MessageSquare size={48} color="#cbd5e1" />
              <Text className="text-slate-900 dark:text-white font-ubuntu-bold text-lg mt-4">
                No reviews yet
              </Text>
              <Text className="text-slate-500 dark:text-slate-400 font-ubuntu text-center mt-2">
                {filter === 'all' 
                  ? 'Your shop hasn\'t received any reviews yet.'
                  : `No ${filter}-star reviews found.`}
              </Text>
            </View>
          ) : (
            <View className="gap-4">
              {filteredReviews.map((review) => (
                <View
                  key={review.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-white/5 shadow-sm"
                >
                  <View className="flex-row items-start justify-between mb-3">
                    <View className="flex-1">
                      <View className="flex-row items-center gap-2 mb-1">
                        <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center">
                          <Text className="text-primary font-ubuntu-bold text-sm">
                            {review.user.name.charAt(0).toUpperCase()}
                          </Text>
                        </View>
                        <View className="flex-1">
                          <Text className="text-slate-900 dark:text-white font-ubuntu-bold text-sm">
                            {review.user.name}
                          </Text>
                          <Text className="text-slate-500 dark:text-slate-400 font-ubuntu text-xs">
                            {formatDate(review.createdAt)}
                          </Text>
                        </View>
                      </View>
                    </View>
                    {renderStars(review.rating, 14)}
                  </View>

                  {review.comment && (
                    <Text className="text-slate-700 dark:text-slate-300 font-ubuntu text-sm leading-5">
                      {review.comment}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
