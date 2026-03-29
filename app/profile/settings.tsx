import React, { useState, useEffect } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, Switch,
  Alert, ActivityIndicator, Modal, TextInput,
  KeyboardAvoidingView, Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useThemeStore } from "@/store/useThemeStore";
import { useSignOut } from "@/hooks/useAuth";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import api from "@/lib/api";

// ── Types ──────────────────────────────────────────────────────────────────────
type ThemeOption = "light" | "dark" | "system";

// ── Reusable row components ────────────────────────────────────────────────────
function Section({ title, children, isDark }: { title: string; children: React.ReactNode; isDark: boolean }) {
  return (
    <View style={{ marginBottom: 28 }}>
      <Text style={{
        fontFamily: "Ubuntu-Bold", fontSize: 11,
        color: isDark ? "#64748b" : "#94a3b8",
        textTransform: "uppercase", letterSpacing: 1.2,
        marginBottom: 10, paddingHorizontal: 4,
      }}>
        {title}
      </Text>
      <View style={{
        backgroundColor: isDark ? "#0f172a" : "#ffffff",
        borderRadius: 20, overflow: "hidden",
        borderWidth: 1, borderColor: isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9",
      }}>
        {children}
      </View>
    </View>
  );
}

function Row({
  icon, iconColor, iconBg, title, subtitle, onPress, right, isDark, last = false, danger = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  right?: React.ReactNode;
  isDark: boolean;
  last?: boolean;
  danger?: boolean;
}) {
  const Wrapper = onPress ? TouchableOpacity : View;
  return (
    <Wrapper
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        flexDirection: "row", alignItems: "center",
        paddingHorizontal: 16, paddingVertical: 14,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: isDark ? "rgba(255,255,255,0.04)" : "#f8fafc",
      }}
    >
      <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: iconBg, alignItems: "center", justifyContent: "center", marginRight: 14 }}>
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: "Ubuntu-Medium", fontSize: 14, color: danger ? "#ef4444" : (isDark ? "#ffffff" : "#0f172a") }}>
          {title}
        </Text>
        {subtitle && (
          <Text style={{ fontFamily: "Ubuntu-Regular", fontSize: 12, color: isDark ? "#64748b" : "#94a3b8", marginTop: 1 }}>
            {subtitle}
          </Text>
        )}
      </View>
      {right ?? (onPress && !danger && (
        <Ionicons name="chevron-forward" size={16} color={isDark ? "#334155" : "#cbd5e1"} />
      ))}
    </Wrapper>
  );
}

