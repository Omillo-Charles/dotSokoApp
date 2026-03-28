import React, { useState, useRef, useCallback } from "react";
import {
  View, Text, TouchableOpacity, TextInput, Image,
  ActivityIndicator, FlatList, Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "../../hooks/useColorScheme";
import { useCartStore } from "../../store/useCartStore";
import { useWishlistStore } from "../../store/useWishlistStore";
import { useSearch, SearchResult } from "../../hooks/useSearch";

// ── Debounce helper ────────────────────────────────────────────────────────────
function useDebounce(value: string, delay: number) {
  const [debounced, setDebounced] = useState(value);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const update = useCallback((v: string) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setDebounced(v), delay);
  }, [delay]);
  return { debounced, update };
}

// ── Single result row ──────────────────────────────────────────────────────────
function ResultRow({ item, isDark, onPress }: { item: SearchResult; isDark: boolean; onPress: () => void }) {
  const isProduct = item.type === "product";
  const mutedColor = isDark ? "#64748b" : "#94a3b8";
  const textColor = isDark ? "#ffffff" : "#0f172a";
  const subColor = isDark ? "#94a3b8" : "#64748b";
  const tagBg = isProduct
    ? (isDark ? "rgba(59,130,246,0.15)" : "rgba(59,130,246,0.08)")
    : (isDark ? "rgba(249,115,22,0.15)" : "rgba(249,115,22,0.08)");
  const tagColor = isProduct ? "#3b82f6" : "#f97316";

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        flexDirection: "row", alignItems: "center", gap: 12,
        paddingHorizontal: 16, paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: isDark ? "rgba(255,255,255,0.04)" : "#f8fafc",
      }}
    >
      {/* Thumbnail */}
      <View style={{
        width: 44, height: 44, borderRadius: isProduct ? 10 : 22,
        overflow: "hidden", backgroundColor: isDark ? "#1e293b" : "#f1f5f9",
        borderWidth: 1, borderColor: isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9",
        flexShrink: 0,
      }}>
        {(isProduct ? (item as any).image : (item as any).avatar) ? (
          <Image
            source={{ uri: isProduct ? (item as any).image : (item as any).avatar }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        ) : (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Ionicons
              name={isProduct ? "cube-outline" : "storefront-outline"}
              size={18}
              color={mutedColor}
            />
          </View>
        )}
      </View>

      {/* Text */}
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text numberOfLines={1} style={{ fontFamily: "Ubuntu-Bold", fontSize: 13, color: textColor }}>
          {item.name}
        </Text>
        <Text numberOfLines={1} style={{ fontFamily: "Ubuntu-Regular", fontSize: 11, color: subColor, marginTop: 1 }}>
          {isProduct
            ? `${(item as any).shopName} · KES ${Number((item as any).price).toLocaleString()}`
            : `${(item as any).username ? `@${(item as any).username} · ` : ""}${(item as any).followersCount} followers`
          }
        </Text>
      </View>

      {/* Type badge */}
      <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, backgroundColor: tagBg, flexShrink: 0 }}>
        <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 9, color: tagColor, textTransform: "uppercase", letterSpacing: 0.5 }}>
          {isProduct ? "Product" : "Shop"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

// ── Header ─────────────────────────────────────────────────────────────────────
export const Header = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isDark, toggleTheme } = useColorScheme();
  const { getTotalItems: getCartTotal } = useCartStore();
  const { getTotalItems: getWishlistTotal } = useWishlistStore();
  const totalCartItems = getCartTotal();
  const totalWishlistItems = getWishlistTotal();

  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const { debounced, update } = useDebounce(inputValue, 350);
  const { results, isLoading, hasQuery } = useSearch(debounced);

  const showDropdown = isFocused && (hasQuery || isLoading);

  const handleChange = (text: string) => {
    setInputValue(text);
    update(text);
  };

  const handleResultPress = (item: SearchResult) => {
    Keyboard.dismiss();
    setInputValue("");
    update("");
    setIsFocused(false);
    if (item.type === "product") {
      router.push(`/shop/product/${item.id}` as any);
    } else {
      router.push(`/shop/${item.id}` as any);
    }
  };

  const handleClear = () => {
    setInputValue("");
    update("");
    inputRef.current?.focus();
  };

  const borderColor = isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0";
  const dropdownBg = isDark ? "#0f172a" : "#ffffff";

  return (
    <View style={{ paddingTop: insets.top, backgroundColor: isDark ? "#020617" : "#ffffff", borderBottomWidth: 1, borderBottomColor: isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9" }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12 }}>
        {/* Top row */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <Link href="/" asChild>
            <TouchableOpacity>
              <Text style={{ fontSize: 22, fontFamily: "Ubuntu-Bold", color: isDark ? "#ffffff" : "#0f172a" }}>
                <Text style={{ color: "#f97316" }}>.</Text>Soko
              </Text>
            </TouchableOpacity>
          </Link>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
            <TouchableOpacity onPress={toggleTheme}>
              <Ionicons name={isDark ? "sunny-outline" : "moon-outline"} size={22} color={isDark ? "#f8fafc" : "#64748b"} />
            </TouchableOpacity>

            <Link href="/wishlist" asChild>
              <TouchableOpacity style={{ position: "relative" }}>
                <Ionicons name="heart-outline" size={22} color={isDark ? "#f8fafc" : "#64748b"} />
                {totalWishlistItems > 0 && (
                  <View style={{ position: "absolute", top: -4, right: -4, width: 16, height: 16, borderRadius: 8, backgroundColor: "#f97316", alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ fontSize: 9, fontFamily: "Ubuntu-Bold", color: "#ffffff" }}>{totalWishlistItems}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </Link>

            <Link href="/cart" asChild>
              <TouchableOpacity style={{ position: "relative" }}>
                <Ionicons name="cart-outline" size={22} color={isDark ? "#f8fafc" : "#64748b"} />
                {totalCartItems > 0 && (
                  <View style={{ position: "absolute", top: -4, right: -4, width: 16, height: 16, borderRadius: 8, backgroundColor: "#f97316", alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ fontSize: 9, fontFamily: "Ubuntu-Bold", color: "#ffffff" }}>{totalCartItems}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* Search bar */}
        <View style={{ position: "relative" }}>
          <View style={{
            flexDirection: "row", alignItems: "center",
            backgroundColor: isDark ? "#0f172a" : "#f8fafc",
            borderWidth: 1, borderColor: isFocused ? "#f97316" : borderColor,
            borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10, gap: 10,
          }}>
            {isLoading && hasQuery
              ? <ActivityIndicator size="small" color="#f97316" />
              : <Ionicons name="search-outline" size={18} color={isFocused ? "#f97316" : "#94a3b8"} />
            }
            <TextInput
              ref={inputRef}
              value={inputValue}
              onChangeText={handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 150)}
              placeholder="Search products and shops..."
              placeholderTextColor="#94a3b8"
              returnKeyType="search"
              style={{ flex: 1, fontFamily: "Ubuntu-Regular", fontSize: 14, color: isDark ? "#ffffff" : "#0f172a", padding: 0 }}
            />
            {inputValue.length > 0 && (
              <TouchableOpacity onPress={handleClear} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="close-circle" size={18} color="#94a3b8" />
              </TouchableOpacity>
            )}
          </View>

          {/* Dropdown results */}
          {showDropdown && (
            <View style={{
              position: "absolute", top: "100%", left: 0, right: 0,
              marginTop: 4, backgroundColor: dropdownBg,
              borderRadius: 16, borderWidth: 1, borderColor,
              zIndex: 999, overflow: "hidden",
              shadowColor: "#000", shadowOpacity: 0.12, shadowRadius: 16,
              shadowOffset: { width: 0, height: 4 }, elevation: 8,
            }}>
              {isLoading ? (
                <View style={{ padding: 24, alignItems: "center" }}>
                  <ActivityIndicator size="small" color="#f97316" />
                  <Text style={{ fontFamily: "Ubuntu-Regular", fontSize: 12, color: "#94a3b8", marginTop: 8 }}>Searching...</Text>
                </View>
              ) : results.length > 0 ? (
                <>
                  <FlatList
                    data={results}
                    keyExtractor={(item) => `${item.type}-${item.id}`}
                    renderItem={({ item }) => (
                      <ResultRow item={item} isDark={isDark} onPress={() => handleResultPress(item)} />
                    )}
                    scrollEnabled={false}
                    keyboardShouldPersistTaps="handled"
                  />
                  {/* Footer hint */}
                  <View style={{ paddingHorizontal: 16, paddingVertical: 10, borderTopWidth: 1, borderTopColor: isDark ? "rgba(255,255,255,0.04)" : "#f8fafc" }}>
                    <Text style={{ fontFamily: "Ubuntu-Regular", fontSize: 11, color: "#94a3b8", textAlign: "center" }}>
                      Showing {results.filter(r => r.type === "shop").length} shops · {results.filter(r => r.type === "product").length} products
                    </Text>
                  </View>
                </>
              ) : (
                <View style={{ padding: 24, alignItems: "center" }}>
                  <Ionicons name="search-outline" size={28} color="#94a3b8" />
                  <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 13, color: isDark ? "#e2e8f0" : "#0f172a", marginTop: 10 }}>No results found</Text>
                  <Text style={{ fontFamily: "Ubuntu-Regular", fontSize: 12, color: "#94a3b8", marginTop: 4 }}>
                    Try a different keyword
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};
