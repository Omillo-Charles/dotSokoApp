import React, { useState, useEffect } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  Image, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useCartStore } from "@/store/useCartStore";
import { useAddresses } from "@/hooks/useAddresses";
import { useQueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "@/lib/api";
import { calculateShippingFee } from "@/lib/shipping";

const fmt = (n: number) => `KES ${n.toLocaleString()}`;

interface FormData {
  name: string;
  phone: string;
  city: string;
  street: string;
}

// ── Confirm order modal ────────────────────────────────────────────────────────
function ConfirmModal({
  visible, onClose, onConfirm, total, isSubmitting, isDark,
}: {
  visible: boolean; onClose: () => void; onConfirm: () => void;
  total: number; isSubmitting: boolean; isDark: boolean;
}) {
  const border = isDark ? "#1e293b" : "#f1f5f9";
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.55)", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <View style={{ backgroundColor: isDark ? "#0f172a" : "#ffffff", borderRadius: 28, padding: 28, width: "100%", maxWidth: 380 }}>
          <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: "rgba(249,115,22,0.12)", alignItems: "center", justifyContent: "center", alignSelf: "center", marginBottom: 16 }}>
            <Ionicons name="bag-check-outline" size={28} color="#f97316" />
          </View>
          <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 18, color: isDark ? "#ffffff" : "#0f172a", textAlign: "center", marginBottom: 8 }}>
            Confirm Order?
          </Text>
          <Text style={{ fontFamily: "Ubuntu-Regular", fontSize: 13, color: isDark ? "#94a3b8" : "#64748b", textAlign: "center", marginBottom: 24, lineHeight: 20 }}>
            You're about to place an order for {fmt(total)}. This will initiate the delivery process immediately.
          </Text>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity
              onPress={onClose}
              disabled={isSubmitting}
              style={{ flex: 1, height: 48, borderRadius: 14, borderWidth: 1, borderColor: border, alignItems: "center", justifyContent: "center" }}
            >
              <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 14, color: isDark ? "#94a3b8" : "#64748b" }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              disabled={isSubmitting}
              style={{ flex: 2, height: 48, borderRadius: 14, backgroundColor: "#f97316", alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8 }}
            >
              {isSubmitting
                ? <ActivityIndicator size="small" color="#ffffff" />
                : <Ionicons name="checkmark-circle" size={18} color="#ffffff" />
              }
              <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 14, color: "#ffffff" }}>
                {isSubmitting ? "Placing..." : "Confirm Order"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ── Main screen ────────────────────────────────────────────────────────────────
export default function CheckoutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark } = useColorScheme();
  const { items, getSubtotal, clearCart } = useCartStore();
  const { addresses, isLoading: isAddressLoading } = useAddresses();
  const queryClient = useQueryClient();

  const subtotal = getSubtotal();
  const shippingFee = calculateShippingFee(subtotal);
  const total = subtotal + shippingFee;

  const [form, setForm] = useState<FormData>({ name: "", phone: "", city: "", street: "" });
  const [prefilled, setPrefilled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Pre-fill from default address + user name once addresses have loaded
  useEffect(() => {
    if (prefilled || isAddressLoading) return;
    const fill = async () => {
      const userStr = await AsyncStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      const defaultAddr = addresses.find((a) => a.isDefault) ?? addresses[0];
      setForm({
        name: user?.name ?? "",
        phone: defaultAddr?.phone ?? "",
        city: defaultAddr?.city ?? "",
        street: defaultAddr?.street ?? "",
      });
      setPrefilled(true);
    };
    fill();
  }, [addresses, isAddressLoading, prefilled]);

  const canSubmit = form.name.trim() && form.phone.trim() && form.city.trim() && form.street.trim();

  const placeOrder = async () => {
    if (!items.length) return;
    setIsSubmitting(true);
    try {
      const payload = {
        shippingAddress: { name: form.name, phone: form.phone, city: form.city, street: form.street },
        items: items.map((item) => ({
          product: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: typeof item.image === "string" ? item.image : null,
        })),
      };
      const res = await api.post("/orders", payload);
      if (res.data.success) {
        setOrderId(res.data.data?.id ?? null);
        clearCart();
        queryClient.invalidateQueries({ queryKey: ["my-orders"] });
        setIsSuccess(true);
      } else {
        throw new Error(res.data.message || "Failed to place order");
      }
    } catch (err: any) {
      Alert.alert("Error", err?.response?.data?.message || err?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
      setShowConfirm(false);
    }
  };

  const cardBg = isDark ? "#0f172a" : "#ffffff";
  const border = isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9";
  const muted = isDark ? "#64748b" : "#94a3b8";
  const text = isDark ? "#ffffff" : "#0f172a";
  const inputBg = isDark ? "#1e293b" : "#f8fafc";
  const inputBorder = isDark ? "#334155" : "#e2e8f0";

  // ── Success state ────────────────────────────────────────────────────────────
  if (isSuccess) {
    return (
      <View style={{ flex: 1, backgroundColor: isDark ? "#020617" : "#f8fafc", alignItems: "center", justifyContent: "center", padding: 32 }}>
        <View style={{ width: 88, height: 88, borderRadius: 44, backgroundColor: "rgba(34,197,94,0.12)", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
          <Ionicons name="checkmark-circle" size={52} color="#22c55e" />
        </View>
        <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 26, color: text, marginBottom: 10 }}>Thank You!</Text>
        <Text style={{ fontFamily: "Ubuntu-Regular", fontSize: 14, color: muted, textAlign: "center", lineHeight: 22, marginBottom: 36, maxWidth: 300 }}>
          Your order has been placed successfully. A confirmation email has been sent to you and the shop owners.
        </Text>
        <TouchableOpacity
          onPress={() => router.replace("/profile/orders" as any)}
          style={{ backgroundColor: "#f97316", paddingHorizontal: 36, paddingVertical: 16, borderRadius: 20, marginBottom: 14 }}
        >
          <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 15, color: "#ffffff" }}>View My Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace("/(tabs)" as any)}>
          <Text style={{ fontFamily: "Ubuntu-Regular", fontSize: 13, color: muted }}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Empty cart guard ─────────────────────────────────────────────────────────
  if (!items.length) {
    return (
      <View style={{ flex: 1, backgroundColor: isDark ? "#020617" : "#f8fafc", alignItems: "center", justifyContent: "center", padding: 32 }}>
        <Ionicons name="bag-outline" size={64} color={muted} style={{ marginBottom: 16 }} />
        <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 20, color: text, marginBottom: 8 }}>Cart is empty</Text>
        <Text style={{ fontFamily: "Ubuntu-Regular", fontSize: 13, color: muted, textAlign: "center", marginBottom: 28 }}>
          Add some products before checking out.
        </Text>
        <TouchableOpacity onPress={() => router.replace("/shop/index" as any)} style={{ backgroundColor: "#f97316", paddingHorizontal: 32, paddingVertical: 14, borderRadius: 18 }}>
          <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 14, color: "#ffffff" }}>Start Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: isDark ? "#020617" : "#f8fafc" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View style={{
        paddingTop: insets.top + 16,
        paddingHorizontal: 16,
        paddingBottom: 16,
        backgroundColor: cardBg, borderBottomWidth: 1, borderBottomColor: border,
        flexDirection: "row", alignItems: "center",
      }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginLeft: -8 }}>
          <Ionicons name="arrow-back" size={24} color={text} />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 20, color: text }}>Checkout</Text>
          <Text style={{ fontFamily: "Ubuntu-Regular", fontSize: 12, color: muted }}>
            {items.length} item{items.length !== 1 ? "s" : ""} · {fmt(total)}
          </Text>
        </View>
        {/* Spacer to balance the back button */}
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Delivery Information ─────────────────────────────────────────── */}
        <View style={{ backgroundColor: cardBg, borderRadius: 24, borderWidth: 1, borderColor: border, padding: 20, marginBottom: 16 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: "rgba(249,115,22,0.12)", alignItems: "center", justifyContent: "center" }}>
              <Ionicons name="car-outline" size={20} color="#f97316" />
            </View>
            <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 16, color: text }}>Delivery Information</Text>
          </View>

          {/* Saved address quick-fill */}
          {addresses.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }} contentContainerStyle={{ gap: 8 }}>
              {addresses.map((addr) => (
                <TouchableOpacity
                  key={addr.id}
                  onPress={() => setForm({ name: form.name, phone: addr.phone, city: addr.city, street: addr.street })}
                  style={{
                    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1,
                    borderColor: (form.city === addr.city && form.street === addr.street) ? "#f97316" : inputBorder,
                    backgroundColor: (form.city === addr.city && form.street === addr.street) ? "rgba(249,115,22,0.08)" : inputBg,
                    flexDirection: "row", alignItems: "center", gap: 6,
                  }}
                >
                  <Ionicons name={addr.type === "home" ? "home-outline" : addr.type === "work" ? "briefcase-outline" : "location-outline"} size={13} color={(form.city === addr.city && form.street === addr.street) ? "#f97316" : muted} />
                  <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 12, color: (form.city === addr.city && form.street === addr.street) ? "#f97316" : text }}>
                    {addr.city}
                  </Text>
                  {addr.isDefault && (
                    <View style={{ backgroundColor: "#f97316", borderRadius: 6, paddingHorizontal: 5, paddingVertical: 1 }}>
                      <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 9, color: "#ffffff" }}>DEFAULT</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {/* Form fields */}
          {[
            { key: "name",   label: "Full Name",                icon: "person-outline",   placeholder: "e.g. John Doe",           keyboard: "default" },
            { key: "phone",  label: "Phone Number",             icon: "call-outline",     placeholder: "e.g. 0770 000 000",       keyboard: "phone-pad" },
            { key: "city",   label: "City / Area",              icon: "globe-outline",    placeholder: "e.g. Nairobi",            keyboard: "default" },
            { key: "street", label: "Street / Detailed Address",icon: "home-outline",     placeholder: "e.g. Moi Avenue, CBD",    keyboard: "default" },
          ].map(({ key, label, icon, placeholder, keyboard }, i, arr) => (
            <View key={key} style={{ marginBottom: i < arr.length - 1 ? 14 : 0 }}>
              <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 12, color: isDark ? "#94a3b8" : "#475569", marginBottom: 6 }}>{label}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: inputBg, borderWidth: 1, borderColor: inputBorder, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 13, gap: 10 }}>
                <Ionicons name={icon as any} size={17} color={muted} />
                <TextInput
                  value={(form as any)[key]}
                  onChangeText={(v) => setForm((p) => ({ ...p, [key]: v }))}
                  placeholder={placeholder}
                  placeholderTextColor={muted}
                  keyboardType={keyboard as any}
                  style={{ flex: 1, fontFamily: "Ubuntu-Regular", fontSize: 14, color: text, padding: 0 }}
                />
              </View>
            </View>
          ))}
        </View>

        {/* ── Payment Method ───────────────────────────────────────────────── */}
        <View style={{ backgroundColor: cardBg, borderRadius: 24, borderWidth: 1, borderColor: border, padding: 20, marginBottom: 16 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: "rgba(59,130,246,0.12)", alignItems: "center", justifyContent: "center" }}>
              <Ionicons name="card-outline" size={20} color="#3b82f6" />
            </View>
            <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 16, color: text }}>Payment Method</Text>
          </View>

          {/* Cash on delivery — selected */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 14, padding: 16, borderRadius: 16, borderWidth: 1.5, borderColor: "#f97316", backgroundColor: "rgba(249,115,22,0.06)" }}>
            <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: "#f97316", alignItems: "center", justifyContent: "center" }}>
              <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: "#f97316" }} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 14, color: "#f97316" }}>Cash on Delivery</Text>
              <Text style={{ fontFamily: "Ubuntu-Regular", fontSize: 12, color: isDark ? "#94a3b8" : "#64748b", marginTop: 2 }}>Pay when you receive your order</Text>
            </View>
            <Ionicons name="checkmark-circle" size={20} color="#f97316" />
          </View>

          <View style={{ marginTop: 12, padding: 12, borderRadius: 12, backgroundColor: isDark ? "#1e293b" : "#f8fafc", borderWidth: 1, borderStyle: "dashed", borderColor: inputBorder }}>
            <Text style={{ fontFamily: "Ubuntu-Regular", fontSize: 12, color: muted, lineHeight: 18 }}>
              Note: Digital payment options (M-Pesa / Card) will be available soon as we scale.
            </Text>
          </View>
        </View>

        {/* ── Order Summary ────────────────────────────────────────────────── */}
        <View style={{ backgroundColor: cardBg, borderRadius: 24, borderWidth: 1, borderColor: border, padding: 20, marginBottom: 16 }}>
          <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 16, color: text, marginBottom: 16 }}>Order Summary</Text>

          {items.map((item, i) => (
            <View key={item.id} style={{
              flexDirection: "row", alignItems: "center", gap: 12,
              paddingVertical: 10,
              borderTopWidth: i > 0 ? 1 : 0, borderTopColor: border,
            }}>
              <View style={{ width: 52, height: 52, borderRadius: 12, overflow: "hidden", backgroundColor: isDark ? "#1e293b" : "#f8fafc", borderWidth: 1, borderColor: border, position: "relative" }}>
                {item.image
                  ? <Image source={{ uri: typeof item.image === "string" ? item.image : undefined }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
                  : <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}><Ionicons name="cube-outline" size={20} color={muted} /></View>
                }
                {/* Quantity badge */}
                <View style={{ position: "absolute", top: -4, right: -4, width: 18, height: 18, borderRadius: 9, backgroundColor: "#f97316", alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 9, color: "#ffffff" }}>{item.quantity}</Text>
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text numberOfLines={1} style={{ fontFamily: "Ubuntu-Bold", fontSize: 13, color: text }}>{item.name}</Text>
                <Text style={{ fontFamily: "Ubuntu-Regular", fontSize: 11, color: muted, marginTop: 1 }}>{item.category || "Item"}</Text>
              </View>
              <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 13, color: "#f97316" }}>
                {fmt(item.price * item.quantity)}
              </Text>
            </View>
          ))}

          {/* Totals */}
          <View style={{ marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: border, gap: 10 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontFamily: "Ubuntu-Regular", fontSize: 13, color: muted }}>Subtotal</Text>
              <Text style={{ fontFamily: "Ubuntu-Medium", fontSize: 13, color: text }}>{fmt(subtotal)}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontFamily: "Ubuntu-Regular", fontSize: 13, color: muted }}>Shipping Fee</Text>
              <Text style={{ fontFamily: "Ubuntu-Medium", fontSize: 13, color: shippingFee === 0 ? "#22c55e" : text }}>
                {shippingFee === 0 ? "FREE" : fmt(shippingFee)}
              </Text>
            </View>
            <View style={{ height: 1, backgroundColor: border }} />
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 16, color: text }}>Total</Text>
              <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 20, color: "#f97316" }}>{fmt(total)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* ── Place Order button ───────────────────────────────────────────────── */}
      <View style={{
        paddingHorizontal: 16, paddingTop: 12,
        paddingBottom: Math.max(insets.bottom, 20),
        backgroundColor: cardBg, borderTopWidth: 1, borderTopColor: border,
      }}>
        <TouchableOpacity
          onPress={() => {
            if (!canSubmit) {
              Alert.alert("Missing details", "Please fill in all delivery fields.");
              return;
            }
            setShowConfirm(true);
          }}
          disabled={isSubmitting}
          style={{
            height: 56, borderRadius: 18,
            backgroundColor: canSubmit ? "#f97316" : (isDark ? "#1e293b" : "#e2e8f0"),
            alignItems: "center", justifyContent: "center",
            flexDirection: "row", gap: 10,
          }}
        >
          {isSubmitting
            ? <ActivityIndicator size="small" color="#ffffff" />
            : <Ionicons name="bag-check-outline" size={20} color={canSubmit ? "#ffffff" : muted} />
          }
          <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 16, color: canSubmit ? "#ffffff" : muted }}>
            {isSubmitting ? "Placing Order..." : `Place Order · ${fmt(total)}`}
          </Text>
        </TouchableOpacity>
        <Text style={{ fontFamily: "Ubuntu-Regular", fontSize: 10, color: muted, textAlign: "center", marginTop: 8, textTransform: "uppercase", letterSpacing: 1 }}>
          Secure Checkout · .Soko
        </Text>
      </View>

      <ConfirmModal
        visible={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={placeOrder}
        total={total}
        isSubmitting={isSubmitting}
        isDark={isDark}
      />
    </KeyboardAvoidingView>
  );
}
