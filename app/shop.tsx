import React, { useState } from 'react';
import { View, Text, Pressable, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { Search, Plus, ShoppingBag } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '../hooks/useColorScheme';

export default function ShopScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isDark } = useColorScheme();
  const [activeTab, setActiveTab] = useState<'foryou' | 'following'>('foryou');

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950" style={{ paddingTop: insets.top }}>
      {/* Header matching Cart/Wishlist */}
      <View className="px-4 py-4 flex-row items-center bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-white/5">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="p-2 -ml-2 mr-2"
        >
          <Ionicons name="arrow-back" size={24} color={isDark ? "#ffffff" : "#0f172a"} />
        </TouchableOpacity>
        <Text className="text-xl font-ubuntu-bold text-slate-900 dark:text-white">
          Shop
        </Text>
      </View>

      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100, flexGrow: 1 }}
      >
        <View 
          className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/10 z-10 pt-2"
        >
          <View className="px-4 pt-1 mb-1 flex-row items-center justify-between">
            <Text className="text-2xl font-ubuntu-bold text-slate-900 dark:text-white tracking-tight">Explore</Text>
            <Pressable className="w-9 h-9 bg-slate-100 dark:bg-slate-800 rounded-full items-center justify-center">
              <Search size={18} color="#64748b" />
            </Pressable>
          </View>

          <View className="flex-row">
            <Pressable 
              onPress={() => setActiveTab('foryou')}
              className="flex-1 h-10 items-center justify-center"
            >
              <Text className={`font-ubuntu-medium text-sm ${activeTab === 'foryou' ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>For You</Text>
              {activeTab === 'foryou' && <View className="absolute bottom-0 w-16 h-1 bg-primary rounded-t-full" />}
            </Pressable>
            <Pressable 
              onPress={() => setActiveTab('following')}
              className="flex-1 h-10 items-center justify-center"
            >
              <Text className={`font-ubuntu-medium text-sm ${activeTab === 'following' ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>Following</Text>
              {activeTab === 'following' && <View className="absolute bottom-0 w-16 h-1 bg-primary rounded-t-full" />}
            </Pressable>
          </View>
        </View>

        {/* Empty State matching the web shop page */}
        <View className="flex-1 items-center justify-center p-8 mt-10">
          <View className="w-20 h-20 bg-slate-200 dark:bg-slate-800 rounded-[2rem] items-center justify-center mb-6">
            <ShoppingBag size={40} color="#94a3b8" />
          </View>
          <Text className="font-ubuntu-bold text-slate-900 dark:text-white text-lg uppercase tracking-tight text-center mb-2">
            No products yet
          </Text>
          <Text className="text-sm font-ubuntu text-slate-500 dark:text-slate-400 text-center leading-relaxed max-w-[280px]">
            Be the first to post something amazing in this category!
          </Text>
          <Pressable className="mt-8 px-8 py-3.5 bg-primary rounded-2xl">
            <Text className="text-white font-ubuntu-bold text-sm">Post a Product</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <Pressable 
        className="absolute bottom-6 right-6 z-40 bg-primary h-14 w-14 rounded-full items-center justify-center"
        style={Platform.OS === 'ios' ? { shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 } : {}}
      >
        <Ionicons name="add" size={24} color="#ffffff" />
      </Pressable>
    </View>
  );
}
