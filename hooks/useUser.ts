import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../lib/api';
import { router } from 'expo-router';

export const useUser = () => {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ['user-me'],
    queryFn: async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) return null;
        
        const response = await api.get('/users/me');
        if (response.data.success) {
          const userData = response.data.data;
          if (userData && userData.id && !userData._id) {
            userData._id = userData.id;
          }
          await AsyncStorage.setItem('user', JSON.stringify(userData));
          return userData;
        }
        return null;
      } catch (err) {
        // Fallback to local storage if API fails but we have data
        const userStr = await AsyncStorage.getItem('user');
        if (userStr) {
          try {
            const u = JSON.parse(userStr);
            if (u && u.id && !u._id) u._id = u.id;
            return u;
          } catch {
            return null;
          }
        }
        return null;
      }
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: { name?: string; avatar?: string } | FormData) => {
      const response = await api.put('/users/me', data, {
        headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
      });
      return response.data.data;
    },
    onSuccess: async (updatedUser) => {
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      queryClient.setQueryData(['user-me'], updatedUser);
    },
  });

  const updateAccountTypeMutation = useMutation({
    mutationFn: async (accountType: 'buyer' | 'seller') => {
      const response = await api.put('/users/update-account-type', { accountType });
      return response.data.data;
    },
    onSuccess: async (updatedUser) => {
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      queryClient.setQueryData(['user-me'], updatedUser);
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      const response = await api.put('/users/me/password', data);
      return response.data;
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      const response = await api.delete('/users/me');
      return response.data;
    },
    onSuccess: async () => {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('user');
      queryClient.setQueryData(['user-me'], null);
      queryClient.clear();
      router.replace('/(auth)/login');
    },
  });

  return { 
    user, 
    isLoading,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdatingProfile: updateProfileMutation.isPending,
    updateAccountType: updateAccountTypeMutation.mutateAsync,
    isUpdatingAccountType: updateAccountTypeMutation.isPending,
    updatePassword: updatePasswordMutation.mutateAsync,
    isUpdatingPassword: updatePasswordMutation.isPending,
    deleteAccount: deleteAccountMutation.mutateAsync,
    isDeletingAccount: deleteAccountMutation.isPending,
    refreshUser: () => queryClient.invalidateQueries({ queryKey: ['user-me'] })
  };
};
