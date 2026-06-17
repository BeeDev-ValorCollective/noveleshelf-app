// store/authStore.js
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getProfileForRole, toTitleCase } from '../utils/roleHelpers';

const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
  currentRole: null,
  currentRoleDisplay: null,
  currentProfile: null,

  setAuth: async (user, accessToken, refreshToken) => {
    const role = user.default_login_role;
    const profile = getProfileForRole(user, role);

    await AsyncStorage.setItem('access_token', accessToken);
    await AsyncStorage.setItem('refresh_token', refreshToken);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    await AsyncStorage.setItem('current_role', role);

    set({
      user,
      accessToken,
      refreshToken,
      isAuthenticated: true,
      isLoading: false,
      currentRole: role,
      currentRoleDisplay: toTitleCase(role),
      currentProfile: profile,
    });
  },

  updateUser: (user) => {
    const role = get().currentRole || user.default_login_role;
    const profile = getProfileForRole(user, role);

    AsyncStorage.setItem('user', JSON.stringify(user));
    AsyncStorage.setItem('current_role', role);

    set({
      user,
      currentRole: role,
      currentRoleDisplay: toTitleCase(role),
      currentProfile: profile,
    });
  },

  updateAccessToken: async (accessToken) => {
    await AsyncStorage.setItem('access_token', accessToken);
    set({ accessToken });
  },

  setCurrentRole: async (role) => {
    const user = get().user;
    const profile = getProfileForRole(user, role);

    await AsyncStorage.setItem('current_role', role);

    set({
      currentRole: role,
      currentRoleDisplay: toTitleCase(role),
      currentProfile: profile,
    });
  },

  clearAuth: async () => {
    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('refresh_token');
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('current_role');
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      currentRole: null,
      currentRoleDisplay: null,
      currentProfile: null,
    });
  },

  setAuthReady: () => set({ isLoading: false }),
}));

export default useAuthStore;