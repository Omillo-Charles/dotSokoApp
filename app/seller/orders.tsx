import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Alert, Modal, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from "@/hooks/useColorScheme";
import { Package, Clock, Truck, CheckCircle, XCircle, ChevronRight, User, MapPin, Phone, Calendar, Store } from 'lucide-react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMyShop } from "@/hooks/useShop";
import api from "@/lib/api";

interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  shippingAddress: {
    name: string;
    phone: string;
    city: string;
    street: string;
  };
  items: OrderItem[];
}

type StatusFilter = 'all' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

const statusConfig = {
  pending: { label: 'Pending', icon: Clock, color: '#f59e0b', bg: 'bg-amber-100 dark:bg-amber-900/30' },
  processing: { label: 'Processing', icon: Package, color: '#3b82f6', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  shipped: { label: 'Shipped', icon: Truck, color: '#8b5cf6', bg: 'bg-purple-100 dark:bg-purple-900/30' },
  delivered: { label: 'Delivered', icon: CheckCircle, color: '#10b981', bg: 'bg-green-100 dark:bg-green-900/30' },
  cancelled: { label: 'Cancelled', icon: XCircle, color: '#ef4444', bg: 'bg-red-100 dark:bg-red-900/30' },
};

export default function ShopOrdersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark } = useColorScheme();
  const queryClient = useQueryClient();

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const { data: shop, isLoading: isShopLoading } = useMyShop();

  const { data: ordersData, isLoading, refetch } = useQuery({
    queryKey: ['seller-orders', statusFilter],
    queryFn: async () => {
      const params = statusFilter !== 'all' ? `?status=${statusFilter}` : '';
      const response = await api.get(`/orders/seller${params}`);
      return response.data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const response = await api.patch(`/orders/${orderId}/status`, { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-orders'] });
      setShowStatusModal(false);
      setSelectedOrder(null);
      Alert.alert('Success', 'Order status updated successfully');
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.message || 'Failed to update order status');
    },
  });

  const orders: Order[] = ordersData?.data || [];
  const isRefreshing = isLoading || isShopLoading;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return `KES ${amount.toLocaleString()}`;
  };

  const getOrderTotal = (order: Order) => {
    return order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleStatusChange = (order: Order) => {
    setSelectedOrder(order);
    setShowStatusModal(true);
  };

  const updateStatus = (newStatus: string) => {
    if (!selectedOrder) return;
    
    Alert.alert(
      'Confirm Status Change',
      `Change order status to ${statusConfig[newStatus as keyof typeof statusConfig].label}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            updateStatusMutation.mutate({ 
              orderId: selectedOrder.id, 
              status: newStatus 
            });
          },
        },
      ]
    );
  };

  const getStatusCounts = () => {
    const allOrders = ordersData?.data || [];
    return {
      all: allOrders.length,
      pending: allOrders.filter((o: Order) => o.status === 'pending').length,
      processing: allOrders.filter((o: Order) => o.status === 'processing').length,
      shipped: allOrders.filter((o: Order) => o.status === 'shipped').length,
      delivered: allOrders.filter((o: Order) => o.status === 'delivered').length,
      cancelled: allOrders.filter((o: Order) => o.status === 'cancelled').length,
    };
  };

  const statusCounts = getStatusCounts();

  if (isShopLoading) {
    return (
      <View className="flex-1 bg-slate-50 dark:bg-slate-950 items-center justify-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-4 py-4 flex-row items-center justify-between bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-white/5">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <Ionicons name="arrow-back" size={24} color={isDark ? "#ffffff" : "#0f172a"} />
        </TouchableOpacity>
        <Text className="text-xl font-ubuntu-bold text-slate-900 dark:text-white">Shop Orders</Text>
        <View className="w-10" />
      </View>

      {/* Shop Banner & Info Header */}
      <View className="bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-white/5">
        {/* Banner */}
        <View className="relative h-32 bg-primary/20">
          {shop?.banner ? (
            <Image source={{ uri: shop.banner }} className="w-full h-full" resizeMode="cover" />
          ) : (
            <View className="w-full h-full items-center justify-center">
              <Store size={40} color="#3b82f6" opacity={0.2} />
            </View>
          )}
        </View>

        {/* Shop Info */}
        <View className="px-4 -mt-8 pb-5">
          <View className="flex-row items-end gap-4 mb-4">
            <View className="w-20 h-20 rounded-2xl bg-white dark:bg-slate-900 border-4 border-white dark:border-slate-950 overflow-hidden shadow-lg">
              {shop?.avatar ? (
                <Image source={{ uri: shop.avatar }} className="w-full h-full" resizeMode="cover" />
              ) : (
                <View className="w-full h-full items-center justify-center">
                  <Store size={32} color="#94a3b8" />
                </View>
              )}
            </View>
            <View className="flex-1 pb-1">
              <Text className="text-xl font-ubuntu-bold text-slate-900 dark:text-white mb-1">
                {shop?.name}
              </Text>
              <Text className="text-slate-500 dark:text-slate-400 font-ubuntu text-sm">
                @{shop?.username}
              </Text>
            </View>
          </View>

          {/* Quick Stats */}
          <View className="flex-row gap-3">
            <View className="flex-1 bg-slate-50 dark:bg-slate-900 rounded-2xl p-3">
              <Text className="text-slate-500 dark:text-slate-400 font-ubuntu text-xs mb-1">
                Total Orders
              </Text>
              <Text className="text-slate-900 dark:text-white font-ubuntu-bold text-xl">
                {statusCounts.all}
              </Text>
            </View>
            <View className="flex-1 bg-slate-50 dark:bg-slate-900 rounded-2xl p-3">
              <Text className="text-slate-500 dark:text-slate-400 font-ubuntu text-xs mb-1">
                Active
              </Text>
              <Text className="text-primary font-ubuntu-bold text-xl">
                {statusCounts.pending + statusCounts.processing + statusCounts.shipped}
              </Text>
            </View>
            <View className="flex-1 bg-slate-50 dark:bg-slate-900 rounded-2xl p-3">
              <Text className="text-slate-500 dark:text-slate-400 font-ubuntu text-xs mb-1">
                Completed
              </Text>
              <Text className="text-green-600 dark:text-green-400 font-ubuntu-bold text-xl">
                {statusCounts.delivered}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Status Filter Tabs */}
      <View className="bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-white/5">
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10, gap: 8 }}
        >
          <TouchableOpacity
            onPress={() => setStatusFilter('all')}
            className={`px-4 py-1.5 rounded-lg ${
              statusFilter === 'all' 
                ? 'bg-primary' 
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10'
            }`}
          >
            <Text className={`font-ubuntu-bold text-xs ${
              statusFilter === 'all' ? 'text-white' : 'text-slate-600 dark:text-slate-400'
            }`}>
              All ({statusCounts.all})
            </Text>
          </TouchableOpacity>
          {Object.entries(statusConfig).map(([key, config]) => (
            <TouchableOpacity
              key={key}
              onPress={() => setStatusFilter(key as StatusFilter)}
              className={`px-4 py-1.5 rounded-lg ${
                statusFilter === key
                  ? 'bg-primary'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10'
              }`}
            >
              <Text className={`font-ubuntu-bold text-xs ${
                statusFilter === key ? 'text-white' : 'text-slate-600 dark:text-slate-400'
              }`}>
                {config.label} ({statusCounts[key as keyof typeof statusCounts]})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Orders List */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refetch} />}
      >
        <View className="px-4 py-4">
          {isLoading ? (
            <View className="py-20">
              <ActivityIndicator size="large" color="#3b82f6" />
            </View>
          ) : orders.length === 0 ? (
            <View className="bg-white dark:bg-slate-900 rounded-3xl p-12 items-center border border-slate-100 dark:border-white/5">
              <Package size={48} color="#cbd5e1" />
              <Text className="text-slate-900 dark:text-white font-ubuntu-bold text-lg mt-4">
                No orders found
              </Text>
              <Text className="text-slate-500 dark:text-slate-400 font-ubuntu text-center mt-2">
                {statusFilter === 'all' 
                  ? 'You haven\'t received any orders yet.'
                  : `No ${statusConfig[statusFilter as keyof typeof statusConfig].label.toLowerCase()} orders.`}
              </Text>
            </View>
          ) : (
            <View className="gap-4">
              {orders.map((order) => {
                const config = statusConfig[order.status];
                const StatusIcon = config.icon;
                const orderTotal = getOrderTotal(order);

                return (
                  <TouchableOpacity
                    key={order.id}
                    onPress={() => router.push(`/account/orders/${order.id}` as any)}
                    className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-white/5 shadow-sm"
                  >
                    {/* Order Header */}
                    <View className="flex-row items-center justify-between mb-4">
                      <View className="flex-1">
                        <Text className="text-slate-900 dark:text-white font-ubuntu-bold text-base mb-1">
                          Order #{order.id.slice(-8).toUpperCase()}
                        </Text>
                        <View className="flex-row items-center gap-1">
                          <Calendar size={12} color="#94a3b8" />
                          <Text className="text-slate-500 dark:text-slate-400 font-ubuntu text-xs">
                            {formatDate(order.createdAt)}
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        onPress={(e) => {
                          e.stopPropagation();
                          handleStatusChange(order);
                        }}
                        className={`px-3 py-2 rounded-xl flex-row items-center gap-1 ${config.bg}`}
                      >
                        <StatusIcon size={14} color={config.color} />
                        <Text className="font-ubuntu-bold text-xs" style={{ color: config.color }}>
                          {config.label}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* Customer Info */}
                    <View className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-3 mb-3">
                      <View className="flex-row items-center gap-2 mb-2">
                        <User size={14} color="#64748b" />
                        <Text className="text-slate-700 dark:text-slate-300 font-ubuntu-bold text-sm">
                          {order.user.name}
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-2 mb-2">
                        <Phone size={14} color="#64748b" />
                        <Text className="text-slate-600 dark:text-slate-400 font-ubuntu text-xs">
                          {order.shippingAddress.phone}
                        </Text>
                      </View>
                      <View className="flex-row items-start gap-2">
                        <MapPin size={14} color="#64748b" className="mt-0.5" />
                        <Text className="text-slate-600 dark:text-slate-400 font-ubuntu text-xs flex-1">
                          {order.shippingAddress.street}, {order.shippingAddress.city}
                        </Text>
                      </View>
                    </View>

                    {/* Order Items */}
                    <View className="mb-3">
                      {order.items.map((item, index) => (
                        <View 
                          key={item.id}
                          className={`flex-row items-center justify-between py-2 ${
                            index !== order.items.length - 1 ? 'border-b border-slate-100 dark:border-white/5' : ''
                          }`}
                        >
                          <Text className="text-slate-700 dark:text-slate-300 font-ubuntu text-sm flex-1">
                            {item.name} × {item.quantity}
                          </Text>
                          <Text className="text-slate-900 dark:text-white font-ubuntu-bold text-sm">
                            {formatCurrency(item.price * item.quantity)}
                          </Text>
                        </View>
                      ))}
                    </View>

                    {/* Order Total */}
                    <View className="flex-row items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5">
                      <Text className="text-slate-600 dark:text-slate-400 font-ubuntu-bold text-sm">
                        Total Amount
                      </Text>
                      <Text className="text-primary font-ubuntu-bold text-lg">
                        {formatCurrency(orderTotal)}
                      </Text>
                    </View>

                    {/* View Details Arrow */}
                    <View className="absolute top-5 right-5">
                      <ChevronRight size={20} color="#cbd5e1" />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Status Update Modal */}
      <Modal
        visible={showStatusModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowStatusModal(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowStatusModal(false)}
          className="flex-1 bg-black/50 justify-end"
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View className="bg-white dark:bg-slate-900 rounded-t-3xl p-6" style={{ paddingBottom: Math.max(insets.bottom, 24) }}>
              <View className="flex-row items-center justify-between mb-6">
                <Text className="text-xl font-ubuntu-bold text-slate-900 dark:text-white">
                  Update Order Status
                </Text>
                <TouchableOpacity onPress={() => setShowStatusModal(false)} className="p-2 -mr-2">
                  <Ionicons name="close" size={24} color={isDark ? "#ffffff" : "#0f172a"} />
                </TouchableOpacity>
              </View>

              {selectedOrder && (
                <>
                  <Text className="text-slate-500 dark:text-slate-400 font-ubuntu text-sm mb-4">
                    Order #{selectedOrder.id.slice(-8).toUpperCase()}
                  </Text>

                  <View className="gap-3">
                    {Object.entries(statusConfig).map(([key, config]) => {
                      const StatusIcon = config.icon;
                      const isCurrentStatus = selectedOrder.status === key;
                      const isDisabled = updateStatusMutation.isPending;

                      return (
                        <TouchableOpacity
                          key={key}
                          onPress={() => !isDisabled && updateStatus(key)}
                          disabled={isDisabled || isCurrentStatus}
                          className={`flex-row items-center justify-between p-4 rounded-2xl border ${
                            isCurrentStatus
                              ? 'bg-primary/10 border-primary'
                              : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-white/10'
                          } ${isDisabled ? 'opacity-50' : ''}`}
                        >
                          <View className="flex-row items-center gap-3">
                            <View className={`w-10 h-10 rounded-xl items-center justify-center ${config.bg}`}>
                              <StatusIcon size={20} color={config.color} />
                            </View>
                            <Text className={`font-ubuntu-bold text-base ${
                              isCurrentStatus 
                                ? 'text-primary' 
                                : 'text-slate-900 dark:text-white'
                            }`}>
                              {config.label}
                            </Text>
                          </View>
                          {isCurrentStatus && (
                            <CheckCircle size={20} color="#3b82f6" />
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </>
              )}
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
