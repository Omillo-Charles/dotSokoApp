import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { CATEGORIES, Category } from "../../../constants/categories";
import { useColorScheme } from "../../../hooks/useColorScheme";

const { width } = Dimensions.get("window");
const COLUMN_WIDTH = (width - 48) / 2; // px-6 is 24 on each side

const CategoryListItem = ({ item }: { item: Category }) => {
  const { isDark } = useColorScheme();
  const router = useRouter();
  const IconComponent = item.iconFamily === "Ionicons" ? Ionicons : MaterialCommunityIcons;

  return (
    <TouchableOpacity
      onPress={() => router.push(item.href as any)}
      style={{ width: COLUMN_WIDTH }}
      className="mb-6 bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden border border-slate-100 dark:border-white/5 shadow-sm"
    >
      <View className="relative aspect-square">
        <Image
          source={item.image}
          className="w-full h-full"
          resizeMode="cover"
        />
        <View className="absolute inset-0 bg-black/20" />

        {/* Icon Badge */}
        <View className="absolute top-3 left-3 bg-white/90 dark:bg-slate-800/80 backdrop-blur-md p-2.5 rounded-2xl border border-white/20 dark:border-white/10">
          <IconComponent
            name={item.iconName as any}
            size={20}
            color={isDark ? "#f8fafc" : "#64748b"}
          />
        </View>

        {/* Name Overlay */}
        <View className="absolute bottom-4 left-4 right-4">
          <Text className="text-white font-ubuntu-bold text-lg leading-tight shadow-sm">
            {item.name}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function CategoriesScreen() {
  const { isDark } = useColorScheme();
  const router = useRouter();

  return (
    <View className="flex-1 bg-white dark:bg-slate-950">
      {/* Custom Header within Screen if needed, but we have the global Header */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 20, paddingBottom: 100 }}
      >
        <View className="mb-6 px-1.5">
          <Text className="text-3xl font-ubuntu-bold text-slate-900 dark:text-white tracking-tight">
            Explore
          </Text>
          <Text className="text-base font-ubuntu text-slate-500 dark:text-slate-400 mt-1">
            Browse all {CATEGORIES.length} available categories
          </Text>
        </View>

        <View className="flex-row flex-wrap justify-between">
          {CATEGORIES.map((category) => (
            <CategoryListItem key={category.value} item={category} />
          ))}
        </View>

        {/* CTA Section */}
        <View className="mt-8 p-8 rounded-[40px] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 items-center">
          <View className="w-12 h-12 rounded-full bg-primary/10 dark:bg-primary/20 items-center justify-center mb-4">
            <Ionicons name="search" size={24} color="#3b82f6" />
          </View>

          <Text className="text-2xl font-ubuntu-bold text-slate-900 dark:text-white text-center mb-2">
            Not seeing what you are looking for?
          </Text>

          <Text className="text-sm font-ubuntu text-slate-500 dark:text-slate-400 text-center mb-8 px-4">
            Explore our full collection of products or get in touch with us for assistance.
          </Text>

          <View className="w-full">
            <TouchableOpacity
              className="w-full bg-primary py-4 rounded-2xl flex-row items-center justify-center shadow-lg shadow-primary/25 mb-4"
              onPress={() => router.push("/shop" as any)}
            >
              <Ionicons name="bag-handle" size={20} color="white" className="mr-2" />
              <Text className="text-white font-ubuntu-bold text-base ml-2">Browse All Products</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="w-full bg-white dark:bg-slate-800 py-4 rounded-2xl flex-row items-center justify-center border border-slate-100 dark:border-white/10"
              onPress={() => router.push("/contact" as any)}
            >
              <Ionicons name="chatbubble-ellipses" size={20} color={isDark ? "#f8fafc" : "#64748b"} className="mr-2" />
              <Text className="text-slate-900 dark:text-white font-ubuntu-bold text-base ml-2">Contact Us</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
