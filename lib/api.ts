import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiUrl = process.env.EXPO_PUBLIC_API_URL || "http://localhost:5500/api/v1";

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
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('[API] Error reading token from AsyncStorage:', error);
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

    // Handle network errors or timeouts with exponential backoff retry
    const isNetworkError = !error.response || error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK';
    if (isNetworkError && config && !config._isRetry) {
      config._isRetry = true;
      config._retryCount = (config._retryCount || 0) + 1;

      if (config._retryCount <= 3) {
        const delay = config._retryCount * 1500; // 1.5s, 3s, 4.5s
        console.warn(`[API] Network error. Retry attempt ${config._retryCount} in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return api(config);
      }
    }

    // Handle global errors like 401 Unauthorized
    if (error.response?.status === 401) {
      console.warn('[API] 401 Unauthorized detected. Clearing session.');
      try {
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('user');
      } catch (e) {
        console.error('[API] Error clearing session from AsyncStorage:', e);
      }
      // Note: Navigation to login should be handled by an Auth Provider/Consumer in the UI layer
    }
    
    // Standardized error message extraction from backend response
    const backendMessage = error.response?.data?.message;
    const backendErrors = error.response?.data?.errors;
    
    // Attach friendly message and structured errors to the error object
    // @ts-ignore - custom properties on error object
    error.friendlyMessage = backendMessage || error.message || "An unexpected error occurred";
    // @ts-ignore
    error.backendErrors = backendErrors;

    return Promise.reject(error);
  }
);

export default api;
