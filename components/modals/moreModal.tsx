import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Pressable, Modal, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "../../hooks/useColorScheme";

interface MoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MenuItem = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <TouchableOpacity className="flex-row items-center gap-3 py-3 border-b border-slate-50 dark:border-white/5">
    <View className="w-8 h-8 rounded-lg bg-muted items-center justify-center">
      {icon}
    </View>
    <Text className="text-sm font-ubuntu text-foreground">{label}</Text>
  </TouchableOpacity>
);

export const MoreModal = ({ isOpen, onClose }: MoreModalProps) => {
  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View className="bg-background rounded-3xl p-4 w-56 mb-24 mr-4 border border-slate-100 dark:border-white/10 shadow-2xl">
          <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
            <MenuItem icon={<Ionicons name="information-circle-outline" size={18} color="#64748b" />} label="About Us" />
            <MenuItem icon={<Ionicons name="mail-outline" size={18} color="#64748b" />} label="Contact" />
            <MenuItem icon={<Ionicons name="ribbon-outline" size={18} color="#f59e0b" />} label="Premium" />
            <MenuItem icon={<Ionicons name="shield-checkmark-outline" size={18} color="#64748b" />} label="Privacy Policy" />
            <MenuItem icon={<Ionicons name="document-text-outline" size={18} color="#64748b" />} label="Terms" />
            <MenuItem icon={<Ionicons name="help-circle-outline" size={18} color="#64748b" />} label="Help Center" />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
});
