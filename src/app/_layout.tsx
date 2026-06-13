import { QueryClient, QueryClientProvider, focusManager, onlineManager } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { AppState, Platform, type AppStateStatus } from 'react-native';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { ToastProvider } from '@/hooks/useToast';
import { analytics } from '@/services/analytics';
import { useAuthStore } from '@/store/authStore';
import { useOnboardingStore } from '@/store/onboardingStore';
import { useThemeStore } from '@/store/themeStore';
import { useResolvedTheme } from '@/hooks/useAppTheme';

void SplashScreen.preventAutoHideAsync();

function onAppStateChange(status: AppStateStatus): void {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
}

export default function RootLayout() {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 2,
            staleTime: 60_000,
            gcTime: 10 * 60_000,
            refetchOnReconnect: true,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 0,
          },
        },
      }),
  );
  const hydrate = useAuthStore((state) => state.hydrate);
  const hydrateOnboarding = useOnboardingStore((state) => state.hydrate);
  const hydrateTheme = useThemeStore((state) => state.hydrate);
  const authReady = useAuthStore((state) => state.isHydrated);
  const onboardingReady = useOnboardingStore((state) => state.hydrated);
  const themeReady = useThemeStore((state) => state.hydrated);
  const resolvedTheme = useResolvedTheme();

  useEffect(() => {
    void Promise.all([hydrate(), hydrateOnboarding(), hydrateTheme()]);
    analytics.track('app_opened');
    onlineManager.setOnline(true);
    const subscription = AppState.addEventListener('change', onAppStateChange);
    return () => subscription.remove();
  }, [hydrate, hydrateOnboarding, hydrateTheme]);

  useEffect(() => { if (authReady && onboardingReady && themeReady) void SplashScreen.hideAsync(); }, [authReady, onboardingReady, themeReady]);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={client}>
        <ToastProvider>
          <StatusBar style={resolvedTheme === 'dark' ? 'light' : 'dark'} />
          <Stack screenOptions={{ headerShown: false, animation: 'fade_from_bottom' }} />
        </ToastProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
