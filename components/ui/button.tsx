import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, View } from "react-native";

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  variant = "primary",
  isLoading = false,
  disabled = false,
  className = "",
  icon,
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "secondary":
        return "bg-secondary";
      case "outline":
        return "bg-transparent border border-border";
      case "ghost":
        return "bg-transparent";
      case "primary":
      default:
        return "bg-primary shadow-xl shadow-primary/20";
    }
  };

  const getTextClasses = () => {
    switch (variant) {
      case "outline":
      case "ghost":
        return "text-foreground";
      case "primary":
        return "text-primary-foreground";
      case "secondary":
        return "text-secondary-foreground";
      default:
        return "text-primary-foreground";
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
      className={`py-4 rounded-2xl flex-row items-center justify-center gap-2 ${getVariantClasses()} ${
        disabled || isLoading ? "opacity-70" : ""
      } ${className}`}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === "primary" ? "#ffffff" : "#3b82f6"} />
      ) : (
        <>
          <Text className={`font-ubuntu-bold text-lg ${getTextClasses()}`}>
            {title}
          </Text>
          {icon && <View>{icon}</View>}
        </>
      )}
    </TouchableOpacity>
  );
};
