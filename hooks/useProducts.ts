import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import api from "../lib/api";

export const useProducts = (params?: any) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      const response = await api.get("/products", {
        params: { limit: 20, ...params },
      });
      return response.data.data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useInfiniteProducts = (params?: any) => {
  return useInfiniteQuery({
    queryKey: ["products-infinite", params],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get("/products", {
        params: { ...params, page: pageParam, limit: 12 },
      });
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => {
      if (lastPage.pagination && lastPage.pagination.page < lastPage.pagination.pages) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const usePersonalizedFeed = (limit: number = 12) => {
  return useQuery({
    queryKey: ["product-feed", limit],
    queryFn: async () => {
      const response = await api.get("/products/feed", { params: { limit } });
      return response.data.data || [];
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await api.get(`/products/${id}`);
      return response.data.data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
  });
};
