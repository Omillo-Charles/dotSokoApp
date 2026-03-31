import React, { useState, useEffect, useRef } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator,
  Modal, TextInput, KeyboardAvoidingView, Platform, Animated,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import { useAddresses, Address } from "@/hooks/useAddresses";
import { useAppModal } from "@/components/modals/AppModal";

// ── Types ────────────────────────────────────────────────────────────────────
type AddressType = "home" | "work" | "other";

interface FormData {
  name: string;
  phone: string;
  type: AddressType;
  city: string;
  street: string;
  isDefault: boolean;
}

const INITIAL_FORM: FormData = {
  name: "", phone: "", type: "home", city: "", street: "", isDefault: false,
};

const TYPE_CONFIG: Record<AddressType, { icon: keyof typeof Ionicons.glyphMap; label: string; color: string; bg: string; darkBg: string }> = {
  home: { icon: "home-outline", label: "Home", color: "#3b82f6", bg: "rgba(59,130,246,0.1)", darkBg: "rgba(59,130,246,0.15)" },
  work: { icon: "briefcase-outline", label: "Work", color: "#f59e0b", bg: "rgba(245,158,11,0.1)", darkBg: "rgba(245,158,11,0.15)" },
  other: { icon: "location-outline", label: "Other", color: "#a855f7", bg: "rgba(168,85,247,0.1)", darkBg: "rgba(168,85,247,0.15)" },
};

// ── Address card ───────────────────────────────────────────────────────────────
function AddressCard({
  address, isDark, onEdit, onDelete, onSetDefault, isSettingDefault,
}: {
  address: Address;
  isDark: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
  isSettingDefault: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const cfg = TYPE_CONFIG[address.type] ?? TYPE_CONFIG.other;
  const borderColor = address.isDefault
    ? "rgba(249,115,22,0.4)"
    : (isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9");
  const cardBg = isDark ? "#0f172a" : "#ffffff";

  return (
    <View style={{
      backgroundColor: cardBg, borderRadius: 24,
      borderWidth: address.isDefault ? 1.5 : 1, borderColor,
      padding: 20, marginBottom: 12,
    }}>
      {/* Top row */}
      <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          {/* Type icon */}
          <View style={{
            width: 44, height: 44, borderRadius: 14,
            backgroundColor: isDark ? cfg.darkBg : cfg.bg,
            alignItems: "center", justifyContent: "center",
          }}>
            <Ionicons name={cfg.icon} size={20} color={cfg.color} />
          </View>
          <View>
            <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 15, color: isDark ? "#ffffff" : "#0f172a", textTransform: "capitalize" }}>
              {cfg.label}
            </Text>
            {address.isDefault && (
              <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 10, color: "#f97316", textTransform: "uppercase", letterSpacing: 0.8, marginTop: 1 }}>
                Primary
              </Text>
            )}
          </View>
        </View>

        {/* Menu */}
        <View>
          <TouchableOpacity
            onPress={() => setMenuOpen((v) => !v)}
            style={{ padding: 6, borderRadius: 10, backgroundColor: isDark ? "#1e293b" : "#f8fafc" }}
          >
            <Ionicons name="ellipsis-horizontal" size={18} color={isDark ? "#94a3b8" : "#64748b"} />
          </TouchableOpacity>

          {menuOpen && (
            <View style={{
              position: "absolute", right: 0, top: 36, zIndex: 50,
              backgroundColor: isDark ? "#1e293b" : "#ffffff",
              borderRadius: 16, borderWidth: 1,
              borderColor: isDark ? "rgba(255,255,255,0.08)" : "#f1f5f9",
              minWidth: 160, overflow: "hidden",
              shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 12, elevation: 8,
            }}>
              {!address.isDefault && (
                <TouchableOpacity
                  onPress={() => { setMenuOpen(false); onSetDefault(); }}
                  style={{ paddingHorizontal: 16, paddingVertical: 12, flexDirection: "row", alignItems: "center", gap: 10 }}
                >
                  <Ionicons name="star-outline" size={15} color="#f97316" />
                  <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 12, color: isDark ? "#e2e8f0" : "#0f172a" }}>Set as Primary</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => { setMenuOpen(false); onEdit(); }}
                style={{ paddingHorizontal: 16, paddingVertical: 12, flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <Ionicons name="create-outline" size={15} color={isDark ? "#94a3b8" : "#64748b"} />
                <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 12, color: isDark ? "#e2e8f0" : "#0f172a" }}>Edit Details</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => { setMenuOpen(false); onDelete(); }}
                style={{ paddingHorizontal: 16, paddingVertical: 12, flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <Ionicons name="trash-outline" size={15} color="#ef4444" />
                <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 12, color: "#ef4444" }}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Details */}
      <View style={{ gap: 8 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Ionicons name="person-outline" size={14} color={isDark ? "#64748b" : "#94a3b8"} />
          <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 14, color: isDark ? "#ffffff" : "#0f172a" }}>{address.name}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}>
          <Ionicons name="map-outline" size={14} color={isDark ? "#64748b" : "#94a3b8"} style={{ marginTop: 2 }} />
          <View>
            <Text style={{ fontFamily: "Ubuntu-Medium", fontSize: 13, color: isDark ? "#cbd5e1" : "#334155" }}>{address.street}</Text>
            <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 10, color: isDark ? "#64748b" : "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8, marginTop: 2 }}>
              {address.city}, Kenya
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Ionicons name="call-outline" size={14} color={isDark ? "#64748b" : "#94a3b8"} />
          <Text style={{ fontFamily: "Ubuntu-Medium", fontSize: 13, color: isDark ? "#cbd5e1" : "#334155" }}>{address.phone}</Text>
        </View>
      </View>
    </View>
  );
}

