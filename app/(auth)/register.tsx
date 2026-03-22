import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { SocialAuth } from "@components/auth/socialAuth";
import { useColorScheme } from "../../hooks/useColorScheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RegisterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark } = useColorScheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    // UI Only for now
    console.log("Register clicked:", { name, email, password });
    router.replace("/(tabs)");
  };

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950" style={{ paddingTop: insets.top }}>
      <View className="px-4 py-4 flex-row items-center justify-between bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-white/5">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="p-2 -ml-2"
        >
          <Ionicons name="arrow-back" size={24} color={isDark ? "#ffffff" : "#0f172a"} />
        </TouchableOpacity>
        <Text className="text-xl font-ubuntu-bold text-slate-900 dark:text-white">
          Sign Up
        </Text>
        <View className="w-10" />
      </View>

      <ScrollView 
        className="flex-1 px-4 pt-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-8 px-2">
          <Text className="text-3xl font-ubuntu-bold text-slate-900 dark:text-white tracking-tight">
            Create Account
          </Text>
          <Text className="text-base font-ubuntu text-slate-500 dark:text-slate-400 mt-2">
            Join the .Soko marketplace today
          </Text>
        </View>

        <View className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-white/5 mb-8">
          <View className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
              icon={<Ionicons name="person-outline" size={20} color="#64748b" />}
            />

            <Input
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              icon={<Ionicons name="mail-outline" size={20} color="#64748b" />}
            />

            <Input
              label="Password"
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              icon={<Ionicons name="lock-closed-outline" size={20} color="#64748b" />}
            />

            <View className="mt-4">
              <Button 
                title="Sign Up" 
                onPress={handleRegister}
                icon={<Ionicons name="arrow-forward" size={20} color="#ffffff" />}
              />
            </View>
          </View>

          <View className="my-8 flex-row items-center gap-4">
            <View className="flex-1 h-px bg-slate-100 dark:bg-white/5" />
            <Text className="text-[10px] font-ubuntu-bold text-slate-400 uppercase tracking-widest text-center">
              Or continue with
            </Text>
            <View className="flex-1 h-px bg-slate-100 dark:bg-white/5" />
          </View>

          <SocialAuth />
        </View>

        <View className="mb-6 flex-row justify-center gap-1">
          <Text className="font-ubuntu text-slate-500 dark:text-slate-400">
            Already have an account?
          </Text>
          <Link href="/login" asChild>
            <TouchableOpacity>
              <Text className="font-ubuntu-bold text-primary">Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <Text className="text-center text-slate-400 text-xs font-ubuntu mb-10 leading-5 px-6">
          By signing up, you agree to our{" "}
          <Text className="text-primary font-ubuntu-bold">Terms</Text> and{" "}
          <Text className="text-primary font-ubuntu-bold">Privacy Policy</Text>
        </Text>
      </ScrollView>
    </View>
  );
}
