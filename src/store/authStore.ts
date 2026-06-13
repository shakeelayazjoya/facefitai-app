import { create } from 'zustand';
import { analytics } from '@/services/analytics';
import { setUnauthorizedHandler } from '@/services/apiClient';
import { tokenStorage } from '@/services/tokenStorage';
import type { AuthResponse, AuthUser } from '@/types/api';

interface AuthState {
  user: AuthUser | null;
  isHydrated: boolean;
  setSession: (response: AuthResponse) => Promise<void>;
  hydrate: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isHydrated: false,
  setSession: async (response) => {
    await tokenStorage.setAccessToken(response.access_token);
    if (response.refresh_token) await tokenStorage.setRefreshToken(response.refresh_token);
    await tokenStorage.setUser(JSON.stringify(response.user));
    analytics.track('login_success', { user_id: response.user.id, plan: response.user.plan });
    set({ user: response.user, isHydrated: true });
  },
  hydrate: async () => {
    const rawUser = await tokenStorage.getUser();
    if (!rawUser) {
      set({ isHydrated: true });
      return;
    }
    try {
      set({ user: JSON.parse(rawUser) as AuthUser, isHydrated: true });
    } catch {
      await tokenStorage.clear();
      set({ user: null, isHydrated: true });
    }
  },
  logout: async () => {
    await tokenStorage.clear();
    analytics.track('logout');
    set({ user: null, isHydrated: true });
  },
}));

setUnauthorizedHandler(async () => {
  await useAuthStore.getState().logout();
});
