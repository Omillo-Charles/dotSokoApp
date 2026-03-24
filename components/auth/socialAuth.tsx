import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Path } from "react-native-svg";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQueryClient } from "@tanstack/react-query";
import api from "../../lib/api";

// Required for web browser to work correctly
WebBrowser.maybeCompleteAuthSession();

const GoogleIcon = () => (
  <Svg viewBox="0 0 24 24" style={{ width: 20, height: 20 }}>
    <Path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <Path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <Path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      fill="#FBBC05"
    />
    <Path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </Svg>
);

export const SocialAuth: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [loadingProvider, setLoadingProvider] = useState<"google" | "github" | null>(null);

  const handleSocialAuth = async (provider: "google" | "github") => {
    try {
      setLoadingProvider(provider);
      const redirectUrl = Linking.createURL("oauth-callback");
      const baseUrl = api.defaults.baseURL || "http://localhost:5500/api/v1";
      const authUrl = `${baseUrl}/auth/${provider}?redirect_to=${encodeURIComponent(redirectUrl)}`;

      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUrl);

      if (result.type === "success" && result.url) {
        const parsed = Linking.parse(result.url);
        const token = parsed.queryParams?.token;
        const userStr = parsed.queryParams?.user;

        if (token && userStr) {
          await AsyncStorage.setItem("accessToken", token as string);
          await AsyncStorage.setItem("user", userStr as string);
          queryClient.invalidateQueries({ queryKey: ["user-me"] });
          router.replace("/(tabs)");
        }
      }
    } catch (error) {
      console.error(`[Social Auth] ${provider} error:`, error);
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <View className="flex-row gap-4 mt-4">
      <TouchableOpacity
        className="flex-1 flex-row items-center justify-center gap-3 py-4 border border-border rounded-2xl bg-background"
        activeOpacity={0.7}
        disabled={loadingProvider !== null}
        onPress={() => handleSocialAuth("google")}
      >
        {loadingProvider === "google" ? (
          <ActivityIndicator size="small" color="#64748b" />
        ) : (
          <>
            <GoogleIcon />
            <Text className="font-ubuntu-bold text-foreground">Google</Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        className="flex-1 flex-row items-center justify-center gap-3 py-4 border border-border rounded-2xl bg-background"
        activeOpacity={0.7}
        disabled={loadingProvider !== null}
        onPress={() => handleSocialAuth("github")}
      >
        {loadingProvider === "github" ? (
          <ActivityIndicator size="small" color="#64748b" />
        ) : (
          <>
            <Ionicons name="logo-github" size={20} color="#0f172a" style={{ color: "black" }} className="dark:color-white" />
            <Text className="font-ubuntu-bold text-foreground">GitHub</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};
