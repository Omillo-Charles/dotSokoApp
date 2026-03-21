import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { Header } from "@components/layout/header";
import { MoreModal } from "@components/modals/moreModal";

export default function TabsLayout() {
  const [isMoreModalOpen, setIsMoreModalOpen] = React.useState(false);
  return (
    <>
      <Tabs
      screenOptions={{
        header: () => <Header />,
        tabBarActiveTintColor: "#3b82f6", // primary
        tabBarInactiveTintColor: "#64748b", // muted-foreground
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          borderTopColor: "#e2e8f0",
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: "Ubuntu-Medium",
          fontSize: 10,
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
        name="shop"
        options={{
          title: "Shop",
          tabBarIcon: ({ color, size }) => <Ionicons name="storefront" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "",
          tabBarShowLabel: false,
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
        name="deals"
        options={{
          title: "Deals",
          tabBarIcon: ({ color, size }) => <Ionicons name="pricetag" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="more"
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
