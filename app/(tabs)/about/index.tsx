import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "../../../hooks/useColorScheme";

const { width } = Dimensions.get("window");

const StatCard = ({ label, value }: { label: string; value: string }) => (
  <View className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl p-5 items-center justify-center flex-1 mx-1 shadow-sm h-28">
    <Text className="text-2xl font-ubuntu-bold text-slate-900 dark:text-white mb-1">{value}</Text>
    <Text className="text-[10px] font-ubuntu-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center">
      {label}
    </Text>
  </View>
);

const AboutSection = ({ title, content, icon }: { title: string; content: string[]; icon: string }) => (
  <View className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl p-6 mb-8 shadow-sm">
    <View className="flex-row items-center mb-6">
      <View className="w-10 h-10 rounded-xl bg-primary/5 dark:bg-primary/10 items-center justify-center mr-3">
        <Ionicons name={icon as any} size={20} color="#3b82f6" />
      </View>
      <Text className="text-lg font-ubuntu-bold text-slate-900 dark:text-white">{title}</Text>
    </View>
    <View className="space-y-4">
      {content.map((text, index) => (
        <View key={index} className="flex-row items-start mb-3">
          <View className="w-1.5 h-1.5 rounded-full bg-primary/30 mt-2 mr-3" />
          <Text className="flex-1 text-sm font-ubuntu text-slate-500 dark:text-slate-400 leading-relaxed">
            {text}
          </Text>
        </View>
      ))}
    </View>
  </View>
);

export default function AboutScreen() {
  const { isDark } = useColorScheme();
  const router = useRouter();

  const stats = [
    { label: "Active Users", value: "10k+" },
    { label: "Sellers", value: "5k+" },
    { label: "Products", value: "25k+" },
  ];

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
            Empowering Digital Commerce
          </Text>
          <Text className="mt-4 text-slate-500 dark:text-slate-400 text-lg font-ubuntu leading-relaxed">
            Welcome to .Soko, the ultimate multivendor marketplace connecting buyers and sellers in a seamless, secure ecosystem.
          </Text>

          <View className="mt-6 flex-row items-center gap-4">
            <View className="flex-row items-center">
              <Ionicons name="document-text-outline" size={14} color={isDark ? "#64748b" : "#94a3b8"} />
              <Text className="text-xs text-slate-500/60 ml-1.5 font-ubuntu">Version 1.0</Text>
            </View>
            <View className="flex-row items-center ml-4">
              <Ionicons name="calendar-outline" size={14} color={isDark ? "#64748b" : "#94a3b8"} />
              <Text className="text-xs text-slate-500/60 ml-1.5 font-ubuntu">Updated 2026</Text>
            </View>
          </View>
        </View>

        <View className="px-6 mt-10">
          {/* Stats Grid */}
          <View className="flex-row justify-between mb-12">
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </View>

          <AboutSection 
            title="Our Mission"
            icon="target"
            content={[
              ".Soko is more than just a marketplace. We are a community-driven platform designed to connect people with quality products while helping businesses thrive in the digital age.",
              "We believe in democratizing commerce by providing tools that allow anyone, anywhere to start and grow their business.",
              "Our mission is to create a seamless, secure, and enjoyable shopping experience for everyone."
            ]}
          />

          <AboutSection 
            title="Our Story"
            icon="globe"
            content={[
              "Starting in 2024, we set out to bridge the gap between local artisans and global markets.",
              "In a rapidly changing world, we noticed that many talented sellers were struggling to find their place online. We built .Soko to solve this problem.",
              "Today, we are proud to support thousands of entrepreneurs across the region, providing them with the tools they need to succeed."
            ]}
          />

          <AboutSection 
            title="Core Values"
            icon="heart"
            content={[
              "Trust & Security: We prioritize the safety of our buyers and sellers with secure payment systems and verified profiles.",
              "Community First: Building a thriving ecosystem where small businesses and individual sellers can grow and succeed.",
              "Innovation: Continuously improving our platform with the latest technology to provide a seamless shopping experience.",
              "Sustainability: Supporting local economies and promoting sustainable commerce across the region."
            ]}
          />

          {/* CTA Card */}
          <View className="p-8 bg-slate-900 rounded-3xl relative overflow-hidden border border-white/5 mb-10">
            <View className="relative z-10">
              <View className="flex-row items-center mb-4">
                <Ionicons name="briefcase" size={24} color="#3b82f6" />
                <Text className="text-2xl font-ubuntu-bold text-white ml-3">Join Our Team</Text>
              </View>
              <Text className="text-slate-400 font-ubuntu leading-relaxed mb-6">
                We are always looking for passionate individuals to help us build the future of commerce. Check out our careers page for open positions.
              </Text>
              
              <TouchableOpacity 
                className="bg-white px-6 py-3.5 rounded-xl flex-row items-center justify-center self-start"
                onPress={() => {}}
              >
                <Text className="text-slate-900 font-ubuntu-bold text-base">View Openings</Text>
                <Ionicons name="arrow-forward" size={18} color="#0f172a" className="ml-2" />
              </TouchableOpacity>
            </View>
            <View className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-50" />
          </View>

          {/* Sidebar-style Contact Card */}
          <View className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl p-6 mb-6">
            <Text className="font-ubuntu-bold text-slate-900 dark:text-white text-lg mb-4">Get in Touch</Text>
            <Text className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed font-ubuntu">
              Have questions or want to partner with us? We'd love to hear from you.
            </Text>
            <TouchableOpacity 
              onPress={() => Linking.openURL('mailto:hello@dotsoko.com')}
              className="flex-row items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
            >
              <Ionicons name="mail" size={20} color="#3b82f6" />
              <View className="ml-4">
                <Text className="text-[10px] text-slate-500/60 font-ubuntu uppercase tracking-wider">General Inquiries</Text>
                <Text className="text-sm font-ubuntu-bold text-slate-900 dark:text-white">hello@dotsoko.com</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
