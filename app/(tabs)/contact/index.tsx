import React from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "../../../hooks/useColorScheme";

export default function ContactScreen() {
  const { isDark } = useColorScheme();
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 }}
      >
        <TouchableOpacity 
          onPress={() => router.back()}
          className="mb-8"
        >
          <Ionicons name="chevron-back" size={28} color={isDark ? "#ffffff" : "#0f172a"} />
        </TouchableOpacity>

        <View className="mb-10">
          <Text className="text-4xl font-ubuntu-bold text-slate-900 dark:text-white tracking-tight">
            Get in Touch
          </Text>
          <Text className="text-lg font-ubuntu text-slate-500 dark:text-slate-400 mt-2">
            We're here to help you find exactly what you're looking for.
          </Text>
        </View>

        <View className="space-y-6">
          <View>
            <Text className="text-sm font-ubuntu-bold text-slate-900 dark:text-white mb-2 ml-1">Your Message</Text>
            <View className="bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-white/5 p-4 h-40">
              <TextInput
                placeholder="How can we help you today?"
                placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
                multiline
                textAlignVertical="top"
                className="flex-1 font-ubuntu text-slate-900 dark:text-white"
              />
            </View>
          </View>

          <TouchableOpacity className="w-full bg-primary py-4 rounded-2xl items-center justify-center shadow-lg shadow-primary/25">
            <Text className="text-white font-ubuntu-bold text-lg">Send Message</Text>
          </TouchableOpacity>
        </View>

        <View className="mt-12 space-y-4">
          <View className="flex-row items-center space-x-4 bg-slate-50 dark:bg-slate-900 p-5 rounded-[24px] border border-slate-100 dark:border-white/5">
            <View className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 items-center justify-center">
              <Ionicons name="mail" size={20} color="#3b82f6" />
            </View>
            <View className="ml-4">
              <Text className="text-xs font-ubuntu text-slate-500 dark:text-slate-400">Email Us</Text>
              <Text className="text-base font-ubuntu-medium text-slate-900 dark:text-white">support@dotsoko.com</Text>
            </View>
          </View>

          <View className="flex-row items-center space-x-4 bg-slate-50 dark:bg-slate-900 p-5 rounded-[24px] border border-slate-100 dark:border-white/5">
            <View className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 items-center justify-center">
              <Ionicons name="call" size={20} color="#22c55e" />
            </View>
            <View className="ml-4">
              <Text className="text-xs font-ubuntu text-slate-500 dark:text-slate-400">Call Us</Text>
              <Text className="text-base font-ubuntu-medium text-slate-900 dark:text-white">+254 700 000 000</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
