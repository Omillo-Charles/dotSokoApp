import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable, Platform, Alert } from 'react-native';
import { CheckCircle2, X } from 'lucide-react-native';
import { Star } from 'lucide-react-native';
import { router } from 'expo-router';

export default function PremiumScreen() {
  const [isAnnual, setIsAnnual] = useState(false);

  // Mock user for now since we just need to replicate UI
  const user = { isPremium: false, premiumPlan: 'free' };

  const handleUpgradeClick = (plan: any) => {
    if (plan.name === 'Free') return;
    Alert.alert('Upgrade', `Proceed to upgrade to ${plan.name} for KES ${isAnnual ? plan.price.annual : plan.price.monthly}?`);
  };

  const plans = [
    {
      name: 'Free',
      id: 'free',
      price: { monthly: '0', annual: '0' },
      description: 'Essential tools for individuals',
      features: [
        'Unlimited product listings',
        'Standard seller dashboard',
        'Community support',
        'Basic analytics',
      ],
      buttonText: 'Current Plan',
    },
    {
      name: 'Premium',
      id: 'premium',
      price: { monthly: '350', annual: '3360' },
      description: 'Professional power for growing shops',
      features: [
        'Verification Gold Badge',
        'Priority in search results',
        'Get Paid to Sell (Monetization)',
        'Featured shop placement',
        '24/7 Priority support',
        'Lower transaction fees',
      ],
      buttonText: 'Subscribe',
      popular: true,
    },
    {
      name: 'Enterprise',
      id: 'enterprise',
      price: { monthly: '750', annual: '7200' },
      description: 'Scale your empire with professional tools',
      features: [
        'Everything in Premium',
        'Dedicated Account Manager',
        'Custom branding options',
        'Bulk inventory management',
        'Multi-user access (Teams)',
        'Revenue sharing programs',
      ],
      buttonText: 'Subscribe',
    },
  ];

  const comparison = [
    {
      category: 'Marketplace Presence',
      features: [
        { name: 'Product Listings', free: true, premium: true, enterprise: true },
        { name: 'Verification Gold Badge', free: false, premium: true, enterprise: true },
        { name: 'Priority in Search', free: false, premium: true, enterprise: true },
        { name: 'Featured Shop Placement', free: false, premium: true, enterprise: true },
      ],
    },
    {
      category: 'Revenue & Analytics',
      features: [
        { name: 'Get Paid to Sell', free: false, premium: 'Tier 1', enterprise: 'Tier 2' },
        { name: 'Standard Sales Data', free: true, premium: true, enterprise: true },
        { name: 'Revenue Sharing', free: false, premium: '5%', enterprise: '10%' },
        { name: 'Lower Transaction Fees', free: false, premium: true, enterprise: true },
        { name: 'Inventory Management', free: 'Basic', premium: 'Advanced', enterprise: 'Bulk' },
      ],
    },
    {
      category: 'Support & Teams',
      features: [
        { name: 'Community Support', free: true, premium: true, enterprise: true },
        { name: '24/7 Priority Support', free: false, premium: true, enterprise: true },
        { name: 'Account Manager', free: false, premium: false, enterprise: true },
        { name: 'Multi-user Access', free: false, premium: false, enterprise: true },
      ],
    },
  ];

  const StatusIcon = ({ status }: { status: boolean | string }) => {
    if (status === true) return <CheckCircle2 size={16} color="#3b82f6" />;
    if (status === false) return <X size={16} color="#475569" />;
    return (
      <Text className="text-[10px] font-ubuntu-bold uppercase tracking-widest text-foreground/70 text-center">
        {status as string}
      </Text>
    );
  };

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingBottom: 60 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header section translated */}
      <View className="flex-col gap-6 px-6 pt-8 pb-4">
        <View className="flex-row items-center gap-4">
          <View className="flex-1">
            <Text className="text-3xl font-ubuntu-bold text-foreground tracking-tighter uppercase">
              Premium Access
            </Text>
            <Text className="text-muted-foreground font-ubuntu-medium text-sm mt-1">
              Elevate your commerce experience
            </Text>
          </View>
        </View>

        {/* Custom Toggle */}
        <View className="self-start flex-row items-center p-1 bg-slate-900 border border-slate-800 rounded-2xl">
          <Pressable
            onPress={() => setIsAnnual(false)}
            className={`px-6 py-2.5 rounded-xl justify-center ${
              !isAnnual ? 'bg-[#3b82f6]' : 'bg-transparent'
            }`}
          >
            <Text
              className={`text-[10px] font-ubuntu-bold uppercase tracking-widest ${
                !isAnnual ? 'text-white' : 'text-slate-400'
              }`}
            >
              Monthly
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setIsAnnual(true)}
            className={`flex-row items-center px-6 py-2.5 rounded-xl justify-center ${
              isAnnual ? 'bg-[#3b82f6]' : 'bg-transparent'
            }`}
          >
            <Text
              className={`text-[10px] font-ubuntu-bold uppercase tracking-widest ${
                isAnnual ? 'text-white' : 'text-slate-400'
              }`}
            >
              Annual
            </Text>
            <Text
              className={`text-[9px] font-ubuntu-bold ml-1 ${
                isAnnual ? 'text-white/70' : 'text-slate-500'
              }`}
            >
              -20%
            </Text>
          </Pressable>
        </View>
      </View>

      <View className="px-6 mt-4">
      {/* Pricing Cards Grid */}
      <View className="flex-col gap-6 mb-16">
        {plans.map((plan, index) => {
          const isCurrentPlan = user?.isPremium
            ? plan.id === (user.premiumPlan?.toLowerCase() || 'premium')
            : plan.id === 'free';

          return (
            <View
              key={index}
              className={`bg-accent/40 p-8 rounded-[2rem] border ${
                plan.popular ? 'border-primary' : 'border-border'
              }`}
            >
              <View className="flex-row items-center justify-between mb-6">
                <Text className="text-2xl font-ubuntu-bold uppercase tracking-tighter text-foreground">
                  {plan.name}
                </Text>
                {plan.popular && (
                  <View className="flex-row items-center gap-1.5 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                    <Star size={10} className="color-primary" />
                    <Text className="text-[10px] font-ubuntu-bold text-primary uppercase tracking-widest">
                      Popular
                    </Text>
                  </View>
                )}
              </View>

              <View className="flex-row items-baseline gap-2 mb-3">
                <Text className="text-3xl font-ubuntu-bold tracking-tighter text-foreground">
                  KES {isAnnual ? plan.price.annual : plan.price.monthly}
                </Text>
                <Text className="text-[10px] font-ubuntu-bold uppercase tracking-widest text-muted-foreground opacity-60">
                  / {isAnnual ? 'yr' : 'mo'}
                </Text>
              </View>

              <Text className="text-muted-foreground font-ubuntu-medium text-sm mb-8 leading-relaxed">
                {plan.description}
              </Text>

              <View className="flex-col gap-4 mb-8">
                {plan.features.slice(0, 4).map((feature, fIndex) => (
                  <View key={fIndex} className="flex-row items-center gap-3">
                    <CheckCircle2 size={16} className="color-primary opacity-60" />
                    <Text className="flex-1 text-xs font-ubuntu-bold uppercase tracking-widest text-foreground/80 leading-5">
                      {feature}
                    </Text>
                  </View>
                ))}
                {plan.features.length > 4 && (
                  <Text className="text-[10px] font-ubuntu-bold uppercase text-primary/60 ml-8 tracking-widest">
                    + and more
                  </Text>
                )}
              </View>

              <Pressable
                onPress={() => !isCurrentPlan && handleUpgradeClick(plan)}
                disabled={isCurrentPlan}
                className={`py-4 rounded-2xl items-center justify-center ${
                  isCurrentPlan
                    ? 'bg-muted/50 border border-border border-solid'
                    : plan.popular
                    ? 'bg-primary'
                    : 'bg-foreground'
                }`}
              >
                <Text
                  className={`text-xs font-ubuntu-bold uppercase tracking-[0.2em] ${
                    isCurrentPlan
                      ? 'text-muted-foreground'
                      : plan.popular
                      ? 'text-primary-foreground'
                      : 'text-background'
                  }`}
                >
                  {isCurrentPlan ? 'Active Protocol' : plan.buttonText}
                </Text>
              </Pressable>
            </View>
          );
        })}
      </View>

      {/* Modern Comparison Table */}
      <View className="mb-8">
        <View className="items-center mb-10">
          <Text className="text-2xl font-ubuntu-bold uppercase tracking-tighter text-foreground mb-1">
            Tier Comparison
          </Text>
          <Text className="text-muted-foreground font-ubuntu-bold text-[10px] uppercase tracking-[0.3em]">
            Protocol Specifications
          </Text>
        </View>

        <View className="flex-col pb-4">
          {/* Table Header */}
          <View className="flex-row border-b border-[#64748b] pb-4 mb-4">
            <View className="w-[34%] justify-center pr-1">
              <Text className="text-[9px] font-ubuntu-bold uppercase tracking-widest text-muted-foreground">
                Privileges
              </Text>
            </View>
            <View className="w-[20%] items-center justify-center px-0.5">
              <Text className="text-[9px] font-ubuntu-bold uppercase text-muted-foreground text-center">
                Free
              </Text>
            </View>
            <View className="w-[23%] items-center justify-center px-0.5">
              <Text className="text-[9px] font-ubuntu-bold uppercase tracking-wide text-primary text-center">
                Premium
              </Text>
            </View>
            <View className="w-[23%] items-center justify-center px-0.5">
              <Text className="text-[9px] font-ubuntu-bold uppercase tracking-wide text-muted-foreground text-center">
                Enterprise
              </Text>
            </View>
          </View>

          {/* Table Body */}
          {comparison.map((cat, cIdx) => (
            <View key={cIdx} className="w-full">
              {/* Category Header */}
              <View className="py-6 justify-center items-center">
                <Text className="text-[10px] font-ubuntu-bold uppercase tracking-[0.2em] text-[#3b82f6] text-center">
                  {cat.category}
                </Text>
              </View>

              {/* Features rows */}
              {cat.features.map((feat, fIdx) => {
                return (
                  <View key={fIdx} className="flex-row border-b border-[#64748b] py-4">
                    <View className="w-[34%] justify-center pr-2">
                      <Text className="text-[10px] font-ubuntu-bold uppercase text-foreground/80 leading-snug">
                        {feat.name}
                      </Text>
                    </View>
                    <View className="w-[20%] items-center justify-center border-l border-[#64748b]">
                       <StatusIcon status={feat.free} />
                    </View>
                    <View className="w-[23%] items-center justify-center border-x border-[#3b82f640] bg-[#3b82f60d]">
                      <StatusIcon status={feat.premium} />
                    </View>
                    <View className="w-[23%] items-center justify-center border-r border-[#64748b]">
                      <StatusIcon status={feat.enterprise} />
                    </View>
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      </View>
      </View>
    </ScrollView>
  );
}
