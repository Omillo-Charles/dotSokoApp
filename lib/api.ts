import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

let apiUrl = process.env.EXPO_PUBLIC_API_URL || "http://localhost:5500/api/v1";

// Handle Android Emulator localhost (10.0.2.2)
if (Platform.OS === 'android' && apiUrl.includes('localhost')) {
  apiUrl = apiUrl.replace('localhost', '10.0.2.2');
}

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

// Response interceptor for handling errors globally
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    // Handle network errors or timeouts with basic retry
    const isNetworkError = !error.response || error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK';
    if (isNetworkError && config && !config._isRetry) {
      config._isRetry = true;
      config._retryCount = (config._retryCount || 0) + 1;

      if (config._retryCount <= 2) { // 2 retries for mobile
        const delay = config._retryCount * 2000;
        await new Promise(resolve => setTimeout(resolve, delay));
        return api(config);
      }
    }

    // Handle global errors like 401 Unauthorized
    if (error.response?.status === 401) {
      // Logic for session expiration can be added here
      // e.g., clear tokens and navigate to login
      console.warn('[API] 401 Unauthorized detected.');
    }
    
    // Standardized error message extraction
    const backendMessage = error.response?.data?.message;
    const backendErrors = error.response?.data?.errors;
    
    error.friendlyMessage = backendMessage || error.message || "An unexpected error occurred";
    error.backendErrors = backendErrors;

    return Promise.reject(error);
  }
);

export default api;
