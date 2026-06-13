import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import type { ThemeMode } from '@/constants/theme';

const themeKey = 'faceshap_theme_mode_v2';

interface ThemeState {
  mode: ThemeMode;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  setMode: (mode: ThemeMode) => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set) => ({
  mode: 'dark',
  hydrated: false,
  hydrate: async () => {
    const stored = await SecureStore.getItemAsync(themeKey);
    const mode: ThemeMode = stored === 'light' || stored === 'dark' ? stored : 'dark';
    set({ mode, hydrated: true });
  },
  setMode: async (mode) => {
    await SecureStore.setItemAsync(themeKey, mode);
    set({ mode });
  },
}));
