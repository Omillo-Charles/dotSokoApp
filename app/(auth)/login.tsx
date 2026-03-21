import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { SocialAuth } from "@components/auth/socialAuth";
import { useColorScheme } from "../../hooks/useColorScheme";

export default function LoginScreen() {
  const router = useRouter();
  const { isDark } = useColorScheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // UI Only - no backend yet
    console.log("Login clicked");
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView 
        className="flex-1 px-6 pt-10"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity 
          onPress={() => router.back()}
          className="mb-8 pt-10"
        >
          <Ionicons name="chevron-back" size={28} color={isDark ? "#ffffff" : "#0f172a"} />
        </TouchableOpacity>

        <View className="mb-10">
          <Text className="text-4xl font-ubuntu-bold text-foreground tracking-tight">
            Welcome Back
          </Text>
          <Text className="text-lg font-ubuntu text-muted-foreground mt-2">
            Sign in to access your account
          </Text>
        </View>

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

          <TouchableOpacity className="items-end mb-6">
            <Text className="text-sm font-ubuntu-bold text-primary">
              Forgot password?
            </Text>
          </TouchableOpacity>

          <Button 
            title="Sign In" 
            onPress={handleLogin}
            icon={<Ionicons name="arrow-forward" size={20} color="#ffffff" />}
          />
        </View>

        <View className="my-10 flex-row items-center gap-4">
          <View className="flex-1 h-px bg-border" />
          <Text className="text-xs font-ubuntu-bold text-muted-foreground uppercase tracking-widest text-center">
            Or continue with
          </Text>
          <View className="flex-1 h-px bg-border" />
        </View>

        <SocialAuth />

        <View className="mt-12 mb-20 flex-row justify-center gap-1">
          <Text className="font-ubuntu text-muted-foreground">
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
