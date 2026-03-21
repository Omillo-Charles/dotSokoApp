import React from 'react';
import { ScrollView, View, Text, Pressable, Linking } from 'react-native';
import { Scale, ShieldCheck, ShoppingBag, Users, Lock, FileText, Bell, Mail } from 'lucide-react-native';
import { useColorScheme } from '../../../hooks/useColorScheme';

export default function TermsScreen() {
  const { isDark } = useColorScheme();

  const handleEmail = () => {
    Linking.openURL('mailto:legal@dotsoko.com');
  };

  return (
    <View className="flex-1 bg-slate-50/50 dark:bg-slate-950">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        {/* Header Section */}
        <View className="bg-white dark:bg-slate-900 px-6 pt-8 pb-12 border-b border-slate-100 dark:border-white/5">
          <View className="flex-row items-center mb-4">
            <View className="flex-row items-center bg-primary/10 px-3 py-1.5 rounded-full">
              <Scale size={14} color="#3b82f6" />
              <Text className="text-xs font-ubuntu-bold text-primary ml-2">Legal Framework</Text>
            </View>
          </View>

          <Text className="text-3xl md:text-5xl font-ubuntu-bold text-slate-900 dark:text-white tracking-tight leading-tight">
            Terms of Service
          </Text>
          <Text className="mt-4 text-slate-500 dark:text-slate-400 text-sm font-ubuntu leading-relaxed">
            These terms govern your use of the .Soko marketplace. Please read them carefully to understand your rights and obligations as a user of our platform.
          </Text>

          <View className="mt-6 flex-row items-center gap-4">
            <View className="flex-row items-center">
              <FileText size={14} color={isDark ? "#64748b" : "#94a3b8"} />
              <Text className="text-xs text-slate-500/80 ml-1.5 font-ubuntu">Version 1.2</Text>
            </View>
            <View className="flex-row items-center ml-2">
              <Bell size={14} color={isDark ? "#64748b" : "#94a3b8"} />
              <Text className="text-xs text-slate-500/80 ml-1.5 font-ubuntu">Last updated: Jan 14, 2026</Text>
            </View>
          </View>
        </View>

        <View className="px-6 mt-10">
          
          {/* Section 1 */}
          <View className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl p-6 shadow-sm mb-6">
            <View className="flex-row items-center mb-6">
              <View className="w-10 h-10 rounded-xl bg-primary/5 dark:bg-primary/10 items-center justify-center mr-3">
                <ShieldCheck size={20} color="#3b82f6" />
              </View>
              <Text className="text-lg font-ubuntu-bold text-slate-900 dark:text-white">1. Acceptance of Terms</Text>
            </View>
            <View className="space-y-4">
              {[
                "By accessing or using .Soko, you agree to be bound by these Terms of Service.",
                "If you do not agree to these terms, you may not use our platform or services.",
                "We reserve the right to modify these terms at any time, with updates effective upon posting.",
                "Continued use of the platform constitutes acceptance of any updated terms."
              ].map((item, idx) => (
                <View key={idx} className="flex-row items-start mb-3">
                  <View className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-2 mr-3" />
                  <Text className="flex-1 text-sm font-ubuntu text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Section 2 */}
          <View className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl p-6 shadow-sm mb-6">
            <View className="flex-row items-center mb-6">
              <View className="w-10 h-10 rounded-xl bg-primary/5 dark:bg-primary/10 items-center justify-center mr-3">
                <ShoppingBag size={20} color="#3b82f6" />
              </View>
              <Text className="text-lg font-ubuntu-bold text-slate-900 dark:text-white">2. Marketplace Platform</Text>
            </View>
            <View className="space-y-4">
              {[
                ".Soko provides a marketplace where sellers can list products and buyers can purchase them.",
                "We are not the seller of items listed by third-party vendors on the platform.",
                "Transactions are directly between the buyer and the seller.",
                "We facilitate payment processing but are not responsible for product quality or delivery by sellers."
              ].map((item, idx) => (
                <View key={idx} className="flex-row items-start mb-3">
                  <View className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-2 mr-3" />
                  <Text className="flex-1 text-sm font-ubuntu text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Section 3 */}
          <View className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl p-6 shadow-sm mb-6">
            <View className="flex-row items-center mb-6">
              <View className="w-10 h-10 rounded-xl bg-primary/5 dark:bg-primary/10 items-center justify-center mr-3">
                <Users size={20} color="#3b82f6" />
              </View>
              <Text className="text-lg font-ubuntu-bold text-slate-900 dark:text-white">3. User Accounts</Text>
            </View>
            <View className="space-y-4">
              {[
                "You must provide accurate and complete information when creating an account.",
                "You are responsible for maintaining the confidentiality of your account credentials.",
                "Users must be at least 18 years old or have parental/guardian consent.",
                "We reserve the right to suspend or terminate accounts that violate our community guidelines."
              ].map((item, idx) => (
                <View key={idx} className="flex-row items-start mb-3">
                  <View className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-2 mr-3" />
                  <Text className="flex-1 text-sm font-ubuntu text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Section 4 */}
          <View className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl p-6 shadow-sm mb-8">
            <View className="flex-row items-center mb-6">
              <View className="w-10 h-10 rounded-xl bg-primary/5 dark:bg-primary/10 items-center justify-center mr-3">
                <Scale size={20} color="#3b82f6" />
              </View>
              <Text className="text-lg font-ubuntu-bold text-slate-900 dark:text-white">4. Fees and Payments</Text>
            </View>
            <View className="space-y-4">
              {[
                "Sellers agree to pay the commission fees specified in the Seller Agreement.",
                "Buyers are responsible for the purchase price and any applicable shipping or tax fees.",
                "All payments are processed through secure third-party payment gateways.",
                "Refunds are subject to our Return Policy and individual seller terms."
              ].map((item, idx) => (
                <View key={idx} className="flex-row items-start mb-3">
                  <View className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-2 mr-3" />
                  <Text className="flex-1 text-sm font-ubuntu text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* CTA Card */}
          <View className="p-8 bg-slate-900 rounded-3xl relative overflow-hidden border border-white/5 mb-8">
            <View className="relative z-10">
              <View className="flex-row items-center mb-4">
                <Lock size={24} color="#3b82f6" />
                <Text className="text-2xl font-ubuntu-bold text-white ml-3">Cookies & Tracking</Text>
              </View>
              <Text className="text-slate-300 font-ubuntu leading-relaxed mb-6">
                We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking 'Accept', you consent to our use of cookies.
              </Text>
              
              <Pressable className="bg-white px-6 py-3.5 rounded-xl flex-row items-center justify-center self-start">
                <Text className="text-slate-900 font-ubuntu-bold text-sm">Manage Cookie Settings</Text>
              </Pressable>
            </View>
            <View className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-50" />
          </View>

          {/* Sidebar-style Contact Card */}
          <View className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl p-6 mb-6">
            <Text className="font-ubuntu-bold text-slate-900 dark:text-white text-lg mb-4">Need Help?</Text>
            <Text className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed font-ubuntu">
              If you need clarification on any of our terms or have a specific legal inquiry, our compliance team is here to assist you.
            </Text>
            <Pressable 
              onPress={handleEmail}
              className="flex-row items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
            >
              <Mail size={20} color="#3b82f6" />
              <View className="ml-4">
                <Text className="text-[10px] text-slate-500/60 font-ubuntu uppercase tracking-widest">Legal Department</Text>
                <Text className="text-sm font-ubuntu-bold text-slate-900 dark:text-white">legal@dotsoko.com</Text>
              </View>
            </Pressable>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}
