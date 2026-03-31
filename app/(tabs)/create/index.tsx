"use client";
import React, { useState, useCallback, useEffect } from "react";
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  Image, ActivityIndicator, Alert, KeyboardAvoidingView,
  Platform, Modal, FlatList,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useMyShop } from "@/hooks/useShop";
import { CATEGORIES } from "@/constants/categories";
import api from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────
interface PickedImage {
  uri: string;
  type: string;
  name: string;
}

interface FormData {
  name: string;
  category: string;
  description: string;
  price: string;
  stock: string;
}

const INITIAL_FORM: FormData = {
  name: "",
  category: "",
  description: "",
  price: "",
  stock: "1",
};

const STEPS = ["Basics", "Details", "Media"];

// ─── Category Picker Modal ─────────────────────────────────────────────────────
function CategoryModal({
  visible,
  selected,
  onSelect,
  onClose,
  isDark,
}: {
  visible: boolean;
  selected: string;
  onSelect: (val: string) => void;
  onClose: () => void;
  isDark: boolean;
}) {
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: isDark ? "#020617" : "#ffffff" }}>
        <View style={{
          flexDirection: "row", alignItems: "center", justifyContent: "space-between",
          paddingHorizontal: 20, paddingVertical: 16,
          borderBottomWidth: 1, borderBottomColor: isDark ? "#1e293b" : "#f1f5f9",
        }}>
          <Text style={{ fontSize: 18, fontFamily: "Ubuntu-Bold", color: isDark ? "#ffffff" : "#0f172a" }}>
            Select Category
          </Text>
          <TouchableOpacity onPress={onClose} style={{ padding: 4 }}>
            <Ionicons name="close" size={24} color={isDark ? "#94a3b8" : "#64748b"} />
          </TouchableOpacity>
        </View>
        <FlatList
          data={CATEGORIES}
          keyExtractor={(item) => item.value}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => {
            const isSelected = selected === item.value;
            return (
              <TouchableOpacity
                onPress={() => { onSelect(item.value); onClose(); }}
                style={{
                  flexDirection: "row", alignItems: "center", gap: 12,
                  paddingVertical: 14, paddingHorizontal: 16,
                  borderRadius: 14, marginBottom: 4,
                  backgroundColor: isSelected
                    ? (isDark ? "rgba(59,130,246,0.15)" : "rgba(59,130,246,0.08)")
                    : "transparent",
                }}
              >
                <Ionicons
                  name={(item.iconFamily === "Ionicons" ? item.iconName : "grid-outline") as any}
                  size={20}
                  color={isSelected ? "#3b82f6" : (isDark ? "#94a3b8" : "#64748b")}
                />
                <Text style={{
                  flex: 1, fontSize: 14, fontFamily: "Ubuntu-Medium",
                  color: isSelected ? "#3b82f6" : (isDark ? "#e2e8f0" : "#0f172a"),
                }}>
                  {item.name}
                </Text>
                {isSelected && <Ionicons name="checkmark-circle" size={18} color="#3b82f6" />}
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </Modal>
  );
}

