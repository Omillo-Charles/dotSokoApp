import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { SocialAuth } from "@components/auth/socialAuth";
import { useColorScheme } from "../../hooks/useColorScheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSignIn } from "../../hooks/useAuth";

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark } = useColorScheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const signInMutation = useSignIn();

  const handleLogin = () => {
    if (!email || !password) return;
    signInMutation.mutate({ email, password }, {
      onSuccess: () => {
        router.replace("/(tabs)");
      },
      onError: (error: any) => {
        if (error.response?.status === 401 && error.friendlyMessage?.toLowerCase().includes("verify")) {
          router.push({ pathname: "/(auth)/verify-email" as any, params: { email } });
        }
      }
    });
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
          Sign In
        </Text>
        <View className="w-10" />
      </View>

      <ScrollView 
        className="flex-1 px-4 pt-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-8 px-2">
          <Text className="text-3xl font-ubuntu-bold text-slate-900 dark:text-white tracking-tight">
            Welcome Back
          </Text>
          <Text className="text-base font-ubuntu text-slate-500 dark:text-slate-400 mt-2">
            Sign in to access your account
          </Text>
        </View>

        <View className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-white/5 mb-8">
          {signInMutation.isError && (
             <Text className="text-red-500 font-ubuntu-medium text-sm mb-4 text-center">
               {(signInMutation.error as any)?.friendlyMessage || "Failed to sign in. Please try again."}
             </Text>
          )}
          <View className="space-y-4">
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
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              icon={<Ionicons name="lock-closed-outline" size={20} color="#64748b" />}
            />

            <TouchableOpacity 
              className="items-end mb-4"
              onPress={() => router.push("/(auth)/forgot-password")}
            >
              <Text className="text-sm font-ubuntu-bold text-primary">
                Forgot password?
              </Text>
            </TouchableOpacity>

            <Button 
              title="Sign In" 
              onPress={handleLogin}
              isLoading={signInMutation.isPending}
              icon={<Ionicons name="arrow-forward" size={20} color="#ffffff" />}
            />
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

        <View className="mb-20 flex-row justify-center gap-1">
          <Text className="font-ubuntu text-slate-500 dark:text-slate-400">
            Don't have an account?
          </Text>
          <Link href="/register" asChild>
            <TouchableOpacity>
              <Text className="font-ubuntu-bold text-primary">Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </View>
  );
}
