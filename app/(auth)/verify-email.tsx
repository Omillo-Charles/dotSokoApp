import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { useColorScheme } from "../../hooks/useColorScheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useVerifyEmail } from "../../hooks/useAuth";

export default function VerifyEmailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const emailParam = typeof params.email === 'string' ? params.email : '';
  const insets = useSafeAreaInsets();
  const { isDark } = useColorScheme();
  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState("");
  const verifyEmailMutation = useVerifyEmail();

  const handleVerify = () => {
    if (!email || !otp) return;
    verifyEmailMutation.mutate({ email, otp }, {
      onSuccess: () => {
        router.replace("/(auth)/login");
      }
    });
  };

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950" style={{ paddingTop: insets.top }}>
      <View className="px-4 py-4 flex-row items-center justify-between bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-white/5">
        <TouchableOpacity 
          onPress={() => router.replace("/(auth)/login")}
          className="p-2 -ml-2"
        >
          <Ionicons name="arrow-back" size={24} color={isDark ? "#ffffff" : "#0f172a"} />
        </TouchableOpacity>
        <Text className="text-xl font-ubuntu-bold text-slate-900 dark:text-white">
          Verify Email
        </Text>
        <View className="w-10" />
      </View>

      <ScrollView 
        className="flex-1 px-4 pt-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-8 px-2">
          <Text className="text-3xl font-ubuntu-bold text-slate-900 dark:text-white tracking-tight">
            Check Your Email
          </Text>
          <Text className="text-base font-ubuntu text-slate-500 dark:text-slate-400 mt-2">
            We sent an OTP verification code to your email. Enter it below to activate your account.
          </Text>
        </View>

        <View className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-white/5 mb-8">
          {verifyEmailMutation.isError && (
             <Text className="text-red-500 font-ubuntu-medium text-sm mb-4 text-center">
               {(verifyEmailMutation.error as any)?.friendlyMessage || (verifyEmailMutation.error as any)?.message || "Verification failed. Please try again."}
             </Text>
          )}
          {verifyEmailMutation.isSuccess && (
             <Text className="text-emerald-500 font-ubuntu-medium text-sm mb-4 text-center">
               Email verified successfully!
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
              label="OTP Code"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChangeText={setOtp}
              keyboardType="numeric"
              icon={<Ionicons name="keypad" size={20} color="#64748b" />}
            />

            <View className="mt-4">
              <Button 
                title="Verify Account" 
                onPress={handleVerify}
                isLoading={verifyEmailMutation.isPending}
                icon={<Ionicons name="checkmark-circle-outline" size={20} color="#ffffff" />}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity 
          className="flex-row items-center justify-center py-4"
          onPress={() => router.replace("/(auth)/login")}
        >
          <Text className="font-ubuntu-bold text-slate-500 dark:text-slate-400">Return to Sign In</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