// ─── Main Screen ───────────────────────────────────────────────────────────────
export default function CreateScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isDark } = useColorScheme();
  const queryClient = useQueryClient();

  const { data: myShop, isLoading: isShopLoading } = useMyShop();

  const [step, setStep] = useState(0); // 0=Basics, 1=Details, 2=Media
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [images, setImages] = useState<PickedImage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const iconColor = isDark ? "#ffffff" : "#0f172a";
  const mutedColor = isDark ? "#94a3b8" : "#64748b";
  const borderColor = isDark ? "#1e293b" : "#e2e8f0";
  const inputBg = isDark ? "#0f172a" : "#f8fafc";
  const cardBg = isDark ? "#0f172a" : "#ffffff";

  const selectedCategory = CATEGORIES.find((c) => c.value === form.category);

  // ── Validation per step ──────────────────────────────────────────────────────
  const canProceed = useCallback(() => {
    if (step === 0) return form.name.trim().length > 0 && form.category.length > 0;
    if (step === 1) return form.description.trim().length > 0 && Number(form.price) > 0 && Number(form.stock) >= 1;
    if (step === 2) return images.length > 0;
    return false;
  }, [step, form, images]);

  // ── Image picker ─────────────────────────────────────────────────────────────
  const pickImages = async () => {
    if (images.length >= 10) {
      Alert.alert("Limit reached", "You can upload up to 10 images.");
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Please allow access to your photo library.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 10 - images.length,
    });

    if (!result.canceled) {
      const picked: PickedImage[] = result.assets.map((asset) => ({
        uri: asset.uri,
        type: asset.mimeType || "image/jpeg",
        name: asset.fileName || `photo_${Date.now()}.jpg`,
      }));
      setImages((prev) => [...prev, ...picked].slice(0, 10));
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    const token = await AsyncStorage.getItem("accessToken");
    if (!token) {
      Alert.alert("Not logged in", "Please sign in to post a product.");
      router.push("/(auth)/login" as any);
      return;
    }

    if (!myShop) {
      Alert.alert(
        "No shop found",
        "You need to register a shop before posting products.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Create Shop", onPress: () => router.push("/shop/create" as any) },
        ]
      );
      return;
    }

    if (images.length === 0) {
      Alert.alert("Images required", "Please add at least one product image.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("description", form.description.trim());
      formData.append("content", form.description.trim());
      formData.append("price", form.price);
      formData.append("category", form.category);
      formData.append("stock", form.stock);

      images.forEach((img) => {
        formData.append("image", {
          uri: img.uri,
          type: img.type,
          name: img.name,
        } as any);
      });

      const response = await api.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 60000, // image uploads can be slow
      });

      if (response.data.success) {
        // Invalidate relevant caches
        queryClient.invalidateQueries({ queryKey: ["products"] });
        queryClient.invalidateQueries({ queryKey: ["my-products"] });
        queryClient.invalidateQueries({ queryKey: ["product-feed"] });

        Alert.alert("Published!", "Your product is now live.", [
          {
            text: "View Product",
            onPress: () => {
              const pid = response.data.data?.id || response.data.data?._id;
              resetForm();
              if (pid) router.push(`/shop/product/${pid}` as any);
            },
          },
          { text: "Post Another", onPress: resetForm },
        ]);
      } else {
        throw new Error(response.data.message || "Failed to create product");
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.friendlyMessage || err?.message || "Something went wrong";
      Alert.alert("Error", msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setImages([]);
    setStep(0);
  };

  // ── Auth + shop guard ────────────────────────────────────────────────────────
  const [token, setToken] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    AsyncStorage.getItem("accessToken").then(setToken).catch(() => setToken(null));
  }, []);

  // Still resolving token or shop
  if (token === undefined || (token && isShopLoading)) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: isDark ? "#020617" : "#f8fafc" }}>
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  // Not logged in
  if (!token) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32, backgroundColor: isDark ? "#020617" : "#f8fafc" }}>
        <View style={{
          width: 72, height: 72, borderRadius: 20,
          backgroundColor: isDark ? "#1e293b" : "#fee2e2",
          alignItems: "center", justifyContent: "center", marginBottom: 20,
        }}>
          <Ionicons name="lock-closed" size={32} color="#ef4444" />
        </View>
        <Text style={{ fontSize: 20, fontFamily: "Ubuntu-Bold", color: isDark ? "#ffffff" : "#0f172a", textAlign: "center", marginBottom: 8 }}>
          Sign in required
        </Text>
        <Text style={{ fontSize: 14, fontFamily: "Ubuntu-Regular", color: isDark ? "#94a3b8" : "#64748b", textAlign: "center", marginBottom: 32, lineHeight: 22 }}>
          You need to be signed in to post a product.
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/(auth)/login" as any)}
          style={{
            backgroundColor: "#f97316", paddingHorizontal: 32, paddingVertical: 14,
            borderRadius: 16, width: "100%", alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 15, fontFamily: "Ubuntu-Bold", color: "#ffffff" }}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/(auth)/register" as any)}
          style={{ marginTop: 12, paddingVertical: 14, width: "100%", alignItems: "center" }}
        >
          <Text style={{ fontSize: 14, fontFamily: "Ubuntu-Medium", color: isDark ? "#94a3b8" : "#64748b" }}>
            Don't have an account? <Text style={{ color: "#f97316" }}>Register</Text>
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Logged in but no shop
  if (!myShop) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32, backgroundColor: isDark ? "#020617" : "#f8fafc" }}>
        <View style={{
          width: 72, height: 72, borderRadius: 20,
          backgroundColor: isDark ? "#1e293b" : "#fef3c7",
          alignItems: "center", justifyContent: "center", marginBottom: 20,
        }}>
          <Ionicons name="storefront-outline" size={32} color="#f59e0b" />
        </View>
        <Text style={{ fontSize: 20, fontFamily: "Ubuntu-Bold", color: isDark ? "#ffffff" : "#0f172a", textAlign: "center", marginBottom: 8 }}>
          No shop found
        </Text>
        <Text style={{ fontSize: 14, fontFamily: "Ubuntu-Regular", color: isDark ? "#94a3b8" : "#64748b", textAlign: "center", marginBottom: 32, lineHeight: 22 }}>
          You need to register a shop before you can post products.
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/shop/create" as any)}
          style={{
            backgroundColor: "#f97316", paddingHorizontal: 32, paddingVertical: 14,
            borderRadius: 16, width: "100%", alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 15, fontFamily: "Ubuntu-Bold", color: "#ffffff" }}>Create a Shop</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginTop: 12, paddingVertical: 14, width: "100%", alignItems: "center" }}
        >
          <Text style={{ fontSize: 14, fontFamily: "Ubuntu-Medium", color: isDark ? "#94a3b8" : "#64748b" }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: isDark ? "#020617" : "#f8fafc" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View style={{
        paddingTop: insets.top + 16,
        paddingHorizontal: 20, paddingBottom: 12,
        backgroundColor: cardBg,
        borderBottomWidth: 1, borderBottomColor: borderColor,
      }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "rgba(249,115,22,0.12)", alignItems: "center", justifyContent: "center" }}>
              <Ionicons name="add-circle" size={20} color="#f97316" />
            </View>
            <View>
              <Text style={{ fontSize: 17, fontFamily: "Ubuntu-Bold", color: isDark ? "#ffffff" : "#0f172a" }}>
                Post Product
              </Text>
              {myShop && (
                <Text style={{ fontSize: 11, fontFamily: "Ubuntu-Regular", color: mutedColor }}>
                  {myShop.name}
                </Text>
              )}
            </View>
          </View>
          {isSubmitting && <ActivityIndicator size="small" color="#f97316" />}
        </View>

        {/* Step indicator */}
        <View style={{ flexDirection: "row", gap: 6 }}>
          {STEPS.map((label, i) => (
            <View key={i} style={{ flex: 1, alignItems: "center", gap: 4 }}>
              <View style={{
                height: 3, width: "100%", borderRadius: 2,
                backgroundColor: i <= step ? "#f97316" : (isDark ? "#1e293b" : "#e2e8f0"),
              }} />
              <Text style={{
                fontSize: 10, fontFamily: "Ubuntu-Bold",
                color: i === step ? "#f97316" : (i < step ? "#3b82f6" : mutedColor),
                textTransform: "uppercase", letterSpacing: 0.5,
              }}>
                {label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Step 0: Basics ─────────────────────────────────────────────────── */}
        {step === 0 && (
          <View style={{ gap: 20 }}>
            <Text style={{ fontSize: 13, fontFamily: "Ubuntu-Bold", color: mutedColor, textTransform: "uppercase", letterSpacing: 1 }}>
              Basic Information
            </Text>

            {/* Product Name */}
            <View style={{ gap: 6 }}>
              <Text style={{ fontSize: 12, fontFamily: "Ubuntu-Bold", color: isDark ? "#cbd5e1" : "#475569" }}>
                Product Name *
              </Text>
              <TextInput
                value={form.name}
                onChangeText={(v) => setForm((p) => ({ ...p, name: v }))}
                placeholder="e.g., Vintage Leather Jacket"
                placeholderTextColor={mutedColor}
                style={{
                  backgroundColor: inputBg, borderWidth: 1, borderColor,
                  borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14,
                  fontSize: 14, fontFamily: "Ubuntu-Regular",
                  color: isDark ? "#ffffff" : "#0f172a",
                }}
                maxLength={100}
              />
            </View>

            {/* Category */}
            <View style={{ gap: 6 }}>
              <Text style={{ fontSize: 12, fontFamily: "Ubuntu-Bold", color: isDark ? "#cbd5e1" : "#475569" }}>
                Category *
              </Text>
              <TouchableOpacity
                onPress={() => setShowCategoryModal(true)}
                style={{
                  backgroundColor: inputBg, borderWidth: 1, borderColor,
                  borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14,
                  flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                  {selectedCategory ? (
                    <>
                      <Ionicons
                        name={(selectedCategory.iconFamily === "Ionicons" ? selectedCategory.iconName : "grid-outline") as any}
                        size={18}
                        color="#3b82f6"
                      />
                      <Text style={{ fontSize: 14, fontFamily: "Ubuntu-Medium", color: isDark ? "#ffffff" : "#0f172a" }}>
                        {selectedCategory.name}
                      </Text>
                    </>
                  ) : (
                    <Text style={{ fontSize: 14, fontFamily: "Ubuntu-Regular", color: mutedColor }}>
                      Select a category
                    </Text>
                  )}
                </View>
                <Ionicons name="chevron-down" size={18} color={mutedColor} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ── Step 1: Details ────────────────────────────────────────────────── */}
        {step === 1 && (
          <View style={{ gap: 20 }}>
            <Text style={{ fontSize: 13, fontFamily: "Ubuntu-Bold", color: mutedColor, textTransform: "uppercase", letterSpacing: 1 }}>
              Details & Pricing
            </Text>

            {/* Description */}
            <View style={{ gap: 6 }}>
              <Text style={{ fontSize: 12, fontFamily: "Ubuntu-Bold", color: isDark ? "#cbd5e1" : "#475569" }}>
                Description *
              </Text>
              <TextInput
                value={form.description}
                onChangeText={(v) => setForm((p) => ({ ...p, description: v }))}
                placeholder="Describe your product in detail..."
                placeholderTextColor={mutedColor}
                multiline
                numberOfLines={5}
                maxLength={1000}
                style={{
                  backgroundColor: inputBg, borderWidth: 1, borderColor,
                  borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14,
                  fontSize: 14, fontFamily: "Ubuntu-Regular",
                  color: isDark ? "#ffffff" : "#0f172a",
                  minHeight: 120, textAlignVertical: "top",
                }}
              />
              <Text style={{ fontSize: 10, fontFamily: "Ubuntu-Regular", color: mutedColor, textAlign: "right" }}>
                {form.description.length}/1000
              </Text>
            </View>

            {/* Price & Stock row */}
            <View style={{ flexDirection: "row", gap: 12 }}>
              <View style={{ flex: 1, gap: 6 }}>
                <Text style={{ fontSize: 12, fontFamily: "Ubuntu-Bold", color: isDark ? "#cbd5e1" : "#475569" }}>
                  Price (KES) *
                </Text>
                <View style={{
                  backgroundColor: inputBg, borderWidth: 1, borderColor,
                  borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14,
                  flexDirection: "row", alignItems: "center", gap: 6,
                }}>
                  <Text style={{ fontSize: 13, fontFamily: "Ubuntu-Bold", color: "#f97316" }}>KES</Text>
                  <TextInput
                    value={form.price}
                    onChangeText={(v) => setForm((p) => ({ ...p, price: v.replace(/[^0-9.]/g, "") }))}
                    placeholder="0.00"
                    placeholderTextColor={mutedColor}
                    keyboardType="decimal-pad"
                    style={{
                      flex: 1, fontSize: 14, fontFamily: "Ubuntu-Medium",
                      color: isDark ? "#ffffff" : "#0f172a", padding: 0,
                    }}
                  />
                </View>
              </View>

              <View style={{ flex: 1, gap: 6 }}>
                <Text style={{ fontSize: 12, fontFamily: "Ubuntu-Bold", color: isDark ? "#cbd5e1" : "#475569" }}>
                  Stock *
                </Text>
                <View style={{
                  backgroundColor: inputBg, borderWidth: 1, borderColor,
                  borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14,
                  flexDirection: "row", alignItems: "center", gap: 8,
                }}>
                  <TouchableOpacity onPress={() => setForm((p) => ({ ...p, stock: String(Math.max(1, Number(p.stock) - 1)) }))}>
                    <Ionicons name="remove-circle-outline" size={20} color={mutedColor} />
                  </TouchableOpacity>
                  <TextInput
                    value={form.stock}
                    onChangeText={(v) => setForm((p) => ({ ...p, stock: v.replace(/[^0-9]/g, "") || "1" }))}
                    keyboardType="number-pad"
                    style={{
                      flex: 1, textAlign: "center", fontSize: 14,
                      fontFamily: "Ubuntu-Bold", color: isDark ? "#ffffff" : "#0f172a", padding: 0,
                    }}
                  />
                  <TouchableOpacity onPress={() => setForm((p) => ({ ...p, stock: String(Number(p.stock) + 1) }))}>
                    <Ionicons name="add-circle-outline" size={20} color={mutedColor} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* ── Step 2: Media ──────────────────────────────────────────────────── */}
        {step === 2 && (
          <View style={{ gap: 20 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 13, fontFamily: "Ubuntu-Bold", color: mutedColor, textTransform: "uppercase", letterSpacing: 1 }}>
                Product Images
              </Text>
              <Text style={{ fontSize: 11, fontFamily: "Ubuntu-Regular", color: mutedColor }}>
                {images.length}/10
              </Text>
            </View>

            {/* Image grid */}
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
              {images.map((img, idx) => (
                <View key={idx} style={{ width: "30%", aspectRatio: 1, borderRadius: 14, overflow: "hidden", position: "relative" }}>
                  <Image source={{ uri: img.uri }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
                  {/* First image badge */}
                  {idx === 0 && (
                    <View style={{
                      position: "absolute", top: 6, left: 6,
                      backgroundColor: "#f97316", borderRadius: 6,
                      paddingHorizontal: 6, paddingVertical: 2,
                    }}>
                      <Text style={{ fontSize: 9, fontFamily: "Ubuntu-Bold", color: "#ffffff" }}>COVER</Text>
                    </View>
                  )}
                  <TouchableOpacity
                    onPress={() => removeImage(idx)}
                    style={{
                      position: "absolute", top: 6, right: 6,
                      width: 24, height: 24, borderRadius: 12,
                      backgroundColor: "rgba(0,0,0,0.55)",
                      alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <Ionicons name="close" size={14} color="#ffffff" />
                  </TouchableOpacity>
                </View>
              ))}

              {/* Add more button */}
              {images.length < 10 && (
                <TouchableOpacity
                  onPress={pickImages}
                  style={{
                    width: "30%", aspectRatio: 1, borderRadius: 14,
                    borderWidth: 2, borderStyle: "dashed",
                    borderColor: isDark ? "#334155" : "#cbd5e1",
                    alignItems: "center", justifyContent: "center",
                    backgroundColor: isDark ? "#0f172a" : "#f8fafc",
                    gap: 4,
                  }}
                >
                  <Ionicons name="add" size={24} color={mutedColor} />
                  <Text style={{ fontSize: 10, fontFamily: "Ubuntu-Bold", color: mutedColor }}>
                    {images.length === 0 ? "Add Photos" : "Add More"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {images.length === 0 && (
              <View style={{
                padding: 24, borderRadius: 16,
                backgroundColor: isDark ? "#0f172a" : "#f8fafc",
                borderWidth: 1, borderColor,
                alignItems: "center", gap: 8,
              }}>
                <Ionicons name="images-outline" size={40} color={mutedColor} />
                <Text style={{ fontSize: 13, fontFamily: "Ubuntu-Bold", color: isDark ? "#e2e8f0" : "#475569" }}>
                  No images selected
                </Text>
                <Text style={{ fontSize: 12, fontFamily: "Ubuntu-Regular", color: mutedColor, textAlign: "center" }}>
                  Add up to 10 photos. The first image will be the cover.
                </Text>
                <TouchableOpacity
                  onPress={pickImages}
                  style={{
                    marginTop: 8, paddingHorizontal: 24, paddingVertical: 10,
                    backgroundColor: "#f97316", borderRadius: 12,
                  }}
                >
                  <Text style={{ fontSize: 13, fontFamily: "Ubuntu-Bold", color: "#ffffff" }}>
                    Choose Photos
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Summary card before submit */}
            {images.length > 0 && (
              <View style={{
                padding: 16, borderRadius: 16,
                backgroundColor: isDark ? "#0f172a" : "#f0fdf4",
                borderWidth: 1, borderColor: isDark ? "#166534" : "#bbf7d0",
                gap: 8,
              }}>
                <Text style={{ fontSize: 12, fontFamily: "Ubuntu-Bold", color: isDark ? "#86efac" : "#166534" }}>
                  Ready to publish
                </Text>
                <Text style={{ fontSize: 12, fontFamily: "Ubuntu-Regular", color: isDark ? "#4ade80" : "#15803d" }}>
                  {form.name} · KES {Number(form.price).toLocaleString()} · {form.stock} in stock
                </Text>
                <Text style={{ fontSize: 11, fontFamily: "Ubuntu-Regular", color: isDark ? "#4ade80" : "#15803d" }}>
                  {selectedCategory?.name} · {images.length} image{images.length > 1 ? "s" : ""}
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Bottom navigation */}
      <View style={{
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: Math.max(insets.bottom, 16),
        backgroundColor: cardBg,
        borderTopWidth: 1, borderTopColor: borderColor,
        flexDirection: "row", gap: 12,
      }}>
        {step > 0 && (
          <TouchableOpacity
            onPress={() => setStep((s) => s - 1)}
            disabled={isSubmitting}
            style={{
              flex: 1, height: 52, borderRadius: 16,
              borderWidth: 1, borderColor,
              alignItems: "center", justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 14, fontFamily: "Ubuntu-Bold", color: isDark ? "#e2e8f0" : "#0f172a" }}>
              Back
            </Text>
          </TouchableOpacity>
        )}

        {step < 2 ? (
          <TouchableOpacity
            onPress={() => setStep((s) => s + 1)}
            disabled={!canProceed()}
            style={{
              flex: 2, height: 52, borderRadius: 16,
              backgroundColor: canProceed() ? "#f97316" : (isDark ? "#1e293b" : "#e2e8f0"),
              alignItems: "center", justifyContent: "center",
              flexDirection: "row", gap: 8,
            }}
          >
            <Text style={{
              fontSize: 14, fontFamily: "Ubuntu-Bold",
              color: canProceed() ? "#ffffff" : mutedColor,
            }}>
              Next
            </Text>
            <Ionicons name="arrow-forward" size={16} color={canProceed() ? "#ffffff" : mutedColor} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isSubmitting || images.length === 0}
            style={{
              flex: 2, height: 52, borderRadius: 16,
              backgroundColor: (isSubmitting || images.length === 0) ? (isDark ? "#1e293b" : "#e2e8f0") : "#f97316",
              alignItems: "center", justifyContent: "center",
              flexDirection: "row", gap: 8,
            }}
          >
            {isSubmitting ? (
              <>
                <ActivityIndicator size="small" color="#ffffff" />
                <Text style={{ fontSize: 14, fontFamily: "Ubuntu-Bold", color: "#ffffff" }}>Publishing...</Text>
              </>
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={18} color={images.length === 0 ? mutedColor : "#ffffff"} />
                <Text style={{
                  fontSize: 14, fontFamily: "Ubuntu-Bold",
                  color: images.length === 0 ? mutedColor : "#ffffff",
                }}>
                  Publish
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Category picker modal */}
      <CategoryModal
        visible={showCategoryModal}
        selected={form.category}
        onSelect={(val) => setForm((p) => ({ ...p, category: val }))}
        onClose={() => setShowCategoryModal(false)}
        isDark={isDark}
      />
    </KeyboardAvoidingView>
  );
}
