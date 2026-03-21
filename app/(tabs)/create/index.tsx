import React from "react";
import { View, Text } from "react-native";

export default function CreateScreen() {
  return (
    <View className="flex-1 bg-background items-center justify-center">
      <Text className="text-2xl font-ubuntu-bold text-foreground">Create New</Text>
      <Text className="text-muted-foreground font-ubuntu mt-2">Select an action to post</Text>
    </View>
  );
}
