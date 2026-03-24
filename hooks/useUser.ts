import { useQuery } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useUser = () => {
  const { data: user, isLoading } = useQuery({
    queryKey: ['user-me-local'],
    queryFn: async () => {
      const userStr = await AsyncStorage.getItem('user');
      if (!userStr) return null;
      try {
        const u = JSON.parse(userStr);
        if (u && u.id && !u._id) u._id = u.id;
        return u;
      } catch {
        return null;
      }
    },
  });

  return { 
    user, 
    isLoading 
  };
};