// ── Change password modal ──────────────────────────────────────────────────────
function ChangePasswordModal({ visible, onClose, isDark }: { visible: boolean; onClose: () => void; isDark: boolean }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      await api.post("/auth/change-password", { currentPassword: current, newPassword: next });
    },
    onSuccess: () => {
      Alert.alert("Success", "Password changed successfully.");
      setCurrent(""); setNext(""); setConfirm("");
      onClose();
    },
    onError: (err: any) => {
      Alert.alert("Error", err?.response?.data?.message || "Failed to change password.");
    },
  });

  const handleSubmit = () => {
    if (!current || !next || !confirm) return Alert.alert("Missing fields", "Please fill in all fields.");
    if (next.length < 6) return Alert.alert("Too short", "New password must be at least 6 characters.");
    if (next !== confirm) return Alert.alert("Mismatch", "New passwords do not match.");
    mutation.mutate();
  };

  const inputStyle = {
    backgroundColor: isDark ? "#1e293b" : "#f8fafc",
    borderWidth: 1, borderColor: isDark ? "#334155" : "#e2e8f0",
    borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 14, fontFamily: "Ubuntu-Regular",
    color: isDark ? "#ffffff" : "#0f172a",
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <KeyboardAvoidingView style={{ flex: 1, backgroundColor: isDark ? "#020617" : "#ffffff" }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 20, borderBottomWidth: 1, borderBottomColor: isDark ? "#1e293b" : "#f1f5f9" }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: "rgba(59,130,246,0.12)", alignItems: "center", justifyContent: "center" }}>
              <Ionicons name="lock-closed" size={18} color="#3b82f6" />
            </View>
            <View>
              <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 16, color: isDark ? "#ffffff" : "#0f172a" }}>Change Password</Text>
              <Text style={{ fontFamily: "Ubuntu-Regular", fontSize: 12, color: isDark ? "#64748b" : "#94a3b8" }}>Keep your account secure</Text>
            </View>
          </View>
          <TouchableOpacity onPress={onClose}><Ionicons name="close" size={22} color={isDark ? "#94a3b8" : "#64748b"} /></TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }} keyboardShouldPersistTaps="handled">
          <View style={{ gap: 6 }}>
            <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 12, color: isDark ? "#94a3b8" : "#64748b" }}>Current Password</Text>
            <View style={{ ...inputStyle, flexDirection: "row", alignItems: "center" }}>
              <TextInput value={current} onChangeText={setCurrent} secureTextEntry={!showCurrent} placeholder="Enter current password" placeholderTextColor={isDark ? "#475569" : "#94a3b8"} style={{ flex: 1, fontSize: 14, fontFamily: "Ubuntu-Regular", color: isDark ? "#ffffff" : "#0f172a", padding: 0 }} />
              <TouchableOpacity onPress={() => setShowCurrent(v => !v)}>
                <Ionicons name={showCurrent ? "eye-off-outline" : "eye-outline"} size={18} color={isDark ? "#64748b" : "#94a3b8"} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ gap: 6 }}>
            <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 12, color: isDark ? "#94a3b8" : "#64748b" }}>New Password</Text>
            <View style={{ ...inputStyle, flexDirection: "row", alignItems: "center" }}>
              <TextInput value={next} onChangeText={setNext} secureTextEntry={!showNext} placeholder="Min. 6 characters" placeholderTextColor={isDark ? "#475569" : "#94a3b8"} style={{ flex: 1, fontSize: 14, fontFamily: "Ubuntu-Regular", color: isDark ? "#ffffff" : "#0f172a", padding: 0 }} />
              <TouchableOpacity onPress={() => setShowNext(v => !v)}>
                <Ionicons name={showNext ? "eye-off-outline" : "eye-outline"} size={18} color={isDark ? "#64748b" : "#94a3b8"} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ gap: 6 }}>
            <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 12, color: isDark ? "#94a3b8" : "#64748b" }}>Confirm New Password</Text>
            <TextInput value={confirm} onChangeText={setConfirm} secureTextEntry placeholder="Repeat new password" placeholderTextColor={isDark ? "#475569" : "#94a3b8"} style={inputStyle} />
          </View>
        </ScrollView>

        <View style={{ padding: 20, paddingBottom: Platform.OS === "ios" ? 36 : 20, borderTopWidth: 1, borderTopColor: isDark ? "#1e293b" : "#f1f5f9", backgroundColor: isDark ? "#020617" : "#ffffff" }}>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={mutation.isPending}
            style={{ height: 52, borderRadius: 16, backgroundColor: mutation.isPending ? (isDark ? "#1e293b" : "#e2e8f0") : "#3b82f6", alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8 }}
          >
            {mutation.isPending ? <ActivityIndicator size="small" color="#ffffff" /> : <Ionicons name="checkmark-circle" size={18} color="#ffffff" />}
            <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 14, color: "#ffffff" }}>{mutation.isPending ? "Saving..." : "Update Password"}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ── Theme picker modal ─────────────────────────────────────────────────────────
function ThemeModal({ visible, onClose, current, onSelect, isDark }: {
  visible: boolean; onClose: () => void;
  current: ThemeOption; onSelect: (t: ThemeOption) => void; isDark: boolean;
}) {
  const options: { value: ThemeOption; label: string; icon: keyof typeof Ionicons.glyphMap; desc: string }[] = [
    { value: "light",  label: "Light",  icon: "sunny-outline",  desc: "Always use light mode" },
    { value: "dark",   label: "Dark",   icon: "moon-outline",   desc: "Always use dark mode" },
    { value: "system", label: "System", icon: "phone-portrait-outline", desc: "Follow device setting" },
  ];

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <TouchableOpacity style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }} activeOpacity={1} onPress={onClose}>
        <View style={{ backgroundColor: isDark ? "#0f172a" : "#ffffff", borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 40 }}>
          <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 16, color: isDark ? "#ffffff" : "#0f172a", marginBottom: 20 }}>Appearance</Text>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              onPress={() => { onSelect(opt.value); onClose(); }}
              style={{ flexDirection: "row", alignItems: "center", gap: 14, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9" }}
            >
              <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: current === opt.value ? "rgba(249,115,22,0.12)" : (isDark ? "#1e293b" : "#f8fafc"), alignItems: "center", justifyContent: "center" }}>
                <Ionicons name={opt.icon} size={20} color={current === opt.value ? "#f97316" : (isDark ? "#94a3b8" : "#64748b")} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 14, color: current === opt.value ? "#f97316" : (isDark ? "#ffffff" : "#0f172a") }}>{opt.label}</Text>
                <Text style={{ fontFamily: "Ubuntu-Regular", fontSize: 12, color: isDark ? "#64748b" : "#94a3b8", marginTop: 1 }}>{opt.desc}</Text>
              </View>
              {current === opt.value && <Ionicons name="checkmark-circle" size={20} color="#f97316" />}
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

