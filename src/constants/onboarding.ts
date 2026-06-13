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
  { id: 'scan', eyebrow: 'Precision AI', title: 'Understand your face', description: 'Turn one clear portrait into a thoughtful, easy-to-read facial analysis.', icon: 'scan-outline', highlights: ['Private upload', 'Fast analysis'] },
  { id: 'personal', eyebrow: 'Made for you', title: 'Personal style guidance', description: 'Get recommendations shaped around your features, not generic beauty rules.', icon: 'sparkles-outline', highlights: ['Actionable tips', 'Personalized results'] },
  { id: 'features', eyebrow: 'Feature studio', title: 'See every detail clearly', description: 'Explore face shape, symmetry, eyes, nose, lips, and apparent age in focused reports.', icon: 'analytics-outline', highlights: ['Visual overlays', 'Animated scores'] },
  { id: 'style', eyebrow: 'Style smarter', title: 'Find your best look', description: 'Discover glasses, beard, grooming, and hairstyle ideas that complement your proportions.', icon: 'glasses-outline', highlights: ['Curated options', 'Easy comparisons'] },
  { id: 'start', eyebrow: 'Your profile, decoded', title: 'Ready for your first scan?', description: 'Create your private profile and start building a personal style history.', icon: 'arrow-forward-circle-outline', highlights: ['Save reports', 'Track progress'] },
] as const;
