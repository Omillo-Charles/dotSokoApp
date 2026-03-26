import React from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  ActivityIndicator, RefreshControl, Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import { useMyOrders } from "@/hooks/useOrders";

// ── Status badge ───────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  pending:    { label: "Pending",    bg: "#fef9c3", text: "#854d0e" },
  processing: { label: "Processing", bg: "#dbeafe", text: "#1e40af" },
  shipped:    { label: "Shipped",    bg: "#e0f2fe", text: "#0369a1" },
  delivered:  { label: "Delivered",  bg: "#dcfce7", text: "#166534" },
  cancelled:  { label: "Cancelled",  bg: "#fee2e2", text: "#991b1b" },
};

const STATUS_CONFIG_DARK: Record<string, { bg: string; text: string }> = {
  pending:    { bg: "rgba(234,179,8,0.15)",   text: "#fde047" },
  processing: { bg: "rgba(59,130,246,0.15)",  text: "#93c5fd" },
  shipped:    { bg: "rgba(14,165,233,0.15)",  text: "#7dd3fc" },
  delivered:  { bg: "rgba(34,197,94,0.15)",   text: "#86efac" },
  cancelled:  { bg: "rgba(239,68,68,0.15)",   text: "#fca5a5" },
};

function StatusBadge({ status, isDark }: { status: string; isDark: boolean }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, bg: "#f1f5f9", text: "#64748b" };
  const darkCfg = STATUS_CONFIG_DARK[status] ?? { bg: "rgba(100,116,139,0.15)", text: "#94a3b8" };
  return (
    <View style={{
      paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
      backgroundColor: isDark ? darkCfg.bg : cfg.bg,
    }}>
      <Text style={{ fontSize: 11, fontFamily: "Ubuntu-Bold", color: isDark ? darkCfg.text : cfg.text }}>
        {cfg.label}
      </Text>
    </View>
  );
}

// ── Order card ─────────────────────────────────────────────────────────────────
function OrderCard({ order, isDark, onPress }: { order: any; isDark: boolean; onPress: () => void }) {
  const borderColor = isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9";
  const cardBg = isDark ? "#0f172a" : "#ffffff";
  const firstImage = order.items?.[0]?.image;
  const itemCount = order.items?.length ?? 0;
  const date = new Date(order.createdAt).toLocaleDateString("en-KE", {
    day: "numeric", month: "short", year: "numeric",
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        backgroundColor: cardBg, borderRadius: 20,
        borderWidth: 1, borderColor,
        padding: 16, marginBottom: 12,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
        {/* First item thumbnail */}
        <View style={{
          width: 56, height: 56, borderRadius: 12, overflow: "hidden",
          backgroundColor: isDark ? "#1e293b" : "#f8fafc",
          marginRight: 12, borderWidth: 1, borderColor,
        }}>
          {firstImage ? (
            <Image source={{ uri: firstImage }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
          ) : (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
              <Ionicons name="cube-outline" size={24} color={isDark ? "#475569" : "#94a3b8"} />
            </View>
          )}
        </View>

        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 13, color: isDark ? "#ffffff" : "#0f172a" }}>
              Order #{order.id?.slice(-8).toUpperCase()}
            </Text>
            <StatusBadge status={order.status} isDark={isDark} />
          </View>
          <Text style={{ fontFamily: "Ubuntu-Regular", fontSize: 12, color: isDark ? "#94a3b8" : "#64748b" }}>
            {date} · {itemCount} item{itemCount !== 1 ? "s" : ""}
          </Text>
        </View>
      </View>

      {/* Items preview */}
      {order.items?.slice(0, 3).map((item: any, i: number) => (
        <View key={i} style={{
          flexDirection: "row", alignItems: "center", justifyContent: "space-between",
          paddingVertical: 6,
          borderTopWidth: 1, borderTopColor: borderColor,
        }}>
          <Text
            numberOfLines={1}
            style={{ flex: 1, fontFamily: "Ubuntu-Medium", fontSize: 12, color: isDark ? "#cbd5e1" : "#334155", marginRight: 8 }}
          >
            {item.name}
          </Text>
          <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 12, color: isDark ? "#94a3b8" : "#64748b" }}>
            ×{item.quantity}
          </Text>
        </View>
      ))}
      {order.items?.length > 3 && (
        <Text style={{ fontFamily: "Ubuntu-Regular", fontSize: 11, color: isDark ? "#64748b" : "#94a3b8", marginTop: 4 }}>
          +{order.items.length - 3} more item{order.items.length - 3 !== 1 ? "s" : ""}
        </Text>
      )}

      {/* Total */}
      <View style={{
        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
        marginTop: 12, paddingTop: 12,
        borderTopWidth: 1, borderTopColor: borderColor,
      }}>
        <Text style={{ fontFamily: "Ubuntu-Regular", fontSize: 12, color: isDark ? "#94a3b8" : "#64748b" }}>
          Total
        </Text>
        <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 15, color: "#f97316" }}>
          KES {Number(order.totalAmount).toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

// ── Screen ─────────────────────────────────────────────────────────────────────
export default function OrdersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const { data: orders = [], isLoading, isError, refetch, isRefetching } = useMyOrders();

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-4 py-4 flex-row items-center bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-white/5">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 mr-2">
          <Ionicons name="arrow-back" size={24} color={isDark ? "#ffffff" : "#0f172a"} />
        </TouchableOpacity>
        <Text className="text-xl font-ubuntu-bold text-slate-900 dark:text-white flex-1">My Orders</Text>
        {orders.length > 0 && (
          <View className="bg-primary/10 px-3 py-1 rounded-full">
            <Text className="text-xs font-ubuntu-bold text-primary">{orders.length}</Text>
          </View>
        )}
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#f97316" />
          <Text className="mt-4 font-ubuntu text-slate-500">Loading your orders...</Text>
        </View>
      ) : isError ? (
        <View className="flex-1 items-center justify-center p-8">
          <Ionicons name="alert-circle-outline" size={48} color="#f43f5e" />
          <Text className="mt-4 font-ubuntu-bold text-slate-900 dark:text-white text-center">
            Failed to load orders
          </Text>
          <TouchableOpacity
            onPress={() => refetch()}
            className="mt-4 px-6 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl"
          >
            <Text className="font-ubuntu-bold text-primary">Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : orders.length === 0 ? (
        <View className="flex-1 items-center justify-center p-8">
          <View className="w-28 h-28 bg-slate-100 dark:bg-slate-900 rounded-full items-center justify-center mb-6">
            <Ionicons name="cube-outline" size={52} color="#94a3b8" />
          </View>
          <Text className="text-xl font-ubuntu-bold text-slate-900 dark:text-white mb-2">No orders yet</Text>
          <Text className="text-slate-500 dark:text-slate-400 font-ubuntu text-center px-8 mb-8 leading-6">
            When you place an order it will appear here.
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/shop/index" as any)}
            className="bg-primary px-10 py-4 rounded-2xl"
          >
            <Text className="text-white font-ubuntu-bold text-base">Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={isDark ? "#ffffff" : "#f97316"}
            />
          }
        >
          {orders.map((order: any) => (
            <OrderCard
              key={order.id}
              order={order}
              isDark={isDark}
              onPress={() => router.push(`/profile/orders/${order.id}` as any)}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
