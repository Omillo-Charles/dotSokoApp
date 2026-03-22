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
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <ScrollView 
        className="flex-1 px-6"
        contentContainerStyle={{ paddingTop: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity 
          onPress={() => router.back()}
          className="mb-8 p-2 -ml-2"
        >
          <Ionicons name="chevron-back" size={28} color={isDark ? "#ffffff" : "#0f172a"} />
        </TouchableOpacity>

        <View className="mb-10">
          <Text className="text-4xl font-ubuntu-bold text-foreground tracking-tight">
            Create Account
          </Text>
          <Text className="text-lg font-ubuntu text-muted-foreground mt-2">
            Join the .Soko marketplace today
          </Text>
        </View>

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
            Already have an account?
          </Text>
          <Link href="/login" asChild>
            <TouchableOpacity>
              <Text className="font-ubuntu-bold text-primary">Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <Text className="text-center text-muted-foreground text-xs font-ubuntu mb-10 leading-5">
          By signing up, you agree to our{" "}
          <Text className="text-primary font-ubuntu-bold">Terms</Text> and{" "}
          <Text className="text-primary font-ubuntu-bold">Privacy Policy</Text>
        </Text>
      </ScrollView>
    </View>
  );
}
