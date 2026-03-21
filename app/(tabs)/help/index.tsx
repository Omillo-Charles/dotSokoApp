import React from 'react';
import { ScrollView, View, Text, Pressable, TextInput } from 'react-native';
import { 
  Search, Package, RotateCcw, Truck, BookOpen, 
  Shield, CreditCard, ArrowRight, HelpCircle, 
  ChevronRight, MessageCircle 
} from 'lucide-react-native';
import { router } from 'expo-router';

export default function HelpScreen() {
  return (
    <View className="flex-1 bg-slate-50/50 dark:bg-slate-950">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        {/* Header Section */}
        <View className="bg-white dark:bg-slate-900 px-6 pt-8 pb-12 border-b border-slate-100 dark:border-white/5">
          <Text className="text-3xl md:text-5xl font-ubuntu-bold text-slate-900 dark:text-white tracking-tight leading-tight">
            Help Center
          </Text>
          <Text className="mt-4 text-slate-500 dark:text-slate-400 text-sm font-ubuntu leading-relaxed">
            Find answers, track orders, and manage your shopping experience.
          </Text>
        </View>

        <View className="px-6 mt-10">
          
          {/* Top Info Cards */}
          <View className="flex-col gap-4 mb-10">
            {/* Track Order */}
            <Pressable 
              onPress={() => {}}
              className="flex-row items-center gap-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl p-5 shadow-sm"
            >
              <View className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Package size={24} color="#3b82f6" />
              </View>
              <View>
                <Text className="font-ubuntu-bold text-slate-900 dark:text-white text-base">Track Order</Text>
                <Text className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-ubuntu">Check delivery status</Text>
              </View>
            </Pressable>

            {/* Returns */}
            <Pressable 
              onPress={() => {}}
              className="flex-row items-center gap-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl p-5 shadow-sm"
            >
              <View className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <RotateCcw size={24} color="#3b82f6" />
              </View>
              <View>
                <Text className="font-ubuntu-bold text-slate-900 dark:text-white text-base">Returns</Text>
                <Text className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-ubuntu">Refunds & exchanges</Text>
              </View>
            </Pressable>

            {/* Shipping */}
            <Pressable 
              onPress={() => {}}
              className="flex-row items-center gap-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl p-5 shadow-sm"
            >
              <View className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Truck size={24} color="#3b82f6" />
              </View>
              <View>
                <Text className="font-ubuntu-bold text-slate-900 dark:text-white text-base">Shipping</Text>
                <Text className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-ubuntu">Rates & delivery times</Text>
              </View>
            </Pressable>
          </View>

          {/* Browse Topics */}
          <View className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl p-6 shadow-sm mb-10">
            <View className="flex-row items-center gap-2 mb-6">
              <BookOpen size={20} color="#3b82f6" />
              <Text className="text-lg font-ubuntu-bold text-slate-900 dark:text-white">Browse Help Topics</Text>
            </View>

            <View className="flex-col gap-4">
              {[
                { title: "Account Settings", desc: "Manage profile and security", icon: Shield, route: "/account" },
                { title: "Payment Methods", desc: "Cards, M-Pesa, and more", icon: CreditCard, route: "/payment" },
                { title: "Selling on .Soko", desc: "Start your own shop today", icon: ArrowRight, route: "/sell" },
                { title: "Buyer Protection", desc: "How we keep you safe", icon: HelpCircle, route: "/protection" },
              ].map((topic, i) => {
                const Icon = topic.icon;
                return (
                  <Pressable 
                    key={i}
                    onPress={() => {}}
                    className="flex-row items-center gap-4 p-4 border border-slate-100 dark:border-white/5 rounded-xl bg-slate-50 dark:bg-slate-800/50"
                  >
                    <Icon size={20} color="#64748b" />
                    <View className="flex-1">
                      <Text className="font-ubuntu-bold text-slate-900 dark:text-white text-sm">{topic.title}</Text>
                      <Text className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-ubuntu">{topic.desc}</Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
            
            {/* Search Tool */}
            <View className="mt-8 p-6 bg-slate-50 dark:bg-slate-800/80 rounded-2xl relative overflow-hidden flex-col">
              <View className="relative z-10">
                <Text className="font-ubuntu-bold text-slate-900 dark:text-white mb-2 text-base">Need a custom solution?</Text>
                <Text className="text-xs text-slate-500 dark:text-slate-400 mb-4 font-ubuntu leading-relaxed">
                  If you can't find what you're looking for, our search tool can help you find specific articles.
                </Text>
                <View className="relative flex-row items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 rounded-xl px-4 py-3">
                  <Search size={18} color="#94a3b8" />
                  <TextInput 
                    placeholder="Search help articles..."
                    placeholderTextColor="#94a3b8"
                    className="flex-1 ml-3 text-sm font-ubuntu text-slate-900 dark:text-white pb-1 pt-0"
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Quick Links */}
          <View className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl p-6 shadow-sm mb-6">
            <Text className="font-ubuntu-bold text-slate-900 dark:text-white text-lg mb-5">Quick Links</Text>
            <View className="flex-col gap-4">
              {[
                { name: "Privacy Policy", route: "/privacy" },
                { name: "Terms of Service", route: "/terms" },
                { name: "Cookie Policy", route: "/cookies" },
                { name: "Return Policy", route: "/returns" },
              ].map((link, i) => (
                <Pressable 
                  key={i}
                  onPress={() => router.push(link.route as any)}
                  className="flex-row items-center justify-between py-2"
                >
                  <Text className="text-sm text-slate-600 dark:text-slate-300 font-ubuntu">{link.name}</Text>
                  <ChevronRight size={16} color="#94a3b8" />
                </Pressable>
              ))}
            </View>
          </View>

          {/* Direct Support Card */}
          <View className="bg-primary rounded-2xl p-6 shadow-lg shadow-primary/30 mb-6 flex-col">
            <Text className="font-ubuntu-bold text-white text-xl mb-2">Still Stuck?</Text>
            <Text className="text-white/80 text-sm font-ubuntu mb-6 leading-relaxed">
              Our dedicated support team is ready to help you with any issue you might be facing.
            </Text>
            <Pressable 
              onPress={() => router.push("/contact")}
              className="w-full bg-white dark:bg-slate-900 py-3.5 rounded-xl flex-row items-center justify-center gap-2"
            >
              <MessageCircle size={18} color="#3b82f6" />
              <Text className="text-primary font-ubuntu-bold text-sm">Contact Us</Text>
            </Pressable>
          </View>

          {/* Status Indicator */}
          <View className="p-4 border border-slate-100 dark:border-white/5 rounded-2xl flex-row items-center gap-3 bg-white dark:bg-slate-900 shadow-sm">
            <View className="w-2.5 h-2.5 bg-green-500 rounded-full" />
            <Text className="text-xs font-ubuntu-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">All systems operational</Text>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}
