import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export const useComments = (productId?: string) => {
  const queryClient = useQueryClient();

  const commentsQuery = useQuery({
    queryKey: ['comments', productId],
    queryFn: async () => {
      const response = await api.get(`/comments/product/${productId}`);
      const data = response.data.data || [];
      return data
        .filter((c: any) => !!c)
        .map((c: any) => ({
          ...c,
          _id: c.id || c._id || `comment-${Math.random()}`,
          user: c.user ? {
            ...c.user,
            _id: c.user.id || c.user._id
          } : null
        }));
    },
    enabled: !!productId,
  });

  const createCommentMutation = useMutation({
    mutationFn: async ({ productId, content }: { productId: string; content: string }) => {
      const response = await api.post('/comments', { productId, content });
      return response.data.data;
    },
    onMutate: async ({ productId }) => {
      // Optimitic UI can go here
    },
    onError: (error: any) => {
      // Error handling moved to component level with AppModal
      console.error('Failed to post comment:', error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', productId] });
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
    },
    onSuccess: () => {
      // Success handling moved to component level
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const response = await api.delete(`/comments/${commentId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', productId] });
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
    },
    onError: (error: any) => {
      // Error handling moved to component level with AppModal
      console.error('Failed to delete comment:', error);
    },
  });

  return {
    comments: commentsQuery.data || [],
    isLoading: commentsQuery.isLoading,
    isError: commentsQuery.isError,
    createComment: createCommentMutation.mutate,
    isPosting: createCommentMutation.isPending,
    deleteComment: deleteCommentMutation.mutate,
    isDeleting: deleteCommentMutation.isPending,
  };
};
