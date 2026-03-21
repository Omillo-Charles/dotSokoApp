import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { ShoppingBag } from 'lucide-react-native';

export default function DealsScreen() {
  const [activeTab, setActiveTab] = useState<'foryou' | 'following'>('foryou');

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950">
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100, flexGrow: 1 }}
      >
        <View 
          className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/10 z-10 pt-2"
        >
          <View className="px-4 pt-1 mb-1 flex-row items-center justify-between">
            <Text className="text-2xl font-ubuntu-bold text-slate-900 dark:text-white tracking-tight">Deals</Text>
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

        {/* Empty State matching the web deals page */}
        <View className="flex-1 items-center justify-center p-8 mt-10">
          <View className="w-20 h-20 bg-slate-200 dark:bg-slate-800 rounded-[2rem] items-center justify-center mb-6">
            <ShoppingBag size={40} color="#94a3b8" />
          </View>
          <Text className="font-ubuntu-bold text-slate-900 dark:text-white text-lg uppercase tracking-tight text-center mb-2">
            No deals yet
          </Text>
          <Text className="text-sm font-ubuntu text-slate-500 dark:text-slate-400 text-center leading-relaxed max-w-[280px]">
            We're currently working on bringing you the best deals. Check back soon!
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
