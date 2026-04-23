// store/authStore.js
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,

  setAuth: async (user, accessToken, refreshToken) => {
    await AsyncStorage.setItem('access_token', accessToken);
    await AsyncStorage.setItem('refresh_token', refreshToken);
    set({ 
      user, 
      accessToken, 
      refreshToken, 
      isAuthenticated: true 
    });
  },

  updateUser: (user) => {
    set({ user });
  },

  updateAccessToken: async (accessToken) => {
    await AsyncStorage.setItem('access_token', accessToken);
    set({ accessToken });
  },

  clearAuth: async () => {
    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('refresh_token');
    set({ 
      user: null, 
      accessToken: null, 
      refreshToken: null, 
      isAuthenticated: false 
    });
  },
}));

export default useAuthStore;