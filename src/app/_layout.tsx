import { QueryClient, QueryClientProvider, focusManager, onlineManager } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { AppState, Platform, type AppStateStatus } from 'react-native';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { ToastProvider } from '@/hooks/useToast';
import { analytics } from '@/services/analytics';
import { useAuthStore } from '@/store/authStore';

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

  useEffect(() => {
    void hydrate();
    analytics.track('app_opened');
    onlineManager.setOnline(true);
    const subscription = AppState.addEventListener('change', onAppStateChange);
    return () => subscription.remove();
  }, [hydrate]);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={client}>
        <ToastProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </ToastProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
