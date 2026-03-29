import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable, Platform, Alert } from 'react-native';
import { CheckCircle2, X } from 'lucide-react-native';
import { Star } from 'lucide-react-native';
import { router } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function PremiumScreen() {
  const [isAnnual, setIsAnnual] = useState(false);
  const { isDark } = useColorScheme();

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
    if (status === false) return <X size={16} color={isDark ? "#64748b" : "#94a3b8"} />;
    return (
      <Text style={{ 
        fontSize: 10, 
        fontFamily: 'Ubuntu-Bold', 
        textTransform: 'uppercase', 
        letterSpacing: 1.5, 
        color: isDark ? '#94a3b8' : '#64748b',
        textAlign: 'center'
      }}>
        {status as string}
      </Text>
    );
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: isDark ? '#020617' : '#f8fafc' }}
      contentContainerStyle={{ paddingBottom: 60 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header section */}
      <View style={{ gap: 24, paddingHorizontal: 24, paddingTop: 32, paddingBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ 
              fontSize: 30, 
              fontFamily: 'Ubuntu-Bold', 
              color: isDark ? '#ffffff' : '#0f172a',
              letterSpacing: -0.5,
              textTransform: 'uppercase'
            }}>
              Premium Access
            </Text>
            <Text style={{ 
              color: isDark ? '#94a3b8' : '#64748b',
              fontFamily: 'Ubuntu-Medium',
              fontSize: 14,
              marginTop: 4
            }}>
              Elevate your commerce experience
            </Text>
          </View>
        </View>

        {/* Custom Toggle */}
        <View style={{ 
          alignSelf: 'flex-start',
          flexDirection: 'row',
          alignItems: 'center',
          padding: 4,
          backgroundColor: isDark ? '#0f172a' : '#ffffff',
          borderWidth: 1,
          borderColor: isDark ? '#1e293b' : '#e2e8f0',
          borderRadius: 16
        }}>
          <Pressable
            onPress={() => setIsAnnual(false)}
            style={{
              paddingHorizontal: 24,
              paddingVertical: 10,
              borderRadius: 12,
              justifyContent: 'center',
              backgroundColor: !isAnnual ? '#3b82f6' : 'transparent'
            }}
          >
            <Text style={{
              fontSize: 10,
              fontFamily: 'Ubuntu-Bold',
              textTransform: 'uppercase',
              letterSpacing: 1.5,
              color: !isAnnual ? '#ffffff' : (isDark ? '#64748b' : '#94a3b8')
            }}>
              Monthly
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setIsAnnual(true)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 24,
              paddingVertical: 10,
              borderRadius: 12,
              justifyContent: 'center',
              backgroundColor: isAnnual ? '#3b82f6' : 'transparent'
            }}
          >
            <Text style={{
              fontSize: 10,
              fontFamily: 'Ubuntu-Bold',
              textTransform: 'uppercase',
              letterSpacing: 1.5,
              color: isAnnual ? '#ffffff' : (isDark ? '#64748b' : '#94a3b8')
            }}>
              Annual
            </Text>
            <Text style={{
              fontSize: 9,
              fontFamily: 'Ubuntu-Bold',
              marginLeft: 4,
              color: isAnnual ? 'rgba(255,255,255,0.7)' : (isDark ? '#475569' : '#94a3b8')
            }}>
              -20%
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={{ paddingHorizontal: 24, marginTop: 16 }}>
      {/* Pricing Cards Grid */}
      <View style={{ gap: 24, marginBottom: 64 }}>
        {plans.map((plan, index) => {
          const isCurrentPlan = user?.isPremium
            ? plan.id === (user.premiumPlan?.toLowerCase() || 'premium')
            : plan.id === 'free';

          return (
            <View
              key={index}
              style={{
                backgroundColor: isDark ? 'rgba(15,23,42,0.6)' : 'rgba(248,250,252,0.8)',
                padding: 32,
                borderRadius: 32,
                borderWidth: 1,
                borderColor: plan.popular ? '#f97316' : (isDark ? '#1e293b' : '#e2e8f0')
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <Text style={{ 
                  fontSize: 24, 
                  fontFamily: 'Ubuntu-Bold', 
                  textTransform: 'uppercase', 
                  letterSpacing: -0.5,
                  color: isDark ? '#ffffff' : '#0f172a'
                }}>
                  {plan.name}
                </Text>
                {plan.popular && (
                  <View style={{ 
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    gap: 6, 
                    paddingHorizontal: 12, 
                    paddingVertical: 4, 
                    backgroundColor: 'rgba(249,115,22,0.1)', 
                    borderRadius: 20, 
                    borderWidth: 1, 
                    borderColor: 'rgba(249,115,22,0.2)' 
                  }}>
                    <Star size={10} color="#f97316" fill="#f97316" />
                    <Text style={{ 
                      fontSize: 10, 
                      fontFamily: 'Ubuntu-Bold', 
                      color: '#f97316', 
                      textTransform: 'uppercase', 
                      letterSpacing: 1.5 
                    }}>
                      Popular
                    </Text>
                  </View>
                )}
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
                <Text style={{ 
                  fontSize: 30, 
                  fontFamily: 'Ubuntu-Bold', 
                  letterSpacing: -0.5,
                  color: isDark ? '#ffffff' : '#0f172a'
                }}>
                  KES {isAnnual ? plan.price.annual : plan.price.monthly}
                </Text>
                <Text style={{ 
                  fontSize: 10, 
                  fontFamily: 'Ubuntu-Bold', 
                  textTransform: 'uppercase', 
                  letterSpacing: 1.5,
                  color: isDark ? '#64748b' : '#94a3b8',
                  opacity: 0.6
                }}>
                  / {isAnnual ? 'yr' : 'mo'}
                </Text>
              </View>

              <Text style={{ 
                color: isDark ? '#94a3b8' : '#64748b',
                fontFamily: 'Ubuntu-Medium',
                fontSize: 14,
                marginBottom: 32,
                lineHeight: 22
              }}>
                {plan.description}
              </Text>

              <View style={{ gap: 16, marginBottom: 32 }}>
                {plan.features.slice(0, 4).map((feature, fIndex) => (
                  <View key={fIndex} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <CheckCircle2 size={16} color="#f97316" style={{ opacity: 0.6 }} />
                    <Text style={{ 
                      flex: 1, 
                      fontSize: 12, 
                      fontFamily: 'Ubuntu-Bold', 
                      textTransform: 'uppercase', 
                      letterSpacing: 1.5,
                      color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(15,23,42,0.8)',
                      lineHeight: 20
                    }}>
                      {feature}
                    </Text>
                  </View>
                ))}
                {plan.features.length > 4 && (
                  <Text style={{ 
                    fontSize: 10, 
                    fontFamily: 'Ubuntu-Bold', 
                    textTransform: 'uppercase',
                    color: 'rgba(249,115,22,0.6)',
                    marginLeft: 32,
                    letterSpacing: 1.5
                  }}>
                    + and more
                  </Text>
                )}
              </View>

              <Pressable
                onPress={() => !isCurrentPlan && handleUpgradeClick(plan)}
                disabled={isCurrentPlan}
                style={{
                  paddingVertical: 16,
                  borderRadius: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isCurrentPlan
                    ? (isDark ? 'rgba(51,65,85,0.5)' : 'rgba(226,232,240,0.5)')
                    : plan.popular
                    ? '#f97316'
                    : (isDark ? '#ffffff' : '#0f172a'),
                  borderWidth: isCurrentPlan ? 1 : 0,
                  borderColor: isDark ? '#334155' : '#cbd5e1'
                }}
              >
                <Text style={{
                  fontSize: 12,
                  fontFamily: 'Ubuntu-Bold',
                  textTransform: 'uppercase',
                  letterSpacing: 2,
                  color: isCurrentPlan
                    ? (isDark ? '#64748b' : '#94a3b8')
                    : plan.popular
                    ? '#ffffff'
                    : (isDark ? '#0f172a' : '#ffffff')
                }}>
                  {isCurrentPlan ? 'Active Protocol' : plan.buttonText}
                </Text>
              </Pressable>
            </View>
          );
        })}
      </View>

      {/* Modern Comparison Table */}
      <View style={{ marginBottom: 32 }}>
        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <Text style={{ 
            fontSize: 24, 
            fontFamily: 'Ubuntu-Bold', 
            textTransform: 'uppercase', 
            letterSpacing: -0.5,
            color: isDark ? '#ffffff' : '#0f172a',
            marginBottom: 4
          }}>
            Tier Comparison
          </Text>
          <Text style={{ 
            color: isDark ? '#64748b' : '#94a3b8',
            fontFamily: 'Ubuntu-Bold',
            fontSize: 10,
            textTransform: 'uppercase',
            letterSpacing: 3
          }}>
            Protocol Specifications
          </Text>
        </View>

        <View style={{ paddingBottom: 16 }}>
          {/* Table Header */}
          <View style={{ 
            flexDirection: 'row', 
            borderBottomWidth: 1, 
            borderBottomColor: isDark ? '#334155' : '#cbd5e1',
            paddingBottom: 16, 
            marginBottom: 16 
          }}>
            <View style={{ width: '34%', justifyContent: 'center', paddingRight: 4 }}>
              <Text style={{ 
                fontSize: 9, 
                fontFamily: 'Ubuntu-Bold', 
                textTransform: 'uppercase', 
                letterSpacing: 1.5,
                color: isDark ? '#64748b' : '#94a3b8'
              }}>
                Privileges
              </Text>
            </View>
            <View style={{ width: '20%', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 2 }}>
              <Text style={{ 
                fontSize: 9, 
                fontFamily: 'Ubuntu-Bold', 
                textTransform: 'uppercase',
                color: isDark ? '#64748b' : '#94a3b8',
                textAlign: 'center'
              }}>
                Free
              </Text>
            </View>
            <View style={{ width: '23%', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 2 }}>
              <Text style={{ 
                fontSize: 9, 
                fontFamily: 'Ubuntu-Bold', 
                textTransform: 'uppercase', 
                letterSpacing: 0.5,
                color: '#f97316',
                textAlign: 'center'
              }}>
                Premium
              </Text>
            </View>
            <View style={{ width: '23%', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 2 }}>
              <Text style={{ 
                fontSize: 9, 
                fontFamily: 'Ubuntu-Bold', 
                textTransform: 'uppercase', 
                letterSpacing: 0.5,
                color: isDark ? '#64748b' : '#94a3b8',
                textAlign: 'center'
              }}>
                Enterprise
              </Text>
            </View>
          </View>

          {/* Table Body */}
          {comparison.map((cat, cIdx) => (
            <View key={cIdx} style={{ width: '100%' }}>
              {/* Category Header */}
              <View style={{ paddingVertical: 24, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ 
                  fontSize: 10, 
                  fontFamily: 'Ubuntu-Bold', 
                  textTransform: 'uppercase', 
                  letterSpacing: 2,
                  color: '#3b82f6',
                  textAlign: 'center'
                }}>
                  {cat.category}
                </Text>
              </View>

              {/* Features rows */}
              {cat.features.map((feat, fIdx) => {
                return (
                  <View key={fIdx} style={{ 
                    flexDirection: 'row', 
                    borderBottomWidth: 1, 
                    borderBottomColor: isDark ? '#334155' : '#cbd5e1',
                    paddingVertical: 16 
                  }}>
                    <View style={{ width: '34%', justifyContent: 'center', paddingRight: 8 }}>
                      <Text style={{ 
                        fontSize: 10, 
                        fontFamily: 'Ubuntu-Bold', 
                        textTransform: 'uppercase',
                        color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(15,23,42,0.8)',
                        lineHeight: 16
                      }}>
                        {feat.name}
                      </Text>
                    </View>
                    <View style={{ 
                      width: '20%', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      borderLeftWidth: 1, 
                      borderLeftColor: isDark ? '#334155' : '#cbd5e1'
                    }}>
                       <StatusIcon status={feat.free} />
                    </View>
                    <View style={{ 
                      width: '23%', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      borderLeftWidth: 1,
                      borderRightWidth: 1,
                      borderLeftColor: 'rgba(59,130,246,0.25)',
                      borderRightColor: 'rgba(59,130,246,0.25)',
                      backgroundColor: 'rgba(59,130,246,0.05)'
                    }}>
                      <StatusIcon status={feat.premium} />
                    </View>
                    <View style={{ 
                      width: '23%', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      borderRightWidth: 1, 
                      borderRightColor: isDark ? '#334155' : '#cbd5e1'
                    }}>
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
