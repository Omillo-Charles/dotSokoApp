import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { WebView } from "react-native-webview";
import { useColorScheme } from "../../../hooks/useColorScheme";

export default function ContactScreen() {
  const { isDark } = useColorScheme();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const onSubmit = () => {
    // Dummy submit for now
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setForm({ name: "", email: "", subject: "", message: "" });
      alert("Message sent successfully!");
    }, 1500);
  };

  return (
    <View className="flex-1 bg-slate-50/50 dark:bg-slate-950">
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        {/* Header Section */}
        <View className="bg-white dark:bg-slate-900 px-6 pt-8 pb-12 border-b border-slate-100 dark:border-white/5">
          <Text className="text-3xl md:text-5xl font-ubuntu-bold text-slate-900 dark:text-white tracking-tight leading-tight">
            Contact Us
          </Text>
          <Text className="mt-4 text-slate-500 dark:text-slate-400 text-lg font-ubuntu leading-relaxed">
            Have questions or need support? Our team is here to help you with anything related to the <Text className="text-secondary font-ubuntu-bold">.</Text>Soko marketplace.
          </Text>
        </View>

        <View className="px-6 mt-10">
          
          {/* Contact Form */}
          <View className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl p-6 shadow-sm mb-8">
            <View className="flex-row items-center mb-6">
              <View className="w-10 h-10 rounded-xl bg-primary/5 dark:bg-primary/10 items-center justify-center mr-3">
                <Ionicons name="send" size={20} color="#3b82f6" />
              </View>
              <Text className="text-lg font-ubuntu-bold text-slate-900 dark:text-white uppercase tracking-tight">Send a Message</Text>
            </View>

            <View className="space-y-5">
              <View>
                <Text className="text-[10px] font-ubuntu-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Your Name</Text>
                <TextInput
                  value={form.name}
                  onChangeText={(text) => setForm({ ...form, name: text })}
                  placeholder="John Doe"
                  placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 rounded-xl px-5 py-3.5 text-sm font-ubuntu text-slate-900 dark:text-white"
                />
              </View>

              <View>
                <Text className="text-[10px] font-ubuntu-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Your Email</Text>
                <TextInput
                  value={form.email}
                  onChangeText={(text) => setForm({ ...form, email: text })}
                  placeholder="john@example.com"
                  keyboardType="email-address"
                  placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 rounded-xl px-5 py-3.5 text-sm font-ubuntu text-slate-900 dark:text-white"
                />
              </View>

              <View>
                <Text className="text-[10px] font-ubuntu-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Subject</Text>
                <TextInput
                  value={form.subject}
                  onChangeText={(text) => setForm({ ...form, subject: text })}
                  placeholder="How can we help?"
                  placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 rounded-xl px-5 py-3.5 text-sm font-ubuntu text-slate-900 dark:text-white"
                />
              </View>

              <View>
                <Text className="text-[10px] font-ubuntu-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Message</Text>
                <TextInput
                  value={form.message}
                  onChangeText={(text) => setForm({ ...form, message: text })}
                  placeholder="Describe your inquiry..."
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 rounded-xl px-5 py-4 text-sm font-ubuntu text-slate-900 dark:text-white h-32"
                />
              </View>

              <TouchableOpacity 
                onPress={onSubmit}
                disabled={isSubmitting}
                className={`w-full bg-primary py-4 rounded-xl flex-row items-center justify-center shadow-lg shadow-primary/25 mt-2 ${isSubmitting ? 'opacity-70' : ''}`}
              >
                <Text className="text-white font-ubuntu-bold text-sm uppercase tracking-widest mr-2">
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Text>
                {!isSubmitting && <Ionicons name="send" size={16} color="white" />}
              </TouchableOpacity>
            </View>
          </View>

          {/* Direct Contact Card */}
          <View className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl p-6 shadow-sm mb-6">
            <Text className="font-ubuntu-bold text-slate-900 dark:text-white mb-5 uppercase tracking-tight text-sm">Direct Contact</Text>
            
            <View className="space-y-4">
              <TouchableOpacity onPress={() => Linking.openURL('tel:+254700000000')} className="flex-row items-center p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl">
                <View className="w-9 h-9 bg-primary/5 dark:bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                  <Ionicons name="call" size={16} color="#3b82f6" />
                </View>
                <View>
                  <Text className="text-[10px] font-ubuntu-bold text-slate-500/60 dark:text-slate-400/60 uppercase tracking-widest mb-0.5">Phone</Text>
                  <Text className="text-sm font-ubuntu-bold text-slate-900 dark:text-white">+254 700 000 000</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => Linking.openURL('mailto:support@dotsoko.com')} className="flex-row items-center p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl">
                <View className="w-9 h-9 bg-primary/5 dark:bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                  <Ionicons name="mail" size={16} color="#3b82f6" />
                </View>
                <View>
                  <Text className="text-[10px] font-ubuntu-bold text-slate-500/60 dark:text-slate-400/60 uppercase tracking-widest mb-0.5">Email</Text>
                  <Text className="text-sm font-ubuntu-bold text-slate-900 dark:text-white">support@dotsoko.com</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => Linking.openURL('https://dotsoko.com')} className="flex-row items-center p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl">
                <View className="w-9 h-9 bg-primary/5 dark:bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                  <Ionicons name="globe" size={16} color="#3b82f6" />
                </View>
                <View>
                  <Text className="text-[10px] font-ubuntu-bold text-slate-500/60 dark:text-slate-400/60 uppercase tracking-widest mb-0.5">Web</Text>
                  <Text className="text-sm font-ubuntu-bold text-slate-900 dark:text-white">www.dotsoko.com</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Location Card */}
          <View className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl p-6 shadow-sm mb-6">
            <Text className="font-ubuntu-bold text-slate-900 dark:text-white mb-4 uppercase tracking-tight text-sm">Visit Us</Text>
            <View className="flex-row items-start mb-4">
              <View className="w-9 h-9 bg-primary/5 dark:bg-primary/10 rounded-lg flex items-center justify-center mr-3 mt-1 shrink-0">
                <Ionicons name="location" size={16} color="#3b82f6" />
              </View>
              <Text className="text-sm font-ubuntu-bold text-slate-500 dark:text-slate-400 leading-relaxed flex-1">
                Innovation District, Nairobi, Kenya{"\n"}
                Central Business Complex, Hub 44
              </Text>
            </View>
            <View className="h-48 w-full bg-slate-200 dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-100 dark:border-white/5">
               <WebView
                 source={{ 
                   html: `
                     <!DOCTYPE html>
                     <html>
                       <head>
                         <meta name="viewport" content="width=device-width, initial-scale=1.0">
                         <style>
                           body { margin: 0; padding: 0; background-color: transparent; }
                           iframe { width: 100%; height: 100vh; border: none; }
                         </style>
                       </head>
                       <body>
                         <iframe src="https://www.google.com/maps?q=Nairobi,+Kenya&output=embed" allowfullscreen></iframe>
                       </body>
                     </html>
                   `
                 }}
                 style={{ flex: 1, backgroundColor: 'transparent' }}
                 scrollEnabled={false}
                 bounces={false}
                 showsHorizontalScrollIndicator={false}
                 showsVerticalScrollIndicator={false}
               />
            </View>
          </View>

          {/* Connect with Us */}
          <View className="bg-slate-100/50 dark:bg-slate-800/30 rounded-2xl p-6">
            <Text className="font-ubuntu-bold text-slate-900 dark:text-white text-sm mb-4">Connect with Us</Text>
            <View className="flex-row flex-wrap gap-3">
              <TouchableOpacity className="w-10 h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center shadow-sm">
                <Ionicons name="logo-instagram" size={20} color={isDark ? "#94a3b8" : "#64748b"} />
              </TouchableOpacity>
              <TouchableOpacity className="w-10 h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center shadow-sm">
                <Text className="text-slate-500 dark:text-slate-400 font-bold text-lg leading-none mt-0.5">𝕏</Text>
              </TouchableOpacity>
              <TouchableOpacity className="w-10 h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center shadow-sm">
                <Ionicons name="logo-facebook" size={20} color={isDark ? "#94a3b8" : "#64748b"} />
              </TouchableOpacity>
              <TouchableOpacity className="w-10 h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center shadow-sm">
                <Ionicons name="logo-linkedin" size={20} color={isDark ? "#94a3b8" : "#64748b"} />
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}
