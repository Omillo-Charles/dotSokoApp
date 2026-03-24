import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { Header } from "@components/layout/header";
import { useColorScheme } from "@/hooks/useColorScheme";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TabsLayout() {
  const { isDark } = useColorScheme();
  return (
    <>
      <Tabs
      screenOptions={{
        header: () => <Header />,
        tabBarActiveTintColor: "#3b82f6", // primary
        tabBarInactiveTintColor: isDark ? "#94a3b8" : "#64748b",
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: isDark ? "#020617" : "#ffffff",
          borderTopWidth: 1,
          borderTopColor: isDark ? "#1e293b" : "#e2e8f0",
          height: 65,
          paddingBottom: 10,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontFamily: "Ubuntu-Medium",
          fontSize: 11,
          marginTop: -4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="shopRedirect"
        options={{
          title: "Shop",
          tabBarIcon: ({ color, size }) => <Ionicons name="storefront" size={size} color={color} />,
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate("shop/index");
          },
        })}
      />
      <Tabs.Screen
        name="categories/index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="contact/index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="about/index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="premium/index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="privacy/index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="terms/index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="help/index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="track-order/index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="returns/index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="shipping/index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="create/index"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ color }) => (
            <View 
              style={{
                width: 44,
                height: 44,
                backgroundColor: "#f97316", // secondary
                borderRadius: 22,
                justifyContent: "center",
                alignItems: "center",
                shadowColor: "#f97316",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 5,
              }}
            >
              <Ionicons name="add" size={30} color="#ffffff" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="dealsRedirect"
        options={{
          title: "Deals",
          tabBarIcon: ({ color, size }) => <Ionicons name="pricetag" size={size} color={color} />,
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate("deals");
          },
        })}
      />
      <Tabs.Screen
        name="profileRedirect"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
        }}
        listeners={({ navigation }) => ({
          tabPress: async (e) => {
            e.preventDefault();
            try {
              const token = await AsyncStorage.getItem("accessToken");
              if (token) {
                navigation.navigate("profile");
              } else {
                navigation.navigate("(auth)" as any, { screen: "login" });
              }
            } catch (error) {
              console.error("Error reading token:", error);
              navigation.navigate("(auth)" as any, { screen: "login" });
            }
          },
        })}
      />
    </Tabs>
    </>
  );
}
