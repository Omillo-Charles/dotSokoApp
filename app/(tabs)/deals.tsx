import React from "react";
import { View, Text, SafeAreaView } from "react-native";

export default function DealsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background items-center justify-center">
      <Text className="text-2xl font-ubuntu-bold text-foreground">Special Deals</Text>
      <Text className="text-muted-foreground font-ubuntu mt-2">Exclusive offers for you</Text>
    </SafeAreaView>
  );
}
