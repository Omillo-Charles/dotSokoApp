import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert, 
  KeyboardAvoidingView, 
  Platform,
  Image,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  Ionicons, 
  MaterialCommunityIcons,
  FontAwesome5
} from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from "@/hooks/useColorScheme";
import api from '@/lib/api';
import { useQueryClient } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { 
  Store, 
  MapPin, 
  Phone, 
  Mail, 
  Package, 
  CheckCircle2, 
  AtSign, 
  Loader2, 
  AlertCircle, 
  Building, 
  PenSquare, 
  Contact, 
  Camera, 
  Image as ImageIcon,
  ChevronRight,
  ChevronLeft
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { label: "Clothing & Apparel", value: "clothing-apparel" },
  { label: "Footwear", value: "footwear" },
  { label: "Fashion Accessories", value: "fashion-accessories" },
  { label: "Electronics", value: "electronics" },
  { label: "Phone Accessories", value: "phone-accessories" },
  { label: "Home Appliances", value: "home-appliances" },
  { label: "Beauty Products", value: "beauty-products" },
  { label: "Personal Care Items", value: "personal-care" },
  { label: "Watches & Jewelry", value: "watches-jewelry" },
  { label: "Groceries & Packaged Foods", value: "groceries-packaged-foods" },
  { label: "Furniture", value: "furniture" },
  { label: "Home Décor", value: "home-decor" },
  { label: "Kitchenware", value: "kitchenware" },
  { label: "Books & Stationery", value: "books-stationery" },
  { label: "Baby Products", value: "baby-products" },
  { label: "Toys & Games", value: "toys-games" },
  { label: "Sports & Fitness Equipment", value: "sports-fitness" },
  { label: "Computer Accessories", value: "computer-accessories" },
  { label: "Office Supplies", value: "office-supplies" },
  { label: "Digital Products", value: "digital-products" },
  { label: "Automotive Accessories", value: "automotive-accessories" },
  { label: "Pet Supplies", value: "pet-supplies" },
  { label: "Health Products", value: "health-products" },
  { label: "Craft & DIY Supplies", value: "craft-diy" },
  { label: "Event & Party Supplies", value: "event-party-supplies" },
  { label: "Farm Products", value: "farm-products" },
];