// ── Add / Edit modal (3-step) ──────────────────────────────────────────────────
function AddressFormModal({
  visible, onClose, onSubmit, initialData, mode, isDark, isSubmitting,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  initialData: Address | null;
  mode: "create" | "edit";
  isDark: boolean;
  isSubmitting: boolean;
}) {
  const [step, setStep] = useState(0); // 0=Identity, 1=Type, 2=Location
  const [form, setForm] = useState<FormData>(INITIAL_FORM);

  useEffect(() => {
    if (visible) {
      setStep(0);
      setForm(initialData
        ? { name: initialData.name, phone: initialData.phone, type: initialData.type, city: initialData.city, street: initialData.street, isDefault: initialData.isDefault }
        : INITIAL_FORM
      );
    }
  }, [visible, initialData]);

  const STEPS = ["Identity", "Type", "Location"];
  const inputBg = isDark ? "#0f172a" : "#f8fafc";
  const borderColor = isDark ? "#1e293b" : "#e2e8f0";
  const labelColor = isDark ? "#94a3b8" : "#64748b";
  const textColor = isDark ? "#ffffff" : "#0f172a";

  const canNext = () => {
    if (step === 0) return form.name.trim().length > 0 && form.phone.trim().length > 0;
    if (step === 1) return true;
    return form.city.trim().length > 0 && form.street.trim().length > 0;
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <KeyboardAvoidingView style={{ flex: 1, backgroundColor: isDark ? "#020617" : "#ffffff" }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        {/* Header */}
        <View style={{
          flexDirection: "row", alignItems: "center", justifyContent: "space-between",
          paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16,
          borderBottomWidth: 1, borderBottomColor: isDark ? "#1e293b" : "#f1f5f9",
        }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: "rgba(249,115,22,0.12)", alignItems: "center", justifyContent: "center" }}>
              <Ionicons name="location" size={20} color="#f97316" />
            </View>
            <View>
              <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 16, color: textColor }}>
                {mode === "edit" ? "Edit Address" : "Add Address"}
              </Text>
              <Text style={{ fontFamily: "Ubuntu-Regular", fontSize: 12, color: labelColor }}>
                {mode === "edit" ? "Update delivery location" : "New delivery spot"}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} style={{ padding: 6 }}>
            <Ionicons name="close" size={22} color={labelColor} />
          </TouchableOpacity>
        </View>

        {/* Step indicator */}
        <View style={{ flexDirection: "row", paddingHorizontal: 20, paddingVertical: 14, gap: 8 }}>
          {STEPS.map((label, i) => (
            <View key={i} style={{ flex: 1, alignItems: "center", gap: 4 }}>
              <View style={{ height: 3, width: "100%", borderRadius: 2, backgroundColor: i <= step ? "#f97316" : (isDark ? "#1e293b" : "#e2e8f0") }} />
              <Text style={{ fontSize: 10, fontFamily: "Ubuntu-Bold", color: i === step ? "#f97316" : labelColor, textTransform: "uppercase", letterSpacing: 0.5 }}>
                {label}
              </Text>
            </View>
          ))}
        </View>

        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
          {/* Step 0 — Identity */}
          {step === 0 && (
            <View style={{ gap: 16 }}>
              <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 13, color: labelColor, textTransform: "uppercase", letterSpacing: 1 }}>Contact Details</Text>

              <View style={{ gap: 6 }}>
                <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 12, color: isDark ? "#cbd5e1" : "#475569" }}>Full Name *</Text>
                <TextInput
                  value={form.name}
                  onChangeText={(v) => setForm((p) => ({ ...p, name: v }))}
                  placeholder="e.g. John Doe"
                  placeholderTextColor={labelColor}
                  style={{ backgroundColor: inputBg, borderWidth: 1, borderColor, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, fontSize: 14, fontFamily: "Ubuntu-Regular", color: textColor }}
                />
              </View>

              <View style={{ gap: 6 }}>
                <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 12, color: isDark ? "#cbd5e1" : "#475569" }}>Phone Number *</Text>
                <View style={{ backgroundColor: inputBg, borderWidth: 1, borderColor, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <Ionicons name="call-outline" size={18} color={labelColor} />
                  <TextInput
                    value={form.phone}
                    onChangeText={(v) => setForm((p) => ({ ...p, phone: v }))}
                    placeholder="+254 XXX XXX XXX"
                    placeholderTextColor={labelColor}
                    keyboardType="phone-pad"
                    style={{ flex: 1, fontSize: 14, fontFamily: "Ubuntu-Regular", color: textColor, padding: 0 }}
                  />
                </View>
              </View>
            </View>
          )}

          {/* Step 1 — Type */}
          {step === 1 && (
            <View style={{ gap: 16 }}>
              <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 13, color: labelColor, textTransform: "uppercase", letterSpacing: 1 }}>Address Type</Text>
              <Text style={{ fontFamily: "Ubuntu-Regular", fontSize: 13, color: labelColor }}>Where are we delivering to?</Text>

              <View style={{ gap: 12 }}>
                {(Object.entries(TYPE_CONFIG) as [AddressType, typeof TYPE_CONFIG.home][]).map(([value, cfg]) => {
                  const isActive = form.type === value;
                  return (
                    <TouchableOpacity
                      key={value}
                      onPress={() => setForm((p) => ({ ...p, type: value }))}
                      style={{
                        flexDirection: "row", alignItems: "center", gap: 16,
                        padding: 16, borderRadius: 16, borderWidth: isActive ? 1.5 : 1,
                        borderColor: isActive ? cfg.color : borderColor,
                        backgroundColor: isActive ? (isDark ? cfg.darkBg : cfg.bg) : (isDark ? "#0f172a" : "#f8fafc"),
                      }}
                    >
                      <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: isDark ? cfg.darkBg : cfg.bg, alignItems: "center", justifyContent: "center" }}>
                        <Ionicons name={cfg.icon} size={20} color={cfg.color} />
                      </View>
                      <Text style={{ fontFamily: isActive ? "Ubuntu-Bold" : "Ubuntu-Medium", fontSize: 15, color: isActive ? cfg.color : textColor, flex: 1 }}>
                        {cfg.label}
                      </Text>
                      {isActive && <Ionicons name="checkmark-circle" size={20} color={cfg.color} />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Step 2 — Location */}
          {step === 2 && (
            <View style={{ gap: 16 }}>
              <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 13, color: labelColor, textTransform: "uppercase", letterSpacing: 1 }}>Location Details</Text>

              <View style={{ gap: 6 }}>
                <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 12, color: isDark ? "#cbd5e1" : "#475569" }}>City / Region *</Text>
                <View style={{ backgroundColor: inputBg, borderWidth: 1, borderColor, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <Ionicons name="globe-outline" size={18} color={labelColor} />
                  <TextInput
                    value={form.city}
                    onChangeText={(v) => setForm((p) => ({ ...p, city: v }))}
                    placeholder="e.g. Nairobi"
                    placeholderTextColor={labelColor}
                    style={{ flex: 1, fontSize: 14, fontFamily: "Ubuntu-Regular", color: textColor, padding: 0 }}
                  />
                </View>
              </View>

              <View style={{ gap: 6 }}>
                <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 12, color: isDark ? "#cbd5e1" : "#475569" }}>Street / Apartment / Building *</Text>
                <View style={{ backgroundColor: inputBg, borderWidth: 1, borderColor, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <Ionicons name="home-outline" size={18} color={labelColor} />
                  <TextInput
                    value={form.street}
                    onChangeText={(v) => setForm((p) => ({ ...p, street: v }))}
                    placeholder="e.g. Kilimani, Galana Rd"
                    placeholderTextColor={labelColor}
                    style={{ flex: 1, fontSize: 14, fontFamily: "Ubuntu-Regular", color: textColor, padding: 0 }}
                  />
                </View>
              </View>

              {/* Set as default toggle */}
              <TouchableOpacity
                onPress={() => setForm((p) => ({ ...p, isDefault: !p.isDefault }))}
                style={{
                  flexDirection: "row", alignItems: "center", gap: 14,
                  padding: 16, borderRadius: 16, borderWidth: 1,
                  borderColor: form.isDefault ? "#f97316" : borderColor,
                  backgroundColor: form.isDefault ? (isDark ? "rgba(249,115,22,0.1)" : "rgba(249,115,22,0.06)") : (isDark ? "#0f172a" : "#f8fafc"),
                }}
              >
                <View style={{
                  width: 22, height: 22, borderRadius: 6, borderWidth: 1.5,
                  borderColor: form.isDefault ? "#f97316" : (isDark ? "#334155" : "#cbd5e1"),
                  backgroundColor: form.isDefault ? "#f97316" : "transparent",
                  alignItems: "center", justifyContent: "center",
                }}>
                  {form.isDefault && <Ionicons name="checkmark" size={13} color="#ffffff" />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 13, color: textColor }}>Set as primary address</Text>
                  <Text style={{ fontFamily: "Ubuntu-Regular", fontSize: 11, color: labelColor, marginTop: 2 }}>Use this for all future checkouts</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        {/* Bottom nav */}
        <View style={{
          flexDirection: "row", gap: 12, paddingHorizontal: 20, paddingTop: 12,
          paddingBottom: Platform.OS === "ios" ? 32 : 20,
          borderTopWidth: 1, borderTopColor: isDark ? "#1e293b" : "#f1f5f9",
          backgroundColor: isDark ? "#020617" : "#ffffff",
        }}>
          {step > 0 && (
            <TouchableOpacity
              onPress={() => setStep((s) => s - 1)}
              style={{ flex: 1, height: 52, borderRadius: 16, borderWidth: 1, borderColor, alignItems: "center", justifyContent: "center" }}
            >
              <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 14, color: textColor }}>Back</Text>
            </TouchableOpacity>
          )}

          {step < 2 ? (
            <TouchableOpacity
              onPress={() => setStep((s) => s + 1)}
              disabled={!canNext()}
              style={{
                flex: 2, height: 52, borderRadius: 16,
                backgroundColor: canNext() ? "#f97316" : (isDark ? "#1e293b" : "#e2e8f0"),
                alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8,
              }}
            >
              <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 14, color: canNext() ? "#ffffff" : labelColor }}>Next</Text>
              <Ionicons name="arrow-forward" size={16} color={canNext() ? "#ffffff" : labelColor} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => onSubmit(form)}
              disabled={isSubmitting || !canNext()}
              style={{
                flex: 2, height: 52, borderRadius: 16,
                backgroundColor: (isSubmitting || !canNext()) ? (isDark ? "#1e293b" : "#e2e8f0") : "#f97316",
                alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8,
              }}
            >
              {isSubmitting
                ? <ActivityIndicator size="small" color="#ffffff" />
                : <Ionicons name="checkmark-circle" size={18} color={(isSubmitting || !canNext()) ? labelColor : "#ffffff"} />
              }
              <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 14, color: (isSubmitting || !canNext()) ? labelColor : "#ffffff" }}>
                {isSubmitting ? "Saving..." : mode === "edit" ? "Update" : "Confirm"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ── Main screen ────────────────────────────────────────────────────────────────
export default function AddressesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const modal = useAppModal();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const { addresses, isLoading, isError, refetch, isRefetching, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAddresses();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const isSubmitting = addAddress.isPending || updateAddress.isPending;

  const openCreate = () => {
    setModalMode("create");
    setEditingAddress(null);
    setModalVisible(true);
  };

  const openEdit = (address: Address) => {
    setModalMode("edit");
    setEditingAddress(address);
    setModalVisible(true);
  };

  const handleSubmit = async (data: FormData) => {
    try {
      if (modalMode === "create") {
        await addAddress.mutateAsync(data as any);
      } else if (editingAddress) {
        await updateAddress.mutateAsync({ addressId: editingAddress.id, data });
      }
      setModalVisible(false);
    } catch (err: any) {
      modal.show({ title: "Error", message: err?.response?.data?.message || err?.message || "Something went wrong", variant: "error" });
    }
  };

  const handleDelete = (addressId: string) => {
    modal.show({
      title: "Remove Address",
      message: "Are you sure you want to remove this address?",
      variant: "destructive",
      actions: [
        { label: "Cancel", style: "secondary" },
        {
          label: "Remove", style: "destructive",
          onPress: () => deleteAddress.mutate(addressId, {
            onError: (err: any) => modal.show({ title: "Error", message: err?.response?.data?.message || "Failed to delete", variant: "error" }),
          }),
        },
      ],
    });
  };

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-4 py-4 flex-row items-center bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-white/5">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 mr-2">
          <Ionicons name="arrow-back" size={24} color={isDark ? "#ffffff" : "#0f172a"} />
        </TouchableOpacity>
        <Text className="text-xl font-ubuntu-bold text-slate-900 dark:text-white flex-1">My Addresses</Text>
        <TouchableOpacity
          onPress={openCreate}
          style={{ flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#f97316", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 }}
        >
          <Ionicons name="add" size={16} color="#ffffff" />
          <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 12, color: "#ffffff" }}>Add</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#f97316" />
          <Text className="mt-4 font-ubuntu text-slate-500">Loading addresses...</Text>
        </View>
      ) : isError ? (
        <View className="flex-1 items-center justify-center p-8">
          <Ionicons name="alert-circle-outline" size={48} color="#f43f5e" />
          <Text className="mt-4 font-ubuntu-bold text-slate-900 dark:text-white text-center">Failed to load addresses</Text>
          <TouchableOpacity onPress={() => refetch()} className="mt-4 px-6 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <Text className="font-ubuntu-bold text-primary">Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : addresses.length === 0 ? (
        <View className="flex-1 items-center justify-center p-8">
          <View className="w-28 h-28 bg-slate-100 dark:bg-slate-900 rounded-full items-center justify-center mb-6">
            <Ionicons name="location-outline" size={52} color="#94a3b8" />
          </View>
          <Text className="text-xl font-ubuntu-bold text-slate-900 dark:text-white mb-2">No addresses yet</Text>
          <Text className="text-slate-500 dark:text-slate-400 font-ubuntu text-center px-8 mb-8 leading-6">
            Add a delivery address to speed up checkout.
          </Text>
          <TouchableOpacity onPress={openCreate} className="bg-primary px-10 py-4 rounded-2xl">
            <Text className="text-white font-ubuntu-bold text-base">Add Address</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={isDark ? "#ffffff" : "#f97316"} />}
        >
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              isDark={isDark}
              onEdit={() => openEdit(address)}
              onDelete={() => handleDelete(address.id)}
              onSetDefault={() => setDefaultAddress.mutate(address.id)}
              isSettingDefault={setDefaultAddress.isPending}
            />
          ))}
        </ScrollView>
      )}

      <AddressFormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmit}
        initialData={editingAddress}
        mode={modalMode}
        isDark={isDark}
        isSubmitting={isSubmitting}
      />
    </View>
  );
}
