import type { ThemeMode } from '@/constants/theme';
import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

const themeKey = 'faceshap_theme_mode_v2';

interface ThemeState {
  mode: ThemeMode;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  setMode: (mode: ThemeMode) => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set) => ({
  mode: 'light',
  hydrated: false,
  hydrate: async () => {
    const stored = await SecureStore.getItemAsync(themeKey);
    const mode: ThemeMode = stored === 'light' || stored === 'dark' ? stored : 'light';
    set({ mode, hydrated: true });
  },
  setMode: async (mode) => {
    await SecureStore.setItemAsync(themeKey, mode);
    set({ mode });
  },
}));
