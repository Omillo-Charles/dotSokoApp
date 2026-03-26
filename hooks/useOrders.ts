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
