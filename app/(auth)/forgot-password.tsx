import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { useColorScheme } from "../../hooks/useColorScheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useForgotPassword } from "../../hooks/useAuth";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark } = useColorScheme();
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const forgotPasswordMutation = useForgotPassword();

  const handleResetPassword = () => {
    if (!email) return;
    setSuccessMessage("");
    forgotPasswordMutation.mutate({ email }, {
      onSuccess: (data) => {
        setSuccessMessage(data.message || "Password reset link sent to your email!");
      }
    });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
    <View className="flex-1 bg-slate-50 dark:bg-slate-950" style={{ paddingTop: insets.top }}>
      <View className="px-4 py-4 flex-row items-center justify-between bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-white/5">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="p-2 -ml-2"
        >
          <Ionicons name="arrow-back" size={24} color={isDark ? "#ffffff" : "#0f172a"} />
        </TouchableOpacity>
        <Text className="text-xl font-ubuntu-bold text-slate-900 dark:text-white">
          Reset Password
        </Text>
        <View className="w-10" />
      </View>

      <ScrollView 
        className="flex-1 px-4 pt-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-8 px-2">
          <Text className="text-3xl font-ubuntu-bold text-slate-900 dark:text-white tracking-tight">
            Forgot Password?
          </Text>
          <Text className="text-base font-ubuntu text-slate-500 dark:text-slate-400 mt-2">
            Enter the email address associated with your account and we'll send you a link to reset your password.
          </Text>
        </View>

        <View className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-white/5 mb-8">
          {forgotPasswordMutation.isError && (
             <Text className="text-red-500 font-ubuntu-medium text-sm mb-4 text-center">
               {(forgotPasswordMutation.error as any)?.friendlyMessage || "Failed to send reset link. Please try again."}
             </Text>
          )}
          {successMessage ? (
             <Text className="text-emerald-500 font-ubuntu-medium text-sm mb-4 text-center">
               {successMessage}
             </Text>
          ) : null}
          <View className="space-y-4">
            <Input
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              icon={<Ionicons name="mail-outline" size={20} color="#64748b" />}
            />

            <View className="mt-4">
              <Button 
                title="Send Reset Link" 
                onPress={handleResetPassword}
                isLoading={forgotPasswordMutation.isPending}
                icon={<Ionicons name="mail-unread-outline" size={20} color="#ffffff" />}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity 
          className="flex-row items-center justify-center py-4"
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={16} color="#64748b" />
          <Text className="font-ubuntu-bold text-slate-500 dark:text-slate-400 ml-2">Back to Sign In</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
    </KeyboardAvoidingView>
  );
}
