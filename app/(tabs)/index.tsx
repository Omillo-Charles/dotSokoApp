import React from "react";
import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import { Link } from "expo-router";
import { Categories } from "@components/home/categories";

export default function HomeScreen() {
  return (
    <ScrollView 
      className="flex-1 bg-background"
      showsVerticalScrollIndicator={false}
    >
      {/* Categories Section */}
      <Categories />

      {/* Additional space for bottom padding */}
      <View className="h-20" />
    </ScrollView>
  );
}