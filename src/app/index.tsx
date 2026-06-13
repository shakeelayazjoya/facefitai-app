import { Redirect, type Href } from 'expo-router';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { useOnboardingStore } from '@/store/onboardingStore';

export default function Index() {
  const onboarded = useOnboardingStore((state) => state.completed); const onboardingReady = useOnboardingStore((state) => state.hydrated);
  if (!onboardingReady) return <ScreenWrapper centered><LoadingSpinner label="Preparing your studio" /></ScreenWrapper>;
  if (!onboarded) return <Redirect href={'/onboarding' as Href} />;
  return <Redirect href="/(tabs)" />;
}
