import React from 'react';
import { ScrollView, View, Text, Pressable, Linking } from 'react-native';
import { Truck, Package, Clock, MapPin, Shield, FileText, Bell, Mail, AlertCircle } from 'lucide-react-native';
import { useColorScheme } from '@hooks/useColorScheme';

export default function ShippingScreen() {
  const { isDark } = useColorScheme();

  const handleEmail = () => {
    Linking.openURL('mailto:support@dotsoko.com');
  };

  const sections = [
    {
      title: 'Delivery Areas',
      icon: MapPin,
      content: [
        'We currently ship to all major towns and cities across Kenya.',
        'Nairobi orders placed before 12pm are eligible for same-day delivery.',
        'Regional deliveries to Mombasa, Kisumu, Nakuru, and Eldoret take 1-2 business days.',
        'Remote areas and upcountry destinations may take 3-5 business days.',
      ],
    },
    {
      title: 'Shipping Rates',
      icon: Truck,
      content: [
        'Standard shipping within Nairobi: KES 150 - 300 depending on item size.',
        'Countrywide shipping: KES 350 - 700 based on weight and destination.',
        'Free shipping is available on orders above KES 5,000.',
        'Oversized or fragile items may attract additional handling fees.',
      ],
    },
    {
      title: 'Delivery Timeframes',
      icon: Clock,
      content: [
        'Same-day delivery (Nairobi only): Order before 12pm, arrive by 6pm.',
        'Standard delivery: 1-3 business days for most locations.',
        'Express delivery: Available for an additional fee, guaranteed next-day arrival.',
        'Delivery times may vary during public holidays and peak seasons.',
      ],
    },
    {
      title: 'Order Handling',
      icon: Package,
      content: [
        'Orders are processed and dispatched within 24 hours of payment confirmation.',
        'You will receive an SMS and email notification once your order is shipped.',
        'Each order includes a tracking number so you can follow your package in real time.',
        'Sellers are responsible for safely packaging items before handover to couriers.',
      ],
    },
  ];

  return (
    <View className="flex-1 bg-slate-50/50 dark:bg-slate-950">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        {/* Header */}
        <View className="bg-white dark:bg-slate-900 px-6 pt-8 pb-12 border-b border-slate-100 dark:border-white/5">
          <View className="flex-row items-center mb-4">
            <View className="flex-row items-center bg-primary/10 px-3 py-1.5 rounded-full">
              <Truck size={14} color="#3b82f6" />
              <Text className="text-xs font-ubuntu-bold text-primary ml-2">Fast & Reliable</Text>
            </View>
          </View>

          <Text className="text-3xl font-ubuntu-bold text-slate-900 dark:text-white tracking-tight leading-tight">
            Shipping Policy
          </Text>
          <Text className="mt-4 text-slate-500 dark:text-slate-400 text-sm font-ubuntu leading-relaxed">
            We partner with trusted couriers to ensure your orders arrive safely and on time. Here's everything you need to know about our shipping process.
          </Text>

          <View className="mt-6 flex-row items-center">
            <View className="flex-row items-center">
              <FileText size={14} color={isDark ? '#64748b' : '#94a3b8'} />
              <Text className="text-xs text-slate-500/80 ml-1.5 font-ubuntu">Version 1.0</Text>
            </View>
            <View className="flex-row items-center ml-4">
              <Bell size={14} color={isDark ? '#64748b' : '#94a3b8'} />
              <Text className="text-xs text-slate-500/80 ml-1.5 font-ubuntu">Last updated: Jan 14, 2026</Text>
            </View>
          </View>
        </View>

        <View className="px-6 mt-10">
          {/* Content Sections */}
          {sections.map((section, idx) => {
            const Icon = section.icon;
            return (
              <View
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl p-6 shadow-sm mb-6"
              >
                <View className="flex-row items-center mb-6">
                  <View className="w-10 h-10 rounded-xl bg-primary/5 dark:bg-primary/10 items-center justify-center mr-3">
                    <Icon size={20} color="#3b82f6" />
                  </View>
                  <Text className="text-lg font-ubuntu-bold text-slate-900 dark:text-white">{section.title}</Text>
                </View>
                {section.content.map((item, i) => (
                  <View key={i} className="flex-row items-start mb-3">
                    <View className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-2 mr-3" />
                    <Text className="flex-1 text-sm font-ubuntu text-slate-500 dark:text-slate-400 leading-relaxed">
                      {item}
                    </Text>
                  </View>
                ))}
              </View>
            );
          })}

          {/* CTA Banner */}
          <View className="p-8 bg-slate-900 rounded-3xl relative overflow-hidden border border-white/5 mb-8">
            <View className="relative z-10">
              <View className="flex-row items-center mb-4">
                <Shield size={24} color="#3b82f6" />
                <Text className="text-2xl font-ubuntu-bold text-white ml-3">Delivery Guarantee</Text>
              </View>
              <Text className="text-slate-300 font-ubuntu leading-relaxed">
                If your order is lost or significantly delayed due to a courier error, .Soko will work with the seller to provide a full refund or a free re-shipment at no extra cost to you.
              </Text>
            </View>
            <View className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/10 rounded-full opacity-50" />
          </View>

          {/* Important Notice */}
          <View className="bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-2xl p-5 mb-8">
            <View className="flex-row items-start gap-3">
              <AlertCircle size={20} color="#f59e0b" />
              <View className="flex-1">
                <Text className="font-ubuntu-bold text-amber-900 dark:text-amber-400 text-sm mb-1">Please Note</Text>
                <Text className="text-sm font-ubuntu text-amber-700 dark:text-amber-400/80 leading-relaxed">
                  Delivery times are estimates and may be affected by weather, public holidays, or high order volumes during sale events.
                </Text>
              </View>
            </View>
          </View>

          {/* Support Contact Card */}
          <View className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl p-6 mb-6">
            <Text className="font-ubuntu-bold text-slate-900 dark:text-white text-lg mb-4">Shipping Support</Text>
            <Text className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed font-ubuntu">
              Having trouble with your delivery? Our support team is available to help resolve any shipping issues quickly.
            </Text>
            <Pressable
              onPress={handleEmail}
              className="flex-row items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
            >
              <Mail size={20} color="#3b82f6" />
              <View className="ml-4">
                <Text className="text-[10px] text-slate-500/60 font-ubuntu uppercase tracking-widest">Delivery Support</Text>
                <Text className="text-sm font-ubuntu-bold text-slate-900 dark:text-white">support@dotsoko.com</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
