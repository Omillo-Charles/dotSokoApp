import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const apiUrl = process.env.EXPO_PUBLIC_API_URL || "http://localhost:5500/api/v1";

// More robust cross-platform storage with fail-safe fallback
const getStorageItem = async (key: string) => {
  try {
    // 1. Try Native AsyncStorage first (if not web)
    if (Platform.OS !== 'web') {
      const item = await AsyncStorage.getItem(key);
      return item;
    }
  } catch (e) {
    console.warn('[API] Native AsyncStorage unavailable, falling back to web storage');
  }

  // 2. Fallback to localStorage for Web or when Native fails
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
};

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await getStorageItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('[API] Error reading token from storage:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
