import React from "react";
import { View, Text, SafeAreaView } from "react-native";

export default function ShopScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background items-center justify-center">
      <Text className="text-2xl font-ubuntu-bold text-foreground">Shop Explorer</Text>
      <Text className="text-muted-foreground font-ubuntu mt-2">Coming Soon</Text>
    </SafeAreaView>
  );
}
