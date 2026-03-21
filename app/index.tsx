import { Text, View, TouchableOpacity } from "react-native";
import { Link } from "expo-router";

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
        <Link href="/login" asChild>
          <TouchableOpacity className="mt-6 px-10 py-4 rounded-full bg-secondary shadow-lg shadow-secondary/30">
            <Text className="text-secondary-foreground font-ubuntu-bold text-lg">
              Get Started
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}