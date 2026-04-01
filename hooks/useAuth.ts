import { useMutation, useQueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import api from "../lib/api";

export const useSignIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post("/auth/sign-in", data);
      return response.data;
    },
    onSuccess: async (data) => {
      if (data.success && data.data?.accessToken) {
        // Store token and user first
        await AsyncStorage.setItem("accessToken", data.data.accessToken);
        await AsyncStorage.setItem("user", JSON.stringify(data.data.user));

        // Invalidate queries
        queryClient.invalidateQueries({ queryKey: ["user-me"] });

        // Redirect only after everything is stored
        router.replace("/(tabs)");
      }
    },
  });
};

export const useSignUp = () => {
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post("/auth/sign-up", data);
      return response.data;
    },
    // No auto login — user must verify email first
  });
};

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: async (data: { email: string; otp: string }) => {
      const response = await api.post("/auth/verify-email", data);
      return response.data;
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (data: { email: string }) => {
      const response = await api.post("/auth/forgot-password", data);
      return response.data;
    },
  });
};

export const useSignOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {},
    onSuccess: async () => {
      // DO NOT clear cart and wishlist — they should persist across sign out/sign in
      // The user's cart and wishlist should be available when they sign back in
      
      // Clear auth tokens only
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("user");

      // Clear all queries
      queryClient.clear();

      router.replace("/(auth)/login");
    },
  });
};