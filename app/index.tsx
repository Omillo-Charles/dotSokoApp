import { Text, View } from "react-native";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <View className="p-8 rounded-3xl bg-brand-soft-blue border border-border items-center">
        <Text className="text-2xl font-ubuntu-bold text-primary mb-2">
          .Soko Marketplace
        </Text>
        <Text className="text-base font-ubuntu text-muted-foreground text-center">
          Multivendor Platform
        </Text>
        <View className="mt-6 px-6 py-3 rounded-full bg-secondary">
          <Text className="text-secondary-foreground font-ubuntu-medium">
            Get Started
          </Text>
        </View>
      </View>
    </View>
  );
}