import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { Star, BadgeCheck } from "lucide-react-native";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/hooks/useUser";
import api from "@/lib/api";

export const GoldCheck = ({ size = 20 }: { size?: number }) => {
  return (
    <BadgeCheck size={size} color="#fbbf24" fill="#fef3c7" />
  );
};

interface ProductRatingProps {
  productId: string;
  initialRating?: number;
  initialReviewsCount?: number;
  onRatingUpdate?: (newRating: number, newCount: number) => void;
}

export const ProductRating = ({ 
  productId, 
  initialRating = 0, 
  initialReviewsCount = 0,
  onRatingUpdate 
}: ProductRatingProps) => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [selectedRating, setSelectedRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRate = async (rating: number) => {
    if (!user) {
      Alert.alert("Error", "Please login to rate this product");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post(`/products/${productId}/rate`, { rating });
      
      if (response.data.success) {
        // Alert.alert("Success", "Thank you for your rating!");
        setSelectedRating(rating);
        
        queryClient.invalidateQueries({ queryKey: ['product', productId] });
        queryClient.invalidateQueries({ queryKey: ['products'] });

        if (onRatingUpdate) {
          onRatingUpdate(response.data.data.rating, response.data.data.reviewsCount);
        }
      }
    } catch (error: any) {
      console.error("Error rating product:", error);
      Alert.alert("Error", error.response?.data?.message || "Failed to submit rating.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="space-y-4 py-6 border-t border-slate-200 dark:border-slate-800">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-sm font-ubuntu-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Product Rating
        </Text>
        <View className="flex-row items-center gap-1.5 bg-amber-500/10 px-2.5 py-1 rounded-full">
          <Star size={14} color="#f59e0b" fill="#f59e0b" />
          <Text className="text-xs font-ubuntu-bold text-amber-600 dark:text-amber-400">
            {initialRating.toFixed(1)}
          </Text>
          <Text className="text-[10px] font-ubuntu-bold text-amber-600/60 dark:text-amber-400/60 ml-0.5">
            ({initialReviewsCount})
          </Text>
        </View>
      </View>

      <View className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 items-center justify-center border border-slate-200 dark:border-slate-800">
        <Text className="text-sm font-ubuntu-bold text-slate-500 dark:text-slate-400 mb-4">
          How would you rate this product?
        </Text>
        
        <View className="flex-row items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              disabled={isSubmitting}
              onPress={() => handleRate(star)}
              className="p-1"
            >
              <Star
                size={32}
                color={selectedRating >= star ? "#fbbf24" : "#cbd5e1"}
                fill={selectedRating >= star ? "#fbbf24" : "transparent"}
              />
            </TouchableOpacity>
          ))}
        </View>

        {isSubmitting && (
          <View className="flex-row items-center gap-2 mt-4">
            <ActivityIndicator size="small" color="#0f172a" />
            <Text className="text-xs font-ubuntu-bold text-slate-900 dark:text-white uppercase tracking-widest">
              Submitting...
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};
