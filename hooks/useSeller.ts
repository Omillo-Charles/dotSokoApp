import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export const useMyProducts = () => {
  return useQuery({
    queryKey: ['my-products'],
    queryFn: async () => {
      const response = await api.get('/products/my-products');
      return response.data.data || [];
    },
    staleTime: 30000,
  });
};

export const useSellerOrders = () => {
  return useQuery({
    queryKey: ['seller-orders'],
    queryFn: async () => {
      const response = await api.get('/orders/seller');
      return response.data.data || [];
    },
    staleTime: 30000,
  });
};
