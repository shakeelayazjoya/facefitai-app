import { QueryClient, QueryClientProvider, focusManager, onlineManager } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { CormorantGaramond_600SemiBold } from '@expo-google-fonts/cormorant-garamond/600SemiBold';
import { CormorantGaramond_700Bold } from '@expo-google-fonts/cormorant-garamond/700Bold';
import { useFonts } from 'expo-font';
import { AppState, Platform, type AppStateStatus } from 'react-native';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { ToastProvider } from '@/hooks/useToast';
import { SessionModalProvider, useSessionModal } from '@/hooks/useSessionModal';
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

function SessionWatcher() {
  const sessionExpired = useAuthStore((state) => state.sessionExpired);
  const acknowledge = useAuthStore((state) => state.acknowledgeSessionExpired);
  const { showSessionExpired } = useSessionModal();

  useEffect(() => {
    if (!sessionExpired) return;
    showSessionExpired();
    acknowledge();
  }, [acknowledge, sessionExpired, showSessionExpired]);

  return null;
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
  const [fontsLoaded] = useFonts({ CormorantGaramond_600SemiBold, CormorantGaramond_700Bold });

  useEffect(() => {
    void Promise.all([hydrate(), hydrateOnboarding(), hydrateTheme()]);
    analytics.track('app_opened');
    onlineManager.setOnline(true);
    const subscription = AppState.addEventListener('change', onAppStateChange);
    return () => subscription.remove();
  }, [hydrate, hydrateOnboarding, hydrateTheme]);

  useEffect(() => { if (authReady && onboardingReady && themeReady && fontsLoaded) void SplashScreen.hideAsync(); }, [authReady, onboardingReady, themeReady, fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <ErrorBoundary>
      <QueryClientProvider client={client}>
        <ToastProvider>
          <SessionModalProvider>
            <StatusBar style={resolvedTheme === 'dark' ? 'light' : 'dark'} />
            <SessionWatcher />
            <Stack screenOptions={{ headerShown: false, animation: 'fade_from_bottom' }} />
          </SessionModalProvider>
        </ToastProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
