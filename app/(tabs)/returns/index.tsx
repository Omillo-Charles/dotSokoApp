import React from 'react';
import { ScrollView, View, Text, Pressable, Linking } from 'react-native';
import { RefreshCcw, Package, CreditCard, Truck, ShieldCheck, FileText, Bell, Mail } from 'lucide-react-native';
import { useColorScheme } from '../../../hooks/useColorScheme';

export default function ReturnsScreen() {
  const { isDark } = useColorScheme();

  const handleEmail = () => {
    Linking.openURL('mailto:support@dotsoko.com');
  };

  const sections = [
    {
      title: 'Return Eligibility',
      icon: Package,
      content: [
        'Items must be returned within 14 days of delivery.',
        'Products must be in their original packaging with all tags attached.',
        'Items must be unused, unwashed, and in the same condition as received.',
        'Certain items (hygiene products, custom orders) are non-returnable.',
      ],
    },
    {
      title: 'The Return Process',
      icon: RefreshCcw,
      content: [
        "Initiate your return through your 'Order History' in your .Soko account.",
        'Select the reason for return and upload photos if the item is damaged.',
        'Wait for the seller\'s approval (usually within 24-48 hours).',
        "Once approved, you'll receive a return shipping label or instructions.",
      ],
    },
    {
      title: 'Refunds & Credit',
      icon: CreditCard,
      content: [
        'Refunds are processed back to your original payment method.',
        'Processing time usually takes 5-10 business days after the item is received.',
        'You may opt for .Soko Store Credit for faster reimbursement.',
        'Shipping costs are non-refundable unless the item was faulty.',
      ],
    },
    {
      title: 'Shipping Your Return',
      icon: Truck,
      content: [
        'Pack the item securely to prevent damage during transit.',
        'Include the original packing slip or return authorization form.',
        'Use the provided shipping label or a trackable shipping service.',
        'Keep your tracking number until the refund is fully processed.',
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
              <RefreshCcw size={14} color="#3b82f6" />
              <Text className="text-xs font-ubuntu-bold text-primary ml-2">Easy Returns</Text>
            </View>
          </View>

          <Text className="text-3xl font-ubuntu-bold text-slate-900 dark:text-white tracking-tight leading-tight">
            Returns & Refunds
          </Text>
          <Text className="mt-4 text-slate-500 dark:text-slate-400 text-sm font-ubuntu leading-relaxed">
            We want you to be completely satisfied with your purchase. If something isn't quite right, our straightforward return policy ensures a hassle-free experience.
          </Text>

          <View className="mt-6 flex-row items-center">
            <View className="flex-row items-center">
              <FileText size={14} color={isDark ? '#64748b' : '#94a3b8'} />
              <Text className="text-xs text-slate-500/80 ml-1.5 font-ubuntu">Version 1.5</Text>
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

          {/* Buyer Protection CTA Card */}
          <View className="p-8 bg-slate-900 rounded-3xl relative overflow-hidden border border-white/5 mb-8">
            <View className="relative z-10">
              <View className="flex-row items-center mb-4">
                <ShieldCheck size={24} color="#3b82f6" />
                <Text className="text-2xl font-ubuntu-bold text-white ml-3">Buyer Protection</Text>
              </View>
              <Text className="text-slate-300 font-ubuntu leading-relaxed">
                Every purchase on .Soko is covered by our Buyer Protection program. If your item doesn't arrive or is significantly different from the description, we guarantee a full refund.
              </Text>
            </View>
            <View className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/10 rounded-full opacity-50" />
          </View>

          {/* Sidebar Contact Card */}
          <View className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl p-6 mb-6">
            <Text className="font-ubuntu-bold text-slate-900 dark:text-white text-lg mb-4">Start a Return</Text>
            <Text className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed font-ubuntu">
              The quickest way to handle a return is through your user dashboard. Need help with a specific order?
            </Text>
            <Pressable
              onPress={handleEmail}
              className="flex-row items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
            >
              <Mail size={20} color="#3b82f6" />
              <View className="ml-4">
                <Text className="text-[10px] text-slate-500/60 font-ubuntu uppercase tracking-widest">Customer Support</Text>
                <Text className="text-sm font-ubuntu-bold text-slate-900 dark:text-white">support@dotsoko.com</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
