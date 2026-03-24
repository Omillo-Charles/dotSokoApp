import { useMutation, useQueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
        await AsyncStorage.setItem("accessToken", data.data.accessToken);
        await AsyncStorage.setItem("user", JSON.stringify(data.data.user));
        // Optionally update any global user state/queries here
        queryClient.invalidateQueries({ queryKey: ["user-me"] });
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
    // Don't log them in directly since they need to verify their email first!
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
