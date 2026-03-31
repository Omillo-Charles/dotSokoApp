import React, { useState, useRef, useEffect } from "react";
import {
  View, Text, Modal, TouchableOpacity, FlatList,
  TextInput, KeyboardAvoidingView, Platform, ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useComments } from "@/hooks/useComments";
import { useUser } from "@/hooks/useUser";
import { useAppModal } from "@/components/modals/AppModal";

interface Props {
  visible: boolean;
  onClose: () => void;
  productId: string;
  productName?: string;
  initialCount?: number;
}

export function CommentsModal({ visible, onClose, productId, productName, initialCount = 0 }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useColorScheme();
  const { user } = useUser();
  const modal = useAppModal();
  const { comments, isLoading, isPosting, createComment, deleteComment } = useComments(
    visible && productId ? productId : undefined
  );
  const [text, setText] = useState("");
  const inputRef = useRef<TextInput>(null);

  const borderColor = isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9";
  const cardBg = isDark ? "#0f172a" : "#ffffff";
  const mutedColor = isDark ? "#64748b" : "#94a3b8";
  const textColor = isDark ? "#ffffff" : "#0f172a";
  const inputBg = isDark ? "#1e293b" : "#f8fafc";

  const handlePost = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    if (!user) {
      modal.show({ title: "Sign in required", message: "Please sign in to post a comment.", variant: "info" });
      return;
    }
    createComment({ productId, content: trimmed });
    setText("");
  };

  const handleDelete = (commentId: string, authorId: string) => {
    if (!user || (user._id !== authorId && user.id !== authorId)) return;
    modal.show({
      title: "Delete comment",
      message: "Remove this comment?",
      variant: "destructive",
      actions: [
        { label: "Cancel", style: "secondary" },
        { label: "Delete", style: "destructive", onPress: () => deleteComment(commentId) },
      ],
    });
  };

  const renderComment = ({ item: comment, index }: { item: any; index: number }) => {
    if (!comment || !comment._id) return null;

    try {
      const isOwn = user && (user._id === comment.user?._id || user.id === comment.user?._id);
      const avatar = comment.user?.avatar;
      const name = comment.user?.name || "User";
      const date = comment.createdAt
        ? new Date(comment.createdAt).toLocaleDateString("en-KE", { day: "numeric", month: "short" })
        : "";

      return (
        <View style={{
          flexDirection: "row", alignItems: "flex-start", gap: 10,
          paddingVertical: 12,
          borderBottomWidth: index < comments.length - 1 ? 1 : 0,
          borderBottomColor: borderColor,
        }}>
          {/* Avatar */}
          <View style={{ width: 34, height: 34, borderRadius: 17, overflow: "hidden", backgroundColor: isDark ? "#1e293b" : "#f1f5f9", borderWidth: 1, borderColor }}>
            {avatar
              ? <Image source={{ uri: avatar }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
              : <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                  <Ionicons name="person" size={16} color={mutedColor} />
                </View>
            }
          </View>

          {/* Body */}
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 13, color: textColor }}>{name}</Text>
                <Text style={{ fontFamily: "Ubuntu-Regular", fontSize: 11, color: mutedColor }}>{date}</Text>
              </View>
              {isOwn && (
                <TouchableOpacity onPress={() => handleDelete(comment._id, comment.user?._id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Ionicons name="trash-outline" size={14} color="#ef4444" />
                </TouchableOpacity>
              )}
            </View>
            <Text style={{ fontFamily: "Ubuntu-Regular", fontSize: 13, color: isDark ? "#cbd5e1" : "#334155", lineHeight: 19 }}>
              {comment.content ?? ""}
            </Text>
          </View>
        </View>
      );
    } catch {
      return null;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: isDark ? "#020617" : "#ffffff" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        {/* Handle bar */}
        <View style={{ alignItems: "center", paddingTop: 12, paddingBottom: 4 }}>
          <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: isDark ? "#334155" : "#e2e8f0" }} />
        </View>

        {/* Header */}
        <View style={{
          flexDirection: "row", alignItems: "center", justifyContent: "space-between",
          paddingHorizontal: 20, paddingVertical: 14,
          borderBottomWidth: 1, borderBottomColor: borderColor,
        }}>
          <View>
            <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 16, color: textColor }}>
              Comments
            </Text>
            {productName && (
              <Text numberOfLines={1} style={{ fontFamily: "Ubuntu-Regular", fontSize: 12, color: mutedColor, marginTop: 1, maxWidth: 240 }}>
                {productName}
              </Text>
            )}
          </View>
          <TouchableOpacity onPress={onClose} style={{ padding: 6, borderRadius: 20, backgroundColor: isDark ? "#1e293b" : "#f1f5f9" }}>
            <Ionicons name="close" size={18} color={mutedColor} />
          </TouchableOpacity>
        </View>

        {/* Comments list */}
        {isLoading ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator size="large" color="#f97316" />
          </View>
        ) : (
          <FlatList
            data={comments.filter(Boolean)}
            keyExtractor={(item) => item._id}
            renderItem={renderComment}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingBottom: 16,
              flexGrow: 1,
            }}
            ListEmptyComponent={
              <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 60 }}>
                <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: isDark ? "#1e293b" : "#f1f5f9", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                  <Ionicons name="chatbubble-outline" size={28} color={mutedColor} />
                </View>
                <Text style={{ fontFamily: "Ubuntu-Bold", fontSize: 15, color: textColor, marginBottom: 6 }}>No comments yet</Text>
                <Text style={{ fontFamily: "Ubuntu-Regular", fontSize: 13, color: mutedColor, textAlign: "center" }}>
                  Be the first to share your thoughts.
                </Text>
              </View>
            }
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Input bar */}
        <View style={{
          flexDirection: "row", alignItems: "center", gap: 10,
          paddingHorizontal: 16, paddingTop: 12,
          paddingBottom: Math.max(insets.bottom, 16),
          borderTopWidth: 1, borderTopColor: borderColor,
          backgroundColor: isDark ? "#020617" : "#ffffff",
        }}>
          {/* User avatar */}
          <View style={{ width: 36, height: 36, borderRadius: 18, overflow: "hidden", backgroundColor: isDark ? "#1e293b" : "#f1f5f9", borderWidth: 1, borderColor, flexShrink: 0 }}>
            {user?.avatar
              ? <Image source={{ uri: user.avatar }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
              : <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                  <Ionicons name="person" size={16} color={mutedColor} />
                </View>
            }
          </View>

          <View style={{
            flex: 1, flexDirection: "row", alignItems: "center",
            backgroundColor: inputBg, borderRadius: 22,
            borderWidth: 1, borderColor,
            paddingHorizontal: 14, paddingVertical: 8, gap: 8,
            minHeight: 44,
          }}>
            <TextInput
              ref={inputRef}
              value={text}
              onChangeText={setText}
              placeholder={user ? "Write a comment..." : "Sign in to comment"}
              placeholderTextColor={mutedColor}
              multiline
              maxLength={500}
              editable={!!user}
              style={{
                flex: 1, fontFamily: "Ubuntu-Regular", fontSize: 14,
                color: textColor, maxHeight: 100, padding: 0,
              }}
            />
            <TouchableOpacity
              onPress={handlePost}
              disabled={!text.trim() || isPosting || !user}
              style={{
                width: 32, height: 32, borderRadius: 16,
                backgroundColor: text.trim() && user ? "#f97316" : (isDark ? "#334155" : "#e2e8f0"),
                alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}
            >
              {isPosting
                ? <ActivityIndicator size="small" color="#ffffff" />
                : <Ionicons name="arrow-up" size={16} color={text.trim() && user ? "#ffffff" : mutedColor} />
              }
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
