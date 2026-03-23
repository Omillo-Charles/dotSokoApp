import React from "react";
import { View, ScrollView } from "react-native";
import { Categories } from "@components/home/categories";
import { BannerCarousel } from "@components/home/BannerCarousel";
import { FeaturedProducts } from "@components/home/FeaturedProducts";

export default function HomeScreen() {
  return (
    <ScrollView
      className="flex-1 bg-white dark:bg-slate-950"
      showsVerticalScrollIndicator={false}
    >
      <Categories />
      <FeaturedProducts />
      <BannerCarousel />
      <View className="h-20" />
    </ScrollView>
  );
}