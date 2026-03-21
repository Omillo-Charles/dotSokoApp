import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const MenuItem = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <TouchableOpacity className="flex-row items-center gap-4 p-4 border-b border-border">
    <View className="w-10 h-10 rounded-xl bg-muted items-center justify-center">
      {icon}
    </View>
    <Text className="text-base font-ubuntu-medium text-foreground">{label}</Text>
  </TouchableOpacity>
);

export default function MoreModal() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-black/50 justify-end">
      <Pressable className="absolute inset-0" onPress={() => router.back()} />
      <View className="bg-background rounded-t-[32px] p-6 pb-12 shadow-2xl">
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-2xl font-ubuntu-bold text-foreground">More</Text>
          <TouchableOpacity 
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center rounded-full bg-muted"
          >
            <Ionicons name="close" size={24} color="#64748b" />
          </TouchableOpacity>
        </View>
        
        <ScrollView showsVerticalScrollIndicator={false}>
          <MenuItem icon={<Ionicons name="information-circle-outline" size={22} color="#64748b" />} label="About Us" />
          <MenuItem icon={<Ionicons name="mail-outline" size={22} color="#64748b" />} label="Contact" />
          <MenuItem icon={<Ionicons name="ribbon-outline" size={22} color="#f59e0b" />} label="Premium" />
          <MenuItem icon={<Ionicons name="shield-checkmark-outline" size={22} color="#64748b" />} label="Privacy Policy" />
          <MenuItem icon={<Ionicons name="document-text-outline" size={22} color="#64748b" />} label="Terms of Service" />
          <MenuItem icon={<Ionicons name="eye-outline" size={22} color="#64748b" />} label="Cookie Policy" />
          <MenuItem icon={<Ionicons name="help-circle-outline" size={22} color="#64748b" />} label="Help Center" />
        </ScrollView>
      </View>
    </View>
  );
}