// ── Main screen ────────────────────────────────────────────────────────────────
export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const { theme, setTheme } = useThemeStore();
  const signOutMutation = useSignOut();
  const queryClient = useQueryClient();

  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [isChangingTheme, setIsChangingTheme] = useState(false);

  // Notification toggles (local preference — extend with backend if needed)
  const [notifOrders, setNotifOrders] = useState(true);
  const [notifPromos, setNotifPromos] = useState(true);
  const [notifMessages, setNotifMessages] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("user").then((d) => { if (d) setUser(JSON.parse(d)); });
  }, []);

  // Handle theme change with debounce to prevent rapid re-renders
  const handleThemeChange = (newTheme: ThemeOption) => {
    setIsChangingTheme(true);
    setTheme(newTheme);
    // Small delay to allow theme to apply smoothly
    setTimeout(() => {
      setIsChangingTheme(false);
    }, 100);
  };

  const themeLabel: Record<ThemeOption, string> = { light: "Light", dark: "Dark", system: "System" };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This will permanently delete your account, shop, products, and all data. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete", style: "destructive",
          onPress: async () => {
            try {
              await api.delete("/users/me");
              await AsyncStorage.multiRemove(["accessToken", "user"]);
              queryClient.clear();
              router.replace("/(auth)/login" as any);
            } catch (err: any) {
              Alert.alert("Error", err?.response?.data?.message || "Failed to delete account.");
            }
          },
        },
      ]
    );
  };

  const switchColor = isDark ? "#f97316" : "#f97316";

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? "#020617" : "#f8fafc" }} >
      {/* Header */}
      <View style={{
        paddingTop: insets.top + 16,
        paddingHorizontal: 16,
        paddingBottom: 16,
        backgroundColor: isDark ? "#020617" : "#ffffff",
        borderBottomWidth: 1, borderBottomColor: isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9",
        flexDirection: "row", alignItems: "center",
      }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginLeft: -8, marginRight: 8 }}>
          <Ionicons name="arrow-back" size={24} color={isDark ? "#ffffff" : "#0f172a"} />
        </TouchableOpacity>
        <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 20, color: isDark ? "#ffffff" : "#0f172a", flex: 1 }}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>

        {/* Account */}
        <Section title="Account" isDark={isDark}>
          <Row
            icon="person-outline" iconColor="#3b82f6" iconBg="rgba(59,130,246,0.12)"
            title={user?.name || "Your Name"}
            subtitle={user?.email || ""}
            isDark={isDark}
          />
          <Row
            icon="lock-closed-outline" iconColor="#8b5cf6" iconBg="rgba(139,92,246,0.12)"
            title="Change Password"
            subtitle="Update your login password"
            onPress={() => setShowPasswordModal(true)}
            isDark={isDark}
            last
          />
        </Section>

        {/* Appearance */}
        <Section title="Appearance" isDark={isDark}>
          <Row
            icon={isDark ? "moon" : "sunny"}
            iconColor="#f59e0b" iconBg="rgba(245,158,11,0.12)"
            title="Theme"
            subtitle={themeLabel[theme]}
            onPress={() => setShowThemeModal(true)}
            isDark={isDark}
            last
          />
        </Section>

        {/* Notifications */}
        <Section title="Notifications" isDark={isDark}>
          <Row
            icon="cube-outline" iconColor="#10b981" iconBg="rgba(16,185,129,0.12)"
            title="Order Updates"
            subtitle="Shipping, delivery, and status changes"
            isDark={isDark}
            right={<Switch value={notifOrders} onValueChange={setNotifOrders} trackColor={{ false: isDark ? "#334155" : "#e2e8f0", true: switchColor }} thumbColor="#ffffff" />}
          />
          <Row
            icon="pricetag-outline" iconColor="#f97316" iconBg="rgba(249,115,22,0.12)"
            title="Promotions & Deals"
            subtitle="Discounts, flash sales, and offers"
            isDark={isDark}
            right={<Switch value={notifPromos} onValueChange={setNotifPromos} trackColor={{ false: isDark ? "#334155" : "#e2e8f0", true: switchColor }} thumbColor="#ffffff" />}
          />
          <Row
            icon="chatbubble-outline" iconColor="#3b82f6" iconBg="rgba(59,130,246,0.12)"
            title="Messages"
            subtitle="Replies and shop messages"
            isDark={isDark}
            last
            right={<Switch value={notifMessages} onValueChange={setNotifMessages} trackColor={{ false: isDark ? "#334155" : "#e2e8f0", true: switchColor }} thumbColor="#ffffff" />}
          />
        </Section>

        {/* Shopping */}
        <Section title="Shopping" isDark={isDark}>
          <Row
            icon="location-outline" iconColor="#f97316" iconBg="rgba(249,115,22,0.12)"
            title="Shipping Addresses"
            subtitle="Manage delivery locations"
            onPress={() => router.push("/profile/addresses" as any)}
            isDark={isDark}
          />
          <Row
            icon="card-outline" iconColor="#10b981" iconBg="rgba(16,185,129,0.12)"
            title="Payment Methods"
            subtitle="M-Pesa, cards, and more"
            onPress={() => Alert.alert("Coming Soon", "Payment methods management is coming soon.")}
            isDark={isDark}
          />
          <Row
            icon="cube-outline" iconColor="#3b82f6" iconBg="rgba(59,130,246,0.12)"
            title="My Orders"
            subtitle="View and track your orders"
            onPress={() => router.push("/profile/orders" as any)}
            isDark={isDark}
            last
          />
        </Section>

        {/* Seller */}
        <Section title="Seller" isDark={isDark}>
          <Row
            icon="storefront-outline" iconColor="#a855f7" iconBg="rgba(168,85,247,0.12)"
            title="Seller Dashboard"
            subtitle="Manage your shop and products"
            onPress={() => router.push("/seller/" as any)}
            isDark={isDark}
          />
          <Row
            icon="star-outline" iconColor="#f59e0b" iconBg="rgba(245,158,11,0.12)"
            title="Premium Plans"
            subtitle="Upgrade for more features"
            onPress={() => router.push("/(tabs)/premium" as any)}
            isDark={isDark}
            last
          />
        </Section>

        {/* Support */}
        <Section title="Support" isDark={isDark}>
          <Row
            icon="help-circle-outline" iconColor="#3b82f6" iconBg="rgba(59,130,246,0.12)"
            title="Help Center"
            subtitle="FAQs and guides"
            onPress={() => router.push("/(tabs)/help" as any)}
            isDark={isDark}
          />
          <Row
            icon="chatbox-ellipses-outline" iconColor="#10b981" iconBg="rgba(16,185,129,0.12)"
            title="Contact Support"
            subtitle="Get in touch with our team"
            onPress={() => router.push("/(tabs)/contact" as any)}
            isDark={isDark}
          />
          <Row
            icon="document-text-outline" iconColor="#64748b" iconBg={isDark ? "#1e293b" : "#f1f5f9"}
            title="Terms of Service"
            subtitle="Read our terms"
            onPress={() => router.push("/(tabs)/terms" as any)}
            isDark={isDark}
          />
          <Row
            icon="shield-checkmark-outline" iconColor="#64748b" iconBg={isDark ? "#1e293b" : "#f1f5f9"}
            title="Privacy Policy"
            subtitle="How we handle your data"
            onPress={() => router.push("/(tabs)/privacy" as any)}
            isDark={isDark}
            last
          />
        </Section>

        {/* Danger zone */}
        <Section title="Danger Zone" isDark={isDark}>
          <Row
            icon="log-out-outline" iconColor="#ef4444" iconBg="rgba(239,68,68,0.1)"
            title="Sign Out"
            isDark={isDark}
            danger
            onPress={() => signOutMutation.mutate()}
            right={signOutMutation.isPending ? <ActivityIndicator size="small" color="#ef4444" /> : undefined}
          />
          <Row
            icon="trash-outline" iconColor="#ef4444" iconBg="rgba(239,68,68,0.1)"
            title="Delete Account"
            subtitle="Permanently remove all your data"
            isDark={isDark}
            danger
            last
            onPress={handleDeleteAccount}
          />
        </Section>

        {/* App version */}
        <Text style={{ fontFamily: "Ubuntu-Regular", fontSize: 11, color: isDark ? "#334155" : "#cbd5e1", textAlign: "center", marginTop: 8 }}>
          .Soko v1.0.0
        </Text>
      </ScrollView>

      <ChangePasswordModal visible={showPasswordModal} onClose={() => setShowPasswordModal(false)} isDark={isDark} />
      <ThemeModal visible={showThemeModal} onClose={() => setShowThemeModal(false)} current={theme} onSelect={handleThemeChange} isDark={isDark} />
    </View>
  );
}
