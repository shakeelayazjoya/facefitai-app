import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

const completionKey = 'faceshap_onboarding_complete';

interface OnboardingState {
  completed: boolean;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  complete: () => Promise<void>;
  reset: () => Promise<void>;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  completed: false,
  hydrated: false,
  hydrate: async () => {
    const stored = await SecureStore.getItemAsync(completionKey);
    set({ completed: stored === 'true', hydrated: true });
  },
  complete: async () => {
    await SecureStore.setItemAsync(completionKey, 'true');
    set({ completed: true, hydrated: true });
  },
  reset: async () => {
    await SecureStore.deleteItemAsync(completionKey);
    set({ completed: false, hydrated: true });
  },
}));
