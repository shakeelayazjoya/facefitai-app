import type { ComponentProps } from 'react';
import type { Ionicons } from '@expo/vector-icons';

export interface OnboardingItem {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  highlights: readonly string[];
}

export const onboardingItems: readonly OnboardingItem[] = [
  { id: 'scan', eyebrow: 'Precision AI', title: 'Know your face', description: 'One selfie. Clear insights.', icon: 'scan-outline', highlights: ['Private', 'Fast'] },
  { id: 'personal', eyebrow: 'Personal', title: 'Style that fits', description: 'Guidance built around you.', icon: 'sparkles-outline', highlights: ['Useful tips', 'Your results'] },
  { id: 'features', eyebrow: 'Details', title: 'See every feature', description: 'Shape, eyes, nose, lips, age.', icon: 'analytics-outline', highlights: ['Overlays', 'Scores'] },
  { id: 'style', eyebrow: 'Discover', title: 'Find your look', description: 'Hair, beard, and glasses.', icon: 'glasses-outline', highlights: ['Curated', 'Simple'] },
  { id: 'start', eyebrow: 'Ready', title: 'Start your scan', description: 'Upload. Analyze. Discover.', icon: 'arrow-forward-circle-outline', highlights: ['Save', 'Compare'] },
] as const;
