import React from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  ActivityIndicator, Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import { useOrderById } from "@/hooks/useOrders";

const STATUS_STEPS = ["pending", "processing", "shipped", "delivered"];

const STATUS_LABELS: Record<string, string> = {
  pending: "Order Placed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const STATUS_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  pending: "time-outline",
  processing: "construct-outline",
  shipped: "car-outline",
  delivered: "checkmark-circle-outline",
  cancelled: "close-circle-outline",
};

function Section({ title, children, isDark }: { title: string; children: React.ReactNode; isDark: boolean }) {
  return (
    <View style={{
      backgroundColor: isDark ? "#0f172a" : "#ffffff",
      borderRadius: 20, padding: 16, marginBottom: 12,
      borderWidth: 1, borderColor: isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9",
    }}>
      <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 11, color: isDark ? "#64748b" : "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
        {title}
      </Text>
      {children}
    </View>
  );
}

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const { data: order, isLoading, isError } = useOrderById(id as string);

  const isCancelled = order?.status === "cancelled";
  const currentStepIndex = isCancelled ? -1 : STATUS_STEPS.indexOf(order?.status ?? "pending");

  const date = order?.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" })
    : "";

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-6 py-5 flex-row items-center bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-white/5">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 mr-2">
          <Ionicons name="arrow-back" size={24} color={isDark ? "#ffffff" : "#0f172a"} />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-xl font-ubuntu-bold text-slate-900 dark:text-white">Order Details</Text>
          {order && (
            <Text className="text-xs font-ubuntu text-slate-500">#{order.id?.slice(-8).toUpperCase()}</Text>
          )}
        </View>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#f97316" />
        </View>
      ) : isError || !order ? (
        <View className="flex-1 items-center justify-center p-8">
          <Ionicons name="alert-circle-outline" size={48} color="#f43f5e" />
          <Text className="mt-4 font-ubuntu-bold text-slate-900 dark:text-white text-center">Order not found</Text>
          <TouchableOpacity onPress={() => router.back()} className="mt-4 px-6 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <Text className="font-ubuntu-bold text-primary">Go Back</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 16, paddingBottom: 48 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Status tracker */}
          <Section title="Order Status" isDark={isDark}>
            {isCancelled ? (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(239,68,68,0.12)", alignItems: "center", justifyContent: "center" }}>
                  <Ionicons name="close-circle-outline" size={20} color="#ef4444" />
                </View>
                <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 14, color: "#ef4444" }}>Order Cancelled</Text>
              </View>
            ) : (
              <View>
                {STATUS_STEPS.map((step, i) => {
                  const done = i <= currentStepIndex;
                  const active = i === currentStepIndex;
                  const color = done ? "#f97316" : (isDark ? "#334155" : "#e2e8f0");
                  const textColor = done ? (isDark ? "#ffffff" : "#0f172a") : (isDark ? "#475569" : "#94a3b8");
                  return (
                    <View key={step} style={{ flexDirection: "row", alignItems: "flex-start" }}>
                      {/* Line + dot */}
                      <View style={{ alignItems: "center", marginRight: 14, width: 24 }}>
                        <View style={{
                          width: 24, height: 24, borderRadius: 12,
                          backgroundColor: done ? "#f97316" : (isDark ? "#1e293b" : "#f1f5f9"),
                          borderWidth: active ? 2 : 1,
                          borderColor: done ? "#f97316" : (isDark ? "#334155" : "#e2e8f0"),
                          alignItems: "center", justifyContent: "center",
                        }}>
                          {done && <Ionicons name="checkmark" size={13} color="#ffffff" />}
                        </View>
                        {i < STATUS_STEPS.length - 1 && (
                          <View style={{ width: 2, height: 28, backgroundColor: color, marginTop: 2 }} />
                        )}
                      </View>
                      {/* Label */}
                      <View style={{ paddingBottom: i < STATUS_STEPS.length - 1 ? 20 : 0, paddingTop: 2 }}>
                        <Text style={{ fontFamily: active ? "Ubuntu-Bold" : "Ubuntu-Medium", fontSize: 13, color: textColor }}>
                          {STATUS_LABELS[step]}
                        </Text>
                        {active && (
                          <Text style={{ fontFamily: "Ubuntu-Regular", fontSize: 11, color: isDark ? "#64748b" : "#94a3b8", marginTop: 2 }}>
                            {date}
                          </Text>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </Section>

          {/* Items */}
          <Section title={`Items (${order.items?.length ?? 0})`} isDark={isDark}>
            {order.items?.map((item: any, i: number) => (
              <View key={i} style={{
                flexDirection: "row", alignItems: "center",
                paddingVertical: 10,
                borderTopWidth: i > 0 ? 1 : 0,
                borderTopColor: isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9",
              }}>
                <View style={{
                  width: 52, height: 52, borderRadius: 12, overflow: "hidden",
                  backgroundColor: isDark ? "#1e293b" : "#f8fafc",
                  marginRight: 12, borderWidth: 1,
                  borderColor: isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9",
                }}>
                  {item.image ? (
                    <Image source={{ uri: item.image }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
                  ) : (
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                      <Ionicons name="cube-outline" size={20} color={isDark ? "#475569" : "#94a3b8"} />
                    </View>
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text numberOfLines={1} style={{ fontFamily: "Ubuntu-Bold", fontSize: 13, color: isDark ? "#ffffff" : "#0f172a" }}>
                    {item.name}
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 2 }}>
                    {item.size && (
                      <Text style={{ fontFamily: "Ubuntu-Regular", fontSize: 11, color: isDark ? "#64748b" : "#94a3b8" }}>
                        Size: {item.size}
                      </Text>
                    )}
                    {item.color && (
                      <Text style={{ fontFamily: "Ubuntu-Regular", fontSize: 11, color: isDark ? "#64748b" : "#94a3b8" }}>
                        Color: {item.color}
                      </Text>
                    )}
                  </View>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 13, color: "#f97316" }}>
                    KES {Number(item.price).toLocaleString()}
                  </Text>
                  <Text style={{ fontFamily: "Ubuntu-Regular", fontSize: 11, color: isDark ? "#64748b" : "#94a3b8", marginTop: 2 }}>
                    ×{item.quantity}
                  </Text>
                </View>
              </View>
            ))}
          </Section>

          {/* Shipping address */}
          {order.shippingAddress && (
            <Section title="Delivery Address" isDark={isDark}>
              <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}>
                <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: isDark ? "#1e293b" : "#f1f5f9", alignItems: "center", justifyContent: "center" }}>
                  <Ionicons name="location-outline" size={18} color={isDark ? "#94a3b8" : "#64748b"} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 13, color: isDark ? "#ffffff" : "#0f172a" }}>
                    {order.shippingAddress.name}
                  </Text>
                  <Text style={{ fontFamily: "Ubuntu-Regular", fontSize: 12, color: isDark ? "#94a3b8" : "#64748b", marginTop: 2 }}>
                    {order.shippingAddress.street}, {order.shippingAddress.city}
                  </Text>
                  {order.shippingAddress.phone && (
                    <Text style={{ fontFamily: "Ubuntu-Regular", fontSize: 12, color: isDark ? "#94a3b8" : "#64748b", marginTop: 2 }}>
                      {order.shippingAddress.phone}
                    </Text>
                  )}
                </View>
              </View>
            </Section>
          )}

          {/* Payment summary */}
          <Section title="Payment Summary" isDark={isDark}>
            {[
              { label: "Subtotal", value: order.subtotal },
              { label: "Shipping", value: order.shippingFee },
            ].map(({ label, value }) => (
              <View key={label} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                <Text style={{ fontFamily: "Ubuntu-Regular", fontSize: 13, color: isDark ? "#94a3b8" : "#64748b" }}>{label}</Text>
                <Text style={{ fontFamily: "Ubuntu-Medium", fontSize: 13, color: isDark ? "#cbd5e1" : "#334155" }}>
                  KES {Number(value ?? 0).toLocaleString()}
                </Text>
              </View>
            ))}
            <View style={{ height: 1, backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9", marginVertical: 8 }} />
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 14, color: isDark ? "#ffffff" : "#0f172a" }}>Total</Text>
              <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 16, color: "#f97316" }}>
                KES {Number(order.totalAmount).toLocaleString()}
              </Text>
            </View>
            <View style={{ marginTop: 10, flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Ionicons name="card-outline" size={14} color={isDark ? "#64748b" : "#94a3b8"} />
              <Text style={{ fontFamily: "Ubuntu-Regular", fontSize: 12, color: isDark ? "#64748b" : "#94a3b8" }}>
                {order.paymentMethod ?? "Cash on Delivery"} · {order.paymentStatus}
              </Text>
            </View>
          </Section>
        </ScrollView>
      )}
    </View>
  );
}
