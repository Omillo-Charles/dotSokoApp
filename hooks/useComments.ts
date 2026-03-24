import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Alert } from 'react-native';

export const useComments = (productId?: string) => {
  const queryClient = useQueryClient();

  const commentsQuery = useQuery({
    queryKey: ['comments', productId],
    queryFn: async () => {
      const response = await api.get(`/comments/product/${productId}`);
      const data = response.data.data || [];
      return data.map((c: any) => ({
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
      Alert.alert('Error', error.friendlyMessage || 'Failed to post comment');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', productId] });
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
    },
    onSuccess: () => {
      // Alert.alert('Success', 'Comment posted successfully');
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
      // Alert.alert('Success', 'Comment deleted successfully');
    },
    onError: (error: any) => {
      Alert.alert('Error', error.friendlyMessage || 'Failed to delete comment');
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
