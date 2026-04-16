import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useMyOrders = () => {
  return useQuery({
    queryKey: ["my-orders"],
    queryFn: async () => {
      const response = await api.get("/orders/my-orders");
      return response.data.data || [];
    },
    enabled: true,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useOrderById = (id: string) => {
  return useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const response = await api.get(`/orders/${id}`);
      return response.data.data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useTrackOrder = (orderId: string) => {
  return useQuery({
    queryKey: ["track-order", orderId],
    queryFn: async () => {
      const response = await api.get(`/orders/track/${orderId}`);
      return response.data.data;
    },
    enabled: !!orderId,
    staleTime: 1000 * 60,
  });
};

import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string, status: string }) => {
      const response = await api.patch(`/orders/${orderId}/status`, { status });
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      queryClient.invalidateQueries({ queryKey: ["seller-orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", variables.orderId] });
      queryClient.invalidateQueries({ queryKey: ["track-order", variables.orderId] });
    }
  });
};
