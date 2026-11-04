
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

    await AsyncStorage.multiSet([
      ['access_token', accessToken],
      ['refresh_token', refreshToken || ''],
      ['user', JSON.stringify(user)],
      ['current_role', role],
    ]);

    set({
      user,
      accessToken,
      refreshToken: refreshToken || null,
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

  updateTokens: async (accessToken, refreshToken) => {
    const newRefreshToken =
      refreshToken || get().refreshToken;

    await AsyncStorage.multiSet([
      ['access_token', accessToken],
      ['refresh_token', newRefreshToken || ''],
    ]);

    set({
      accessToken,
      refreshToken: newRefreshToken,
    });
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
    // Clear in-memory state immediately, so protected
    // screens stop treating this session as authenticated.
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

    await AsyncStorage.multiRemove([
      'access_token',
      'refresh_token',
      'user',
      'current_role',
    ]);
  },

  setAuthReady: () => set({ isLoading: false }),
}));

export default useAuthStore;
