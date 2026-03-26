import React from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, FlatList } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useColorScheme } from "../../hooks/useColorScheme";
import { CATEGORIES, Category } from "../../constants/categories";

const CategoryCard = ({ item }: { item: Category }) => {
  const { isDark } = useColorScheme();
  const IconComponent = item.iconFamily === "Ionicons" ? Ionicons : MaterialCommunityIcons;

  return (
    <Link href={item.href as any} asChild>
      <TouchableOpacity className="mr-4">
        <View className="w-40 h-40 rounded-[24px] overflow-hidden border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-900 shadow-sm">
          <Image
            source={item.image}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
          {/* Icon Badge */}
          <View className="absolute top-2.5 left-2.5 bg-white/90 dark:bg-slate-800/80 backdrop-blur-md p-2 rounded-xl border border-white/20 dark:border-white/10 shadow-sm">
            <IconComponent
              name={item.iconName as any}
              size={16}
              color={isDark ? "#f8fafc" : "#64748b"}
            />
          </View>
        </View>
        <View className="mt-2 px-1">
          <Text className="text-sm font-ubuntu-medium text-slate-900 dark:text-white" numberOfLines={1}>
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export const Categories = () => {
  return (
    <View className="py-6">
      <View className="flex-row items-center justify-between px-6 mb-4">
        <Text className="text-xl font-ubuntu-bold text-slate-900 dark:text-white">
          Shop by Category
        </Text>
        <Link href="/categories" asChild>
          <TouchableOpacity>
            <Text className="text-sm font-ubuntu-bold text-primary">See all</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <FlatList
        data={CATEGORIES}
        renderItem={({ item }) => <CategoryCard item={item} />}
        keyExtractor={(item) => item.value}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24 }}
        removeClippedSubviews={true}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={10}
      />
    </View>
  );
};
