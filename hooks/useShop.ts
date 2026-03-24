import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export const useShop = (idOrHandle: string) => {
  return useQuery({
    queryKey: ['shop', idOrHandle],
    queryFn: async () => {
      const endpoint = idOrHandle.startsWith('@')
        ? `/shops/handle/${idOrHandle.substring(1)}`
        : `/shops/${idOrHandle}`;
      const response = await api.get(endpoint);
      const shopData = response.data.data || response.data;
      if (!shopData || (typeof shopData === 'object' && !shopData.name && !shopData.id && !shopData._id)) {
        throw new Error('Shop not found');
      }
      if (shopData && shopData.id && !shopData._id) shopData._id = shopData.id;
      return shopData;
    },
    enabled: !!idOrHandle && idOrHandle !== 'undefined',
    staleTime: 0,
  });
};

export const useMyShop = () => {
  return useQuery({
    queryKey: ['my-shop'],
    queryFn: async () => {
      const response = await api.get('/shops/my-shop');
      const data = response.data.data ?? null;
      if (data && data.id && !data._id) data._id = data.id;
      return data;
    },
    staleTime: 0,
  });
};

export const useShopProducts = (idOrHandle: string, params?: { limit?: number; minPrice?: number; maxPrice?: number }) => {
  return useQuery({
    queryKey: ['shop-products', idOrHandle, params],
    queryFn: async () => {
      const endpoint = idOrHandle.startsWith('@')
        ? `/products/shop/handle/${idOrHandle.substring(1)}`
        : `/products/shop/${idOrHandle}`;
      const response = await api.get(endpoint, { params: { limit: 20, ...params } });
      const data = response.data.data || [];
      return data.map((p: any) => ({ ...p, _id: p.id || p._id || `prod-${Math.random()}` }));
    },
    enabled: !!idOrHandle && idOrHandle !== 'undefined',
  });
};

export const useShopReviews = (idOrHandle: string) => {
  return useQuery({
    queryKey: ['shop-reviews', idOrHandle],
    queryFn: async () => {
      const endpoint = idOrHandle.startsWith('@')
        ? `/shops/handle/${idOrHandle.substring(1)}/reviews`
        : `/shops/${idOrHandle}/reviews`;
      const response = await api.get(endpoint);
      return response.data.data || [];
    },
    enabled: !!idOrHandle && idOrHandle !== 'undefined',
  });
};

export const useShopLists = (idOrHandle: string, type: 'Followers' | 'Following') => {
  return useQuery({
    queryKey: ['shop-lists', idOrHandle, type],
    queryFn: async () => {
      const isHandle = idOrHandle.startsWith('@');
      const cleanHandle = isHandle ? idOrHandle.substring(1) : idOrHandle;
      const endpoint = type === 'Followers'
        ? (isHandle ? `/shops/handle/${cleanHandle}/followers` : `/shops/${idOrHandle}/followers`)
        : (isHandle ? `/shops/handle/${cleanHandle}/following` : `/shops/${idOrHandle}/following`);
      try {
        const response = await api.get(endpoint);
        if (response.data.success) {
          return response.data.data || [];
        }
        return [];
      } catch {
        return [];
      }
    },
    enabled: !!idOrHandle && (type === 'Followers' || type === 'Following'),
    staleTime: 30000,
  });
};

export const useFollowShop = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (shopId: string) => {
      const response = await api.post(`/shops/${shopId}/follow`);
      return response.data;
    },
    onMutate: async (shopId) => {
      await queryClient.cancelQueries({ queryKey: ['shop'] });
      queryClient.setQueriesData({ queryKey: ['shop'] }, (old: any) => {
        if (!old) return old;
        const sid = old._id || old.id;
        if (String(sid) !== String(shopId)) return old;
        const isFollowing = Boolean(old.isFollowing);
        return {
          ...old,
          isFollowing: !isFollowing,
          followersCount: Math.max(0, (old.followersCount || 0) + (!isFollowing ? 1 : -1)),
        };
      });
    },
    onSettled: (_data, _error, shopId) => {
      queryClient.invalidateQueries({ queryKey: ['shop', shopId] });
    },
  });
};
