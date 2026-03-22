import React, { useState } from 'react';
import {
  ScrollView, View, Text, Pressable, TextInput, ActivityIndicator, Linking
} from 'react-native';
import {
  Search, Package, MapPin, HelpCircle, Phone,
  CheckCircle2, Truck, ShoppingBag, XCircle, ChevronRight
} from 'lucide-react-native';
import { router } from 'expo-router';

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered';

const STATUS_STEPS: { key: OrderStatus; label: string }[] = [
  { key: 'pending', label: 'Order Placed' },
  { key: 'processing', label: 'Processing' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
];

export default function TrackOrderScreen() {
  const [orderId, setOrderId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async () => {
    const trimmed = orderId.trim().replace(/^#/, '');
    if (!trimmed) return;
    setIsSearching(true);
    setError(null);
    setOrder(null);
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/orders/track/${encodeURIComponent(trimmed)}`
      );
      const data = await res.json();
      if (data.success) {
        setOrder(data.data);
      } else {
        setError(data.message || 'Order not found.');
      }
    } catch {
      setError('Could not find an order with that ID. Please check the ID and try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const currentIndex = order
    ? STATUS_STEPS.findIndex((s) => s.key === order.status)
    : -1;

  return (
    <View className="flex-1 bg-slate-50/50 dark:bg-slate-950">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View className="bg-white dark:bg-slate-900 px-6 pt-8 pb-10 border-b border-slate-100 dark:border-white/5">
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 rounded-xl bg-primary/10 items-center justify-center mr-3">
              <Truck size={20} color="#3b82f6" />
            </View>
            <Text className="text-3xl font-ubuntu-bold text-slate-900 dark:text-white tracking-tight">
              Track Your Order
            </Text>
          </View>
          <Text className="text-slate-500 dark:text-slate-400 text-sm font-ubuntu leading-relaxed">
            Enter your order ID to see real-time updates on your package's journey from the shop to your doorstep.
          </Text>
        </View>

        <View className="px-6 mt-8 gap-6">

          {/* Search Card */}
          <View className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl p-5 shadow-sm">
            <View className="flex-row items-center bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-3 mb-3">
              <Search size={18} color="#94a3b8" />
              <TextInput
                value={orderId}
                onChangeText={setOrderId}
                placeholder="Enter Order ID (e.g. #29257B)"
                placeholderTextColor="#94a3b8"
                className="flex-1 ml-3 text-sm font-ubuntu text-slate-900 dark:text-white"
                autoCapitalize="characters"
                returnKeyType="search"
                onSubmitEditing={handleTrack}
              />
            </View>
            <Text className="text-[10px] text-slate-400 font-ubuntu mb-4 ml-1">
              6-character code from your email (e.g. #29257B) or full 24-character ID.
            </Text>
            <Pressable
              onPress={handleTrack}
              disabled={isSearching || !orderId.trim()}
              className="bg-primary py-3.5 rounded-xl items-center justify-center"
              style={{ opacity: isSearching || !orderId.trim() ? 0.5 : 1 }}
            >
              {isSearching ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text className="text-white font-ubuntu-bold text-sm">Track Order</Text>
              )}
            </Pressable>
          </View>

          {/* Error State */}
          {error && (
            <View className="bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl p-6 items-center">
              <View className="w-14 h-14 bg-red-100 dark:bg-red-500/20 rounded-full items-center justify-center mb-4">
                <XCircle size={28} color="#ef4444" />
              </View>
              <Text className="font-ubuntu-bold text-red-900 dark:text-red-400 text-base mb-2 text-center">
                Order Not Found
              </Text>
              <Text className="text-sm text-red-700 dark:text-red-400/80 mb-5 text-center font-ubuntu leading-relaxed">
                {error}
              </Text>
              <Pressable
                onPress={() => { setError(null); setOrderId(''); }}
                className="px-6 py-2.5 bg-red-600 rounded-xl"
              >
                <Text className="text-white font-ubuntu-bold text-sm">Try Again</Text>
              </Pressable>
            </View>
          )}

          {/* Order Result */}
          {order && (
            <View className="gap-6">
              {/* Status Banner */}
              <View className="bg-slate-900 dark:bg-slate-800 rounded-2xl overflow-hidden">
                <View className="p-6 flex-row items-center justify-between">
                  <View>
                    <Text className="text-slate-400 text-[10px] font-ubuntu uppercase tracking-widest mb-1">Current Status</Text>
                    <View className="flex-row items-center gap-2">
                      <Truck size={20} color="#3b82f6" />
                      <Text className="text-white font-ubuntu-bold text-xl capitalize">{order.status}</Text>
                    </View>
                  </View>
                  <View className="items-end">
                    <Text className="text-slate-400 text-[10px] font-ubuntu uppercase tracking-widest mb-1">Order Date</Text>
                    <Text className="text-white font-ubuntu-bold">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </Text>
                  </View>
                </View>

                {/* Meta row */}
                <View className="px-6 pb-6 flex-row justify-between gap-4">
                  <View className="flex-row items-center gap-2">
                    <View className="w-8 h-8 rounded-lg bg-blue-500/20 items-center justify-center">
                      <Package size={16} color="#3b82f6" />
                    </View>
                    <View>
                      <Text className="text-slate-400 text-[9px] font-ubuntu uppercase">Order ID</Text>
                      <Text className="text-white text-xs font-ubuntu-bold">#{order._id.slice(-8).toUpperCase()}</Text>
                    </View>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <View className="w-8 h-8 rounded-lg bg-orange-500/20 items-center justify-center">
                      <MapPin size={16} color="#f97316" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-slate-400 text-[9px] font-ubuntu uppercase">Destination</Text>
                      <Text className="text-white text-xs font-ubuntu-bold" numberOfLines={1}>
                        {order.shippingAddress.city}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <View className="w-8 h-8 rounded-lg bg-green-500/20 items-center justify-center">
                      <ShoppingBag size={16} color="#22c55e" />
                    </View>
                    <View>
                      <Text className="text-slate-400 text-[9px] font-ubuntu uppercase">Items</Text>
                      <Text className="text-white text-xs font-ubuntu-bold">{order.items.length} product(s)</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Timeline */}
              <View className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl p-6">
                <Text className="font-ubuntu-bold text-slate-900 dark:text-white text-base mb-6">Order Timeline</Text>
                <View className="relative">
                  <View className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-slate-700" />
                  {STATUS_STEPS.map((step, idx) => {
                    const isCompleted = idx < currentIndex;
                    const isCurrent = idx === currentIndex;
                    return (
                      <View key={step.key} className="flex-row items-start mb-6 last:mb-0">
                        <View className={`w-10 h-10 rounded-full border-2 items-center justify-center mr-4 z-10 ${
                          isCompleted ? 'bg-primary border-primary' :
                          isCurrent ? 'bg-white dark:bg-slate-900 border-primary' :
                          'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle2 size={20} color="#ffffff" />
                          ) : (
                            <View className={`w-2 h-2 rounded-full ${isCurrent ? 'bg-primary' : 'bg-slate-400'}`} />
                          )}
                        </View>
                        <View className="flex-1 pt-2">
                          <Text className={`font-ubuntu-bold text-sm ${isCurrent ? 'text-primary' : isCompleted ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                            {step.label}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>

              {/* Order Items */}
              <View className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl p-6">
                <Text className="font-ubuntu-bold text-slate-900 dark:text-white text-xs uppercase tracking-widest mb-4">Order Items</Text>
                <View className="gap-3">
                  {order.items.map((item: any, idx: number) => (
                    <View key={idx} className="flex-row items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-white/5">
                      <View className="w-14 h-14 rounded-lg bg-slate-200 dark:bg-slate-700 items-center justify-center">
                        <ShoppingBag size={18} color="#94a3b8" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-sm font-ubuntu-bold text-slate-900 dark:text-white" numberOfLines={1}>{item.name}</Text>
                        <Text className="text-xs font-ubuntu text-slate-500 mt-0.5">Sold by {item.shopName}</Text>
                      </View>
                      <View className="items-end">
                        <Text className="text-sm font-ubuntu-bold text-slate-900 dark:text-white">KES {item.price?.toLocaleString()}</Text>
                        <Text className="text-xs text-slate-400 font-ubuntu">Qty: {item.quantity}</Text>
                      </View>
                    </View>
                  ))}
                </View>
                <View className="mt-4 flex-row items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/10">
                  <Text className="text-sm font-ubuntu text-slate-500">Total Amount</Text>
                  <Text className="text-lg font-ubuntu-bold text-primary">KES {order.totalAmount?.toLocaleString()}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Helper cards — shown when no result yet */}
          {!order && !error && !isSearching && (
            <View className="gap-4">
              <View className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl p-5">
                <View className="w-10 h-10 rounded-xl bg-primary/10 items-center justify-center mb-4">
                  <HelpCircle size={20} color="#3b82f6" />
                </View>
                <Text className="font-ubuntu-bold text-slate-900 dark:text-white mb-2">Where is my Order ID?</Text>
                <Text className="text-sm text-slate-500 dark:text-slate-400 font-ubuntu leading-relaxed">
                  You can find your Order ID in the confirmation email we sent you, or by visiting the 'Orders' section in your account dashboard.
                </Text>
              </View>
              <View className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl p-5">
                <View className="w-10 h-10 rounded-xl bg-primary/10 items-center justify-center mb-4">
                  <Phone size={20} color="#3b82f6" />
                </View>
                <Text className="font-ubuntu-bold text-slate-900 dark:text-white mb-2">Need Help?</Text>
                <Text className="text-sm text-slate-500 dark:text-slate-400 font-ubuntu leading-relaxed">
                  Having trouble tracking your package?{' '}
                  <Text
                    className="text-primary font-ubuntu-bold"
                    onPress={() => Linking.openURL('mailto:support@dotsoko.com')}
                  >
                    support@dotsoko.com
                  </Text>
                </Text>
              </View>
            </View>
          )}

          {/* Quick Support sidebar-style card */}
          <View className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl p-6">
            <Text className="font-ubuntu-bold text-slate-900 dark:text-white text-xs uppercase tracking-widest mb-4">Quick Support</Text>
            {[
              { name: 'Shipping Policy', route: '/help' },
              { name: 'Refund Policy', route: '/returns' },
              { name: 'FAQs', route: '/help' },
            ].map((item) => (
              <Pressable
                key={item.name}
                onPress={() => router.push(item.route as any)}
                className="flex-row items-center justify-between py-3 border-b border-slate-100 dark:border-white/5 last:border-0"
              >
                <Text className="text-sm font-ubuntu text-slate-600 dark:text-slate-300">{item.name}</Text>
                <ChevronRight size={16} color="#94a3b8" />
              </Pressable>
            ))}
          </View>

        </View>
      </ScrollView>
    </View>
  );
}
