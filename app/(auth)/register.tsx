import React, { useState } from "react";
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from "react-native";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { SocialAuth } from "../../components/auth/SocialAuth";

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    // UI Only - no backend yet
    console.log("Register clicked");
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView 
        className="flex-1 px-6 pt-10"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity 
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full bg-muted mb-8"
        >
          <Ionicons name="arrow-back" size={20} color="#0f172a" />
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
    </SafeAreaView>
  );
}
