import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export interface Address {
  id: string;
  name: string;
  type: "home" | "work" | "other";
  phone: string;
  city: string;
  street: string;
  isDefault: boolean;
  createdAt: string;
}

export const useAddresses = () => {
  const queryClient = useQueryClient();

  const { data: addresses = [], isLoading, isError, refetch, isRefetching } = useQuery<Address[]>({
    queryKey: ["addresses"],
    queryFn: async () => {
      const res = await api.get("/users/addresses");
      return res.data.data || [];
    },
    staleTime: 1000 * 60 * 5,
  });

  const addAddress = useMutation({
    mutationFn: async (data: Omit<Address, "id" | "createdAt">) => {
      const res = await api.post("/users/addresses", data);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
  });

  const updateAddress = useMutation({
    mutationFn: async ({ addressId, data }: { addressId: string; data: Partial<Address> }) => {
      const res = await api.put(`/users/addresses/${addressId}`, data);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
  });

  const deleteAddress = useMutation({
    mutationFn: async (addressId: string) => {
      await api.delete(`/users/addresses/${addressId}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
  });

  const setDefaultAddress = useMutation({
    mutationFn: async (addressId: string) => {
      const res = await api.put(`/users/addresses/${addressId}/set-default`, {});
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
  });

  return { addresses, isLoading, isError, refetch, isRefetching, addAddress, updateAddress, deleteAddress, setDefaultAddress };
};
