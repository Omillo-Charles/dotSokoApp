import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, RefreshControl, Dimensions, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from "@/hooks/useColorScheme";
import { useMyShop, useShopProducts, useShopLists } from "@/hooks/useShop";
import { useSellerOrders } from "@/hooks/useSeller";
import { 
  ShoppingBag, 
  Package, 
  BarChart3, 
  Plus, 
  Store, 
  Settings, 
  Zap, 
  Clock, 
  LayoutDashboard,
  ChevronRight,
  TrendingUp,
  CreditCard,
  MessageSquare,
  Users,
  Heart,
  ShoppingCart,
  Star
} from 'lucide-react-native';
import { useCartStore } from "@/store/useCartStore";

const { width } = Dimensions.get('window');

type SectionType = 'Dashboard' | 'Products' | 'Followers' | 'Following';

export default function SellerDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark } = useColorScheme();
  const { addItem } = useCartStore();
  
  const [activeSection, setActiveSection] = useState<SectionType>('Dashboard');

  const { data: shop, isLoading: isShopLoading, refetch: refetchShop } = useMyShop();
  const shopId = shop?.id || shop?._id;

  const { data: productsData = [], isLoading: isProductsLoading, refetch: refetchProducts } = useShopProducts(shopId);
  const { data: orders = [], isLoading: isOrdersLoading, refetch: refetchOrders } = useSellerOrders();
  const { data: listData = [], isLoading: isListsLoading, refetch: refetchLists } = useShopLists(shopId, activeSection === 'Followers' || activeSection === 'Following' ? activeSection : 'Followers');

  const products = useMemo(() => {
    return (productsData || []).map((p: any) => ({
      ...p,
      _id: String(p._id || p.id || `product-${Math.random()}`),
    }));
  }, [productsData]);

  const isRefreshing = isShopLoading || isProductsLoading || isOrdersLoading || isListsLoading;

  const onRefresh = () => {
    refetchShop();
    refetchProducts();
    refetchOrders();
    if (activeSection === 'Followers' || activeSection === 'Following') {
      refetchLists();
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(price);

  if (isShopLoading && !shop) {
    return (
      <View className="flex-1 bg-slate-50 dark:bg-slate-950 items-center justify-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  const activeOrdersCount = orders.filter((o: any) => ['pending', 'processing', 'shipped'].includes(o.status)).length;
  const totalEarnings = orders
    .filter((o: any) => o.status !== 'cancelled')
    .reduce((acc: number, o: any) => acc + (o.totalAmount || 0), 0);

  const stats = [
    { label: "Earnings", value: `KES ${totalEarnings.toLocaleString()}`, icon: BarChart3, color: "#10b981", bg: "bg-emerald-500/10" },
    { label: "Active Orders", value: activeOrdersCount.toString(), icon: Package, color: "#3b82f6", bg: "bg-blue-500/10" },
    { label: "Products", value: products.length.toString(), icon: ShoppingBag, color: "#a855f7", bg: "bg-purple-500/10", section: 'Products' as SectionType },
    { label: "Followers", value: (shop?.followersCount || 0).toString(), icon: Zap, color: "#f59e0b", bg: "bg-amber-500/10", section: 'Followers' as SectionType },
  ];

  const iconMuted = isDark ? "#94a3b8" : "#64748b";

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-4 py-4 flex-row items-center justify-between bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-white/5">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <Ionicons name="arrow-back" size={24} color={isDark ? "#ffffff" : "#0f172a"} />
        </TouchableOpacity>
        <Text className="text-xl font-ubuntu-bold text-slate-900 dark:text-white">Seller Central</Text>
        <TouchableOpacity onPress={() => router.push(`/shop/${shopId}` as any)} className="p-2 -mr-2">
          <Store size={22} color={isDark ? "#ffffff" : "#0f172a"} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
      >
        {/* Shop Branding Header */}
        <View className="relative">
          <View className="h-32 bg-primary/20">
            {shop?.banner ? (
              <Image source={{ uri: shop.banner }} className="w-full h-full" resizeMode="cover" />
            ) : (
              <View className="w-full h-full items-center justify-center">
                <TrendingUp size={40} color="#3b82f6" opacity={0.2} />
              </View>
            )}
          </View>
          <View className="px-4 -mt-10 flex-row items-end gap-3 mb-6">
            <View className="w-20 h-20 rounded-2xl bg-white dark:bg-slate-900 border-4 border-slate-50 dark:border-slate-950 overflow-hidden shadow-sm">
              {shop?.avatar ? (
                <Image source={{ uri: shop.avatar }} className="w-full h-full" />
              ) : (
                <View className="w-full h-full items-center justify-center">
                  <Store size={30} color="#94a3b8" />
                </View>
              )}
            </View>
            <View className="pb-1">
              <Text className="text-xl font-ubuntu-bold text-slate-900 dark:text-white" numberOfLines={1}>
                {shop?.name}
              </Text>
              <Text className="text-xs font-ubuntu-medium text-slate-500">
                @{shop?.username}
              </Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View className="px-4 flex-row gap-6 mb-6 border-b border-slate-100 dark:border-white/5">
          {(['Dashboard', 'Products', 'Followers', 'Following'] as SectionType[]).map((tab) => (
            <TouchableOpacity 
              key={tab} 
              onPress={() => setActiveSection(tab)}
              className={`pb-3 border-b-2 ${activeSection === tab ? 'border-primary' : 'border-transparent'}`}
            >
              <Text className={`font-ubuntu-bold text-sm ${activeSection === tab ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeSection === 'Dashboard' && (
          <View className="animate-in fade-in duration-500">
            {/* Stats Grid */}
            <View className="flex-row flex-wrap px-4 gap-4 mb-8">
              {stats.map((stat, i) => (
                <TouchableOpacity 
                  key={i} 
                  style={{ width: (width - 48) / 2 }}
                  onPress={() => stat.section && setActiveSection(stat.section)}
                  className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm"
                >
                  <View className={`w-10 h-10 rounded-xl items-center justify-center mb-3 ${stat.bg}`}>
                    <stat.icon size={20} color={stat.color} />
                  </View>
                  <Text className="text-slate-500 dark:text-slate-400 text-xs font-ubuntu-medium mb-1">{stat.label}</Text>
                  <Text className="text-lg font-ubuntu-bold text-slate-900 dark:text-white">{stat.value}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Quick Actions */}
            <View className="px-4 mb-8">
              <Text className="text-sm font-ubuntu-bold text-slate-400 uppercase tracking-widest mb-4 ml-1">Quick Actions</Text>
              <View className="flex-row gap-4">
                <TouchableOpacity 
                  onPress={() => {}}
                  className="flex-1 bg-primary h-14 rounded-2xl flex-row items-center justify-center shadow-lg shadow-primary/20"
                >
                  <Plus size={20} color="#ffffff" />
                  <Text className="text-white font-ubuntu-bold ml-2">Add Product</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => router.push(`/shop/${shopId}` as any)}
                  className="flex-1 bg-white dark:bg-slate-900 h-14 rounded-2xl border border-slate-100 dark:border-white/5 flex-row items-center justify-center"
                >
                  <LayoutDashboard size={20} color={isDark ? "#ffffff" : "#0f172a"} />
                  <Text className="text-slate-900 dark:text-white font-ubuntu-bold ml-2">Storefront</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Management Menu */}
            <View className="px-4 gap-3 mb-12">
              <Text className="text-sm font-ubuntu-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Management</Text>
              <DashboardMenuItem
                icon={ShoppingBag}
                title="My Inventory"
                subtitle={`${products.length} products listed`}
                color="#a855f7"
                onPress={() => setActiveSection('Products')}
              />
              <DashboardMenuItem
                icon={Package}
                title="Recent Orders"
                subtitle={`${orders.length} orders total`}
                color="#3b82f6"
                onPress={() => {}}
              />
              <DashboardMenuItem
                icon={CreditCard}
                title="Payments & Payouts"
                subtitle="View your earnings history"
                color="#10b981"
                onPress={() => {}}
              />
              <DashboardMenuItem
                icon={MessageSquare}
                title="Customer Reviews"
                subtitle="Manage feedback and ratings"
                color="#f59e0b"
                onPress={() => {}}
              />
              <DashboardMenuItem
                icon={Settings}
                title="Shop Settings"
                subtitle="Edit details and branding"
                color="#64748b"
                onPress={() => router.push("/shop/create" as any)}
              />
            </View>
          </View>
        )}

        {activeSection === 'Products' && (
          <View className="px-4 animate-in fade-in duration-500">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-ubuntu-bold text-slate-900 dark:text-white">Inventory</Text>
              <TouchableOpacity className="bg-primary/10 px-4 py-2 rounded-xl">
                <Text className="text-primary font-ubuntu-bold text-xs">+ New</Text>
              </TouchableOpacity>
            </View>
            {isProductsLoading ? (
              <ActivityIndicator color="#3b82f6" style={{ padding: 40 }} />
            ) : products.length === 0 ? (
              <View className="bg-white dark:bg-slate-900 p-12 rounded-3xl items-center border border-slate-100 dark:border-white/5">
                <ShoppingBag size={40} color="#cbd5e1" />
                <Text className="font-ubuntu-bold text-slate-900 dark:text-white mt-4">No products yet</Text>
                <TouchableOpacity className="mt-4 bg-primary px-6 py-2 rounded-full">
                  <Text className="text-white font-ubuntu-bold text-xs">Add First Product</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="gap-4">
                {products.map((p: any) => (
                  <TouchableOpacity 
                    key={p._id} 
                    onPress={() => router.push(`/shop/product/${p._id}` as any)}
                    className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-white/5 flex-row gap-3 shadow-sm"
                  >
                    <Image source={{ uri: p.image || p.images?.[0] }} className="w-20 h-20 rounded-xl" />
                    <View className="flex-1 justify-center">
                      <Text className="text-sm font-ubuntu-bold text-slate-900 dark:text-white mb-1" numberOfLines={1}>{p.name}</Text>
                      <Text className="text-xs font-ubuntu-medium text-primary mb-2">{formatPrice(p.price)}</Text>
                      <View className="flex-row gap-3">
                        <View className="flex-row items-center gap-1">
                          <Heart size={12} color={iconMuted} />
                          <Text className="text-[10px] font-ubuntu text-slate-500">{p.likesCount || 0}</Text>
                        </View>
                        <View className="flex-row items-center gap-1">
                          <MessageSquare size={12} color={iconMuted} />
                          <Text className="text-[10px] font-ubuntu text-slate-500">{p.commentsCount || 0}</Text>
                        </View>
                      </View>
                    </View>
                    <TouchableOpacity className="p-2 self-start">
                      <Settings size={16} color={iconMuted} />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <View className="h-10" />
          </View>
        )}

        {(activeSection === 'Followers' || activeSection === 'Following') && (
          <View className="px-4 animate-in fade-in duration-500">
            <Text className="text-lg font-ubuntu-bold text-slate-900 dark:text-white mb-4">
              {activeSection} ({listData.length})
            </Text>
            {isListsLoading ? (
              <ActivityIndicator color="#3b82f6" style={{ padding: 40 }} />
            ) : listData.length === 0 ? (
              <View className="bg-white dark:bg-slate-900 p-12 rounded-3xl items-center border border-slate-100 dark:border-white/5">
                <Users size={40} color="#cbd5e1" />
                <Text className="font-ubuntu-bold text-slate-900 dark:text-white mt-4">
                  No {activeSection.toLowerCase()} yet
                </Text>
              </View>
            ) : (
              <View className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-white/5 overflow-hidden">
                {listData.map((item: any, i: number) => (
                  <TouchableOpacity 
                    key={item._id || item.id}
                    onPress={() => router.push(`/shop/${item.username ? `@${item.username}` : (item._id || item.id)}` as any)}
                    className={`flex-row items-center p-4 ${i !== listData.length - 1 ? 'border-b border-slate-50 dark:border-white/5' : ''}`}
                  >
                    <Image source={{ uri: item.avatar || 'https://via.placeholder.com/150' }} className="w-10 h-10 rounded-full mr-3" />
                    <View className="flex-1">
                      <Text className="text-sm font-ubuntu-bold text-slate-900 dark:text-white">{item.name}</Text>
                      <Text className="text-[10px] font-ubuntu text-slate-500">@{item.username}</Text>
                    </View>
                    <ChevronRight size={16} color="#cbd5e1" />
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <View className="h-10" />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function DashboardMenuItem({ 
  icon: Icon, 
  title, 
  subtitle, 
  onPress, 
  color 
}: { 
  icon: any, 
  title: string, 
  subtitle: string, 
  onPress: () => void,
  color: string
}) {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-white/5 flex-row items-center active:bg-slate-50 dark:active:bg-white/5"
    >
      <View className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 items-center justify-center mr-4">
        <Icon size={22} color={color} />
      </View>
      <View className="flex-1">
        <Text className="text-base font-ubuntu-bold text-slate-900 dark:text-white mb-0.5">{title}</Text>
        <Text className="text-xs font-ubuntu text-slate-500 dark:text-slate-400">{subtitle}</Text>
      </View>
      <ChevronRight size={18} color="#cbd5e1" />
    </TouchableOpacity>
  );
}
