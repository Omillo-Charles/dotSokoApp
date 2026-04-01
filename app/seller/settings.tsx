import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from "@/hooks/useColorScheme";
import { useMyShop } from "@/hooks/useShop";
import { Store, Trash2, Save, Camera, ImageIcon } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import api from "@/lib/api";

export default function ShopSettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark } = useColorScheme();
  const { data: shop, isLoading, refetch } = useMyShop();

  const [shopName, setShopName] = useState(shop?.name || '');
  const [username, setUsername] = useState(shop?.username || '');
  const [description, setDescription] = useState(shop?.description || '');
  const [email, setEmail] = useState(shop?.email || '');
  const [phone, setPhone] = useState(shop?.phone || '');
  const [address, setAddress] = useState(shop?.address || '');
  const [city, setCity] = useState(shop?.city || '');
  const [avatar, setAvatar] = useState(shop?.avatar || '');
  const [banner, setBanner] = useState(shop?.banner || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  React.useEffect(() => {
    if (shop) {
      setShopName(shop.name || '');
      setUsername(shop.username || '');
      setDescription(shop.description || '');
      setEmail(shop.email || '');
      setPhone(shop.phone || '');
      setAddress(shop.address || '');
      setCity(shop.city || '');
      setAvatar(shop.avatar || '');
      setBanner(shop.banner || '');
    }
  }, [shop]);

  const pickImage = async (type: 'avatar' | 'banner') => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera roll permissions to upload images');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: type === 'avatar' ? [1, 1] : [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const imageUri = result.assets[0].uri;
      
      // Update local state immediately for preview
      if (type === 'avatar') {
        setAvatar(imageUri);
      } else {
        setBanner(imageUri);
      }
    }
  };

  const handleSave = async () => {
    if (!shopName || !username || !email || !phone) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    try {
      // Check if we have new images to upload
      const hasNewAvatar = avatar && !avatar.startsWith('http');
      const hasNewBanner = banner && !banner.startsWith('http');

      if (hasNewAvatar || hasNewBanner) {
        // Use the branding endpoint with multipart/form-data
        const formData = new FormData();
        
        // Add text fields
        formData.append('name', shopName);
        formData.append('username', username);
        if (description) formData.append('description', description);
        formData.append('email', email);
        formData.append('phone', phone);
        if (address) formData.append('address', address);
        if (city) formData.append('city', city);

        // Add image files
        if (hasNewAvatar) {
          const filename = avatar.split('/').pop() || 'avatar.jpg';
          const match = /\.(\w+)$/.exec(filename);
          const fileType = match ? `image/${match[1]}` : 'image/jpeg';
          
          formData.append('avatar', {
            uri: avatar,
            name: filename,
            type: fileType,
          } as any);
        }

        if (hasNewBanner) {
          const filename = banner.split('/').pop() || 'banner.jpg';
          const match = /\.(\w+)$/.exec(filename);
          const fileType = match ? `image/${match[1]}` : 'image/jpeg';
          
          formData.append('banner', {
            uri: banner,
            name: filename,
            type: fileType,
          } as any);
        }

        await api.put('/shops/my-shop/branding', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // Use regular endpoint for text-only updates
        await api.put('/shops/my-shop', {
          name: shopName,
          username,
          description,
          email,
          phone,
          address,
          city,
        });
      }

      Alert.alert('Success', 'Shop settings updated successfully');
      refetch();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to update shop settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Shop',
      'Are you sure you want to delete your shop? This action cannot be undone and will remove all your products and data.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            try {
              await api.delete('/shops/my-shop');
              Alert.alert('Success', 'Shop deleted successfully');
              router.replace('/(tabs)');
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.message || 'Failed to delete shop');
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-slate-50 dark:bg-slate-950 items-center justify-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-4 py-4 flex-row items-center justify-between bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-white/5">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <Ionicons name="arrow-back" size={24} color={isDark ? "#ffffff" : "#0f172a"} />
        </TouchableOpacity>
        <Text className="text-xl font-ubuntu-bold text-slate-900 dark:text-white">Shop Settings</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 pt-6" showsVerticalScrollIndicator={false}>
        {/* Shop Banner */}
        <View className="relative mb-6">
          <TouchableOpacity 
            onPress={() => pickImage('banner')}
            disabled={isSaving}
            className="relative h-40 bg-primary/20 mx-4 rounded-3xl overflow-hidden"
          >
            {banner ? (
              <Image source={{ uri: banner }} className="w-full h-full" resizeMode="cover" />
            ) : (
              <View className="w-full h-full items-center justify-center">
                <ImageIcon size={40} color="#3b82f6" opacity={0.3} />
                <Text className="text-primary/50 font-ubuntu text-sm mt-2">Tap to add banner</Text>
              </View>
            )}
            <View className="absolute bottom-3 right-3 bg-white dark:bg-slate-900 p-2 rounded-full shadow-lg">
              <Camera size={18} color="#3b82f6" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Shop Avatar */}
        <View className="items-center mb-8 px-4">
          <TouchableOpacity 
            onPress={() => pickImage('avatar')}
            disabled={isSaving}
            className="relative"
          >
            <View className="w-24 h-24 rounded-3xl bg-white dark:bg-slate-900 border-4 border-slate-100 dark:border-white/5 overflow-hidden shadow-sm">
              {avatar ? (
                <Image source={{ uri: avatar }} className="w-full h-full" />
              ) : (
                <View className="w-full h-full items-center justify-center">
                  <Store size={40} color="#94a3b8" />
                </View>
              )}
            </View>
            <View className="absolute -bottom-1 -right-1 bg-primary p-2 rounded-full shadow-lg">
              <Camera size={16} color="#ffffff" />
            </View>
          </TouchableOpacity>
          <Text className="text-slate-500 dark:text-slate-400 font-ubuntu text-xs mt-3">
            Tap to change avatar
          </Text>
        </View>

        {/* Form Fields */}
        <View className="gap-4 mb-6 px-4">
          <View>
            <Text className="text-sm font-ubuntu-bold text-slate-700 dark:text-slate-300 mb-2">
              Shop Name <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              value={shopName}
              onChangeText={setShopName}
              placeholder="Enter shop name"
              placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3 text-slate-900 dark:text-white font-ubuntu"
            />
          </View>

          <View>
            <Text className="text-sm font-ubuntu-bold text-slate-700 dark:text-slate-300 mb-2">
              Username <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder="@username"
              placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
              autoCapitalize="none"
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3 text-slate-900 dark:text-white font-ubuntu"
            />
          </View>

          <View>
            <Text className="text-sm font-ubuntu-bold text-slate-700 dark:text-slate-300 mb-2">
              Description
            </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Tell customers about your shop"
              placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3 text-slate-900 dark:text-white font-ubuntu"
            />
          </View>

          <View>
            <Text className="text-sm font-ubuntu-bold text-slate-700 dark:text-slate-300 mb-2">
              Email <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="shop@example.com"
              placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
              keyboardType="email-address"
              autoCapitalize="none"
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3 text-slate-900 dark:text-white font-ubuntu"
            />
          </View>

          <View>
            <Text className="text-sm font-ubuntu-bold text-slate-700 dark:text-slate-300 mb-2">
              Phone <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="+254 700 000 000"
              placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
              keyboardType="phone-pad"
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3 text-slate-900 dark:text-white font-ubuntu"
            />
          </View>

          <View>
            <Text className="text-sm font-ubuntu-bold text-slate-700 dark:text-slate-300 mb-2">
              Address
            </Text>
            <TextInput
              value={address}
              onChangeText={setAddress}
              placeholder="Street address"
              placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3 text-slate-900 dark:text-white font-ubuntu"
            />
          </View>

          <View>
            <Text className="text-sm font-ubuntu-bold text-slate-700 dark:text-slate-300 mb-2">
              City
            </Text>
            <TextInput
              value={city}
              onChangeText={setCity}
              placeholder="City"
              placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3 text-slate-900 dark:text-white font-ubuntu"
            />
          </View>
        </View>

        {/* Save Button */}
        <View className="px-4">
          <TouchableOpacity
            onPress={handleSave}
            disabled={isSaving}
            className={`flex-row items-center justify-center py-4 rounded-2xl mb-4 ${
              isSaving ? 'bg-slate-300 dark:bg-slate-700' : 'bg-primary'
            }`}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <>
                <Save size={20} color="#ffffff" />
                <Text className="text-white font-ubuntu-bold text-base ml-2">Save Changes</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-3xl p-6 mb-10 mx-4">
          <Text className="text-lg font-ubuntu-bold text-red-600 dark:text-red-400 mb-2">Danger Zone</Text>
          <Text className="text-sm font-ubuntu text-red-600/80 dark:text-red-400/80 mb-4">
            Deleting your shop will permanently remove all products, orders, and data. This action cannot be undone.
          </Text>
          <TouchableOpacity
            onPress={handleDelete}
            disabled={isDeleting}
            className={`flex-row items-center justify-center py-3 rounded-xl ${
              isDeleting ? 'bg-red-300 dark:bg-red-900/50' : 'bg-red-500'
            }`}
          >
            {isDeleting ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <>
                <Trash2 size={18} color="#ffffff" />
                <Text className="text-white font-ubuntu-bold text-sm ml-2">Delete Shop</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
