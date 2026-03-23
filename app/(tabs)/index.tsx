import React from "react";
import { View, ScrollView } from "react-native";
import { Categories } from "@components/home/categories";
import { BannerCarousel } from "@components/home/BannerCarousel";

export default function HomeScreen() {
  return (
    <ScrollView
      className="flex-1 bg-white dark:bg-slate-950"
      showsVerticalScrollIndicator={false}
    >
      <Categories />
      <BannerCarousel />
      <View className="h-20" />
    </ScrollView>
  );
}