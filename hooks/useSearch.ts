import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export interface SearchProduct {
  type: "product";
  id: string;
  name: string;
  price: number;
  image: string | null;
  category: string;
  shopName: string;
}

export interface SearchShop {
  type: "shop";
  id: string;
  name: string;
  username: string | null;
  avatar: string | null;
  category: string;
  followersCount: number;
  isVerified: boolean;
}

export type SearchResult = SearchProduct | SearchShop;

export const useSearch = (query: string) => {
  const trimmed = query.trim();

  const productsQuery = useQuery({
    queryKey: ["search-products", trimmed],
    queryFn: async (): Promise<SearchProduct[]> => {
      const res = await api.get("/products", { params: { q: trimmed, limit: 6 } });
      return (res.data.data || []).map((p: any) => ({
        type: "product" as const,
        id: p.id || p._id,
        name: p.name,
        price: p.price,
        image: p.image || p.images?.[0] || null,
        category: p.category,
        shopName: p.shop?.name || "Unknown Shop",
      }));
    },
    enabled: trimmed.length >= 2,
    staleTime: 1000 * 30,
  });

  const shopsQuery = useQuery({
    queryKey: ["search-shops", trimmed],
    queryFn: async (): Promise<SearchShop[]> => {
      const res = await api.get("/shops", { params: { limit: 50 } });
      const all: any[] = res.data.data || res.data || [];
      const lower = trimmed.toLowerCase();
      return all
        .filter((s: any) =>
          s.name?.toLowerCase().includes(lower) ||
          s.username?.toLowerCase().includes(lower) ||
          s.category?.toLowerCase().includes(lower)
        )
        .slice(0, 4)
        .map((s: any) => ({
          type: "shop" as const,
          id: s.id || s._id,
          name: s.name,
          username: s.username || null,
          avatar: s.avatar || null,
          category: s.category,
          followersCount: s.followersCount || 0,
          isVerified: s.isVerified || false,
        }));
    },
    enabled: trimmed.length >= 2,
    staleTime: 1000 * 60,
  });

  const isLoading = productsQuery.isLoading || shopsQuery.isLoading;
  const results: SearchResult[] = [
    ...(shopsQuery.data || []),
    ...(productsQuery.data || []),
  ];

  return { results, isLoading, hasQuery: trimmed.length >= 2 };
};
