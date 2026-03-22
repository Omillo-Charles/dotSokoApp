import React from "react";
import { View, ScrollView } from "react-native";
import { Categories } from "@components/home/categories";
import { BannerCarousel } from "@components/home/BannerCarousel";

export default function HomeScreen() {
  return (
    <ScrollView 
      className="flex-1 bg-background"
      showsVerticalScrollIndicator={false}
    >
      {/* Categories Section */}
      <Categories />

      {/* Banner Carousel */}
      <BannerCarousel />

      {/* Bottom padding */}
      <View className="h-20" />
    </ScrollView>
  );
}