export default function CreateShopScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark } = useColorScheme();
  const queryClient = useQueryClient();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    description: '',
    category: '',
    address: '',
    phone: '',
    email: '',
  });

  const [avatar, setAvatar] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);
  
  const [usernameStatus, setUsernameStatus] = useState<{
    loading: boolean;
    available: boolean | null;
    error: string | null;
  }>({
    loading: false,
    available: null,
    error: null
  });

  // Debounced Username Check
  useEffect(() => {
    const checkUsername = async () => {
      if (!formData.username) {
        setUsernameStatus({ loading: false, available: null, error: null });
        return;
      }
      if (formData.username.length < 3) {
        setUsernameStatus({ loading: false, available: null, error: "Username too short" });
        return;
      }
      if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
        setUsernameStatus({ loading: false, available: null, error: "Letters, numbers, underscores only" });
        return;
      }

      setUsernameStatus(prev => ({ ...prev, loading: true }));
      try {
        const res = await api.get(`/shops/check-username/${formData.username}`);
        setUsernameStatus({
          loading: false,
          available: res.data.available,
          error: res.data.available ? null : "Username already taken"
        });
      } catch (e) {
        setUsernameStatus({ loading: false, available: null, error: "Availability check failed" });
      }
    };

    const timeoutId = setTimeout(checkUsername, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.username]);

  const pickImage = async (type: 'avatar' | 'banner') => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: type === 'avatar' ? [1, 1] : [16, 9],
      quality: 0.7,
    });

    if (!result.canceled) {
      if (type === 'avatar') setAvatar(result.assets[0].uri);
      else setBanner(result.assets[0].uri);
    }
  };

  const handleCreate = async () => {
    setLoading(true);
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value);
      });

      if (avatar) {
        const filename = avatar.split('/').pop() || 'avatar.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;
        // @ts-ignore
        form.append('avatar', { uri: avatar, name: filename, type });
      }

      if (banner) {
        const filename = banner.split('/').pop() || 'banner.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;
        // @ts-ignore
        form.append('banner', { uri: banner, name: filename, type });
      }

      const response = await api.post('/shops', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        // Update local storage user account type
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          user.accountType = 'seller';
          await AsyncStorage.setItem('user', JSON.stringify(user));
        }

        Alert.alert("Success", "Welcome to the dotSoko sellers community!");
        queryClient.invalidateQueries({ queryKey: ['my-shop'] });
        router.replace("/seller/" as any);
      }
    } catch (error: any) {
      console.error("Shop Creation Error:", error);
      Alert.alert("Error", error.response?.data?.message || "Failed to launch shop");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, title: 'Identity', icon: Building },
    { id: 2, title: 'Details', icon: PenSquare },
    { id: 3, title: 'Branding', icon: Camera },
    { id: 4, title: 'Contact', icon: Contact },
  ];

  const canGoNext = () => {
    if (step === 1) return formData.name.length >= 3 && usernameStatus.available;
    if (step === 2) return formData.description.length >= 10 && !!formData.category;
    if (step === 4) return !!formData.email && !!formData.phone && !!formData.address;
    return true;
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-slate-50 dark:bg-slate-950"
      style={{ paddingTop: insets.top }}
    >
      {/* Header */}
      <View className="px-4 py-4 flex-row items-center bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-white/5">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 mr-2">
          <Ionicons name="arrow-back" size={24} color={isDark ? "#ffffff" : "#0f172a"} />
        </TouchableOpacity>
        <View>
          <Text className="text-xl font-ubuntu-bold text-slate-900 dark:text-white">Shop Registration</Text>
          <Text className="text-[10px] text-slate-500 font-ubuntu-medium uppercase tracking-widest">Step {step} of 4</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View className="flex-row h-1 bg-slate-200 dark:bg-slate-800">
        <View 
          className="h-full bg-primary" 
          style={{ width: `${(step / 4) * 100}%` }} 
        />
      </View>

      <ScrollView 
        className="flex-1 px-4 pt-6" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Step Cards */}
        <View className="flex-row justify-between mb-8">
          {steps.map((s) => (
            <View key={s.id} className="items-center">
              <View className={`w-10 h-10 rounded-xl items-center justify-center ${step >= s.id ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-800'}`}>
                <s.icon size={18} color={step >= s.id ? "#ffffff" : "#64748b"} />
              </View>
              <Text className={`text-[10px] mt-1 font-ubuntu-medium ${step >= s.id ? 'text-primary' : 'text-slate-500'}`}>{s.title}</Text>
            </View>
          ))}
        </View>

        {step === 1 && (
          <View className="animate-in fade-in slide-in-from-right-4 duration-500">
            <Text className="text-lg font-ubuntu-bold text-slate-900 dark:text-white mb-6">Let's start with the basics</Text>
            
            <View className="gap-5">
              <View>
                <Text className="text-sm font-ubuntu-medium text-slate-700 dark:text-slate-300 mb-2 ml-1">Shop Name *</Text>
                <TextInput
                  className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-white/5 text-slate-900 dark:text-white font-ubuntu shadow-sm"
                  placeholder="e.g. Urban Threads"
                  placeholderTextColor="#94a3b8"
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                />
              </View>

              <View>
                <Text className="text-sm font-ubuntu-medium text-slate-700 dark:text-slate-300 mb-2 ml-1">Shop Handle (@) *</Text>
                <View className="relative justify-center">
                <View className="absolute left-4 z-10 justify-center">
                  {usernameStatus.loading ? (
                    <ActivityIndicator size="small" color="#3b82f6" />
                  ) : (
                    <AtSign size={18} color={usernameStatus.available ? "#10b981" : usernameStatus.error ? "#ef4444" : "#64748b"} />
                  )}
                </View>
                  <TextInput
                    className={`bg-white dark:bg-slate-900 pl-11 pr-4 py-4 rounded-2xl border text-slate-900 dark:text-white font-ubuntu shadow-sm ${
                      usernameStatus.available ? 'border-green-500/50' : usernameStatus.error ? 'border-red-500/50' : 'border-slate-100 dark:border-white/5'
                    }`}
                    placeholder="your_unique_handle"
                    placeholderTextColor="#94a3b8"
                    autoCapitalize="none"
                    value={formData.username}
                    onChangeText={(text) => setFormData({ ...formData, username: text.toLowerCase().replace(/[^a-z0-0_]/g, '') })}
                  />
                </View>
                {usernameStatus.error && (
                  <Text className="text-[11px] text-red-500 mt-1.5 ml-2 font-ubuntu-medium">{usernameStatus.error}</Text>
                )}
                {usernameStatus.available && (
                  <Text className="text-[11px] text-green-500 mt-1.5 ml-2 font-ubuntu-medium">Handle is available</Text>
                )}
              </View>
            </View>
          </View>
        )}

        {step === 2 && (
          <View className="animate-in fade-in slide-in-from-right-4 duration-500">
            <Text className="text-lg font-ubuntu-bold text-slate-900 dark:text-white mb-6">Tell us about your shop</Text>
            
            <View className="gap-5">
              <View>
                <Text className="text-sm font-ubuntu-medium text-slate-700 dark:text-slate-300 mb-2 ml-1">Category *</Text>
                <View className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-white/5 overflow-hidden shadow-sm">
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} className="p-2">
                    {CATEGORIES.map((cat) => (
                      <TouchableOpacity
                        key={cat.value}
                        onPress={() => setFormData({ ...formData, category: cat.value })}
                        className={`px-4 py-2 mr-2 rounded-xl flex-row items-center border ${
                          formData.category === cat.value 
                            ? 'bg-primary/10 border-primary text-primary' 
                            : 'bg-slate-50 dark:bg-slate-800 border-transparent'
                        }`}
                      >
                        <Text className={`font-ubuntu-medium text-xs ${formData.category === cat.value ? 'text-primary' : 'text-slate-500 dark:text-slate-400'}`}>
                          {cat.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>

              <View>
                <Text className="text-sm font-ubuntu-medium text-slate-700 dark:text-slate-300 mb-2 ml-1">Description *</Text>
                <TextInput
                  className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-white/5 text-slate-900 dark:text-white font-ubuntu h-32 shadow-sm"
                  placeholder="What makes your shop special? (min 10 chars)"
                  placeholderTextColor="#94a3b8"
                  multiline
                  textAlignVertical="top"
                  value={formData.description}
                  onChangeText={(text) => setFormData({ ...formData, description: text })}
                />
              </View>
            </View>
          </View>
        )}

        {step === 3 && (
          <View className="animate-in fade-in slide-in-from-right-4 duration-500">
            <Text className="text-lg font-ubuntu-bold text-slate-900 dark:text-white mb-6">Build your brand</Text>
            
            <View className="gap-6">
              <View>
                <Text className="text-sm font-ubuntu-medium text-slate-700 dark:text-slate-300 mb-3 ml-1">Shop Banner</Text>
                <TouchableOpacity 
                  onPress={() => pickImage('banner')}
                  className="w-full h-40 bg-slate-100 dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-white/10 overflow-hidden items-center justify-center"
                >
                  {banner ? (
                    <Image source={{ uri: banner }} className="w-full h-full" />
                  ) : (
                    <View className="items-center">
                      <ImageIcon size={32} color="#94a3b8" />
                      <Text className="mt-2 text-slate-400 font-ubuntu-medium text-xs">Recommended 1200x400</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>

              <View>
                <Text className="text-sm font-ubuntu-medium text-slate-700 dark:text-slate-300 mb-3 ml-1">Shop Logo (Avatar)</Text>
                <View className="flex-row items-center gap-4">
                  <TouchableOpacity 
                    onPress={() => pickImage('avatar')}
                    className="w-24 h-24 bg-slate-100 dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10 overflow-hidden items-center justify-center"
                  >
                    {avatar ? (
                      <Image source={{ uri: avatar }} className="w-full h-full" />
                    ) : (
                      <Camera size={24} color="#94a3b8" />
                    )}
                  </TouchableOpacity>
                  <View className="flex-1">
                    <Text className="text-slate-900 dark:text-white font-ubuntu-bold text-sm">Store Profile Photo</Text>
                    <Text className="text-slate-500 dark:text-slate-400 font-ubuntu text-[11px] mt-1">Recommended: 512x512px square image.</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}

        {step === 4 && (
          <View className="animate-in fade-in slide-in-from-right-4 duration-500">
            <Text className="text-lg font-ubuntu-bold text-slate-900 dark:text-white mb-6">Finalizing contact info</Text>
            
            <View className="gap-5">
              <View>
                <Text className="text-sm font-ubuntu-medium text-slate-700 dark:text-slate-300 mb-2 ml-1">Business Email *</Text>
                <View className="relative justify-center">
                  <View className="absolute left-4 z-10">
                    <Mail size={18} color="#64748b" />
                  </View>
                  <TextInput
                    className="bg-white dark:bg-slate-900 pl-11 pr-4 py-4 rounded-2xl border border-slate-100 dark:border-white/5 text-slate-900 dark:text-white font-ubuntu shadow-sm"
                    placeholder="hello@yourshop.com"
                    placeholderTextColor="#94a3b8"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={formData.email}
                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                  />
                </View>
              </View>

              <View>
                <Text className="text-sm font-ubuntu-medium text-slate-700 dark:text-slate-300 mb-2 ml-1">Business Phone *</Text>
                <View className="relative justify-center">
                  <View className="absolute left-4 z-10">
                    <Phone size={18} color="#64748b" />
                  </View>
                  <TextInput
                    className="bg-white dark:bg-slate-900 pl-11 pr-4 py-4 rounded-2xl border border-slate-100 dark:border-white/5 text-slate-900 dark:text-white font-ubuntu shadow-sm"
                    placeholder="+254 700 000 000"
                    placeholderTextColor="#94a3b8"
                    keyboardType="phone-pad"
                    value={formData.phone}
                    onChangeText={(text) => setFormData({ ...formData, phone: text })}
                  />
                </View>
              </View>

              <View>
                <Text className="text-sm font-ubuntu-medium text-slate-700 dark:text-slate-300 mb-2 ml-1">Physical Address *</Text>
                <View className="relative justify-center">
                  <View className="absolute left-4 z-10">
                    <MapPin size={18} color="#64748b" />
                  </View>
                  <TextInput
                    className="bg-white dark:bg-slate-900 pl-11 pr-4 py-4 rounded-2xl border border-slate-100 dark:border-white/5 text-slate-900 dark:text-white font-ubuntu shadow-sm"
                    placeholder="e.g. Garden Plaza, Nairobi"
                    placeholderTextColor="#94a3b8"
                    value={formData.address}
                    onChangeText={(text) => setFormData({ ...formData, address: text })}
                  />
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Footer Buttons */}
        <View className="mt-12 flex-row items-center gap-4">
          <TouchableOpacity 
            onPress={() => step > 1 ? setStep(step - 1) : router.back()}
            className="flex-1 h-16 bg-slate-100 dark:bg-slate-900 rounded-3xl items-center justify-center"
          >
            <Text className="font-ubuntu-bold text-slate-600 dark:text-slate-400">{step === 1 ? 'Cancel' : 'Back'}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => step < 4 ? setStep(step + 1) : handleCreate()}
            disabled={!canGoNext() || loading}
            className={`flex-1 h-16 rounded-3xl items-center justify-center shadow-lg ${canGoNext() ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-800'}`}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <View className="flex-row items-center gap-2">
                <Text className="text-white font-ubuntu-bold text-base">
                  {step === 4 ? 'Launch Shop' : 'Next Step'}
                </Text>
                {step < 4 && <ChevronRight size={18} color="#ffffff" />}
              </View>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
