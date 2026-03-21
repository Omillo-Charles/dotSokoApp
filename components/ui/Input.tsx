import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import { Eye, EyeOff } from "lucide-react-native";

interface InputProps {
  label?: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  error?: string;
  icon?: React.ReactNode;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  error,
  icon,
  keyboardType = "default",
  autoCapitalize = "none",
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  return (
    <View className="mb-4 w-full">
      {label && (
        <Text className="text-sm font-ubuntu-medium text-muted-foreground mb-2 ml-1">
          {label}
        </Text>
      )}
      <View
        className={`relative flex-row items-center bg-muted border ${
          error ? "border-destructive" : isFocused ? "border-primary" : "border-border"
        } rounded-2xl px-4 py-3.5 transition-all`}
      >
        {icon && <View className="mr-3">{icon}</View>}
        
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#94a3b8"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          className="flex-1 text-foreground font-ubuntu text-base"
        />

        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            className="ml-2"
          >
            {isPasswordVisible ? (
              <EyeOff size={20} color="#64748b" />
            ) : (
              <Eye size={20} color="#64748b" />
            )}
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text className="text-destructive text-xs mt-1 font-ubuntu-medium ml-1">
          {error}
        </Text>
      )}
    </View>
  );
};
