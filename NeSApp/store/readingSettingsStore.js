// store/readingSettingsStore.js
import { create } from 'zustand';
import { ENDPOINTS } from '../utils/api';
import useAuthStore from './authStore';

export const THEMES = {
  light: { background: '#FFFFFF', text: '#0d0f1a' },
  dark: { background: '#0d0f1a', text: '#ffffff' },
  sepia: { background: '#f7eac9', text: '#0d0f1a' },
  amoled: { background: '#000000', text: '#C8C8C8' },
};

const syncAuthStoreProfile = (patch) => {
  const authState = useAuthStore.getState();
  const currentUser = authState.user;

  if (!currentUser?.profile) {
    return;
  }

  authState.updateUser({
    ...currentUser,
    profile: {
      ...currentUser.profile,
      ...patch,
    },
  });
};

const useReadingSettingsStore = create((set, get) => ({
  theme: 'dark',
  fontSize: 18,
  hydrated: false,

  hydrateFromProfile: (profile) => {
    if (get().hydrated || !profile) {
      return;
    }

    set({
      theme: profile.reading_theme || 'dark',
      fontSize: profile.reading_font_size || 18,
      hydrated: true,
    });
  },

  getThemeColors: () => THEMES[get().theme] || THEMES.dark,

  setTheme: async (theme, accessToken) => {
    const previous = get().theme;
    set({ theme });

    try {
      const response = await fetch(ENDPOINTS.auth.readingPreferencesUpdate, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reading_theme: theme }),
      });

      if (!response.ok) {
        throw new Error('Reading theme update failed');
      }

      syncAuthStoreProfile({ reading_theme: theme });
    } catch (error) {
      console.error('Reading theme update error:', error);
      set({ theme: previous });
    }
  },

  setFontSize: async (fontSize, accessToken) => {
    const previous = get().fontSize;
    set({ fontSize });

    try {
      const response = await fetch(ENDPOINTS.auth.readingPreferencesUpdate, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reading_font_size: fontSize }),
      });

      if (!response.ok) {
        throw new Error('Font size update failed');
      }

      syncAuthStoreProfile({ reading_font_size: fontSize });
    } catch (error) {
      console.error('Font size update error:', error);
      set({ fontSize: previous });
    }
  },
}));

export default useReadingSettingsStore;