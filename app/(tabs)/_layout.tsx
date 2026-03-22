import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { Header } from "@components/layout/header";
import { MoreModal } from "@components/modals/moreModal";
import { useColorScheme } from "../../hooks/useColorScheme";

export default function TabsLayout() {
  const [isMoreModalOpen, setIsMoreModalOpen] = React.useState(false);
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
        name="shop/index"
        options={{
          title: "Shop",
          tabBarIcon: ({ color, size }) => <Ionicons name="storefront" size={size} color={color} />,
        }}
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
        name="deals/index"
        options={{
          title: "Deals",
          tabBarIcon: ({ color, size }) => <Ionicons name="pricetag" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="more/index"
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            setIsMoreModalOpen(true);
          },
        })}
        options={{
          title: "More",
          tabBarIcon: ({ color, size }) => <Ionicons name="ellipsis-horizontal" size={size} color={color} />,
        }}
      />
    </Tabs>
    <MoreModal isOpen={isMoreModalOpen} onClose={() => setIsMoreModalOpen(false)} />
    </>
  );
}
