import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, Platform } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCartStore, CartItem } from "../store/useCartStore";
import { useColorScheme } from "../hooks/useColorScheme";

const CartItemCard = ({ item }: { item: CartItem }) => {
  const { updateQuantity, removeItem } = useCartStore();
  const { isDark } = useColorScheme();

  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center', padding: 16,
      backgroundColor: isDark ? '#0f172a' : '#ffffff',
      borderRadius: 24, marginBottom: 16,
      borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
    }}>
      {/* Product image */}
      <View style={{
        width: 96, height: 96, borderRadius: 16, overflow: 'hidden',
        backgroundColor: isDark ? '#1e293b' : '#f8fafc', marginRight: 16,
      }}>
        <Image
          source={typeof item.image === 'string' ? { uri: item.image } : item.image}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
      </View>

      <View style={{ flex: 1 }}>
        {/* Name + delete */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
          <Text
            numberOfLines={2}
            style={{ flex: 1, marginRight: 8, fontFamily: 'Ubuntu-Bold', fontSize: 14, color: isDark ? '#ffffff' : '#0f172a' }}
          >
            {item.name}
          </Text>
          <TouchableOpacity onPress={() => removeItem(item.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="trash-outline" size={18} color="#f43f5e" />
          </TouchableOpacity>
        </View>

        {/* Category */}
        <Text style={{ fontFamily: 'Ubuntu-Regular', fontSize: 12, color: isDark ? '#94a3b8' : '#64748b', marginBottom: 12 }}>
          {item.category || 'Item'}
        </Text>

        {/* Price + quantity controls */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontFamily: 'Ubuntu-Bold', fontSize: 16, color: '#f97316' }}>
            KES {item.price.toLocaleString()}
          </Text>

          <View style={{
            flexDirection: 'row', alignItems: 'center',
            backgroundColor: isDark ? '#1e293b' : '#f1f5f9',
            borderRadius: 12, paddingHorizontal: 4, paddingVertical: 2,
          }}>
            <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity - 1)} style={{ padding: 6 }}>
              <Ionicons name="remove" size={16} color={isDark ? '#ffffff' : '#0f172a'} />
            </TouchableOpacity>
            <Text style={{ marginHorizontal: 10, fontFamily: 'Ubuntu-Bold', fontSize: 13, color: isDark ? '#ffffff' : '#0f172a', minWidth: 16, textAlign: 'center' }}>
              {item.quantity}
            </Text>
            <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity + 1)} style={{ padding: 6 }}>
              <Ionicons name="add" size={16} color={isDark ? '#ffffff' : '#0f172a'} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default function CartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark } = useColorScheme();
  const { items, getSubtotal } = useCartStore();

  const subtotal = getSubtotal();
  const shipping = subtotal > 0 ? 500 : 0;
  const total = subtotal + shipping;

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950" style={{ paddingTop: insets.top }}>
      <View className="px-6 py-5 flex-row items-center justify-between bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-white/5">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 -ml-2"
        >
          <Ionicons name="arrow-back" size={24} color={isDark ? "#ffffff" : "#0f172a"} />
        </TouchableOpacity>
        <Text className="text-xl font-ubuntu-bold text-slate-900 dark:text-white">
          My Cart
        </Text>
        <View className="w-10" />
      </View>

      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
      >
        {items.length > 0 ? (
          <>
            {items.map((item) => (
              <CartItemCard key={item.id} item={item} />
            ))}

            <TouchableOpacity className="flex-row items-center justify-between p-5 bg-white dark:bg-slate-900 rounded-3xl mb-6 shadow-sm border border-slate-100 dark:border-white/5">
              <View className="flex-row items-center">
                <Ionicons name="ticket-outline" size={24} color="#f97316" />
                <Text className="ml-3 font-ubuntu text-slate-900 dark:text-white text-base">
                  Apply Promo Code
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
            </TouchableOpacity>

            <View className="bg-white dark:bg-slate-900 rounded-3xl p-6 mb-10 shadow-sm border border-slate-100 dark:border-white/5">
              <View className="flex-row justify-between mb-4">
                <Text className="font-ubuntu text-slate-500 dark:text-slate-400">Subtotal</Text>
                <Text className="font-ubuntu-bold text-slate-900 dark:text-white">Ksh {subtotal.toLocaleString()}</Text>
              </View>
              <View className="flex-row justify-between mb-4">
                <Text className="font-ubuntu text-slate-500 dark:text-slate-400">Shipping</Text>
                <Text className="font-ubuntu-bold text-slate-900 dark:text-white">Ksh {shipping.toLocaleString()}</Text>
              </View>
              <View className="h-px bg-slate-100 dark:bg-white/5 my-2" />
              <View className="flex-row justify-between mt-2">
                <Text className="font-ubuntu-bold text-slate-900 dark:text-white text-lg">Total</Text>
                <Text className="font-ubuntu-bold text-primary text-xl">Ksh {total.toLocaleString()}</Text>
              </View>
            </View>
          </>
        ) : (
          <View className="flex-1 items-center justify-center pt-20">
            <View className="w-32 h-32 bg-slate-100 dark:bg-slate-900 rounded-full items-center justify-center mb-6">
              <Ionicons name="cart-outline" size={64} color="#94a3b8" />
            </View>
            <Text className="text-2xl font-ubuntu-bold text-slate-900 dark:text-white mb-2">
              Your cart is empty
            </Text>
            <Text className="text-slate-500 dark:text-slate-400 font-ubuntu text-center px-10 mb-8 leading-6">
              Looks like you haven't added anything to your cart yet.
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/shop")}
              className="bg-primary px-10 py-4 rounded-2xl shadow-lg shadow-primary/30"
            >
              <Text className="text-white font-ubuntu-bold text-base">Start Shopping</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {items.length > 0 && (
        <View
          className="p-6 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-white/5 shadow-2xl"
          style={{ paddingBottom: Math.max(insets.bottom, 24) }}
        >
          <TouchableOpacity
            className="bg-secondary p-5 rounded-2xl flex-row items-center justify-center shadow-lg shadow-secondary/20"
            activeOpacity={0.8}
            onPress={() => router.push("/checkout" as any)}
          >
            <Text className="text-white font-ubuntu-bold text-lg mr-2 uppercase tracking-widest">
              Proceed to Checkout
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
