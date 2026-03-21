import React from 'react';
import { ScrollView, View, Text, Pressable, Linking } from 'react-native';
import { Shield, Eye, Lock, Globe, FileText, Bell, Mail } from 'lucide-react-native';
import { useColorScheme } from '../../../hooks/useColorScheme';

export default function PrivacyScreen() {
  const { isDark } = useColorScheme();

  const handleEmail = () => {
    Linking.openURL('mailto:privacy@dotsoko.com');
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
              <Shield size={14} color="#3b82f6" />
              <Text className="text-xs font-ubuntu-bold text-primary ml-2">Privacy Matters</Text>
            </View>
          </View>

          <Text className="text-3xl md:text-5xl font-ubuntu-bold text-slate-900 dark:text-white tracking-tight leading-tight">
            Privacy Policy
          </Text>
          <Text className="mt-4 text-slate-500 dark:text-slate-400 text-sm font-ubuntu leading-relaxed">
            At .Soko, we take your privacy seriously. This policy explains how we collect, use, and protect your personal information when you use our marketplace.
          </Text>

          <View className="mt-6 flex-row items-center gap-4">
            <View className="flex-row items-center">
              <FileText size={14} color={isDark ? "#64748b" : "#94a3b8"} />
              <Text className="text-xs text-slate-500/80 ml-1.5 font-ubuntu">Version 1.2</Text>
            </View>
            <View className="flex-row items-center ml-2">
              <Bell size={14} color={isDark ? "#64748b" : "#94a3b8"} />
              <Text className="text-xs text-slate-500/80 ml-1.5 font-ubuntu">Last updated: Jan 12, 2026</Text>
            </View>
          </View>
        </View>

        <View className="px-6 mt-10">
          
          {/* Section 1 */}
          <View className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl p-6 shadow-sm mb-6">
            <View className="flex-row items-center mb-6">
              <View className="w-10 h-10 rounded-xl bg-primary/5 dark:bg-primary/10 items-center justify-center mr-3">
                <Eye size={20} color="#3b82f6" />
              </View>
              <Text className="text-lg font-ubuntu-bold text-slate-900 dark:text-white">Information We Collect</Text>
            </View>
            <View className="space-y-4">
              {[
                "Personal identification information (Name, email address, phone number, etc.)",
                "Billing and shipping information for order fulfillment.",
                "Device information and IP addresses for security and analytics.",
                "Shopping preferences and interaction data to improve your experience."
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
                <Lock size={20} color="#3b82f6" />
              </View>
              <Text className="text-lg font-ubuntu-bold text-slate-900 dark:text-white">How We Use Your Data</Text>
            </View>
            <View className="space-y-4">
              {[
                "To process and manage your orders and payments.",
                "To provide customer support and respond to your inquiries.",
                "To send you service updates, security alerts, and marketing communications (with your consent).",
                "To prevent fraud and maintain the security of our marketplace."
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
                <Globe size={20} color="#3b82f6" />
              </View>
              <Text className="text-lg font-ubuntu-bold text-slate-900 dark:text-white">Data Sharing & Privacy</Text>
            </View>
            <View className="space-y-4">
              {[
                "We share necessary data with vendors (shops) you purchase from to fulfill orders.",
                "Third-party payment processors handle your financial data securely.",
                "Logistics partners receive shipping details to deliver your items.",
                "We never sell your personal information to third parties for marketing."
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
                <Shield size={20} color="#3b82f6" />
              </View>
              <Text className="text-lg font-ubuntu-bold text-slate-900 dark:text-white">Your Privacy Rights</Text>
            </View>
            <View className="space-y-4">
              {[
                "The right to access and receive a copy of your personal data.",
                "The right to rectify inaccurate or incomplete information.",
                "The right to request deletion of your data (subject to legal obligations).",
                "The right to withdraw consent for marketing at any time."
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
            <Text className="font-ubuntu-bold text-slate-900 dark:text-white text-lg mb-4">Questions?</Text>
            <Text className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed font-ubuntu">
              If you have any questions about this Privacy Policy or our data practices, please don't hesitate to contact our privacy team.
            </Text>
            <Pressable 
              onPress={handleEmail}
              className="flex-row items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
            >
              <Mail size={20} color="#3b82f6" />
              <View className="ml-4">
                <Text className="text-[10px] text-slate-500/60 font-ubuntu uppercase tracking-widest">Email our DPO</Text>
                <Text className="text-sm font-ubuntu-bold text-slate-900 dark:text-white">privacy@dotsoko.com</Text>
              </View>
            </Pressable>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}
